<script setup lang="ts">
/** Анимация броска: кубики нужной размерности «крутятся» и приземляются. */
import { dice } from '~/utils/dice.js'

interface Group {
  sides: number
  results: number[]
  label?: string
  value?: number
}
interface Props {
  groups: Group[]
  animate?: boolean
}
const props = withDefaults(defineProps<Props>(), { animate: true })
const emit = defineEmits<{ done: [] }>()

const faces = ref<Record<string, number[]>>({})
const settled = ref<Record<number, boolean>>({})

function dieClass(sides: number) {
  return [4, 6, 8, 10, 12, 20].includes(sides) ? 'd' + sides : sides === 100 ? 'd10' : 'd6'
}
/** d100 в книге бросается двумя d10 — десятки и единицы. */
function shown(g: Group) {
  return g.sides === 100 ? [{ sides: 10 }, { sides: 10 }] : g.results.map(() => ({ sides: g.sides }))
}

onMounted(() => {
  if (!props.animate) {
    props.groups.forEach((_, i) => (settled.value[i] = true))
    emit('done')
    return
  }
  const timers: any[] = []
  props.groups.forEach((g, i) => {
    const spin = setInterval(() => {
      faces.value['' + i] = shown(g).map((d) => dice.randInt(d.sides) + 1)
    }, 55)
    timers.push(
      setTimeout(() => {
        clearInterval(spin)
        settled.value[i] = true
        if (i === props.groups.length - 1) emit('done')
      }, 420 + i * 40)
    )
  })
  onBeforeUnmount(() => timers.forEach(clearTimeout))
})
</script>

<template>
  <div>
    <div v-for="(g, i) in groups" :key="i" class="dice-tray">
      <div v-for="(d, j) in shown(g)" :key="j" class="die-wrap">
        <div class="die" :class="[dieClass(d.sides), settled[i] ? 'settled' : 'rolling']">
          <span>{{ settled[i] ? (g.sides === 100 ? g.results[j] : g.results[j]) : (faces['' + i]?.[j] ?? '?') }}</span>
        </div>
        <div v-if="g.sides === 100" class="die-label">{{ j === 0 ? 'десятки' : 'единицы' }}</div>
      </div>
      <div class="die-sum">{{ settled[i] ? (g.value ?? '—') : '…' }}</div>
      <div v-if="g.label" class="die-label" style="align-self: center">{{ g.label }}</div>
    </div>
  </div>
</template>
