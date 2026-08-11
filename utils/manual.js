/* Ручное создание персонажа: сборка листа из заполненных полей
   и проверка на соответствие Player's Book.
   Всё, что правила выводят сами (модификаторы, атака, спасброски, навыки,
   пороги опыта, КБ, вес), не спрашивается, а считается. */
import * as D from '../data/index.js'
import { Generator } from './generator.js'
import { portraitPrompt } from './portrait.js'
import { recompute } from './sheet.js'
import { newCharacterId } from './ids.js'

export const ABIL = Generator.ABIL

/** Пустая заготовка для формы. */
export function emptyDraft() {
  return {
    owner: '',
    mode: 'class',
    kindred: 'human',
    cls: 'fighter',
    level: 1,
    xp: 0,
    nameRu: '',
    nameEn: '',
    gender: 'male',
    alignment: 'Neutral',
    backgroundRu: '',
    backgroundEn: '',
    abilities: { STR: 10, INT: 10, WIS: 10, DEX: 10, CON: 10, CHA: 10 },
    hpMax: null,
    gold: 0,
    /* Особые дары */
    glamours: [],
    lesserRunes: [],
    greaterRunes: [],
    mightyRunes: [],
    knack: '',
    symbiotic: [],
    spellBook: '',
    /* Выученные тайные заклинания — для тех, у кого есть слоты, но нет
       стартовой книги (бреггл-род-класс с 4 уровня, стр. 181). */
    arcaneSpells: [],
    holyOrder: '',
    combatTalents: [],
    liege: null,
    /* Внешность и прочее.
       fur нужен брегглам и гримолкинам: у них вместо таблицы «Тело» таблица «Шерсть». */
    details: { head: '', face: '', body: '', fur: '', speech: '', demeanour: '', dress: '', desires: '', beliefs: '' },
    /* Безделушка рода — при генерации бросается по d100 (стр. 34) */
    trinket: { ru: '', en: '', roll: null },
    physical: { age: null, lifespan: null, heightCm: null, weightKg: null },
    moonSign: '',
    extraLanguages: [],
    notes: ''
  }
}

export function profileFor(draft) {
  return Generator.buildProfile(
    draft.mode === 'kindredclass'
      ? { mode: 'kindredclass', kindred: draft.kindred }
      : { mode: 'class', kindred: draft.kindred, cls: draft.cls }
  )
}

/** Сколько гламуров положено на этом уровне (класс плюс род). */
export function glamourQuota(draft) {
  const prof = profileFor(draft)
  const kin = D.KINDREDS[draft.kindred]
  let n = 0
  if (prof.glamoursByLevel) n += prof.glamoursByLevel[Math.min(15, draft.level) - 1] || 0
  else n += prof.grantsGlamours || 0
  if (prof.mode === 'class' && (kin.id === 'elf' || kin.id === 'grimalkin')) n += 1
  return n
}

/** Сколько черт симбиотической плоти положено: по одной за уровень. */
export function symbioticQuota(draft) {
  const prof = profileFor(draft)
  const kin = D.KINDREDS[draft.kindred]
  const applies = prof.grantsSymbiotic || (prof.mode === 'class' && kin.id === 'mossling')
  return applies ? draft.level : 0
}

/** Сколько боевых талантов положено воину. */
export function talentQuota(draft) {
  const prof = profileFor(draft)
  return prof.talentsByLevel ? prof.talentsByLevel[Math.min(15, draft.level) - 1] || 0 : 0
}

/** Допустимый разброс хитов для уровня (стр. 16, 25). */
export function hpRange(draft) {
  const prof = profileFor(draft)
  const die = Number(String(prof.hitDie).slice(1))
  const conMod = Generator.abilityMod(Number(draft.abilities.CON) || 0)
  let min = 0
  let max = 0
  for (let lv = 1; lv <= draft.level; lv++) {
    if (lv <= 10) {
      min += Math.max(1, 1 + conMod)
      max += Math.max(1, die + conMod)
    } else {
      // После 10 уровня прибавка фиксированная, Телосложение уже не влияет.
      min += prof.hpAfter10 || 1
      max += prof.hpAfter10 || 1
    }
  }
  return { min, max, die, conMod }
}

/** Языки: родные плюс классовые плюс дополнительные за высокий Интеллект. */
export function languageQuota(draft) {
  const intMod = Generator.abilityMod(Number(draft.abilities.INT) || 0)
  return Math.max(0, intMod)
}

/* ================== Проверки по книге ================== */

/**
 * Есть ли у персонажа слоты тайных заклинаний без стартовой книги.
 * Так устроен бреггл-род-класс: с 4 уровня слоты появляются, но книга не даётся —
 * заклинания он учит у наставника, из найденных книг или исследованием (стр. 181).
 * У мага наоборот: книга есть, и заклинания берутся из неё.
 */
export function arcaneKnownAllowed(draft) {
  const prof = profileFor(draft)
  if (prof.magicType !== 'arcane' || prof.grantsSpellBook || !prof.spellsPerDay) return 0
  const row = prof.spellsPerDay[Math.min(15, Math.max(1, draft.level)) - 1]
  return row ? row[0] : 0
}

/**
 * Какие блоки выбора должна показать форма для этого персонажа.
 * Один список на форму и на проверку: если правила что-то дают, а блока тут нет —
 * значит игроку негде это указать.
 */
export function giftBlocks(draft) {
  const prof = profileFor(draft)
  const kin = D.KINDREDS[draft.kindred]
  return [
    glamourQuota(draft) > 0 && 'glamours',
    prof.grantsLesserRune && 'runes',
    (prof.grantsKnack || (prof.mode === 'class' && kin.id === 'mossling')) && 'knack',
    symbioticQuota(draft) > 0 && 'symbiotic',
    talentQuota(draft) > 0 && 'talents',
    prof.grantsSpellBook && 'spellbook',
    arcaneKnownAllowed(draft) > 0 && 'arcane',
    prof.id === 'cleric' && draft.level >= 2 && 'holyorder',
    prof.needsLiege && 'liege'
  ].filter(Boolean)
}

export function checkDraft(draft) {
  const issues = []
  const prof = profileFor(draft)
  const kin = D.KINDREDS[draft.kindred]
  const add = (level, what, note) => issues.push({ level, what, note })

  if (draft.mode === 'class') {
    const ok = Generator.classAllowedFor(draft.kindred, draft.cls)
    if (!ok.ok) add('error', 'Недопустимое сочетание рода и класса', ok.why)
  } else if (!D.KINDRED_CLASS_ORDER.includes(draft.kindred)) {
    add('error', 'У этого рода нет род-класса', 'Род-классы есть только у бреггла, эльфа, гримолкина, мослинга и вудгрю (стр. 180+).')
  }

  if (!draft.nameRu.trim()) add('error', 'Не заполнено имя', 'Без имени персонажа не сохранить.')

  if (!draft.owner) {
    add('error', 'Не выбран игрок',
      'Каждый персонаж закрепляется за игроком: файлы лежат в общем репозитории, и по владельцу видно, чей это лист.')
  }

  ABIL.forEach((a) => {
    const v = Number(draft.abilities[a])
    if (!(v >= 3 && v <= 18)) {
      add('error', 'Характеристика вне диапазона: ' + Generator.ABIL_RU[a],
        'Значения характеристик в книге от 3 до 18 (стр. 16).')
    }
  })

  if (prof.noChaotic && draft.alignment === 'Chaotic') {
    add('error', 'Мировоззрение запрещено классу',
      prof.ru + ' не может быть Хаотичным: служители Церкви теряют благодать (стр. 60, 66).')
  }
  if (prof.needsLiege && draft.liege && draft.liege.al !== draft.alignment) {
    add('warn', 'Мировоззрение не совпадает с сюзереном',
      'Рыцарь обязан иметь то же мировоззрение, что и его сюзерен (стр. 70). У ' + draft.liege.ru + ' — ' + draft.liege.al + '.')
  }
  if (prof.needsLiege && !draft.liege) {
    add('warn', 'Не выбран сюзерен', 'Рыцарь служит одному из младших благородных домов (стр. 70).')
  }

  /* Безделушка есть у каждого персонажа при создании (стр. 34), но за игру её
     могли потерять, продать или проесть — потому замечание, а не ошибка. */
  if (!draft.trinket || !String(draft.trinket.ru || '').trim()) {
    add('info', 'Не указана безделушка',
      'При создании персонаж получает безделушку рода по броску d100 (стр. 34). ' +
      'Если она была потеряна или продана — так и оставь.')
  }

  const hp = hpRange(draft)
  if (draft.hpMax == null || draft.hpMax === '') {
    add('error', 'Не заполнены хиты', 'Укажи максимум хитов.')
  } else if (draft.hpMax < hp.min || draft.hpMax > hp.max) {
    add('warn', 'Хиты вне возможного разброса',
      'Для ' + draft.level + ' уровня с костью ' + prof.hitDie + ' и Телосложением ' +
      Generator.fmtMod(hp.conMod) + ' сумма может быть от ' + hp.min + ' до ' + hp.max + '. У тебя ' + draft.hpMax + '.')
  }

  const row = prof.advancement[Math.min(15, draft.level) - 1]
  const prevRow = draft.level > 1 ? prof.advancement[draft.level - 2] : null
  if (prevRow && draft.xp < row[1]) {
    add('warn', 'Опыта меньше, чем нужно для уровня',
      draft.level + ' уровень наступает на ' + row[1].toLocaleString('ru-RU') + ' XP, а указано ' + Number(draft.xp).toLocaleString('ru-RU') + '.')
  }

  const gq = glamourQuota(draft)
  if (gq !== draft.glamours.length) {
    add(draft.glamours.length > gq ? 'error' : 'warn', 'Число гламуров не сходится',
      'На ' + draft.level + ' уровне положено ' + gq + ', выбрано ' + draft.glamours.length + ' (стр. 63, 93).')
  }
  const sq = symbioticQuota(draft)
  if (sq !== draft.symbiotic.length) {
    add(draft.symbiotic.length > sq ? 'error' : 'warn', 'Число черт симбиотической плоти не сходится',
      'По одной на каждый уровень, включая первый: положено ' + sq + ', выбрано ' + draft.symbiotic.length + ' (стр. 49, 187).')
  }
  const tq = talentQuota(draft)
  if (tq !== draft.combatTalents.length) {
    add(draft.combatTalents.length > tq ? 'error' : 'warn', 'Число боевых талантов не сходится',
      'Воин получает талант на 2, 6, 10 и 14 уровнях: положено ' + tq + ', выбрано ' + draft.combatTalents.length + ' (стр. 64).')
  }

  const needsKnack = prof.grantsKnack || (prof.mode === 'class' && kin.id === 'mossling')
  if (needsKnack && !draft.knack) {
    add('warn', 'Не выбрана сноровка', 'Каждый мослинг знает одну сноровку (стр. 112).')
  }
  if (prof.grantsSpellBook && !draft.spellBook) {
    add('warn', 'Не выбрана книга заклинаний', 'Маг 1 уровня начинает с одной книгой (стр. 72).')
  }
  if (prof.grantsLesserRune && !draft.lesserRunes.length && !draft.greaterRunes.length && !draft.mightyRunes.length) {
    add('warn', 'Не выбрано ни одной руны', 'На 1 уровне даётся одна малая руна, дальше — по броску за уровень (стр. 92).')
  }
  if (prof.id === 'cleric' && draft.level >= 2 && !draft.holyOrder) {
    add('warn', 'Не выбран святой орден', 'Клирик вступает в орден на 2 уровне (стр. 61).')
  }

  const lq = languageQuota(draft)
  if (draft.extraLanguages.length !== lq) {
    add(draft.extraLanguages.length > lq ? 'error' : 'info', 'Дополнительные языки',
      'Положительный модификатор Интеллекта даёт ровно столько дополнительных языков: положено ' + lq +
      ', выбрано ' + draft.extraLanguages.length + ' (стр. 23).')
  }

  if (kin.type === 'fairy' && draft.moonSign) {
    add('warn', 'У фей не бывает лунного знака',
      'Лунным знакам подвержены только рождённые в смертном мире — смертные и полуфейские (стр. 174).')
  }

  return issues
}

/* ================== Сборка персонажа ================== */

export function buildCharacter(draft, takenIds = []) {
  const prof = profileFor(draft)
  const kin = D.KINDREDS[draft.kindred]
  const level = Math.min(15, Math.max(1, Number(draft.level) || 1))
  const row = prof.advancement[level - 1]

  const abilities = {}
  ABIL.forEach((a) => { abilities[a] = Number(draft.abilities[a]) || 0 })

  /* Навыки: базовые плюс улучшения от рода, класса и род-класса */
  const skills = { listen: 6, search: 6, survival: 6 }
  if (kin.id === 'elf') { skills.listen = 5; skills.search = 5 }
  if (kin.id === 'grimalkin' || kin.id === 'woodgrue') skills.listen = 5
  if (kin.id === 'mossling') skills.survivalForaging = 5
  if (prof.id === 'friar') skills.survivalForaging = 5
  const classSkills = (prof.skills || []).map((s) => ({
    ru: s.ru, en: s.en, target: s.targets[level - 1], d: s.d || ''
  }))
  classSkills.forEach((s) => {
    if (s.en === 'Listen') skills.listen = Math.min(skills.listen, s.target)
    if (s.en === 'Search') skills.search = Math.min(skills.search, s.target)
    if (s.en === 'Survival') skills.survival = Math.min(skills.survival, s.target)
  })

  const languages = kin.languages.slice()
  ;(prof.bonusLanguages || []).forEach((l) => languages.push(l))
  draft.extraLanguages.forEach((en) => {
    const l = D.COMMON_LANGUAGES.find((x) => x.en === en)
    if (l && !languages.some((x) => x.en === l.en)) languages.push({ ru: l.ru, en: l.en })
  })

  /* Набор таблиц примет у родов разный: у бреггла и гримолкина вместо «Тела»
     идёт «Шерсть». Поэтому идём по таблицам самого рода, а не по общему списку,
     и подписи берём оттуда же. */
  const details = {}
  Object.keys(kin.details).forEach((k) => {
    const table = kin.details[k]
    const chosenEn = draft.details[k]
    if (!chosenEn) return
    const item = table.items.find((x) => x.en === chosenEn)
    details[k] = { label: table.ru, labelEn: table.en, ru: item ? item.ru : chosenEn, en: chosenEn }
  })

  const align = Generator.ALIGNMENTS[draft.alignment] || Generator.ALIGNMENTS.Neutral

  const magic = {}
  if (draft.glamours.length) {
    magic.glamours = draft.glamours.map((en) => D.GLAMOURS.find((g) => g.en === en)).filter(Boolean)
  }
  if (draft.lesserRunes.length) magic.lesserRunes = draft.lesserRunes.map((en) => D.LESSER_RUNES.find((r) => r.en === en)).filter(Boolean)
  if (draft.greaterRunes.length) magic.greaterRunes = draft.greaterRunes.map((en) => D.GREATER_RUNES.find((r) => r.en === en)).filter(Boolean)
  if (draft.mightyRunes.length) magic.mightyRunes = draft.mightyRunes.map((en) => D.MIGHTY_RUNES.find((r) => r.en === en)).filter(Boolean)
  if (draft.knack) magic.knack = D.KNACKS.find((k) => k.en === draft.knack)
  if (draft.symbiotic.length) {
    magic.symbioticFlesh = draft.symbiotic.map((en) => kin.symbioticFlesh.find((s) => s.en === en)).filter(Boolean)
  }
  if (draft.spellBook) {
    const book = D.SPELL_BOOKS.find((b) => b.en === draft.spellBook)
    if (book) {
      magic.spellBook = {
        ru: book.ru, en: book.en,
        spells: book.spells.map((id) => {
          const s = D.ARCANE_R1[id]
          return { id, ru: s.ru, en: s.en, rank: 1, dur: s.dur, range: s.range, d: s.d }
        })
      }
    }
  }
  if (draft.arcaneSpells && draft.arcaneSpells.length) {
    magic.arcaneSpells = draft.arcaneSpells
      .map((id) => {
        const s = D.ARCANE_R1[id]
        return s ? { id, ru: s.ru, en: s.en, rank: 1, dur: s.dur, range: s.range, d: s.d } : null
      })
      .filter(Boolean)
  }
  if (draft.holyOrder) magic.holyOrder = D.HOLY_ORDERS.find((o) => o.id === draft.holyOrder)
  if (prof.spellsPerDay) magic.spellsPerDay = prof.spellsPerDay[level - 1]

  const moon = draft.moonSign ? D.MOON_SIGNS.find((s) => s.moonEn === draft.moonSign) : null

  const ch = {
    schema: 'dolmenwood-character/1',
    id: newCharacterId(draft.owner, draft.nameRu, takenIds),
    owner: draft.owner,
    generatedAt: new Date().toISOString(),
    source: "Dolmenwood Player's Book (Necrotic Gnome, 6 Aug 2024)",
    origin: 'Внесён вручную через форму — броски не производились',
    options: { mode: draft.mode, abilityMethod: 'manual-entry', moonSignRule: !!moon, gender: draft.gender },
    level,
    xp: Number(draft.xp) || 0,
    status: 'alive',

    kindred: { id: kin.id, ru: kin.ru, en: kin.en, type: kin.type, typeRu: kin.typeRu, size: kin.size, sizeRu: kin.sizeRu, page: kin.page },
    profile: {
      mode: prof.mode, id: prof.id, ru: prof.ru, en: prof.en,
      primeAbilities: prof.primeAbilities, primeRu: prof.primeRu,
      hitDie: prof.hitDie, aptitude: prof.aptitude, aptitudeRu: prof.aptitudeRu,
      armour: prof.armour, weapons: prof.weapons, page: prof.page
    },

    abilities,
    abilitiesRolled: { ...abilities },
    mods: {},
    attack: row[3],
    saves: { doom: row[4], ray: row[5], hold: row[6], blast: row[7], spell: row[8] },
    hp: { max: Number(draft.hpMax) || 1, current: Number(draft.hpMax) || 1, die: prof.hitDie, roll: null, conMod: Generator.abilityMod(abilities.CON) },

    skills: { basic: skills, class: classSkills },
    languages,
    traits: { kindred: prof.mode === 'class' ? kin.traits : [], class: prof.traits },
    magic,
    combatTalents: draft.combatTalents
      .map((en) => (prof.combatTalents || []).find((t) => t.en === en))
      .filter(Boolean)
      .map((t) => ({ ru: t.ru, en: t.en, d: t.d })),
    liege: draft.liege || undefined,

    alignment: { ru: align.ru, en: align.en, d: align.d, rolled: false },
    name: {
      ru: draft.nameRu.trim(),
      en: (draft.nameEn || draft.nameRu).trim(),
      first: { ru: draft.nameRu.trim(), en: (draft.nameEn || draft.nameRu).trim() },
      surname: null
    },
    gender: draft.gender,
    background: { ru: draft.backgroundRu || '—', en: draft.backgroundEn || draft.backgroundRu || '—' },
    details,
    physical: {
      age: Number(draft.physical.age) || null,
      lifespan: Number(draft.physical.lifespan) || null,
      heightCm: Number(draft.physical.heightCm) || null,
      weightKg: Number(draft.physical.weightKg) || null
    },
    moonSign: moon ? { moon: moon.moon, phase: moon.phase, en: moon.moonEn, d: moon.d } : null,

    gold: Number(draft.gold) || 0,
    coins: { copper: 0, silver: 0, gold: Number(draft.gold) || 0, pellucidium: 0 },
    /* Безделушка рода (стр. 34). Прочерк значит, что игрок её не указал —
       персонаж мог её потерять, продать или просто не помнить. */
    trinket: {
      ru: (draft.trinket && draft.trinket.ru) || '—',
      en: (draft.trinket && draft.trinket.en) || '—',
      roll: (draft.trinket && draft.trinket.roll) || null
    },

    equipment: {
      armour: { id: 'none', kind: 'armour', ru: D.ARMOUR.none.ru, en: D.ARMOUR.none.en, ac: 10, bulk: 'none', bulkRu: '—', slots: 0, weight: 0, cost: 0 },
      shield: null,
      weapons: [],
      equipped: [],
      stowed: [],
      container: null,
      adventuringItems: []
    },

    notes: draft.notes || '',
    validation: [],
    log: [{
      i: 1, step: 'manual', label: 'Внесено вручную', notation: '—', dice: [], total: null, manual: true,
      result: 'Персонаж заполнен через форму ручного ввода: броски не производились. ' +
        'Числа, выводимые правилами (атака, спасброски, навыки, пороги опыта, КБ и вес), посчитаны приложением по таблицам книги.'
    }]
  }

  /* Замечания проверки сохраняем в лист, чтобы гейм-мастер их видел. */
  ch.validation = checkDraft(draft).map((i) => ({
    level: i.level === 'error' ? 'warn' : i.level === 'info' ? 'info' : i.level,
    what: i.what,
    sheet: 'Введено вручную',
    book: i.note
  }))

  recompute(ch)
  ch.checksum = Generator.checksum(ch)
  ch.portraitPrompt = portraitPrompt(ch)
  return ch
}
