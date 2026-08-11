/* Сравнение строк для поиска по каталогу и справочнику.

   «ё» в русском тексте пишут как придётся: в книге «Верёвка» и «Кошель», а игрок
   набирает «веревка» и «кошель». Поэтому в поиске ё и е — одна буква.
   Без этого часть предметов просто не находилась. */

/** Нижний регистр, ё → е, схлопнутые пробелы. */
export function normalize(text) {
  return String(text == null ? '' : text)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Есть ли в строке всё, что набрал игрок.
 * Запрос режется на слова, и каждое должно найтись — так «верев 50» находит
 * верёвку в 50 футов, а порядок слов не важен.
 */
export function matches(haystack, query) {
  const words = normalize(query).split(' ').filter(Boolean)
  if (!words.length) return true
  const hay = normalize(haystack)
  return words.every((w) => hay.includes(w))
}
