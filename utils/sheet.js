/* Пересчёт производных величин листа и операции со снаряжением.
   Всё, что можно вывести из правил, пересчитывается здесь — руками
   пользователь правит только то, что правилами не определено. */
import * as D from '../data/index.js'
import { Generator } from './generator.js'
import { portraitPrompt } from './portrait.js'
import { priceCp } from './money.js'
import { slugify } from './ids.js'

/** Восстанавливает «профиль» (класс или род-класс) по сохранённому персонажу. */
export function profileOf(ch) {
  const opts = ch.profile.mode === 'kindredclass'
    ? { mode: 'kindredclass', kindred: ch.kindred.id }
    : { mode: 'class', kindred: ch.kindred.id, cls: ch.profile.id }
  return Generator.buildProfile(opts)
}

export function kindredOf(ch) {
  return D.KINDREDS[ch.kindred.id]
}

/** Строка таблицы развития для нужного уровня (1-based). */
export function advancementRow(ch, level) {
  const prof = profileOf(ch)
  const lv = Math.max(1, Math.min(15, level || ch.level || 1))
  return prof.advancement[lv - 1]
}

/**
 * Пересчитывает всё производное: модификаторы, сопротивление магии,
 * модификатор опыта, КБ, вес, скорость, порог следующего уровня.
 * Атаку и спасброски НЕ трогает — их мог поправить Рефери.
 */
export function recompute(ch) {
  const kin = kindredOf(ch)
  const prof = profileOf(ch)

  // Модификаторы характеристик
  ch.mods = {}
  Generator.ABIL.forEach((a) => {
    ch.mods[a] = Generator.abilityMod(Number(ch.abilities[a]) || 0)
  })

  // Сопротивление магии: Мудрость, плюс +2 феям в схеме «род + класс»
  let mr = ch.mods.WIS
  if (prof.mode === 'class' && (kin.id === 'elf' || kin.id === 'grimalkin')) mr += 2
  ch.magicResistance = mr

  // Модификатор опыта
  const lowestPrime = Math.min(...prof.primeAbilities.map((a) => Number(ch.abilities[a]) || 0))
  const primeMod = Generator.primeXpMod(lowestPrime)
  const kindredBonus = kin.id === 'human' && prof.mode === 'class' ? 10 : 0
  ch.xpModifier = primeMod + kindredBonus
  ch.xpModifierBreakdown = {
    prime: primeMod, primeAbility: prof.primeRu, lowestPrimeScore: lowestPrime,
    kindred: kindredBonus, total: ch.xpModifier
  }

  // Класс Брони и нагрузка
  ch.ac = Generator.computeAC(ch, kin, prof, ch.mods)
  ch.speed = Generator.computeSpeed(ch)

  // Порог следующего уровня
  const next = prof.advancement[Math.min(15, (ch.level || 1)) ]
  ch.xpForNextLevel = next ? next[1] : null

  ch.portraitPrompt = portraitPrompt(ch)
  return ch
}

/* ================== Снаряжение ================== */

export function gearEntry(id, qty) {
  const g = D.GEAR[id]
  if (!g) return null
  return {
    id, ru: g.ru, en: g.en, qty: qty || 1, slots: g.slots, weight: g.weight,
    cost: g.cost, cp: priceCp(g), cat: g.cat, page: g.page || null, d: g.d || ''
  }
}

/** Лошадь, гончая или повозка: имущество, а не поклажа — в вес и слоты не идёт. */
export function propertyEntry(kind, id) {
  const src = kind === 'horse' ? D.HORSES : kind === 'hound' ? D.HOUNDS : D.VEHICLES
  const p = src[id]
  if (!p) return null
  return {
    id, kind, ru: p.ru, en: p.en, qty: 1, cp: p.cp, page: p.page || null,
    stat: p.stat || '', d: p.d || '',
    load: p.load ?? null, cargo: p.cargo ?? null, speed: p.speed ?? null, weight: p.weight ?? null
  }
}

export function weaponEntry(id) {
  const w = D.WEAPONS[id]
  if (!w) return null
  return {
    id, kind: 'weapon', ru: w.ru, en: w.en, dmg: w.dmg, size: w.size,
    slots: w.slots, weight: w.weight, cost: w.cost, qual: w.qual, range: w.range || null
  }
}

export function armourEntry(id) {
  const a = D.ARMOUR[id]
  if (!a) return null
  return {
    id, kind: 'armour', ru: a.ru, en: a.en, ac: a.ac, bulk: a.bulk,
    bulkRu: a.bulkRu, slots: a.slots, weight: a.weight, cost: a.cost
  }
}

/** Русские имена разделов каталога. */
export const CAT_RU = {
  weapon: 'Оружие', armour: 'Броня',
  container: 'Ёмкости', light: 'Свет', camp: 'Лагерь', holy: 'Святое',
  tools: 'Инструменты', clothing: 'Одежда', ammo: 'Боеприпасы',
  pipe: 'Трубки', pipeleaf: 'Трубочный лист', herb: 'Грибы и травы',
  drink: 'Напитки', tack: 'Сбруя и корм',
  horse: 'Лошади', hound: 'Гончие', vehicle: 'Повозки и суда'
}

/** Разделы, которые не носят на себе: в вес и слоты не идут. */
export const PROPERTY_CATS = ['horse', 'hound', 'vehicle']

/**
 * Полный каталог книги: всё, что персонаж может купить или взять.
 * carried: false — имущество (лошади, гончие, повозки); оно живёт отдельным
 * списком и не участвует в нагрузке.
 */
export function itemCatalogue() {
  const rows = []
  const push = (r) => rows.push({ carried: true, ...r, cat: CAT_RU[r.catId] || 'Снаряжение' })

  Object.keys(D.WEAPONS).forEach((id) => {
    const w = D.WEAPONS[id]
    push({
      key: 'w:' + id, kind: 'weapon', id, ru: w.ru, en: w.en, catId: 'weapon',
      weight: w.weight, cp: priceCp(w), page: 118,
      note: w.dmg + ' · ' + w.size + (w.range ? ' · ' + w.range + ' футов' : '')
    })
  })
  Object.keys(D.ARMOUR).forEach((id) => {
    if (id === 'none') return
    const a = D.ARMOUR[id]
    push({
      key: 'a:' + id, kind: 'armour', id, ru: a.ru, en: a.en, catId: 'armour',
      weight: a.weight, cp: priceCp(a), page: 118, note: 'КБ ' + a.ac + ' · ' + a.bulkRu
    })
  })
  push({
    key: 'a:shield', kind: 'shield', id: 'shield', ru: D.SHIELD.ru, en: D.SHIELD.en,
    catId: 'armour', weight: D.SHIELD.weight, cp: priceCp(D.SHIELD), page: 118, note: '+1 КБ'
  })

  Object.keys(D.GEAR).forEach((id) => {
    if (id === 'instrument_any') return
    const g = D.GEAR[id]
    const extra = [g.kind, g.type, g.rarity, g.avail && 'доступность ' + g.avail].filter(Boolean).join(' · ')
    push({
      key: 'g:' + id, kind: 'gear', id, ru: g.ru, en: g.en, catId: g.cat,
      weight: g.weight, cp: priceCp(g), page: g.page || null,
      note: [extra, g.sum, g.d].filter(Boolean).join(' — ')
    })
  })

  const property = { horse: D.HORSES, hound: D.HOUNDS, vehicle: D.VEHICLES }
  Object.keys(property).forEach((catId) => {
    Object.keys(property[catId]).forEach((id) => {
      const p = property[catId][id]
      const facts = [
        p.type, p.load != null && 'везёт ' + p.load + ' монет',
        p.cargo != null && 'груз ' + p.cargo + ' монет',
        p.speed != null && 'Скорость ' + p.speed, p.crew
      ].filter(Boolean).join(' · ')
      push({
        key: catId + ':' + id, kind: catId, id, ru: p.ru, en: p.en, catId,
        weight: p.weight ?? null, cp: p.cp, page: p.page || null, carried: false,
        note: [facts, p.stat, p.d].filter(Boolean).join(' — ')
      })
    })
  })
  return rows
}

/** Кладёт предмет в список, складывая одинаковые в стопку. */
function stackInto(list, entry) {
  const same = list.find((x) => x.id === entry.id && x.kind === entry.kind)
  if (same) same.qty = (same.qty || 1) + (entry.qty || 1)
  else list.push(entry)
}

/** Добавляет предмет из каталога. where: 'equipped' | 'stowed'. */
export function addItem(ch, row, where = 'stowed') {
  const eq = ch.equipment
  if (PROPERTY_CATS.includes(row.kind)) {
    // Имущество не носят на себе — оно не участвует в нагрузке.
    if (!eq.property) eq.property = []
    stackInto(eq.property, propertyEntry(row.kind, row.id))
    recompute(ch)
    return ch
  }
  if (row.kind === 'armour') {
    eq.armour = armourEntry(row.id)
  } else if (row.kind === 'shield') {
    eq.shield = { id: 'shield', ru: D.SHIELD.ru, en: D.SHIELD.en, acBonus: 1, slots: 1, weight: D.SHIELD.weight, cost: D.SHIELD.cost }
  } else if (row.kind === 'weapon') {
    // Запасное оружие можно убрать в рюкзак: правила это не запрещают, а нагрузка
    // по весу (стр. 148) считает всё несомое независимо от того, где оно лежит.
    if (where === 'stowed') stackInto(eq.stowed, { ...weaponEntry(row.id), qty: 1 })
    else eq.weapons.push(weaponEntry(row.id))
  } else {
    stackInto(where === 'equipped' ? eq.equipped : eq.stowed, gearEntry(row.id))
  }
  recompute(ch)
  return ch
}

/** Убирает предмет. */
export function removeItem(ch, where, index) {
  const eq = ch.equipment
  if (where === 'armour') eq.armour = armourEntry('none')
  else if (where === 'shield') eq.shield = null
  else if (where === 'weapons') eq.weapons.splice(index, 1)
  else if (where === 'property') {
    const it = (eq.property || [])[index]
    if (it && (it.qty || 1) > 1) it.qty -= 1
    else (eq.property || []).splice(index, 1)
  } else {
    const list = where === 'equipped' ? eq.equipped : eq.stowed
    const it = list[index]
    if (it && (it.qty || 1) > 1) it.qty -= 1
    else list.splice(index, 1)
  }
  recompute(ch)
  return ch
}

/* ============ Правка отдельного предмета ============ */

/** Список, в котором лежит предмет. */
function listFor(ch, where) {
  const eq = ch.equipment
  if (where === 'weapons') return eq.weapons
  if (where === 'equipped') return eq.equipped
  if (where === 'stowed') return eq.stowed
  if (where === 'property') return (eq.property = eq.property || [])
  return null
}

/** Предмет по расположению и номеру. Броня и щит лежат поодиночке. */
export function itemAt(ch, where, index) {
  if (where === 'armour') return ch.equipment.armour
  if (where === 'shield') return ch.equipment.shield
  const list = listFor(ch, where)
  return list ? list[index] : null
}

/** Каноническая запись книги для предмета, или null, если предмет не книжный. */
export function bookEntry(item) {
  if (!item || !item.id) return null
  if (item.kind === 'weapon') return D.WEAPONS[item.id] || null
  if (item.kind === 'armour') return D.ARMOUR[item.id] || null
  if (item.kind === 'shield' || item.id === 'shield') return D.SHIELD
  if (item.kind === 'horse') return D.HORSES[item.id] || null
  if (item.kind === 'hound') return D.HOUNDS[item.id] || null
  if (item.kind === 'vehicle') return D.VEHICLES[item.id] || null
  return D.GEAR[item.id] || null
}

/** Поля, расхождение которых с книгой считается правкой руками. */
const TRACKED = ['ru', 'en', 'weight', 'cp', 'slots', 'dmg']

/** Книжное значение поля; цена приводится к медякам. */
function bookValue(book, field) {
  if (!book) return undefined
  return field === 'cp' ? priceCp(book) : book[field]
}

/** Чем предмет отличается от книги: [{ field, ours, book }]. */
export function divergences(item) {
  const book = bookEntry(item)
  if (!book || item.custom) return []
  return TRACKED
    .map((field) => ({ field, ours: item[field], book: bookValue(book, field) }))
    .filter((x) => x.book !== undefined && x.ours !== undefined && x.ours !== x.book)
}

/**
 * Правит предмет. Если книжное значение изменили руками, ставится пометка
 * edited: Рефери должен видеть, что цифра больше не из книги.
 */
export function updateItem(ch, where, index, patch) {
  const it = itemAt(ch, where, index)
  if (!it) return ch
  Object.assign(it, patch)
  if (it.qty != null) it.qty = Math.max(1, Number(it.qty) || 1)
  if (!it.custom) {
    if (divergences(it).length) it.edited = true
    else delete it.edited
  }
  recompute(ch)
  return ch
}

/** Возвращает предмету книжные значения. */
export function resetToBook(ch, where, index) {
  const it = itemAt(ch, where, index)
  const book = bookEntry(it)
  if (!it || !book) return ch
  TRACKED.forEach((f) => {
    const v = bookValue(book, f)
    if (v !== undefined) it[f] = v
  })
  delete it.edited
  recompute(ch)
  return ch
}

/** Перекладывает предмет в другое место листа. */
export function relocateItem(ch, from, index, to) {
  if (from === to) return ch
  const it = itemAt(ch, from, index)
  if (!it) return ch
  // У оружия свой маршрут между руками и рюкзаком — он в moveItem.
  if ((from === 'weapons' && to === 'stowed') ||
      (from === 'stowed' && to === 'weapons' && it.kind === 'weapon')) {
    return moveItem(ch, from, index)
  }
  const src = listFor(ch, from)
  const dst = listFor(ch, to)
  if (!src || !dst) return ch
  src.splice(index, 1)
  stackInto(dst, it)
  recompute(ch)
  return ch
}

/**
 * Свой предмет, которого нет в книге. Помечается custom, чтобы Рефери
 * сразу видел отсебятину: правила такого предмета не знают.
 */
export function addCustomItem(ch, where, draft) {
  const num = (v) => (v === '' || v == null ? null : Number(v))
  const entry = {
    id: 'custom_' + (slugify(draft.ru || draft.en || '', 20) || 'item') + '_' + Math.random().toString(36).slice(2, 8),
    custom: true,
    ru: draft.ru || 'Без названия',
    en: draft.en || '',
    qty: Math.max(1, Number(draft.qty) || 1),
    weight: num(draft.weight),
    cp: num(draft.cp),
    slots: Number(draft.slots) || 0,
    cat: 'custom',
    d: draft.d || ''
  }
  if (draft.kind === 'weapon') {
    entry.kind = 'weapon'
    entry.dmg = draft.dmg || ''
    entry.size = draft.size || 'Medium'
    entry.qual = draft.qual && draft.qual.length ? draft.qual : ['melee']
    if (where === 'weapons') {
      ch.equipment.weapons.push(entry)
      recompute(ch)
      return ch
    }
  }
  stackInto(listFor(ch, where) || ch.equipment.stowed, entry)
  recompute(ch)
  return ch
}

/**
 * Переносит предмет между «на себе» и «в рюкзаке».
 * from: 'equipped' | 'stowed' | 'weapons'.
 *
 * Оружие живёт отдельно от прочего снаряжения: в руках оно лежит в eq.weapons,
 * потому что оттуда берутся атаки, а убранное — в eq.stowed вместе со всем
 * остальным. Поэтому перенос оружия ходит между этими двумя списками, минуя
 * eq.equipped.
 */
export function moveItem(ch, from, index) {
  const eq = ch.equipment

  if (from === 'weapons') {
    const w = eq.weapons[index]
    if (!w) return ch
    eq.weapons.splice(index, 1)
    stackInto(eq.stowed, { ...w, qty: 1 })
    recompute(ch)
    return ch
  }

  const src = from === 'equipped' ? eq.equipped : eq.stowed
  const it = src[index]
  if (!it) return ch

  if (from === 'stowed' && it.kind === 'weapon') {
    if ((it.qty || 1) > 1) it.qty -= 1
    else src.splice(index, 1)
    eq.weapons.push(weaponEntry(it.id))
    recompute(ch)
    return ch
  }

  src.splice(index, 1)
  stackInto(from === 'equipped' ? eq.stowed : eq.equipped, it)
  recompute(ch)
  return ch
}
