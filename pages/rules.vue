<script setup lang="ts">
/** Справочник: выжимка правил, таблицы снаряжения, мир, глоссарий. */
import * as D from '~/data'

const glossaryKeys = computed(() =>
  Object.keys(D.GLOSSARY).sort((a, b) => (D.GLOSSARY as any)[a].t.localeCompare((D.GLOSSARY as any)[b].t, 'ru'))
)
const weapons = Object.values(D.WEAPONS)
const armours = ['none', 'leather', 'bark', 'chainmail', 'pinecone', 'platemail', 'fullplate'].map((k) => (D.ARMOUR as any)[k])
const gear = Object.entries(D.GEAR).filter(([k]) => k !== 'instrument_any')
</script>

<template>
  <div>
    <div class="card">
      <h2>Справочник</h2>
      <p class="muted" style="margin: 0">Выжимка из Player’s Book для быстрого поиска за столом.</p>
    </div>

    <div class="card cheat">
      <h2>Основные правила</h2>
      <details open>
        <summary>Четыре типа бросков</summary>
        <div class="body">
          <table class="tbl">
            <thead><tr><th>Бросок</th><th>Кость</th><th>Успех</th></tr></thead>
            <tbody>
              <tr><td><span class="term" data-tip="skill-check">Проверка навыка</span></td><td>1d6</td><td>≥ цели навыка</td></tr>
              <tr><td><span class="term" data-tip="ability-check">Проверка характеристики</span></td><td>1d6 + мод.</td><td>≥ 4</td></tr>
              <tr><td><span class="term" data-tip="saving-throw">Спасбросок</span></td><td>1d20</td><td>≥ цели спасброска</td></tr>
              <tr><td><span class="term" data-tip="attack-roll">Бросок атаки</span></td><td>1d20</td><td>≥ КБ цели</td></tr>
            </tbody>
          </table>
          <p class="muted">Натуральные 1 и 6 на d6, 1 и 20 на d20 — всегда провал и всегда успех.</p>
        </div>
      </details>
      <details>
        <summary>Нагрузка по весу</summary>
        <div class="body">
          <table class="tbl compact">
            <thead><tr><th>Вес в монетах</th><th>Скорость</th></tr></thead>
            <tbody><tr v-for="r in D.WEIGHT_ENCUMBRANCE" :key="r.maxWeight"><td>до {{ r.maxWeight }}</td><td>{{ r.speed }}</td></tr></tbody>
          </table>
          <p class="muted">10 монет = 1 фунт. Больше {{ D.MAX_LOAD }} унести нельзя. Одежда и поясной кошель не считаются (правило Рефери).</p>
        </div>
      </details>
      <details>
        <summary>Встреча и бой</summary>
        <div class="body">
          <p><b><span class="term" data-tip="reaction">Реакция</span></b> (2d6 + Харизма): 2− атакуют · 3–5 враждебны · 6–8 насторожены · 9–11 договориться · 12+ дружелюбны.</p>
          <p><b>Раунд:</b> объявления → <span class="term" data-tip="initiative">инициатива</span> 1d6 → движение, стрельба, магия, ближний бой → <span class="term" data-tip="morale">Мораль</span>.</p>
        </div>
      </details>
    </div>

    <div class="card cheat">
      <h2>Таблицы снаряжения</h2>
      <details>
        <summary>Оружие</summary>
        <div class="body">
          <table class="tbl compact">
            <thead><tr><th>Оружие</th><th>Цена</th><th>Урон</th><th>Размер</th></tr></thead>
            <tbody>
              <tr v-for="w in weapons" :key="w.id">
                <td><b>{{ w.ru }}</b> <span class="en">{{ w.en }}</span></td>
                <td>{{ w.cost }} зм</td><td class="mono">{{ w.dmg }}</td><td>{{ w.size }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
      <details>
        <summary>Броня</summary>
        <div class="body">
          <table class="tbl compact">
            <thead><tr><th>Броня</th><th>Цена</th><th>КБ</th><th>Тип</th><th>Вес</th></tr></thead>
            <tbody>
              <tr v-for="a in armours" :key="a.id">
                <td><b>{{ a.ru }}</b> <span class="en">{{ a.en }}</span></td>
                <td>{{ a.cost }} зм</td><td class="mono">{{ a.ac }}</td><td>{{ a.bulkRu }}</td><td>{{ a.weight }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
      <details>
        <summary>Снаряжение</summary>
        <div class="body">
          <table class="tbl compact">
            <thead><tr><th>Предмет</th><th>Цена</th><th>Вес</th></tr></thead>
            <tbody>
              <tr v-for="[k, g] in gear" :key="k">
                <td><b>{{ g.ru }}</b> <span class="en">{{ g.en }}</span></td>
                <td>{{ g.cost }} зм</td><td>{{ g.weight }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>

    <div class="card">
      <h2>Глоссарий</h2>
      <table class="tbl compact">
        <thead><tr><th>Термин</th><th>Оригинал</th><th>Что это</th><th>Стр.</th></tr></thead>
        <tbody>
          <tr v-for="k in glossaryKeys" :key="k">
            <td><b>{{ D.GLOSSARY[k].t }}</b></td>
            <td class="en">{{ D.GLOSSARY[k].en }}</td>
            <td style="font-size: 0.86rem">{{ D.GLOSSARY[k].d }}</td>
            <td class="muted">{{ D.GLOSSARY[k].p }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
