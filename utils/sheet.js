/* Пересчёт производных величин листа и операции со снаряжением.
   Всё, что можно вывести из правил, пересчитывается здесь — руками
   пользователь правит только то, что правилами не определено. */
import * as D from '../data/index.js'
import { Generator } from './generator.js'
import { portraitPrompt } from './portrait.js'

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
  return { id, ru: g.ru, en: g.en, qty: qty || 1, slots: g.slots, weight: g.weight, cost: g.cost, cat: g.cat, d: g.d || '' }
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

/** Полный каталог предметов книги для выбора. */
export function itemCatalogue() {
  const rows = []
  Object.keys(D.WEAPONS).forEach((id) => {
    const w = D.WEAPONS[id]
    rows.push({
      key: 'w:' + id, kind: 'weapon', id, ru: w.ru, en: w.en,
      cat: 'Оружие', catId: 'weapon', weight: w.weight, cost: w.cost,
      note: w.dmg + ' · ' + w.size + (w.range ? ' · ' + w.range + ' футов' : '')
    })
  })
  Object.keys(D.ARMOUR).forEach((id) => {
    if (id === 'none') return
    const a = D.ARMOUR[id]
    rows.push({
      key: 'a:' + id, kind: 'armour', id, ru: a.ru, en: a.en,
      cat: 'Броня', catId: 'armour', weight: a.weight, cost: a.cost,
      note: 'КБ ' + a.ac + ' · ' + a.bulkRu
    })
  })
  rows.push({
    key: 'a:shield', kind: 'shield', id: 'shield', ru: D.SHIELD.ru, en: D.SHIELD.en,
    cat: 'Броня', catId: 'armour', weight: D.SHIELD.weight, cost: D.SHIELD.cost, note: '+1 КБ'
  })
  const CAT_RU = {
    container: 'Ёмкости', light: 'Свет', camp: 'Лагерь', holy: 'Святое',
    tools: 'Инструменты', clothing: 'Одежда', ammo: 'Боеприпасы'
  }
  Object.keys(D.GEAR).forEach((id) => {
    if (id === 'instrument_any') return
    const g = D.GEAR[id]
    rows.push({
      key: 'g:' + id, kind: 'gear', id, ru: g.ru, en: g.en,
      cat: CAT_RU[g.cat] || 'Снаряжение', catId: g.cat,
      weight: g.weight, cost: g.cost, note: g.d || ''
    })
  })
  return rows
}

/** Добавляет предмет из каталога. where: 'equipped' | 'stowed'. */
export function addItem(ch, row, where = 'stowed') {
  const eq = ch.equipment
  if (row.kind === 'armour') {
    eq.armour = armourEntry(row.id)
  } else if (row.kind === 'shield') {
    eq.shield = { id: 'shield', ru: D.SHIELD.ru, en: D.SHIELD.en, acBonus: 1, slots: 1, weight: D.SHIELD.weight, cost: D.SHIELD.cost }
  } else if (row.kind === 'weapon') {
    eq.weapons.push(weaponEntry(row.id))
  } else {
    const list = where === 'equipped' ? eq.equipped : eq.stowed
    const existing = list.find((x) => x.id === row.id)
    if (existing) existing.qty = (existing.qty || 1) + 1
    else list.push(gearEntry(row.id))
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
  else {
    const list = where === 'equipped' ? eq.equipped : eq.stowed
    const it = list[index]
    if (it && (it.qty || 1) > 1) it.qty -= 1
    else list.splice(index, 1)
  }
  recompute(ch)
  return ch
}

/** Переносит предмет между «на себе» и «в рюкзаке». */
export function moveItem(ch, from, index) {
  const eq = ch.equipment
  const src = from === 'equipped' ? eq.equipped : eq.stowed
  const dst = from === 'equipped' ? eq.stowed : eq.equipped
  const it = src[index]
  if (!it) return ch
  src.splice(index, 1)
  const same = dst.find((x) => x.id === it.id)
  if (same) same.qty = (same.qty || 1) + (it.qty || 1)
  else dst.push(it)
  recompute(ch)
  return ch
}
