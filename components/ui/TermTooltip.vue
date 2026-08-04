<script setup lang="ts">
/**
 * Всплывающая подсказка для игровых терминов.
 * Слушает весь документ, чтобы термины можно было ставить где угодно
 * простым <span class="term" data-tip="ключ">…</span> — в том числе внутри v-html.
 */
import { GLOSSARY } from '~/data'

const term = ref<any>(null)
const pos = ref({ left: 0, top: 0 })
const el = ref<HTMLElement | null>(null)

function show(target: HTMLElement) {
  const key = target.getAttribute('data-tip')
  const g = key ? (GLOSSARY as any)[key] : null
  if (!g) return
  term.value = g
  nextTick(() => place(target))
}

function place(target: HTMLElement) {
  const box = el.value
  if (!box) return
  const r = target.getBoundingClientRect()
  const w = box.offsetWidth
  const h = box.offsetHeight
  let left = r.left + window.scrollX + r.width / 2 - w / 2
  left = Math.max(8, Math.min(left, window.innerWidth + window.scrollX - w - 8))
  let top = r.top + window.scrollY - h - 9
  if (top < window.scrollY + 6) top = r.bottom + window.scrollY + 9
  pos.value = { left, top }
}

function onOver(e: Event) {
  const t = (e.target as HTMLElement)?.closest?.('.term[data-tip]') as HTMLElement | null
  if (t) show(t)
}
function onOut(e: Event) {
  const t = (e.target as HTMLElement)?.closest?.('.term[data-tip]')
  if (t) term.value = null
}
function onClick(e: Event) {
  const t = (e.target as HTMLElement)?.closest?.('.term[data-tip]') as HTMLElement | null
  if (t) { e.preventDefault(); show(t) } else term.value = null
}

onMounted(() => {
  document.addEventListener('mouseover', onOver)
  document.addEventListener('mouseout', onOut)
  document.addEventListener('click', onClick)
  window.addEventListener('scroll', () => (term.value = null), true)
})
onBeforeUnmount(() => {
  document.removeEventListener('mouseover', onOver)
  document.removeEventListener('mouseout', onOut)
  document.removeEventListener('click', onClick)
})
</script>

<template>
  <div
    v-show="term"
    id="tip-pop"
    ref="el"
    class="show"
    :style="{ left: pos.left + 'px', top: pos.top + 'px' }"
  >
    <template v-if="term">
      <b>{{ term.t }}</b>
      <div v-if="term.en" class="tip-en">{{ term.en }}</div>
      {{ term.d }}
      <span v-if="term.p" class="tip-p">Player’s Book, стр. {{ term.p }}</span>
    </template>
  </div>
</template>
