/* Человек — Human. Player's Book, стр. 44–47. Род-класса у людей нет. */
import { tbl, names, d100pairs as d100 } from '../util.js'

export const human = {
  id: 'human',
  ru: 'Человек', en: 'Human',
  tagline: 'Народ повседневного мира, во всём знакомом нам разнообразии.',
  taglineEn: 'The folk of the day-to-day world, in all the variety we know.',
  type: 'mortal', typeRu: 'Смертный',
  size: 'Medium', sizeRu: 'Средний',
  page: 44, kcPage: null,
  age: { dice: '2d10', base: 15, label: 'Возраст на 1 уровне' },
  lifespan: { dice: '2d20', base: 50, label: 'Срок жизни' },
  height: { dice: '2d6', base: 64, baseFemale: 60, unit: 'in', label: 'Рост' },
  weight: { dice: '6d10', base: 120, unit: 'lbs', label: 'Вес' },
  languages: [
    { ru: 'Волдийский', en: 'Woldish' }
  ],
  lore: 'Как и во всём мире за лесом, в обжитых краях Дольменвуда преобладают люди. Беспокойные и любопытные, они забираются в неизведанные земли, основывают державы и лезут в опасные тайны магии. Большинство — прихожане Плюритинской Церкви, но в фольклоре живут отголоски старой веры в Зелёного Человека — бога пира, эля, веселья и охоты.',
  relations: 'В добрых отношениях со смертными и полуфейскими родами, живут бок о бок с бегглями в Высоком Волде. Большинство людей никогда не видели фей и относятся к ним с трепетом и опаской.',
  classAdvice: 'Люди встречаются во всех классах, кроме чароплёта — редко у человека достаточно связи с Фейри. Для новичка человек-воин — самое простое сочетание: минимум особых правил.',

  traits: [
    { ru: 'Решительность', en: 'Decisiveness', p: 45,
      d: 'При ничьей в броске инициативы люди ходят первыми, будто выиграли инициативу. Считаются отдельной стороной, действующей раньше остальных.' },
    { ru: 'Лидерство', en: 'Leadership', p: 45,
      d: 'Верность наёмников на службе у человека повышается на 1.' },
    { ru: 'Задор', en: 'Spirited', p: 45,
      d: 'Люди быстро учатся: +10% ко всему получаемому опыту. Это сверх бонуса за главную характеристику. Например, человек с главной характеристикой 15 получает суммарно +15% XP.' }
  ],

  kindredClass: null,

  names: names(`
Арфред|Arfred ~ Агнель|Agnel ~ Андред|Andred ~ Аддеркаппер|Addercapper
Бром|Brom ~ Амони|Amonie ~ Арда|Arda ~ Бёрл|Burl
Банк|Bunk ~ Селения|Celenia ~ Обри|Aubrey ~ Кэндлсвик|Candleswick
Чайдвик|Chydewick ~ Эмельда|Emelda ~ Клемент|Clement ~ Крамволлер|Crumwaller
Крамп|Crump ~ Гертвинна|Gertwinne ~ Клюид|Clewyd ~ Догуд|Dogoode
Димоти|Dimothy ~ Гилли|Gilly ~ Дейл|Dayle ~ Дреггер|Dregger
Гиллем|Guillem ~ Гретхен|Gretchen ~ Гемранд|Gemrand ~ Данволлоу|Dunwallow
Хенрик|Henrick ~ Гвендолина|Gwendolyne ~ Хэнк|Hank ~ Фрагглтон|Fraggleton
Хогрид|Hogrid ~ Хильда|Hilda ~ Лирен|Lyren ~ Грюуотер|Gruewater
Джапсер|Jappser ~ Иллабель|Illabell ~ Мод|Maude ~ Харпер|Harper
Джореми|Joremey ~ Катеринна|Katerynne ~ Мегинна|Megynne ~ Ланк|Lank
Джоспри|Josprey ~ Лиллибет|Lillibeth ~ Мосс|Moss ~ Логвив|Logueweave
Джаймс|Jymes ~ Лиллит|Lillith ~ Робин|Robyn ~ Лумер|Loomer
Моллеквип|Mollequip ~ Лизабет|Lisabeth ~ Роуэн|Rowan ~ Малксмилк|Malksmilk
Роджер|Rodger ~ Мэйбл|Mabel ~ Сейдж|Sage ~ Смит|Smith
Рогберт|Rogbert ~ Мэйдрид|Maydrid ~ Тамрин|Tamrin ~ Сандермен|Sunderman
Сэмвайз|Samwise ~ Мелисса|Melysse ~ Урсеквина|Ursequine ~ Свинни|Swinney
Шадвелл|Shadwell ~ Молли|Molly ~ Вальдра|Waldra ~ Толмен|Tolmen
Шенк|Shank ~ Пэнси|Pansy ~ Уэйдред|Waydred ~ Уивилмен|Weavilman
Сидли|Sidley ~ Роэсе|Roese ~ Вендлоу|Wendlow ~ Волдер|Wolder
`),

  /* У людей таблица прошлого — d100 с диапазонами. */
  backgroundsD100: [
    { from: 1, to: 1, ru: 'Актёр', en: 'Actor' },
    { from: 2, to: 5, ru: 'Рыболов', en: 'Angler' },
    { from: 6, to: 6, ru: 'Дрессировщик', en: 'Animal trainer' },
    { from: 7, to: 7, ru: 'Аптекарь', en: 'Apothecary' },
    { from: 8, to: 10, ru: 'Пекарь', en: 'Baker' },
    { from: 11, to: 11, ru: 'Цирюльник', en: 'Barber' },
    { from: 12, to: 12, ru: 'Пчеловод', en: 'Beekeeper' },
    { from: 13, to: 15, ru: 'Нищий', en: 'Beggar' },
    { from: 16, to: 18, ru: 'Кузнец', en: 'Blacksmith' },
    { from: 19, to: 19, ru: 'Переплётчик', en: 'Bookbinder' },
    { from: 20, to: 21, ru: 'Пивовар', en: 'Brewer' },
    { from: 22, to: 24, ru: 'Мясник', en: 'Butcher' },
    { from: 25, to: 28, ru: 'Плотник', en: 'Carpenter' },
    { from: 29, to: 29, ru: 'Картограф', en: 'Cartographer' },
    { from: 30, to: 32, ru: 'Скотовод', en: 'Cattle farmer' },
    { from: 33, to: 33, ru: 'Свечник', en: 'Chandler' },
    { from: 34, to: 34, ru: 'Сыровар', en: 'Cheesemaker' },
    { from: 35, to: 35, ru: 'Сапожник', en: 'Cobbler' },
    { from: 36, to: 36, ru: 'Бондарь', en: 'Cooper' },
    { from: 37, to: 37, ru: 'Портовый рабочий', en: 'Dockhand' },
    { from: 38, to: 38, ru: 'Гадалка', en: 'Fortune-teller' },
    { from: 39, to: 39, ru: 'Охотник за пушниной', en: 'Fur trapper' },
    { from: 40, to: 41, ru: 'Игрок', en: 'Gambler' },
    { from: 42, to: 42, ru: 'Стеклодув', en: 'Glassblower' },
    { from: 43, to: 43, ru: 'Могильщик', en: 'Grave digger' },
    { from: 44, to: 45, ru: 'Свиновод', en: 'Hog farmer' },
    { from: 46, to: 49, ru: 'Охотник', en: 'Hunter' },
    { from: 50, to: 50, ru: 'Шут', en: 'Jester' },
    { from: 51, to: 51, ru: 'Ювелир', en: 'Jeweller' },
    { from: 52, to: 52, ru: 'Кожевник', en: 'Leather worker' },
    { from: 53, to: 53, ru: 'Слесарь', en: 'Locksmith' },
    { from: 54, to: 54, ru: 'Торговец', en: 'Merchant' },
    { from: 55, to: 56, ru: 'Рудокоп', en: 'Miner' },
    { from: 57, to: 58, ru: 'Разбойник', en: 'Outlaw' },
    { from: 59, to: 60, ru: 'Коробейник', en: 'Pedlar' },
    { from: 61, to: 61, ru: 'Паломник', en: 'Pilgrim' },
    { from: 62, to: 63, ru: 'Браконьер', en: 'Poacher' },
    { from: 64, to: 64, ru: 'Гончар', en: 'Potter' },
    { from: 65, to: 65, ru: 'Канатчик', en: 'Roper' },
    { from: 66, to: 66, ru: 'Моряк', en: 'Sailor' },
    { from: 67, to: 67, ru: 'Писец', en: 'Scribe' },
    { from: 68, to: 71, ru: 'Слуга', en: 'Servant' },
    { from: 72, to: 73, ru: 'Овцевод', en: 'Sheep farmer' },
    { from: 74, to: 74, ru: 'Корабел', en: 'Shipwright' },
    { from: 75, to: 75, ru: 'Контрабандист', en: 'Smuggler' },
    { from: 76, to: 76, ru: 'Конюх', en: 'Stable hand' },
    { from: 77, to: 77, ru: 'Каменщик', en: 'Stonemason' },
    { from: 78, to: 78, ru: 'Мошенник', en: 'Swindler' },
    { from: 79, to: 79, ru: 'Портной', en: 'Tailor' },
    { from: 80, to: 80, ru: 'Сборщик податей', en: 'Tax collector' },
    { from: 81, to: 81, ru: 'Кровельщик', en: 'Thatcher' },
    { from: 82, to: 84, ru: 'Репоовод', en: 'Turnip farmer' },
    { from: 85, to: 85, ru: 'Охотник на единорогов', en: 'Unicorn hunter' },
    { from: 86, to: 87, ru: 'Бродяга', en: 'Vagrant' },
    { from: 88, to: 88, ru: 'Тележник', en: 'Wainwright' },
    { from: 89, to: 90, ru: 'Странник', en: 'Wayfarer' },
    { from: 91, to: 92, ru: 'Ткач', en: 'Weaver' },
    { from: 93, to: 95, ru: 'Пшеничный фермер', en: 'Wheat farmer' },
    { from: 96, to: 96, ru: 'Помощник чародея', en: "Wizard's assistant" },
    { from: 97, to: 100, ru: 'Дровосек', en: 'Woodcutter' }
  ],

  trinkets: d100(`
Чёрный камень, всегда указывающий на солнце. ~ A black stone which always points towards the sun.
Кровяная колбаса, якобы из крови виверны. ~ A blood sausage, allegedly made of wyrm's blood.
Окровавленный платок, который не отстирывается. ~ A blood-stained handkerchief that won't wash clean.
Костяная статуэтка русалки с на редкость волосатыми подмышками. ~ A bone statuette of a mermaid with prodigiously hairy armpits.
Ярко-красное яйцо, подаренное тебе спрайтом. ~ A bright red egg that was given to you by a sprite.
Глиняная фигурка, шепчущая тебе во сне. ~ A clay effigy that whispers to you in your sleep.
Треснувший шарик, падающий в замедленной съёмке. ~ A cracked marble that falls in slow motion.
Колода карт с королями, дамами и валетами с завязанными глазами. ~ A deck of cards illustrated with blindfolded kings, queens, knaves, etc.
Питьевой рог с резьбой в виде пляшущих нимф. ~ A drinking horn carved with cavorting nymphs.
Сомнительные накладные усы из крысиного меха. ~ A dubious fake moustache made of rat fur.
Изящный серебряный столовый набор и цветочный фарфоровый чайный сервиз в плетёной корзине. ~ A fine set of silver cutlery and a floral china tea-set, packed in a wicker hamper.
Острая колбаса длиной в фут. ~ A foot-long, spicy sausage.
Перчатка из чешуи виверны. ~ A gauntlet of wyrm scales.
Козий кошель, полный потрохов. ~ A goatskin pouch full of giblets.
Стеклянная сфера размером с голову с горлышком. ~ A head-sized glass sphere with a neck opening.
Кусок древнего заплесневелого сыра. ~ A hunk of ancient, mouldy cheese.
Банка, в которой заводятся мухи, даже когда она плотно закрыта. ~ A jar that breeds flies, even when tightly sealed.
Залихватская шапка с пером, которая подпрыгивает всякий раз, когда кто-то произносит твоё имя. ~ A jaunty cap which jumps up whenever anyone says your name.
Подушка с ароматом лаванды, вышитая чёрными розами и шипами. ~ A lavender scented cushion embroidered with black roses and thorns.
Прядь волос первого убитого тобой человека. ~ A lock of hair from the first person you killed.
Длинный килт, сотканный изо мха. ~ A long kilt of woven moss.
Любовное письмо серебряными чернилами твоей наречённой из фей. (Доставляется в кольцо поганок.) ~ A love letter in silver ink to your fairy betrothed, to be placed within a ring of toadstools.
Миниатюрный латунный гном. Каждое утро оказывается на подушке, глядя на тебя. ~ A miniature brass gnome. Appears on your pillow looking at you each morning.
Салфетка и столовые приборы, украденные из дорогой корчмы. ~ A napkin and cutlery that you stole from a fancy inn.
Записка от матери с требованием вернуться домой при первой возможности. ~ A note from your mother admonishing you to return home as soon as able.
Пара полосатых шерстяных носков, в которых ногам тепло и сухо, как в дорогих сапогах. ~ A pair of stripy woollen socks that keep your feet as warm and dry as fine boots.
Камешек, слабо светящийся в темноте. ~ A pebble that glows faintly in the dark.
Кусок луны, упавший на землю. (Или это ссохшийся сыр?) ~ A piece of the moon that fell to earth. (Or is it a hunk of desiccated cheese?)
Фарфоровый чайник с росписью: совы пожирают людей. ~ A porcelain teapot painted with a scene of owls devouring humans.
Воронье перо-перо, которое пишет без чернил. ~ A raven's feather quill that writes without ink.
Серебряный пояс, сплетённый из гривы келпи. ~ A silver belt woven from the mane of a kelpie.
Серебряное зеркало, всегда отражающее небо. ~ A silver mirror that always reflects the sky.
Серебряное кольцо, сжимающееся или расширяющееся под любой палец. ~ A silver ring that shrinks or expands to fit whatever finger it is placed upon.
Крошечная рыбка в банке с водой. Ночью всплывает и шепчет имена всех в пяти футах. ~ A tiny fish in a jar of water. At night, it whispers the names of everyone within 5'.
Крошечная плетёная фигурка, украденная тобой из хижины ведьмы. ~ A tiny wicker effigy that you stole from a witch's hut.
Статуэтка единорога, вырезанная из грибного дерева. ~ A unicorn statuette carved out of mushroom-wood.
Объявление о розыске — твоё собственное. ~ A wanted poster for yourself.
Зачитанная книга псалмов с пометками на полях. ~ A well-thumbed and annotated book of psalms.
Ясеневая палочка, испачканная кровью тролля. ~ An ash wand stained with the blood of a troll.
Громадная латунная пряжка с Зелёным Человеком. ~ An enormous Green Man brass belt buckle.
Затейливый фонарь, найденный тобой в болоте. ~ An ornate lantern you found in a bog.
Шестнадцать серебряных монет, смазанных скользким магическим маслом, которое не смывается. ~ Sixteen silver pieces, greased with slippery magical oil that cannot be washed off.
Отломанный кончик рога единорога. ~ The broken tip of a unicorn's horn.
Меч фей, убивший твоего отца. ~ The fairy sword that slew your father.
Мумифицированная рука болотного мертвеца. ~ The mummified hand of a bog body.
Сверкающее серебристое перо ведьминой совы. ~ The scintillating, silvery feather of a witch owl.
Скелет особо крупной жабы, по частям. ~ The skeleton of an especially large toad, in pieces.
Череп Друна, украденный из запретного склепа. ~ The skull of a Drune, stolen from a forbidden crypt.
Шаткая розовая отрубленная рука студенистой обезьяны, всё ещё свежая и сладкая. ~ The wobbly, pink severed hand of a gelatinous ape, still fresh and sweet.
Борода твоего деда, свёрнутая в мешковину. ~ Your grandfather's beard, rolled up in a hessian cloth.
`),

  details: {
    head: { ru: 'Голова', en: 'Head', die: 12, items: tbl(`
Стриженые или бритые волосы ~ Cropped or shaven hair
Вышитая шапочка ~ Embroidered skull cap
Меховая шапка со звериным хвостом ~ Fur hat with animal tail
Залихватская шапка с пером ~ Jaunty cap with feather
Оттопыренные уши ~ Jug ears
Длинные косы ~ Long braids
Тщательно напомаженные волосы ~ Meticulously oiled hair
Череп неправильной формы ~ Misshapen skull
Клочковатые редкие волосы ~ Patchy, straggly hair
Посажена на изящную шею ~ Poised atop an elegant neck
Густые блестящие волосы ~ Thick, lustrous hair
Дикие кудри ~ Wild, curly hair
`) },
    face: { ru: 'Лицо', en: 'Face', die: 12, items: tbl(`
Кривой нос ~ Bent nose
Нос пуговкой ~ Button nose
Бегающие глаза ~ Darting eyes
Забавный волчий рот ~ Droll, lupine mouth
Щербатый ~ Gap-toothed
Волосатое ~ Hirsute
Крупный царственный нос ~ Large, regal nose
Узкое, поджатое ~ Narrow, pinched
Прыщи ~ Pimples
Заметный шрам ~ Prominent scar
Румяное ~ Rosy
Широкие, расставленные черты ~ Wide, spaced out features
`) },
    body: { ru: 'Тело', en: 'Body', die: 12, items: tbl(`
Бочкообразная грудь ~ Barrel chest
Большие руки ~ Big hands
Пятнистая кожа ~ Blotchy skin
Чрезмерно волосатое ~ Excessively hairy
Веснушки ~ Freckles
Длинные ноги ~ Long legs
Длинные изящные пальцы ~ Long, elegant fingers
Жирная кожа ~ Oily skin
Изрыто оспинами ~ Pocked with plague-scars
Пузо ~ Pot belly
Гладкая, мягкая кожа ~ Smooth, supple skin
Бородавки ~ Warts
`) },
    speech: { ru: 'Речь', en: 'Speech', die: 12, items: tbl(`
Взволнованная ~ Agitated
Громогласная ~ Bellowing
Кудахчущая ~ Cackling
Грубая ~ Coarse
Заговорщицкая ~ Conspiratorial
Скрипучая ~ Gravelly
Пустая болтовня ~ Inane banter
Мягкая ~ Mellow
Бормочущая ~ Mumbling
Гнусавое нытьё ~ Nasal whine
Быстрая ~ Rapid
Со вздохами ~ Sighing
`) },
    demeanour: { ru: 'Нрав', en: 'Demeanour', die: 12, items: tbl(`
Мрачный, вспыльчивый ~ Brooding, quick-tempered
Любопытный, широких взглядов ~ Curious, broad-minded
Угрюмый, целеустремлённый ~ Dour, single-minded
Восторженный, доверчивый ~ Enthusiastic, gullible
Общительный ~ Gregarious
Нетерпеливый и опрометчивый ~ Impatient and rash
Добросердечный ~ Kindly
Скупой ~ Miserly
Интриган ~ Scheming
Самовозвеличивающийся ~ Self-aggrandising
Неряшливый ~ Slovenly
Обходительный ~ Suave
`) },
    dress: { ru: 'Одежда', en: 'Dress', die: 12, items: tbl(`
Пёстрое лоскутное ~ Colourful patchwork
Щегольской дублет и шоссы ~ Dashing doublet and hose
Загадочный плащ с капюшоном ~ Enigmatic cloak and hood
Грязная шерсть ~ Filthy woollens
Мешковинное тряпьё ~ Hessian rags
Кружева, букетики и рюши ~ Lace, posies, and frills
Вонючие меха ~ Noisome furs
Стёганый жилет и бриджи ~ Padded vest and breeches
Овчинная шуба ~ Sheepskin coat
Курительный жакет и брюки ~ Smoking jacket and slacks
Крепкие сапоги и дождевик ~ Sturdy boots and raincoat
Потрёпанная дорогой кожа ~ Way-worn leathers
`) },
    desires: { ru: 'Желание', en: 'Desires', die: 12, items: tbl(`
Построить замок и новую деревню ~ Build castle and new village
Очистить имя семьи ~ Clear family name
Собрать реликвии святых ~ Collect saintly relics
Домашнее счастье ~ Domestic bliss
Исследовать Фейри ~ Explore Fairy
Основать торговую империю ~ Found business empire
Дурная слава ~ Infamy
Нанести на карту камни Дольменвуда ~ Map stones of Dolmenwood
Жениться на аристократке ~ Marry into nobility
Искупить прошлые злодеяния ~ Redeem past misdeeds
Тайное подземное логово ~ Secret underground lair
Спустить состояние на роскошь ~ Squander fortune on luxury
`) },
    beliefs: { ru: 'Убеждение', en: 'Beliefs', die: 12, items: tbl(`
Епископ — оборотень ~ Bishop is a werewolf
Друны поработят герцога ~ Drune will enslave the duke
Феи крадут души людей ~ Fairies steal human souls
Наг-Лорд несёт конец света ~ Nag-Lord brings final doom
Один из родителей был эльфом ~ One parent was an elf
Молитвы искупают злые дела ~ Prayers redeem evil deeds
Существует гриб бессмертия ~ Shroom of immortality
В озере Лонгмир затонула деревня ~ Sunken village in Longmere
Говорящие звери готовят восстание ~ Talking beasts plot uprising
Мёртвые встают ~ The dead are rising
Видения от Хладного Принца ~ Visions from the Cold Prince
Ведьмы служат Наг-Лорду ~ Witches serve the Nag-Lord
`) }
  }
};
