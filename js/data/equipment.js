/* Снаряжение — Player's Book, стр. 116–121.
   cost — в золотых (gp); weight — в монетах (10 монет = 1 фунт); slots — слоты нагрузки. */
(function () {
  'use strict';

  /* ======================= ОРУЖИЕ ======================= */
  DW.WEAPONS = {
    battleaxe:  { id: 'battleaxe',  ru: 'Секира',            en: 'Battle axe',      cost: 7,  dmg: '1d8',  weight: 100, size: 'Medium', slots: 1, qual: ['melee'] },
    club:       { id: 'club',       ru: 'Дубина',            en: 'Club',            cost: 3,  dmg: '1d4',  weight: 20,  size: 'Medium', slots: 1, qual: ['melee'] },
    crossbow:   { id: 'crossbow',   ru: 'Арбалет',           en: 'Crossbow',        cost: 30, dmg: '1d8',  weight: 50,  size: 'Medium', slots: 1, qual: ['ap', 'missile', 'reload', 'twohanded'], range: '80/160/240' },
    dagger:     { id: 'dagger',     ru: 'Кинжал',            en: 'Dagger',          cost: 3,  dmg: '1d4',  weight: 10,  size: 'Small',  slots: 1, qual: ['melee', 'missile'], range: '10/20/30' },
    handaxe:    { id: 'handaxe',    ru: 'Топорик',           en: 'Hand axe',        cost: 4,  dmg: '1d6',  weight: 20,  size: 'Small',  slots: 1, qual: ['melee', 'missile'], range: '10/20/30' },
    holywater:  { id: 'holywater',  ru: 'Склянка святой воды', en: 'Holy water vial', cost: 25, dmg: '1d8', weight: 10, size: 'Small', slots: 0, qual: ['missile', 'splash'], range: '10/30/50' },
    lance:      { id: 'lance',      ru: 'Копьё-лэнс',        en: 'Lance',           cost: 5,  dmg: '1d6',  weight: 100, size: 'Large',  slots: 2, qual: ['brace', 'charge', 'melee', 'reach'] },
    longbow:    { id: 'longbow',    ru: 'Длинный лук',       en: 'Longbow',         cost: 40, dmg: '1d6',  weight: 40,  size: 'Large',  slots: 1, qual: ['missile', 'twohanded'], range: '70/140/210' },
    longsword:  { id: 'longsword',  ru: 'Длинный меч',       en: 'Longsword',       cost: 10, dmg: '1d8',  weight: 30,  size: 'Medium', slots: 1, qual: ['melee'] },
    mace:       { id: 'mace',       ru: 'Булава',            en: 'Mace',            cost: 5,  dmg: '1d6',  weight: 40,  size: 'Medium', slots: 1, qual: ['melee'] },
    oil:        { id: 'oil',        ru: 'Флакон масла (горящий)', en: 'Oil flask (burning)', cost: 1, dmg: '1d8', weight: 10, size: 'Small', slots: 1, qual: ['missile', 'splash'], range: '10/30/50' },
    polearm:    { id: 'polearm',    ru: 'Древковое оружие',  en: 'Polearm',         cost: 7,  dmg: '1d10', weight: 140, size: 'Large',  slots: 2, qual: ['brace', 'melee', 'reach', 'twohanded'] },
    shortbow:   { id: 'shortbow',   ru: 'Короткий лук',      en: 'Shortbow',        cost: 25, dmg: '1d6',  weight: 20,  size: 'Medium', slots: 1, qual: ['missile', 'twohanded'], range: '50/100/150' },
    shortsword: { id: 'shortsword', ru: 'Короткий меч',      en: 'Shortsword',      cost: 7,  dmg: '1d6',  weight: 20,  size: 'Medium', slots: 1, qual: ['melee'] },
    sling:      { id: 'sling',      ru: 'Праща',             en: 'Sling',           cost: 2,  dmg: '1d4',  weight: 10,  size: 'Small',  slots: 1, qual: ['missile'], range: '40/80/160' },
    spear:      { id: 'spear',      ru: 'Копьё',             en: 'Spear',           cost: 3,  dmg: '1d6',  weight: 30,  size: 'Medium', slots: 1, qual: ['brace', 'melee', 'missile'], range: '20/40/60' },
    staff:      { id: 'staff',      ru: 'Посох',             en: 'Staff',           cost: 2,  dmg: '1d4',  weight: 40,  size: 'Medium', slots: 2, qual: ['melee', 'twohanded'] },
    torch:      { id: 'torch',      ru: 'Факел (горящий)',   en: 'Torch (flaming)', cost: 1,  dmg: '1d4',  weight: 10,  size: 'Medium', slots: 1, qual: ['melee'] },
    twohander:  { id: 'twohander',  ru: 'Двуручный меч',     en: 'Two-handed sword', cost: 15, dmg: '1d10', weight: 140, size: 'Large', slots: 2, qual: ['melee', 'twohanded'] },
    warhammer:  { id: 'warhammer',  ru: 'Боевой молот',      en: 'War hammer',      cost: 5,  dmg: '1d6',  weight: 40,  size: 'Medium', slots: 1, qual: ['melee'] }
  };

  DW.WEAPON_QUALITIES = {
    ap:        { ru: 'Бронебойное', en: 'Armour piercing', d: '+2 к атаке против целей в немагической металлической броне.' },
    brace:     { ru: 'Упор', en: 'Brace', d: 'Против цели, которая в этот раунд бросилась в ближний бой на владельца, наносит двойной урон (оружие упирается в землю).' },
    charge:    { ru: 'Наскок', en: 'Charge', d: 'Атака с разгона на подходящем скакуне удваивает нанесённый урон.' },
    melee:     { ru: 'Ближний бой', en: 'Melee', d: 'Оружие ближнего боя, применимо только в пределах 5 футов от противника.' },
    missile:   { ru: 'Метательное/стрелковое', en: 'Missile', d: 'Метательное или стрелковое, применимо только дальше 5 футов от противника. Дистанции: короткая (+1 к атаке) / средняя (без модификатора) / длинная (−1 к атаке).' },
    reach:     { ru: 'Досягаемость', en: 'Reach', d: 'Можно атаковать из второго ряда, из-за спин союзников. Штраф −2, если союзник впереди равного или большего размера либо с двуручным оружием.' },
    reload:    { ru: 'Перезарядка', en: 'Reload', d: 'Стреляет раз в 2 раунда: раунд на выстрел, раунд на перезарядку.' },
    splash:    { ru: 'Разбрызгивание', en: 'Splash', d: 'При успешной атаке сосуд разбивается и обливает цель. Указанный урон наносится 2 раунда, пока жидкость стекает.' },
    twohanded: { ru: 'Двуручное', en: 'Two-handed', d: 'Требует обеих рук. В другой руке нельзя нести ничего (в том числе щит).' }
  };

  /* ======================= БРОНЯ ======================= */
  DW.ARMOUR = {
    none:      { id: 'none',      ru: 'Без брони',       en: 'Unarmoured', cost: 0,  ac: 10, weight: 0,   bulk: 'none',   bulkRu: '—',        slots: 0 },
    leather:   { id: 'leather',   ru: 'Кожаный доспех',  en: 'Leather',    cost: 20, ac: 12, weight: 200, bulk: 'light',  bulkRu: 'Лёгкая',   slots: 1 },
    bark:      { id: 'bark',      ru: 'Корьевой доспех', en: 'Bark',       cost: 30, ac: 13, weight: 300, bulk: 'light',  bulkRu: 'Лёгкая',   slots: 1, mossling: true },
    chainmail: { id: 'chainmail', ru: 'Кольчуга',        en: 'Chainmail',  cost: 40, ac: 14, weight: 400, bulk: 'medium', bulkRu: 'Средняя',  slots: 2 },
    pinecone:  { id: 'pinecone',  ru: 'Шишечный доспех', en: 'Pinecone',   cost: 50, ac: 15, weight: 400, bulk: 'medium', bulkRu: 'Средняя',  slots: 2, mossling: true },
    platemail: { id: 'platemail', ru: 'Латный доспех',   en: 'Plate mail', cost: 60, ac: 16, weight: 500, bulk: 'heavy',  bulkRu: 'Тяжёлая',  slots: 3 },
    fullplate: { id: 'fullplate', ru: 'Полные латы',     en: 'Full plate', cost: 1000, ac: 17, weight: 700, bulk: 'heavy', bulkRu: 'Тяжёлая', slots: 3 }
  };
  DW.SHIELD = { id: 'shield', ru: 'Щит', en: 'Shield', cost: 10, acBonus: 1, weight: 100, slots: 1 };

  /* ======================= СНАРЯЖЕНИЕ ======================= */
  /* slots: 0 — крошечное/одежда/контейнер в использовании; 1 — обычное; 2 — громоздкое */
  DW.GEAR = {
    /* Контейнеры */
    backpack:   { ru: 'Рюкзак',                  en: 'Backpack',            cost: 4,  weight: 50,  slots: 0, cat: 'container', d: 'Кожаная сумка с лямками. Вмещает до 400 монет / 10 слотов.' },
    beltpouch:  { ru: 'Поясной кошель',          en: 'Belt pouch',          cost: 1,  weight: 10,  slots: 0, cat: 'container', d: 'Кожаный кошель, вмещает до 50 монет.' },
    sack:       { ru: 'Мешок',                   en: 'Sack',                cost: 1,  weight: 5,   slots: 0, cat: 'container', d: 'Большой мешковинный мешок, вмещает 600 монет / 10 слотов.' },
    waterskin:  { ru: 'Бурдюк',                  en: 'Waterskin',           cost: 1,  weight: 50,  slots: 1, cat: 'container', d: 'Кожаный сосуд на 2 пинты. Пустой весит 5 монет.' },
    vial:       { ru: 'Стеклянная склянка',      en: 'Vial (glass)',        cost: 1,  weight: 1,   slots: 0, cat: 'container', d: 'Вмещает до полпинты жидкости.' },
    scrollcase: { ru: 'Тубус для свитков',       en: 'Scroll case',         cost: 1,  weight: 5,   slots: 1, cat: 'container', d: 'Промасленная кожаная труба с крышкой. Не полностью водонепроницаема.' },
    /* Свет */
    candles:    { ru: 'Свечи (10)',              en: 'Candles (10)',        cost: 1,  weight: 20,  slots: 1, cat: 'light', d: 'Тусклый свет в радиусе 5 футов, горит 1 час.' },
    lantern:    { ru: 'Фонарь (закрытый)',       en: 'Lantern (hooded)',    cost: 5,  weight: 20,  slots: 1, cat: 'light', d: 'Заслонки позволяют скрыть свет и защитить пламя. Сжигает флакон масла за 4 часа (24 хода). Свет в радиусе 30 футов.' },
    bullseye:   { ru: 'Фонарь-прожектор',        en: 'Lantern (bullseye)',  cost: 10, weight: 20,  slots: 1, cat: 'light', d: 'Даёт узкий луч длиной 60 футов и шириной 20 футов на конце.' },
    oilflask:   { ru: 'Флакон масла',            en: 'Oil (flask)',         cost: 1,  weight: 10,  slots: 1, cat: 'light', d: 'Питает фонарь 4 часа. Можно метать как оружие (1d8) или разлить лужей (3 фута, горит 1 ход, 1d8 урона проходящим).' },
    tinderbox:  { ru: 'Огниво',                  en: 'Tinder box',          cost: 3,  weight: 10,  slots: 1, cat: 'light', d: 'Для разжигания огня, включая факелы. В опасной обстановке шанс 2 из 6 разжечь за раунд.' },
    torches:    { ru: 'Факелы (3)',              en: 'Torches (3)',         cost: 1,  weight: 30,  slots: 1, cat: 'light', d: 'Зажжённый факел даёт свет в радиусе 30 футов и горит 1 час (6 ходов). Можно применять в бою (1d4).' },
    /* Лагерь и путешествие */
    bedroll:    { ru: 'Спальник',                en: 'Bedroll',             cost: 2,  weight: 70,  slots: 1, cat: 'camp', d: 'Тяжёлое шерстяное одеяло с маленькой подушкой.' },
    pots:       { ru: 'Котелки',                 en: 'Cooking pots',        cost: 3,  weight: 100, slots: 1, cat: 'camp', d: 'Горшки и сковороды для готовки на костре.' },
    firewood:   { ru: 'Дрова (вязанка, 8 часов)', en: 'Firewood (bundle)',  cost: 1,  weight: 200, slots: 1, cat: 'camp', d: 'Вязанка сухих дров, горит 8 часов.' },
    fishingrod: { ru: 'Удочка со снастями',      en: 'Fishing rod and tackle', cost: 4, weight: 50, slots: 1, cat: 'camp', d: 'Удилище, леска, крючок и коробка с наживкой.' },
    rations:    { ru: 'Рационы (сушёные, 1 день)', en: 'Rations (preserved)', cost: 2, weight: 20, slots: 1, cat: 'camp', d: 'Хранятся до 2 месяцев, или 1 неделю в сырости (грибной лес, подземелья).' },
    freshrations:{ ru: 'Рационы (свежие, 1 день)', en: 'Rations (fresh)',   cost: 1,  weight: 20,  slots: 1, cat: 'camp', d: 'Хранятся неделю, или 1 день в сырости.' },
    tent:       { ru: 'Палатка',                 en: 'Tent',                cost: 20, weight: 20,  slots: 1, cat: 'camp', d: 'Достаточно велика для двоих.' },
    /* Святые предметы */
    holysymbol_gold:   { ru: 'Святой символ (золотой)',  en: 'Holy symbol (gold)',   cost: 100, weight: 20, slots: 0, cat: 'holy', d: 'Даёт +1 к броску изгнания нежити и +1 к броску 2d4 на число затронутых существ.' },
    holysymbol_silver: { ru: 'Святой символ (серебряный)', en: 'Holy symbol (silver)', cost: 25, weight: 20, slots: 0, cat: 'holy', d: 'Даёт +1 к броску 2d6 при изгнании нежити.' },
    holysymbol_wood:   { ru: 'Святой символ (деревянный)', en: 'Holy symbol (wooden)', cost: 5, weight: 10, slots: 0, cat: 'holy', d: 'Служители Церкви обязаны носить святой символ на шее. Обычный, без бонусов.' },
    holywater:  { ru: 'Святая вода (склянка)',   en: 'Holy water (vial)',   cost: 25, weight: 10,  slots: 0, cat: 'holy', d: 'Вода, освящённая высшим клиром. Наносит урон нежити (1d8, метательное). Теряет силу, если перелить из благословенной склянки.' },
    /* Инструменты */
    bell:       { ru: 'Колокольчик',             en: 'Bell (miniature)',    cost: 1,  weight: 1,   slots: 0, cat: 'tools', d: 'Латунный колокольчик в 1 дюйм.' },
    blocktackle:{ ru: 'Полиспаст',               en: 'Block and tackle',    cost: 5,  weight: 50,  slots: 1, cat: 'tools', d: 'Для подъёма тяжестей. Уменьшает эффективный вес на 75%, но требует вчетверо больше верёвки.' },
    caltrops:   { ru: 'Чеснок (мешок, 20)',      en: 'Caltrops (bag of 20)', cost: 1, weight: 20,  slots: 1, cat: 'tools', d: 'Металлические шипы на площадь 5×5 футов. Проходящие имеют шанс 2 из 6 наступить: −50% Скорости на сутки.' },
    chain:      { ru: 'Цепь (10 футов)',         en: "Chain (10' long)",    cost: 30, weight: 100, slots: 1, cat: 'tools', d: 'Отрезок тяжёлой железной цепи.' },
    chalk:      { ru: 'Мел (10 палочек)',        en: 'Chalk (10 sticks)',   cost: 1,  weight: 10,  slots: 1, cat: 'tools', d: 'Удобно делать пометки на камне.' },
    chisel:     { ru: 'Зубило',                  en: 'Chisel',              cost: 2,  weight: 20,  slots: 1, cat: 'tools', d: 'Используется с молотком для откалывания камня.' },
    crowbar:    { ru: 'Лом',                     en: 'Crowbar',             cost: 10, weight: 50,  slots: 1, cat: 'tools', d: 'Железный прут 2–3 фута. Взламывать двери, крышки сундуков и т.п.' },
    grapplinghook:{ ru: 'Кошка',                 en: 'Grappling hook',      cost: 20, weight: 40,  slots: 1, cat: 'tools', d: 'Железная, с 3–4 крюками и кольцом для верёвки.' },
    hammer:     { ru: 'Молоток',                 en: 'Hammer (small)',      cost: 2,  weight: 30,  slots: 1, cat: 'tools', d: 'Удобно забивать железные клинья или простукивать кладку.' },
    sledgehammer:{ ru: 'Кувалда',                en: 'Sledgehammer',        cost: 5,  weight: 100, slots: 1, cat: 'tools', d: 'Большой тяжёлый молот для дробления камня.' },
    ink:        { ru: 'Чернила (склянка)',       en: 'Ink (vial)',          cost: 1,  weight: 5,   slots: 0, cat: 'tools', d: 'Склянка чёрных чернил, хватает примерно на 50 страниц.' },
    inkquill:   { ru: 'Чернила, перо, 5 листов бумаги', en: 'Ink, quill, 5 sheets paper', cost: 2, weight: 6, slots: 1, cat: 'tools', d: 'Письменный набор.' },
    ironspikes: { ru: 'Железные клинья (12)',    en: 'Iron spikes (12)',    cost: 1,  weight: 60,  slots: 1, cat: 'tools', d: 'Можно заклинить дверь открытой или закрытой, закрепить верёвку и т.д.' },
    lock:       { ru: 'Замок',                   en: 'Lock',                cost: 20, weight: 10,  slots: 1, cat: 'tools', d: 'Простой железный замок с ключом.' },
    magnifier:  { ru: 'Увеличительное стекло',   en: 'Magnifying glass',    cost: 3,  weight: 5,   slots: 1, cat: 'tools', d: 'Для изучения мелких деталей.' },
    manacles:   { ru: 'Кандалы',                 en: 'Manacles',            cost: 15, weight: 60,  slots: 1, cat: 'tools', d: 'Железные кандалы с цепью, для сковывания рук или ног.' },
    marbles:    { ru: 'Шарики (мешок, 20)',      en: 'Marbles (bag of 20)', cost: 1,  weight: 20,  slots: 1, cat: 'tools', d: 'Мешочек мелких цветных стеклянных шариков.' },
    miningpick: { ru: 'Кирка',                   en: 'Mining pick',         cost: 3,  weight: 100, slots: 1, cat: 'tools', d: 'Крепкая кирка для дробления породы.' },
    mirror:     { ru: 'Зеркальце',               en: 'Mirror (small)',      cost: 5,  weight: 50,  slots: 1, cat: 'tools', d: 'Удобно заглядывать за угол или отражать вредоносный взгляд чудовища.' },
    instrument_string:{ ru: 'Музыкальный инструмент (струнный)', en: 'Musical instrument (stringed)', cost: 20, weight: 50, slots: 1, cat: 'tools', d: 'Например, лютня или мандолина.' },
    windinstrument:{ ru: 'Музыкальный инструмент (духовой)', en: 'Musical instrument (wind)', cost: 5, weight: 20, slots: 1, cat: 'tools', d: 'Например, флейта или дудка.' },
    paper:      { ru: 'Бумага или пергамент (2 листа)', en: 'Paper or parchment (2 sheets)', cost: 1, weight: 0, slots: 0, cat: 'tools', d: 'Листы примерно 1 фут в квадрате.' },
    pole:       { ru: 'Шест (10 футов)',         en: "Pole (10' long)",     cost: 1,  weight: 70,  slots: 2, cat: 'tools', d: 'Деревянный шест толщиной 2 дюйма — тыкать в подозрительные штуки в подземелье.' },
    quill:      { ru: 'Перо',                    en: 'Quill',               cost: 1,  weight: 1,   slots: 0, cat: 'tools', d: 'Большое перо, заточенное для письма.' },
    rope:       { ru: 'Верёвка (50 футов)',      en: "Rope (50' long)",     cost: 1,  weight: 100, slots: 1, cat: 'tools', d: 'Выдерживает вес трёх человек со снаряжением.' },
    ropeladder: { ru: 'Верёвочная лестница (25 футов)', en: "Rope ladder (25')", cost: 5, weight: 200, slots: 1, cat: 'tools', d: 'Две верёвки с петлями-ступенями и узлом наверху для кошки.' },
    saw:        { ru: 'Пила',                    en: 'Saw',                 cost: 1,  weight: 20,  slots: 1, cat: 'tools', d: 'Плотницкая ножовка по дереву.' },
    shovel:     { ru: 'Лопата',                  en: 'Shovel',              cost: 2,  weight: 50,  slots: 1, cat: 'tools', d: 'Для копания земли.' },
    spellbook:  { ru: 'Книга заклинаний (чистая)', en: 'Spell book (blank)', cost: 100, weight: 50, slots: 1, cat: 'tools', d: 'Увесистый том веленевых страниц в коже. Вмещает до трёх заклинаний.' },
    thievestools:{ ru: 'Воровские инструменты',  en: "Thieves' tools",      cost: 25, weight: 10,  slots: 1, cat: 'tools', d: 'Набор отмычек в футлярчике. Нужны для взлома замков и обезвреживания механизмов.' },
    twine:      { ru: 'Бечёвка (клубок 100 футов)', en: 'Twine (100\' ball)', cost: 1, weight: 10, slots: 1, cat: 'tools', d: 'Выдерживает до 300 монет веса.' },
    whistle:    { ru: 'Свисток',                 en: 'Whistle',             cost: 1,  weight: 1,   slots: 0, cat: 'tools', d: 'Для сигналов или подражания птичьим крикам.' },
    /* Одежда */
    clothes:    { ru: 'Одежда, обычная',         en: 'Clothes, common',     cost: 1,  weight: 30,  slots: 0, cat: 'clothing', d: 'Полный комплект одежды: шоссы, туника, рубаха, пояс, платье и т.п.' },
    clothes_fine:{ ru: 'Одежда, добротная',      en: 'Clothes, fine',       cost: 20, weight: 40,  slots: 0, cat: 'clothing' },
    clothes_lux: { ru: 'Одежда, роскошная',      en: 'Clothes, extravagant', cost: 100, weight: 60, slots: 0, cat: 'clothing' },
    habit:      { ru: 'Ряса монаха',             en: "Habit, friar's",      cost: 2,  weight: 30,  slots: 0, cat: 'clothing', d: 'Простая мешковинная туника с капюшоном и верёвочным поясом.' },
    robes:      { ru: 'Ритуальные одежды',       en: 'Robes, ritual',       cost: 10, weight: 30,  slots: 0, cat: 'clothing', d: 'Тонкие одеяния с вышитыми символами. Часто носят маги.' },
    wintercloak:{ ru: 'Зимний плащ',             en: 'Winter cloak',        cost: 2,  weight: 20,  slots: 0, cat: 'clothing', d: 'Толстый шерстяной дорожный плащ. Защищает от урона холодом при путешествии в лютый мороз.' },
    /* Боеприпасы */
    arrows:     { ru: 'Стрелы (колчан, 20)',     en: 'Arrows (quiver of 20)', cost: 5, weight: 20, slots: 1, cat: 'ammo' },
    quarrels:   { ru: 'Болты (футляр, 20)',      en: 'Quarrels (case of 20)', cost: 10, weight: 20, slots: 1, cat: 'ammo' },
    stones:     { ru: 'Камни для пращи (20)',    en: 'Sling stones (20)',   cost: 0,  weight: 20,  slots: 1, cat: 'ammo', d: 'Бесплатны, вес 1 монета за штуку.' }
  };

  /* Алиасы для стартовых наборов классов */
  DW.GEAR.instrument_any = { ru: 'Музыкальный инструмент (струнный или духовой)', en: 'Musical instrument (stringed or wind)', cost: 20, weight: 50, slots: 1, cat: 'tools', choice: ['instrument_string', 'windinstrument'] };

  /* ======================= ТАБЛИЦА ПРИКЛЮЧЕНЧЕСКИХ ПРЕДМЕТОВ (d20) — стр. 19 ======================= */
  DW.ADVENTURING_ITEMS = [
    { n: 1,  id: 'bedroll' },
    { n: 2,  id: 'chalk' },
    { n: 3,  id: 'chisel' },
    { n: 4,  id: 'pots' },
    { n: 5,  id: 'crowbar' },
    { n: 6,  id: 'firewood' },
    { n: 7,  id: 'grapplinghook' },
    { n: 8,  id: 'inkquill' },
    { n: 9,  id: 'ironspikes' },
    { n: 10, id: 'lantern' },
    { n: 11, id: 'marbles' },
    { n: 12, id: 'oilflask' },
    { n: 13, id: 'rope' },
    { n: 14, id: 'sack' },
    { n: 15, id: 'shovel' },
    { n: 16, id: 'sledgehammer' },
    { n: 17, id: 'hammer' },
    { n: 18, id: 'tent' },
    { n: 19, id: 'torches' },
    { n: 20, id: 'twine' }
  ];

  /* ======================= ОБЩИЕ СТАРТОВЫЕ ПРЕДМЕТЫ — стр. 19 ======================= */
  DW.STARTING_GENERAL = {
    equipped: ['clothes', 'beltpouch'],
    backpack: ['rations', 'rations', 'waterskin', 'tinderbox'],
    container: 'backpack',
    goldDice: '3d6'
  };

  /* ======================= НАГРУЗКА (слоты) — стр. 149 ======================= */
  DW.SLOT_ENCUMBRANCE = [
    { equippedMax: 3,  stowedMax: 10, speed: 40 },
    { equippedMax: 5,  stowedMax: 12, speed: 30 },
    { equippedMax: 7,  stowedMax: 14, speed: 20 },
    { equippedMax: 10, stowedMax: 16, speed: 10 }
  ];

  /* ======================= ЯЗЫКИ (d6) — стр. 26 ======================= */
  DW.COMMON_LANGUAGES = [
    { r: [1, 1], ru: 'Каприс', en: 'Caprice', note: 'Благородное наречие брегглей' },
    { r: [2, 3], ru: 'Гаффе', en: 'Gaffe', note: 'Простонародное наречие брегглей' },
    { r: [4, 4], ru: 'Литургик', en: 'Liturgic', note: 'Писание Плюритинской Церкви. Феи и полуфейские выучить не могут' },
    { r: [5, 5], ru: 'Староволдийский', en: 'Old Woldish', note: 'Древний язык' },
    { r: [6, 6], ru: 'Сильван', en: 'Sylvan', note: 'Общий язык полуфейских' }
  ];
  DW.OBSCURE_LANGUAGES = [
    { ru: 'Боггин', en: 'Boggin' }, { ru: 'Деорлинг', en: 'Deorling' }, { ru: 'Друнический', en: 'Drunic' },
    { ru: 'Двелв', en: 'Dwelve' }, { ru: 'Высокий эльфийский', en: 'High Elfish', note: 'только феи' },
    { ru: 'Мерфолк', en: 'Merfolk' }, { ru: 'Мульч', en: 'Mulch' }, { ru: 'Вирм', en: 'Wyrm' }
  ];
})();
