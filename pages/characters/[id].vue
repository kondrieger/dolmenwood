<script setup lang="ts">
/** Страница персонажа: сверху редактируемый лист, ниже справочная часть. */
import { Generator } from '~/utils/generator.js'
import { recompute } from '~/utils/sheet.js'

const route = useRoute()
const router = useRouter()
const { get, save, flush, remove, load } = useCharacters()

await load()
const id = String(route.params.id)

/**
 * Истина всегда на диске: файл могли поправить снаружи (руками, скриптом,
 * из другой вкладки). Поэтому берём персонажа напрямую с сервера,
 * а не из кэша списка.
 */
const character = ref<any>(null)
async function reloadFromDisk() {
  try {
    character.value = await $fetch<any>(`/api/characters/${id}`)
  } catch {
    character.value = get(id)
  }
}
await reloadFromDisk()

const showItems = ref(false)
const showLevelUp = ref(false)
/** Открытая карточка предмета: где он лежит и под каким номером. 'new' — создание своего. */
const openItem = ref<{ where: string; index: number } | null>(null)

function onChanged() {
  if (!character.value) return
  save(character.value)
}

function onLevelUpApplied() {
  showLevelUp.value = false
  if (character.value) flush(character.value)
}

async function del() {
  if (!character.value) return
  const ok = confirm(
    `Удалить «${character.value.name.ru}» безвозвратно?\n\nФайл characters/${character.value.id}.json будет стёрт.`
  )
  if (!ok) return
  await remove(character.value.id)
  router.push('/catalog')
}

function doPrint() {
  if (import.meta.client) window.print()
}

function downloadJson() {
  const ch = character.value
  const blob = new Blob([JSON.stringify(ch, null, 2)], { type: 'application/json;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `dolmenwood-${ch.id}.json`
  document.body.appendChild(a)
  a.click()
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url) }, 100)
}

/**
 * Приводим файл к текущей схеме, но записываем только если пересчёт
 * действительно что-то изменил. Иначе простое открытие страницы затирало бы
 * правки, сделанные снаружи.
 */
onMounted(() => {
  const ch = character.value
  if (!ch) return
  // Промпт тоже сравниваем: иначе в файле остаётся старый текст, а на странице
  // виден новый — и Рефери в выгруженном JSON увидит не то, что показано.
  const snapshot = () => JSON.stringify({
    ac: ch.ac, speed: ch.speed, mods: ch.mods, xpNext: ch.xpForNextLevel, portrait: ch.portraitPrompt
  })
  const before = snapshot()
  recompute(ch)
  if (before !== snapshot()) save(ch)
})

const fm = Generator.fmtMod
const attacks = computed(() => {
  const ch = character.value
  if (!ch) return []
  const rows: any[] = []
  const isHunter = ch.profile.id === 'hunter'
  ;(ch.equipment.weapons || []).forEach((w: any) => {
    const q = w.qual || []
    if (q.includes('melee')) {
      rows.push({
        name: w.ru, en: w.en, kind: 'Ближний бой',
        atk: ch.attack + ch.mods.STR,
        dmg: w.dmg + (ch.mods.STR ? ' ' + fm(ch.mods.STR) : ''),
        note: w.special || ''
      })
    }
    if (q.includes('missile')) {
      rows.push({
        name: w.ru + (q.includes('melee') ? ' (метнуть)' : ''), en: w.en, kind: 'Стрелковое',
        atk: ch.attack + ch.mods.DEX + (isHunter ? 1 : 0),
        dmg: w.dmg,
        note: (w.range ? 'дистанции ' + w.range + ' футов. ' : '') + (w.special || '')
      })
    }
  })
  if (ch.kindred.id === 'breggle') {
    rows.push({ name: 'Рога', en: 'Horns', kind: 'Ближний бой', atk: ch.attack + ch.mods.STR, dmg: '1d4', note: 'вместо оружия' })
  }
  return rows
})
</script>

<template>
  <div v-if="!character" class="card empty">
    <div class="big">❔</div>
    <p>Персонаж не найден. Возможно, файл удалён из папки characters/.</p>
    <NuxtLink class="btn" to="/catalog">В каталог</NuxtLink>
  </div>

  <div v-else>
    <div class="card">
      <div class="sheet-head">
        <div class="titles">
          <h1>
            {{ character.name.ru }}
            <span class="badge" :class="character.status">{{ character.status === 'dead' ? 'Погиб' : character.status === 'retired' ? 'На покое' : 'Жив' }}</span>
          </h1>
          <div class="sub">
            {{ character.kindred.ru }} · {{ character.profile.ru }} · {{ character.level }} уровень · {{ character.alignment.ru }}
          </div>
          <div class="en">{{ character.name.en }} — {{ character.kindred.en }} {{ character.profile.en }}, Level {{ character.level }}</div>
          <div class="muted" style="margin-top: 6px; font-size: 0.82rem">
            Файл: <span class="mono">characters/{{ character.id }}.json</span>
          </div>
        </div>
        <div class="btn-row no-print">
          <button class="small" @click="downloadJson">⬇ JSON</button>
          <button class="small" @click="doPrint">🖨 Печать</button>
          <button class="small" title="Перечитать файл с диска" @click="reloadFromDisk">⟳ Обновить</button>
          <button class="small danger" @click="del">Удалить</button>
          <NuxtLink class="btn small" to="/catalog">← Каталог</NuxtLink>
        </div>
      </div>
    </div>

    <!-- Лист в раскладке VTT — самое главное, поэтому наверху -->
    <CharacterSheetVtt
      :character="character"
      @changed="onChanged"
      @levelup="showLevelUp = true"
      @items="showItems = true"
      @custom="openItem = { where: 'new', index: 0 }"
      @open="(where, index) => (openItem = { where, index })"
    />

    <div class="card">
      <h2>Твои атаки <span class="en">Attacks</span></h2>
      <table class="tbl">
        <thead><tr><th>Чем</th><th>Тип</th><th>Бросок атаки</th><th>Урон</th><th>Особенности</th></tr></thead>
        <tbody>
          <tr v-for="(r, i) in attacks" :key="i">
            <td><b>{{ r.name }}</b><br><span class="en">{{ r.en }}</span></td>
            <td>{{ r.kind }}</td>
            <td class="mono" style="color: var(--gold); font-size: 1rem">d20 {{ fm(r.atk) }}</td>
            <td class="mono" style="font-size: 1rem">{{ r.dmg }}</td>
            <td class="muted" style="font-size: 0.8rem">{{ r.note }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <CharacterPortraitPrompt :character="character" />

    <CharacterValidationCard v-if="character.validation?.length" :character="character" />

    <CharacterCheatSheet :character="character" />

    <div class="card">
      <h2>Журнал бросков <span class="en">Roll log</span></h2>
      <p class="muted" style="margin-top: -4px">
        Контрольная сумма <span class="mono">{{ character.checksum }}</span> · записей: {{ (character.log || []).length }}
      </p>
      <details class="cheat">
        <summary style="padding: 9px 0">Показать журнал</summary>
        <div class="body" style="padding-left: 0">
          <table class="log-table">
            <thead><tr><th>#</th><th>Шаг</th><th>Что</th><th>Кости</th><th>Итог</th><th>Результат</th></tr></thead>
            <tbody>
              <tr v-for="e in character.log" :key="e.i">
                <td class="dim">{{ e.i }}</td>
                <td class="dim">{{ e.step }}</td>
                <td>{{ e.label }}</td>
                <td class="d">{{ e.notation }}<template v-if="e.dice?.length"> [{{ e.dice.join(', ') }}]</template></td>
                <td class="d">{{ e.total ?? '—' }}</td>
                <td>{{ e.result }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>

    <CharacterItemCatalog
      v-if="showItems"
      :character="character"
      @close="showItems = false"
      @changed="onChanged"
    />

    <CharacterItemDialog
      v-if="openItem"
      :key="openItem.where + ':' + openItem.index"
      :character="character"
      :where="openItem.where"
      :index="openItem.index"
      @close="openItem = null"
      @changed="onChanged"
    />

    <CharacterLevelUpDialog
      v-if="showLevelUp"
      :key="'lvl' + character.level"
      :character="character"
      @close="showLevelUp = false"
      @applied="onLevelUpApplied"
    />
  </div>
</template>
