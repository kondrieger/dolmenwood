/* Генератор персонажа Dolmenwood.
   Каждый шаг возвращает описание с бросками для анимации кубиков и итогом.
   Все броски пишутся в журнал (log) — его видит гейм-мастер при проверке. */
(function () {
  'use strict';

  var ABIL = ['STR', 'INT', 'WIS', 'DEX', 'CON', 'CHA'];
  var ABIL_RU = {
    STR: 'Сила', INT: 'Интеллект', WIS: 'Мудрость',
    DEX: 'Ловкость', CON: 'Телосложение', CHA: 'Харизма'
  };
  var ABIL_EN = {
    STR: 'Strength', INT: 'Intelligence', WIS: 'Wisdom',
    DEX: 'Dexterity', CON: 'Constitution', CHA: 'Charisma'
  };

  function abilityMod(score) {
    if (score <= 3) return -3;
    if (score <= 5) return -2;
    if (score <= 8) return -1;
    if (score <= 12) return 0;
    if (score <= 15) return 1;
    if (score <= 17) return 2;
    return 3;
  }
  function primeXpMod(score) {
    if (score <= 5) return -20;
    if (score <= 8) return -10;
    if (score <= 12) return 0;
    if (score <= 15) return 5;
    return 10;
  }
  function fmtMod(m) { return (m >= 0 ? '+' : '') + m; }

  /* ================= построение профиля класса ================= */
  /* Возвращает единый объект «профиль» независимо от того, обычный это класс или род-класс. */
  function buildProfile(opts) {
    var kin = DW.KINDREDS[opts.kindred];
    if (opts.mode === 'kindredclass') {
      var kc = kin.kindredClass;
      return {
        mode: 'kindredclass',
        id: kin.id + '_kc',
        ru: kc.ru, en: kc.en,
        primeAbilities: kc.primeAbilities, primeRu: kc.primeRu,
        hitDie: kc.hitDie, hpAfter10: kc.hpAfter10,
        aptitude: kc.aptitude, aptitudeRu: kc.aptitudeRu,
        armour: kc.armour, weapons: kc.weapons,
        armourAllowed: kc.armourAllowed, shields: kc.shields, weaponSizes: kc.weaponSizes,
        startArmour: kc.startArmour, startWeapons: kc.startWeapons, classItems: kc.classItems || [],
        traits: kc.traits, skills: kc.skills || [], advancement: kc.advancement,
        grantsGlamours: kc.grantsGlamours || 0,
        grantsLesserRune: !!kc.grantsLesserRune,
        grantsKnack: !!kc.grantsKnack,
        grantsSymbiotic: !!kc.grantsSymbiotic,
        grantsSpellBook: false,
        magicType: null,
        bonusLanguages: [],
        acBonusByLevel: null,
        page: kin.kcPage,
        desc: kc.desc
      };
    }
    var c = DW.CLASSES[opts.cls];
    return {
      mode: 'class',
      id: c.id, ru: c.ru, en: c.en,
      primeAbilities: c.primeAbilities, primeRu: c.primeRu,
      hitDie: c.hitDie, hpAfter10: c.hpAfter10,
      aptitude: c.aptitude, aptitudeRu: c.aptitudeRu,
      armour: c.armour, weapons: c.weapons,
      armourAllowed: c.armourAllowed, shields: c.shields, weaponSizes: c.weaponSizes,
      startArmour: c.startArmour, startWeapons: c.startWeapons, classItems: c.classItems || [],
      traits: c.traits, skills: c.skills || [], advancement: c.advancement,
      grantsGlamours: c.grantsGlamours || 0,
      grantsLesserRune: !!c.grantsLesserRune,
      grantsKnack: false, grantsSymbiotic: false,
      grantsSpellBook: !!c.grantsSpellBook,
      magicType: c.magicType || null,
      spellsPerDay: c.spellsPerDay || null,
      bonusLanguages: c.bonusLanguages || [],
      acBonusByLevel: c.acBonusByLevel || null,
      lieges: c.lieges || null,
      needsLiege: !!c.needsLiege,
      noChaotic: !!c.noChaotic,
      combatTalents: c.combatTalents || null,
      talentsByLevel: c.talentsByLevel || null,
      page: c.page,
      desc: c.desc
    };
  }

  /* ================= допустимость сочетаний ================= */
  function classAllowedFor(kindredId, classId) {
    var kin = DW.KINDREDS[kindredId];
    var c = DW.CLASSES[classId];
    if (!kin || !c) return { ok: false, why: 'Неизвестное сочетание' };
    if (c.mortalsOnly && kin.type !== 'mortal') {
      return { ok: false, why: 'Только смертные обучаются этому классу — у фей и полуфейских нет духовной связи с божествами смертных (стр. 18).' };
    }
    return { ok: true };
  }

  /* ================= генерация ================= */

  function generate(opts) {
    var log = new DW.dice.RollLog();
    var kin = DW.KINDREDS[opts.kindred];
    var prof = buildProfile(opts);
    var steps = [];
    var ch = {
      schema: 'dolmenwood-character/1',
      generatedAt: new Date().toISOString(),
      id: 'dw_' + Date.now().toString(36) + '_' + Math.floor(Math.random() * 1e6).toString(36),
      source: "Dolmenwood Player's Book (Necrotic Gnome, 6 Aug 2024)",
      options: {
        mode: opts.mode,
        abilityMethod: opts.abilityMethod || '3d6-in-order',
        moonSignRule: opts.moonSign !== false,
        gender: opts.gender || 'any'
      },
      level: 1,
      xp: 0,
      status: 'alive'
    };

    /* --- Шаг 1. Характеристики --- */
    var method = opts.abilityMethod || '3d6-in-order';
    var scores = {}, abilityRolls = [];
    ABIL.forEach(function (a) {
      var r;
      if (method === '4d6-drop-lowest') {
        r = DW.dice.roll(4, 6);
        var sorted = r.dice.slice().sort(function (x, y) { return x - y; });
        var dropped = sorted[0];
        var total = sorted[1] + sorted[2] + sorted[3];
        log.record('abilities', ABIL_RU[a] + ' (' + ABIL_EN[a] + ')', r, { result: total + ' (отброшена ' + dropped + ')', dropped: dropped, value: total });
        scores[a] = total;
        abilityRolls.push({ ab: a, dice: r.dice, total: total });
      } else {
        r = DW.dice.roll(3, 6);
        log.record('abilities', ABIL_RU[a] + ' (' + ABIL_EN[a] + ')', r, { result: String(r.total), value: r.total });
        scores[a] = r.total;
        abilityRolls.push({ ab: a, dice: r.dice, total: r.total });
      }
    });
    ch.abilities = scores;
    ch.abilitiesRolled = JSON.parse(JSON.stringify(scores));

    /* Проверка «неудачного» персонажа (необязательное правило, стр. 18) */
    var allLow = ABIL.every(function (a) { return scores[a] <= 8; });
    var lowCount = ABIL.filter(function (a) { return scores[a] <= 6; }).length;
    ch.subPar = allLow || lowCount > 1;

    steps.push({
      id: 'abilities',
      title: 'Шаг 1. Бросок характеристик',
      subtitle: method === '4d6-drop-lowest' ? '4d6, отбросить худшую, по порядку' : '3d6 по порядку, без перестановок (стр. 18)',
      dice: abilityRolls.map(function (r) {
        return { sides: 6, results: r.dice, label: ABIL_RU[r.ab], value: r.total };
      }),
      lines: ABIL.map(function (a) {
        return ABIL_RU[a] + ' ' + scores[a] + ' (модификатор ' + fmtMod(abilityMod(scores[a])) + ')';
      }),
      warn: ch.subPar ? 'По необязательному правилу «Слабый персонаж» (стр. 18) такого персонажа можно выбросить и начать заново.' : null
    });

    /* --- Шаг 2–3. Род и класс --- */
    ch.kindred = { id: kin.id, ru: kin.ru, en: kin.en, type: kin.type, typeRu: kin.typeRu, size: kin.size, sizeRu: kin.sizeRu, page: kin.page };
    ch.profile = {
      mode: prof.mode, id: prof.id, ru: prof.ru, en: prof.en,
      primeAbilities: prof.primeAbilities, primeRu: prof.primeRu,
      hitDie: prof.hitDie, aptitude: prof.aptitude, aptitudeRu: prof.aptitudeRu,
      armour: prof.armour, weapons: prof.weapons, page: prof.page
    };
    log.note('kindred', 'Род', kin.ru + ' (' + kin.en + ') — выбран игроком');
    log.note('class', prof.mode === 'kindredclass' ? 'Род-класс' : 'Класс', prof.ru + ' (' + prof.en + ') — выбран игроком');
    steps.push({
      id: 'kindred',
      title: 'Шаг 2–3. Род и ' + (prof.mode === 'kindredclass' ? 'род-класс' : 'класс'),
      subtitle: 'Выбор игрока — броски не требуются',
      dice: [],
      lines: [
        kin.ru + ' (' + kin.en + ') — ' + kin.typeRu + ', размер ' + kin.sizeRu,
        prof.ru + ' (' + prof.en + ') — ' + prof.aptitudeRu + ' подготовка, хиты ' + prof.hitDie,
        'Главные характеристики: ' + prof.primeRu
      ]
    });

    /* --- Шаг 5. Модификаторы --- */
    var mods = {};
    ABIL.forEach(function (a) { mods[a] = abilityMod(scores[a]); });
    ch.mods = mods;

    /* Модификатор опыта */
    var primeScores = prof.primeAbilities.map(function (a) { return scores[a]; });
    var lowestPrime = Math.min.apply(null, primeScores);
    var xpMod = primeXpMod(lowestPrime);
    var humanBonus = (kin.id === 'human' && prof.mode === 'class') ? 10 : 0;
    ch.xpModifier = xpMod + humanBonus;
    ch.xpModifierBreakdown = {
      prime: xpMod, primeAbility: prof.primeRu, lowestPrimeScore: lowestPrime,
      kindred: humanBonus, total: xpMod + humanBonus
    };

    /* Сопротивление магии */
    var magicRes = mods.WIS;
    if (prof.mode === 'class' && (kin.id === 'elf' || kin.id === 'grimalkin')) magicRes += 2;
    ch.magicResistance = magicRes;

    steps.push({
      id: 'mods',
      title: 'Шаг 5. Модификаторы характеристик',
      subtitle: 'Вычисляется по таблице (стр. 22) — броски не нужны',
      dice: [],
      lines: ABIL.map(function (a) { return ABIL_RU[a] + ' ' + scores[a] + ' → ' + fmtMod(mods[a]); })
        .concat([
          'Модификатор опыта: ' + fmtMod(ch.xpModifier) + '% (главная характеристика ' + lowestPrime + ' → ' + fmtMod(xpMod) + '%' + (humanBonus ? ', человек +10%' : '') + ')',
          'Сопротивление магии: ' + fmtMod(magicRes)
        ])
    });

    /* --- Шаг 6. Черты, атака, спасброски, навыки, языки --- */
    var adv = prof.advancement[0];
    ch.attack = adv[3];
    ch.saves = { doom: adv[4], ray: adv[5], hold: adv[6], blast: adv[7], spell: adv[8] };
    ch.xpForNextLevel = prof.advancement[1][1];

    /* Навыки */
    var skillTargets = { listen: 6, search: 6, survival: 6 };
    var skillNotes = [];
    if (prof.mode === 'class') {
      if (kin.id === 'elf') { skillTargets.listen = 5; skillTargets.search = 5; }
      if (kin.id === 'grimalkin' || kin.id === 'woodgrue') { skillTargets.listen = 5; }
      if (kin.id === 'mossling') { skillTargets.survivalForaging = 5; }
    } else {
      if (kin.id === 'elf') { skillTargets.listen = 5; skillTargets.search = 5; }
      if (kin.id === 'grimalkin' || kin.id === 'woodgrue') { skillTargets.listen = 5; }
      if (kin.id === 'mossling') { skillTargets.survivalForaging = 5; }
    }
    if (prof.id === 'friar') skillTargets.survivalForaging = 5;
    var classSkills = [];
    (prof.skills || []).forEach(function (s) {
      var t = s.targets[0];
      classSkills.push({ ru: s.ru, en: s.en, target: t, d: s.d || '' });
      if (s.key === 'listen') skillTargets.listen = Math.min(skillTargets.listen, t);
      if (s.key === 'search') skillTargets.search = Math.min(skillTargets.search, t);
      if (s.key === 'survival') skillTargets.survival = Math.min(skillTargets.survival, t);
    });
    ch.skills = { basic: skillTargets, class: classSkills };

    /* Языки */
    var langs = kin.languages.slice();
    (prof.bonusLanguages || []).forEach(function (l) { langs.push(l); });
    var extraLangCount = mods.INT > 0 ? mods.INT : 0;
    var extraLangDice = [];
    var isFey = (kin.type === 'fairy' || kin.type === 'demi-fey');
    for (var li = 0; li < extraLangCount; li++) {
      var tries = 0, picked = null;
      while (tries < 30) {
        var lr = DW.dice.roll(1, 6);
        var found = null;
        for (var q = 0; q < DW.COMMON_LANGUAGES.length; q++) {
          var L = DW.COMMON_LANGUAGES[q];
          if (lr.total >= L.r[0] && lr.total <= L.r[1]) { found = L; break; }
        }
        var dup = langs.some(function (x) { return x.en === found.en; });
        var forbidden = isFey && found.en === 'Liturgic';
        log.record('languages', 'Дополнительный язык (за высокий Интеллект)', lr,
          { result: found.ru + (dup ? ' — уже известен, перебрасываем' : (forbidden ? ' — недоступен феям, перебрасываем' : '')) });
        extraLangDice.push({ sides: 6, results: lr.dice, label: 'язык', value: lr.total });
        if (!dup && !forbidden) { picked = found; break; }
        tries++;
      }
      if (picked) langs.push({ ru: picked.ru, en: picked.en });
    }
    ch.languages = langs;

    var traitLines = [];
    if (prof.mode === 'class') {
      kin.traits.forEach(function (t) { traitLines.push('Род: ' + t.ru + ' (' + t.en + ')'); });
    }
    prof.traits.forEach(function (t) { traitLines.push((prof.mode === 'kindredclass' ? '' : 'Класс: ') + t.ru + ' (' + t.en + ')'); });
    ch.traits = {
      kindred: prof.mode === 'class' ? kin.traits : [],
      class: prof.traits
    };

    steps.push({
      id: 'traits',
      title: 'Шаг 6. Черты, атака, спасброски и языки',
      subtitle: 'Атака и спасброски — по таблице развития. Языки за высокий Интеллект — d6 (стр. 26)',
      dice: extraLangDice,
      lines: [
        'Атака: ' + fmtMod(ch.attack),
        'Спасброски — Рок ' + ch.saves.doom + ', Луч ' + ch.saves.ray + ', Захват ' + ch.saves.hold + ', Взрыв ' + ch.saves.blast + ', Заклинание ' + ch.saves.spell,
        'Навыки: Слушать ' + skillTargets.listen + ', Обыскивать ' + skillTargets.search + ', Выживание ' + skillTargets.survival +
          (skillTargets.survivalForaging ? ' (собирательство ' + skillTargets.survivalForaging + ')' : '')
      ].concat(classSkills.map(function (s) { return 'Навык класса: ' + s.ru + ' — цель ' + s.target; }))
        .concat(['Языки: ' + langs.map(function (l) { return l.ru; }).join(', ')])
        .concat(traitLines)
    });

    /* --- Шаг 6б. Магия и особые дары --- */
    var magicDice = [], magicLines = [];
    ch.magic = {};

    /* Гламуры: от рода (эльф/гримолкин в схеме род+класс) + от класса/род-класса */
    var glamourCount = 0;
    if (prof.mode === 'class' && (kin.id === 'elf' || kin.id === 'grimalkin')) glamourCount += 1;
    glamourCount += prof.grantsGlamours || 0;
    if (glamourCount > 0) {
      ch.magic.glamours = [];
      for (var gi = 0; gi < glamourCount; gi++) {
        var gtries = 0, gpick = null;
        while (gtries < 40) {
          var gr = DW.dice.roll(1, 20);
          var cand = DW.GLAMOURS[gr.total - 1];
          var gdup = ch.magic.glamours.some(function (x) { return x.en === cand.en; });
          log.record('glamours', 'Гламур (d20, стр. 93)', gr, { result: cand.ru + (gdup ? ' — уже есть, перебрасываем' : '') });
          magicDice.push({ sides: 20, results: gr.dice, label: 'гламур', value: gr.total });
          if (!gdup) { gpick = cand; break; }
          gtries++;
        }
        if (gpick) ch.magic.glamours.push(gpick);
      }
      ch.magic.glamours.forEach(function (g) { magicLines.push('Гламур: ' + g.ru + ' (' + g.en + ')'); });
    }

    /* Малая руна фей */
    if (prof.grantsLesserRune) {
      var rr = DW.dice.roll(1, 6);
      var rune = DW.LESSER_RUNES[rr.total - 1];
      log.record('runes', 'Малая руна фей (d6, стр. 93)', rr, { result: rune.ru });
      magicDice.push({ sides: 6, results: rr.dice, label: 'руна', value: rr.total });
      ch.magic.lesserRunes = [rune];
      magicLines.push('Малая руна: ' + rune.ru + ' (' + rune.en + ') — раз в день');
    }

    /* Сноровка моцлинга */
    var wantsKnack = prof.grantsKnack || (prof.mode === 'class' && kin.id === 'mossling');
    if (wantsKnack) {
      var kr = DW.dice.roll(1, 6);
      var knack = DW.KNACKS[kr.total - 1];
      log.record('knack', 'Сноровка моцлинга (d6, стр. 112)', kr, { result: knack.ru });
      magicDice.push({ sides: 6, results: kr.dice, label: 'сноровка', value: kr.total });
      ch.magic.knack = knack;
      magicLines.push('Сноровка: ' + knack.ru + ' (' + knack.en + ') — на 1 уровне: ' + knack.levels[0].ru);
    }

    /* Симбиотическая плоть моцлинга */
    var wantsSymb = prof.grantsSymbiotic || (prof.mode === 'class' && kin.id === 'mossling');
    if (wantsSymb) {
      var sr = DW.dice.roll(1, 20);
      var symb = kin.symbioticFlesh[sr.total - 1];
      log.record('symbiotic', 'Симбиотическая плоть (d20, стр. 49)', sr, { result: symb.ru });
      magicDice.push({ sides: 20, results: sr.dice, label: 'симбиоз', value: sr.total });
      ch.magic.symbioticFlesh = [symb];
      magicLines.push('Симбиотическая плоть: ' + symb.ru);
    }

    /* Книга заклинаний мага */
    if (prof.grantsSpellBook) {
      var br = DW.dice.roll(1, 6);
      var book = DW.SPELL_BOOKS[br.total - 1];
      log.record('spellbook', 'Стартовая книга заклинаний (d6, стр. 72)', br, { result: book.ru });
      magicDice.push({ sides: 6, results: br.dice, label: 'книга', value: br.total });
      ch.magic.spellBook = {
        ru: book.ru, en: book.en,
        spells: book.spells.map(function (id) {
          var s = DW.ARCANE_R1[id];
          return { id: id, ru: s.ru, en: s.en, rank: 1, dur: s.dur, range: s.range, d: s.d };
        })
      };
      ch.magic.spellsPerDay = prof.spellsPerDay[0];
      magicLines.push('Книга заклинаний: «' + book.ru + '» — ' + ch.magic.spellBook.spells.map(function (s) { return s.ru; }).join(', '));
      magicLines.push('Заклинаний в день на 1 уровне: 1 (ранг 1). Заучивается любое ОДНО из книги.');
    }

    /* Святая магия */
    if (prof.magicType === 'holy') {
      ch.magic.spellsPerDay = prof.spellsPerDay[0];
      var r1count = prof.spellsPerDay[0][0];
      if (r1count > 0) {
        ch.magic.holySpells = [];
        for (var hi = 0; hi < r1count; hi++) {
          var hr = DW.dice.roll(1, 8);
          var hs = DW.HOLY_R1[hr.total - 1];
          log.record('holyspell', 'Святое заклинание 1 ранга (d8, стр. 103) — можно и просто выбрать', hr, { result: hs.ru });
          magicDice.push({ sides: 8, results: hr.dice, label: 'молитва', value: hr.total });
          ch.magic.holySpells.push(hs);
        }
        ch.magic.holySpells.forEach(function (s) { magicLines.push('Святое заклинание: ' + s.ru + ' (' + s.en + ') — «' + s.prayer + '»'); });
        magicLines.push('Важно: святую магию можно выбирать свободно! Каждое утро после часа молитвы бери ЛЮБОЕ заклинание 1 ранга из списка.');
      } else {
        magicLines.push('На 1 уровне заклинаний ещё нет — клирик получает святую магию со 2 уровня (стр. 60).');
      }
    }

    /* Сюзерен рыцаря */
    if (prof.needsLiege) {
      var lr2 = DW.dice.roll(1, 8);
      var liege = prof.lieges[lr2.total - 1];
      log.record('liege', 'Сюзерен рыцаря (d8, стр. 71)', lr2, { result: liege.ru });
      magicDice.push({ sides: 8, results: lr2.dice, label: 'сюзерен', value: lr2.total });
      ch.liege = liege;
      magicLines.push('Сюзерен: ' + liege.ru + ' (' + liege.en + ') — мировоззрение ' + liege.al);
    }

    if (magicDice.length || magicLines.length) {
      steps.push({
        id: 'magic',
        title: 'Шаг 6б. Особые дары',
        subtitle: 'Гламуры, руны, сноровки, заклинания — определяются случайно по правилам',
        dice: magicDice,
        lines: magicLines
      });
    }

    /* --- Шаг 7. Хиты --- */
    var hpNotation = '1' + prof.hitDie;
    var hpRoll = log.rollNotation('hp', 'Хиты (' + hpNotation + ' + модификатор Телосложения)', hpNotation);
    var hp = hpRoll.total + mods.CON;
    if (hp < 1) hp = 1;
    ch.hp = { max: hp, current: hp, die: prof.hitDie, roll: hpRoll.total, conMod: mods.CON };
    log.entries[log.entries.length - 1].result = hpRoll.total + ' ' + fmtMod(mods.CON) + ' = ' + hp + ' хитов';
    steps.push({
      id: 'hp',
      title: 'Шаг 7. Бросок хитов',
      subtitle: hpNotation + ' + модификатор Телосложения, минимум 1 (стр. 19)',
      dice: [{ sides: parseInt(prof.hitDie.slice(1), 10), results: hpRoll.dice, label: 'хиты', value: hpRoll.total }],
      lines: [
        'Бросок: ' + hpRoll.total + ', Телосложение ' + fmtMod(mods.CON) + ' → ' + hp + ' хитов',
        hpRoll.total <= 2 ? 'Необязательное правило (стр. 19): выпали 1 или 2 — Рефери может разрешить перебросить хиты.' : ''
      ].filter(Boolean),
      warn: hp <= 2 ? 'Хитов очень мало. В Dolmenwood при 0 хитов персонаж УМИРАЕТ. Держись позади и не геройствуй.' : null
    });

    /* --- Шаг 8. Снаряжение --- */
    var eq = generateEquipment(log, kin, prof, opts);
    ch.equipment = eq.equipment;
    ch.gold = eq.gold;
    ch.trinket = eq.trinket;
    steps.push({
      id: 'equipment',
      title: 'Шаг 8. Бросок снаряжения',
      subtitle: 'Броня — d6, оружие — d6 дважды, приключенческие предметы — d20 четырежды, безделушка — d100, золото — 3d6 (стр. 19)',
      dice: eq.dice,
      lines: eq.lines
    });

    /* --- Шаг 9. Класс Брони --- */
    var ac = computeAC(ch, kin, prof, mods);
    ch.ac = ac;
    steps.push({
      id: 'ac',
      title: 'Шаг 9. Класс Брони',
      subtitle: 'Броня + модификатор Ловкости + бонусы рода и класса (стр. 19)',
      dice: [],
      lines: ac.breakdown.concat(['Итого КБ: ' + ac.value]).concat(ac.situational.length ? ['Ситуативно: ' + ac.situational.join('; ')] : [])
    });

    /* --- Шаг 10. Скорость --- */
    var sp = computeSpeed(ch);
    ch.speed = sp;
    steps.push({
      id: 'speed',
      title: 'Шаг 10. Скорость и нагрузка',
      subtitle: 'Нагрузка по весу в монетах, 10 монет = 1 фунт (стр. 148). Одежда и поясной кошель не считаются',
      dice: [],
      lines: [
        'Вес переносимого: ' + sp.load + ' из ' + sp.maxLoad + ' монет',
        'Скорость: ' + sp.value + ' футов за раунд (до 400 монет — 40; до 600 — 30; до 800 — 20; до 1600 — 10)',
        'Исследование подземелья: ' + (sp.value * 3) + ' футов за ход. Бег: ' + (sp.value * 3) + ' футов за раунд. Путешествие: ' + Math.floor(sp.value / 5) + ' очков пути в день.'
      ]
    });

    /* --- Шаг 11. Мировоззрение --- */
    var align = rollAlignment(log, prof, ch);
    ch.alignment = align;
    steps.push({
      id: 'alignment',
      title: 'Шаг 11. Мировоззрение',
      subtitle: align.rolled ? 'Брошено d6 (1–2 Закон, 3–4 Нейтралитет, 5–6 Хаос) — но это выбор игрока, меняй свободно' : 'Определено правилами класса',
      dice: align.dice ? [align.dice] : [],
      lines: [align.ru + ' (' + align.en + ') — ' + align.d]
    });

    /* --- Шаг 13. Имя и внешность --- */
    var det = generateDetails(log, kin, opts);
    ch.name = det.name;
    ch.gender = det.gender;
    ch.background = det.background;
    ch.details = det.details;
    ch.physical = det.physical;
    steps.push({
      id: 'details',
      title: 'Шаг 13. Имя, прошлое и внешность',
      subtitle: 'Имя — d20, прошлое — d20/d100, приметы — d12 (стр. 33+)',
      dice: det.dice,
      lines: det.lines
    });

    /* --- Лунный знак --- */
    if (opts.moonSign !== false && kin.type !== 'fairy') {
      var ms = log.pickRange('moonsign', 'Лунный знак (d100, стр. 175)', DW.MOON_SIGNS).item;
      ch.moonSign = { moon: ms.moon, phase: ms.phase, en: ms.moonEn, d: ms.d };
      ch.birthday = birthdayFromMoon(log, ch.moonSign);
      steps.push({
        id: 'moonsign',
        title: 'Лунный знак (необязательное правило)',
        subtitle: 'd100 по таблице лунных знаков (стр. 175). У фей лунных знаков не бывает',
        dice: [{ sides: 100, results: log.entries[log.entries.length - 1].dice, label: 'луна', value: log.entries[log.entries.length - 1].total }],
        lines: [ms.moon + ' луна, ' + ms.phase + ' (' + ms.moonEn + ')', ms.d]
      });
    } else if (kin.type === 'fairy') {
      ch.moonSign = null;
    }

    /* --- Финал --- */
    ch.log = log.entries;
    ch.checksum = checksum(ch);
    ch.portraitPrompt = DW.portraitPrompt ? DW.portraitPrompt(ch) : null;

    return { character: ch, steps: steps, log: log };
  }

  /* ================= Снаряжение ================= */
  function generateEquipment(log, kin, prof, opts) {
    var dice = [], lines = [];
    var equipped = [], stowed = [];
    var isSmall = kin.size === 'Small';

    function gearItem(id, qty) {
      var g = DW.GEAR[id];
      if (!g) return null;
      return { id: id, ru: g.ru, en: g.en, qty: qty || 1, slots: g.slots, weight: g.weight, cost: g.cost, cat: g.cat, d: g.d || '' };
    }
    function weaponItem(id) {
      var w = DW.WEAPONS[id];
      if (!w) return null;
      return { id: id, kind: 'weapon', ru: w.ru, en: w.en, dmg: w.dmg, size: w.size, slots: w.slots, weight: w.weight, cost: w.cost, qual: w.qual, range: w.range || null };
    }
    function armourItem(id) {
      var a = DW.ARMOUR[id];
      if (!a) return null;
      return { id: id, kind: 'armour', ru: a.ru, en: a.en, ac: a.ac, bulk: a.bulk, bulkRu: a.bulkRu, slots: a.slots, weight: a.weight, cost: a.cost };
    }

    /* Общие предметы */
    DW.STARTING_GENERAL.equipped.forEach(function (id) { equipped.push(gearItem(id)); });
    DW.STARTING_GENERAL.backpack.forEach(function (id) { stowed.push(gearItem(id)); });
    var backpack = gearItem('backpack');

    /* Броня */
    var armour = null, shield = false;
    if (prof.startArmour) {
      var ar = DW.dice.roll(1, 6);
      var arow = null;
      for (var i = 0; i < prof.startArmour.length; i++) {
        if (ar.total >= prof.startArmour[i].r[0] && ar.total <= prof.startArmour[i].r[1]) { arow = prof.startArmour[i]; break; }
      }
      var picked = arow ? arow.items.slice() : [];
      /* Моцлинг: кольчуга → корьевой доспех, латы → шишечный (стр. 49) */
      var swapped = null;
      if (kin.id === 'mossling') {
        picked = picked.map(function (id) {
          if (id === 'chainmail') { swapped = 'кольчуга → корьевой доспех'; return 'bark'; }
          if (id === 'platemail') { swapped = 'латы → шишечный доспех'; return 'pinecone'; }
          return id;
        });
      }
      picked.forEach(function (id) {
        if (id === 'shield') { shield = true; }
        else { armour = armourItem(id); }
      });
      var armDesc = picked.length ? picked.map(function (id) {
        return id === 'shield' ? DW.SHIELD.ru : DW.ARMOUR[id].ru;
      }).join(' + ') : 'без брони';
      log.record('equipment', 'Броня (d6)', ar, { result: armDesc + (swapped ? ' [' + swapped + ']' : '') });
      dice.push({ sides: 6, results: ar.dice, label: 'броня', value: ar.total });
      lines.push('Броня: ' + armDesc + (swapped ? ' (замена по правилу моцлингов: ' + swapped + ')' : ''));
    } else {
      lines.push('Броня: не носит (класс запрещает)');
    }
    if (!armour) armour = armourItem('none');

    /* Оружие: 2 броска d6 */
    var weapons = [];
    for (var w = 0; w < 2; w++) {
      var wr = DW.dice.roll(1, 6);
      var wrow = null;
      for (var j = 0; j < prof.startWeapons.length; j++) {
        if (wr.total >= prof.startWeapons[j].r[0] && wr.total <= prof.startWeapons[j].r[1]) { wrow = prof.startWeapons[j]; break; }
      }
      var items = wrow ? (isSmall && wrow.smallItems ? wrow.smallItems : wrow.items) : [];
      var swapNote = (isSmall && wrow && wrow.smallItems) ? ' (замена для персонажа Малого размера)' : '';
      var names = [];
      items.forEach(function (id) {
        if (DW.WEAPONS[id]) { var it = weaponItem(id); weapons.push(it); names.push(it.ru); }
        else if (DW.GEAR[id]) { var g = gearItem(id); stowed.push(g); names.push(g.ru); }
      });
      log.record('equipment', 'Оружие, бросок ' + (w + 1) + ' (d6)', wr, { result: names.join(' + ') + swapNote });
      dice.push({ sides: 6, results: wr.dice, label: 'оружие ' + (w + 1), value: wr.total });
      lines.push('Оружие ' + (w + 1) + ': ' + names.join(' + ') + swapNote);
    }

    /* Классовые предметы */
    (prof.classItems || []).forEach(function (id) {
      if (id === 'instrument_any') {
        var ir = DW.dice.roll(1, 2);
        var chosen = ir.total === 1 ? 'instrument_string' : 'windinstrument';
        log.record('equipment', 'Музыкальный инструмент (струнный/духовой)', ir, { result: DW.GEAR[chosen].ru });
        dice.push({ sides: 6, results: ir.dice, label: 'инструмент', value: ir.total });
        equipped.push(gearItem(chosen));
        lines.push('Предмет класса: ' + DW.GEAR[chosen].ru);
        return;
      }
      var g = gearItem(id);
      if (g) { (g.slots === 0 ? equipped : stowed).push(g); lines.push('Предмет класса: ' + g.ru); }
    });

    /* Вудгрю в схеме род+класс тоже начинает с духовым инструментом (стр. 53) */
    if (kin.id === 'woodgrue' && prof.mode === 'class') {
      var alreadyWind = (prof.classItems || []).indexOf('windinstrument') >= 0;
      if (!alreadyWind) {
        equipped.push(gearItem('windinstrument'));
        lines.push('Черта рода: духовой инструмент (вудгрю всегда начинает с ним)');
      }
    }

    /* Приключенческие предметы: до 4, d20 */
    var advItems = [];
    for (var a = 0; a < 4; a++) {
      var tries = 0, chosenId = null;
      while (tries < 30) {
        var adr = DW.dice.roll(1, 20);
        var cand = DW.ADVENTURING_ITEMS[adr.total - 1];
        var dup = advItems.indexOf(cand.id) >= 0;
        log.record('equipment', 'Приключенческий предмет ' + (a + 1) + ' (d20)', adr,
          { result: DW.GEAR[cand.id].ru + (dup ? ' — уже есть, перебрасываем' : '') });
        dice.push({ sides: 20, results: adr.dice, label: 'предмет ' + (a + 1), value: adr.total });
        if (!dup) { chosenId = cand.id; break; }
        tries++;
      }
      if (chosenId) {
        advItems.push(chosenId);
        var gi2 = gearItem(chosenId);
        if (chosenId === 'sack') equipped.push(gi2); else stowed.push(gi2);
      }
    }
    lines.push('Приключенческие предметы: ' + advItems.map(function (id) { return DW.GEAR[id].ru; }).join(', '));
    lines.push('(По правилам эти 4 предмета можно не бросать, а выбрать — правь на странице персонажа.)');

    /* Безделушка d100 */
    var tr = log.pickRange('equipment', 'Безделушка рода (d100)', kin.trinkets);
    var trinket = { ru: tr.item.ru, en: tr.item.en, roll: tr.roll.total };
    dice.push({ sides: 100, results: tr.roll.dice, label: 'безделушка', value: tr.roll.total });
    lines.push('Безделушка: ' + tr.item.ru);

    /* Золото 3d6 */
    var gr = log.rollNotation('equipment', 'Золото в поясном кошеле (3d6)', '3d6');
    dice.push({ sides: 6, results: gr.dice, label: 'золото', value: gr.total });
    log.entries[log.entries.length - 1].result = gr.total + ' зм';
    lines.push('Золото: ' + gr.total + ' зм в поясном кошеле');

    return {
      dice: dice, lines: lines,
      gold: gr.total,
      trinket: trinket,
      equipment: {
        armour: armour,
        shield: shield ? { id: 'shield', ru: DW.SHIELD.ru, en: DW.SHIELD.en, acBonus: 1, slots: 1, weight: 100, cost: 10 } : null,
        weapons: weapons,
        equipped: equipped,
        stowed: stowed,
        container: backpack,
        adventuringItems: advItems
      }
    };
  }

  /* ================= Класс Брони ================= */
  function computeAC(ch, kin, prof, mods) {
    var parts = [];
    var base = ch.equipment.armour ? ch.equipment.armour.ac : 10;
    var value = base;
    parts.push((ch.equipment.armour && ch.equipment.armour.id !== 'none')
      ? ch.equipment.armour.ru + ': базовый КБ ' + base
      : 'Без брони: базовый КБ 10');
    if (ch.equipment.shield) { value += 1; parts.push('Щит: +1'); }
    if (mods.DEX !== 0) { value += mods.DEX; parts.push('Ловкость: ' + fmtMod(mods.DEX)); }

    var bulk = ch.equipment.armour ? ch.equipment.armour.bulk : 'none';
    if (kin.id === 'breggle' && (bulk === 'none' || bulk === 'light')) {
      value += 1; parts.push('Шерсть бреггла: +1 (без брони или в Лёгкой броне)');
    }
    if (prof.acBonusByLevel) {
      var b = prof.acBonusByLevel[0];
      value += b; parts.push('Броня веры (монах): ' + fmtMod(b));
    }
    var sit = [];
    if (kin.id === 'grimalkin' || kin.id === 'woodgrue') {
      sit.push('+2 к КБ в ближнем бою с Большими существами (малый размер) → КБ ' + (value + 2));
    }
    return { value: value, breakdown: parts, situational: sit };
  }

  /* ================= Скорость ================= */
  function countSlots(ch) {
    var equipped = 0, stowed = 0;
    if (ch.equipment.armour) equipped += ch.equipment.armour.slots || 0;
    if (ch.equipment.shield) equipped += 1;
    ch.equipment.weapons.forEach(function (w) { equipped += w.slots || 1; });
    /* Одежда и поясной кошель не учитываются (домашнее правило Рефери). */
    ch.equipment.equipped.forEach(function (g) { if (countsForLoad(g)) equipped += g.slots || 0; });
    ch.equipment.stowed.forEach(function (g) { if (countsForLoad(g)) stowed += (g.slots === 0 ? 0 : (g.slots || 1)) * (g.qty || 1); });
    return { equipped: equipped, stowed: stowed };
  }

  /* Домашнее правило Рефери: одежда и поясной кошель в инвентарь и в вес не идут. */
  function countsForLoad(item) {
    if (!item) return false;
    if (DW.LOAD_EXEMPT_IDS.indexOf(item.id) >= 0) return false;
    if (DW.LOAD_EXEMPT_CATS.indexOf(item.cat) >= 0) return false;
    return true;
  }

  /* Полный вес переносимого в монетах (10 монет = 1 фунт), стр. 148.
     Это же число идёт в поле Load на VTT-листе: Load / 1600. */
  function computeLoad(ch) {
    var w = 0, parts = [];
    var eq = ch.equipment || {};
    function add(name, weight) { if (weight) { w += weight; parts.push(name + ' ' + weight); } }

    if (eq.armour && eq.armour.id !== 'none') add(eq.armour.ru, eq.armour.weight || 0);
    if (eq.shield) add('Щит', 100);
    (eq.weapons || []).forEach(function (x) { add(x.ru, x.weight || 0); });
    (eq.equipped || []).forEach(function (g) { if (countsForLoad(g)) add(g.ru, (g.weight || 0) * (g.qty || 1)); });
    (eq.stowed || []).forEach(function (g) { if (countsForLoad(g)) add(g.ru, (g.weight || 0) * (g.qty || 1)); });
    if (eq.container && countsForLoad(eq.container)) add(eq.container.ru, eq.container.weight || 0);
    add('Монеты (' + (ch.gold || 0) + ' зм)', ch.gold || 0);   /* любая монета весит 1 */
    add('Безделушка', 10);                                      /* стр. 34 */

    return { total: w, max: DW.MAX_LOAD, parts: parts };
  }

  /* День рождения, соответствующий выпавшему лунному знаку (для поля Birthday). */
  var MOON_TO_MONTH = {
    'Ухмыляющаяся': 1, 'Мёртвая': 2, 'Звериная': 3, 'Чешуйчатая': 4, 'Рыцарская': 5, 'Гниющая': 6,
    'Девичья': 7, 'Ведьмина': 8, 'Разбойничья': 9, 'Козья': 10, 'Узкая': 11, 'Чёрная': 12
  };
  function birthdayFromMoon(log, moonSign) {
    if (!moonSign) return null;
    var monthN = MOON_TO_MONTH[moonSign.moon];
    if (!monthN) return null;
    var month = DW.MONTHS[monthN - 1];
    var range = moonSign.phase === 'растущая' ? [1, 13] : (moonSign.phase === 'полная' ? [14, 16] : [17, 29]);
    var span = range[1] - range[0] + 1;
    var r = DW.dice.roll(1, span);
    var day = range[0] + r.total - 1;
    if (day > month.days) day = month.days;
    if (log) log.record('birthday', 'День рождения внутри фазы луны (1d' + span + ')', r,
      { result: day + ' ' + month.ru });
    return { month: month.ru, monthEn: month.en, monthN: monthN, day: day };
  }

  /* Скорость по весу переносимого (стр. 148) — основная система нашей игры. */
  function computeSpeed(ch) {
    var load = computeLoad(ch);
    var s = countSlots(ch);
    var speed = 10;
    for (var i = 0; i < DW.WEIGHT_ENCUMBRANCE.length; i++) {
      if (load.total <= DW.WEIGHT_ENCUMBRANCE[i].maxWeight) { speed = DW.WEIGHT_ENCUMBRANCE[i].speed; break; }
    }
    return {
      value: speed,
      load: load.total,
      maxLoad: load.max,
      overloaded: load.total > load.max,
      loadParts: load.parts,
      equipped: s.equipped,
      stowed: s.stowed
    };
  }

  /* ================= Мировоззрение ================= */
  var ALIGNMENTS = {
    Lawful: { ru: 'Закон', en: 'Lawful', d: 'Заслуживают доверия, верят в защиту других и действуют на благо группы. Соблюдают законы общества, стремятся к справедливости.' },
    Neutral: { ru: 'Нейтралитет', en: 'Neutral', d: 'Сотрудничают, пока это им не во вред. Относятся к другим так, как относятся к ним. Верят в опору на собственные силы и равновесие Закона и Хаоса.' },
    Chaotic: { ru: 'Хаос', en: 'Chaotic', d: 'Лгут и используют других ради своих целей, не заботясь о благе группы. Легко нарушают законы и нормы, считая правила такими же произвольными, как их прихоти.' }
  };

  function rollAlignment(log, prof, ch) {
    if (prof.needsLiege && ch.liege) {
      var a = ALIGNMENTS[ch.liege.al];
      log.note('alignment', 'Мировоззрение', a.ru + ' — обязано совпадать с мировоззрением сюзерена (стр. 70)');
      return { ru: a.ru, en: a.en, d: a.d, rolled: false, forced: 'совпадает с сюзереном' };
    }
    var tries = 0;
    while (tries < 20) {
      var r = DW.dice.roll(1, 6);
      var key = r.total <= 2 ? 'Lawful' : (r.total <= 4 ? 'Neutral' : 'Chaotic');
      var al = ALIGNMENTS[key];
      var forbidden = prof.noChaotic && key === 'Chaotic';
      log.record('alignment', 'Мировоззрение (d6: 1–2 Закон, 3–4 Нейтралитет, 5–6 Хаос)', r,
        { result: al.ru + (forbidden ? ' — запрещено классу, перебрасываем' : '') });
      if (!forbidden) {
        return { ru: al.ru, en: al.en, d: al.d, rolled: true, dice: { sides: 6, results: r.dice, label: 'мировоззрение', value: r.total } };
      }
      tries++;
    }
    return { ru: ALIGNMENTS.Neutral.ru, en: 'Neutral', d: ALIGNMENTS.Neutral.d, rolled: false };
  }

  /* ================= Имя, прошлое, внешность ================= */
  function generateDetails(log, kin, opts) {
    var dice = [], lines = [];

    /* Пол */
    var gender = opts.gender || 'any';
    if (gender === 'any') {
      var gr = DW.dice.roll(1, 6);
      gender = gr.total <= 2 ? 'male' : (gr.total <= 4 ? 'female' : 'unisex');
      log.record('name', 'Пол / стиль имени (d6)', gr, { result: gender === 'male' ? 'мужское' : (gender === 'female' ? 'женское' : 'унисекс') });
      dice.push({ sides: 6, results: gr.dice, label: 'пол', value: gr.total });
    }

    var firstName = null, surname = null, nameStyle = null;

    if (kin.id === 'elf') {
      var sr = DW.dice.roll(1, 2);
      nameStyle = sr.total === 1 ? 'rustic' : 'courtly';
      log.record('name', 'Стиль эльфийского имени (d2)', sr, { result: nameStyle === 'rustic' ? 'деревенское' : 'придворное' });
      var pool = nameStyle === 'rustic' ? kin.names.male : kin.namesCourtly;
      var nr = DW.dice.roll(1, 20);
      firstName = pool[nr.total - 1];
      log.record('name', 'Эльфийский эпитет (d20)', nr, { result: firstName.ru });
      dice.push({ sides: 20, results: nr.dice, label: 'имя', value: nr.total });
    } else {
      var pool2 = gender === 'male' ? kin.names.male : (gender === 'female' ? kin.names.female : kin.names.unisex);
      if (!pool2 || !pool2.length) pool2 = kin.names.male;
      var nr2 = DW.dice.roll(1, 20);
      firstName = pool2[nr2.total - 1];
      log.record('name', 'Имя (d20)', nr2, { result: firstName.ru });
      dice.push({ sides: 20, results: nr2.dice, label: 'имя', value: nr2.total });

      if (kin.names.surname && kin.names.surname.length) {
        var sr2 = DW.dice.roll(1, 20);
        surname = kin.names.surname[sr2.total - 1];
        log.record('name', 'Фамилия (d20)', sr2, { result: surname.ru });
        dice.push({ sides: 20, results: sr2.dice, label: 'фамилия', value: sr2.total });
      }
    }

    var nameRu = firstName.ru + (surname ? ' ' + surname.ru : '');
    var nameEn = firstName.en + (surname ? ' ' + surname.en : '');
    lines.push('Имя: ' + nameRu + ' (' + nameEn + ')');

    /* Прошлое */
    var background;
    if (kin.backgroundsD100) {
      var b = log.pickRange('background', 'Прошлое (d100)', kin.backgroundsD100);
      background = { ru: b.item.ru, en: b.item.en };
      dice.push({ sides: 100, results: b.roll.dice, label: 'прошлое', value: b.roll.total });
    } else {
      var br = DW.dice.roll(1, 20);
      var bi = kin.backgrounds[br.total - 1];
      background = { ru: bi.ru, en: bi.en };
      log.record('background', 'Прошлое (d20)', br, { result: bi.ru });
      dice.push({ sides: 20, results: br.dice, label: 'прошлое', value: br.total });
    }
    lines.push('Прошлое: ' + background.ru + ' (' + background.en + ')');

    /* Приметы d12 */
    var details = {};
    Object.keys(kin.details).forEach(function (key) {
      var t = kin.details[key];
      var dr = DW.dice.roll(1, 12);
      var item = t.items[dr.total - 1];
      details[key] = { label: t.ru, labelEn: t.en, ru: item.ru, en: item.en };
      log.record('details', t.ru + ' (d12)', dr, { result: item.ru });
      dice.push({ sides: 12, results: dr.dice, label: t.ru.toLowerCase(), value: dr.total });
      lines.push(t.ru + ': ' + item.ru);
    });

    /* Возраст, рост, вес */
    var physical = {};
    if (kin.age && kin.age.dice) {
      var agr = log.rollNotation('physical', 'Возраст (' + kin.age.dice + (kin.age.mult ? '×' + kin.age.mult : '') + ' + ' + kin.age.base + ')', kin.age.dice, kin.age.mult);
      physical.age = agr.total + (kin.age.base || 0);
      log.entries[log.entries.length - 1].result = physical.age + ' лет';
      lines.push('Возраст: ' + physical.age + ' лет');
    }
    if (kin.lifespan) {
      if (kin.lifespan.fixed) { physical.lifespan = kin.lifespan.fixed; }
      else {
        var lsr = log.rollNotation('physical', 'Срок жизни', kin.lifespan.dice, kin.lifespan.mult);
        physical.lifespan = lsr.total + (kin.lifespan.base || 0);
        log.entries[log.entries.length - 1].result = physical.lifespan + ' лет';
      }
    }
    if (kin.height) {
      var hbase = (opts.gender === 'female' && kin.height.baseFemale) ? kin.height.baseFemale : kin.height.base;
      var hr = log.rollNotation('physical', 'Рост (' + kin.height.dice + ' + ' + hbase + ' дюймов)', kin.height.dice);
      var inches = hr.total + hbase;
      physical.heightInches = inches;
      physical.heightCm = Math.round(inches * 2.54);
      physical.heightImperial = Math.floor(inches / 12) + "'" + (inches % 12) + '"';
      log.entries[log.entries.length - 1].result = physical.heightImperial + ' (' + physical.heightCm + ' см)';
      lines.push('Рост: ' + physical.heightImperial + ' — ' + physical.heightCm + ' см');
    }
    if (kin.weight) {
      var wr = log.rollNotation('physical', 'Вес (' + kin.weight.dice + ' + ' + kin.weight.base + ' фунтов)', kin.weight.dice);
      var lbs = wr.total + kin.weight.base;
      physical.weightLbs = lbs;
      physical.weightKg = Math.round(lbs * 0.4536);
      log.entries[log.entries.length - 1].result = lbs + ' фунтов (' + physical.weightKg + ' кг)';
      lines.push('Вес: ' + lbs + ' фунтов — ' + physical.weightKg + ' кг');
    }

    return {
      dice: dice, lines: lines,
      gender: gender,
      name: { ru: nameRu, en: nameEn, first: firstName, surname: surname, style: nameStyle },
      background: background,
      details: details,
      physical: physical
    };
  }

  /* ================= Контрольная сумма для проверки гейм-мастером ================= */
  function checksum(ch) {
    var str = JSON.stringify({
      a: ch.abilitiesRolled, h: ch.hp && ch.hp.roll, l: (ch.log || []).map(function (e) { return e.dice.join(',') ; }).join('|')
    });
    var h = 5381, i;
    for (i = 0; i < str.length; i++) { h = ((h * 33) ^ str.charCodeAt(i)) >>> 0; }
    return h.toString(16).toUpperCase();
  }

  DW.Generator = {
    generate: generate,
    abilityMod: abilityMod,
    primeXpMod: primeXpMod,
    fmtMod: fmtMod,
    buildProfile: buildProfile,
    classAllowedFor: classAllowedFor,
    computeAC: computeAC,
    computeSpeed: computeSpeed,
    computeLoad: computeLoad,
    countsForLoad: countsForLoad,
    birthdayFromMoon: birthdayFromMoon,
    checksum: checksum,
    ABIL: ABIL, ABIL_RU: ABIL_RU, ABIL_EN: ABIL_EN,
    ALIGNMENTS: ALIGNMENTS
  };
})();
