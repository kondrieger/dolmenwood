/* Честные броски костей.
   Используется crypto.getRandomValues с отбраковкой (rejection sampling),
   чтобы не было смещения от остатка по модулю. Каждый бросок пишется в журнал. */
(function () {
  'use strict';

  /* globalThis.crypto есть и в браузере, и в Node 18+ — так модуль работает везде. */
  var crypt = globalThis.crypto;

  function randInt(max) { // 0..max-1, равномерно
    if (crypt && crypt.getRandomValues) {
      var limit = Math.floor(4294967296 / max) * max;
      var arr = new Uint32Array(1);
      var v;
      do { crypt.getRandomValues(arr); v = arr[0]; } while (v >= limit);
      return v % max;
    }
    return Math.floor(Math.random() * max);
  }

  function die(sides) { return randInt(sides) + 1; }

  /** Бросок nDs (+mod). Возвращает {dice, sides, n, mod, total} */
  function roll(n, sides, mod) {
    var dice = [], i, sum = 0;
    for (i = 0; i < n; i++) { var d = die(sides); dice.push(d); sum += d; }
    mod = mod || 0;
    return { n: n, sides: sides, dice: dice, mod: mod, total: sum + mod, sum: sum };
  }

  /** Разбирает строку вида "3d6", "2d10", "1d100" и бросает её. */
  function rollNotation(notation, mult) {
    var m = /^(\d+)d(\d+)$/i.exec(String(notation).trim());
    if (!m) return { n: 0, sides: 0, dice: [], mod: 0, total: 0, sum: 0 };
    var r = roll(parseInt(m[1], 10), parseInt(m[2], 10), 0);
    if (mult && mult !== 1) { r.mult = mult; r.total = r.sum * mult; }
    return r;
  }

  /** d100: два d10 (десятки и единицы), 00 = 100 — как в книге, стр. 15. */
  function rollD100() {
    var tens = randInt(10);   // 0..9
    var ones = randInt(10);   // 0..9
    var val = tens * 10 + ones;
    if (val === 0) val = 100;
    return { n: 2, sides: 10, dice: [tens, ones], mod: 0, total: val, sum: val, isD100: true };
  }

  /* ===== Журнал бросков ===== */
  function RollLog() { this.entries = []; }

  RollLog.prototype.record = function (step, label, result, extra) {
    var e = {
      i: this.entries.length + 1,
      step: step,
      label: label,
      notation: (result.isD100 ? 'd100' : result.n + 'd' + result.sides) + (result.mult ? '×' + result.mult : ''),
      dice: result.dice.slice(),
      total: result.total
    };
    if (extra) { for (var k in extra) if (extra.hasOwnProperty(k)) e[k] = extra[k]; }
    this.entries.push(e);
    return e;
  };

  RollLog.prototype.note = function (step, label, text) {
    this.entries.push({ i: this.entries.length + 1, step: step, label: label, notation: '—', dice: [], total: null, result: text, manual: true });
  };

  /** Бросок + запись в журнал одним вызовом. */
  RollLog.prototype.roll = function (step, label, n, sides, mod, extra) {
    var r = roll(n, sides, mod);
    this.record(step, label, r, extra);
    return r;
  };
  RollLog.prototype.rollNotation = function (step, label, notation, mult, extra) {
    var r = rollNotation(notation, mult);
    this.record(step, label, r, extra);
    return r;
  };
  RollLog.prototype.rollD100 = function (step, label, extra) {
    var r = rollD100();
    this.record(step, label, r, extra);
    return r;
  };

  /** Выбор случайной записи из массива с записью броска в журнал. */
  RollLog.prototype.pick = function (step, label, arr, sides) {
    sides = sides || arr.length;
    var r = this.roll(step, label, 1, sides);
    var item = arr[r.total - 1];
    var last = this.entries[this.entries.length - 1];
    last.result = item ? (item.ru || item.en || String(item)) : '';
    return { item: item, roll: r };
  };

  /** Выбор из таблицы с диапазонами [{from,to,...}] по d100. */
  RollLog.prototype.pickRange = function (step, label, table) {
    var r = this.rollD100(step, label);
    var item = null;
    for (var i = 0; i < table.length; i++) {
      if (r.total >= table[i].from && r.total <= table[i].to) { item = table[i]; break; }
    }
    if (!item) item = table[table.length - 1];
    var last = this.entries[this.entries.length - 1];
    last.result = item.ru || item.en || '';
    return { item: item, roll: r };
  };

  /** Выбор по d6-диапазонам [{r:[a,b], ...}]. */
  RollLog.prototype.pickD6Range = function (step, label, table, sides) {
    var r = this.roll(step, label, 1, sides || 6);
    var item = null;
    for (var i = 0; i < table.length; i++) {
      if (r.total >= table[i].r[0] && r.total <= table[i].r[1]) { item = table[i]; break; }
    }
    return { item: item, roll: r };
  };

  DW.dice = {
    randInt: randInt,
    die: die,
    roll: roll,
    rollNotation: rollNotation,
    rollD100: rollD100,
    RollLog: RollLog,
    /** Перемешивание массива (Фишер–Йейтс) на честном ГСЧ. */
    shuffle: function (arr) {
      var a = arr.slice(), i, j, t;
      for (i = a.length - 1; i > 0; i--) { j = randInt(i + 1); t = a[i]; a[i] = a[j]; a[j] = t; }
      return a;
    }
  };
})();
