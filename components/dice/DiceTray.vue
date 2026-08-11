<script setup lang="ts">
/**
 * Анимация броска: кости нужной размерности крутятся и приземляются.
 *
 * Показ и только показ. Сами числа приходят готовыми из utils/dice.js —
 * там честный ГСЧ с отбраковкой, и это гарантия перед Рефери. Лоток
 * ничего не бросает и не может подменить результат.
 */
import { dice as DICE } from '~/utils/dice.js'

interface Group {
  sides: number
  results: number[]
  label?: string
  value?: number
  /** Номер отброшенной кости — «4d6, отбросить худшую». */
  dropIndex?: number
}
interface Props {
  groups: Group[]
  animate?: boolean
}
const props = withDefaults(defineProps<Props>(), { animate: true })
const emit = defineEmits<{ done: [] }>()

/** Одна кость на экране. Для d100 это разряд десятков и разряд единиц. */
interface Face {
  sides: number
  place: 'tens' | 'ones' | null
}

/**
 * d100 в книге бросается двумя d10 (стр. 15): разряд десятков и разряд единиц.
 * rollD100 отдаёт в results сырые цифры 0–9, поэтому десятки показываем
 * как 00, 10, … 90 — и крутим их в том же виде, иначе цифра прыгает
 * в одном диапазоне, а замирает в другом.
 */
const shownDice = computed<Face[][]>(() =>
  props.groups.map((g) =>
    g.sides === 100
      ? [{ sides: 10, place: 'tens' as const }, { sides: 10, place: 'ones' as const }]
      : g.results.map(() => ({ sides: g.sides, place: null }))
  )
)

const faces = ref<Record<string, number>>({})
const settled = ref<Record<string, boolean>>({})
const key = (gi: number, di: number) => gi + ':' + di

function faceText(gi: number, di: number) {
  const g = props.groups[gi]
  const face = shownDice.value[gi][di]
  const raw = settled.value[key(gi, di)] ? g.results[di] : faces.value[key(gi, di)]
  if (raw == null) return '?'
  return face.place === 'tens' ? String(raw * 10).padStart(2, '0') : String(raw)
}

function dieClass(sides: number) {
  return [4, 6, 8, 10, 12, 20].includes(sides) ? 'd' + sides : 'd6'
}

/** Все таймеры лотка. Гасим разом: иначе интервалы переживают компонент. */
let timers: ReturnType<typeof setTimeout>[] = []
function stopAll() {
  timers.forEach((t) => { clearTimeout(t); clearInterval(t as any) })
  timers = []
}

function settleEverything() {
  stopAll()
  props.groups.forEach((_, gi) => shownDice.value[gi].forEach((_, di) => { settled.value[key(gi, di)] = true }))
  emit('done')
}

const reducedMotion = () =>
  import.meta.client && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function start() {
  stopAll()
  if (!props.animate || reducedMotion()) {
    settleEverything()
    return
  }

  let last = 0
  let pending = 0
  props.groups.forEach((g, gi) => {
    shownDice.value[gi].forEach((face, di) => {
      const k = key(gi, di)
      settled.value[k] = false
      pending++
      // Крутим в том же диапазоне, в котором кость потом замрёт.
      const spin = setInterval(() => { faces.value[k] = DICE.randInt(face.sides) + (face.place ? 0 : 1) }, 55)
      timers.push(spin as any)
      // Кости падают вразнобой, а не строем.
      const at = 360 + gi * 90 + di * 70
      last = Math.max(last, at)
      timers.push(setTimeout(() => {
        clearInterval(spin)
        settled.value[k] = true
        if (--pending === 0) emit('done')
      }, at))
    })
  })
  if (!pending) emit('done')
}

onMounted(start)
onBeforeUnmount(stopAll)

// Кнопка «показать сразу» гасит анимацию и у лотков, которые уже крутятся.
watch(() => props.animate, (on) => { if (!on) settleEverything() })
</script>

<template>
  <div>
    <div v-for="(g, gi) in groups" :key="gi" class="dice-tray">
      <div v-for="(face, di) in shownDice[gi]" :key="di" class="die-wrap">
        <div
          class="die"
          :class="[
            dieClass(face.sides),
            settled[key(gi, di)] ? 'settled' : 'rolling',
            { dropped: settled[key(gi, di)] && di === g.dropIndex }
          ]"
          :style="{ '--spin': (0.33 + ((gi + di) % 4) * 0.05).toFixed(2) + 's' }"
          :title="di === g.dropIndex ? 'Худшая кость — отброшена' : ''"
        >
          <span>{{ faceText(gi, di) }}</span>
        </div>
        <div v-if="face.place" class="die-label">{{ face.place === 'tens' ? 'десятки' : 'единицы' }}</div>
        <div v-else-if="di === g.dropIndex" class="die-label">отброшена</div>
      </div>
      <div class="die-sum">{{ settled[key(gi, 0)] ? (g.value ?? g.results.reduce((a, b) => a + b, 0)) : '…' }}</div>
      <div v-if="g.label" class="die-label" style="align-self: center">{{ g.label }}</div>
    </div>
  </div>
</template>
