/* Бреггл — Breggle. Player's Book, стр. 32–35 (род), 180–181 (род-класс). */
(function () {
  'use strict';
  var tbl = DW.tbl, names = DW.names, d100 = DW.d100pairs;

  DW.KINDREDS = DW.KINDREDS || {};
  DW.KINDREDS.breggle = {
    id: 'breggle',
    ru: 'Бреггл', en: 'Breggle',
    tagline: 'Козлоголовый народ, у которого длина рогов означает положение в обществе.',
    taglineEn: 'Goat-headed folk whose horn length indicates their social standing.',
    type: 'mortal', typeRu: 'Смертный',
    size: 'Medium', sizeRu: 'Средний',
    page: 32, kcPage: 180,
    age: { dice: '2d10', base: 15, label: 'Возраст на 1 уровне' },
    lifespan: { dice: '2d20', base: 50, label: 'Срок жизни' },
    height: { dice: '2d6', base: 64, unit: 'in', label: 'Рост' },
    weight: { dice: '6d10', base: 120, unit: 'lbs', label: 'Вес' },
    languages: [
      { ru: 'Волдийский', en: 'Woldish' },
      { ru: 'Гаффе', en: 'Gaffe' },
      { ru: 'Каприс', en: 'Caprice' }
    ],
    lore: 'Гордые и упрямые бреггли — «козлолюди» (или hregl на их собственном языке) — населяют Высокий Волд с незапамятных времён. Делятся на две касты: короткорогие (рабочий люд) и длиннорогие (знать). Рога растут вместе с богатством и славой. Формально бреггли — прихожане Плюритинской Церкви, но на деле молятся почтенным предкам (Aud frengd Hlerr).',
    relations: 'В ладу со смертными и полуфейскими родами. Фей видели редко и относятся к ним с трепетом и опаской. В людских поселениях Высокого Волда бреггли — обычное дело; дальше к ним относятся с уважением и осторожностью, зная силу длиннорогих домов.',
    classAdvice: 'Чаще всего бреггли — воины, рыцари или маги. Редко идут в Церковь клириками или монахами, и лишь единицы связаны с Фейри настолько, чтобы стать чароплётами.',

    /* Черты рода (для схемы «род + класс») */
    traits: [
      { ru: 'Шерсть', en: 'Fur', p: 33,
        d: 'Густая шерстяная шуба даёт +1 к Классу Брони, когда бреггл без брони или в Лёгкой броне.' },
      { ru: 'Рога', en: 'Horns', p: 33,
        d: 'Бреггл может атаковать рогами вместо оружия. На 1–2 уровне урон 1d4, на 3–5 — 1d4+1, на 6–8 — 1d6, на 9 — 1d6+1, на 10+ — 1d6+2.' },
      { ru: 'Взгляд', en: 'Gaze', p: 33,
        d: 'С 4 уровня (статус длиннорогого): пристально глядя на человека или короткорогого, бреггл может очаровать его — цель делает спасбросок против Заклинания или начинает взирать на бреггла с почтением и не может ему вредить до следующего рассвета. На 1 уровне недоступно.' },
      { ru: 'Короткорогий', en: 'Shorthorn status', p: 33,
        d: 'На 1 уровне рога 1 дюйм — ты простолюдин касты короткорогих, мечтающий выбиться в люди. С 4 уровня рога дорастают до 4 дюймов, и тебя признают длиннорогим.' }
    ],

    /* Черты род-класса (Приложение, стр. 180) */
    kindredClass: {
      ru: 'Бреггл (род-класс)', en: 'Breggle Kindred-Class',
      primeAbilities: ['STR', 'INT'],
      primeRu: 'Интеллект и Сила',
      hitDie: 'd6', hpAfter10: 2,
      aptitude: 'martial', aptitudeRu: 'Воинская',
      armour: 'Любая, включая щиты', armourEn: 'Any, including shields',
      weapons: 'Любое', weaponsEn: 'Any',
      armourAllowed: ['none', 'light', 'medium', 'heavy'], shields: true,
      weaponSizes: ['Small', 'Medium', 'Large'],
      desc: 'Бреггли-искатели приключений — умелые бойцы, владеющие и сталью, и собственными рогами. На высоких уровнях обретают магические способности, включая тайные заклинания.',
      startArmour: [
        { r: [1, 1], items: ['leather'] },
        { r: [2, 2], items: ['leather', 'shield'] },
        { r: [3, 3], items: ['chainmail'] },
        { r: [4, 4], items: ['chainmail', 'shield'] },
        { r: [5, 5], items: ['platemail'] },
        { r: [6, 6], items: ['platemail', 'shield'] }
      ],
      startWeapons: [
        { r: [1, 1], items: ['dagger'] },
        { r: [2, 2], items: ['longsword'] },
        { r: [3, 3], items: ['mace'] },
        { r: [4, 4], items: ['shortbow', 'arrows'] },
        { r: [5, 5], items: ['shortsword'] },
        { r: [6, 6], items: ['spear'] }
      ],
      classItems: [],
      traits: [
        { ru: 'Шерсть', en: 'Fur', d: '+1 к Классу Брони без брони или в Лёгкой броне.' },
        { ru: 'Рога', en: 'Horns', d: 'Атака рогами вместо оружия. 1 уровень: рога 1″, урон 1d4.' },
        { ru: 'Короткорогий', en: 'Shorthorn', d: 'Начинаешь простолюдином короткорогой касты. С 4 уровня — длиннорогий, появляется Взгляд.' },
        { ru: 'Взгляд (с 4 ур.)', en: 'Gaze (from Level 4)', d: 'Очарование людей и короткорогих взглядом, 1 раз в день на 4–5 уровне.' },
        { ru: 'Тайная магия (с 4 ур.)', en: 'Arcane Magic (from Level 4)', d: 'Длиннорогие начинают изучать тайную магию. Заклинания не даются автоматически — их надо выучить у наставника, из найденных книг или исследованием.' }
      ],
      advancement: [
        /* [level, xp, hpDice, attack, D, R, H, B, S] */
        [1, 0, '1d6', 1, 12, 13, 14, 15, 16],
        [2, 2000, '1d6', 1, 12, 13, 14, 15, 16],
        [3, 4000, '1d6', 2, 11, 12, 13, 14, 15],
        [4, 8000, '1d6', 3, 10, 11, 12, 13, 14],
        [5, 16000, '1d6', 3, 10, 11, 12, 13, 14],
        [6, 32000, '1d6', 4, 9, 10, 11, 12, 13],
        [7, 64000, '1d6', 5, 8, 9, 10, 11, 12],
        [8, 128000, '1d6', 5, 8, 9, 10, 11, 12],
        [9, 260000, '1d6', 6, 7, 8, 9, 10, 11],
        [10, 380000, '1d6', 7, 6, 7, 8, 9, 10],
        [11, 500000, '+2', 7, 6, 7, 8, 9, 10],
        [12, 620000, '+2', 8, 5, 6, 7, 8, 9],
        [13, 740000, '+2', 9, 4, 5, 6, 7, 8],
        [14, 860000, '+2', 9, 4, 5, 6, 7, 8],
        [15, 980000, '+2', 10, 3, 4, 5, 6, 7]
      ],
      skills: []
    },

    names: names(`
Аэле|Aele ~ Аэдель|Aedel ~ Аддл|Addle ~ Блатерграйп|Blathergripe
Брэмбель|Braembel ~ Беррильд|Berrild ~ Андред|Andred ~ Блюгудж|Bluegouge
Бруб|Broob ~ Бредр|Bredhr ~ Блок|Blocke ~ Бокбруг|Bockbrugh
Крамп|Crump ~ Дрэд|Draed ~ Кловер|Clover ~ Бокстамп|Bockstump
Дрёрдл|Drerdl ~ Фаннигрю|Fannigrew ~ Крювин|Crewwin ~ Элбоуджен|Elbowgen
Френниг|Frennig ~ Франдоруп|Frandorup ~ Кёрлип|Curlip ~ Форлок|Forlocke
Грёрг|Grerg ~ Грендилор|Grendilore ~ Элай|Eleye ~ Ходлоу|Hwodlow
Грайп|Gripe ~ Грендл|Grendl ~ Эллип|Ellip ~ Ланкшорн|Lankshorn
Ллерг|Llerg ~ Грювигг|Grewigg ~ Франнидор|Frannidore ~ Локхорн|Lockehorn
Ллрод|Llrod ~ Хильдруп|Hildrup ~ Гренд|Ghrend ~ Лонгбирд|Longbeard
Лоуп|Lope ~ Райгл|Hraigl ~ Греннигор|Grennigore ~ Лонгшенкс|Longshanks
Машкер|Mashker ~ Хвендл|Hwendl ~ Гвендл|Gwendl ~ Шенкволд|Shankwold
Олледг|Olledg ~ Мэйбел|Maybel ~ Хранник|Hrannick ~ Смолбак|Smallbuck
Рег|Rheg ~ Мирклe|Myrkle ~ Ходруп|Hwoldrup ~ Сниклбок|Snicklebock
Шадгор|Shadgore ~ Наннигрю|Nannigrew ~ Линдор|Lindor ~ Снайдблит|Snidebleat
Шадвелл|Shadwell ~ Петтигрю|Pettigrew ~ Меррильд|Merrild ~ Снуд|Snoode
Шадвик|Shadwicke ~ Рримбр|Rrhimbr ~ Смензард|Smenthard ~ Андерблит|Underbleat
Шандор|Shandor ~ Шорд|Shord ~ Снерг|Snerg ~ Андербак|Underbuck
Шенк|Shank ~ Сметра|Smethra ~ Вендлоу|Wendlow ~ Волдер|Wolder
Снерд|Snerd ~ Вельд|Wheld ~ Виндор|Windor ~ Волдлип|Woldleap
`),

    backgrounds: tbl(`
Помощник алхимика ~ Alchemist's assistant
Рыболов ~ Angler
Пчеловод ~ Beekeeper
Кузнец ~ Blacksmith
Пивовар ~ Brewer
Свечник ~ Chandler
Пастух дьявольских коз ~ Devil goat handler
Игрок ~ Gambler
Могильщик ~ Grave digger
Торговец ~ Merchant
Лукоовод ~ Onion farmer
Паж ~ Page
Свиновод ~ Pig farmer
Слуга ~ Servant
Контрабандист ~ Smuggler
Помощник колдуна ~ Sorcerer's assistant
Знаменосец ~ Standard-bearer
Кровельщик ~ Thatcher
Репоовод ~ Turnip farmer
Бродяга ~ Vagrant
`),

    trinkets: d100(`
Мешочек гадальных камней, которые на любой вопрос отвечают «Паника». ~ A bag of divination stones that always answer "Panic" to any question.
Окровавленный шутовской колпак. ~ A bloodstained jester's hat.
Окровавленный нож, который невозможно отмыть. ~ A bloody knife that cannot be cleaned.
Синий бархатный камзол с потайным карманом, который перемещается, стоит отвести взгляд. Чтобы что-то из него достать, приходится минуту искать. ~ A blue velvet jacket with a hidden pocket which moves when you're not looking.
Книга стихов, состоящих в основном из блеяния. ~ A book of poetry that consists primarily of bleating.
Флакон мерзких духов. Учуять можно за полмили. ~ A bottle of noxious perfume. When sprayed, it can be smelt up to half a mile away.
Латунная статуэтка совы с жуткими чёрными глазами. ~ A brass owl statue with eerie black eyes.
Сломанная удочка со следами зубов огромной рыбы. ~ A broken fishing rod that still displays teeth marks from an enormous fish.
Круглый керамический амулет, показывающий текущую фазу луны. ~ A circular ceramic amulet which displays the current moon phase.
Глиняный горшочек с надписью «Лягушачья паста». Внутри что-то похожее на лягушачью пасту. ~ A clay pot labelled "Frog Paste," containing what appears to be frog paste.
Комок извивающегося чёрного мха, соскобленный с нависшего монолита одной одинокой ночью. ~ A clump of writhing, black moss that you scraped off a looming monolith one lonely night.
Пачка бумаг с наспех записанной историей твоей жизни. Странность в том, что нашёл ты их на трупе незнакомца, утонувшего в канаве. ~ A collection of papers with scrawled notes detailing your life story, found on the corpse of a stranger.
Диковинный духовой инструмент мослингов, вырезанный из тыквы. Ты никак не разберёшься, в какую дырку дуть. ~ A curious mossling wind instrument carved out of a gourd. You can't figure out which hole to blow in.
Диорама: две чучельные мыши верхом на чучельных белках, на турнире. ~ A diorama of two stuffed mice riding stuffed squirrels, jousting.
Сушёный гриб с лицом. ~ A dried mushroom with a face.
Папка с засушенными крылышками спрайтов. ~ A folio of pressed sprite-wings.
Корявый корень в форме мослинга. ~ A gnarled root shaped like a mossling.
Письмо с предупреждением: несколько безымянных, но высокородных длиннорогих на самом деле переодетые кривороги. ~ A letter warning that several high-ranked longhorns are secretly crookhorns in disguise.
Медальон с портретом пушистого кота в короне и надписью «Во имя любви к королю Пусскину». ~ A locket with a portrait of a fluffy cat wearing a crown, inscribed "For the love of King Pusskin."
Длинноносая карнавальная маска. ~ A long-nosed masquerade mask.
Браслет из кротовой шкурки, умащённый экзотическими духами фей. ~ A moleskin wristband, anointed with exotic fairy perfume.
Трубка мослингов, выдувающая радужные кольца дыма. ~ A mossling pipe that blows rainbow-coloured smoke rings.
Ожерелье из разномастных гуманоидных зубов. ~ A necklace of miscellaneous humanoid teeth.
Окаменевшая репа. ~ A petrified turnip.
Свиное сердце, сочащееся сукровицей, если его сжать. ~ A pig heart that oozes ichor when squeezed.
Кошель, который кажется тяжёлым (будто полон камешков) даже пустым. ~ A pouch which feels heavy even when empty.
Ржавый скальпель, некогда принадлежавший лорду Малблиту. ~ A rusty scalpel that once belonged to Lord Malbleat.
Мешок вкусных жареных куриных ножек. ~ A sack of tasty fried chicken legs.
Чешуйка, якобы с бреггла, у которого вместо ног был рыбий хвост. ~ A scale said to be from a breggle with a fishtail instead of legs.
Свиток с пророческим предостережением от почтенного предка. От старости почти нечитаем. ~ A scroll containing a prophetic warning from an esteemed ancestor, almost indecipherable.
Лист пергамента с угольным наброском твоей давно потерянной любви. ~ A sheet of parchment with a charcoal sketch of your long lost love.
Короткий серебряный шнурок и изящный крючок: говорят, ими можно ловить рыб фей в лужах. ~ A short length of silver cord and a delicate hook, said to catch fairy fish in puddles.
Лопата, испачканная землёй тысячи могил. ~ A shovel stained with the dirt of a thousand graves.
Чучело полёвки в очаровательном жилете. ~ A stuffed vole dressed in a charming waistcoat.
Флейта из берцовой кости. ~ A thigh-bone flute.
Жестяной свисток, от звука которого коты сходят с ума. ~ A tin whistle whose tones drive cats wild.
Крошечная книжица бессмысленных стихов в фиолетовой коже. ~ A tiny book of nonsense poetry, bound in purple leather.
Крошечная картина с четырёхрогим козлом. ~ A tiny painting of a four-horned goat.
Заношенная трость с набалдашником в виде козлиной головы. ~ A well-loved walking stick with a goat's head handle.
Деревянный Шейпс (святой символ Церкви), утыканный гвоздями. ~ A wooden Chapes (holy symbol of the Pluritine Church) studded with nails.
Пустая записная книжка. Всё написанное в ней исчезает на рассвете. ~ An empty notebook. Anything written in it disappears at sunrise.
Затейливая форма для пирога, стянутая с кухни аристократа. ~ An ornate pie pan, pilfered from a noble's kitchen.
Чёрные каменные кости с белыми черепами вместо точек. ~ Black stone dice with white skulls for pips.
Дорогие на вид (но ничего не стоящие) украшения для брегглских рогов. ~ Expensive-looking (but worthless) jewellery, designed for breggle horns.
Тетива с лука легендарного охотника. ~ String from the bow of a legendary hunter.
Фигуры для шахмат фей. Ты понятия не имеешь, каковы правила (и игра ли это вообще). ~ The board pieces for fairy chess. You have no idea what the rules are.
Выделанная шкура целого оленя. ~ The cured skin of a whole deer.
Рог предка на шнурке. ~ The horn of an ancestor, hung from a necklace.
Ключ от тюремной камеры, из которой ты сбежал. ~ The key to the prison cell you escaped from.
Жуткий стеклянный глаз твоей бабки. Иногда ты чувствуешь, что она смотрит. ~ Your grandmother's creepy glass eye. You sometimes feel her presence watching you.
`),

    details: {
      head: { ru: 'Голова', en: 'Head', die: 12, items: tbl(`
Помятый шлем с гербом ~ Dented helm with coat of arms
Уши проколоты гвоздями или кольцами ~ Ears pierced with nails or rings
Длинные кудрявые локоны ~ Long, curly locks
Длинные висячие уши ~ Long, floppy ears
Узкие острые уши ~ Narrow, pointed ears
Один рог кривой, другой прямой ~ One bent horn, one straight
Один рог обломан ~ One horn broken off
Серебряная прядь в волосах ~ Silver stripe in hair
Гладко напомаженные волосы ~ Slick, oiled hair
Торчащие рыжие вихры ~ Spiky ginger hair
Тонкая шея, массивная голова ~ Thin neck, hefty head
Третий рожок-шишка на лбу ~ Third nub horn on forehead
`) },
      face: { ru: 'Лицо', en: 'Face', die: 12, items: tbl(`
Чёрные глаза с серебряными зрачками ~ Black eyes, silver pupils
Торчащие передние зубы ~ Buck teeth
Кустистые брови ~ Bushy brows
Золотые глаза ~ Golden eyes
Сальная чёлка свисает на глаза ~ Lank forelock droops over eyes
Длинная жидкая бородка ~ Long, wispy chin-beard
Молочно-белые глаза с голубыми крапинками ~ Milky white eyes, blue flecks
Не хватает зубов ~ Missing teeth
Заметный шрам ~ Prominent scar
Косматая бородка ~ Shaggy chin-beard
Маленькие близко посаженные глаза ~ Small eyes, close set
Широкий слюнявый рот ~ Wide, drooling mouth
`) },
      fur: { ru: 'Шерсть', en: 'Fur', die: 12, items: tbl(`
Чёрная с серебряными крапинками ~ Black, flecked with silver
Чёрная лоснящаяся ~ Black, glossy
Рыжая курчавая ~ Ginger, curly
Рыжая жёсткая ~ Ginger, rough
Серая сальная ~ Grey, greasy
Серая с блеском ~ Grey, lustrous
Рыжевато-бурая торчащая ~ Russet, spiky
Рыжевато-бурая волнистая ~ Russet, wavy
Рыжевато-жёлтая грубая ~ Tan, coarse
Рыжевато-жёлтая косматая ~ Tan, shaggy
Белая грязная ~ White, dirty
Белая пушистая ~ White, fluffy
`) },
      speech: { ru: 'Речь', en: 'Speech', die: 12, items: tbl(`
Кудахчущая ~ Cackling
Витиеватая ~ Circuitous
Грубая ~ Coarse
Булькающая ~ Gurgling
Пронзительная ~ High-pitched
Небрежная ~ Lackadaisical
Бормочущая ~ Mumbling
Рокочущая ~ Rumbling
Отрывистая ~ Staccato
Горловая ~ Throaty
Дребезжащая ~ Warbling
Ноющая ~ Whining
`) },
      demeanour: { ru: 'Нрав', en: 'Demeanour', die: 12, items: tbl(`
Пропитан элем ~ Ale-addled
Хладнокровный прагматик ~ Cool-headed pragmatist
Напускной аристократизм ~ Cultivated aristocratic air
Угрюмый пессимист ~ Dour, pessimistic
Искренний и верный ~ Earnest, loyal
Вечно строит козни ~ Endlessly scheming
Переменчивый, взбалмошный ~ Flighty, mercurial
Шутник со вспышками ярости ~ Jocular with violent outbursts
Мягкий, невозмутимый ~ Mellow, unflappable
Целеустремлённый упрямец ~ Single-minded, stubborn
Дикий гедонист ~ Wild hedonist
Иронично-философский ~ Wryly philosophical
`) },
      dress: { ru: 'Одежда', en: 'Dress', die: 12, items: tbl(`
Дублет и рубаха с рюшами ~ Doublet and frilly shirt
Засаленная шерсть ~ Greasy woollens
Грязный фартук ~ Grimy apron
Огромное лохматое пальто ~ Huge, hairy overcoat
Длинные юбки и плащ ~ Long skirts and cloak
Латаная кожа со множеством карманов ~ Patched leather, many pockets
Мех кролика и белки ~ Rabbit and squirrel fur
Ливрея слуги ~ Servant's livery
Ботфорты и жилет ~ Thigh boots and waistcoat
Набедренная повязка и щегольский плащ ~ Thong and dashing cape
Твид и охотничья шапка ~ Tweed and deerstalker
Широкий балахон без рукавов ~ Wide, armless frock
`) },
      desires: { ru: 'Желание', en: 'Desires', die: 12, items: tbl(`
Истребить Друнов ~ Eradicate the Drune
Уйти от правосудия за прошлое преступление ~ Escape justice for past crime
Основать преступный синдикат ~ Found a crime syndicate
Освободить простой люд ~ Free the common folk
Пересажать всех криворогов ~ Imprison all crookhorns
Жениться на аристократке ~ Marry into nobility
Возмутительное богатство и роскошь ~ Outrageous wealth and luxury
Сделать репный эль модным ~ Popularise turnip ale
Вернуть древние брегглские знания ~ Recover ancient breggle lore
Вернуть Высокий Волд дому Рамиус ~ Restore High Wold to Ramius
Обчистить лорда Мёркина ~ Swindle Lord Murkin's wealth
Странствия и открытия ~ Travel and discovery
`) },
      beliefs: { ru: 'Убеждение', en: 'Beliefs', die: 12, items: tbl(`
Предки требуют жертв ~ Ancestors demand sacrifices
Стоячие камни поставили бреггли ~ Breggles made standing stones
Бреггли родом из Фейри ~ Breggles originate in Fairy
Церковь скрывает брегглских святых ~ Church hides breggle saints
Чеснок каждый день отводит порчу фей ~ Daily garlic wards fairy hexes
Ты потомок могучего чародея ~ Descendant of a mighty wizard
Герцог — марионетка Друнов ~ Duke is thrall of the Drune
Фейри — чистый вымысел ~ Fairy is purely mythical
Малблит служит Наг-Лорду ~ Malbleat serves the Nag-Lord
Малблит будет править Высоким Волдом ~ Malbleat will rule High Wold
Наг-Лорд — брегглский мессия ~ Nag-Lord is breggle messiah
Конец близок ~ The end is nigh
`) }
    }
  };
})();
