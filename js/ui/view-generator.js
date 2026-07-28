/* Экран генерации персонажа. */
(function () {
  'use strict';
  var esc = DW.esc, T = DW.T;

  var state = null;   // текущие настройки
  var running = false;
  var lastResult = null;

  function opts() {
    if (!state) state = DW.store.settings();
    return state;
  }

  function render(root) {
    var o = opts();
    root.innerHTML = '' +
      '<div class="card">' +
        '<div class="card-head"><h2>Кузница персонажей</h2>' +
        '<button class="small" id="btn-help">Как это работает?</button></div>' +
        '<div id="help-box" style="display:none" class="callout">' +
          '<p>Каждое значение получается настоящим броском кубика через криптографический генератор случайных чисел браузера. ' +
          'Все броски записываются в журнал, который уходит в JSON — гейм-мастер увидит, что именно выпало на каждом шаге, ' +
          'и сможет проверить, что ты ничего не придумал.</p>' +
          '<p class="muted" style="margin-bottom:0">Правила: Dolmenwood Player’s Book, версия 6 августа 2024. Ссылки на страницы указаны у каждого шага.</p>' +
        '</div>' +
        '<div class="grid two" style="margin-top:14px">' +
          '<div>' +
            '<label class="field"><span>Схема создания</span></label>' +
            '<div class="chips" id="mode-chips">' +
              chip('mode', 'class', 'Род + класс', o.mode === 'class') +
              chip('mode', 'kindredclass', 'Род-класс (приложение)', o.mode === 'kindredclass') +
            '</div>' +
            '<p class="muted" style="margin-top:8px;font-size:.84rem" id="mode-hint"></p>' +
          '</div>' +
          '<div>' +
            '<label class="field"><span>Настройки бросков</span></label>' +
            '<select id="sel-method">' +
              optn('3d6-in-order', '3d6 по порядку — как в книге', o.abilityMethod) +
              optn('4d6-drop-lowest', '4d6, отбросить худшую (домашнее правило)', o.abilityMethod) +
            '</select>' +
            '<div style="height:8px"></div>' +
            '<select id="sel-gender">' +
              optn('any', 'Пол — случайно', o.gender) +
              optn('male', 'Мужской', o.gender) +
              optn('female', 'Женский', o.gender) +
              optn('unisex', 'Унисекс-имя', o.gender) +
            '</select>' +
            '<div style="height:10px"></div>' +
            '<label class="check"><input type="checkbox" id="chk-moon"' + (o.moonSign ? ' checked' : '') + '> Бросать ' + T('лунный знак', 'moon-sign') + ' (необязательное правило)</label>' +
            '<label class="check"><input type="checkbox" id="chk-anim"' + (o.animate ? ' checked' : '') + '> Анимация кубиков</label>' +
          '</div>' +
        '</div>' +
        '<hr class="rule">' +
        '<label class="field"><span>Род <span class="en">Kindred</span></span></label>' +
        '<div class="chips" id="kin-chips">' + kindredChips(o) + '</div>' +
        '<div id="kin-desc" class="muted" style="margin-top:9px;font-size:.88rem"></div>' +
        '<div id="class-block">' +
          '<hr class="rule">' +
          '<label class="field"><span>Класс <span class="en">Class</span></span></label>' +
          '<div class="chips" id="cls-chips">' + classChips(o) + '</div>' +
          '<div id="cls-desc" class="muted" style="margin-top:9px;font-size:.88rem"></div>' +
        '</div>' +
        '<hr class="rule">' +
        '<div class="btn-row">' +
          '<button class="primary" id="btn-gen" style="font-size:1rem;padding:12px 28px">🎲 Сгенерировать персонажа</button>' +
          '<button id="btn-random">Случайный род и класс</button>' +
        '</div>' +
      '</div>' +
      '<div id="gen-out"></div>';

    root.querySelector('#btn-help').onclick = function () {
      var b = root.querySelector('#help-box');
      b.style.display = b.style.display === 'none' ? 'block' : 'none';
    };
    bindChips(root, '#mode-chips', 'mode', function (v) { state.mode = v; persist(); render(root); });
    bindChips(root, '#kin-chips', 'kindred', function (v) { state.kindred = v; fixClass(); persist(); render(root); });
    bindChips(root, '#cls-chips', 'cls', function (v) { state.cls = v; persist(); render(root); });

    root.querySelector('#sel-method').onchange = function () { state.abilityMethod = this.value; persist(); };
    root.querySelector('#sel-gender').onchange = function () { state.gender = this.value; persist(); };
    root.querySelector('#chk-moon').onchange = function () { state.moonSign = this.checked; persist(); };
    root.querySelector('#chk-anim').onchange = function () { state.animate = this.checked; persist(); };

    root.querySelector('#btn-gen').onclick = function () { run(root); };
    root.querySelector('#btn-random').onclick = function () {
      var pool = state.mode === 'kindredclass' ? DW.KINDRED_CLASS_ORDER : DW.KINDRED_ORDER;
      state.kindred = pool[DW.dice.randInt(pool.length)];
      if (state.mode === 'class') {
        var ok = DW.CLASS_ORDER.filter(function (c) { return DW.Generator.classAllowedFor(state.kindred, c).ok; });
        state.cls = ok[DW.dice.randInt(ok.length)];
      }
      persist(); render(root);
      root.querySelector('#btn-gen').scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    /* Описания */
    var kin = DW.KINDREDS[state.kindred];
    root.querySelector('#kin-desc').innerHTML = '<b>' + esc(kin.ru) + '</b> — ' + esc(kin.tagline) +
      ' <span class="en">' + esc(kin.en) + '</span><br>' +
      esc(kin.classAdvice);
    root.querySelector('#mode-hint').innerHTML = state.mode === 'class'
      ? 'Классическая схема книги: сначала род (даёт особые черты), затем класс (даёт профессию). Больше возможностей, но и больше правил.'
      : 'Схема из приложения (стр. 180+): род и класс слиты в один архетип. Черты рода из основной части книги при этом <b>не действуют</b>. Проще в игре. У людей род-класса нет.';

    var cb = root.querySelector('#class-block');
    if (state.mode === 'kindredclass') { cb.style.display = 'none'; }
    else {
      cb.style.display = '';
      var c = DW.CLASSES[state.cls];
      var allowed = DW.Generator.classAllowedFor(state.kindred, state.cls);
      root.querySelector('#cls-desc').innerHTML = '<b>' + esc(c.ru) + '</b> — ' + esc(c.tagline) +
        ' <span class="en">' + esc(c.en) + '</span><br>' +
        'Хиты ' + c.hitDie + ' · ' + esc(c.aptitudeRu) + ' подготовка · главные характеристики: ' + esc(c.primeRu) + '<br>' +
        'Броня: ' + esc(c.armour) + '. Оружие: ' + esc(c.weapons) + '.' +
        (allowed.ok ? '' : '<br><b style="color:var(--blood)">' + esc(allowed.why) + '</b>');
      root.querySelector('#btn-gen').disabled = !allowed.ok;
    }
  }

  function fixClass() {
    if (state.mode === 'kindredclass') {
      if (DW.KINDRED_CLASS_ORDER.indexOf(state.kindred) < 0) state.kindred = 'mossling';
      return;
    }
    if (!DW.Generator.classAllowedFor(state.kindred, state.cls).ok) {
      var ok = DW.CLASS_ORDER.filter(function (c) { return DW.Generator.classAllowedFor(state.kindred, c).ok; });
      state.cls = ok[0];
    }
  }

  function kindredChips(o) {
    var pool = o.mode === 'kindredclass' ? DW.KINDRED_CLASS_ORDER : DW.KINDRED_ORDER;
    if (o.mode === 'kindredclass' && pool.indexOf(o.kindred) < 0) { state.kindred = pool[0]; o = state; }
    return pool.map(function (id) {
      var k = DW.KINDREDS[id];
      return chip('kindred', id, k.ru, o.kindred === id);
    }).join('');
  }

  function classChips(o) {
    return DW.CLASS_ORDER.map(function (id) {
      var c = DW.CLASSES[id];
      var allowed = DW.Generator.classAllowedFor(o.kindred, id);
      return '<button class="chip' + (o.cls === id ? ' on' : '') + (allowed.ok ? '' : ' disabled') +
        '" data-k="cls" data-v="' + id + '"' + (allowed.ok ? '' : ' disabled title="' + esc(allowed.why) + '"') + '>' +
        esc(c.ru) + '</button>';
    }).join('');
  }

  function chip(k, v, label, on) {
    return '<button class="chip' + (on ? ' on' : '') + '" data-k="' + k + '" data-v="' + v + '">' + esc(label) + '</button>';
  }
  function optn(v, label, cur) {
    return '<option value="' + v + '"' + (cur === v ? ' selected' : '') + '>' + esc(label) + '</option>';
  }
  function bindChips(root, sel, key, cb) {
    var box = root.querySelector(sel);
    if (!box) return;
    box.addEventListener('click', function (e) {
      var b = e.target.closest('.chip');
      if (!b || b.disabled) return;
      cb(b.getAttribute('data-v'));
    });
  }
  function persist() { DW.store.saveSettings(state); }

  /* ================= Прогон генерации ================= */
  function run(root) {
    if (running) return;
    running = true;
    var out = root.querySelector('#gen-out');
    out.innerHTML = '<div class="card"><h2>Бросаем кости…</h2><div id="steps"></div></div>';
    var stepsBox = out.querySelector('#steps');
    root.querySelector('#btn-gen').disabled = true;

    var res;
    try {
      res = DW.Generator.generate({
        mode: state.mode,
        kindred: state.kindred,
        cls: state.cls,
        abilityMethod: state.abilityMethod,
        gender: state.gender,
        moonSign: state.moonSign
      });
    } catch (e) {
      out.innerHTML = '<div class="card"><h2 style="color:var(--blood)">Ошибка генерации</h2><pre class="json">' + esc(e.stack || e.message) + '</pre></div>';
      running = false;
      root.querySelector('#btn-gen').disabled = false;
      return;
    }
    lastResult = res;

    var animate = state.animate !== false;
    var i = 0;
    function nextStep() {
      if (i >= res.steps.length) { finish(out, res, root); return; }
      var s = res.steps[i++];
      var el = document.createElement('div');
      el.className = 'step';
      el.innerHTML = '<h3>' + esc(s.title) + '</h3>' +
        (s.subtitle ? '<div class="sub">' + esc(s.subtitle) + '</div>' : '') +
        '<div class="tray"></div>';
      stepsBox.appendChild(el);
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      var tray = el.querySelector('.tray');
      DW.diceAnim.rollSequence(tray, s.dice || [], { animate: animate, duration: animate ? 560 : 0 })
        .then(function () {
          if (s.lines && s.lines.length) {
            var ul = document.createElement('ul');
            ul.innerHTML = s.lines.map(function (l) { return '<li>' + esc(l) + '</li>'; }).join('');
            el.appendChild(ul);
          }
          if (s.warn) {
            var w = document.createElement('div');
            w.className = 'warn';
            w.textContent = s.warn;
            el.appendChild(w);
          }
          setTimeout(nextStep, animate ? 260 : 0);
        });
    }
    nextStep();
  }

  function finish(out, res, root) {
    running = false;
    root.querySelector('#btn-gen').disabled = false;
    var ch = res.character;

    var box = document.createElement('div');
    box.className = 'card';
    box.innerHTML =
      '<h2>' + esc(ch.name.ru) + '</h2>' +
      '<p class="dim">' + esc(ch.kindred.ru) + ' · ' + esc(ch.profile.ru) + ' · 1 уровень · ' + esc(ch.alignment.ru) + '<br>' +
      '<span class="en">' + esc(ch.name.en) + ' — ' + esc(ch.kindred.en) + ' ' + esc(ch.profile.en) + '</span></p>' +
      '<div class="stat-row" style="margin:14px 0">' +
        DW.Generator.ABIL.map(function (a) {
          return '<div class="stat"><div class="k">' + esc(DW.Generator.ABIL_RU[a]) + '</div>' +
            '<div class="v">' + ch.abilities[a] + '</div>' +
            '<div class="m">' + DW.Generator.fmtMod(ch.mods[a]) + '</div></div>';
        }).join('') +
      '</div>' +
      '<div class="stat-row">' +
        '<div class="stat"><div class="k">Хиты</div><div class="v">' + ch.hp.max + '</div></div>' +
        '<div class="stat"><div class="k">КБ</div><div class="v">' + ch.ac.value + '</div></div>' +
        '<div class="stat"><div class="k">Атака</div><div class="v">' + DW.Generator.fmtMod(ch.attack) + '</div></div>' +
        '<div class="stat"><div class="k">Скорость</div><div class="v">' + ch.speed.value + '</div></div>' +
        '<div class="stat"><div class="k">Золото</div><div class="v">' + ch.gold + '</div></div>' +
      '</div>' +
      '<hr class="rule">' +
      '<div class="btn-row">' +
        '<button class="primary" id="btn-save">💾 Сохранить в каталог и открыть лист</button>' +
        '<button id="btn-again">🎲 Перебросить заново</button>' +
      '</div>' +
      '<p class="muted" style="margin:10px 0 0;font-size:.84rem">Контрольная сумма бросков: <span class="mono">' + esc(ch.checksum) + '</span> — по ней гейм-мастер поймёт, что журнал не подменяли после генерации.</p>';
    out.appendChild(box);
    box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    box.querySelector('#btn-save').onclick = function () {
      DW.store.save(ch);
      DW.toast('Персонаж сохранён');
      location.hash = '#/char/' + ch.id;
    };
    box.querySelector('#btn-again').onclick = function () {
      out.innerHTML = '';
      run(root);
    };
  }

  DW.views = DW.views || {};
  DW.views.generator = render;
})();
