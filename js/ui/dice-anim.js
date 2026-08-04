/* Анимация броска кубиков нужной размерности. */
(function () {
  'use strict';

  function dieClass(sides) {
    if (sides === 4) return 'd4';
    if (sides === 6) return 'd6';
    if (sides === 8) return 'd8';
    if (sides === 10) return 'd10';
    if (sides === 12) return 'd12';
    if (sides === 20) return 'd20';
    if (sides === 100) return 'd100';
    return 'd6';
  }

  /** Создаёт DOM одного кубика. */
  function makeDie(sides, label) {
    var wrap = document.createElement('div');
    wrap.className = 'die-wrap';
    var die = document.createElement('div');
    die.className = 'die ' + dieClass(sides);
    var span = document.createElement('span');
    span.textContent = '?';
    die.appendChild(span);
    wrap.appendChild(die);
    if (label) {
      var l = document.createElement('div');
      l.className = 'die-label';
      l.textContent = label;
      wrap.appendChild(l);
    }
    wrap._die = die; wrap._span = span; wrap._sides = sides;
    return wrap;
  }

  /**
   * Прокатывает набор кубиков в контейнере.
   * group: {sides, results:[...], label, value}
   * Возвращает промис, разрешающийся после «приземления».
   */
  function rollGroup(container, group, opts) {
    opts = opts || {};
    var animate = opts.animate !== false;
    var duration = opts.duration || 620;

    var row = document.createElement('div');
    row.className = 'dice-tray';
    container.appendChild(row);

    var dice = [];
    var isD100 = group.sides === 100;

    if (isD100) {
      /* d100 = два d10: десятки и единицы */
      var w1 = makeDie(10, 'десятки'); var w2 = makeDie(10, 'единицы');
      row.appendChild(w1); row.appendChild(w2);
      dice.push(w1, w2);
    } else {
      group.results.forEach(function (v, i) {
        var w = makeDie(group.sides, group.results.length > 1 ? ('d' + group.sides) : (group.label || ''));
        row.appendChild(w);
        dice.push(w);
      });
    }

    var sum = document.createElement('div');
    sum.className = 'die-sum';
    sum.textContent = '…';
    row.appendChild(sum);

    var caption = null;
    if (group.label && (group.results.length > 1 || isD100)) {
      caption = document.createElement('div');
      caption.className = 'die-label';
      caption.style.alignSelf = 'center';
      caption.textContent = group.label;
      row.appendChild(caption);
    }

    return new Promise(function (resolve) {
      if (!animate) { settle(); return resolve(); }

      dice.forEach(function (w) { w._die.classList.add('rolling'); });
      var iv = setInterval(function () {
        dice.forEach(function (w) {
          w._span.textContent = String(DW.dice.randInt(w._sides) + 1);
        });
      }, 55);

      setTimeout(function () {
        clearInterval(iv);
        settle();
        resolve();
      }, duration);
    });

    function settle() {
      if (isD100) {
        dice[0]._span.textContent = String(group.results[0]);
        dice[1]._span.textContent = String(group.results[1]);
      } else {
        group.results.forEach(function (v, i) {
          if (!dice[i]) return;
          dice[i]._span.textContent = String(v);
          if (group.sides === 20 && v === 20) dice[i]._die.classList.add('crit');
          if (group.sides === 20 && v === 1) dice[i]._die.classList.add('fumble');
        });
      }
      dice.forEach(function (w) {
        w._die.classList.remove('rolling');
        w._die.classList.add('settled');
      });
      sum.textContent = (group.value !== undefined && group.value !== null) ? String(group.value) : '—';
    }
  }

  /**
   * Прокатывает все группы шага одновременно — так шаг занимает столько же
   * времени, сколько один бросок, а не сумму всех.
   */
  function rollSequence(container, groups, opts) {
    opts = opts || {};
    if (!groups || !groups.length) return Promise.resolve();
    var stagger = opts.animate === false ? 0 : (opts.stagger === undefined ? 40 : opts.stagger);
    /* Ряды создаём сразу, чтобы порядок на экране совпадал с порядком бросков. */
    return Promise.all(groups.map(function (g, i) {
      if (!stagger) return rollGroup(container, g, opts);
      var placeholder = document.createElement('div');
      container.appendChild(placeholder);
      return new Promise(function (resolve) {
        setTimeout(function () { rollGroup(placeholder, g, opts).then(resolve); }, i * stagger);
      });
    }));
  }

  DW.diceAnim = { rollGroup: rollGroup, rollSequence: rollSequence, makeDie: makeDie };
})();
