/* Блок «Перенос в VTT-лист»: та же разбивка по вкладкам и те же английские
   названия полей, что на игровом сайте. Значения даны по-английски — именно в
   том виде, в каком их надо вбивать. */
(function () {
  'use strict';
  var esc = DW.esc;

  function fm(n) { return (n >= 0 ? '+' : '') + n; }

  /* ---------- мелкие строительные блоки, повторяющие вёрстку VTT ---------- */

  function panel(titleEn, titleRu, inner) {
    return '<div class="vtt-panel">' +
      '<div class="vtt-panel-head">' + esc(titleEn) +
        (titleRu ? ' <span class="vtt-ru">' + esc(titleRu) + '</span>' : '') + '</div>' +
      '<div class="vtt-panel-body">' + inner + '</div></div>';
  }

  /* Поле: английская подпись (как на сайте) + русская сноска + значение для ввода. */
  function field(labelEn, labelRu, value, hint) {
    return '<div class="vtt-field">' +
      '<div class="vtt-label">' + esc(labelEn) +
        (labelRu ? '<span class="vtt-ru">' + esc(labelRu) + '</span>' : '') + '</div>' +
      '<div class="vtt-value' + (value === '' || value === null || value === undefined ? ' empty' : '') + '">' +
        (value === '' || value === null || value === undefined ? '—' : esc(String(value))) + '</div>' +
      (hint ? '<div class="vtt-hint">' + esc(hint) + '</div>' : '') +
      '</div>';
  }

  /* Компактная «ячейка с числом» — для характеристик, спасбросков, навыков. */
  function box(labelEn, labelRu, value, sub) {
    return '<div class="vtt-box">' +
      '<div class="vtt-box-label">' + esc(labelEn) + '</div>' +
      '<div class="vtt-box-value">' + esc(String(value)) + '</div>' +
      (labelRu ? '<div class="vtt-box-ru">' + esc(labelRu) + '</div>' : '') +
      (sub ? '<div class="vtt-box-sub">' + esc(sub) + '</div>' : '') +
      '</div>';
  }

  function row(inner, cls) { return '<div class="vtt-row' + (cls ? ' ' + cls : '') + '">' + inner + '</div>'; }

  /* ---------- подготовка значений ---------- */

  var ABIL_META = {
    STR: { en: 'Strength', ru: 'Сила', sub: 'Melee attacks/damage' },
    INT: { en: 'Intelligence', ru: 'Интеллект', sub: 'Extra languages' },
    WIS: { en: 'Wisdom', ru: 'Мудрость', sub: 'Magic Resistance' },
    DEX: { en: 'Dexterity', ru: 'Ловкость', sub: 'AC and missile attacks' },
    CON: { en: 'Constitution', ru: 'Телосложение', sub: 'Hit Points per Level' },
    CHA: { en: 'Charisma', ru: 'Харизма', sub: 'Reaction Rolls' }
  };

  /* На VTT для схемы «род-класс» и Kindred, и Class называются одинаково. */
  function kindredField(ch) { return ch.kindred.en; }
  function classField(ch) {
    if (ch.profile.mode === 'kindredclass') return ch.kindred.en;
    return ch.profile.en;
  }

  function detailEn(ch, key) {
    var d = ch.details || {};
    if (d[key]) return d[key].en;
    return '';
  }
  /* На VTT есть поле Body, а у брегглей и гримолкинов в книге вместо него Fur. */
  function bodyField(ch) {
    return detailEn(ch, 'body') || detailEn(ch, 'fur') || '';
  }

  function birthdayOf(ch) {
    if (ch.birthday) return ch.birthday;
    if (!ch.moonSign) return null;
    return DW.Generator.birthdayFromMoon(null, ch.moonSign);
  }

  function moonSignEn(ch) {
    if (!ch.moonSign) return '';
    /* «Grinning (W)» -> «Grinning Moon (Waxing)» — как подписано на VTT. */
    var m = /^(.*?)\s*\(([WFw])\)$/.exec(ch.moonSign.en || '');
    if (!m) return ch.moonSign.en || '';
    var phase = m[2] === 'W' ? 'Waxing' : (m[2] === 'F' ? 'Full' : 'Waning');
    return m[1] + ' Moon (' + phase + ')';
  }

  function loadOf(ch) {
    if (ch.speed && ch.speed.load !== undefined) return ch.speed.load;
    return DW.Generator.computeLoad(ch).total;
  }

  function itemsEn(list, counts) {
    return (list || []).filter(function (g) { return !counts || DW.Generator.countsForLoad(g); })
      .map(function (g) { return g.en + (g.qty > 1 ? ' ×' + g.qty : ''); });
  }

  /* ---------- вкладки ---------- */

  function tabStats(ch) {
    var details = panel('Details', 'Детали',
      row(
        field('Name', 'Имя', ch.name.en, 'на VTT латиницей; по-русски: ' + ch.name.ru) +
        field('Kindred', 'Род', kindredField(ch)) +
        field('Class', 'Класс', classField(ch))
      ) +
      row(
        field('Affiliation', 'Принадлежность', ch.liege ? ch.liege.en : '', ch.liege ? 'сюзерен рыцаря' : 'оставь пустым') +
        field('Background', 'Прошлое', ch.background.en, ch.background.ru) +
        field('Alignment', 'Мировоззрение', ch.alignment.en, ch.alignment.ru)
      ) +
      row(
        field('Languages', 'Языки', ch.languages.map(function (l) { return l.en; }).join(', ')) +
        field('Level', 'Уровень', ch.level) +
        field('XP', 'Опыт', (ch.xp || 0) + ' / ' + (ch.xpForNextLevel || '?'),
          'модификатор ' + fm(ch.xpModifier) + '% — на VTT это подпись «XP (' + fm(ch.xpModifier) + '% modifier)»')
      )
    );

    var abilities = panel('Ability Scores', 'Характеристики',
      '<div class="vtt-boxes six">' +
      DW.Generator.ABIL.map(function (a) {
        var m = ABIL_META[a];
        return '<div class="vtt-abil">' +
          '<div class="vtt-box-label">' + esc(m.en) + '</div>' +
          '<div class="vtt-abil-pair">' +
            '<div><span class="vtt-mini">Score</span><b>' + ch.abilities[a] + '</b></div>' +
            '<div><span class="vtt-mini">Mod</span><b>' + ch.mods[a] + '</b></div>' +
          '</div>' +
          '<div class="vtt-box-ru">' + esc(m.ru) + '</div>' +
          '<div class="vtt-box-sub">' + esc(m.sub) + '</div>' +
          '</div>';
      }).join('') + '</div>' +
      '<p class="vtt-note">Модификатор вбивается числом без плюса: на VTT в поле Mod пишется «1», а не «+1».</p>'
    );

    var saves = panel('Save Targets', 'Спасброски',
      '<div class="vtt-boxes six">' +
        box('Doom', 'Рок', ch.saves.doom) +
        box('Ray', 'Луч', ch.saves.ray) +
        box('Hold', 'Захват', ch.saves.hold) +
        box('Blast', 'Взрыв', ch.saves.blast) +
        box('Spell', 'Заклинание', ch.saves.spell) +
        box('Magic Res.', 'Сопр. магии', ch.magicResistance) +
      '</div>');

    var combat = panel('Combat', 'Бой',
      '<div class="vtt-boxes four">' +
        box('HP', 'Хиты', ch.hp.current + ' / ' + ch.hp.max) +
        box('AC', 'Класс Брони', ch.ac.value) +
        box('Attack', 'Атака', ch.attack) +
      '</div>' +
      '<p class="vtt-note">Attack тоже вбивается без плюса. HP: слева текущие, справа максимум.</p>');

    var skillRows = [
      { en: 'Listen', ru: 'Слушать', v: ch.skills.basic.listen },
      { en: 'Search', ru: 'Обыскивать', v: ch.skills.basic.search },
      { en: 'Survival', ru: 'Выживание', v: ch.skills.basic.survival }
    ];
    (ch.skills.class || []).forEach(function (s) { skillRows.push({ en: s.en, ru: s.ru, v: s.target, custom: true }); });
    if (ch.skills.basic.survivalForaging) {
      skillRows.push({ en: 'Survival (foraging)', ru: 'Выживание — собирательство', v: ch.skills.basic.survivalForaging, custom: true });
    }

    var skills = panel('Skill Targets', 'Цели навыков',
      '<div class="vtt-boxes six">' +
        skillRows.map(function (s) { return box(s.en, s.ru, s.v, s.custom ? 'через «+»' : ''); }).join('') +
      '</div>' +
      '<p class="vtt-note">Listen, Search и Survival уже есть на листе. Остальные добавляются кнопкой «+» справа от них.</p>');

    var movement = panel('Movement', 'Движение',
      '<div class="vtt-boxes four">' +
        box('Speed', 'Скорость', ch.speed.value, 'Feet / Round') +
        box('Exploring', 'Исследование', ch.speed.value * 3, 'Feet / Turn') +
        box('Overland', 'Путешествие', Math.floor(ch.speed.value / 5), 'Travel Points / day') +
      '</div>');

    return details + abilities + saves + combat + skills + movement;
  }

  function tabInventory(ch) {
    var load = loadOf(ch);
    var enc = panel('Encumbrance & Exhaustion', 'Нагрузка и истощение',
      '<div class="vtt-boxes four">' +
        box('Speed', 'Скорость', ch.speed.value) +
        box('Load', 'Груз', load + ' / ' + (ch.speed.maxLoad || 1600)) +
        box('New Treasure', 'Новая добыча', 0, 'в начале — 0') +
        box('Exhaustion', 'Истощение', 0, 'в начале — 0') +
      '</div>');

    var coins = panel('Stowed Coins', 'Монеты',
      '<div class="vtt-boxes four">' +
        box('Copper', 'Медные', 0) +
        box('Silver', 'Серебряные', 0) +
        box('Gold', 'Золотые', ch.gold) +
        box('Pellucidium', 'Пеллюцидий', 0) +
      '</div>');

    var eq = ch.equipment;
    var equippedList = [];
    if (eq.armour && eq.armour.id !== 'none') equippedList.push(eq.armour.en);
    if (eq.shield) equippedList.push('Shield');
    (eq.weapons || []).forEach(function (w) { equippedList.push(w.en); });
    equippedList = equippedList.concat(itemsEn(eq.equipped, true));

    var stowedList = itemsEn(eq.stowed, true);
    if (eq.container) stowedList.unshift(eq.container.en);

    var lists = '<div class="vtt-row">' +
      '<div class="vtt-list-col"><div class="vtt-list-head">Equipped Items <span class="vtt-ru">на себе</span></div>' +
        '<ol class="vtt-list">' + equippedList.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ol></div>' +
      '<div class="vtt-list-col"><div class="vtt-list-head">Stowed Items <span class="vtt-ru">в рюкзаке</span></div>' +
        '<ol class="vtt-list">' + stowedList.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ol></div>' +
      '</div>' +
      '<p class="vtt-note">Одежда и поясной кошель не вносятся — по правилу нашего Рефери они не считаются. ' +
        'Безделушка («' + esc(ch.trinket.en) + '») вносится как отдельный предмет либо описывается в Notes.</p>';

    return enc + coins + panel('Items', 'Предметы', lists);
  }

  function tabMagic(ch) {
    var m = ch.magic || {};
    var blocks = [];

    if (m.knack) {
      blocks.push(panel('Mossling Knack', 'Сноровка мослинга',
        row(field('Knack Type', 'Тип сноровки', m.knack.en) +
            field('Unlocked Level', 'Открытый уровень', ch.level)) +
        '<p class="vtt-note">Описания уровней 1/3/5/7 подставятся сами. На 1 уровне доступно: ' + esc(m.knack.levels[0].en) + '.</p>'));
    }
    if (m.glamours && m.glamours.length) {
      blocks.push(panel('Glamours', 'Гламуры',
        '<ol class="vtt-list">' + m.glamours.map(function (g) { return '<li>' + esc(g.en) + '</li>'; }).join('') + '</ol>'));
    }
    if (m.lesserRunes && m.lesserRunes.length) {
      blocks.push(panel('Fairy Runes', 'Руны фей',
        '<ol class="vtt-list">' + m.lesserRunes.map(function (r) { return '<li>' + esc(r.en) + ' <span class="vtt-ru">lesser · once per day</span></li>'; }).join('') + '</ol>'));
    }
    if (m.spellBook) {
      blocks.push(panel('Spell Book', 'Книга заклинаний',
        row(field('Spell Book', 'Название книги', m.spellBook.en)) +
        '<ol class="vtt-list">' + m.spellBook.spells.map(function (s) { return '<li>' + esc(s.en) + ' <span class="vtt-ru">Rank 1</span></li>'; }).join('') + '</ol>' +
        '<p class="vtt-note">Заклинаний в день на 1 уровне: 1 первого ранга.</p>'));
    }
    if (m.holySpells && m.holySpells.length) {
      blocks.push(panel('Holy Spells', 'Святые заклинания',
        '<ol class="vtt-list">' + m.holySpells.map(function (s) { return '<li>' + esc(s.en) + ' <span class="vtt-ru">Rank 1</span></li>'; }).join('') + '</ol>' +
        '<p class="vtt-note">Выбор свободный: каждое утро можно взять любое заклинание доступного ранга.</p>'));
    }
    if (!blocks.length) {
      blocks.push(panel('Magic', 'Магия', '<p class="vtt-note">У этого персонажа магии нет — вкладку можно пропустить.</p>'));
    }
    return blocks.join('');
  }

  function tabTraits(ch) {
    var list = [];
    (ch.traits.kindred || []).forEach(function (t) { list.push({ en: t.en, ru: t.ru, src: 'Kindred' }); });
    (ch.traits.class || []).forEach(function (t) { list.push({ en: t.en, ru: t.ru, src: ch.profile.mode === 'kindredclass' ? 'Kindred' : 'Class' }); });

    return panel((ch.kindred.en + ' Traits').toUpperCase(), 'Черты',
      '<div class="vtt-traits">' + list.map(function (t) {
        return '<div class="vtt-trait"><b>' + esc(t.en) + '</b><span class="vtt-ru">' + esc(t.ru) + '</span></div>';
      }).join('') + '</div>' +
      '<p class="vtt-note">Обычно черты подставляются автоматически, когда выбраны Kindred и Class. ' +
        'Здесь список только чтобы свериться, что ничего не потерялось.</p>');
  }

  function tabExtra(ch) {
    var bd = birthdayOf(ch);
    var ph = ch.physical || {};

    var appearance = panel('Extra Details — Appearance', 'Внешность',
      row(field('Head', 'Голова', detailEn(ch, 'head')) +
          field('Face', 'Лицо', detailEn(ch, 'face'))) +
      row(field('Dress', 'Одежда', detailEn(ch, 'dress')) +
          field('Body', 'Тело', bodyField(ch), detailEn(ch, 'fur') && !detailEn(ch, 'body') ? 'в книге это графа Fur (шерсть)' : '')));

    var manner = panel('Extra Details — Mannerisms', 'Повадки',
      row(field('Demeanour', 'Нрав', detailEn(ch, 'demeanour')) +
          field('Desires', 'Желания', detailEn(ch, 'desires'))) +
      row(field('Beliefs', 'Убеждения', detailEn(ch, 'beliefs')) +
          field('Speech', 'Речь', detailEn(ch, 'speech'))));

    var kindred = panel('Kindred Details', 'Детали рода',
      row(field('Kindred Type', 'Тип существа', ch.kindred.type === 'mortal' ? 'Mortal' : (ch.kindred.type === 'fairy' ? 'Fairy' : 'Demi-fey')) +
          field('Height (cm)', 'Рост, см', ph.heightCm || '') +
          field('Weight (kg)', 'Вес, кг', ph.weightKg || '')) +
      row(field('Current Age', 'Возраст', ph.age || '') +
          field('Lifespan', 'Срок жизни', typeof ph.lifespan === 'number' ? ph.lifespan : (ph.lifespan || '')) +
          field('Moon Sign', 'Лунный знак', moonSignEn(ch), ch.moonSign ? '' : 'у фей лунного знака нет')) +
      row(field('Birthday — month', 'День рождения, месяц', bd ? bd.monthEn : '', bd ? 'русское название: ' + bd.month : '') +
          field('Birthday — day', 'День рождения, число', bd ? bd.day : '', bd ? 'любое число этой фазы луны подойдёт' : '')));

    var cls = panel('Class Details', 'Детали класса',
      row(field('Prime Abilities', 'Главные характеристики', ch.profile.primeAbilities.map(function (a) { return ABIL_META[a].en; }).join(', ')) +
          field('Hit Points', 'Хиты за уровень', '1' + ch.profile.hitDie + ' per level') +
          field('Combat Aptitude', 'Боевая подготовка', ch.profile.aptitude === 'martial' ? 'Martial' : (ch.profile.aptitude === 'semi-martial' ? 'Semi-Martial' : 'Non-Martial'))) +
      row(field('Armour', 'Броня', armourEn(ch)) +
          field('Weapons', 'Оружие', weaponsEn(ch))));

    return appearance + manner + kindred + cls;
  }

  function armourEn(ch) {
    var p = ch.profile.mode === 'kindredclass'
      ? (DW.KINDREDS[ch.kindred.id].kindredClass || {})
      : (DW.CLASSES[ch.profile.id] || {});
    return p.armourEn || p.armour || '';
  }
  function weaponsEn(ch) {
    var p = ch.profile.mode === 'kindredclass'
      ? (DW.KINDREDS[ch.kindred.id].kindredClass || {})
      : (DW.CLASSES[ch.profile.id] || {});
    return p.weaponsEn || p.weapons || '';
  }

  /* ---------- Notes: всё, что не влезло в поля ---------- */

  function notesText(ch) {
    var L = [];
    L.push('=== ' + ch.name.en + ' (' + ch.name.ru + ') ===');
    L.push(ch.kindred.en + ' ' + (ch.profile.mode === 'kindredclass' ? '' : ch.profile.en) + ', Level ' + ch.level + ', ' + ch.alignment.en);
    L.push('');

    L.push('-- TRINKET --');
    L.push(ch.trinket.en);
    L.push('');

    if (ch.moonSign) {
      L.push('-- MOON SIGN: ' + moonSignEn(ch) + ' --');
      L.push(ch.moonSign.d);
      L.push('');
    }

    var m = ch.magic || {};
    if (m.glamours && m.glamours.length) {
      L.push('-- GLAMOURS --');
      m.glamours.forEach(function (g) {
        L.push(g.en + ' — duration: ' + g.dur + ', range: ' + g.range);
        L.push('  ' + g.d);
      });
      L.push('');
    }
    if (m.lesserRunes && m.lesserRunes.length) {
      L.push('-- FAIRY RUNES (lesser, once per day at levels 1-4) --');
      m.lesserRunes.forEach(function (r) {
        L.push(r.en + ' — duration: ' + r.dur + ', range: ' + r.range);
        L.push('  ' + r.d);
      });
      L.push('');
    }
    if (m.knack) {
      L.push('-- KNACK: ' + m.knack.en + ' --');
      m.knack.levels.forEach(function (l) { L.push('  Level ' + l.lv + ' — ' + l.en + ': ' + l.d); });
      L.push('');
    }
    if (m.symbioticFlesh && m.symbioticFlesh.length) {
      L.push('-- SYMBIOTIC FLESH --');
      m.symbioticFlesh.forEach(function (s) { L.push('  ' + s.en); });
      L.push('');
    }
    if (m.spellBook) {
      L.push('-- SPELL BOOK: ' + m.spellBook.en + ' --');
      m.spellBook.spells.forEach(function (s) {
        L.push(s.en + ' (Rank ' + s.rank + ') — duration: ' + s.dur + ', range: ' + s.range);
        L.push('  ' + s.d);
      });
      L.push('');
    }
    if (m.holySpells && m.holySpells.length) {
      L.push('-- HOLY SPELLS (Rank 1, free choice each morning) --');
      m.holySpells.forEach(function (s) {
        L.push(s.en + ' — prayer: "' + s.prayer + '", ' + s.saint);
        L.push('  ' + s.d);
      });
      L.push('');
    }
    if (ch.liege) {
      L.push('-- LIEGE --');
      L.push(ch.liege.en + ' (' + ch.liege.al + ')');
      L.push('');
    }

    L.push('-- ATTACKS --');
    (ch.equipment.weapons || []).forEach(function (w) {
      var melee = (w.qual || []).indexOf('melee') >= 0;
      var missile = (w.qual || []).indexOf('missile') >= 0;
      if (melee) L.push(w.en + ' (melee): attack d20' + fm(ch.attack + ch.mods.STR) + ', damage ' + w.dmg + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''));
      if (missile) L.push(w.en + ' (missile): attack d20' + fm(ch.attack + ch.mods.DEX + (ch.profile.id === 'hunter' ? 1 : 0)) + ', damage ' + w.dmg + (w.range ? ', range ' + w.range + ' ft' : ''));
    });
    L.push('');

    L.push('-- LOAD BREAKDOWN (coins) --');
    var lp = (ch.speed && ch.speed.loadParts) || DW.Generator.computeLoad(ch).parts;
    L.push(lp.join('; '));
    L.push('Total: ' + loadOf(ch) + ' / ' + (ch.speed.maxLoad || 1600) + ' -> Speed ' + ch.speed.value);
    L.push('Clothing and belt pouch are not counted (Referee house rule).');
    L.push('');

    L.push('-- GENERATION --');
    L.push('Rolled with Dolmenwood Character Forge, ' + (ch.options ? ch.options.abilityMethod : '3d6-in-order') + '.');
    L.push('Rolled ability scores: ' + DW.Generator.ABIL.map(function (a) { return a + ' ' + ch.abilitiesRolled[a]; }).join(', '));
    L.push('HP roll: ' + ch.hp.roll + ' ' + fm(ch.hp.conMod) + ' = ' + ch.hp.max);
    L.push('Roll log checksum: ' + (ch.checksum || '—') + ' (' + (ch.log || []).length + ' rolls recorded)');
    return L.join('\n');
  }

  /* ---------- сборка ---------- */

  function sheetCard(ch) {
    var tabs = [
      { id: 'stats', en: 'Stats', ru: 'Статы', icon: '👤', html: tabStats(ch) },
      { id: 'inventory', en: 'Inventory', ru: 'Инвентарь', icon: '🎒', html: tabInventory(ch) },
      { id: 'magic', en: 'Magic', ru: 'Магия', icon: '✦', html: tabMagic(ch) },
      { id: 'traits', en: 'Traits', ru: 'Черты', icon: '☀', html: tabTraits(ch) },
      { id: 'extra', en: 'Extra Details', ru: 'Детали', icon: '◉', html: tabExtra(ch) },
      { id: 'effects', en: 'Effects', ru: 'Эффекты', icon: '⚡', html: panel('Effects', 'Эффекты', '<p class="vtt-note">На старте пусто — ничего вносить не надо.</p>') },
      { id: 'notes', en: 'Notes', ru: 'Заметки', icon: '📓', html:
        panel('Notes', 'Заметки — свободное текстовое поле',
          '<p class="vtt-note">Всё, что не влезло в поля листа: безделушка, лунный знак, полные описания магии, разбор веса и протокол генерации. Скопируй целиком и вставь во вкладку Notes.</p>' +
          '<pre class="vtt-notes" id="vtt-notes">' + esc(notesText(ch)) + '</pre>' +
          '<div class="btn-row no-print"><button class="small" data-copy="vtt-notes">📋 Скопировать текст для Notes</button></div>') }
    ];

    return '<div class="card vtt-card">' +
      '<div class="card-head"><h2>Перенос в игровой лист <span class="en">VTT character sheet</span></h2></div>' +
      '<p class="muted" style="margin-top:-4px">Разбито по тем же вкладкам и с теми же английскими названиями полей, что на игровом сайте. ' +
      'Значения даны в том виде, в каком их надо вбивать. Иди сверху вниз.</p>' +
      '<div class="vtt-tabs no-print">' +
        tabs.map(function (t, i) {
          return '<button class="vtt-tab' + (i === 0 ? ' on' : '') + '" data-vtt="' + t.id + '">' +
            t.icon + ' ' + esc(t.en) + '<span class="vtt-ru">' + esc(t.ru) + '</span></button>';
        }).join('') +
      '</div>' +
      tabs.map(function (t, i) {
        return '<div class="vtt-pane" data-vtt-pane="' + t.id + '"' + (i === 0 ? '' : ' hidden') + '>' + t.html + '</div>';
      }).join('') +
      '</div>';
  }

  function wireSheet(root) {
    var card = root.querySelector('.vtt-card');
    if (!card || card._bound) return;
    card._bound = true;
    card.addEventListener('click', function (e) {
      var b = e.target.closest('.vtt-tab');
      if (!b) return;
      var id = b.getAttribute('data-vtt');
      card.querySelectorAll('.vtt-tab').forEach(function (x) { x.classList.toggle('on', x === b); });
      card.querySelectorAll('[data-vtt-pane]').forEach(function (p) {
        p.hidden = p.getAttribute('data-vtt-pane') !== id;
      });
    });
  }

  DW.sheetExport = { card: sheetCard, wire: wireSheet, notesText: notesText };
})();
