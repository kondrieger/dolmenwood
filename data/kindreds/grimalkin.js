/* Гримолкин — Grimalkin. Player's Book, стр. 40–43 (род), 184–185 (род-класс). */
import { tbl, names, d100pairs as d100 } from '../util.js'

export const grimalkin = {
  id: 'grimalkin',
  ru: 'Гримолкин', en: 'Grimalkin',
  tagline: 'Переменчивые кошачьи феи, перекидывающиеся в три разные формы.',
  taglineEn: 'Mercurial feline fairies who shift between three different forms.',
  type: 'fairy', typeRu: 'Фея',
  size: 'Small', sizeRu: 'Малый',
  page: 40, kcPage: 184,
  age: { dice: '1d100', mult: 10, base: 0, label: 'Возраст на 1 уровне' },
  lifespan: { fixed: 'Бессмертен', label: 'Срок жизни' },
  height: { dice: '2d6', base: 30, unit: 'in', label: 'Рост' },
  weight: { dice: '3d10', base: 50, unit: 'lbs', label: 'Вес' },
  languages: [
    { ru: 'Волдийский', en: 'Woldish' },
    { ru: 'Мьяу', en: 'Mewl' }
  ],
  lore: 'Гримолкины — кошки-феи-оборотни, славные магией иллюзий и любовью к поеданию крыс. Родом из волшебного царства Кэтленд, где правит грозная королева Абиссиния, Королева Всех Кошек. Принимают три формы: эстрей (человекоподобный кот — обычная форма), честер (жирный домашний кот) и уайлдер (первобытная фейская хищная форма).',
  relations: 'Странствующие гримолкины ревнивы и скрытны со своими сородичами, потому предпочитают компанию других родов. Любят фей и полуфейских, особенно легкомысленных вудгрю. Серьёзные начинания смертных считают комичными. В людских поселениях их встречают с любопытством и восторгом — люди же любят кошек.',
  classAdvice: 'Гримолкины чаще всего барды, чароплёты, охотники или воры. Редко их принимают в рыцари. Клириками и монахами быть НЕ МОГУТ.',

  traits: [
    { ru: 'Броня и оружие', en: 'Armour and Weapons', p: 41,
      d: 'Броню нужно подгонять под малый размер. Большое (Large) оружие недоступно.' },
    { ru: 'Оборонительный бонус', en: 'Defensive Bonus', p: 41,
      d: 'В ближнем бою с Большими существами гримолкин получает +2 к Классу Брони благодаря малому размеру.' },
    { ru: 'Поедание гигантских грызунов', en: 'Eating Giant Rodents', p: 41,
      d: 'Потратив 1 ход на пожирание свежеубитого гигантского грызуна, гримолкин восстанавливает 1 хит.' },
    { ru: 'Гламуры', en: 'Glamours', p: 41,
      d: 'Каждый гримолкин знает один случайно определённый гламур.' },
    { ru: 'Навыки гримолкина', en: 'Grimalkin Skills', p: 41,
      d: 'Цель навыка Слушать — 5.' },
    { ru: 'Бессмертие', en: 'Immortality', p: 41,
      d: 'Своей смертью не умирает, иммунен к немагическим болезням, не умирает от голода и жажды.' },
    { ru: 'Сопротивление магии', en: 'Magic Resistance', p: 41,
      d: '+2 к Сопротивлению магии.' },
    { ru: 'Оборотничество', en: 'Shape-Shifting', p: 41,
      d: 'За 1 раунд можно превратиться в честера (жирный кот: AC 12, Скорость 30, укус и два когтя по 1 урона; понимает речь, но отвечает только мяуканьем; обратно — только если никто не видит) или, раз в день, в уайлдера (только в ближнем бою и при менее чем половине хитов: восстанавливает 2d6 хитов, почти невидим — враги получают −2 к атаке, AC 13, укус и два когтя по 1d4 с +2 к атаке; но не отличает друга от врага и бьёт ближайшего; через 2d4 раунда возвращается в эстрей). В превращённом виде нельзя пользоваться оружием, магией и классовыми способностями.' },
    { ru: 'Уязвимость к холодному железу', en: 'Vulnerable to Cold Iron', p: 41,
      d: 'Оружие из холодного железа наносит +1 урона.' }
  ],

  kindredClass: {
    ru: 'Гримолкин (род-класс)', en: 'Grimalkin Kindred-Class',
    primeAbilities: ['DEX'],
    primeRu: 'Ловкость',
    hitDie: 'd6', hpAfter10: 1,
    aptitude: 'semi-martial', aptitudeRu: 'Полувоинская',
    armour: 'Любая, включая щиты', armourEn: 'Any, including shields',
    weapons: 'Малое и Среднее', weaponsEn: 'Small and Medium',
    armourAllowed: ['none', 'light', 'medium', 'heavy'], shields: true,
    weaponSizes: ['Small', 'Medium'],
    desc: 'Гримолкины-искатели приключений — умелые бойцы, которых часто недооценивают из-за малого роста. Обладают врождёнными талантами, включая знаменитое оборотничество.',
    startArmour: [
      { r: [1, 1], items: ['leather'] },
      { r: [2, 2], items: ['leather', 'shield'] },
      { r: [3, 3], items: ['chainmail'] },
      { r: [4, 4], items: ['chainmail', 'shield'] },
      { r: [5, 5], items: ['platemail'] },
      { r: [6, 6], items: ['platemail', 'shield'] }
    ],
    startWeapons: [
      { r: [1, 1], items: ['club'] },
      { r: [2, 2], items: ['dagger', 'dagger', 'dagger'] },
      { r: [3, 3], items: ['sling', 'stones'] },
      { r: [4, 4], items: ['shortbow', 'arrows'] },
      { r: [5, 6], items: ['shortsword'] }
    ],
    classItems: [],
    grantsGlamours: 1,
    traits: [
      { ru: 'Подгонка брони', en: 'Armour Tailoring', d: 'Броню нужно подгонять под малый размер (2d6 дней, половина стоимости брони).' },
      { ru: 'Оборонительный бонус', en: 'Defensive Bonus', d: '+2 к КБ в ближнем бою с Большими существами.' },
      { ru: 'Поедание гигантских грызунов', en: 'Eating Giant Rodents', d: '1 ход на поедание свежего гигантского грызуна = +1 хит. Комки шерсти (трижды в день): в течение дня после этого можно пожертвовать 1 хит и изрыгнуть струю шерсти — все в линии 30 футов получают 1d6 урона (спасбросок против Взрыва — половина).' },
      { ru: 'Гламуры', en: 'Glamours', d: 'На 1 уровне — 1 случайный гламур.' },
      { ru: 'Навыки гримолкина', en: 'Grimalkin Skills', d: 'Слушать — цель 5.' },
      { ru: 'Взлом замков', en: 'Pick Lock', d: 'Специальный навык, цель 6 на 1 уровне. Нужны воровские инструменты. Одна попытка = 1 ход, можно повторять.' },
      { ru: 'Бессмертие', en: 'Immortality', d: 'Своей смертью не умирает, иммунен к немагическим болезням.' },
      { ru: 'Оборотничество', en: 'Shape-Shifting', d: 'Честер (без ограничений) и уайлдер (раз в день). В форме зверя нельзя владеть оружием, вскрывать замки и применять гламуры.' },
      { ru: 'Уязвимость к холодному железу', en: 'Vulnerable to Cold Iron', d: 'Холодное железо наносит +1 урона.' }
    ],
    advancement: [
      [1, 0, '1d6', 0, 11, 11, 13, 15, 14],
      [2, 2500, '1d6', 0, 11, 11, 13, 15, 14],
      [3, 5000, '1d6', 1, 10, 10, 12, 14, 13],
      [4, 10000, '1d6', 1, 10, 10, 12, 14, 13],
      [5, 20000, '1d6', 2, 9, 9, 11, 13, 12],
      [6, 40000, '1d6', 2, 9, 9, 11, 13, 12],
      [7, 80000, '1d6', 3, 8, 8, 10, 12, 11],
      [8, 160000, '1d6', 3, 8, 8, 10, 12, 11],
      [9, 320000, '1d6', 4, 7, 7, 9, 11, 10],
      [10, 450000, '1d6', 4, 7, 7, 9, 11, 10],
      [11, 580000, '+1', 5, 6, 6, 8, 10, 9],
      [12, 710000, '+1', 5, 6, 6, 8, 10, 9],
      [13, 840000, '+1', 6, 5, 5, 7, 9, 8],
      [14, 970000, '+1', 6, 5, 5, 7, 9, 8],
      [15, 1100000, '+1', 7, 4, 4, 6, 8, 7]
    ],
    glamoursByLevel: [1, 2, 3, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
    skills: [{ ru: 'Взлом замков', en: 'Pick Lock', targets: [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2] }]
  },

  names: names(`
Ботинки|Boots ~  ~  ~ Бобблвиск|Bobblewhisk
Фриппл|Fripple ~  ~  ~ Коттонсокс|Cottonsocks
Джинджер|Ginger ~  ~  ~ Флип-э-тейл|Flip-a-tail
Джек/Джилл|Jack/Jill ~  ~  ~ Флиппанси|Flippancy
Джаспи|Jaspy ~  ~  ~ Флаффакин|Fluff-a-kin
Жаклин|Jasqueline ~  ~  ~ Гримолгрим|Grimalgrime
Китти|Kitty ~  ~  ~ Гринсер|Grinser
Литтл|Little ~  ~  ~ Ликлинг|Lickling
Лорд/Леди|Lord/Lady ~  ~  ~ Молокоязыкий|Milktongue
Моггет|Mogget ~  ~  ~ Могглин|Mogglin
Моггл|Moggle ~  ~  ~ Попплтейл|Poppletail
Месье/Мадам|Monsieur/Madame ~  ~  ~ Мышегон|Pouncemouse
Ниблс|Nibbles ~  ~  ~ Пусскин|Pusskin
Пенни|Penny ~  ~  ~ Крысобой|Ratbane
Поппет|Poppet ~  ~  ~ Снаффл|Snuffle
Принц/Принцесса|Prince/Princess ~  ~  ~ Хвостовиск|Tailwhisk
Присси|Prissy ~  ~  ~ Типплер|Tippler
Типпси|Tippsy ~  ~  ~ Виппльтонг|Whippletongue
Томкин|Tomkin ~  ~  ~ Випси|Whipsy
Топпси|Toppsy ~  ~  ~ Усы|Whiskers
`),
  namesNote: 'Имена гримолкинов обычно не имеют рода. Исключения (и титулы) даны в вариантах муж./жен.',

  backgrounds: tbl(`
Подручный алхимика ~ Alchemist's aide
Рыболов ~ Angler
Цирюльник ~ Barber
Карточный шулер ~ Card-sharp
Пивовар кошачьей мяты ~ Catnip brewer
Портной ~ Clothier
Дуэлянт ~ Duellist
Разбойник с большой дороги ~ Highway robber
Ножовщик ~ Knifemaker
Распутник ~ Libertine
Моряк ~ Mariner
Браконьер фазанов ~ Pheasant poacher
Крысолов ~ Rat hunter
Шпион ~ Spy
Фокусник ~ Stage magician
Мошенник ~ Swindler
Лицедей ~ Thespian
Зверолов / скорняк ~ Trapper / furrier
Разводчик полёвок ~ Vole farmer
Укротитель ласок ~ Weasel tamer
`),

  trinkets: d100(`
Двууголка, которая изнутри на фут глубже, чем кажется снаружи. ~ A bicorne hat that is a foot deeper on the inside than it appears.
Книга давно забытых законов на староволдийском. ~ A book of long-forgotten laws, written in Old Woldish.
Латунный напёрсток, превращающий воду в молоко. ~ A brass thimble that turns water into milk.
Брегглский язык, всё ещё влажный. ~ A breggle tongue, still moist.
Вишнёвый тарт, стянутый с кухни вельможи фей. ~ A cherry tart pilfered from the kitchen of a fairy noble.
Плащ, сшитый из сотни полёвок. ~ A cloak fashioned from a hundred voles.
Медная монета, которая при осознанном подбрасывании всегда падает одной стороной. ~ A copper coin that always lands on the same side when deliberately flipped.
Багровое перо огромной птицы. ~ A crimson feather from an enormous bird.
Мёртвая ворона, которая не гниёт. ~ A dead crow that never rots.
Колода игральных карт, которая без присмотра сама себя тасует. ~ A deck of playing cards that shuffles itself when left unattended.
Высохшее сердце размером с жёлудь. ~ A dried heart the size of an acorn.
Комок шерсти, отрыгнутый знаменитым гримолкином. ~ A hairball coughed up by a famous grimalkin.
Платок со следом поцелуя королевы Абиссинии. ~ A handkerchief stained with the kiss of Queen Abyssinia.
Медальон-сердечко. При каждом открытии внутри портрет другого кота. ~ A heart-shaped locket. Each time it's opened, it contains a portrait of a different cat.
Человеческий глаз, зрачок которого расширяется перед дождём. ~ A human eye that dilates just before it rains.
Столетняя записка с обещанием услуги за услугу, оказанную ведьме. Её потомки, возможно, обязаны её исполнить. ~ A hundred-year-old note offering a favour in return for services rendered to a witch.
Лист с самого высокого дерева Дольменвуда. ~ A leaf from the tallest tree in Dolmenwood.
Письмо, умоляющее помочь младшему ребёнку мельника. ~ A letter begging you to aid a miller's youngest child.
Живой таракан на тонкой золотой нити. Если его убрать или убить, на рассвете появляется новый. ~ A live cockroach tied to a thin gold string; a new one appears at sunrise if removed.
Счастливый черепаший панцирь. ~ A lucky tortoise shell.
Лютня, которая утром всегда расстроена, а вечером всегда настроена. ~ A lute that is always out of tune in the morning and in tune in the evening.
Роскошная подушка с золотой вышивкой. ~ A luxurious, gold-embroidered cushion.
Мышиный череп на верёвочке. (Якобы мыши с луны.) ~ A mouse skull on a string. (Allegedly, a mouse from the moon.)
Гриб, украденный с головы моцлинга. ~ A mushroom stolen from the head of a mossling.
Песня соловья, запертая в медальоне. ~ A nightingale's song, trapped in a locket.
Пара сапог, которые никогда не выйдут из моды. ~ A pair of boots that will never go out of fashion.
Пара костей, которые в сумме всегда дают девять. ~ A pair of dice that, when rolled together, always total to nine.
Розовый бант, который ни при каких обстоятельствах не может стать невидимым. ~ A pink bow that cannot turn invisible under any circumstances.
Карманные часы, которые всегда показывают точное время часовой давности. ~ A pocket watch that always tells you the correct time an hour ago.
Фарфоровая чашка с нарисованной саламандрой. Тёплые напитки в ней не остывают. ~ A porcelain teacup with a salamander painted on the side. Warm liquids never cool down.
Кроличья лапка, изредка подёргивающаяся. ~ A rabbit's foot that sporadically twitches.
Крысиный король в мешке. Каждая крыса внутри утверждает, что она «Король Всех Крыс». ~ A rat king in a sack. Each rat inside claims to be the "King of All Rats."
Правдоподобная маска человеческого ребёнка. ~ A realistic mask of a human child.
Свиток с твоей королевской родословной. Подлинность сомнительна. ~ A scroll depicting your royal lineage. Of dubious authenticity.
Связка ключей на золотом кольце, стянутая у вельможи. ~ A set of keys on a golden ring, purloined from a noble.
Отрубленная голова спрайта, высушенная и сохранённая. ~ A severed head of a sprite, dried and preserved.
Швейная игла, размером для великана. (Считается кинжалом.) ~ A sewing needle, sized for a giant. (Treat as a dagger.)
Осколок холодного железа, запертый в стеклянной сфере. ~ A shard of cold iron, trapped in a glass sphere.
Один кошачий ус, подаренный тебе в знак верности. ~ A single cat whisker, given to you as a sign of commitment.
Единственная трубка, взятая из свирели вудгрю. ~ A singular pipe, taken from a woodgrue's pan flute.
Крохотная склянка с легендарно мощным сортом кошачьей мяты. ~ A small vial containing a legendarily potent strain of catnip.
Крошечный колокольчик, который не издаёт ни звука. ~ A tiny bell that makes no sound.
Дрессированная, но не слишком умная ласка. ~ A trained, but not particularly smart, weasel.
Свисток, который слышат все, кроме собак. ~ A whistle that only dogs can't hear.
Волчья лапа, которая кровоточит, когда волк думает о тебе. ~ A wolf's paw that bleeds when the wolf is thinking of you.
Деревянная дверца формой и размером с мышь. ~ A wooden door the shape and size of a mouse.
Повязка на глаз в старой крови. ~ An eyepatch, stained with old blood.
Ноготь огра, твёрдый как сталь. Владелец ещё жив. ~ An ogre's toenail, tough as steel. Its owner still lives.
Очки, в которых обитают безобидные призраки. Надев их, ты их видишь. ~ Eyeglasses haunted by benign ghosts. Wearing the glasses allows you to see them.
Один из пары браслетов, сплетённых из мышиных хвостов. ~ One of a pair of bracelets made from braided mouse tails.
`),

  details: {
    head: { ru: 'Голова', en: 'Head', die: 12, items: tbl(`
Тщательно уложенный кок ~ Carefully sculpted quiff
Щегольской цилиндр ~ Dapper top hat
Роскошная шерсть на ушах ~ Extravagant ear fur
Мягкий берет ~ Floppy beret
Одно ухо висит ~ Floppy ear
Залихватская треуголка ~ Jaunty tricorn hat
Шляпа с плюмажем ~ Plumed hat
Острые кисточки на ушах ~ Pointy ear tufts
Косматая грива ~ Shaggy mane
Пятнистая косынка ~ Spotted headscarf
Рваное ухо ~ Torn ear
Неправдоподобно большая ~ Unrealistically large
`) },
    face: { ru: 'Морда', en: 'Face', die: 12, items: tbl(`
Пучеглазый ~ Bug-eyed
Вечно выглядит удивлённым ~ Constantly looks surprised
Медные глаза-блюдца ~ Copper, saucer-like eyes
Особо пушистые щёки ~ Extra fluffy cheeks
Невероятно длинные усы ~ Extravagantly long whiskers
Обвислые брыли ~ Flabby jowls
Сверкающие серебряные глаза ~ Flashing silver eyes
Длинная острая морда ~ Long, pointy snout
Почти сплошной рот ~ Mostly mouth
Кривозубый ~ Snaggle-toothed
Курносый ~ Snub nose
Язык высунут ~ Tongue pokes out
`) },
    fur: { ru: 'Шерсть', en: 'Fur', die: 12, items: tbl(`
Чёрная ~ Black
Чёрно-белая ~ Black and white
Голубая ~ Blue
Бурая полосатая ~ Brown tabby
Шоколадная ~ Chocolate
Рыжая полосатая ~ Ginger tabby
Переливчатая ~ Iridescent
Серебристая пушистая ~ Silver, fluffy
Черепаховая ~ Tortoiseshell
Фиолетовая ~ Violet
Белая торчащая ~ White, spiky
Белая пушистая ~ White, fluffy
`) },
    speech: { ru: 'Речь', en: 'Speech', die: 12, items: tbl(`
Умилительное мяуканье ~ Adorable mewling
Заговорщицкий шёпот ~ Conspiratorial whispering
Декадентски модная ~ Decadently fashionable
Красноречивая и поэтичная ~ Eloquent and poetic
Дерзкая ~ Impertinent
Томная ~ Languid
Маниакальная ~ Manic
Петляющая ~ Meandering
Весёлая и насмешливая ~ Mirthful and mocking
Мурлыкающая ~ Purring
Подхалимская ~ Sycophantic
Нарочито заумная ~ Wilfully abstruse
`) },
    demeanour: { ru: 'Нрав', en: 'Demeanour', die: 12, items: tbl(`
Хвастливый ~ Boastful
Придирчивый и точный ~ Fastidious and precise
Непочтительно весёлый ~ Irreverently jocund
Дёрганый, на взводе ~ Jittery and on edge
Сорит деньгами ~ Loose with money
Переменчивый ~ Mercurial
Безрассудный сорвиголова ~ Reckless swashbuckler
Самолюбивое прихорашивание ~ Self-indulgent preening
Сонливый ~ Slumbersome
Вороватый и скрытный ~ Sneaky and larcenous
Сноб-гурман ~ Snobbish gourmet
Подвыпивший и резвый ~ Tipsy and frolicsome
`) },
    dress: { ru: 'Одежда', en: 'Dress', die: 12, items: tbl(`
Плащ и шпоры ~ Cape and spurs
Щегольские кружева и шелка ~ Dandyish lace and silks
Увешан крысиными косточками ~ Festooned with rat bones
Угольно-чёрная шерсть ~ Jet black woollens
Длинные перчатки и чапсы ~ Long gloves and chaps
Длинный цветной вязаный шарф ~ Long, colourful knitted scarf
Пёстрый дублет и бриджи ~ Pied doublet and breeches
Жилет и бриджи из крысиной шкуры ~ Ratskin vest and breeches
Царственная горностаевая мантия ~ Regal ermine cloak
Блестящие красные сапожки ~ Shiny red boots
Элегантный твид ~ Smart tweed
Кисточки и бахрома ~ Tassels and fringes
`) },
    desires: { ru: 'Желание', en: 'Desires', die: 12, items: tbl(`
Стать криминальным авторитетом ~ Become a crime lord
Разжиреть, поедая грызунов ~ Become fat eating rodents
Построить тайный дворец ~ Build a secret palace
Построить небесный корабль до луны ~ Build a sky ship to the moon
Пообщаться с утраченными кошачьими богами ~ Commune with lost cat gods
Слава истребителя чудовищ ~ Fame as a slayer of monsters
Основать винокурню кошачьей мяты ~ Found a catnip distillery
Дурная слава величайшего игрока ~ Infamy as a supreme gambler
Поселиться в крепости Хорблайт ~ Inhabit Hoarblight Keep
Жить в непомерной роскоши ~ Live in exorbitant luxury
Жениться на человеческой аристократке ~ Marry into human nobility
Украсть драгоценности герцога ~ Steal the duke's jewels
`) },
    beliefs: { ru: 'Убеждение', en: 'Beliefs', die: 12, items: tbl(`
Кошачья мята — яд для людей ~ Catnip is poison to humans
Мышиное мясо надо есть ежедневно ~ Consume mouse-flesh daily
Сны — истинная реальность ~ Dreams are the true reality
Под землёй есть злое крысиное царство ~ Evil rat realm underground
Людская знать служит Кэтленду ~ Human nobles serve Catland
Магия угасает ~ Magic is fading
Есть только сырое мясо ~ Only eat raw meat
Хладный Принц давно мёртв ~ The Cold Prince is long dead
Луной правят мыши ~ The moon is ruled by mice
Наг-Лорд обожает кошек ~ The Nag-Lord adores cats
Овощи вредны для здоровья ~ Vegetables harm the health
В Фейри назревает война ~ War is brewing in Fairy
`) }
  }
};
