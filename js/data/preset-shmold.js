/* Готовый персонаж: Шмолд Молд, мослинг-род-класс 2 уровня.
   Перенесён с игрового VTT-листа по скриншотам и сверен с Player's Book.
   Собирается из тех же таблиц, что и генератор, — поэтому черты, сноровка и
   описания предметов всегда совпадают с остальным приложением. */
(function () {
  'use strict';

  function build() {
    var kc = DW.KINDREDS.mossling.kindredClass;
    var W = DW.WEAPONS, G = DW.GEAR, A = DW.ARMOUR;

    function gear(id, qty) {
      var g = G[id];
      return { id: id, ru: g.ru, en: g.en, qty: qty || 1, slots: g.slots, weight: g.weight, cost: g.cost, cat: g.cat, d: g.d || '' };
    }
    function weapon(id) {
      var w = W[id];
      return { id: id, kind: 'weapon', ru: w.ru, en: w.en, dmg: w.dmg, size: w.size, slots: w.slots, weight: w.weight, cost: w.cost, qual: w.qual, range: w.range || null };
    }

    var ch = {
      schema: 'dolmenwood-character/1',
      id: 'dw_shmold_mould',
      generatedAt: '2026-08-04T00:00:00.000Z',
      source: "Dolmenwood Player's Book (Necrotic Gnome, 6 Aug 2024)",
      origin: 'Внесён вручную с игрового VTT-листа и сверен с книгой',
      options: { mode: 'kindredclass', abilityMethod: 'manual-entry', moonSignRule: true, gender: 'male' },
      level: 2, xp: 2200, xpForNextLevel: 4400, status: 'alive',

      kindred: { id: 'mossling', ru: 'мослинг', en: 'Mossling', type: 'mortal', typeRu: 'Смертный', size: 'Small', sizeRu: 'Малый', page: 48 },
      profile: {
        mode: 'kindredclass', id: 'mossling_kc', ru: kc.ru, en: kc.en,
        primeAbilities: kc.primeAbilities, primeRu: kc.primeRu, hitDie: kc.hitDie,
        aptitude: kc.aptitude, aptitudeRu: kc.aptitudeRu, armour: kc.armour, weapons: kc.weapons, page: 186
      },

      abilities: { STR: 13, INT: 13, WIS: 14, DEX: 8, CON: 11, CHA: 11 },
      abilitiesRolled: { STR: 13, INT: 13, WIS: 14, DEX: 8, CON: 11, CHA: 11 },
      mods: { STR: 1, INT: 1, WIS: 1, DEX: -1, CON: 0, CHA: 0 },
      magicResistance: 1,
      xpModifier: 0,
      xpModifierBreakdown: { prime: 0, primeAbility: kc.primeRu, lowestPrimeScore: 11, kindred: 0, total: 0 },

      /* Значения ниже — как на живом листе. Расхождения с книгой перечислены в validation. */
      attack: 0,
      saves: { doom: 11, ray: 12, hold: 13, blast: 16, spell: 14 },
      hp: { max: 9, current: 9, die: 'd6', roll: 9, conMod: 0 },
      ac: { value: 13, breakdown: ['Корьевой доспех: базовый КБ 13', 'Щит: +1', 'Ловкость: -1'], situational: [] },
      speed: {
        value: 10, load: 1011, maxLoad: 1600, overloaded: false, equipped: 0, stowed: 0,
        loadParts: ['Корьевой доспех 300', 'Щит 100', 'Короткий меч 20', 'Крукхорнское копьё 30',
          'Бурдюк 50', 'Железные клинья (12) 60', 'Зубило 20', 'Огниво 10', 'Шарики (мешок, 20) 20',
          'Дубина 20', 'Палатка 20', 'Рационы (сушёные) 40', 'Взломщицкая смесь ×3 3', 'Монеты (318 зм) 318']
      },

      skills: { basic: { listen: 6, search: 6, survival: 6, survivalForaging: 5 }, class: [] },
      languages: [{ ru: 'Волдийский', en: 'Woldish' }, { ru: 'Мульч', en: 'Mulch' }],
      traits: { kindred: [], class: kc.traits },

      magic: {
        knack: DW.KNACKS.filter(function (k) { return k.en === 'Bird Friend'; })[0],
        symbioticFlesh: [DW.KINDREDS.mossling.symbioticFlesh[18]]  /* «Съедобные грибы в волосах», d20 = 19 */
      },

      alignment: { ru: 'Хаос', en: 'Chaotic', d: DW.Generator.ALIGNMENTS.Chaotic.d, rolled: false },
      name: { ru: 'Шмолд Молд', en: 'Shmold Mould', first: { ru: 'Шмолд', en: 'Shmold' }, surname: { ru: 'Молд', en: 'Mould' } },
      gender: 'male',
      background: { ru: 'Мховод', en: 'Moss farmer' },
      details: {},
      physical: { age: 64, lifespan: 470, heightCm: 117, weightKg: 75, heightInches: 46, heightImperial: '3\'10"', weightLbs: 165 },
      moonSign: { moon: 'Рыцарская', phase: 'растущая', en: "Knight's (W)", d: '+2 к Харизме (максимум 18) при взаимодействии со знатью.' },
      birthday: { month: 'Харчмент', monthEn: 'Harchment', monthN: 5, day: 12 },

      gold: 318,
      trinket: {
        ru: 'Заплесневелый гобелен с охотой на свинью мифических размеров.',
        en: 'A mould-riddled tapestry depicting the hunt for a swine of mythic size.', roll: 47
      },

      equipment: {
        armour: { id: 'bark', kind: 'armour', ru: A.bark.ru, en: A.bark.en, ac: A.bark.ac, bulk: A.bark.bulk, bulkRu: A.bark.bulkRu, slots: A.bark.slots, weight: A.bark.weight, cost: A.bark.cost },
        shield: { id: 'shield', ru: 'Щит', en: 'Shield', acBonus: 1, slots: 1, weight: 100, cost: 10 },
        weapons: [
          weapon('shortsword'),
          {
            id: 'crookhorn_spear', kind: 'weapon', ru: 'Крукхорнское копьё', en: 'Crookhorn Spear',
            dmg: '1d6', size: 'Medium', slots: 1, weight: 30, cost: null,
            qual: ['brace', 'melee', 'missile'], range: '20/40/60', custom: true,
            special: 'ОСОБОЕ: при попадании жертва делает спасбросок против Рока (Save vs Doom). Трофей, добытый в игре.'
          },
          weapon('club')
        ],
        equipped: [gear('waterskin'), gear('ironspikes'), gear('chisel'), gear('tinderbox'), gear('marbles')],
        stowed: [
          gear('tent'), gear('rations'), gear('rations'),
          { id: 'burglars_mix', ru: 'Взломщицкая смесь', en: "Burglar's mix", qty: 3, slots: 1, weight: 1, cost: null, cat: 'foraged', d: 'Собрано в игре. Вес 1 монета за штуку.' }
        ],
        container: null,
        adventuringItems: []
      },

      notes: [
        'ХРОНИКА',
        '',
        'Похитили и вернули сына свинопаса Ардак. Юг от Дрега в 1111 находится Друменский холм, в западной части.',
        'На холме развалина небольшого форта. Как говорят подростки, это фейский форт. Он в полном развале, фей нет.',
        'Но если подкрадываешься — слышишь музыку из флейты. Дети ходят туда слушать. И Арда пошёл послушать.',
        'Его там сцапали кривороги: все больные, кривые. Пленили, держали в комнате в форте. Он видел двоих, но их больше.',
        'Они были вооружены, один здоровенный. Держали 3 дня, не кормили. На мечах спасавших его была кровь.',
        'Внутри форта есть альков в подземелье. Они пришли не спасать, а грабить, но понесли потери и убежали.',
        'Свинопасы что-то планировали ночью у дома мэра.',
        '',
        'Есть медная статуэтка танцующей нимфы (50 монет).',
        '',
        'ЗАГАДКА В ПОДЗЕМЕЛЬЕ',
        'На циферблате солнечных часов: «По прошествии множества эпох милость Мэлоухарта может воссиять».',
        'За циферблатом — фреска с эльфом: на лице горькое отвращение, иссиня-тёмная кожа, белые волосы,',
        'очень дорогие горностаевые меха, на голове корона из серебряных рогов.',
        'Это принц Мэлоухарт — тот самый, которого обыграл в карты св. Торм (Player’s Book, стр. 102).',
        'Его «милость» — вынужденное освобождение узника. Ищи не сокровище, а дверь или отпирание.',
        '',
        'У МЕНЯ БУТЫЛКА ЖИДКОГО ВРЕМЕНИ В РЮКЗАКЕ.',
        '',
        'Нынешний герцог — честный правитель, но живёт в тени отца, героя войны. Даже в 60 лет его подданные',
        'ждут кризисов, которые сформируют наследие. Но у Теспиана ничего нет.'
      ].join('\n'),

      validation: [
        {
          level: 'warn', what: 'Цели спасбросков расходятся с книгой', page: 187,
          sheet: 'Рок 11, Луч 12, Захват 13, Взрыв 16, Заклинание 14',
          book: 'Рок 8, Луч 9, Захват 10, Взрыв 13, Заклинание 12 — таблица развития мослинга-род-класса, 2 уровень',
          note: 'Книжные значения ЛУЧШЕ (чем меньше — тем лучше), поэтому я НЕ стал их подставлять: это было бы тихим усилением персонажа. Оставил числа с твоего листа. Спроси у ГМ, по какой таблице считаем — возможно, на VTT мослинг сделан как род плюс отдельный класс.'
        },
        {
          level: 'warn', what: 'Симбиотическая плоть: не хватает одной черты', page: 187,
          sheet: 'Одна черта: «В волосах растут съедобные грибы»',
          book: 'По одной случайной черте на КАЖДОМ уровне, включая 1-й. На 2 уровне их должно быть две',
          note: 'Похоже, при повышении уровня вторую просто не бросили. Нужен бросок d20 по таблице Симбиотической плоти.'
        },
        {
          level: 'info', what: 'Навык Выживание', page: 187,
          sheet: 'Survival 5',
          book: 'Цель 5 — только при СОБИРАТЕЛЬСТВЕ. Обычное Выживание остаётся 6',
          note: 'На VTT одно поле на оба случая. За столом помни разницу.'
        },
        {
          level: 'info', what: 'Безделушка не учтена в весе', page: 34,
          sheet: 'Load 1011 (гобелен не внесён предметом)',
          book: 'Мелкая безделушка весит 10 монет → 1021',
          note: 'На скорость не влияет: и 1011, и 1021 попадают в ступень «до 1600» → Скорость 10.'
        },
        {
          level: 'ok', what: 'Лунный знак и день рождения сходятся', page: 174,
          sheet: "Knight's Moon (Waxing), день рождения Харчмент 12",
          book: 'Харчмент — 5-й месяц, его луна Рыцарская; день 12 попадает в растущую фазу (1–13)'
        },
        {
          level: 'ok', what: 'Класс Брони сходится', page: 120,
          sheet: 'AC 13', book: 'Корьевой доспех 13 + щит 1 − Ловкость 1 = 13'
        },
        {
          level: 'ok', what: 'Вес, скорость и опыт сходятся', page: 148,
          sheet: 'Load 1011 / 1600, Speed 10, Exploring 30, Overland 2, XP 2200 / 4400',
          book: '610 на себе + 83 в рюкзаке + 318 монет = 1011. Свыше 800 → Скорость 10; 10×3 = 30 футов за ход; 10÷5 = 2 очка пути. 2 уровень мослинга наступает на 2200 XP, третий — на 4400'
        },
        {
          level: 'ok', what: 'Безделушка и симбиотическая черта — из книжных таблиц', page: 51,
          sheet: 'Гобелен с охотой на свинью; съедобные грибы в волосах',
          book: 'Таблица безделушек мослинга, d100 47–48; таблица Симбиотической плоти, d20 = 19'
        }
      ],

      log: [{
        i: 1, step: 'manual', label: 'Внесено вручную', notation: '—', dice: [], total: null, manual: true,
        result: 'Персонаж создан на игровом VTT-листе и одобрен гейм-мастером; сюда перенесён по скриншотам и сверен с Player’s Book. Броски при создании здесь не записывались.'
      }]
    };

    ch.checksum = DW.Generator.checksum(ch);
    ch.portraitPrompt = DW.portraitPrompt(ch);
    return ch;
  }

  DW.PRESETS = DW.PRESETS || {};
  DW.PRESETS.shmold = { id: 'dw_shmold_mould', title: 'Шмолд Молд — мослинг, 2 уровень', build: build };
})();
