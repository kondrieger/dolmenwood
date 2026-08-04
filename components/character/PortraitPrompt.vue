<script setup lang="ts">
/**
 * Готовый промпт для генератора изображений.
 * Пересобирается на лету, так что после правки внешности или снаряжения
 * текст сразу актуален — жать ничего не надо.
 */
import { portraitPrompt } from '~/utils/portrait.js'

interface Props {
  character: any
}
const props = defineProps<Props>()

const prompt = computed(() => {
  try {
    return portraitPrompt(props.character)
  } catch {
    return { en: '', ru: '' }
  }
})

const copied = ref('')
async function copy(which: 'en' | 'ru') {
  const text = prompt.value[which]
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    // Резервный путь для окружений без Clipboard API
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
  }
  copied.value = which
  setTimeout(() => { if (copied.value === which) copied.value = '' }, 1600)
}
</script>

<template>
  <div class="card">
    <h2>Промпт для портрета <span class="en">Portrait prompt</span></h2>
    <p class="muted" style="margin-top: -4px">
      Скопируй и вставь в любой генератор изображений. Английский вариант обычно даёт результат лучше.
      Текст собирается из рода, внешности, нрава и надетого снаряжения — меняешь лист, меняется и промпт.
    </p>

    <h3>English</h3>
    <div class="prompt-box">{{ prompt.en }}</div>
    <div class="btn-row no-print" style="margin: 8px 0 16px">
      <button class="small" @click="copy('en')">
        {{ copied === 'en' ? '✓ Скопировано' : '📋 Скопировать' }}
      </button>
    </div>

    <h3>По-русски</h3>
    <div class="prompt-box">{{ prompt.ru }}</div>
    <div class="btn-row no-print" style="margin-top: 8px">
      <button class="small" @click="copy('ru')">
        {{ copied === 'ru' ? '✓ Скопировано' : '📋 Скопировать' }}
      </button>
    </div>
  </div>
</template>
