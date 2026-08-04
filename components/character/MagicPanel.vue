<script setup lang="ts">
/** Магия персонажа: гламуры, руны, сноровки, заклинания — с полными описаниями. */
interface Props {
  character: any
}
const props = defineProps<Props>()
const m = computed(() => props.character.magic || {})
const ch = props.character
</script>

<template>
  <div v-if="m.knack" class="vtt-panel">
    <div class="vtt-panel-head">Mossling Knack <span class="vtt-ru">Сноровка</span></div>
    <div class="vtt-panel-body">
      <div class="vtt-row">
        <div class="vtt-field">
          <div class="vtt-label">Knack Type</div>
          <div class="vtt-value">{{ m.knack.en }}</div>
        </div>
        <div class="vtt-field">
          <div class="vtt-label">Unlocked Level</div>
          <div class="vtt-value">{{ ch.level }}</div>
        </div>
      </div>
      <div class="cheat" style="margin-top: 10px">
        <details v-for="l in m.knack.levels" :key="l.lv" :open="l.lv <= ch.level">
          <summary>{{ l.lv <= ch.level ? '✔' : '🔒' }} {{ l.ru }} — {{ l.lv }} уровень <span class="en">{{ l.en }}</span></summary>
          <div class="body"><p>{{ l.d }}</p></div>
        </details>
      </div>
    </div>
  </div>

  <div v-if="m.glamours && m.glamours.length" class="vtt-panel">
    <div class="vtt-panel-head">Glamours <span class="vtt-ru">Гламуры</span></div>
    <div class="vtt-panel-body">
      <p class="vtt-note" style="margin-top: 0">
        Работают мыслью, без слов и жестов. Сорвать их нельзя, объявлять заранее не надо.
      </p>
      <div class="cheat">
        <details v-for="g in m.glamours" :key="g.en" open>
          <summary>{{ g.ru }} <span class="en">{{ g.en }}</span></summary>
          <div class="body">
            <p class="muted" style="font-size: 0.82rem">Длительность: {{ g.dur }} · Дистанция: {{ g.range }}</p>
            <p>{{ g.d }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>

  <div v-for="(bucket, key) in { lesserRunes: 'малые', greaterRunes: 'великие', mightyRunes: 'могучие' }"
       v-show="m[key] && m[key].length" :key="key" class="vtt-panel">
    <div class="vtt-panel-head">Fairy Runes <span class="vtt-ru">Руны фей — {{ bucket }}</span></div>
    <div class="vtt-panel-body">
      <div class="cheat">
        <details v-for="r in (m[key] || [])" :key="r.en" open>
          <summary>{{ r.ru }} <span class="en">{{ r.en }}</span></summary>
          <div class="body">
            <p v-if="r.dur" class="muted" style="font-size: 0.82rem">Длительность: {{ r.dur }} · Дистанция: {{ r.range }}</p>
            <p v-if="r.d">{{ r.d }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>

  <div v-if="m.spellBook" class="vtt-panel">
    <div class="vtt-panel-head">Spell Book <span class="vtt-ru">Книга заклинаний</span></div>
    <div class="vtt-panel-body">
      <div class="vtt-field" style="margin-bottom: 10px">
        <div class="vtt-label">Spell Book</div>
        <div class="vtt-value">{{ m.spellBook.en }}</div>
      </div>
      <div class="cheat">
        <details v-for="s in m.spellBook.spells" :key="s.en">
          <summary>{{ s.ru }} <span class="en">{{ s.en }}</span></summary>
          <div class="body">
            <p class="muted" style="font-size: 0.82rem">Ранг {{ s.rank }} · {{ s.dur }} · {{ s.range }}</p>
            <p>{{ s.d }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>

  <div v-if="m.holySpells && m.holySpells.length" class="vtt-panel">
    <div class="vtt-panel-head">Holy Spells <span class="vtt-ru">Святые заклинания</span></div>
    <div class="vtt-panel-body">
      <p class="vtt-note" style="margin-top: 0">
        Выбор свободный: каждое утро после часа молитвы бери любое заклинание доступного ранга.
      </p>
      <div class="cheat">
        <details v-for="s in m.holySpells" :key="s.en" open>
          <summary>{{ s.ru }} <span class="en">{{ s.en }}</span></summary>
          <div class="body">
            <p class="muted" style="font-size: 0.82rem">«{{ s.prayer }}» · {{ s.saint }} · {{ s.dur }} · {{ s.range }}</p>
            <p>{{ s.d }}</p>
          </div>
        </details>
      </div>
    </div>
  </div>

  <div v-if="m.holyOrder" class="vtt-panel">
    <div class="vtt-panel-head">Holy Order <span class="vtt-ru">Святой орден</span></div>
    <div class="vtt-panel-body">
      <p><b>{{ m.holyOrder.ru }}</b> <span class="en">{{ m.holyOrder.en }}</span></p>
      <p>{{ m.holyOrder.d }}</p>
    </div>
  </div>

  <div v-if="m.symbioticFlesh && m.symbioticFlesh.length" class="vtt-panel">
    <div class="vtt-panel-head">Symbiotic Flesh <span class="vtt-ru">Симбиотическая плоть</span></div>
    <div class="vtt-panel-body">
      <ul style="margin: 0; padding-left: 20px">
        <li v-for="s in m.symbioticFlesh" :key="s.en">{{ s.ru }} <span class="en">{{ s.en }}</span></li>
      </ul>
      <p class="vtt-note">По одной новой черте на каждом уровне.</p>
    </div>
  </div>

  <div v-if="m.spellsPerDay" class="vtt-panel">
    <div class="vtt-panel-head">Spells Per Day <span class="vtt-ru">Заклинаний в день</span></div>
    <div class="vtt-panel-body">
      <div class="vtt-boxes six">
        <div v-for="(n, i) in m.spellsPerDay" :key="i" class="vtt-box">
          <div class="vtt-box-label">Rank {{ i + 1 }}</div>
          <div class="vtt-box-value">{{ n || '—' }}</div>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!m.knack && !m.glamours && !m.spellBook && !m.holySpells" class="vtt-panel">
    <div class="vtt-panel-head">Magic <span class="vtt-ru">Магия</span></div>
    <div class="vtt-panel-body">
      <p class="vtt-note" style="margin-top: 0">У этого персонажа магии нет — вкладку можно пропустить.</p>
    </div>
  </div>
</template>
