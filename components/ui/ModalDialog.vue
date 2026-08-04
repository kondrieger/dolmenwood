<script setup lang="ts">
interface Props {
  title: string
  subtitle?: string
  wide?: boolean
  /** Скрыть стандартную кнопку закрытия в подвале. */
  hideClose?: boolean
}
defineProps<Props>()
const emit = defineEmits<{ close: [] }>()

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}
onMounted(() => {
  document.addEventListener('keydown', onKey)
  document.body.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', onKey)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <div class="modal-backdrop" @click.self="emit('close')">
      <div class="modal" :class="{ wide }">
        <div class="modal-head">
          <div>
            <h2>{{ title }}</h2>
            <div v-if="subtitle" class="muted" style="font-size: 0.84rem">{{ subtitle }}</div>
          </div>
          <button class="modal-close" title="Закрыть (Esc)" @click="emit('close')">×</button>
        </div>

        <div class="modal-body">
          <slot />
        </div>

        <div class="modal-foot">
          <slot name="footer">
            <button v-if="!hideClose" @click="emit('close')">Закрыть</button>
          </slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>
