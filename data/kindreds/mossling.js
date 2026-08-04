/* Мослинг — Mossling. Player's Book, стр. 48–51 (род), 186–187 (род-класс). */
import { tbl, names, d100pairs as d100 } from '../util.js'

export const mossling = {
  id: 'mossling',
  ru: 'Мослинг', en: 'Mossling',
  tagline: 'Корявые древесные человечки, в плодородной плоти которых живут мхи, плесень и грибы.',
  taglineEn: 'Gnarled, woody humanoids whose fertile flesh hosts mosses, moulds, and fungi.',
  type: 'mortal', typeRu: 'Смертный',
  size: 'Small', sizeRu: 'Малый',
  page: 48, kcPage: 186,
  age: { dice: '3d6', base: 50, label: 'Возраст на 1 уровне' },
  lifespan: { dice: '5d8', mult: 10, base: 200, label: 'Срок жизни' },
  height: { dice: '2d6', base: 42, unit: 'in', label: 'Рост' },
  weight: { dice: '2d20', base: 150, unit: 'lbs', label: 'Вес' },
  languages: [
    { ru: 'Волдийский', en: 'Woldish' },
    { ru: 'Мульч', en: 'Mulch' }
  ],
  lore: 'Мослинги — малоизвестный низкорослый народ, коренной для Дольменвуда, сроднившийся с сырыми растениями и плесенью глухих чащ. Приземистые и пухлые, с зелёной, жёлтой или бурой кожей, текстурой как морщинистая кора, покрытой плесенью, лишайником, грибами и ползучими растениями. Волосы и бороды зелёные или чёрные, растительные. Раненый мослинг сочится белым древесным соком. С возрастом становятся мудрее и всё больше похожи на растения; после смерти тело за год перегнивает в богатый компост. Живут в тёмных сырых лесах, роя норы. Формально прихожане Церкви, но на деле чтят своих богов глубокого леса и плодородного подземья (Могба).',
  relations: 'В добрых отношениях со смертными и полуфейскими родами. К феям относятся с любопытством — как к странникам издалека с интересными байками. В людских поселениях мослингов охотно принимают: они приходят продавать грибы, эль или сыр на рынок.',
  classAdvice: 'Мослинги чаще всего воины и охотники. Изредка их принимают в рыцари, редко идут в Церковь клириками или монахами, и почти никогда не имеют достаточно связи с Фейри для чароплёта.',

  traits: [
    { ru: 'Броня и оружие', en: 'Armour and Weapons', p: 49,
      d: 'Броню нужно подгонять под малый размер. Большое (Large) оружие недоступно. Мослинги предпочитают неметаллическую броню и делают доспехи из закалённой коры и сосновых шишек. Если при генерации выпала кольчуга — заменяется корьевой бронёй; латы — сосновой бронёй.' },
    { ru: 'Сноровки', en: 'Knacks', p: 49,
      d: 'Мослинги практикуют тщательно оберегаемые полумагические ремёсла — сноровки. Каждый мослинг знает одну, выбранную или выброшенную при создании персонажа.' },
    { ru: 'Навыки мослинга', en: 'Mossling Skills', p: 49,
      d: 'Цель навыка Выживание при собирательстве — 5.' },
    { ru: 'Стойкость', en: 'Resilience', p: 49,
      d: 'Мослинги крепки, как узловатый ствол старого дерева: +4 к спасброскам против грибных спор и ядов и +2 ко всем остальным спасброскам.' },
    { ru: 'Симбиотическая плоть', en: 'Symbiotic Flesh', p: 49,
      d: 'С возрастом сырая плодородная плоть мослинга подхватывает семена и споры, которые прорастают в симбиотические растения и грибы. На каждом уровне (включая 1-й) персонаж получает случайную черту из таблицы Симбиотической плоти. Повторы можно перебросить или взять как усиление черты.' }
  ],

  symbioticFlesh: tbl(`
Внешние части ушей заменены студенистым грибом. ~ Outer parts of ears replaced by jelly fungus.
Пятна лишайника. ~ Patches of lichen.
Весной в бороде распускаются изящные цветы. ~ Dainty flowers bloom in the beard in springtime.
Дрожжевые инфекции во влажных местах. ~ Yeast infections in moist places.
Поганки растут из суставов. ~ Toadstools growing from joints.
Покрыт склизким зелёным желе. ~ Covered in slimy, green jelly.
Из уха растёт миниатюрное деревце. ~ Miniature tree growing from ear.
Кожа пронизана мицелием. ~ Skin riddled with mycelia.
Глаза затягивает прозрачная жёлтая плесень. ~ Eyes fur over with transparent, yellow mould.
Съедобный сыр между пальцами ног. ~ Edible toe cheese.
В подмышках растёт древесный трутовик. ~ Growths of woody, bracket fungus in the armpits.
Мшистые ступни. ~ Mossy feet.
Вьющиеся лозы обвивают конечности и торс. ~ Climbing vines wrapped around limbs and torso.
Буйная поросль папоротника в паху. ~ Radical fern growth around groin.
Мшистые бицепсы. ~ Mossy biceps.
Дождевики растут на ягодицах и коленях. ~ Puffball growths around the buttocks and knees.
Петрушка вместо волос на груди. ~ Parsley chest hair.
В волосах запуталась ежевика. ~ Blackberry brambles tangled in the hair.
В волосах растут съедобные грибы. ~ Edible mushrooms growing in hair.
Из макушки растёт полуразумный гриб. ~ Semi-sentient mushroom growing from top of head.
`),

  kindredClass: {
    ru: 'Мослинг (род-класс)', en: 'Mossling Kindred-Class',
    primeAbilities: ['WIS', 'CON'],
    primeRu: 'Телосложение и Мудрость',
    hitDie: 'd6', hpAfter10: 2,
    aptitude: 'semi-martial', aptitudeRu: 'Полувоинская',
    armour: 'Любая, включая щиты', armourEn: 'Any, including shields',
    weapons: 'Малое и Среднее', weaponsEn: 'Small and Medium',
    armourAllowed: ['none', 'light', 'medium', 'heavy'], shields: true,
    weaponSizes: ['Small', 'Medium'],
    desc: 'Мослинги-искатели приключений умеют много полезного вокруг грибов и владеют малыми магическими талантами — сноровками.',
    startArmour: [
      { r: [1, 1], items: ['leather'] },
      { r: [2, 2], items: ['leather', 'shield'] },
      { r: [3, 3], items: ['bark'] },
      { r: [4, 4], items: ['bark', 'shield'] },
      { r: [5, 5], items: ['pinecone'] },
      { r: [6, 6], items: ['pinecone', 'shield'] }
    ],
    startWeapons: [
      { r: [1, 1], items: ['club'] },
      { r: [2, 2], items: ['dagger'] },
      { r: [3, 3], items: ['sling', 'stones'] },
      { r: [4, 4], items: ['shortbow', 'arrows'] },
      { r: [5, 6], items: ['shortsword'] }
    ],
    classItems: [],
    grantsKnack: true,
    grantsSymbiotic: true,
    traits: [
      { ru: 'Броня', en: 'Armour', d: 'Броню нужно подгонять под малый размер. Мослинги предпочитают неметаллическую броню — из закалённой коры и сосновых шишек.' },
      { ru: 'Навыки мослинга', en: 'Mossling Skills', d: 'Выживание при собирательстве — цель 5.' },
      { ru: 'Сноровки', en: 'Knacks', d: 'Одна сноровка, выбранная или выброшенная при создании. Даёт новые умения на 1, 3, 5 и 7 уровнях.' },
      { ru: 'Стойкость', en: 'Resilience', d: 'Спасброски род-класса уже очень хороши; вдобавок +2 к спасброскам против грибных спор и ядов.' },
      { ru: 'Симбиотическая плоть', en: 'Symbiotic Flesh', d: 'На каждом уровне (включая 1-й) — случайная черта из таблицы Симбиотической плоти.' },
      { ru: 'Грибной симбиоз (с 4 ур.)', en: 'Fungal Symbiosis (from Level 4)', d: 'С 4 уровня мослинг может за 1 ход попытаться заключить симбиоз с невраждебным чудовищным грибом (уровнем минимум на 3 ниже своего), получив возможность применять его особые силы.' }
    ],
    advancement: [
      [1, 0, '1d6', 0, 8, 9, 10, 13, 12],
      [2, 2200, '1d6', 0, 8, 9, 10, 13, 12],
      [3, 4400, '1d6', 1, 7, 8, 9, 12, 11],
      [4, 8800, '1d6', 1, 7, 8, 9, 12, 11],
      [5, 17600, '1d6', 2, 6, 7, 8, 11, 10],
      [6, 35200, '1d6', 2, 6, 7, 8, 11, 10],
      [7, 70400, '1d6', 3, 5, 6, 7, 10, 9],
      [8, 140800, '1d6', 3, 5, 6, 7, 10, 9],
      [9, 280000, '1d6', 4, 4, 5, 6, 9, 8],
      [10, 400000, '1d6', 4, 4, 5, 6, 9, 8],
      [11, 520000, '+2', 5, 3, 4, 5, 8, 7],
      [12, 640000, '+2', 5, 3, 4, 5, 8, 7],
      [13, 760000, '+2', 6, 2, 3, 4, 7, 6],
      [14, 880000, '+2', 6, 2, 3, 4, 7, 6],
      [15, 1000000, '+2', 7, 2, 2, 3, 6, 5]
    ],
    skills: []
  },

  names: names(`
Домбо|Dombo ~ Билибом|Bilibom ~ Бендиом|Bendiom ~ Баркхоп|Barkhop
Гобд|Gobd ~ Бримбул|Brimbul ~ Блобул|Blobul ~ Конкер|Conker
Гобулом|Gobulom ~ Эббли|Ebbli ~ Эбдвол|Ebdwol ~ Данклоу|Danklow
Голобд|Golobd ~ Гибли|Ghibli ~ Глоб|Glob ~ Фернхед|Fernhead
Гремо|Gremo ~ Гоббли|Gobbli ~ Гомбли|Gombly ~ Фротер|Frother
Гвомотом|Gwomotom ~ Гведим|Gwedim ~ Греблим|Greblim ~ Граймхамп|Grimehump
Холлогоул|Hollogowl ~ Хигволд|Higwold ~ Гвудвом|Gwoodwom ~ Хогскап|Hogscap
Кабоб|Kabob ~ Ибулолд|Ibulold ~ Холлб|Hollb ~ Моссбирд|Mossbeard
Коллобом|Kollobom ~ Имбви|Imbwi ~ Клолб|Klolb ~ Моссфарроу|Mossfurrow
Лимбли|Limbly ~ Клибли|Klibli ~ Кволотомб|Kwolotomb ~ Молд|Mould
Лоблоу|Loblow ~ Климбим|Klimbim ~ Ламбоп|Lambop ~ Молдфингер|Mouldfinger
Мобдемолд|Mobdemold ~ Либиб|Libib ~ Морромб|Morromb ~ Мадфут|Mudfoot
Ньома|Nyoma ~ Лимимб|Limimb ~ Мвумб|Mwoomb ~ Магфоум|Mugfoam
Обольм|Obolm ~ Мариб|Marib ~ Олоб|Olob ~ Малчвамп|Mulchwump
Оглом|Oglom ~ Милик|Milik ~ Убл|Oobl ~ Машрамп|Mushrump
Омб|Omb ~ Шлирими|Shlirimi ~ Шлурбель|Shlurbel ~ Оддполип|Oddpolyp
Шмолд|Shmold ~ Шобд|Shobd ~ Смодрон|Smodron ~ Пафхелм|Puffhelm
Сламбред|Slumbred ~ Скимбим|Skimbim ~ Томдаун|Tomdown ~ Смолчиз|Smallcheese
Умбертоп|Umbertop ~ Слимпк|Slimpk ~ Томумболо|Tomumbolo ~ Содволлоу|Sodwallow
Вобоболд|Wobobold ~ Смодри|Smodri ~ Воррib|Worrib ~ Твигглер|Twiggler
`),
  namesNote: 'Среди своих мослинги обычно не пользуются фамилиями. Если чужаки настаивают, берут смесь волдийских слов, связанных с их культурой.',

  backgrounds: tbl(`
Портной по коре ~ Bark tailor
Охотник на кабанов ~ Boar hunter
Сыровар ~ Cheesemaker
Компостный грабельщик ~ Compost raker
Фунголог ~ Fungologist
Грибовод ~ Fungus farmer
Игрок ~ Gambler
Горнист ~ Horn blower
Мшистый пивовар ~ Moss brewer
Мховод ~ Moss farmer
Ночной собиратель ~ Night forager
Ученик оракула ~ Oracle's apprentice
Трубочный мастер ~ Pipe maker
Колбасник ~ Sausage maker
Дрессировщик белок ~ Squirrel trainer
Свинопас ~ Swineherd
Трактирщик ~ Tavernkeep
Бродяга ~ Vagrant
Червевод ~ Worm farmer
Дрожжевод ~ Yeast farmer
`),

  trinkets: d100(`
Мешочек каменных шариков. У каждого есть имя, и он катится к тому, кто его произнёс. ~ A bag of stone marbles. Each has a name and rolls towards whoever speaks it.
Кусок сыра, заражённый галлюциногенным грибком. ~ A block of cheese infected with hallucinogenic fungus.
Окровавленный колпак, некогда принадлежавший редкапу. ~ A bloodstained hat that once belonged to a redcap.
Книга, обвиняющая в преступлениях каждого из 100 святых Дольменвуда. Найдена на теле убитого. ~ A book alleging crimes by each of the 100 saints of Dolmenwood, found on a murdered man.
Бутылка шампуня из дрожжевой пены — незаменима для блеска мшистых грив. ~ A bottle of yeast-froth shampoo, essential for maintaining the lustre of mossy manes.
Букет жимолости, сочащийся настоящим мёдом. Мёд привлекает ос. ~ A bouquet of honeysuckle that drips real honey. The honey attracts wasps.
Латунный коровий колокольчик. При ударе молоко и сыр поблизости подпрыгивают на полфута к нему. ~ A brass cowbell. When struck, nearby milk and cheese products jump half a foot towards it.
Широкополая шляпа, покрытая мерцающим мхом. ~ A broad-brimmed hat covered in shimmering moss.
Бронзовый идол двухголового грибного бога. ~ A bronze idol to a two-headed mushroom god.
Кусок вулканической породы, тёплый на ощупь. На нём вырезана одна староволдийская руна. ~ A chunk of volcanic rock, warm to the touch, carved with a single Old Woldish rune.
Глиняная фигурка пузатого одноглазого великана. ~ A clay figurine of a pot-bellied giant with a single eye.
Гроздь грибов из дюжины разных видов, живущих в симбиозе. ~ A cluster of fungus consisting of a dozen different kinds of mushrooms living in symbiosis.
Коллекция камешков, отколотых от разных надгробий. ~ A collection of small rocks, all chipped from different gravestones.
Котелок, добавляющий грибы в любое приготовленное в нём блюдо. ~ A cooking pot that adds mushrooms to every dish cooked inside it.
Цветок, засушенный в дневнике мертвеца. ~ A flower pressed inside a dead man's journal.
Охотничий рог из клыка огромного кабана. ~ A hunting horn fashioned from a great boar tusk.
Банка массажного масла из голубого сыра. ~ A jar of blue cheese massage oil.
Банка зелёного желе с этикеткой «Не ешь меня». ~ A jar of green jelly with the label "Don't Eat Me."
Большое яйцо, доверенное тебе перепуганным вудгрю. ~ A large egg, entrusted to you by a panicked woodgrue.
Крупный крыжовник, внутри которого, кажется, что-то растёт. ~ A large gooseberry that appears to have a creature growing inside it.
Большая розовая колбаса. Пытается уползти, если оставить её без присмотра. ~ A large, pink sausage. Tries to crawl away if left unattended.
Лист, меняющийся с временами года: к зиме умирает, весной возрождается. ~ A leaf that changes with the seasons, dying by winter only to rejuvenate in spring.
Мшистый камень. Если положить его на землю на минуту и поднять, из-под него разбегаются жуки. ~ A mossy rock. When placed on the ground and then lifted, bugs scurry out from underneath.
Заплесневелый гобелен с охотой на свинью мифических размеров. ~ A mould-riddled tapestry depicting the hunt for a swine of mythic size.
Дождевик с десятками крошечных ртов, дружно рыгающих на рассвете. ~ A puffball with dozens of tiny mouths which burp in unison at dawn.
Кошель из шкуры дождевика, наполненный желе. ~ A puffball-skin pouch filled with jelly.
Мешок наполовину пустых бутылок эля. ~ A sack of half-empty ale bottles.
Запечатанная бутыль спиртного, выгнанного из компостированных останков одного из твоих предков. ~ A sealed bottle of spirits, brewed from the composted remains of one of your ancestors.
Пастуший посох, вселяющий страх в скот, когда им размахивают. ~ A shepherd's crook that induces fear in farm animals when brandished.
Один волос с головы эльфийской госпожи — знак её приязни. ~ A single hair from the head of an elven lady; a token of her affection.
Маленький жук, найденный на дороге. С тех пор ты получил гневное письмо от гримолкина, обвиняющее тебя в краже. ~ A small beetle you found on the road, for which an angry grimalkin charges you with theft.
Маленькая фигурка бреггла из сушёной грибной мякоти. ~ A small effigy of a breggle made from dried mushroom flesh.
Кошелёк волшебных орехов. Расколотый орех изрекает жемчужину мудрости. ~ A small pouch of magic nuts. When a nut is broken open, it emits a pearl of wisdom.
Маленькая змея с запиской «Вернуть...». Имя владельца смазано. ~ A small snake with a "Return to" note attached. The owner's name is smudged out.
Маленькая полая поганка с крошечной деревянной дверцей. ~ A small, hollow toadstool with a tiny wooden door.
Раковина улитки, в которой на рассвете вырастает новая улитка, если старую убрать или убить. ~ A snail shell that grows a new snail at dawn if the old one is removed or killed.
Ошейник и поводок размером с белку. ~ A squirrel-sized collar and leash.
Книжка сказок об обаятельных похождениях крысиного народа с луны. ~ A story book about the charming exploits of the rat-people of the moon.
Уникальная трубочная смесь твоего собственного изобретения. Малость взрывоопасна. ~ A unique pipeweed mix of your own invention. A bit too combustible.
Лейка, из носика которой постоянно капает вода. ~ A watering can that constantly trickles water from its spout.
Бурдюк жёлтой слизи, которая капает вверх, если его откупорить. ~ A waterskin of yellow slime that drips upwards when unstoppered.
Круг сыра, который, покатившись, никогда не теряет разгона. ~ A wheel of cheese that never loses momentum once it starts rolling.
Деревянная фигурка тебя самого, стареющая вместе с тобой. ~ A wooden carving of yourself that ages as you do.
Деревянная нога, найденная и переделанная тобой в инкубатор для редких грибов. ~ A wooden peg leg that you found and converted into an incubator for rare fungi.
Червь, извивания которого медленно складываются в угрожающие пророчества. ~ A worm whose squirming slowly spells out threatening prophecies.
Очаровательный красно-белый шампиньон. Шепчет тебе, когда никто не слышит. ~ An adorable red-and-white button mushroom. Whispers to you when no one else is listening.
Неполная и, возможно, неточная карта всех корчм Дольменвуда. ~ An incomplete, and possibly inaccurate, map of all the inns in Dolmenwood.
Луковица в форме младенца. ~ An onion shaped like a baby.
Чертежи чудесных механических часов с мышиным органом. ~ Blueprints for a marvellous mechanical mouse organ clock.
Десятки разных кусков коры, сшитых вместе как книга. ~ Dozens of different kinds of bark, stitched together like a book.
`),

  details: {
    head: { ru: 'Голова', en: 'Head', die: 12, items: tbl(`
Лысая как отполированный орех ~ Bald like a polished nut
Гудит от мух ~ Buzzing with flies
Мягкая шляпа свисает на глаза ~ Floppy hat droops over eyes
Пушистые зелёные волосы ~ Fuzzy green hair
Огромные висячие уши ~ Huge floppy ears
Длинные сальные волосы ~ Long greasy hair
Слишком большая ~ Much too big
Без шеи ~ No neck
Клочковатые рыжие волосы ~ Patchy orange hair
Остроконечный войлочный колпак ~ Pointy felt hat
Шатается ~ Wobbly
Морщинистая как грецкий орех ~ Wrinkled like a walnut
`) },
    face: { ru: 'Лицо', en: 'Face', die: 12, items: tbl(`
Борода из пенных дрожжей ~ Beard of frothy yeast
Мельтешащий язык ~ Darting tongue
Глаза размером с кулак ~ Eyes as big as fists
Глаза как омуты глубокого космоса ~ Eyes like pools of deep space
Глаза как крошечные чёрные шарики ~ Eyes like tiny black marbles
Длинный висячий нос ~ Long, floppy nose
Похоже на вырезанную картофелину ~ Looks like a carved potato
Огромные раздутые ноздри ~ Massive flared nostrils
Рот в дрожжевой пене ~ Mouth foaming with yeast
Из ноздрей сочится фиолетовая слизь ~ Nostrils ooze purple slime
Острый корневидный нос ~ Pointy root nose
Дрожащие губы ~ Wobbly lips
`) },
    body: { ru: 'Тело', en: 'Body', die: 12, items: tbl(`
Дряблое ~ Blubbery
Покрыто пушком ~ Covered in downy fur
Складки жира ~ Flabby rolls
Бугристое ~ Lumpy
Буйная шерсть в пупке ~ Rampant belly button fur
Шарообразное ~ Spherical
Короткие ноги ~ Stubby legs
Обрубки-руки ~ Stumpy arms
С завитками как узловатое дерево ~ Whorled like knotted wood
Шире, чем выше ~ Wider than tall
Дрожащее брюшко ~ Wobbly paunch
Морщинистые складки кожи ~ Wrinkled folds of skin
`) },
    speech: { ru: 'Речь', en: 'Speech', die: 12, items: tbl(`
Баритон ~ Baritone
Похабная ~ Filthy
Ворчливая ~ Grumbling
Петляющая ~ Meandering
Бормочущая ~ Mumbling
Бубнящая ~ Muttering
Невнятная ~ Obtuse
Мокротная ~ Phlegmy
Пищащая ~ Squeaking
Чавкающая ~ Squelchy
Заикающаяся ~ Stammering
Хриплая ~ Wheezy
`) },
    demeanour: { ru: 'Нрав', en: 'Demeanour', die: 12, items: tbl(`
Шумный ~ Blustery
Мрачный ~ Brooding
Трусливый ~ Cowardly
Сонный ~ Dozy
Суетливый ~ Flustered
Ворчливый ~ Grumpy
Дерзкий ~ Impertinent
Вялый ~ Lethargic
Скупой ~ Miserly
Назойливо приветливый ~ Overbearingly affable
Смекалистый ~ Shrewd
Рассказывает ужасные шутки ~ Tells terrible jokes
`) },
    dress: { ru: 'Одежда', en: 'Dress', die: 12, items: tbl(`
Ворсистый фетр ~ Brushed felt
Уютное вязаное ~ Cosy knitwear
Щегольской твид ~ Dapper tweed
Засаленная кожа ~ Greasy leathers
Грязное тряпьё ~ Grubby rags
Вязаный плющ ~ Knitted ivy
Набедренная повязка ~ Loincloth
Нудист ~ Naturist
Шкуры ~ Pelts
Свиная замша ~ Pig suede
Колючая шерсть ~ Scratchy wool
Тканые грибные ножки ~ Woven fungus stems
`) },
    desires: { ru: 'Желание', en: 'Desires', die: 12, items: tbl(`
Дюжина супругов ~ A dozen spouses
Раздобыть лунный сыр ~ Acquire moon cheese
Стать грибным великаном ~ Become a fungus giant
Вывести разумную свинью ~ Breed a sentient swine
Сварить универсальный эликсир ~ Brew the universal elixir
Съесть разумный гриб ~ Consume sentient fungi
Основать мшистую пивоварню ~ Found a moss brewery
Основать подземное царство ~ Found underground realm
Вырастить клонов себя ~ Grow clones of self
Слиться с грибным разумом ~ Meld with the fungal mind
Владеть огромной корчмой ~ Own a sprawling inn
Попробовать все известные эли ~ Sample all known ales
`) },
    beliefs: { ru: 'Убеждение', en: 'Beliefs', die: 12, items: tbl(`
Эль необходим для жизни ~ Ale is essential for life
Мытьё вредит здоровью ~ Bathing is inimical to health
Ежедневная жертва старейшинам ~ Daily sacrifice to the elders
Получает видения от луны ~ Gets visions from the moon
Люди — голые обезьяны ~ Humans are naked monkeys
Тебя преследуют мстительные призраки ~ Pursued by vengeful ghosts
В каменных кругах зарыто золото ~ Stone circles hide buried gold
Говорящие совы что-то замышляют ~ Talking owls are plotting
Друны всех покорят ~ The Drune will conquer all
Герцог втайне фея ~ The duke is secretly a fairy
Грибной разум превыше всего ~ The fungal mind is supreme
У деревьев есть глаза ~ The trees have eyes
`) }
  }
};
