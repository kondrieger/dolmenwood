/* Dolmenwood Character Forge — вспомогательные функции для таблиц данных.
   Формат таблиц: одна строка = одна запись, «Русский ~ English original».
   Все данные взяты из Dolmenwood Player's Book (Necrotic Gnome, версия 6 августа 2024). */

(function (global) {
  'use strict';

  /** Разбирает многострочный текст «ru ~ en» в массив {ru, en}. */
  function tbl(str) {
    return str
      .trim()
      .split('\n')
      .map(function (line) {
        var parts = line.split('~');
        return {
          ru: (parts[0] || '').trim(),
          en: (parts[1] || '').trim()
        };
      })
      .filter(function (e) { return e.ru.length > 0; });
  }

  /** Разбирает список имён (4 колонки: муж ~ жен ~ унисекс ~ фамилия), каждая как «ru|en». */
  function names(str) {
    var male = [], female = [], unisex = [], surname = [];
    str.trim().split('\n').forEach(function (line) {
      var cols = line.split('~').map(function (s) { return s.trim(); });
      function pair(c) {
        if (!c) return null;
        var p = c.split('|');
        return { ru: (p[0] || '').trim(), en: (p[1] || p[0] || '').trim() };
      }
      if (pair(cols[0])) male.push(pair(cols[0]));
      if (pair(cols[1])) female.push(pair(cols[1]));
      if (pair(cols[2])) unisex.push(pair(cols[2]));
      if (pair(cols[3])) surname.push(pair(cols[3]));
    });
    return { male: male, female: female, unisex: unisex, surname: surname };
  }

  /** Таблица d100 вида «01-02 запись»: принимает 50 строк, каждая покрывает 2% */
  function d100pairs(str) {
    var rows = tbl(str);
    return rows.map(function (e, i) {
      return { from: i * 2 + 1, to: i * 2 + 2, ru: e.ru, en: e.en };
    });
  }

  global.DW = global.DW || {};
  global.DW.tbl = tbl;
  global.DW.names = names;
  global.DW.d100pairs = d100pairs;
})(window);
