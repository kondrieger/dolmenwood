/* Тултипы для игровых терминов. Использование: DW.T('Спасбросок', 'saving-throw') -> HTML */
(function () {
  'use strict';

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  /** Оборачивает текст в подсказку по ключу глоссария. */
  function T(text, key) {
    if (!DW.GLOSSARY[key]) return esc(text);
    return '<span class="term" data-tip="' + key + '">' + esc(text) + '</span>';
  }

  /** Термин с автоподстановкой заголовка из глоссария. */
  function TT(key) {
    var g = DW.GLOSSARY[key];
    if (!g) return esc(key);
    return T(g.t, key);
  }

  var pop = null;

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.id = 'tip-pop';
    document.body.appendChild(pop);
    return pop;
  }

  function show(el) {
    var key = el.getAttribute('data-tip');
    var g = DW.GLOSSARY[key];
    if (!g) return;
    var p = ensurePop();
    p.innerHTML = '<b>' + esc(g.t) + '</b>' +
      (g.en ? '<div class="tip-en">' + esc(g.en) + '</div>' : '') +
      esc(g.d) +
      (g.p ? '<span class="tip-p">Player’s Book, стр. ' + g.p + '</span>' : '');
    p.classList.add('show');

    var r = el.getBoundingClientRect();
    var sx = window.pageXOffset, sy = window.pageYOffset;
    p.style.left = '0px'; p.style.top = '0px';
    var pw = p.offsetWidth, ph = p.offsetHeight;
    var left = r.left + sx + r.width / 2 - pw / 2;
    left = Math.max(8, Math.min(left, window.innerWidth + sx - pw - 8));
    var top = r.top + sy - ph - 9;
    if (top < sy + 6) top = r.bottom + sy + 9;
    p.style.left = left + 'px';
    p.style.top = top + 'px';
  }

  function hide() { if (pop) pop.classList.remove('show'); }

  document.addEventListener('mouseover', function (e) {
    var el = e.target.closest && e.target.closest('.term[data-tip]');
    if (el) show(el);
  });
  document.addEventListener('mouseout', function (e) {
    var el = e.target.closest && e.target.closest('.term[data-tip]');
    if (el) hide();
  });
  /* На тач-устройствах — по касанию */
  document.addEventListener('click', function (e) {
    var el = e.target.closest && e.target.closest('.term[data-tip]');
    if (el) { e.preventDefault(); show(el); }
    else hide();
  });
  window.addEventListener('scroll', hide, true);

  DW.T = T;
  DW.TT = TT;
  DW.esc = esc;
})();
