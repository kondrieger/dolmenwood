/* Справочник: общие правила, таблицы снаряжения, мир, глоссарий. */
(function () {
  'use strict';
  var esc = DW.esc, T = DW.T;

  function render(root) {
    root.innerHTML =
      '<div class="card"><h2>Справочник</h2>' +
      '<p class="muted" style="margin:0">Выжимка из Dolmenwood Player’s Book для быстрого поиска за столом. Термины с пунктиром объясняются по наведению.</p></div>' +
      coreRules() + hazards() + gearTables() + world() + glossary();
  }

  function coreRules() {
    return '<div class="card cheat"><h2>Основные правила</h2>' +
      '<details open><summary>Четыре типа бросков</summary><div class="body">' +
        '<table class="tbl"><thead><tr><th>Бросок</th><th>Кость</th><th>Успех</th><th>Модификаторы</th></tr></thead><tbody>' +
        '<tr><td>' + T('Проверка навыка', 'skill-check') + '</td><td>1d6</td><td>≥ цели навыка</td><td>Ситуативные −2…+2</td></tr>' +
        '<tr><td>' + T('Проверка характеристики', 'ability-check') + '</td><td>1d6</td><td>≥ 4</td><td>Модификатор характеристики, ситуативные −2…+2</td></tr>' +
        '<tr><td>' + T('Спасбросок', 'saving-throw') + '</td><td>1d20</td><td>≥ цели спасброска</td><td>Мудрость (против магии), ситуативные −4…+4</td></tr>' +
        '<tr><td>' + T('Бросок атаки', 'attack-roll') + '</td><td>1d20</td><td>≥ КБ цели</td><td>Атака класса, Сила (ближний) или Ловкость (стрелковый)</td></tr>' +
        '</tbody></table>' +
        '<p class="muted">Натуральные 1 и 6 на d6, натуральные 1 и 20 на d20 — всегда провал и всегда успех, что бы ни говорили модификаторы.</p>' +
      '</div></details>' +
      '<details><summary>Модификаторы характеристик</summary><div class="body">' +
        '<table class="tbl compact"><thead><tr><th>Значение</th><th>Модификатор</th></tr></thead><tbody>' +
        '<tr><td>3</td><td>−3</td></tr><tr><td>4–5</td><td>−2</td></tr><tr><td>6–8</td><td>−1</td></tr>' +
        '<tr><td>9–12</td><td>нет</td></tr><tr><td>13–15</td><td>+1</td></tr><tr><td>16–17</td><td>+2</td></tr><tr><td>18</td><td>+3</td></tr>' +
        '</tbody></table>' +
        '<p><b>Модификатор опыта</b> за ' + T('главную характеристику', 'prime-ability') + ': 3–5 → −20%; 6–8 → −10%; 9–12 → 0; 13–15 → +5%; 16–18 → +10%.</p>' +
      '</div></details>' +
      '<details><summary>Время, движение и нагрузка</summary><div class="body">' +
        '<p><b>' + T('Раунд', 'round') + '</b> ≈ 10 секунд (бой). <b>' + T('Ход', 'turn') + '</b> ≈ 10 минут (подземелье), 6 ходов в часу, 60 раундов в ходе.</p>' +
        '<table class="tbl compact"><thead><tr><th>Ситуация</th><th>Расстояние</th></tr></thead><tbody>' +
        '<tr><td>Бой (за раунд)</td><td>Скорость в футах</td></tr>' +
        '<tr><td>В ближнем бою</td><td>Половина Скорости</td></tr>' +
        '<tr><td>Исследование (за ход)</td><td>Скорость ×3 футов</td></tr>' +
        '<tr><td>Знакомая местность (за ход)</td><td>Скорость ×10 футов</td></tr>' +
        '<tr><td>Бег (за раунд)</td><td>Скорость ×3 футов</td></tr>' +
        '<tr><td>Путешествие (за день)</td><td>Скорость ÷5 очков пути</td></tr>' +
        '</tbody></table>' +
        '<p><b>' + T('Слотовая нагрузка', 'encumbrance') + ':</b> 10 слотов «на себе» и по 10 в каждом контейнере (максимум 16 сложенных).</p>' +
        '<table class="tbl compact"><thead><tr><th>На себе</th><th>Сложено</th><th>Скорость</th></tr></thead><tbody>' +
        '<tr><td>0–3</td><td>0–10</td><td>40</td></tr><tr><td>4–5</td><td>11–12</td><td>30</td></tr>' +
        '<tr><td>6–7</td><td>13–14</td><td>20</td></tr><tr><td>8–10</td><td>15–16</td><td>10</td></tr>' +
        '</tbody></table>' +
        '<p class="muted">Одежда — 0 слотов. Лёгкая броня 1, Средняя 2, Тяжёлая 3, щит 1. Одноручное оружие 1, двуручное 2, стрелковое 1, боеприпасы 1. Громоздкое (шест, бочка, сундук) — 2. До 100 монет или самоцветов — 1.</p>' +
      '</div></details>' +
      '<details><summary>Встреча и бой — порядок действий</summary><div class="body">' +
        '<p><b>Встреча:</b> осведомлённость → ' + T('внезапность', 'surprise') + ' (1d6, при 1–2 застигнут) → дистанция (подземелье 2d6×10 футов, снаружи 2d6×30) → ' + T('инициатива', 'initiative') + ' → действия.</p>' +
        '<p><b>' + T('Реакция', 'reaction') + '</b> (2d6 + Харизма говорящего): 2− атакуют · 3–5 враждебны · 6–8 насторожены · 9–11 безразличны, можно договориться · 12+ дружелюбны.</p>' +
        '<p><b>Раунд боя:</b> 1) объявления (заклинание, руна, бегство) → 2) инициатива 1d6 за сторону → 3) сторона-победитель: движение, стрельба, магия, ближний бой → 4) остальные стороны → 5) ' + T('Мораль', 'morale') + '.</p>' +
        '<p><b>Модификаторы атаки:</b> ближний бой — Сила (и к урону); стрелковый — Ловкость (не к урону); атака сзади отменяет бонус щита; короткая дистанция +1, длинная −1; частичное укрытие от −1 до −4.</p>' +
      '</div></details></div>';
  }

  function hazards() {
    return '<div class="card cheat"><h2>Опасности и обычные ситуации</h2>' +
      '<details><summary>Темнота, свет, холод</summary><div class="body">' +
        '<p><b>Тусклый свет:</b> −2 к атакам, половина Скорости. <b>Полная тьма или слепота:</b> −4 к атакам, КБ и спасброскам, Скорость 10.</p>' +
        '<p>Факел: свет 30 футов, горит 1 час (6 ходов). Фонарь: 30 футов, флакон масла на 4 часа. Свеча: 5 футов, 1 час.</p>' +
        '<p><b>Холод</b> без подходящей защиты (зимний плащ) — 1d4 хита в день.</p>' +
      '</div></details>' +
      '<details><summary>Двери, лазание, прыжки, падение</summary><div class="body">' +
        '<p><b>Выбить дверь</b> — проверка Силы. <b>Прислушаться к двери</b> — проверка навыка Слушать.</p>' +
        '<p><b>Лазание:</b> простое — без броска; в напряжённой обстановке — проверка Ловкости. Провал = падение с середины, 1d6 урона за каждые 10 футов.</p>' +
        '<p><b>Прыжок</b> — проверка Силы.</p>' +
      '</div></details>' +
      '<details><summary>Что умеют все искатели приключений без бросков</summary><div class="body">' +
        '<p>Разбить лагерь и развести огонь · ездить верхом и ухаживать за лошадью · шагами измерить расстояние и нарисовать карту · ' +
        'бросить и завязать верёвку · держаться на воде и проплыть немного · собрать вещи и проложить маршрут · оценить самоцветы и предметы искусства.</p>' +
      '</div></details>' +
      '<details><summary>Особые металлы</summary><div class="body">' +
        '<p><b>' + T('Холодное железо', 'cold-iron') + ':</b> вдвое дороже. +1 урона феям и полуфейским, −1 всем остальным.</p>' +
        '<p><b>Серебро:</b> в десять раз дороже. Урон обычный, но некоторых тварей можно ранить только серебром (или магией).</p>' +
      '</div></details></div>';
  }

  function gearTables() {
    var w = Object.keys(DW.WEAPONS).map(function (k) { return DW.WEAPONS[k]; });
    var a = ['none', 'leather', 'bark', 'chainmail', 'pinecone', 'platemail', 'fullplate'].map(function (k) { return DW.ARMOUR[k]; });
    return '<div class="card cheat"><h2>Таблицы снаряжения</h2>' +
      '<details><summary>Оружие</summary><div class="body">' +
        '<table class="tbl compact"><thead><tr><th>Оружие</th><th>Цена</th><th>Урон</th><th>Размер</th><th>Особенности</th></tr></thead><tbody>' +
        w.map(function (x) {
          return '<tr><td><b>' + esc(x.ru) + '</b> <span class="en">' + esc(x.en) + '</span></td><td>' + x.cost + ' зм</td><td class="mono">' + x.dmg + '</td>' +
            '<td>' + esc(x.size) + '</td><td class="muted" style="font-size:.78rem">' + esc((x.qual || []).map(function (q) { return DW.WEAPON_QUALITIES[q] ? DW.WEAPON_QUALITIES[q].ru : q; }).join(', ')) +
            (x.range ? ' · ' + x.range + ' футов' : '') + '</td></tr>';
        }).join('') + '</tbody></table>' +
        '<p class="muted">Персонажи ' + T('Малого размера', 'small-size') + ' не могут пользоваться Большим (Large) оружием.</p>' +
        '<h4>Качества оружия</h4><ul style="font-size:.86rem">' + Object.keys(DW.WEAPON_QUALITIES).map(function (k) {
          var q = DW.WEAPON_QUALITIES[k];
          return '<li><b>' + esc(q.ru) + '</b> <span class="en">' + esc(q.en) + '</span> — ' + esc(q.d) + '</li>';
        }).join('') + '</ul>' +
      '</div></details>' +
      '<details><summary>Броня</summary><div class="body">' +
        '<table class="tbl compact"><thead><tr><th>Броня</th><th>Цена</th><th>КБ</th><th>Тип</th><th>Слоты</th></tr></thead><tbody>' +
        a.map(function (x) {
          return '<tr><td><b>' + esc(x.ru) + '</b> <span class="en">' + esc(x.en) + '</span></td><td>' + (x.cost || '—') + ' зм</td>' +
            '<td class="mono">' + x.ac + '</td><td>' + esc(x.bulkRu) + '</td><td>' + x.slots + '</td></tr>';
        }).join('') +
        '<tr><td><b>Щит</b> <span class="en">Shield</span></td><td>10 зм</td><td class="mono">+1</td><td>—</td><td>1</td></tr>' +
        '</tbody></table>' +
        '<p class="muted">Корьевой и шишечный доспехи обычно делают только мослинги и только малого размера. Подгонка брони под другой размер: 2d6 дней и половина цены.</p>' +
      '</div></details>' +
      '<details><summary>Снаряжение</summary><div class="body">' +
        '<table class="tbl compact"><thead><tr><th>Предмет</th><th>Цена</th><th>Вес</th><th>Слоты</th></tr></thead><tbody>' +
        Object.keys(DW.GEAR).filter(function (k) { return k !== 'instrument_any'; }).map(function (k) {
          var g = DW.GEAR[k];
          return '<tr><td><b>' + esc(g.ru) + '</b> <span class="en">' + esc(g.en) + '</span>' +
            (g.d ? '<br><span class="muted" style="font-size:.76rem">' + esc(g.d) + '</span>' : '') + '</td>' +
            '<td>' + g.cost + ' зм</td><td>' + g.weight + '</td><td>' + g.slots + '</td></tr>';
        }).join('') + '</tbody></table>' +
        '<p class="muted">' + T('Монеты', 'gp') + ': 1 зм = 10 см = 100 мм. Пеллюцидий (фейское серебро) = 5 зм. Вес: 10 монет = 1 фунт.</p>' +
      '</div></details></div>';
  }

  function world() {
    return '<div class="card cheat"><h2>Мир Дольменвуда</h2>' +
      '<details><summary>Календарь и праздники</summary><div class="body">' +
        '<p>Год — 352 дня: 12 месяцев по 4 недели из 7 дней плюс особые дни (визендни). Дни недели: ' +
        DW.WEEKDAYS.map(function (d) { return esc(d.ru); }).join(', ') + '.</p>' +
        '<table class="tbl compact"><thead><tr><th>#</th><th>Месяц</th><th>Сезон</th><th>Дней</th><th>Луна</th></tr></thead><tbody>' +
        DW.MONTHS.map(function (m) {
          return '<tr><td>' + m.n + '</td><td><b>' + esc(m.ru) + '</b> <span class="en">' + esc(m.en) + '</span></td><td>' + esc(m.season) + '</td>' +
            '<td>' + m.days + '</td><td>' + esc(m.moon) + '</td></tr>';
        }).join('') + '</tbody></table>' +
        '<h4>Праздники</h4><ul style="font-size:.88rem">' + DW.FEAST_DAYS.map(function (f) {
          return '<li><b>' + esc(f.ru) + '</b> — ' + esc(f.d) + '</li>';
        }).join('') + '</ul>' +
      '</div></details>' +
      '<details><summary>Религии</summary><div class="body">' +
        DW.RELIGIONS.map(function (r) {
          return '<p><b>' + esc(r.ru) + '</b> <span class="en">' + esc(r.en) + '</span><br>' + esc(r.d) + '</p>';
        }).join('') +
      '</div></details>' +
      '<details><summary>Благородные дома</summary><div class="body">' +
        '<p><b>Дом Бракенволд</b> (Закон) — герцог Теспиан III, правит всем Дольменвудом. Резиденция: замок Бракенволд.</p>' +
        DW.CLASSES.knight.lieges.map(function (l) {
          return '<p><b>' + esc(l.ru) + '</b> <span class="en">' + esc(l.en) + '</span> (' + esc(l.al) + ') — ' + esc(l.d) + '</p>';
        }).join('') +
      '</div></details>' +
      '<details><summary>Языки</summary><div class="body">' +
        '<p><b>' + T('Волдийский', 'woldish') + '</b> — общий язык, его знают все. Персонаж с положительным модификатором Интеллекта знает столько же дополнительных языков.</p>' +
        '<table class="tbl compact"><thead><tr><th>d6</th><th>Язык</th><th>Примечание</th></tr></thead><tbody>' +
        DW.COMMON_LANGUAGES.map(function (l) {
          return '<tr><td>' + (l.r[0] === l.r[1] ? l.r[0] : l.r[0] + '–' + l.r[1]) + '</td><td><b>' + esc(l.ru) + '</b> <span class="en">' + esc(l.en) + '</span></td><td class="muted">' + esc(l.note) + '</td></tr>';
        }).join('') + '</tbody></table>' +
        '<p class="muted">Редкие языки (по решению Рефери): ' + DW.OBSCURE_LANGUAGES.map(function (l) { return esc(l.ru) + (l.note ? ' (' + esc(l.note) + ')' : ''); }).join(', ') + '.</p>' +
      '</div></details></div>';
  }

  function glossary() {
    var keys = Object.keys(DW.GLOSSARY).sort(function (a, b) {
      return DW.GLOSSARY[a].t.localeCompare(DW.GLOSSARY[b].t, 'ru');
    });
    return '<div class="card"><h2>Глоссарий</h2>' +
      '<table class="tbl compact"><thead><tr><th>Термин</th><th>Оригинал</th><th>Что это</th><th>Стр.</th></tr></thead><tbody>' +
      keys.map(function (k) {
        var g = DW.GLOSSARY[k];
        return '<tr><td><b>' + esc(g.t) + '</b></td><td class="en">' + esc(g.en || '') + '</td><td style="font-size:.86rem">' + esc(g.d) + '</td><td class="muted">' + (g.p || '') + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  DW.views = DW.views || {};
  DW.views.rules = render;
})();
