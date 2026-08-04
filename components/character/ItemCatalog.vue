<script setup lang="ts">
/** Каталог снаряжения по книге: поиск, фильтр по разделу, добавление в лист. */
import { itemCatalogue, addItem, profileOf } from '~/utils/sheet.js'

interface Props {
  character: any
}
const props = defineProps<Props>()
const emit = defineEmits<{ close: []; changed: [] }>()

const all = itemCatalogue()
const query = ref('')
const cat = ref('all')
const target = ref<'equipped' | 'stowed'>('stowed')

const cats = computed(() => {
  const seen: string[] = []
  all.forEach((r) => { if (!seen.includes(r.cat)) seen.push(r.cat) })
  return seen
})

const rows = computed(() => {
  const q = query.value.trim().toLowerCase()
  return all.filter((r) => {
    if (cat.value !== 'all' && r.cat !== cat.value) return false
    if (!q) return true
    return (r.ru + ' ' + r.en + ' ' + (r.note || '')).toLowerCase().includes(q)
  })
})

/** Что персонажу носить нельзя — показываем, но предупреждаем. */
const prof = computed(() => {
  try { return profileOf(props.character) } catch { return null }
})

function restriction(row: any): string {
  const p: any = prof.value
  if (!p) return ''
  if (row.kind === 'weapon') {
    const w = (all.find((x) => x.key === row.key) as any)
    const size = (w && w.note && w.note.split(' · ')[1]) || ''
    if (p.weaponSizes && size && !p.weaponSizes.includes(size)) {
      return 'Размер ' + size + ' этому персонажу недоступен'
    }
    if (p.weaponWhitelist && !p.weaponWhitelist.includes(row.id)) {
      return 'Класс не владеет этим оружием'
    }
    if (p.noMissile && String(row.note).includes('футов')) {
      return 'Рыцарь не пользуется метательным оружием'
    }
  }
  if (row.kind === 'armour') {
    const bulk = row.note.split(' · ')[1]
    const map: Record<string, string> = { 'Лёгкая': 'light', 'Средняя': 'medium', 'Тяжёлая': 'heavy' }
    const b = map[bulk]
    if (b && p.armourAllowed && !p.armourAllowed.includes(b)) return bulk + ' броня этому классу запрещена'
  }
  if (row.kind === 'shield' && p.shields === false) return 'Класс не пользуется щитами'
  return ''
}

function add(row: any) {
  addItem(props.character, row, target.value)
  emit('changed')
}
</script>

<template>
  <UiModalDialog
    title="Каталог снаряжения"
    subtitle="Всё из Player’s Book, стр. 116–121. Цены в золотых, вес в монетах (10 монет = 1 фунт)"
    wide
    @close="emit('close')"
  >
    <div class="cat-filters">
      <input v-model="query" type="text" placeholder="Поиск: меч, sword, верёвка…">
      <select v-model="cat" style="width: auto">
        <option value="all">Все разделы</option>
        <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
      </select>
      <div class="chips">
        <button class="chip" :class="{ on: target === 'equipped' }" @click="target = 'equipped'">На себя</button>
        <button class="chip" :class="{ on: target === 'stowed' }" @click="target = 'stowed'">В рюкзак</button>
      </div>
    </div>

    <div class="item-scroll">
      <table class="item-table">
        <thead>
          <tr>
            <th>Предмет</th>
            <th>Раздел</th>
            <th style="text-align: right">Цена</th>
            <th style="text-align: right">Вес</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.key">
            <td>
              <b>{{ r.ru }}</b> <span class="en">{{ r.en }}</span>
              <div v-if="r.note" class="muted" style="font-size: 0.76rem">{{ r.note }}</div>
              <div v-if="restriction(r)" style="font-size: 0.76rem; color: var(--blood)">⚠ {{ restriction(r) }}</div>
            </td>
            <td class="dim" style="font-size: 0.8rem">{{ r.cat }}</td>
            <td class="num">{{ r.cost }} зм</td>
            <td class="num">{{ r.weight }}</td>
            <td>
              <div class="row-actions">
                <button class="small" @click="add(r)">Взять</button>
              </div>
            </td>
          </tr>
          <tr v-if="!rows.length">
            <td colspan="5" class="muted" style="text-align: center; padding: 20px">Ничего не нашлось</td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="muted" style="font-size: 0.82rem; margin-top: 10px">
      Броня и щит заменяют надетые. Оружие и снаряжение добавляются к уже имеющимся.
      Ограничения класса показаны предупреждением, но не запрещают взять предмет — решает Рефери.
    </p>
  </UiModalDialog>
</template>
