/* Роутер и оболочка приложения. */
(function () {
  'use strict';

  var root, toastEl;

  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastEl._t);
    toastEl._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }
  DW.toast = toast;

  function parseHash() {
    var h = location.hash.replace(/^#\/?/, '');
    var parts = h.split('/').filter(Boolean);
    if (!parts.length) return { view: 'generate' };
    if (parts[0] === 'char' && parts[1]) return { view: 'character', id: decodeURIComponent(parts[1]) };
    if (parts[0] === 'catalog') return { view: 'catalog' };
    if (parts[0] === 'rules') return { view: 'rules' };
    return { view: 'generate' };
  }

  function setActiveNav(view) {
    document.querySelectorAll('.nav a').forEach(function (a) {
      var v = a.getAttribute('data-view');
      a.classList.toggle('active', v === view || (view === 'character' && v === 'catalog'));
    });
  }

  function route() {
    var r = parseHash();
    setActiveNav(r.view);
    window.scrollTo(0, 0);
    if (r.view === 'catalog') DW.views.catalog(root);
    else if (r.view === 'character') DW.views.character(root, r.id);
    else if (r.view === 'rules') DW.views.rules(root);
    else DW.views.generator(root);
  }

  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem('dolmenwood.theme'); } catch (e) { /* нет доступа */ }
    document.documentElement.setAttribute('data-theme', saved || 'dark');
  }
  function toggleTheme() {
    var cur = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('dolmenwood.theme', next); } catch (e) { /* нет доступа */ }
  }

  function init() {
    initTheme();
    root = document.getElementById('view');
    var tb = document.getElementById('btn-theme');
    if (tb) tb.onclick = toggleTheme;
    window.addEventListener('hashchange', route);
    route();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
