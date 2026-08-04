<script setup lang="ts">
/** Расхождения между данными листа и книгой — ничего не исправляется молча. */
interface Props { character: any }
defineProps<Props>()
</script>

<template>
  <div class="card">
    <h2>Сверка с книгой <span class="en">Rules check</span></h2>
    <p class="muted" style="margin-top: -4px">
      Места, где лист расходится с Player’s Book. Ничего не исправлено автоматически — покажи гейм-мастеру.
    </p>
    <div
      v-for="(v, i) in character.validation"
      :key="i"
      class="callout"
      :class="{ good: v.level === 'ok', danger: v.level === 'warn' }"
    >
      <b>{{ v.what }}</b><br>
      На листе: {{ v.sheet }}<br>
      По книге: {{ v.book }}<template v-if="v.page"> (стр. {{ v.page }})</template>
      <br v-if="v.note"><span v-if="v.note" class="muted">{{ v.note }}</span>
    </div>
  </div>
</template>
