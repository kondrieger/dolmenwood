/* Вудгрю — Woodgrue. Player's Book, стр. 52–55 (род), 188–189 (род-класс). */
(function () {
  'use strict';
  var tbl = DW.tbl, names = DW.names, d100 = DW.d100pairs;

  DW.KINDREDS = DW.KINDREDS || {};
  DW.KINDREDS.woodgrue = {
    id: 'woodgrue',
    ru: 'Вудгрю', en: 'Woodgrue',
    tagline: 'Полуфейские гоблины с мордочками летучих мышей, известные любовью к музыке, гулянкам и поджогам.',
    taglineEn: 'Bat-faced demi-fey goblins, known for their love of music, revelry, and arson.',
    type: 'demi-fey', typeRu: 'Полуфейский',
    size: 'Small', sizeRu: 'Малый',
    page: 52, kcPage: 188,
    age: { dice: '3d6', base: 50, label: 'Возраст на 1 уровне' },
    lifespan: { dice: '2d100', base: 300, label: 'Срок жизни' },
    height: { dice: '2d6', base: 36, unit: 'in', label: 'Рост' },
    weight: { dice: '2d10', base: 60, unit: 'lbs', label: 'Вес' },
    languages: [
      { ru: 'Волдийский', en: 'Woldish' },
      { ru: 'Сильван', en: 'Sylvan' }
    ],
    lore: 'Вудгрю — капризные гоблины с мордочками летучих мышей, много поколений назад покинувшие Фейри ради затхлых лощин смертного мира. У них огромные хлопающие уши и мягкий пушок на голове и груди, а тело как у человеческого ребёнка. Живут кочевниками, поодиночке или малыми группами, ставя крохотные укрытия высоко на деревьях. Обожают дикие пляски и какофоническую ночную музыку на дудках — в их музыке ещё живёт магия Фейри. Несколько раз в год старейшина созывает «мут» — пятидневное сборище до двух сотен вудгрю.',
    relations: 'Вудгрю рады обществу любого рода, но особенно тех, кто разделяет их буйное чувство юмора. В людских поселениях к ним относятся настороженно, зная их нрав, но не пускать вудгрю — навлечь на себя ещё большую беду.',
    classAdvice: 'Вудгрю чаще всего барды, маги или воры. Редко их принимают в рыцари. Клириками и монахами быть НЕ МОГУТ.',

    traits: [
      { ru: 'Броня и оружие', en: 'Armour and Weapons', p: 53,
        d: 'Броню нужно подгонять под малый размер. Большое (Large) оружие недоступно.' },
      { ru: 'Неудержимое ликование', en: 'Compulsive Jubilation', p: 53,
        d: 'Вудгрю, увидевший гулянку, пир, празднество или фестиваль, обязан присоединиться — его тянет туда всем существом. Если он почему-то хочет удержаться, делает спасбросок против Заклинания (но чувствует себя разбитым и подавленным всё это время).' },
      { ru: 'Оборонительный бонус', en: 'Defensive Bonus', p: 53,
        d: 'В ближнем бою с Большими существами вудгрю получает +2 к Классу Брони.' },
      { ru: 'Безумное веселье', en: 'Mad Revelry', p: 53,
        d: 'Раз в день вудгрю может сыграть одну из зачарованных мелодий на духовом инструменте, отвратительно улюлюкая и приплясывая. Все живые в 30 футах (включая союзников!) делают спасбросок против Заклинания. Феи и полуфейские получают +2. Эффект длится, пока вудгрю играет; играя, он может двигаться, но не атаковать и не действовать иначе.' },
      { ru: 'Лунное зрение', en: 'Moon Sight', p: 53,
        d: 'Вудгрю видит в темноте на 60 футов, будто мир слабо светится лунным светом. Штрафов за тусклый свет нет, но мелкие детали (например, надписи) не различить.' },
      { ru: 'Музыкальные инструменты', en: 'Musical Instruments', p: 53,
        d: 'Вудгрю может использовать музыкальный инструмент как оружие ближнего боя, нанося 1d4 урона.' },
      { ru: 'Стартовое снаряжение', en: 'Starting Equipment', p: 53,
        d: 'Вудгрю начинает игру с духовым инструментом.' },
      { ru: 'Уязвимость к холодному железу', en: 'Vulnerable to Cold Iron', p: 53,
        d: 'Оружие из холодного железа наносит +1 урона.' },
      { ru: 'Навыки вудгрю', en: 'Woodgrue Skills', p: 53,
        d: 'Цель навыка Слушать — 5.' }
    ],

    melodies: tbl(`
Признание: жертвы говорят заплетающимся языком, выбалтывая глубоко спрятанное чувство или тайну союзника. ~ Confide
Пляска: жертвы пускаются в нелепую жигу. Получают +1 к КБ, но не могут сойти с места. ~ Dance
Возлияние: жертвы жадно поглощают любые доступные жидкости (питьевые или нет), травы и грибы и ведут себя как пьяные, получая −2 к броскам атаки до конца веселья. ~ Imbibe
Насмешка: жертвы издеваются над тем, что только что произошло, будь то слово или дело. ~ Jape
Ликование: жертвы разражаются неудержимым хохотом и не могут говорить. Каждый раунд шанс 1 из 6 упасть от смеха. ~ Jubilate
Верхом: жертвы пытаются оседлать ближайших существ, друзей или врагов, и кататься на них верхом (спасбросок против Захвата, чтобы не дать себя оседлать). ~ Mount
Гулянка: жертвы не могут говорить — вместо этого выкрикивают чудовищный скэт, пытаясь угнаться за мелодией. Скорость вдвое меньше, если они идут не в сторону вудгрю. ~ Revel
`),

    kindredClass: {
      ru: 'Вудгрю (род-класс)', en: 'Woodgrue Kindred-Class',
      primeAbilities: ['DEX', 'CHA'],
      primeRu: 'Харизма и Ловкость',
      hitDie: 'd6', hpAfter10: 1,
      aptitude: 'semi-martial', aptitudeRu: 'Полувоинская',
      armour: 'Любая, включая щиты', armourEn: 'Any, including shields',
      weapons: 'Малое и Среднее', weaponsEn: 'Small and Medium',
      armourAllowed: ['none', 'light', 'medium', 'heavy'], shields: true,
      weaponSizes: ['Small', 'Medium'],
      desc: 'Отличный слух, умение прятаться и зрение в темноте делают вудгрю прекрасными разведчиками и дозорными. А их капризные зачарованные песни вносят в любую партию нотку анархического юмора.',
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
        { r: [3, 3], items: ['handaxe'] },
        { r: [4, 4], items: ['shortbow', 'arrows'] },
        { r: [5, 5], items: ['shortsword'] },
        { r: [6, 6], items: ['sling', 'stones'] }
      ],
      classItems: ['windinstrument'],
      traits: [
        { ru: 'Подгонка брони', en: 'Armour Tailoring', d: 'Броню нужно подгонять под малый размер.' },
        { ru: 'Неудержимое ликование', en: 'Compulsive Jubilation', d: 'Увидев праздник, вудгрю обязан присоединиться (спасбросок против Заклинания, чтобы удержаться).' },
        { ru: 'Оборонительный бонус', en: 'Defensive Bonus', d: '+2 к КБ в ближнем бою с Большими существами.' },
        { ru: 'Безумное веселье', en: 'Mad Revelry', d: 'Раз в день ЗА КАЖДЫЙ УРОВЕНЬ (на 1 уровне — 1 раз в день) можно сыграть одну из зачарованных мелодий.' },
        { ru: 'Лунное зрение', en: 'Moon Sight', d: 'Видит в темноте на 60 футов.' },
        { ru: 'Музыкальные инструменты', en: 'Musical Instruments', d: 'Инструмент как оружие ближнего боя, 1d4 урона.' },
        { ru: 'Уязвимость к холодному железу', en: 'Vulnerable to Cold Iron', d: 'Холодное железо наносит +1 урона.' },
        { ru: 'Навыки вудгрю', en: 'Woodgrue Skills', d: 'Слушать — цель 5.' },
        { ru: 'Скрытность', en: 'Stealth', d: 'Специальный навык, цель 6 на 1 уровне: можно спрятаться, когда единственное укрытие — тени, и остаться незамеченным при провале внезапности.' }
      ],
      advancement: [
        [1, 0, '1d6', 0, 13, 12, 14, 16, 14],
        [2, 2000, '1d6', 0, 13, 12, 14, 16, 14],
        [3, 4000, '1d6', 1, 12, 11, 13, 15, 13],
        [4, 8000, '1d6', 1, 12, 11, 13, 15, 13],
        [5, 16000, '1d6', 2, 11, 10, 12, 14, 12],
        [6, 32000, '1d6', 2, 11, 10, 12, 14, 12],
        [7, 64000, '1d6', 3, 10, 9, 11, 13, 11],
        [8, 128000, '1d6', 3, 10, 9, 11, 13, 11],
        [9, 260000, '1d6', 4, 9, 8, 10, 12, 10],
        [10, 380000, '1d6', 4, 9, 8, 10, 12, 10],
        [11, 500000, '+1', 5, 8, 7, 9, 11, 9],
        [12, 620000, '+1', 5, 8, 7, 9, 11, 9],
        [13, 740000, '+1', 6, 7, 6, 8, 10, 8],
        [14, 860000, '+1', 6, 7, 6, 8, 10, 8],
        [15, 980000, '+1', 7, 6, 5, 7, 9, 7]
      ],
      skills: [{ ru: 'Скрытность', en: 'Stealth', targets: [6, 6, 5, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2] }]
    },

    names: names(`
Багнак|Bagnack ~ Бишга|Bishga ~ Богфринк|Bogfrink ~ Бобблслайм|Bobbleslime
Бармкаджел|Barmcudgel ~ Канагуп|Canaghoop ~ Бонгвретч|Bongwretch ~ Богбаббл|Bogbabble
Блумфекст|Bloomfext ~ Черуффу|Cheruffue ~ Чандер|Chunder ~ Бутсвоп|Bootswap
Банглбоун|Bunglebone ~ Дула|Doola ~ Данклоб|Danklob ~ Чамли|Chumley
Капратт|Capratt ~ Фрогфирр|Frogfyrr ~ Фрондбонг|Frondbong ~ Кобваллоп|Cobwallop
Чимм|Chimm ~ Грюкалле|Gruecalle ~ Гобблбэг|Gobblebag ~ Друглайт|Drooglight
Делгоданд|Delgodand ~ Хулбутес|Hoolbootes ~ Хутбра|Hootbra ~ Дангоббл|Dungobble
Дранкер|Drunker ~ Молспурер|Maulspoorer ~ Лонгснайп|Longsnipe ~ Эггмамбл|Eggmumble
Эортбан|Eortban ~ Могсмоут|Mogsmote ~ Лампфриск|Lumpfrisk ~ Хогслаппер|Hogslapper
Гранкл|Grunkle ~ Моулмоч|Molemoch ~ Мабмангл|Mabmungle ~ Хортлсвуп|Hortleswoop
Габбер|Gubber ~ Мунмилк|Moonmilk ~ Мангус|Mungus ~ Хангерслип|Hungerslip
Гамрут|Gumroot ~ Мунмун|Munmun ~ Обблхоб|Obblehob ~ Ланкваббл|Lankwobble
Ганкусс|Gunkuss ~ Неттаклэр|Nettaclare ~ Оддлер|Oddler ~ Мурсноб|Moorsnob
Кангус|Kungus ~ Урча|Oorcha ~ Удлер|Oodler ~ Мандерсног|Mundersnog
Лонгтиттл|Longtittle ~ Паллипальм|Palliepalm ~ Пипплпоук|Pipplepoke ~ Пенскрамп|Pencecrump
Луббал|Lubbal ~ Пимплпук|Pimplepook ~ Словенд|Slovend ~ Персникль|Persnickle
Олпайпс|Olpipes ~ Пагамп|Puggump ~ Умпл|Umple ~ Шандербог|Shunderbog
Рункелгейт|Runkelgate ~ Роллиполк|Rolliepolk ~ Анклорд|Unclord ~ Снодграсс|Snodgrass
Випуз|Weepooze ~ Сассерпайп|Sasserpipe ~ Андермап|Undermap ~ Валлербог|Wallerbog
Вампус|Wumpus ~ Випси|Whipsee ~ Вупла|Whoopla ~ Вудфаффл|Woodfuffle
`),

    backgrounds: tbl(`
Циркач ~ Circus performer
Осуждённый поджигатель ~ Convicted arsonist
Придворный шут ~ Court jester
Охотник на ворон ~ Crow hunter
Сборщик навоза ~ Dung collector
Похититель яиц ~ Egg thief
Странствующий дудочник ~ Errant piper
Пиротехник ~ Firework maker
Торговец грибами ~ Fungus trader
Жонглёр ~ Juggler
Разводчик опарышей ~ Maggot farmer
Медовар ~ Mead brewer
Ловец мотыльков ~ Moth trapper
Собиратель грибов ~ Mushroom forager
Коробейник ~ Pedlar
Резчик трубок ~ Pipe carver
Тряпичник ~ Ragpicker
Палаточник ~ Tent maker
Расхититель гробниц ~ Tomb robber
Слуга чародея ~ Wizard's servant
`),

    trinkets: d100(`
Мешочек восхитительных леденцов. ~ A bag of delicious boiled sweets.
Корзина змей, предназначенных для жонглирования. ~ A basket of snakes, intended for juggling.
Потрёпанная шляпа с гордо пришитой на макушке головой чучела лебедя. ~ A battered hat with a stuffed swan's head stitched proudly at the summit.
Костяной свисток. Если дунуть в него ночью, окрестные летучие мыши и ночные птицы впадают в неистовство. ~ A bone whistle. When blown at night, it sends nearby bats and night birds into a frenzy.
Бутыль с грязной водой из Купален Астралона. ~ A bottle containing dirty water from the Baths of Astralon.
Бутылёк чернил, который при открытии умудряется разлиться повсюду. ~ A bottle of ink that always seems to spill everywhere when opened.
Бронзовая статуэтка химеры из дюжины разных зверей. Подаривший клянётся, что это настоящее существо. ~ A bronze statuette of a chimera made up of a dozen different animals, insisted to be real.
Погребальный саван, будто отпечатавший на себе лицо. С каждым днём лицо всё различимее. ~ A burial shroud seemingly imprinted with a face, becoming more distinguishable every day.
Керамическая тарелка, издающая простенький мотив, если её поскрести. ~ A ceramic plate that emits a simple tune when scratched.
Коллекция грибов, одолженная тебе моцлингом. ~ A collection of fungi, loaned to you by a mossling.
Мёртвая ворона в мешке. До того, как ты её убил, ты был почти уверен, что она за тобой следит. ~ A dead crow in a bag. Before you killed it, you were pretty sure it was spying on you.
Накладные усы. Надев их, ты выглядишь с полной бородой. ~ A fake moustache. When worn, you appear to have a full beard.
Запретный трактат, утверждающий, что у гримолкинов и вудгрю общие предки. ~ A forbidden treatise claiming grimalkins and woodgrues share the same ancestors.
Стеклянный ящичек с приколотым внутри гигантским мотыльком. ~ A glass case with a giant moth pinned inside.
Арфа в форме утки. Игра на ней привлекает внимание окрестной водоплавающей птицы. ~ A harp shaped like a duck. Playing it attracts the attention of nearby waterfowl.
Струна от арфы, острая и в подсохшей крови. ~ A harp string, sharp and tinged with blood.
Плащ с капюшоном, сшитый из тысяч крыльев мотыльков. ~ A hooded cloak made from thousands of moth wings stitched together.
Кружка для медовухи, вечно липкая. ~ A mead tankard that is perpetually sticky.
Кривобокая окарина. Каждая нота жутко похожа на плач младенца. ~ A misshapen ocarina. Each note sounds eerily similar to a baby's cries.
Трубка моцлинга, найденная тобой в куче компоста. Её дым навевает ностальгию. ~ A mossling pipe you found in a pile of compost. Its smoke makes people nostalgic.
Записка с обещанием, что «мистер Лис» придёт на помощь в час твоей величайшей нужды. ~ A note promising that a "Mr Fox" will come to your aid in your hour of greatest need.
Пара одинаковых глазных яблок. При любой возможности они поворачиваются, чтобы уставиться на тебя. ~ A pair of matching eyeballs. Whenever possible, they rotate to stare at you.
Пара маленьких бронзовых тарелочек. ~ A pair of small, bronze cymbals.
Именное приглашение на «ПИР». Никаких других подробностей. ~ A personalised invitation to "THE FEAST." No further details are provided.
Карманная книжица дурных шуток. Изредка похихикивает. ~ A pocketbook of bad jokes. Emits the occasional snicker.
Афиша последнего, злополучного циркового выступления твоих родителей. ~ A poster for your parent's last, ill-fated circus performance.
Перо, сделанное из пера совы-стирджа. ~ A quill made from a stirge-owl feather.
Верёвка, сплетённая из смеси человеческих и брегглских волос. ~ A rope woven from a mix of human and breggle hair.
Стопка гневных писем, обвиняющих тебя в поджогах. ~ A stack of angry letters, all accusing you of arson.
Странный диск, издающий звук пуканья, стоит положить на него груз. ~ A strange disk that produces the sound of flatulence whenever a weight is placed atop it.
Палатка, которая медленно поднимается сама, если громко спеть ей задорную песню. ~ A tent that slowly raises itself when you loudly sing it a jaunty song.
Склянка гуано. Твоя последняя память об усопшем близком. ~ A vial of guano. Your last reminder of a deceased loved one.
Деревянный скипетр с головой шута. При ударе голова рассказывает неудачную шутку. ~ A wooden sceptre topped with a jester's head. When struck, the head tells an ill-considered joke.
Книга советов, в конце концов предлагающая щедрое применение огня как решение любой проблемы. ~ An advice book that ultimately suggests a liberal application of fire as the solution to every problem.
Древняя монета, украденная из могилы. Куда холоднее на ощупь, чем следовало бы. ~ An ancient coin, stolen from a grave. Far colder to the touch than it should be.
Пустой футляр от свирели, содержимое украдено. ~ An empty pan flute case, its contents stolen.
Громадный фейерверк с биркой «Не испытан». ~ An enormous firework with a tag that reads "Untested."
Роскошный парик, украденный с головы эльфийского вельможи. ~ An extravagant wig, stolen from the head of an elf noble.
С виду обычное металлическое ведро. При наполнении водой внутри появляются пиявки. ~ An ordinary-looking metal bucket. When filled with water, leeches appear inside.
Затейливая флейта, якобы передаваемая твоими предками ещё с тех пор, как они покинули Фейри. ~ An ornate flute, said to be handed down by your ancestors since before they left Fairy.
Невылупившееся яйцо, потеющее кровью. ~ An unhatched egg that sweats blood.
Выцветший пергамент со списком всех, кого ты когда-либо обидел. Он периодически обновляется. ~ Faded parchment that lists the names of everyone you've ever wronged. It updates itself periodically.
Свет фейерверка, пойманный в осколок стекла. ~ Light from a fireworks display, caught in a shard of glass.
Слова недописанной песни о грызунах, прилетающих с луны. ~ Lyrics to a half-written song about rodents visiting from the moon.
Крошечные склянки сиропов, каждая помечена настроением, которое она якобы лечит. ~ Small vials of syrups, each labelled with the type of mood they're supposed to cure.
Труп мыши, одетый в крошечную одежду. ~ The corpse of a mouse, dressed in tiny clothes.
Герб неизвестного длиннорогого дома, найденный на мёртвом бреггле. ~ The crest of an unknown longhorn noble house, found on a dead breggle.
Извивающиеся фигуры для опарышевых шахмат. ~ The squirming pieces for maggot chess.
Шерстяные наушники, связанные твоей бабушкой. ~ Woollen ear warmers, knitted by your grandmother.
Знаменитый рецепт мотыльковых пирожных твоего дяди. ~ Your uncle's famed recipe for moth cakes.
`),

    details: {
      head: { ru: 'Голова', en: 'Head', die: 12, items: tbl(`
Лысая, уши в венах ~ Bald, veiny ears
Пятнистая лысина ~ Blotchy bald pate
Шапочка из блестящих надкрылий жуков ~ Cap of shiny beetle shells
Из ушей сочится оранжевая сера ~ Ears ooze orange wax
Вытянутая, шаткая шея ~ Elongated, teetering neck
Войлочная шляпа с длинным хвостом ~ Felt hat with long liripipe
Мягкая шляпа, сильно велика ~ Floppy hat, way too big
Длинные щетинистые пучки волос ~ Long, bristling hair tufts
Розовый ирокез (природный) ~ Pink mohawk (natural)
Круглые обвислые уши ~ Round, droopy ears
Полоса седых волос ~ Stripe of silver hair
Подрагивающие острые уши ~ Twitching, pointy ears
`) },
      face: { ru: 'Лицо', en: 'Face', die: 12, items: tbl(`
Обвислый нос ~ Droopy nose
Роскошно ухоженные усы ~ Lavishly preened moustache
Блестящая чёрная борода ~ Lustrous black beard
Плоть носа меняет цвет ~ Nose flesh changes colour
Ноздри хлопают от возбуждения ~ Nostrils flap when excited
Из ноздрей течёт жёлтая сопля ~ Nostrils dripping yellow snot
Напомаженные усы ~ Oiled moustache
Один глаз большой, другой маленький ~ One large eye, one small
Торчащие клыки ~ Protruding fangs
Обвислое, раздутое горло ~ Sagging, bloated throat
Бегающие глаза постоянно моргают ~ Shifty eyes constantly blink
Клочковатая борода ~ Straggly beard
`) },
      body: { ru: 'Тело', en: 'Body', die: 12, items: tbl(`
Перепонки между пальцами ~ Flaps of skin between fingers
Горбатое ~ Hunchback
Косолапое ~ Knock-kneed
Розовая кожа с белым пушком ~ Pink skin with white fuzz
Хватательные ступни ~ Prehensile feet
Округлое ~ Rotund
Тощее ~ Scrawny
Складки кожи под руками ~ Skin flaps under arms
Тонкие пальцы с четырьмя суставами ~ Spindly, 4-knuckled fingers
Густой свалявшийся рыжеватый мех ~ Thick, matted, auburn fur
Совершенно безволосое ~ Utterly hairless
Рудиментарные крылья (нелетающие) ~ Vestigial wings (flightless)
`) },
      speech: { ru: 'Речь', en: 'Speech', die: 12, items: tbl(`
Детское хихиканье ~ Childish giggling
Возбуждённый визг ~ Excited screeching
Гогот ~ Guffawing
Нерешительное дребезжание ~ Hesitant warbling
Шипение и хлюпанье ~ Hissing and slurping
Прерывистое бормотание ~ Intermittent gibbering
Томный рокот ~ Languid rumbling
Мелодичная ~ Melodious
Пересыпана уханьем ~ Punctuated with hoots
Пронзительная ~ Shrill
Зловещий шёпот ~ Sinister whispering
Отрывистая ~ Staccato
`) },
      demeanour: { ru: 'Нрав', en: 'Demeanour', die: 12, items: tbl(`
Привирает ~ Bends the truth
Кривляется и дурачится ~ Capers and japes
Ребячливый и любопытный ~ Childlike and curious
Хитрый интриган ~ Cunning, scheming
Угрюмый, юмор висельника ~ Dour, gallows humour
Напускной мистицизм ~ Feigned mysticism
Легкомысленный и мелочный ~ Frivolous and petty
Склонность к воровству ~ Penchant for pilfery
Шутник-практик ~ Practical joker
Тёмный и беспринципный ~ Shady and unscrupulous
Плут (но верный друг) ~ Trickster (but loyal friend)
Наивная невинность ~ Wide-eyed innocence
`) },
      dress: { ru: 'Одежда', en: 'Dress', die: 12, items: tbl(`
Болтающиеся бубенцы и побрякушки ~ Dangling bells and baubles
Загадочный чёрный плащ ~ Enigmatic black cloak
Сплошь в заплатках ~ Heavily patched
Мешковинная набедренная повязка ~ Hessian loin cloth
Узловатые шнуры ~ Knotted cords
Длинная рваная накидка ~ Long, ragged cape
Разномастная краденая одежда ~ Mismatched, stolen clothes
Заляпанные краской лохмотья ~ Paint-daubed rags
Пёстрый шутовской наряд ~ Pied jester's outfit
Мягкая ворсистая замша ~ Soft brushed suede
Чулки и мешковатый свитер ~ Stockings and baggy jumper
Полосатые шоссы и корсаж ~ Stripy hose and bodice
`) },
      desires: { ru: 'Желание', en: 'Desires', die: 12, items: tbl(`
Чтобы тебя признали святым (шутки ради) ~ Be accepted as a saint (as a joke)
Построить особняк наполовину в Фейри ~ Build manor half in Fairy
Спалить замок ~ Burn down a castle
Основать тайное общество ~ Found a secret society
Пивоварня медовухи на гигантских пчёлах ~ Giant bee mead brewery
Жить в замке летучих мышей ~ Live in a castle of bats
Жениться на купце-гоблине ~ Marry a goblin merchant
Устроить самый большой мут в истории ~ Organise largest moot ever
Выступить для Наг-Лорда ~ Perform for the Nag-Lord
Ввести в моду мотыльковые колбаски ~ Popularise moth sausages
Тайно править людским городком ~ Rule a human town in secret
Украсть секреты Друнов ~ Steal secrets of the Drune
`) },
      beliefs: { ru: 'Убеждение', en: 'Beliefs', die: 12, items: tbl(`
Вороны — шпионы из Фейри ~ Crows are spies from Fairy
Феи — иллюзия ~ Fairies are illusory
Грибы — души умерших ~ Fungi are souls of the dead
Все договорённости — только письменно ~ Get all agreements in writing
На кладбищах зарыто золото ~ Gold buried in graveyards
Люди не умеют танцевать ~ Humans can't dance
Ты неуязвим к огню ~ Immune to fire
Можно жить на одном пироге ~ Live on cake alone
Ты почти довёл до совершенства смертоносную песню ~ Nearly perfected deadly song
Никогда не открывай своего имени ~ Never reveal your name
Судебная система — наверняка шутка ~ Penal system must be a joke
Наг-Лорд и правда остряк ~ The Nag-Lord really is a wag
`) }
    }
  };
})();
