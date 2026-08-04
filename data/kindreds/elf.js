/* Эльф — Elf. Player's Book, стр. 36–39 (род), 182–183 (род-класс). */
import { tbl, names, d100pairs as d100 } from '../util.js'

export const elf = {
  id: 'elf',
  ru: 'Эльф', en: 'Elf',
  tagline: 'Нестареющие феи, перешедшие в смертный мир по причинам, о которых редко говорят.',
  taglineEn: 'Ageless fairies who have crossed into the mortal world for reasons they seldom reveal.',
  type: 'fairy', typeRu: 'Фея',
  size: 'Medium', sizeRu: 'Средний',
  page: 36, kcPage: 182,
  age: { dice: '1d100', mult: 10, base: 0, label: 'Возраст на 1 уровне' },
  lifespan: { fixed: 'Бессмертен', label: 'Срок жизни' },
  height: { dice: '2d6', base: 60, unit: 'in', label: 'Рост' },
  weight: { dice: '3d10', base: 100, unit: 'lbs', label: 'Вес' },
  languages: [
    { ru: 'Волдийский', en: 'Woldish' },
    { ru: 'Сильван', en: 'Sylvan' },
    { ru: 'Высокий эльфийский', en: 'High Elfish' }
  ],
  lore: 'Как люди владычествуют в смертном мире, так эльфы — в Фейри. Они куют огромные королевства, подчиняют себе других и глубоко копают в тайнах магии. Внешне похожи на людей, но всегда несут печать нездешности: острые уши, рожки, звездообразные зрачки. Эльф в смертном мире пришёл сюда без прямого пути назад — стоит подумать, почему.',
  relations: 'Странствующие эльфы очарованы смертными: их короткими яркими жизнями, старением, смертью. С феями и полуфейскими в добрых отношениях. В людских поселениях к эльфам относятся с трепетом и опаской — фольклор полон рассказов о коварстве эльфов времён Хладного Принца.',
  classAdvice: 'Эльфы чаще всего чароплёты, воины, охотники или маги. Редко их принимают в рыцари. Клириками и монахами быть НЕ МОГУТ — у них нет духовной связи с божествами смертных.',

  traits: [
    { ru: 'Навыки эльфа', en: 'Elf Skills', p: 37,
      d: 'Цель навыков Слушать и Обыскивать — 5 (вместо обычных 6), то есть шанс 2 из 6.' },
    { ru: 'Гламуры', en: 'Glamours', p: 37,
      d: 'Каждый эльф знает один случайно определённый гламур — врождённое магическое умение, активируемое одной мыслью.' },
    { ru: 'Бессмертие', en: 'Immortality', p: 37,
      d: 'Эльфа можно убить, но своей смертью он не умирает. Иммунен к немагическим болезням, не может умереть от жажды или голода (но без пищи становится отчаянным и жестоким).' },
    { ru: 'Сопротивление магии', en: 'Magic Resistance', p: 37,
      d: '+2 к Сопротивлению магии, то есть к спасброскам против всего магического (сверх модификатора Мудрости).' },
    { ru: 'Неземная красота', en: 'Unearthly Beauty', p: 37,
      d: 'При взаимодействии со смертными эльф получает +2 к Харизме (максимум 18).' },
    { ru: 'Уязвимость к холодному железу', en: 'Vulnerable to Cold Iron', p: 37,
      d: 'Оружие из холодного железа наносит эльфу +1 урона.' }
  ],

  kindredClass: {
    ru: 'Эльф (род-класс)', en: 'Elf Kindred-Class',
    primeAbilities: ['STR', 'CHA'],
    primeRu: 'Харизма и Сила',
    hitDie: 'd6', hpAfter10: 1,
    aptitude: 'martial', aptitudeRu: 'Воинская',
    armour: 'Любая, включая щиты', armourEn: 'Any, including shields',
    weapons: 'Любое', weaponsEn: 'Any',
    armourAllowed: ['none', 'light', 'medium', 'heavy'], shields: true,
    weaponSizes: ['Small', 'Medium', 'Large'],
    desc: 'Эльфы — могучие воины, наделённые как уроженцы Фейри врождёнными талантами, которые смертные считают магией. Владеют тайными свитками и руническими секретами, дарованными лордами Фейри.',
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
      { r: [2, 3], items: ['longsword'] },
      { r: [4, 5], items: ['shortbow', 'arrows'] },
      { r: [6, 6], items: ['shortsword'] }
    ],
    classItems: [],
    grantsGlamours: 1,
    grantsLesserRune: true,
    traits: [
      { ru: 'Навыки эльфа', en: 'Elf Skills', d: 'Слушать и Обыскивать — цель 5.' },
      { ru: 'Обнаружение магии', en: 'Detect Magic', d: 'Специальный навык, цель 5 на 1 уровне. Требует прикоснуться к предмету/месту/существу и сосредоточиться на 1 ход. Бросает Рефери втайне.' },
      { ru: 'Руны фей', en: 'Fairy Runes', d: 'На 1 уровне эльф знает одну случайную малую руну. На 1–4 уровне её можно применить раз в день.' },
      { ru: 'Гламуры', en: 'Glamours', d: 'На 1 уровне — 1 случайный гламур.' },
      { ru: 'Бессмертие', en: 'Immortality', d: 'Своей смертью не умирает, иммунен к немагическим болезням, не умирает от голода и жажды.' },
      { ru: 'Магические предметы', en: 'Magic Items', d: 'Может пользоваться предметами, доступными только заклинателям тайной магии (например, свитками тайных заклинаний).' },
      { ru: 'Сопротивление божественной помощи', en: 'Resistance to Divine Aid', d: 'Если на эльфа накладывают благотворное святое заклинание, есть шанс 2 из 6, что оно не подействует.' },
      { ru: 'Неземная красота', en: 'Unearthly Beauty', d: '+2 к Харизме при взаимодействии со смертными (макс. 18).' },
      { ru: 'Уязвимость к холодному железу', en: 'Vulnerable to Cold Iron', d: 'Холодное железо наносит +1 урона.' }
    ],
    advancement: [
      [1, 0, '1d6', 1, 11, 12, 13, 16, 14],
      [2, 3500, '1d6', 1, 11, 12, 13, 16, 14],
      [3, 7000, '1d6', 2, 10, 11, 12, 15, 13],
      [4, 14000, '1d6', 3, 9, 10, 11, 14, 12],
      [5, 28000, '1d6', 3, 9, 10, 11, 14, 12],
      [6, 56000, '1d6', 4, 8, 9, 10, 13, 11],
      [7, 112000, '1d6', 5, 7, 8, 9, 12, 10],
      [8, 224000, '1d6', 5, 7, 8, 9, 12, 10],
      [9, 450000, '1d6', 6, 6, 7, 8, 11, 9],
      [10, 620000, '1d6', 7, 5, 6, 7, 10, 8],
      [11, 790000, '+1', 7, 5, 6, 7, 10, 8],
      [12, 960000, '+1', 8, 4, 5, 6, 9, 7],
      [13, 1130000, '+1', 9, 3, 4, 5, 8, 6],
      [14, 1300000, '+1', 9, 3, 4, 5, 8, 6],
      [15, 1470000, '+1', 10, 2, 3, 4, 7, 5]
    ],
    glamoursByLevel: [1, 2, 3, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10],
    skills: [{ ru: 'Обнаружение магии', en: 'Detect Magic', targets: [5, 5, 5, 5, 4, 4, 3, 3, 2, 2, 2, 2, 2, 2, 2] }]
  },

  names: names(`
Ведро-и-Похлёбка|Bucket-and-Broth ~  ~  ~
Свеча-Согнутая-Вбок|Candle-Bent-Sidewise ~  ~  ~
Взгляд-Искоса-Гиллем|Glance-Askew-Guillem ~  ~  ~
Джек-Многих-Цветов|Jack-of-Many-Colours ~  ~  ~
Кружево-и-Горошек|Lace-and-Polkadot ~  ~  ~
Плач-о-Сломанных-Костях|Lament-of-Bones-Broken ~  ~  ~
Легко-Придёт-Тихо|Lightly-Come-Softly ~  ~  ~
Лилии-над-Сердцезрением|Lillies-o'er-Heartsight ~  ~  ~
Укол-Гвоздя|Prick-of-the-Nail ~  ~  ~
Серебро-и-Ртуть|Silver-and-Quicksilver ~  ~  ~
Весна-Королеве|Spring-to-the-Queen ~  ~  ~
Побег-на-Виселице|Sprue-Upon-Gallows ~  ~  ~
Солнцеворот-Прилива|Sun's-Turning-Tide ~  ~  ~
Ужин-До-Полудня|Supper-Before-Noon ~  ~  ~
Слишком-Рано-Зачатый|Too-Soon-Begotten ~  ~  ~
Обман-Света|Trick-of-the-Light ~  ~  ~
Свидание-по-Городу|Tryst-about-Town ~  ~  ~
Кувырок-и-Напёрсток|Tumble-and-Thimble ~  ~  ~
Вино-в-Кубке|Wine-By-The-Goblet ~  ~  ~
Юность-Свернувшаяся|Youth-Turned-Curdled ~  ~  ~
`),

  /* У эльфов имена делятся на «деревенские» и «придворные» вместо муж/жен. */
  nameStyles: {
    rustic: { ru: 'Деревенское', en: 'Rustic' },
    courtly: { ru: 'Придворное', en: 'Courtly' }
  },
  namesCourtly: tbl(`
Рождает-Лишь-Сны ~ Begets-Only-Dreams
Дыхание-На-Свечу ~ Breath-Upon-Candlelight
Чаша-Сумеречной-Фиалки ~ Chalice-of-Duskviolet
Сон-о-Памяти ~ Dream-of-Remembrance
Жатва-Потерянных-Дней ~ Gleanings-of-Lost-Days
Руки-Связаны-Воронами ~ Hands-Bound-By-Crows
Дерзость-Побеждает ~ Impudence-Hath-Victory
Индиго-и-Лоскут ~ Indigo-and-Patchwork
Не-Выйду-Замуж ~ Marry-No-Man
Последние-Туманы-Утра ~ Morning's-Last-Mists
Стая-Воронов ~ Murder-of-Ravens
Дрожь-Ночи ~ Quavering-of-Night
Сладкий-Аромат-Мести ~ Revenge's-Sweet-Scent
Семь-Шагов-На-Заре ~ Seven-Steps-At-Dawn
Тень-Зимнего-Предательства ~ Shade-of-Winter-Betrayal
Мелкая-Мучительная-Беда ~ Shallow-Pained-Plight
Плач-Мелкого-Духа ~ Shallow-Spirit's-Lament
Ускользает-За-Тени ~ Slips-Behind-Shadows
Спесь-Весеннего-Полудня ~ Spring-Noon's-Arrogance
Фиалка-и-Клементина ~ Violet-and-Clementine
`),

  backgrounds: tbl(`
Летописец ~ Chronicler
Куафёр ~ Coiffeur
Кондитер ~ Confectioner
Придворный ~ Courtier
Вор снов ~ Dream thief
Охотник на лосей ~ Elk hunter
Исследователь ~ Explorer
Скульптор по инею ~ Frost sculptor
Арфист ~ Harpist
Разбойник с большой дороги ~ Highway robber
Библиотекарь ~ Librarian
Шарлатан ~ Mountebank
Собиратель орехов ~ Nut forager
Дрессировщик павлинов ~ Peacock trainer
Поэт ~ Poet
Оружейник-мечник ~ Swordsmith
Портной ~ Tailor
Лицедей ~ Thespian
Смотритель единорогов ~ Unicorn handler
Винодел ~ Vintner
`),

  trinkets: d100(`
Мешочек гусениц, чья плоть обладает галлюциногенными свойствами. ~ A bag of caterpillars whose flesh have hallucinogenic properties.
Мешочек липких леденцов, которые не уменьшаются, сколько их ни соси. ~ A bag of sticky sweets that never get any smaller when sucked on.
Клубок серебристой бечёвки, невидимой в лунном свете. ~ A ball of silvery twine that is invisible in moonlight.
Клубок пряжи, подаренный благодарным гримолкином. ~ A ball of yarn, gifted to you by a grateful grimalkin.
Чёрная роза, которая никогда не вянет. ~ A black rose that never wilts.
Плитка шоколада из какао, собранного с мослинга. ~ A block of chocolate made with cocoa harvested from a mossling.
Книга любительских стихов. Ты подозреваешь, что автор — могущественный вельможа Фейри. ~ A book of amateur poetry. You suspect the author to be a powerful Fairy noble.
Венок, сплетённый из остролиста и ядовитого плюща. ~ A crown woven from holly and poison ivy.
Маргаритка, светящаяся в лунном свете. ~ A daisy that glows in moonlight.
Щегольская шляпа, увенчанная лосиными рогами. ~ A fancy hat topped with elk antlers.
Осколок светящегося кристалла, найденный тобой во сне. ~ A fragment of glowing crystal that you found in a dream.
Обломок рога злого единорога. ~ A fragment of horn from an evil unicorn.
Стеклянная бутыль, уничтожающая любую налитую в неё жидкость. ~ A glass bottle that annihilates any liquid poured into it.
Стеклянная банка с крошечной замороженной фигуркой твоей единственной сестры. ~ A glass jar containing the tiny, frozen form of your only sister.
Хрустальная туфелька в пятнах крови. ~ A glass slipper, stained with blood.
Арфа, которая без присмотра играет неуместную музыку с мастерством увлечённого дилетанта. ~ A harp that, if left unattended, plays mood-inappropriate music.
Шейпс (святой символ Церкви), подаренный тебе умирающим монахом десятки лет назад. ~ A Chapes (holy symbol of the Pluritine Church), given to you by a dying friar decades ago.
Ключ изо льда. Тает в тепле и восстанавливается на холоде. ~ A key fashioned from ice. It melts in the warmth, and reforms in cold weather.
Фонарь, горящий холодным синим пламенем. ~ A lantern that burns with a cold, blue flame when lit.
Письмо на высоком эльфийском, обещающее твою скорую кончину. Доставлено более ста лет назад. ~ A letter promising your imminent demise, written in High Elfish, delivered over a hundred years ago.
Сердце смертного, отданное добровольно. ~ A mortal's heart, freely given.
Крупица солнечного света, запертая в сверкающем кристалле. ~ A mote of sunlight, trapped in a scintillating crystal.
Ожерелье, составленное из медоносных пчёл. ~ A necklace composed of honeybees.
Кошмар, запечатанный в бутылке. ~ A nightmare, sealed inside a bottle.
Свирель, украденная у вудгрю. Одной трубки не хватает. ~ A pan flute stolen from a woodgrue. A single pipe is missing.
Павлинье перо, чей «глаз» время от времени моргает. ~ A peacock feather whose eye intermittently blinks.
Приятный сон, перегнанный в ликёр. ~ A pleasant dream, distilled into a liquor.
Расписка о займе четырёх редких и дорогих томов из библиотеки Фейри. Ни одной из этих книг у тебя больше нет. ~ A receipt for a loan of four rare and expensive tomes from a Fairy library.
Ножны, снятые с тела павшего рыцаря. ~ A scabbard taken from the fallen body of a great knight.
Запечатанный свиток. Якобы содержит одно из бесчисленных имён Короля Гоблинов, никогда не произносимых. ~ A sealed scroll, allegedly containing one of the Goblin King's never-spoken names.
С виду обычный жёлудь. Кричит, если снять с него шляпку. ~ A seemingly ordinary acorn. Screams when its cap is removed.
Комплект подков, сделанный для кентавра. ~ A set of horseshoes, designed for a centaur.
Серебряная ложка, по команде источающая мёд. ~ A silver spoon that drips honey on command.
Одинокое воронье перо из плаща Королевы Чёрных Дроздов. ~ A single crow feather, taken from the cloak of the Queen of Blackbirds.
Костлявый палец, который скребёт и царапает в сумерках. Если дать ему чем писать, выводит мрачные пророчества. ~ A skeletal finger that scrapes at dusk and writes macabre prophecies.
Колокольчик в форме брегглского глаза. Звону вторит слабое блеяние. ~ A small bell shaped like a breggle's eye. Faint bleating accompanies its ringing.
Паук, медленно плетущий паутину в форме одежды. ~ A spider that slowly weaves webs in the shape of clothing.
Подзорная труба, всегда показывающая ночное море. ~ A spyglass that always shows a view of a sea at night.
Напёрсток, всегда магически полный сладкого ликёра. ~ A thimble that is always magically full of sweet liqueur.
Бело-золотой зонтик, создающий темноту прямо под собой. ~ A white-and-gold parasol that creates darkness directly underneath it.
Плащ из волчьей шкуры. Голова волка ещё на месте и порой пускает слюну. ~ A wolf pelt cloak. The wolf's head is still attached and occasionally salivates.
Древняя бронзовая маска с бородатым лицом. ~ An ancient bronze mask depicting a bearded face.
Пустая винная бутылка. Поднесённая к жидкости, втягивает её, пока не наполнится. ~ An empty wine bottle. When held over a liquid, it draws it inside until full.
Песочные часы, в которых песок сыплется всегда в одну сторону. Их нельзя перевернуть. ~ An hourglass which constantly flows in one direction. It cannot be inverted.
Сосулька, которая никогда не тает. ~ An icicle that never melts.
Бронзовые колокольчики, звенящие и при сильном ветре, и в присутствии призраков. ~ Bronze chimes that tinkle in the presence of both ghosts and strong breezes.
Инструменты скульптора, неестественно холодные на ощупь. ~ Sculpting tools, preternaturally cold to the touch.
Шесть склянок крови, каждая взята у представителя своего рода. ~ Six vials of blood, each drawn from a different Kindred.
Звёздные карты, не соответствующие ни одному небу, видимому из Дольменвуда. ~ Star charts that match no sky seen from Dolmenwood.
Отрубленный хвост лошади фей. ~ The severed tail of a fairy horse.
`),

  details: {
    head: { ru: 'Голова', en: 'Head', die: 12, items: tbl(`
Изящные острые уши ~ Delicate, pointed ears
Висячие ослиные уши ~ Floppy, ass-like ears
Струящиеся серебряные волосы ~ Flowing, silver hair
Щегольской парик ~ Foppish wig
Блестящие переливчатые волосы ~ Glossy, iridescent hair
Золотые волосы днём, седые ночью ~ Gold hair at day, grey at night
Волосы белые как снег ~ Hair as white as snow
Волосы как паутина ~ Hair like cobwebs
Сияющие волосы до пояса ~ Lustrous, waist-length hair
Рваные, коротко обрезанные волосы ~ Ragged, cropped hair
Тенистые локоны ~ Shadowy locks
Маленькие рожки цвета слоновой кости ~ Small, ivory horn nubs
`) },
    face: { ru: 'Лицо', en: 'Face', die: 12, items: tbl(`
Андрогинное ~ Androgynous
Цвет глаз меняется с временем года ~ Eye colour shifts with season
Кошачьи глаза ~ Feline eyes
Губы в инее ~ Frosted blue lips
На коже отблеск свечи ~ Glow of candlelight on skin
Длинный благородный нос ~ Long, distinguished nose
Бледное и похожее на маску ~ Pale and mask-like
В пятнах сажи ~ Spotted with soot
Звездообразные зрачки ~ Star-shaped pupils
Фиалковые глаза ~ Violet eyes
Широко распахнутые, детские глаза ~ Wide-eyed, childlike
Широко расставленные миндалевидные глаза ~ Wide-set almond eyes
`) },
    body: { ru: 'Тело', en: 'Body', die: 12, items: tbl(`
Аромат мёда или медовухи ~ Aroma of mead or honey
Аура пляшущих искр ~ Aura of dancing glimmers
Синеватая кожа ~ Bluish skin
Слегка бесплотный ~ Faintly insubstantial
Золотая кровь, серебряные слёзы ~ Golden blood, silver tears
Гибкое сложение, пол неясен ~ Lithe frame, sex unclear
Запах свежей весенней росы ~ Odour of fresh spring dew
Бледная кожа, чёрная в зеркалах ~ Pale skin, black in mirrors
Кожа будто освещена луной ~ Skin appears moonlit
Кожа новорождённого ~ Skin of a newborn
Кожа покрыта инеем ~ Skin rimed with frost
Искрящаяся кожа ~ Sparkling skin
`) },
    speech: { ru: 'Речь', en: 'Speech', die: 12, items: tbl(`
Снисходительная ~ Condescending
Отдалённая, с лёгким эхом ~ Distant and slightly echoing
Плоская, лишённая тона ~ Flat and toneless
Заигрывающая ~ Flirtatious
Как треск льда ~ Like the cracking of ice
Певучая ~ Lilting
Весёлая ~ Mirthful
Тон скачет: то низкий, то высокий ~ Pitch changes: deep/high
Поэтичная и тёмная ~ Poetic and obscure
Песнями и рифмами ~ Song and rhyme
Едва уловимо угрожающая ~ Subtly threatening
Шепчущая ~ Whispering
`) },
    demeanour: { ru: 'Нрав', en: 'Demeanour', die: 12, items: tbl(`
Напускная знатность ~ Affected nobility
Отстранённый и аморальный ~ Aloof and amoral
Ребячливый и озорной ~ Childlike and mischievous
Декадент ~ Decadent
Ликующий энтузиазм ~ Gleeful enthusiasm
Проницательно наивный ~ Keenly naive
Словоохотливый ~ Loquacious
Меланхоличный эстет ~ Melancholic aesthete
Одержимый ~ Obsessive
Язвительный наблюдатель ~ Sardonic observer
Своевольный и капризный ~ Wilful and whimsical
Уставший от мира ~ World-weary
`) },
    dress: { ru: 'Одежда', en: 'Dress', die: 12, items: tbl(`
Клетчатый наряд арлекина ~ Chequered harlequin
Плащ из чёрных перьев ~ Cloak of black feathers
Плащ из инея ~ Cloak of frost
Паутина и сажа ~ Cobwebs and soot
Истлевшая царственная роскошь ~ Decaying regal finery
Затейливая вышивка ~ Elaborately embroidered
Экстравагантные пышные кружева ~ Extravagant, frilly lace
Кружево и цветы ~ Lace and flowers
Платье из перламутра ~ Mother of pearl gown
Прозрачный чёрный ~ Sheer black
Серебристая паутинка ~ Silvery gossamer
Сотканное из листьев ~ Woven leaves
`) },
    desires: { ru: 'Желание', en: 'Desires', die: 12, items: tbl(`
Разбивать сердца смертных ~ Break mortal hearts
Собрать коллекцию экзотических чучел ~ Collect exotic stuffed beasts
Свергнуть вельможу Фейри ~ Depose fairy lord or lady
Перегонять вина из чувств ~ Distil wines from emotions
Запретное тайное знание ~ Forbidden arcane lore
Библиотека снов ~ Library of dreams
Странные магические безделушки ~ Odd magical trinkets
Возвращение Хладного Принца ~ Return of the Cold Prince
Вкусить лучшее в смертной жизни ~ Savour finest of mortal life
Состариться и умереть ~ To grow old and die
Понять религию смертных ~ Understand mortal religion
Узурпировать благородный дом ~ Usurp noble house
`) },
    beliefs: { ru: 'Убеждение', en: 'Beliefs', die: 12, items: tbl(`
Все растения разумны ~ All plants are sentient
Кошки — переодетые феи ~ Cats are disguised fairies
Дневного света надо избегать ~ Daylight is to be shunned
Пить только тонкое вино ~ Drink only fine wine
Магия — истинный язык ~ Magic is the true language
Смертный мир — всего лишь сон ~ Mortal world is but a dream
Смертные произошли от грибов ~ Mortals evolved from fungi
Реальность — сказочная песня ~ Reality is a fabulous song
Мир умирает ~ The world is dying
Время просачивается в Фейри ~ Time is seeping into Fairy
Ты понимаешь речь звёзд ~ Understand speech of stars
Ведьмами правит королева фей ~ Witches led by fairy queen
`) }
  }
};
