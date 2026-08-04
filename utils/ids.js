/* Идентификаторы персонажей.
   Файлы characters/*.json лежат в общем репозитории, поэтому имя должно быть
   и читаемым (видно, кто это), и заведомо неповторимым — даже если два игрока
   заведут тёзок в один и тот же момент. */

const TRANSLIT = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i',
  й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't',
  у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '',
  э: 'e', ю: 'yu', я: 'ya'
}

/** Кириллица в латиницу, всё лишнее — в дефисы. */
export function slugify(text, maxLen = 24) {
  const s = String(text || '')
    .toLowerCase()
    .split('')
    .map((ch) => (TRANSLIT[ch] !== undefined ? TRANSLIT[ch] : ch))
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return s.slice(0, maxLen).replace(/-+$/, '')
}

/** 8 случайных символов из криптостойкого источника. */
function randomSuffix(len = 8) {
  const alphabet = 'abcdefghijkmnpqrstuvwxyz23456789' // без похожих 0/o/1/l
  const out = []
  const buf = new Uint32Array(len)
  if (globalThis.crypto && globalThis.crypto.getRandomValues) {
    globalThis.crypto.getRandomValues(buf)
    for (let i = 0; i < len; i++) out.push(alphabet[buf[i] % alphabet.length])
  } else {
    for (let i = 0; i < len; i++) out.push(alphabet[Math.floor(Math.random() * alphabet.length)])
  }
  return out.join('')
}

/**
 * Строит идентификатор вида `владелец_имя_случайное`, например
 * `syoma_shmold-mould_k3f9a2xt`. По имени файла сразу видно, чей это персонаж.
 * @param {string} owner  игрок, за которым закреплён персонаж
 * @param {string} name   имя персонажа
 * @param {string[]} taken уже занятые идентификаторы
 */
export function newCharacterId(owner, name, taken = []) {
  const base = [slugify(owner, 12) || 'player', slugify(name, 24) || 'char'].join('_')
  for (let i = 0; i < 50; i++) {
    const id = `${base}_${randomSuffix()}`
    if (!taken.includes(id)) return id
  }
  // Практически недостижимо, но пусть будет запасной вариант.
  return `${base}_${Date.now().toString(36)}`
}
