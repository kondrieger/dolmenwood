/* Каталог сохранённых персонажей. */
(function () {
  'use strict';
  var esc = DW.esc;

  var STATUS = {
    alive:   { ru: 'Жив',      cls: 'alive' },
    dead:    { ru: 'Погиб',    cls: 'dead' },
    retired: { ru: 'На покое', cls: 'retired' }
  };

  function render(root) {
    var list = DW.store.all();
    var alive = list.filter(function (c) { return c.status === 'alive'; });
    var rest = list.filter(function (c) { return c.status !== 'alive'; });

    root.innerHTML = '' +
      '<div class="card">' +
        '<div class="card-head">' +
          '<h2>Каталог персонажей</h2>' +
          '<div class="btn-row">' +
            '<button class="small" id="btn-export">⬇ Скачать весь каталог (JSON)</button>' +
            '<button class="small" id="btn-import">⬆ Загрузить JSON</button>' +
            (DW.PRESETS && DW.PRESETS.shmold && !DW.store.get(DW.PRESETS.shmold.id)
              ? '<button class="small" id="btn-preset">🍄 Добавить Шмолда Молда</button>' : '') +
            '<a class="btn small" href="#/generate">＋ Новый персонаж</a>' +
          '</div>' +
        '</div>' +
        '<p class="muted" style="margin:0">Всего: ' + list.length + ' · живых: ' + alive.length + ' · остальных: ' + rest.length +
        '. Хранится в памяти этого браузера. Скачивай JSON, чтобы не потерять и чтобы показать гейм-мастеру.</p>' +
        '<input type="file" id="file-import" accept="application/json,.json" style="display:none">' +
      '</div>' +
      (list.length === 0
        ? '<div class="card empty"><div class="big">🍂</div><p>Пока никого. Тропа ждёт.</p><a class="btn btn-primary" href="#/generate">Создать первого персонажа</a></div>'
        : (section('Активные', alive) + section('Погибшие и ушедшие на покой', rest)));

    root.querySelector('#btn-export').onclick = function () {
      if (!DW.store.all().length) { DW.toast('Каталог пуст'); return; }
      DW.store.exportAll(); DW.toast('Файл каталога скачан');
    };
    var pb = root.querySelector('#btn-preset');
    if (pb) pb.onclick = function () {
      var ch = DW.PRESETS.shmold.build();
      DW.store.save(ch);
      DW.toast('Шмолд Молд добавлен');
      location.hash = '#/char/' + ch.id;
    };

    var fi = root.querySelector('#file-import');
    root.querySelector('#btn-import').onclick = function () { fi.click(); };
    fi.onchange = function () {
      var f = fi.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var r = DW.store.importJson(rd.result);
          DW.toast('Загружено: новых ' + r.added + ', обновлено ' + r.updated);
          render(root);
        } catch (e) { alert('Не удалось загрузить: ' + e.message); }
      };
      rd.readAsText(f, 'utf-8');
      fi.value = '';
    };

    /* Обработчик вешаем ровно один раз на весь контейнер: он переживает перерисовки.
       Раньше он добавлялся при каждой перерисовке, и одно нажатие «Удалить»
       срабатывало столько раз, сколько было перерисовок. */
    if (!root._dwCatalogBound) {
      root._dwCatalogBound = true;
      root.addEventListener('click', function (e) {
        var b = e.target.closest('[data-act]');
        if (!b) return;
        e.preventDefault();
        var id = b.getAttribute('data-id');
        var act = b.getAttribute('data-act');
        if (act === 'del') {
          var ch = DW.store.get(id);
          if (!ch) { render(root); return; }
          if (confirm('Удалить «' + (ch.name ? ch.name.ru : id) + '» безвозвратно?\n\nОтменить будет нельзя. Если персонаж ещё может пригодиться — сначала скачай JSON.')) {
            DW.store.remove(id);
            render(root);
            DW.toast('Персонаж удалён');
          }
        } else if (act === 'status') {
          DW.store.setStatus(id, b.getAttribute('data-val'));
          render(root);
        } else if (act === 'export') {
          var c = DW.store.get(id);
          if (c) { DW.store.exportOne(c); DW.toast('Файл скачан'); }
        }
      });
    }
  }

  function section(title, list) {
    if (!list.length) return '';
    return '<h2 style="margin:22px 0 12px">' + esc(title) + '</h2><div class="cat-grid">' +
      list.map(card).join('') + '</div>';
  }

  function card(c) {
    var st = STATUS[c.status] || STATUS.alive;
    var when = c.generatedAt ? new Date(c.generatedAt).toLocaleDateString('ru-RU') : '';
    return '<div class="cat-card' + (c.status === 'dead' ? ' is-dead' : '') + '">' +
      '<div style="display:flex;justify-content:space-between;align-items:start;gap:8px">' +
        '<h3><a href="#/char/' + esc(c.id) + '">' + esc(c.name ? c.name.ru : 'Без имени') + '</a></h3>' +
        '<span class="badge ' + st.cls + '">' + st.ru + '</span>' +
      '</div>' +
      '<div class="who">' + esc(c.kindred.ru) + ' · ' + esc(c.profile.ru) + ' · ' + c.level + ' ур. · ' + esc(c.alignment.ru) + '</div>' +
      '<div class="mini">' +
        '<span>ХП <b>' + c.hp.max + '</b></span>' +
        '<span>КБ <b>' + c.ac.value + '</b></span>' +
        '<span>Атака <b>' + DW.Generator.fmtMod(c.attack) + '</b></span>' +
        '<span>Скор. <b>' + c.speed.value + '</b></span>' +
      '</div>' +
      '<div class="btn-row">' +
        '<a class="btn small" href="#/char/' + esc(c.id) + '">Открыть лист</a>' +
        '<button class="small" data-act="export" data-id="' + esc(c.id) + '">JSON</button>' +
        (c.status === 'alive'
          ? '<button class="small danger" data-act="status" data-val="dead" data-id="' + esc(c.id) + '">Погиб</button>'
          : '<button class="small" data-act="status" data-val="alive" data-id="' + esc(c.id) + '">Вернуть в строй</button>') +
        '<button class="small danger" data-act="del" data-id="' + esc(c.id) + '">✕</button>' +
      '</div>' +
      (when ? '<div class="muted" style="margin-top:8px;font-size:.74rem;font-family:var(--font-ui)">Создан ' + when + '</div>' : '') +
      '</div>';
  }

  DW.views = DW.views || {};
  DW.views.catalog = render;
})();
