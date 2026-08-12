/* Промпт для генератора изображений — под конкретного персонажа.
 *
 * Закон 1. Всё, что промпт УТВЕРЖДАЕТ о персонаже, взято из книги
 * (Player's Book, 6 августа 2024) или из брошенных кубиков: внешность рода
 * (стр. 32, 36, 40, 44, 48, 52), облик класса или род-класса, все выпавшие
 * приметы, прошлое, мировоззрение, лунный знак, гламуры, сноровка,
 * симбиотическая плоть, безделушка, настоящее носимое снаряжение, уровень.
 *
 * Единственное законное исключение — оформление: палитра, освещение,
 * композиция и манера рисунка. Это не правило игры, а рамка картинки,
 * поэтому сочиняется свободно.
 *
 * Разнообразие с постоянством. Оформление выбирается детерминированно по
 * идентификатору персонажа: один и тот же герой всегда даёт один и тот же
 * промпт, а два разных мослинга-воина — заметно разные картинки. Наборы свои
 * для смертных, фей и полуфейских (стр. 30–31: смертные земные и телесные,
 * феи неземные и светящиеся, полуфейские — между двух миров).
 */
import * as D from '../data/index.js'

/* ================= мелкие помощники ================= */

function txt(v) { return v == null ? '' : String(v).trim(); }
function trimDot(s) { return txt(s).replace(/[.\s]+$/, ''); }
function lc(s) { return trimDot(s).toLowerCase(); }

/** Склеивает непустые куски через разделитель. */
function join(parts, sep) {
  return parts.filter(function (x) { return txt(x); }).join(sep == null ? ', ' : sep);
}

/** Строка вида «Метка: содержимое», или пустая, если содержимого нет.
   Прочерк — это «поле не заполнено», а не факт о персонаже: такую строку не пишем. */
function row(label, body) {
  var v = trimDot(body);
  if (!v || v === '—' || v === '-') return '';
  return label + ': ' + v + '.';
}

/* Устойчивый хеш строки — тот же djb2, что и в контрольной сумме листа. */
function hash(str) {
  var h = 5381, i;
  for (i = 0; i < str.length; i++) h = ((h * 33) ^ str.charCodeAt(i)) >>> 0;
  return h;
}

/* Зерно оформления. Идентификатор не меняется при правках листа, поэтому
   палитра и композиция у персонажа постоянные: поменял снаряжение —
   изменились факты, но картинка осталась узнаваемо той же. */
function seed(ch) {
  var name = (ch.name && (ch.name.en || ch.name.ru)) || '';
  return txt(ch.id) || (name + '/' + txt(ch.kindred && ch.kindred.id) + '/' + txt(ch.profile && ch.profile.id));
}

function pick(ch, salt, options) {
  return options[hash(seed(ch) + '|' + salt) % options.length];
}

/* ================= оформление (свободно сочиняется) ================= */

var STYLE = {
  mortal: {
    palette: [
      { en: 'muted earthy palette — moss green, bark brown, ochre, faded gold',
        ru: 'приглушённая земляная палитра: мох, кора, охра, потускневшее золото' },
      { en: 'wet autumn palette — rust, sodden slate grey, barley yellow',
        ru: 'сырая осенняя палитра: ржавчина, мокрый сланец, ячменная желтизна' },
      { en: 'peat-dark palette — umber, ox-blood red, tallow white',
        ru: 'торфяная темнота: умбра, бычья кровь, сальная белизна' },
      { en: 'overcast palette — grey-green, oat, dull iron, a single warm accent',
        ru: 'пасмурная палитра: серо-зелёный, овсяный, тусклое железо и одно тёплое пятно' },
      { en: 'harvest palette — russet, smoke, dusty cream, deep bottle green',
        ru: 'палитра урожая: багрец, дым, пыльные сливки, густой бутылочный зелёный' }
    ],
    light: [
      { en: 'flat overcast daylight under a heavy sky', ru: 'ровный пасмурный день под тяжёлым небом' },
      { en: 'low afternoon sun raking between wet trunks', ru: 'низкое послеполуденное солнце скользит между мокрых стволов' },
      { en: 'firelight from below, everything beyond it in gloom', ru: 'свет костра снизу, дальше — сплошной сумрак' },
      { en: 'grey dawn mist softening every edge', ru: 'серый рассветный туман смягчает все края' },
      { en: 'a single lantern held close, warm against the cold dark', ru: 'один фонарь у самого лица, тепло против холодной тьмы' }
    ],
    shot: [
      { en: 'full figure, three-quarter view, standing', ru: 'в полный рост, вид в три четверти, стоя' },
      { en: 'waist-up, turned to look back over the shoulder', ru: 'по пояс, обернулся через плечо' },
      { en: 'full figure seen slightly from below, boots deep in the undergrowth',
        ru: 'в полный рост, взгляд снизу, сапоги в подлеске' },
      { en: 'close portrait, head and shoulders, looking straight at the viewer',
        ru: 'крупный портрет, голова и плечи, смотрит прямо на зрителя' },
      { en: 'full figure mid-stride, wind in the clothing', ru: 'в полный рост, на ходу, ветер в одежде' }
    ],
    manner: [
      { en: 'painterly old-school fantasy illustration, fine ink linework, detailed but not glossy',
        ru: 'живописная старошкольная фэнтези-иллюстрация, тонкая тушевая линия, подробно, но без глянца' },
      { en: 'woodcut-like hatching, heavy blacks, storybook plate',
        ru: 'гравюрная штриховка, тяжёлые чёрные пятна, вклейка из книги сказок' },
      { en: 'muted oil study, visible brushwork, soft edges',
        ru: 'приглушённый масляный этюд, видимый мазок, мягкие края' },
      { en: 'pen-and-wash chapbook illustration, dry brown ink',
        ru: 'перо и отмывка, лубочная манера, сухая бурая тушь' },
      { en: 'thick matte gouache, folk-art flatness', ru: 'плотная матовая гуашь, плоскостность народной картинки' }
    ]
  },

  fairy: {
    palette: [
      { en: 'cold moonlit palette — silver, bone white, midnight blue',
        ru: 'холодная лунная палитра: серебро, костяная белизна, полуночная синь' },
      { en: 'iridescent palette — dragonfly green, violet, pearl',
        ru: 'переливчатая палитра: стрекозиная зелень, фиалка, перламутр' },
      { en: 'frost palette — pale blue, hoarfrost white, a thread of thin gold',
        ru: 'морозная палитра: бледная лазурь, изморозь и нитка тонкого золота' },
      { en: 'twilight palette — heather purple, black, cold rose',
        ru: 'сумеречная палитра: вересковый пурпур, чернота, холодная роза' },
      { en: 'illuminated-manuscript palette — candlelit gold, deep green, vermilion',
        ru: 'палитра рукописной миниатюры: свечное золото, густая зелень, киноварь' }
    ],
    light: [
      { en: 'a faint inner glow lighting the face from within', ru: 'слабое внутреннее свечение подсвечивает лицо изнутри' },
      { en: 'moonlight and nothing else', ru: 'только лунный свет и больше ничего' },
      { en: 'backlit by an unseen source, every edge rimmed in cold light',
        ru: 'контровой свет из ниоткуда, все края обведены холодом' },
      { en: 'light with no visible source, the shadows falling the wrong way',
        ru: 'свет без источника, тени ложатся не в ту сторону' },
      { en: 'the drifting glimmer of will-o’-the-wisps', ru: 'плывущее мерцание блуждающих огоньков' }
    ],
    shot: [
      { en: 'full figure, three-quarter view, weightless stance', ru: 'в полный рост, три четверти, невесомая поза' },
      { en: 'full figure framed by an arch of branches, like a portrait miniature',
        ru: 'в полный рост в арке из ветвей, как портретная миниатюра' },
      { en: 'close portrait, head and shoulders, an unblinking gaze', ru: 'крупный портрет, немигающий взгляд' },
      { en: 'full figure glimpsed through a gap in the trees', ru: 'в полный рост, замечен в просвете между деревьями' },
      { en: 'full figure, symmetrical and heraldic, facing the viewer',
        ru: 'в полный рост, симметрично и геральдично, лицом к зрителю' }
    ],
    manner: [
      { en: 'jewel-bright illuminated-manuscript style, gold-leaf accents, flattened space',
        ru: 'самоцветная манера рукописной миниатюры, сусальные акценты, плоское пространство' },
      { en: 'delicate ink and watercolour, luminous washes', ru: 'тонкая тушь и акварель, светящиеся заливки' },
      { en: 'pre-Raphaelite oil, obsessive detail, decorative border',
        ru: 'прерафаэлитское масло, одержимая детализация, орнаментальная рама' },
      { en: 'silverpoint drawing, silvery-grey line on tinted ground',
        ru: 'серебряный карандаш, серо-серебристая линия по тонированному грунту' },
      { en: 'art-nouveau line and pattern, ornamental flatness',
        ru: 'модерновая линия и узор, орнаментальная плоскость' }
    ]
  },

  'demi-fey': {
    palette: [
      { en: 'earth shot through with iridescence — bark brown with beetle green',
        ru: 'земля с переливом: кора, пробитая жучиной зеленью' },
      { en: 'mushroom palette — buff, bruise purple, dirty cream',
        ru: 'грибная палитра: буроватый, синячный пурпур, грязные сливки' },
      { en: 'lamp-black and ember orange with a cold blue rim',
        ru: 'ламповая чернь и угольный оранжевый с холодной синей каймой' },
      { en: 'lichen palette — grey-green, sulphur yellow, rust',
        ru: 'лишайниковая палитра: серо-зелёный, сера, ржавчина' },
      { en: 'night-fair palette — tarnished brass, wine red, moth grey',
        ru: 'палитра ночной ярмарки: потемневшая латунь, винный красный, мотыльковый серый' }
    ],
    light: [
      { en: 'moonlight over embers, two lights fighting', ru: 'луна поверх углей, два света спорят' },
      { en: 'a guttering campfire in a hollow, deep night beyond', ru: 'чадящий костерок в лощине, дальше — глухая ночь' },
      { en: 'blue dusk with a warm glow from somewhere behind', ru: 'синие сумерки и тёплый отсвет откуда-то из-за спины' },
      { en: 'lantern-light through fog', ru: 'фонарь сквозь туман' },
      { en: 'starlight, faint and even', ru: 'звёздный свет, слабый и ровный' }
    ],
    shot: [
      { en: 'full figure, three-quarter view, caught mid-caper', ru: 'в полный рост, три четверти, застигнут в прыжке' },
      { en: 'full figure perched on a branch or stump, above the viewer',
        ru: 'в полный рост, на ветке или пне, выше зрителя' },
      { en: 'close portrait, head and shoulders, grinning at the viewer',
        ru: 'крупный портрет, скалится прямо в зрителя' },
      { en: 'full figure small against very big trees, to show the scale',
        ru: 'в полный рост, крошечный на фоне огромных деревьев — чтобы видеть размер' },
      { en: 'full figure, three-quarter view, low horizon and a lot of sky',
        ru: 'в полный рост, три четверти, низкий горизонт и много неба' }
    ],
    manner: [
      { en: 'painterly folk-horror illustration, ink line over dirty washes',
        ru: 'живописный фольк-хоррор, тушевая линия по грязноватым заливкам' },
      { en: 'etching-like crosshatch printed on rough paper',
        ru: 'офортная перекрёстная штриховка на шершавой бумаге' },
      { en: 'gouache with the tooth of the paper showing, storybook plate',
        ru: 'гуашь с проступающей фактурой бумаги, вклейка из книжки' },
      { en: 'ink line with limited flat colour, chapbook woodcut feel',
        ru: 'тушевой контур и скупой плоский цвет, лубочная гравюра' },
      { en: 'loose oil sketch, heavy impasto in the lights',
        ru: 'свободный масляный эскиз, густая пастозность в светах' }
    ]
  }
};

/* Место действия — приметы Дольменвуда из книги, меняется вместе с оформлением. */
var SCENES = [
  { en: 'Dolmenwood — a tangled fairytale forest of ancient oaks, drifting mist and toadstools',
    ru: 'Дольменвуд — спутанный сказочный лес древних дубов, ползущего тумана и поганок' },
  { en: 'Dolmenwood — a clearing of standing stones, the wood pressing in on all sides',
    ru: 'Дольменвуд — поляна со стоячими камнями, лес обступает со всех сторон' },
  { en: 'Dolmenwood — a sunken hollow way between mossy banks, roots overhead',
    ru: 'Дольменвуд — вымытая дорога-ложбина между мшистых откосов, корни над головой' },
  { en: 'Dolmenwood — the damp edge of the deep wood, hills and meadows behind',
    ru: 'Дольменвуд — сырая опушка глухой чащи, за спиной холмы и луга' },
  { en: 'Dolmenwood — under a dolmen of grey slabs, fungi at its feet',
    ru: 'Дольменвуд — под дольменом из серых плит, у подножия грибы' }
];

/* ================= внешность рода (книга) ================= */

var KINDRED_LOOK = {
  human: {
    en: 'a human of Dolmenwood',
    ru: 'человек Дольменвуда'
  },
  breggle: {
    en: 'a breggle — one of the goat-headed folk of the High Wold: a caprine head, a thick woolly fleece, ' +
        'and horns whose length marks caste',
    ru: 'бреггл — козлоголовый народ Высокого Волда: козья голова, густая шерстяная шуба, ' +
        'рога, по длине которых читается каста'
  },
  elf: {
    en: 'an elf of Fairy — physically much like a human, but pointed ears, small horns or star-shaped ' +
        'pupils give away that they are not one; beautiful by mortal standards, whether kind or cruel',
    ru: 'эльф из Фейри — телом почти как человек, но заострённые уши, рожки или звёздчатые зрачки ' +
        'выдают нечеловека; по меркам смертных прекрасен — что добрый, что злой'
  },
  grimalkin: {
    en: 'a grimalkin in its everyday estray form — a humanoid cat that walks upright, wears clothes ' +
        'and speaks; small, fur over the whole body, and by cat standards either handsome or ugly',
    ru: 'гримолкин в обычном облике эстрея — человекоподобный кот: ходит прямо, носит одежду и говорит; ' +
        'мал ростом, весь в шерсти, по кошачьим меркам либо красавец, либо урод'
  },
  mossling: {
    en: 'a mossling — short, squat and pot-bellied; skin green, yellow or brown and textured like wrinkled ' +
        'bark, patched with mould, lichen, fungi and creeping plants; hair and beard plant-like, mossy green ' +
        'or black, akin to moss, fern or tangled roots; a wounded mossling weeps white sap instead of blood',
    ru: 'мослинг — приземистый, пухлый, с брюшком; кожа зелёная, жёлтая или бурая, текстурой как морщинистая ' +
        'кора, в заплатах плесени, лишайника, грибов и вьющихся растений; волосы и борода растительные, ' +
        'мшисто-зелёные или чёрные — как мох, папоротник или спутанные корни; раненый сочится белым соком'
  },
  woodgrue: {
    en: 'a woodgrue — a bat-faced goblin with huge flapping ears and soft down on head and chest, ' +
        'the rest of the body like a human child’s',
    ru: 'вудгрю — гоблин с мордочкой летучей мыши, огромными хлопающими ушами и мягким пушком на голове ' +
        'и груди; остальное тело как у человеческого ребёнка'
  }
};

/* Тип рода — стр. 30–31. */
var TYPE_NOTE = {
  mortal: {
    en: 'mortal: earthly, bodily, worn by time',
    ru: 'смертный: земной, телесный, тронутый временем'
  },
  fairy: {
    en: 'a fairy: time does not touch them, and unless masked by magic they always carry an aura of the ' +
        'unearthly — mortals find it awesome, intoxicating, frightening or uncanny, and animals are uneasy near them',
    ru: 'фея: время её не касается, и, если не скрыта магией, всегда несёт ауру неземного — смертным она ' +
        'кажется благоговейной, дурманящей, пугающей или жуткой, а животные рядом тревожатся'
  },
  'demi-fey': {
    en: 'demi-fey: fairy blood long settled in the mortal world — ageing now like mortals, but keeping ' +
        'remnants of the innate magic of their fairy ancestors',
    ru: 'полуфейский: фейская кровь, давно осевшая в мире смертных, — стареет как смертный, но хранит ' +
        'остатки врождённой магии предков'
  }
};

/* ================= облик класса (книга) ================= */

var CLASS_LOOK = {
  bard: {
    en: 'a well-travelled musician and poet, keeper of folklore and rumour; light or medium armour, never a shield; never without an instrument',
    ru: 'бывалый музыкант и поэт, хранитель фольклора и слухов; лёгкая или средняя броня, щитов не носит; никогда без инструмента'
  },
  cleric: {
    en: 'a holy warrior sworn to the Pluritine Church, carrying a licence of self-determination that lets them wander; any armour, shields allowed; must wear a holy symbol',
    ru: 'святой воин на службе Плюритинской Церкви с грамотой самостоятельности, позволяющей странствовать; любая броня и щит; обязан носить святой символ'
  },
  enchanter: {
    en: 'a wanderer touched by Fairy, wielding glamours and the fairy runes kept by the lords of Fairy; light or medium armour, no shield',
    ru: 'странник, тронутый Фейри: владеет гламурами и фейскими рунами, что хранят владыки Фейри; лёгкая или средняя броня, без щита'
  },
  fighter: {
    en: 'a mercenary, soldier or brawler turned adventurer, holding the front line; any armour, any weapon',
    ru: 'наёмник, солдат или головорез, ушедший в искатели приключений: держит передний край; любая броня, любое оружие'
  },
  friar: {
    en: 'a wandering mendicant of the Pluritine Church, standing outside the strict hierarchy of the clergy; no armour at all — a plain habit and the traditional tonsure; carries a holy symbol, and by vow of poverty owns no more than can be carried',
    ru: 'странствующий инок Плюритинской Церкви, стоящий вне строгой иерархии клира; брони нет вовсе — простая ряса и традиционная тонзура; при себе святой символ, а по обету бедности — лишь то, что можно унести'
  },
  hunter: {
    en: 'a tracker and trapper at home in the deep wood; light armour and a shield, +1 with any missile weapon; hunters keep trophies of the creatures they have slain and wear them as charms',
    ru: 'следопыт и ловчий, дома в глухой чаще; лёгкая броня и щит, метательное оружие бьёт вернее; трофеи с убитых тварей охотник носит как обереги'
  },
  knight: {
    en: 'a vassal of one of the lesser noble houses and a master of heavily armoured mounted combat; medium or heavy armour and a shield, melee weapons only — missile weapons are held dishonourable; the armour is always the most imposing they can get, light armour being scorned as fit for peasants and villains',
    ru: 'вассал одного из младших знатных домов, мастер тяжёлого конного боя; средняя или тяжёлая броня и щит, только оружие ближнего боя — метательное считает бесчестным; доспех всегда самый внушительный, какой удалось добыть, а лёгкий презирает как удел крестьян и злодеев'
  },
  magician: {
    en: 'a scholar of arcane lore in ritual robes; no armour at all, armed with dagger or staff, the spellbook always to hand',
    ru: 'знаток тайных знаний в ритуальных одеждах; брони нет вовсе, при себе кинжал или посох, книга заклинаний всегда под рукой'
  },
  thief: {
    en: 'a rogue living by trickery and stealth; light armour, never a shield; thieves’ tools on the belt',
    ru: 'плут, живущий обманом и скрытностью; лёгкая броня, щитов не носит; на поясе воровские инструменты'
  }
};

/* Род-класс — приложение, стр. 180–189. */
var KINDRED_CLASS_LOOK = {
  breggle: {
    en: 'an adventuring breggle: a capable fighter who wields both steel and their own horns, and from the fourth level arcane magic besides',
    ru: 'бреггл-искатель приключений: умелый боец, владеющий и сталью, и собственными рогами, а с четвёртого уровня — ещё и тайной магией'
  },
  elf: {
    en: 'an adventuring elf: a mighty warrior with the innate talents of Fairy, arcane scrolls and runic secrets granted by the lords of Fairy',
    ru: 'эльф-искатель приключений: могучий воин с врождёнными талантами уроженца Фейри, тайными свитками и руническими секретами от владык Фейри'
  },
  grimalkin: {
    en: 'an adventuring grimalkin: a capable fighter, often underestimated for their small size, with innate talents including the famous shape-shifting',
    ru: 'гримолкин-искатель приключений: умелый боец, которого недооценивают из-за малого роста, с врождёнными талантами — включая знаменитое оборотничество'
  },
  mossling: {
    en: 'an adventuring mossling: handy with fungi and versed in the closely guarded quasi-magical crafts called knacks',
    ru: 'мослинг-искатель приключений: умеет всё полезное вокруг грибов и владеет тщательно оберегаемыми полумагическими ремёслами — сноровками'
  },
  woodgrue: {
    en: 'an adventuring woodgrue: keen ears, stealth and moon sight make a fine scout, and the capricious enchanted tunes bring anarchic humour to any party',
    ru: 'вудгрю-искатель приключений: отличный слух, умение прятаться и лунное зрение делают его прекрасным разведчиком, а капризные зачарованные песни вносят в отряд нотку анархического юмора'
  }
};

/* Святые символы орденов клирика по-английски — стр. 61.
   В данных символ записан только по-русски, для промпта нужен и английский. */
var ORDER_SYMBOL_EN = {
  faxis: 'three crossed swords',
  sedge: 'a hand with two raised fingers',
  signis: 'a human skull crowned with ivy'
};

/* ================= сборка кусков ================= */

function kindredData(ch) {
  return (ch.kindred && D.KINDREDS[ch.kindred.id]) || null;
}

function levelOf(ch) { return Math.max(1, Number(ch.level) || 1); }

/** Пол так, как он задан на листе; «унисекс» ничего о внешности не утверждает. */
function genderWords(ch) {
  if (ch.gender === 'male') return { en: 'male', ru: 'мужчина' };
  if (ch.gender === 'female') return { en: 'female', ru: 'женщина' };
  return { en: 'gender unstated', ru: 'пол не указан' };
}

/** Рост и вес — из брошенных кубиков; у ручного ввода дюймов может не быть. */
function build(ch) {
  var p = ch.physical || {};
  var en = [], ru = [];
  if (p.heightImperial || p.heightCm) {
    en.push(join([p.heightImperial, p.heightCm && p.heightCm + ' cm'], ' / ') + ' tall');
    ru.push('рост ' + join([p.heightImperial, p.heightCm && p.heightCm + ' см'], ' / '));
  }
  if (p.weightLbs || p.weightKg) {
    en.push(join([p.weightLbs && p.weightLbs + ' lbs', p.weightKg && p.weightKg + ' kg'], ' / '));
    ru.push('вес ' + join([p.weightLbs && p.weightLbs + ' фунтов', p.weightKg && p.weightKg + ' кг'], ' / '));
  }
  if (p.age) {
    var immortal = typeof p.lifespan !== 'number';
    if (immortal && p.lifespan) {
      en.push(p.age + ' years old and untouched by time');
      ru.push(p.age + ' лет, и время его не трогает');
    } else if (p.lifespan) {
      en.push(p.age + ' years old of a lifespan of about ' + p.lifespan);
      ru.push(p.age + ' лет при сроке жизни около ' + p.lifespan);
    } else {
      en.push(p.age + ' years old');
      ru.push(p.age + ' лет');
    }
  }
  return { en: join(en), ru: join(ru) };
}

/** Выпавшие приметы: голова, лицо, тело или шерсть. */
function features(ch) {
  var d = ch.details || {};
  var en = [], ru = [];
  ['head', 'face', 'body', 'fur'].forEach(function (k) {
    if (!d[k]) return;
    en.push((d[k].labelEn || k).toLowerCase() + ' — ' + lc(d[k].en));
    ru.push(String(d[k].label || k).toLowerCase() + ' — ' + lc(d[k].ru));
  });
  return { en: join(en, '; '), ru: join(ru, '; ') };
}

/** Приметы рода, зависящие от уровня и от того, что выпало при создании. */
function kindredExtras(ch) {
  var kin = kindredData(ch);
  var en = [], ru = [];
  if (!kin) return { en: '', ru: '' };

  if (kin.id === 'breggle' && kin.hornsByLevel) {
    var lv = levelOf(ch);
    var length = kin.hornsByLevel[Math.min(lv, kin.hornsByLevel.length) - 1];
    var inches = parseInt(length, 10);
    var longhorn = lv >= (kin.longhornFromLevel || 4);
    en.push('horns ' + inches + (inches === 1 ? ' inch' : ' inches') +
      ' long — ' + (longhorn ? 'a longhorn, recognised among the nobility' : 'a shorthorn commoner'));
    ru.push('рога ' + length + ' — ' + (longhorn ? 'длиннорогий, признанный знатью' : 'простолюдин касты короткорогих'));
  }

  var symb = ch.magic && ch.magic.symbioticFlesh;
  if (symb && symb.length) {
    en.push('symbiotic growth: ' + symb.map(function (s) { return lc(s.en); }).join('; '));
    ru.push('симбиотическая плоть: ' + symb.map(function (s) { return lc(s.ru); }).join('; '));
  }
  return { en: join(en, '. '), ru: join(ru, '. ') };
}

/** Нрав, речь и мировоззрение — как персонаж держится. */
function bearing(ch) {
  var d = ch.details || {};
  var en = [], ru = [];
  if (d.demeanour) { en.push(lc(d.demeanour.en)); ru.push(lc(d.demeanour.ru)); }
  if (d.speech) {
    en.push('a ' + lc(d.speech.en) + ' voice');
    ru.push(lc(d.speech.ru) + ' речь');
  }
  if (ch.alignment) {
    en.push(lc(ch.alignment.en) + ' by alignment');
    ru.push('мировоззрение — ' + lc(ch.alignment.ru));
  }
  return { en: join(en), ru: join(ru) };
}

/** Кто он по призванию: класс или род-класс, плюс всё, что даёт уровень. */
function calling(ch) {
  var prof = ch.profile || {};
  var lv = levelOf(ch);
  var kinId = ch.kindred && ch.kindred.id;
  var look = prof.mode === 'kindredclass'
    ? KINDRED_CLASS_LOOK[kinId]
    : CLASS_LOOK[prof.id];

  var titleEn = 'level ' + lv + ' ' + lc(prof.en || '').replace(' kindred-class', ' (kindred-class)');
  var titleRu = lc(prof.ru || '') + ' ' + lv + ' уровня';

  var en = [titleEn], ru = [titleRu];
  if (look) { en.push(look.en); ru.push(look.ru); }

  /* Рыцарь: герб появляется только с 3 уровня — до того он оруженосец (стр. 70). */
  if (prof.id === 'knight' && ch.liege) {
    if (lv >= 3) {
      en.push('knighted by ' + ch.liege.en + ' and entitled to their coat of arms, usually borne on the shield');
      ru.push('посвящён в рыцари домом ' + trimDot(ch.liege.ru) + ' и вправе носить его герб, обычно на щите');
    } else {
      en.push('still a squire in the service of ' + ch.liege.en + ', not yet a true knight and bearing no coat of arms');
      ru.push('пока оруженосец на службе дома ' + trimDot(ch.liege.ru) + ': настоящим рыцарем ещё не считается и герба не носит');
    }
  }

  /* Клирик: орден и его символ — со 2 уровня (стр. 61). */
  var order = ch.magic && ch.magic.holyOrder;
  if (order) {
    en.push('of ' + order.en + ', whose holy symbol is ' + (ORDER_SYMBOL_EN[order.id] || lc(order.symbol)));
    ru.push('из ордена: ' + trimDot(order.ru) + ', святой символ — ' + lc(order.symbol));
  }

  return { en: join(en, '; '), ru: join(ru, '; ') };
}

/** Настоящее носимое: броня, щит, оружие в руках, снаряжение на себе. */
function carried(ch) {
  var eq = ch.equipment || {};
  var en = [], ru = [];

  if (eq.armour && eq.armour.id && eq.armour.id !== 'none') {
    en.push(lc(eq.armour.en)); ru.push(lc(eq.armour.ru));
  } else {
    en.push('no armour'); ru.push('без брони');
  }
  if (eq.shield) { en.push('a shield'); ru.push('щит'); }

  (eq.weapons || []).forEach(function (w) {
    en.push(lc(w.en || w.ru) + ' in hand');
    ru.push(lc(w.ru) + ' в руках');
  });
  (eq.equipped || []).forEach(function (i) {
    en.push(lc(i.en || i.ru) + ((i.qty || 1) > 1 ? ' ×' + i.qty : ''));
    ru.push(lc(i.ru) + ((i.qty || 1) > 1 ? ' ×' + i.qty : ''));
  });
  if (eq.container) { en.push(lc(eq.container.en)); ru.push(lc(eq.container.ru)); }

  return { en: join(en), ru: join(ru) };
}

/** Лошади, гончие, повозки: их персонаж не несёт, но на картинке они рядом. */
function company(ch) {
  var prop = (ch.equipment && ch.equipment.property) || [];
  if (!prop.length) return { en: '', ru: '' };
  return {
    en: prop.map(function (p) { return lc(p.en) + ((p.qty || 1) > 1 ? ' ×' + p.qty : ''); }).join(', '),
    ru: prop.map(function (p) { return lc(p.ru) + ((p.qty || 1) > 1 ? ' ×' + p.qty : ''); }).join(', ')
  };
}

/** Гламуры, руны, сноровка, книга заклинаний, молитвы. */
function magicSigns(ch) {
  var m = ch.magic || {};
  var en = [], ru = [];
  var runes = (m.lesserRunes || []).concat(m.greaterRunes || []).concat(m.mightyRunes || []);

  if (m.glamours && m.glamours.length) {
    en.push('knows the glamour' + (m.glamours.length > 1 ? 's' : '') + ' ' + m.glamours.map(function (g) { return g.en; }).join(', '));
    ru.push('владеет гламур' + (m.glamours.length > 1 ? 'ами' : 'ом') + ': ' + m.glamours.map(function (g) { return g.ru; }).join(', '));
  }
  if (runes.length) {
    en.push('bears the fairy rune' + (runes.length > 1 ? 's' : '') + ' ' + runes.map(function (r) { return r.en; }).join(', '));
    ru.push('носит фейски' + (runes.length > 1 ? 'е руны' : 'ую руну') + ': ' + runes.map(function (r) { return r.ru; }).join(', '));
  }
  if (m.knack) {
    en.push('mossling knack: ' + m.knack.en);
    ru.push('сноровка мослинга: ' + m.knack.ru);
  }
  if (m.spellBook) {
    en.push('carries the spellbook «' + m.spellBook.en + '»');
    ru.push('при нём книга заклинаний «' + m.spellBook.ru + '»');
  }
  if (m.arcaneSpells && m.arcaneSpells.length) {
    en.push('arcane spells learned: ' + m.arcaneSpells.map(function (s) { return s.en; }).join(', '));
    ru.push('выученные тайные заклинания: ' + m.arcaneSpells.map(function (s) { return s.ru; }).join(', '));
  }
  if (m.holySpells && m.holySpells.length) {
    en.push('prays for: ' + m.holySpells.map(function (s) { return s.en; }).join(', '));
    ru.push('молится о: ' + m.holySpells.map(function (s) { return s.ru; }).join(', '));
  }
  return { en: join(en, '; '), ru: join(ru, '; ') };
}

/** Лунный знак и день рождения. */
function bornUnder(ch) {
  if (!ch.moonSign) return { en: '', ru: '' };
  var phaseEn = { 'растущая': 'waxing', 'полная': 'full', 'убывающая': 'waning' }[ch.moonSign.phase] || ch.moonSign.phase;
  var en = 'the ' + String(ch.moonSign.en || '').replace(/\s*\([WFw]\)$/, '') + ' Moon, ' + phaseEn;
  var ru = ch.moonSign.moon + ' луна, ' + ch.moonSign.phase;
  if (ch.birthday) {
    en += ' — ' + ch.birthday.day + ' ' + ch.birthday.monthEn;
    ru += ' — ' + ch.birthday.day + ' ' + ch.birthday.month;
  }
  return { en: en, ru: ru };
}

/* ================= сам промпт ================= */

function assemble(ch, lang) {
  var kin = ch.kindred || {};
  var style = STYLE[kin.type] || STYLE.mortal;
  var shot = pick(ch, 'shot', style.shot)[lang];
  var palette = pick(ch, 'palette', style.palette)[lang];
  var light = pick(ch, 'light', style.light)[lang];
  var manner = pick(ch, 'manner', style.manner)[lang];
  var scene = pick(ch, 'scene', SCENES)[lang];

  var look = KINDRED_LOOK[kin.id];
  var type = TYPE_NOTE[kin.type];
  var g = genderWords(ch)[lang];
  var L = lang === 'ru';

  var lines = [];
  lines.push(L
    ? 'Портрет персонажа для настольной игры. ' + shot + '.'
    : 'Character portrait for a tabletop roleplaying game. ' + shot + '.');

  lines.push(row(L ? 'Кто' : 'Subject',
    join([look && look[lang], type && type[lang]], '. ')));

  lines.push(row(L ? 'Сложение' : 'Body', join([g, build(ch)[lang]])));
  lines.push(row(L ? 'Приметы' : 'Features', features(ch)[lang]));
  lines.push(row(L ? 'Особые приметы рода' : 'Marks of the kindred', kindredExtras(ch)[lang]));

  var dress = ch.details && ch.details.dress;
  lines.push(row(L ? 'Одежда' : 'Clothing', dress && lc(L ? dress.ru : dress.en)));

  lines.push(row(L ? 'Держится' : 'Bearing', bearing(ch)[lang]));
  lines.push(row(L ? 'Призвание' : 'Calling', calling(ch)[lang]));
  lines.push(row(L ? 'На себе' : 'Wearing and carrying', carried(ch)[lang]));
  lines.push(row(L ? 'Рядом' : 'Accompanied by', company(ch)[lang]));
  lines.push(row(L ? 'Магия' : 'Magic', magicSigns(ch)[lang]));

  lines.push(row(L ? 'Безделушка' : 'Trinket',
    ch.trinket && (L ? ch.trinket.ru : ch.trinket.en)));
  var past = ch.background && trimDot(L ? ch.background.ru : ch.background.en);
  if (past === '—' || past === '-') past = '';
  lines.push(row(L ? 'В прошлом' : 'Past', past && (L ? lc(past) : 'formerly a ' + lc(past))));
  lines.push(row(L ? 'Рождён под знаком' : 'Born under', bornUnder(ch)[lang]));

  lines.push(row(L ? 'Место' : 'Setting', scene));
  lines.push(row(L ? 'Стиль' : 'Style', join([manner, palette, light], '; ')));
  lines.push(L
    ? 'Без текста, подписей и водяных знаков. Ничего современного.'
    : 'No text, no lettering, no watermark. Nothing modern.');

  return lines.filter(Boolean).join('\n');
}

export const portraitPrompt = function (ch) {
  return { en: assemble(ch, 'en'), ru: assemble(ch, 'ru') };
};
