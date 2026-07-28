/* Лист персонажа + шпаргалка «как играть». */
(function () {
  'use strict';
  var esc = DW.esc, T = DW.T, fm = null;

  function render(root, id) {
    fm = DW.Generator.fmtMod;
    var ch = DW.store.get(id);
    if (!ch) {
      root.innerHTML = '<div class="card empty"><div class="big">❔</div><p>Персонаж не найден. Возможно, он остался в другом браузере.</p>' +
        '<a class="btn" href="#/catalog">В каталог</a></div>';
      return;
    }

    root.innerHTML =
      header(ch) +
      abilitiesCard(ch) +
      combatCard(ch) +
      skillsCard(ch) +
      traitsCard(ch) +
      magicCard(ch) +
      equipmentCard(ch) +
      personaCard(ch) +
      portraitCard(ch) +
      cheatCard(ch) +
      logCard(ch) +
      jsonCard(ch);

    wire(root, ch);
  }

  /* ================= Шапка ================= */
  function header(ch) {
    var stCls = ch.status === 'dead' ? 'dead' : (ch.status === 'retired' ? 'retired' : 'alive');
    var stRu = ch.status === 'dead' ? 'Погиб' : (ch.status === 'retired' ? 'На покое' : 'Жив');
    return '<div class="card">' +
      '<div class="sheet-head">' +
        '<div class="titles">' +
          '<h1>' + esc(ch.name.ru) + ' <span class="badge ' + stCls + '">' + stRu + '</span></h1>' +
          '<div class="sub">' + esc(ch.kindred.ru) + ' · ' + esc(ch.profile.ru) + ' · ' + ch.level + ' ' + T('уровень', 'level') +
            ' · ' + T(ch.alignment.ru, 'alignment') + '</div>' +
          '<div class="en">' + esc(ch.name.en) + ' — ' + esc(ch.kindred.en) + ' ' + esc(ch.profile.en) + ', Level ' + ch.level + ', ' + esc(ch.alignment.en) + '</div>' +
          '<div class="muted" style="margin-top:6px;font-size:.86rem">' +
            esc(ch.kindred.typeRu) + ' · размер ' + T(ch.kindred.sizeRu, ch.kindred.size === 'Small' ? 'small-size' : 'kindred') +
            (ch.background ? ' · в прошлом ' + esc(ch.background.ru.toLowerCase()) : '') +
          '</div>' +
        '</div>' +
        '<div class="btn-row no-print">' +
          '<button class="small" id="btn-json">⬇ JSON для ГМ</button>' +
          '<button class="small" id="btn-print">🖨 Печать</button>' +
          '<a class="btn small" href="#/catalog">← Каталог</a>' +
        '</div>' +
      '</div></div>';
  }

  /* ================= Характеристики ================= */
  var ABIL_USE = {
    STR: 'Модификатор Силы прибавляется к броскам атаки И урона в ближнем бою. Проверки Силы: выбить дверь, прыжок, плавание в броне.',
    INT: 'Положительный модификатор Интеллекта = число дополнительных языков. Проверки Интеллекта: выучить заклинание из книги, обдумать задачу с трубкой.',
    WIS: 'Модификатор Мудрости = твоё Сопротивление магии: прибавляется ко всем спасброскам против магии. Проверки Мудрости: готовка на костре.',
    DEX: 'Модификатор Ловкости прибавляется к Классу Брони и к броскам атаки метательным/стрелковым оружием (но НЕ к урону). Проверки Ловкости: лазание в опасной обстановке.',
    CON: 'Модификатор Телосложения прибавляется к хитам при каждом получении уровня (до 10-го). Проверки Телосложения: выспаться в диком лагере, устоять перед выпивкой.',
    CHA: 'Модификатор Харизмы влияет на число и Верность наёмников и на бросок реакции при первой встрече. Проверки Харизмы: развлечь у костра, подружиться со зверем (охотник).'
  };

  function abilitiesCard(ch) {
    var primes = ch.profile.primeAbilities || [];
    return '<div class="card">' +
      '<h2>Характеристики <span class="en">Ability Scores</span></h2>' +
      '<div class="stat-row">' +
        DW.Generator.ABIL.map(function (a) {
          var isPrime = primes.indexOf(a) >= 0;
          return '<div class="stat" title="' + esc(ABIL_USE[a]) + '"' + (isPrime ? ' style="border-color:var(--gold-dim)"' : '') + '>' +
            '<div class="k">' + esc(DW.Generator.ABIL_RU[a]) + (isPrime ? ' ★' : '') + '</div>' +
            '<div class="v">' + ch.abilities[a] + '</div>' +
            '<div class="m">' + fm(ch.mods[a]) + '</div></div>';
        }).join('') +
      '</div>' +
      '<p class="muted" style="margin-top:10px;font-size:.84rem">★ — ' + T('главные характеристики', 'prime-ability') + ' твоего класса (' + esc(ch.profile.primeRu) + '). ' +
        'Модификатор ' + T('опыта', 'xp') + ': <b>' + fm(ch.xpModifier) + '%</b>' +
        (ch.xpModifierBreakdown && ch.xpModifierBreakdown.kindred ? ' (главная характеристика ' + fm(ch.xpModifierBreakdown.prime) + '%, человек +10%)' : '') + '.</p>' +
      '<div class="grid two" style="margin-top:8px">' +
        DW.Generator.ABIL.map(function (a) {
          return '<div style="font-size:.86rem"><b>' + esc(DW.Generator.ABIL_RU[a]) + ' ' + ch.abilities[a] + ' (' + fm(ch.mods[a]) + ')</b><br>' +
            '<span class="dim">' + esc(ABIL_USE[a]) + '</span></div>';
        }).join('') +
      '</div></div>';
  }

  /* ================= Бой ================= */
  function attackRows(ch) {
    var rows = [];
    var atk = ch.attack;
    var isHunter = ch.profile.id === 'hunter';
    (ch.equipment.weapons || []).forEach(function (w) {
      var isMissile = (w.qual || []).indexOf('missile') >= 0;
      var isMelee = (w.qual || []).indexOf('melee') >= 0;
      if (isMelee) {
        rows.push({
          name: w.ru, en: w.en, kind: 'Ближний бой',
          atk: atk + ch.mods.STR,
          dmg: w.dmg + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''),
          note: qualNote(w)
        });
      }
      if (isMissile) {
        var b = atk + ch.mods.DEX + (isHunter ? 1 : 0);
        rows.push({
          name: w.ru + (isMelee ? ' (метнуть)' : ''), en: w.en, kind: 'Стрелковое',
          atk: b,
          dmg: w.dmg,
          note: (w.range ? 'дистанции ' + w.range + ' футов; ' : '') + (isHunter ? '+1 охотника уже учтён; ' : '') + qualNote(w)
        });
      }
    });
    /* Природное оружие */
    if (ch.kindred.id === 'breggle') {
      rows.push({ name: 'Рога', en: 'Horns', kind: 'Ближний бой', atk: atk + ch.mods.STR, dmg: '1d4' + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''), note: 'вместо оружия; на 3 уровне 1d4+1, на 6 — 1d6' });
    }
    if (ch.kindred.id === 'woodgrue') {
      rows.push({ name: 'Музыкальный инструмент', en: 'Instrument', kind: 'Ближний бой', atk: atk + ch.mods.STR, dmg: '1d4' + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''), note: 'вудгрю умеют драться дудкой' });
    }
    if (ch.profile.id === 'friar') {
      rows.push({ name: 'Кухонная утварь', en: 'Culinary implements', kind: 'Ближний бой', atk: atk + ch.mods.STR, dmg: '1d4' + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''), note: 'сковорода, колбаса, окорок — всё в дело' });
    }
    if (ch.profile.id === 'thief') {
      rows.push({ name: 'Удар в спину (кинжалом)', en: 'Back-stab', kind: 'Ближний бой', atk: atk + ch.mods.STR + 4, dmg: '3d4' + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''), note: 'только сзади и когда цель не знает о тебе' });
    }
    return rows;
  }

  function qualNote(w) {
    return (w.qual || []).map(function (q) {
      var Q = DW.WEAPON_QUALITIES[q];
      return Q ? Q.ru.toLowerCase() : q;
    }).join(', ');
  }

  function combatCard(ch) {
    var rows = attackRows(ch);
    return '<div class="card">' +
      '<h2>Бой <span class="en">Combat</span></h2>' +
      '<div class="stat-row">' +
        '<div class="stat"><div class="k">' + T('Хиты', 'hp') + '</div><div class="v"><span id="hp-cur">' + ch.hp.current + '</span><span style="font-size:1rem;color:var(--ink-faint)">/' + ch.hp.max + '</span></div>' +
          '<div class="no-print" style="margin-top:5px"><button class="small" id="hp-minus">−</button> <button class="small" id="hp-plus">+</button></div></div>' +
        '<div class="stat"><div class="k">' + T('Класс Брони', 'ac') + '</div><div class="v">' + ch.ac.value + '</div></div>' +
        '<div class="stat"><div class="k">' + T('Атака', 'attack') + '</div><div class="v">' + fm(ch.attack) + '</div></div>' +
        '<div class="stat"><div class="k">' + T('Скорость', 'speed') + '</div><div class="v">' + ch.speed.value + '</div></div>' +
        '<div class="stat"><div class="k">' + T('Сопр. магии', 'magic-resistance') + '</div><div class="v">' + fm(ch.magicResistance) + '</div></div>' +
      '</div>' +

      '<h3 style="margin-top:18px">' + T('Спасброски', 'saving-throw') + ' — выбрось d20 ≥ этого числа</h3>' +
      '<div class="saves">' +
        saveBox('Рок', 'save-doom', ch.saves.doom) +
        saveBox('Луч', 'save-ray', ch.saves.ray) +
        saveBox('Захват', 'save-hold', ch.saves.hold) +
        saveBox('Взрыв', 'save-blast', ch.saves.blast) +
        saveBox('Заклинание', 'save-spell', ch.saves.spell) +
      '</div>' +
      '<p class="muted" style="margin-top:8px;font-size:.84rem">Против магии прибавляй Сопротивление магии ' + fm(ch.magicResistance) + '. ' +
        'Натуральная 1 — всегда провал, натуральная 20 — всегда успех.</p>' +

      '<h3 style="margin-top:18px">Твои атаки</h3>' +
      '<table class="tbl"><thead><tr><th>Чем</th><th>Тип</th><th>Бросок атаки</th><th>Урон</th><th>Особенности</th></tr></thead><tbody>' +
        rows.map(function (r) {
          return '<tr><td><b>' + esc(r.name) + '</b><br><span class="en">' + esc(r.en) + '</span></td>' +
            '<td>' + esc(r.kind) + '</td>' +
            '<td class="mono" style="color:var(--gold);font-size:1rem">d20 ' + fm(r.atk) + '</td>' +
            '<td class="mono" style="font-size:1rem">' + esc(r.dmg) + '</td>' +
            '<td class="muted" style="font-size:.8rem">' + esc(r.note) + '</td></tr>';
        }).join('') +
      '</tbody></table>' +
      '<p class="muted" style="margin-top:8px;font-size:.84rem">Попадание — если результат броска атаки ≥ ' + T('Класса Брони', 'ac') + ' цели. ' +
        'Успешная атака всегда наносит минимум 1 урона.</p>' +

      '<h3 style="margin-top:18px">Из чего складывается твой КБ</h3>' +
      '<ul style="margin:0;padding-left:20px;font-size:.9rem">' +
        ch.ac.breakdown.map(function (b) { return '<li>' + esc(b) + '</li>'; }).join('') +
        (ch.ac.situational || []).map(function (b) { return '<li class="dim">' + esc(b) + '</li>'; }).join('') +
      '</ul>' +
      '</div>';
  }

  function saveBox(ru, key, v) {
    return '<div class="save-box"><div class="k">' + T(ru, key) + '</div><div class="v">' + v + '</div></div>';
  }

  /* ================= Навыки ================= */
  function skillsCard(ch) {
    var b = ch.skills.basic;
    var rows = [
      { ru: 'Слушать', en: 'Listen', t: b.listen, d: 'Прижать ухо к двери и понять, есть ли кто за ней.' },
      { ru: 'Обыскивать', en: 'Search', t: b.search, d: 'Искать потайные двери и ловушки.' },
      { ru: 'Выживание', en: 'Survival', t: b.survival, d: 'Искать еду в дикой природе.' + (b.survivalForaging ? ' У тебя при собирательстве цель ' + b.survivalForaging + '.' : '') }
    ];
    (ch.skills.class || []).forEach(function (s) {
      rows.push({ ru: s.ru, en: s.en, t: s.target, d: s.d, cls: true });
    });
    return '<div class="card">' +
      '<h2>' + T('Навыки', 'skill-check') + ' <span class="en">Skills</span></h2>' +
      '<p class="muted" style="margin-top:-4px">Бросай <b>1d6</b>. Успех, если выпало <b>столько же или больше</b>, чем ' + T('цель навыка', 'skill-target') + '. Чем меньше число — тем лучше.</p>' +
      '<table class="tbl"><thead><tr><th>Навык</th><th>Цель</th><th>Шанс</th><th>Когда бросать</th></tr></thead><tbody>' +
      rows.map(function (r) {
        var chance = (7 - r.t);
        return '<tr><td><b>' + esc(r.ru) + '</b>' + (r.cls ? ' <span class="badge" style="font-size:.62rem">класс</span>' : '') +
          '<br><span class="en">' + esc(r.en) + '</span></td>' +
          '<td style="color:var(--gold);font-weight:700;font-size:1.1rem">' + r.t + '+</td>' +
          '<td class="dim">' + chance + ' из 6</td>' +
          '<td style="font-size:.86rem">' + esc(r.d || '') + '</td></tr>';
      }).join('') +
      '</tbody></table></div>';
  }

  /* ================= Черты ================= */
  function traitsCard(ch) {
    var out = '';
    if (ch.traits.kindred && ch.traits.kindred.length) {
      out += '<h3>Черты рода — ' + esc(ch.kindred.ru) + '</h3>' + traitList(ch.traits.kindred);
    }
    if (ch.traits.class && ch.traits.class.length) {
      out += '<h3 style="margin-top:16px">Черты ' + (ch.profile.mode === 'kindredclass' ? 'род-класса' : 'класса') + ' — ' + esc(ch.profile.ru) + '</h3>' + traitList(ch.traits.class);
    }
    if (ch.profile.mode === 'kindredclass') {
      out += '<div class="callout"><b>Важно:</b> ты играешь по схеме ' + T('род-класс', 'kindred-class') +
        ' — черты рода из основной части книги <b>не применяются</b>. Действуют только перечисленные здесь.</div>';
    }
    return '<div class="card"><h2>Особые черты <span class="en">Traits</span></h2>' + out + '</div>';
  }

  function traitList(list) {
    return '<div class="cheat">' + list.map(function (t) {
      return '<details><summary>' + esc(t.ru) + ' <span class="en">' + esc(t.en) + '</span></summary>' +
        '<div class="body"><p>' + esc(t.d) + '</p>' + (t.p ? '<p class="muted" style="font-size:.78rem;margin:0">Player’s Book, стр. ' + t.p + '</p>' : '') + '</div></details>';
    }).join('') + '</div>';
  }

  /* ================= Магия ================= */
  function magicCard(ch) {
    var m = ch.magic || {};
    var blocks = [];

    if (m.glamours && m.glamours.length) {
      blocks.push('<h3>' + T('Гламуры', 'glamour') + ' <span class="en">Glamours</span></h3>' +
        '<p class="muted" style="margin-top:-4px;font-size:.86rem">Работают мыслью — без слов и жестов. Их <b>нельзя сорвать</b>, и объявлять заранее не надо. Если в описании не сказано иное, пользоваться можно сколько угодно раз в день.</p>' +
        '<div class="cheat">' + m.glamours.map(function (g) {
          return '<details open><summary>' + esc(g.ru) + ' <span class="en">' + esc(g.en) + '</span></summary>' +
            '<div class="body"><p class="muted" style="font-size:.82rem">Длительность: ' + esc(g.dur) + ' · Дистанция: ' + esc(g.range) + '</p><p>' + esc(g.d) + '</p></div></details>';
        }).join('') + '</div>');
    }

    if (m.lesserRunes && m.lesserRunes.length) {
      blocks.push('<h3 style="margin-top:16px">' + T('Руны фей', 'rune') + ' <span class="en">Fairy Runes</span></h3>' +
        '<p class="muted" style="margin-top:-4px;font-size:.86rem">Малая руна на 1–4 уровне — <b>раз в день</b>. Намерение применить руну надо объявить <b>до броска инициативы</b>, двигаться в этот раунд нельзя, и если тебя ранят раньше твоей инициативы — руна сорвана и потрачена.</p>' +
        '<div class="cheat">' + m.lesserRunes.map(function (r) {
          return '<details open><summary>' + esc(r.ru) + ' <span class="en">' + esc(r.en) + '</span></summary>' +
            '<div class="body"><p class="muted" style="font-size:.82rem">Длительность: ' + esc(r.dur) + ' · Дистанция: ' + esc(r.range) + '</p><p>' + esc(r.d) + '</p></div></details>';
        }).join('') + '</div>');
    }

    if (m.knack) {
      blocks.push('<h3 style="margin-top:16px">' + T('Сноровка', 'knack') + ': ' + esc(m.knack.ru) + ' <span class="en">' + esc(m.knack.en) + '</span></h3>' +
        '<p style="font-size:.9rem">' + esc(m.knack.d) + '</p>' +
        '<div class="cheat">' + m.knack.levels.map(function (l) {
          var have = l.lv <= ch.level;
          return '<details' + (have ? ' open' : '') + '><summary>' + (have ? '✔ ' : '🔒 ') + esc(l.ru) + ' — ' + l.lv + ' уровень <span class="en">' + esc(l.en) + '</span></summary>' +
            '<div class="body"><p>' + esc(l.d) + '</p></div></details>';
        }).join('') + '</div>');
    }

    if (m.symbioticFlesh && m.symbioticFlesh.length) {
      blocks.push('<h3 style="margin-top:16px">Симбиотическая плоть <span class="en">Symbiotic Flesh</span></h3>' +
        '<ul style="margin:0;padding-left:20px">' + m.symbioticFlesh.map(function (s) {
          return '<li>' + esc(s.ru) + ' <span class="en">' + esc(s.en) + '</span></li>';
        }).join('') + '</ul>' +
        '<p class="muted" style="font-size:.84rem">На каждом новом уровне добавляется ещё одна случайная черта.</p>');
    }

    if (m.spellBook) {
      blocks.push('<h3 style="margin-top:16px">' + T('Книга заклинаний', 'memorise') + ': «' + esc(m.spellBook.ru) + '» <span class="en">' + esc(m.spellBook.en) + '</span></h3>' +
        '<div class="callout"><b>Как это работает.</b> После ночного отдыха потрать 1 час с книгой в руках и <b>заучи одно</b> заклинание 1 ранга (на 1 уровне — только одно в день). ' +
        'Применив его, ты стираешь его из памяти до следующего заучивания. Творя заклинание, надо говорить и иметь одну свободную руку; ' +
        'намерение объявляется <b>до броска инициативы</b>, двигаться в этот раунд нельзя, и удар до твоей инициативы срывает заклинание (и оно всё равно считается потраченным).</div>' +
        '<div class="cheat">' + m.spellBook.spells.map(function (s) {
          return '<details><summary>' + esc(s.ru) + ' <span class="en">' + esc(s.en) + '</span></summary>' +
            '<div class="body"><p class="muted" style="font-size:.82rem">Ранг ' + s.rank + ' · Длительность: ' + esc(s.dur) + ' · Дистанция: ' + esc(s.range) + '</p><p>' + esc(s.d) + '</p></div></details>';
        }).join('') + '</div>');
    }

    if (m.holySpells && m.holySpells.length) {
      blocks.push('<h3 style="margin-top:16px">' + T('Святая магия', 'holy-magic') + '</h3>' +
        '<div class="callout good"><b>У тебя свобода выбора.</b> Каждое утро после ночного отдыха молись 1 час — и получай <b>любое</b> заклинание нужного ранга из списка книги. ' +
        'Ниже — что выпало при генерации, но менять можно каждый день. Нужен ' + T('святой символ', 'holy-symbol') + '.</div>' +
        '<div class="cheat">' + m.holySpells.map(function (s) {
          return '<details open><summary>' + esc(s.ru) + ' <span class="en">' + esc(s.en) + '</span></summary>' +
            '<div class="body"><p class="muted" style="font-size:.82rem">Молитва: «' + esc(s.prayer) + '» · ' + esc(s.saint) + ' · Длительность: ' + esc(s.dur) + ' · Дистанция: ' + esc(s.range) + '</p><p>' + esc(s.d) + '</p></div></details>';
        }).join('') + '</div>' +
        '<details class="cheat" style="margin-top:10px"><summary style="padding:9px 0">Все святые заклинания 1 ранга — на выбор</summary><div class="body" style="padding-left:0">' +
        '<ul style="margin:0;padding-left:18px;font-size:.88rem">' + DW.HOLY_R1.map(function (s) {
          return '<li><b>' + esc(s.ru) + '</b> <span class="en">' + esc(s.en) + '</span> — ' + esc(s.d.slice(0, 160)) + '…</li>';
        }).join('') + '</ul></div></details>');
    } else if (ch.profile.id === 'cleric') {
      blocks.push('<div class="callout"><b>Заклинаний пока нет.</b> Клирик получает ' + T('святую магию', 'holy-magic') + ' со <b>2 уровня</b>, доказав свою преданность. ' +
        'Зато ' + T('изгонять нежить', 'turn-undead') + ' ты умеешь уже сейчас.</div>');
    }

    if (m.spellsPerDay) {
      blocks.push('<p class="muted" style="font-size:.86rem">Заклинаний в день на 1 уровне по рангам: ' +
        m.spellsPerDay.map(function (n, i) { return (i + 1) + ' ранг — ' + (n || '—'); }).join(' · ') + '</p>');
    }

    if (ch.liege) {
      blocks.push('<h3 style="margin-top:16px">Сюзерен</h3><p><b>' + esc(ch.liege.ru) + '</b> <span class="en">' + esc(ch.liege.en) + '</span> — ' + esc(ch.liege.d) + '</p>' +
        '<p class="muted" style="font-size:.84rem">Твоё мировоззрение обязано совпадать с мировоззрением сюзерена. На 1–2 уровне ты ещё <b>оруженосец</b> (squire), настоящим рыцарем станешь на 3 уровне.</p>');
    }

    if (!blocks.length) {
      blocks.push('<p class="muted">У этого персонажа нет магических способностей. Зато есть руки, голова и хорошее оружие.</p>');
    }

    return '<div class="card"><h2>Магия и особые дары <span class="en">Magic</span></h2>' + blocks.join('') + '</div>';
  }

  /* ================= Снаряжение ================= */
  function equipmentCard(ch) {
    var eq = ch.equipment;
    function li(name, en, meta, note) {
      return '<li><span>' + esc(name) + (en ? ' <span class="en">' + esc(en) + '</span>' : '') +
        (note ? '<br><span class="muted" style="font-size:.78rem">' + esc(note) + '</span>' : '') + '</span>' +
        (meta ? '<span class="meta">' + esc(meta) + '</span>' : '') + '</li>';
    }
    var equippedHtml = '';
    if (eq.armour && eq.armour.id !== 'none') equippedHtml += li(eq.armour.ru, eq.armour.en, 'КБ ' + eq.armour.ac + ' · ' + eq.armour.bulkRu + ' · ' + eq.armour.slots + ' сл.');
    if (eq.shield) equippedHtml += li('Щит', 'Shield', '+1 КБ · 1 сл.');
    (eq.weapons || []).forEach(function (w) {
      equippedHtml += li(w.ru, w.en, w.dmg + ' · ' + (w.slots || 1) + ' сл.', qualNote(w) + (w.range ? ' · дистанции ' + w.range + ' футов' : ''));
    });
    (eq.equipped || []).forEach(function (g) { equippedHtml += li(g.ru, g.en, (g.slots ? g.slots + ' сл.' : '—'), g.d); });

    var stowedHtml = (eq.stowed || []).map(function (g) {
      return li(g.ru + (g.qty > 1 ? ' ×' + g.qty : ''), g.en, (g.slots ? g.slots + ' сл.' : '—'), g.d);
    }).join('');

    return '<div class="card">' +
      '<h2>Снаряжение <span class="en">Equipment</span></h2>' +
      '<div class="grid two">' +
        '<div><h3>На себе <span class="muted" style="font-weight:400;font-size:.8rem">(' + ch.speed.equipped + ' из 10 слотов)</span></h3>' +
          '<ul class="item-list">' + equippedHtml +
          li('Поясной кошель: ' + ch.gold + ' зм и безделушка', 'Belt pouch', '1 сл.') + '</ul></div>' +
        '<div><h3>В рюкзаке <span class="muted" style="font-weight:400;font-size:.8rem">(' + ch.speed.stowed + ' из 10 слотов)</span></h3>' +
          '<ul class="item-list">' + stowedHtml + '</ul></div>' +
      '</div>' +
      '<div class="callout"><b>' + T('Безделушка', 'trinket') + ':</b> ' + esc(ch.trinket.ru) +
        '<br><span class="en">' + esc(ch.trinket.en) + '</span></div>' +
      '<p class="muted" style="font-size:.84rem">' + T('Нагрузка', 'encumbrance') + ' по слотам: 0–3 слота на себе → Скорость 40; 4–5 → 30; 6–7 → 20; 8–10 → 10. ' +
        'Достать вещь из рюкзака в бою — целый раунд. Броню и оружие можно бросить, чтобы удрать быстрее.</p>' +
      '</div>';
  }

  /* ================= Личность ================= */
  function personaCard(ch) {
    var d = ch.details || {};
    var rows = Object.keys(d).map(function (k) {
      return '<dt>' + esc(d[k].label) + '</dt><dd>' + esc(d[k].ru) + ' <span class="en">' + esc(d[k].en) + '</span></dd>';
    }).join('');
    var ph = ch.physical || {};
    var phRows = '';
    if (ph.age) phRows += '<dt>Возраст</dt><dd>' + ph.age + ' лет' + (ph.lifespan ? ' (срок жизни: ' + (typeof ph.lifespan === 'number' ? ph.lifespan + ' лет' : ph.lifespan) + ')' : '') + '</dd>';
    if (ph.heightCm) phRows += '<dt>Рост</dt><dd>' + ph.heightCm + ' см (' + esc(ph.heightImperial) + ')</dd>';
    if (ph.weightKg) phRows += '<dt>Вес</dt><dd>' + ph.weightKg + ' кг (' + ph.weightLbs + ' фунтов)</dd>';

    return '<div class="card">' +
      '<h2>Кто он такой <span class="en">Persona</span></h2>' +
      '<div class="grid two">' +
        '<div><dl class="kv">' +
          '<dt>' + T('Прошлое', 'background') + '</dt><dd>' + esc(ch.background.ru) + ' <span class="en">' + esc(ch.background.en) + '</span></dd>' +
          '<dt>' + T('Мировоззрение', 'alignment') + '</dt><dd>' + esc(ch.alignment.ru) + ' — <span class="dim">' + esc(ch.alignment.d) + '</span></dd>' +
          '<dt>Языки</dt><dd>' + ch.languages.map(function (l) { return esc(l.ru) + ' <span class="en">(' + esc(l.en) + ')</span>'; }).join(', ') + '</dd>' +
          phRows +
        '</dl></div>' +
        '<div><dl class="kv">' + rows + '</dl></div>' +
      '</div>' +
      (ch.moonSign ? '<div class="callout"><b>' + T('Лунный знак', 'moon-sign') + ':</b> ' + esc(ch.moonSign.moon) + ' луна, ' + esc(ch.moonSign.phase) +
        ' <span class="en">(' + esc(ch.moonSign.en) + ')</span><br>' + esc(ch.moonSign.d) + '</div>'
        : (ch.kindred.type === 'fairy' ? '<p class="muted" style="font-size:.84rem">Лунного знака нет: феи рождены не в смертном мире и власти луны не подвластны.</p>' : '')) +
      '<label class="field no-print" style="margin-top:14px"><span>Заметки игрока</span>' +
      '<textarea id="notes" placeholder="Что случилось на сессии, кому ты должен, что задумал…">' + esc(ch.notes || '') + '</textarea></label>' +
      '<div class="btn-row no-print"><button class="small" id="btn-notes">Сохранить заметки</button>' +
      '<button class="small" id="btn-xp">Изменить опыт (сейчас ' + (ch.xp || 0) + ' XP)</button></div>' +
      '</div>';
  }

  /* ================= Промпт для портрета ================= */
  function portraitCard(ch) {
    var p = ch.portraitPrompt || (DW.portraitPrompt ? DW.portraitPrompt(ch) : { en: '', ru: '' });
    return '<div class="card">' +
      '<h2>Промпт для портрета <span class="en">Portrait prompt</span></h2>' +
      '<p class="muted" style="margin-top:-4px">Скопируй и вставь в любой генератор изображений. Английский вариант обычно даёт результат лучше.</p>' +
      '<h3>English</h3>' +
      '<div class="prompt-box" id="prompt-en">' + esc(p.en) + '</div>' +
      '<div class="btn-row no-print" style="margin:8px 0 16px"><button class="small" data-copy="prompt-en">📋 Скопировать</button></div>' +
      '<h3>По-русски</h3>' +
      '<div class="prompt-box" id="prompt-ru">' + esc(p.ru) + '</div>' +
      '<div class="btn-row no-print" style="margin-top:8px"><button class="small" data-copy="prompt-ru">📋 Скопировать</button></div>' +
      '</div>';
  }

  /* ================= Журнал бросков ================= */
  function logCard(ch) {
    return '<div class="card">' +
      '<div class="card-head"><h2>Журнал бросков <span class="en">Roll log</span></h2>' +
      '<span class="badge">контрольная сумма ' + esc(ch.checksum || '—') + '</span></div>' +
      '<p class="muted" style="margin-top:-4px">Здесь записан каждый бросок при создании персонажа. Покажи гейм-мастеру — он увидит, что ничего не подкручено.</p>' +
      '<details class="cheat"><summary style="padding:9px 0">Показать все ' + (ch.log || []).length + ' записей</summary><div class="body" style="padding-left:0">' +
      '<table class="log-table"><thead><tr><th>#</th><th>Шаг</th><th>Что бросали</th><th>Кости</th><th>Итог</th><th>Результат</th></tr></thead><tbody>' +
      (ch.log || []).map(function (e) {
        return '<tr><td class="dim">' + e.i + '</td><td class="dim">' + esc(e.step) + '</td>' +
          '<td>' + esc(e.label) + '</td>' +
          '<td class="d">' + esc(e.notation) + (e.dice && e.dice.length ? ' [' + e.dice.join(', ') + ']' : '') + '</td>' +
          '<td class="d">' + (e.total === null || e.total === undefined ? '—' : e.total) + '</td>' +
          '<td>' + esc(e.result || '') + '</td></tr>';
      }).join('') +
      '</tbody></table></div></details></div>';
  }

  /* ================= JSON ================= */
  function jsonCard(ch) {
    return '<div class="card no-print">' +
      '<div class="card-head"><h2>JSON для гейм-мастера</h2>' +
      '<div class="btn-row"><button class="small" data-copy="json-box">📋 Скопировать</button>' +
      '<button class="small" id="btn-json2">⬇ Скачать файл</button></div></div>' +
      '<pre class="json" id="json-box">' + esc(JSON.stringify(ch, null, 2)) + '</pre></div>';
  }

  /* ================= Шпаргалка ================= */
  function cheatCard(ch) {
    var isSmall = ch.kindred.size === 'Small';
    var isFey = ch.kindred.type === 'fairy' || ch.kindred.type === 'demi-fey';
    var b = ch.skills.basic;

    var personal = [];
    if (isSmall) personal.push('Ты <b>' + T('Малого размера', 'small-size') + '</b>: ' + T('Большое оружие', 'large-weapon') + ' (лэнс, длинный лук, древковое, двуручный меч) тебе недоступно, а броню нужно подгонять по росту.');
    if (ch.kindred.id === 'grimalkin' || ch.kindred.id === 'woodgrue') personal.push('В ближнем бою с <b>Большими</b> существами твой КБ выше на 2 → <b>' + (ch.ac.value + 2) + '</b>.');
    if (isFey) personal.push('Ты уязвим к <b>' + T('холодному железу', 'cold-iron') + '</b>: такое оружие наносит тебе +1 урона. Феям вдобавок мерзко прикасаться к смертному серебру.');
    if (ch.kindred.type === 'fairy') personal.push('Ты <b>' + T('фея', 'fairy') + '</b>: не стареешь, не болеешь немагическими болезнями и не умираешь от голода и жажды (но без еды становишься отчаянным и жестоким). Клириком или монахом стать не можешь.');
    if (ch.kindred.id === 'mossling' && ch.profile.mode === 'class') personal.push('<b>Стойкость:</b> +2 ко <b>всем</b> спасброскам и +4 против грибных спор и ядов. Числа спасбросков в карточке выше уже <b>без</b> этого бонуса — прибавляй его сам.');
    if (ch.kindred.id === 'mossling' && ch.profile.mode === 'kindredclass') personal.push('<b>Стойкость:</b> твои спасброски и так лучшие в игре, плюс ещё +2 против грибных спор и ядов.');
    if (ch.kindred.id === 'breggle') personal.push('<b>Шерсть</b> даёт +1 КБ, только пока ты без брони или в Лёгкой броне. Наденешь кольчугу — бонус пропадёт.');
    if (ch.kindred.id === 'human') personal.push('<b>Задор:</b> +10% ко всему опыту. <b>Решительность:</b> при ничьей в ' + T('инициативе', 'initiative') + ' ты ходишь первым.');
    if (ch.kindred.id === 'woodgrue') personal.push('<b>Лунное зрение:</b> ты видишь в темноте на 60 футов и не получаешь штрафов за тусклый свет. Факел партии тебе не нужен — но мелкие надписи в темноте не прочтёшь.');
    if (ch.kindred.id === 'woodgrue') personal.push('<b>Неудержимое ликование:</b> увидев праздник, ты обязан присоединиться. Чтобы удержаться — спасбросок против Заклинания, но потом весь праздник ходишь подавленным.');
    if (ch.profile.id === 'friar' || ch.profile.id === 'cleric') personal.push('Ты не можешь быть <b>Хаотичным</b>. Отступишь от заповедей — потеряешь святую магию, пока не искупишь.');
    if (ch.profile.id === 'friar') personal.push('<b>Бедность:</b> всё лишнее богатство надо жертвовать на добрые дела (не другим игрокам!). Брони не носишь вовсе — тебя защищает <b>Броня веры</b>.');
    if (ch.profile.id === 'knight') personal.push('<b>Метательным и стрелковым оружием ты не пользуешься</b> — рыцарь считает это бесчестным. И носишь только Среднюю или Тяжёлую броню.');
    if (ch.profile.id === 'magician' || ch.profile.id === 'friar') personal.push('Ты <b>' + T('невоинский', 'combat-aptitude') + '</b> класс с ' + ch.hp.max + ' хитами. В первый ряд не лезь: одна стрела — и всё.');
    if (ch.hp.max <= 3) personal.push('<b>У тебя ' + ch.hp.max + ' ' + (ch.hp.max === 1 ? 'хит' : 'хита') + '.</b> В Dolmenwood при 0 хитов персонаж <b>умирает</b> — не «падает без сознания». Прячься за спины, отступай, договаривайся.');
    personal.push('Твой ' + T('модификатор опыта', 'prime-ability') + ': <b>' + fm(ch.xpModifier) + '%</b>. До 2 уровня нужно <b>' + (ch.xpForNextLevel || '?') + ' XP</b>.');

    return '<div class="card cheat">' +
      '<h2>Шпаргалка: как этим играть</h2>' +
      '<p class="muted" style="margin-top:-4px">Всё с пунктирным подчёркиванием — наведи (или ткни на телефоне), появится объяснение термина.</p>' +

      '<details open><summary>⚡ Твоя личная специфика — прочти первым делом</summary><div class="body">' +
        '<ul>' + personal.map(function (p) { return '<li style="margin-bottom:6px">' + p + '</li>'; }).join('') + '</ul>' +
      '</div></details>' +

      '<details><summary>🎲 Четыре броска, которые решают всё</summary><div class="body">' +
        '<p><b>1. ' + T('Бросок атаки', 'attack-roll') + '</b> — d20 + бонус. Нужно набрать ' + T('КБ', 'ac') + ' противника или больше. Твои числа — в таблице «Твои атаки».</p>' +
        '<p><b>2. ' + T('Спасбросок', 'saving-throw') + '</b> — d20, нужно выбросить <b>цель или больше</b>. Пять категорий: ' +
          T('Рок', 'save-doom') + ' (яд, смерть), ' + T('Луч', 'save-ray') + ' (увернуться), ' + T('Захват', 'save-hold') + ' (паралич), ' +
          T('Взрыв', 'save-blast') + ' (по площади), ' + T('Заклинание', 'save-spell') + ' (магия по тебе). Против магии прибавь ' + fm(ch.magicResistance) + '.</p>' +
        '<p><b>3. ' + T('Проверка навыка', 'skill-check') + '</b> — d6, нужно <b>цель или больше</b>. Твои цели: Слушать ' + b.listen + '+, Обыскивать ' + b.search + '+, Выживание ' + b.survival + '+.</p>' +
        '<p><b>4. ' + T('Проверка характеристики', 'ability-check') + '</b> — d6 + модификатор, нужно <b>4 или больше</b>. Бросается, когда дело в чистой силе/ловкости/смекалке.</p>' +
        '<div class="callout"><b>Запомни разницу:</b> на d20 (атака, спасбросок) — <b>больше = лучше</b>. На d6 (навыки) — тоже больше, но <b>цель чем меньше, тем лучше</b>. ' +
          'Натуральные 1 и 20 (на d20) и 1 и 6 (на d6) — всегда провал и всегда успех, независимо от модификаторов.</div>' +
      '</div></details>' +

      '<details><summary>⚔️ Раунд боя — по шагам</summary><div class="body">' +
        '<p><b>1. Объявления.</b> До броска инициативы объяви, если собираешься творить заклинание, применять ' + T('руну', 'rune') + ' или бежать из ближнего боя. Остальное объявлять не надо.</p>' +
        '<p><b>2. ' + T('Инициатива', 'initiative') + '.</b> Каждая сторона бросает 1d6. Чей результат выше — тот ходит первым. Бросается <b>заново каждый раунд</b>.</p>' +
        '<p><b>3. Сторона победителя действует</b> в порядке: перемещение → стрельба → магия → ближний бой.</p>' +
        '<p><b>4. Другая сторона</b> — то же самое.</p>' +
        '<p><b>5. ' + T('Мораль', 'morale') + '.</b> Рефери проверяет, не побегут ли монстры.</p>' +
        '<p>За раунд ты можешь <b>переместиться и совершить одно действие</b>. Действия: атака, заклинание/руна/гламур, выпить зелье, активировать магический предмет. ' +
          'Творя заклинание или руну, двигаться нельзя. Гламуры — исключение: с ними двигаться можно, и сорвать их нельзя.</p>' +
        '<div class="callout danger"><b>Бегство из ближнего боя</b> надо объявлять заранее, ты теряешь атаку, а противники получают +2 к атаке по тебе и игнорируют бонус твоего щита. ' +
          'Убегать — часто правильно, но делай это не в последний момент.</div>' +
        '<p class="muted">В ближнем бою можно двигаться на половину Скорости (' + Math.floor(ch.speed.value / 2) + ' футов). Вне боя — на полную (' + ch.speed.value + '). Бег — ' + (ch.speed.value * 3) + ' футов за раунд.</p>' +
      '</div></details>' +

      '<details><summary>🤝 Встреча: до того, как достали мечи</summary><div class="body">' +
        '<p><b>Порядок:</b> Рефери решает, кто кого заметил → бросок ' + T('внезапности', 'surprise') + ' (1d6, при 1–2 сторона застигнута врасплох и пропускает раунд) → ' +
          'дистанция встречи (в подземелье 2d6×10 футов, на воздухе 2d6×30) → инициатива → действия.</p>' +
        '<p><b>' + T('Бросок реакции', 'reaction') + ':</b> Рефери кидает 2d6, чтобы понять настрой встреченных. К броску прибавляется модификатор ' +
          'Харизмы того, кто заговорил. Твоя Харизма ' + ch.abilities.CHA + ' (' + fm(ch.mods.CHA) + ').</p>' +
        '<div class="callout good"><b>Главный совет новичку.</b> Dolmenwood — это OSR: бой здесь смертельно опасен и <b>почти не даёт опыта</b>. ' +
          'Три четверти всего опыта партия получает за <b>вынесенные сокровища</b> — 1 XP за 1 золотой. Поэтому выгоднее прокрасться, подкупить, обмануть или убежать, чем драться. ' +
          'Сбежать — не позор, а нормальная тактика.</div>' +
      '</div></details>' +

      '<details><summary>🕯 Подземелье, свет и время</summary><div class="body">' +
        '<p>В подземелье время идёт ' + T('ходами', 'turn') + ' (10 минут). За ход партия проходит <b>Скорость ×3</b> футов по неизвестной территории — у тебя ' + (ch.speed.value * 3) + ' футов. ' +
          'По уже нанесённым на карту местам — в 10 раз быстрее.</p>' +
        '<p><b>Свет.</b> Факел горит 1 час (6 ходов) и светит на 30 футов. Фонарь светит на 30 футов и жжёт флакон масла за 4 часа. ' +
          'В тусклом свете — <b>−2</b> к атакам и половина Скорости. В полной темноте — <b>−4</b> к атакам, КБ и спасброскам и Скорость 10.</p>' +
        '<p><b>Каждый ход считается расход:</b> факелы, масло, еда, вода, длительность заклинаний. Рефери периодически бросает на блуждающих чудовищ — не топчись на месте.</p>' +
      '</div></details>' +

      '<details><summary>🌲 Путешествие и лагерь</summary><div class="body">' +
        '<p>В пути ты получаешь <b>Скорость ÷ 5</b> очков пути в день — у тебя <b>' + Math.floor(ch.speed.value / 5) + '</b>. Ими оплачивается пересечение гексов разной местности.</p>' +
        '<p>Скорость партии = скорость <b>самого медленного</b>. Если ты нагрузился железом, тормозишь всех.</p>' +
        '<p><b>Ночлег.</b> В диком лагере — проверка Телосложения, чтобы нормально выспаться. Без ночного отдыха заклинатели не восстанавливают заклинания. ' +
          'Замерзать без зимнего плаща — 1d4 хита в день.</p>' +
        '<p><b>Еда.</b> Сушёные рационы портятся за неделю в сырости (грибной лес, подземелья!). Искать еду в лесу — проверка Выживания (у тебя ' + b.survival + '+' +
          (b.survivalForaging ? ', при собирательстве ' + b.survivalForaging + '+' : '') + ').</p>' +
      '</div></details>' +

      '<details><summary>💀 Ранения, смерть и лечение</summary><div class="body">' +
        '<div class="callout danger"><b>0 хитов = смерть.</b> Не «при смерти», не «без сознания». Умер. Именно поэтому в Dolmenwood осторожность — главный навык.</div>' +
        '<p>Восстановить хиты можно отдыхом и лечением. Магическое лечение на 1 уровне доступно монаху (Малое исцеление, 1d6+1) — если он есть в партии.</p>' +
        '<p>Персонаж, убитый разрушительным эффектом (молния и т.п.), теряет и снаряжение. Магические предметы могут получить спасбросок против Рока.</p>' +
        '<p class="muted">Если твой персонаж всё же погиб — отметь его в каталоге как погибшего и сгенерируй нового в два клика. История партии сохранится.</p>' +
      '</div></details>' +

      '<details><summary>📈 Как расти</summary><div class="body">' +
        '<p>' + T('Опыт', 'xp') + ' начисляется в конце приключения, когда партия вернулась в безопасное место. Источники:</p>' +
        '<ul><li><b>Сокровища:</b> 1 XP за 1 золотой стоимости вынесенной добычи. Обычно ¾ всего опыта.</li>' +
        '<li><b>Побеждённые враги:</b> не обязательно убитые — обманутые, захваченные, отпугнутые тоже считаются.</li></ul>' +
        '<p>Общий опыт делится <b>поровну</b> на всех выживших, вне зависимости от того, как поделили добычу. Затем к твоей доле применяется твой модификатор <b>' + fm(ch.xpModifier) + '%</b>.</p>' +
        '<p>За одну сессию нельзя подняться больше чем на один уровень. До 2 уровня тебе нужно <b>' + (ch.xpForNextLevel || '?') + ' XP</b>.</p>' +
      '</div></details>' +

      '<details><summary>🗣 Отыгрыш и мир Дольменвуда</summary><div class="body">' +
        '<p><b>Твоё прошлое:</b> ' + esc(ch.background.ru) + '. Механики оно не даёт, но Рефери учтёт его, решая, что ты умеешь без броска.</p>' +
        (ch.details.demeanour ? '<p><b>Нрав:</b> ' + esc(ch.details.demeanour.ru) + '. <b>Речь:</b> ' + esc(ch.details.speech ? ch.details.speech.ru : '—') + '.</p>' : '') +
        (ch.details.desires ? '<p><b>Желание:</b> ' + esc(ch.details.desires.ru) + '. <b>Убеждение:</b> ' + esc(ch.details.beliefs ? ch.details.beliefs.ru : '—') + '. Это отличные крючки: тащи их в игру.</p>' : '') +
        '<p><b>Три силы, о которых стоит знать:</b> ' + T('Плюритинская Церковь', 'church') + ' (господствующая вера, сто святых), ' +
          T('Друны', 'drune') + ' (зловещий культ у стоячих камней) и ' + T('Наг-Лорд', 'nag-lord') + ' (полуединорог, «Король Леса», сила Хаоса на севере).</p>' +
        '<p><b>Фейри</b> рядом. С феями <b>всё решают слова</b>: подарки обязывают, имена имеют власть, обещания связывают буквально. Не бери у фей даров, не подумав, и не называй своего истинного имени.</p>' +
        '<p><b>' + T('Волдийский', 'woldish') + '</b> понимают почти все. Ты знаешь: ' + ch.languages.map(function (l) { return esc(l.ru); }).join(', ') + '.</p>' +
      '</div></details>' +

      '<details><summary>❓ Что делать, если…</summary><div class="body">' +
        '<p><b>…не знаешь, что бросать?</b> Просто скажи, что делает персонаж. Рефери сам решит, нужен ли бросок. Часто не нужен — ' +
          'изобретательность обходит опасность без костей.</p>' +
        '<p><b>…дверь заперта?</b> Взломать (проверка Силы), найти ключ, обойти, вынести петли ломом, попросить кого-то умелого. Вор может ' + T('вскрыть замок', 'skill-check') + '.</p>' +
        '<p><b>…видишь ловушку?</b> Ткни в неё десятифутовым шестом. Всерьёз: шест — лучший предмет в игре.</p>' +
        '<p><b>…бой идёт плохо?</b> Беги. Объяви отступление, брось мешок с добычей (жадные преследователи с шансом 3 из 6 остановятся), кинь горящее масло на пути.</p>' +
        '<p><b>…надо решить, кто первым идёт в темноту?</b> Тот, у кого больше хитов и лучше КБ. Проверь по листам партии, а не по храбрости.</p>' +
        '<p><b>…забыл правило?</b> Спроси Рефери прямо. Это нормально и никого не бесит.</p>' +
      '</div></details>' +
      '</div>';
  }

  /* ================= Обработчики ================= */
  function wire(root, ch) {
    root.querySelector('#btn-print').onclick = function () { window.print(); };
    var jsonBtns = [root.querySelector('#btn-json'), root.querySelector('#btn-json2')];
    jsonBtns.forEach(function (b) { if (b) b.onclick = function () { DW.store.exportOne(ch); DW.toast('Файл скачан'); }; });

    var hpCur = root.querySelector('#hp-cur');
    function setHp(v) {
      v = Math.max(0, Math.min(ch.hp.max, v));
      ch.hp.current = v;
      hpCur.textContent = v;
      hpCur.style.color = v === 0 ? 'var(--blood)' : (v <= ch.hp.max / 3 ? 'var(--blood)' : '');
      DW.store.save(ch);
      if (v === 0) DW.toast('0 хитов — персонаж погиб');
    }
    root.querySelector('#hp-minus').onclick = function () { setHp(ch.hp.current - 1); };
    root.querySelector('#hp-plus').onclick = function () { setHp(ch.hp.current + 1); };

    var nb = root.querySelector('#btn-notes');
    if (nb) nb.onclick = function () {
      ch.notes = root.querySelector('#notes').value;
      DW.store.save(ch); DW.toast('Заметки сохранены');
    };
    var xb = root.querySelector('#btn-xp');
    if (xb) xb.onclick = function () {
      var v = prompt('Сколько всего опыта у персонажа?', ch.xp || 0);
      if (v === null) return;
      var n = parseInt(v, 10);
      if (isNaN(n) || n < 0) { alert('Нужно целое неотрицательное число.'); return; }
      ch.xp = n; DW.store.save(ch);
      xb.textContent = 'Изменить опыт (сейчас ' + n + ' XP)';
      if (ch.xpForNextLevel && n >= ch.xpForNextLevel) DW.toast('Хватает на 2 уровень!');
      else DW.toast('Опыт сохранён');
    };

    root.addEventListener('click', function (e) {
      var b = e.target.closest('[data-copy]');
      if (!b) return;
      var el = root.querySelector('#' + b.getAttribute('data-copy'));
      if (!el) return;
      copy(el.textContent);
    });
  }

  function copy(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { DW.toast('Скопировано'); },
        function () { fallback(text); });
    } else fallback(text);
    function fallback(t) {
      var ta = document.createElement('textarea');
      ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); DW.toast('Скопировано'); } catch (err) { DW.toast('Не удалось скопировать'); }
      document.body.removeChild(ta);
    }
  }

  DW.views = DW.views || {};
  DW.views.character = render;
})();
