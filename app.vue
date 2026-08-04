<script setup lang="ts">
const { load: loadSettings } = useSettings()
const { load: loadCharacters, saveState } = useCharacters()

await loadSettings()
await loadCharacters()

const saveLabel = computed(() => {
  if (saveState.value === 'saving') return '💾 Сохраняю…'
  if (saveState.value === 'saved') return '✓ Сохранено в файл'
  if (saveState.value === 'error') return '⚠ Не удалось сохранить'
  return ''
})
</script>

<template>
  <div>
    <LayoutAppHeader />
    <main class="app">
      <NuxtPage />
    </main>

    <!-- Индикатор автосохранения: лист пишется в characters/<id>.json -->
    <div class="save-badge" :class="[saveState, { show: saveState !== 'idle' }]">
      {{ saveLabel }}
    </div>

    <UiTermTooltip />
  </div>
</template>
