<script setup lang="ts">
import * as D from '~/data'

const { list, load, remove, setStatus } = useCharacters()
await load()

/** Фильтр по игроку: пусто — показываем всех. */
const ownerFilter = ref('')
const visible = computed(() =>
  ownerFilter.value ? list.value.filter((c) => c.owner === ownerFilter.value) : list.value
)
const owners = computed(() => {
  const seen = new Map<string, number>()
  list.value.forEach((c) => seen.set(c.owner || '—', (seen.get(c.owner || '—') || 0) + 1))
  return [...seen.entries()].sort((a, b) => b[1] - a[1])
})

const alive = computed(() => visible.value.filter((c) => c.status === 'alive'))
const rest = computed(() => visible.value.filter((c) => c.status !== 'alive'))
const sections = computed(() => [
  { t: 'Активные', items: alive.value },
  { t: 'Погибшие и ушедшие на покой', items: rest.value }
])
const fm = (n: number) => (n >= 0 ? '+' : '') + n

async function del(c: any) {
  if (!confirm(`Удалить «${c.name.ru}» безвозвратно?\n\nФайл characters/${c.id}.json будет стёрт.`)) return
  await remove(c.id)
}
</script>

<template>
  <div>
    <div class="card">
      <div class="card-head">
        <h2>Каталог персонажей</h2>
        <NuxtLink class="btn small" to="/">🎲 Сгенерировать</NuxtLink>
        <NuxtLink class="btn small" to="/manual">✎ Внести вручную</NuxtLink>
      </div>
      <p class="muted" style="margin: 0">
        Всего: {{ list.length }} · живых: {{ alive.length }} · остальных: {{ rest.length }}.
        Каждый персонаж — отдельный файл в папке <span class="mono">characters/</span>.
      </p>
      <div class="chips" style="margin-top: 12px">
        <button class="chip" :class="{ on: ownerFilter === '' }" @click="ownerFilter = ''">Все ({{ list.length }})</button>
        <button
          v-for="[name, n] in owners" :key="name" class="chip"
          :class="{ on: ownerFilter === name }" @click="ownerFilter = name"
        >{{ name }} ({{ n }})</button>
      </div>
    </div>

    <div v-if="!list.length" class="card empty">
      <div class="big">🍂</div>
      <p>Пока никого. Тропа ждёт.</p>
      <NuxtLink class="btn btn-primary" to="/">Создать первого персонажа</NuxtLink>
    </div>

    <template v-for="section in sections" :key="section.t">
      <template v-if="section.items.length">
        <h2 style="margin: 22px 0 12px">{{ section.t }}</h2>
        <div class="cat-grid">
          <div v-for="c in section.items" :key="c.id" class="cat-card" :class="{ 'is-dead': c.status === 'dead' }">
            <div style="display: flex; justify-content: space-between; align-items: start; gap: 8px">
              <h3><NuxtLink :to="`/characters/${c.id}`">{{ c.name.ru }}</NuxtLink></h3>
              <span class="badge" :class="c.status">{{ c.status === 'dead' ? 'Погиб' : c.status === 'retired' ? 'На покое' : 'Жив' }}</span>
            </div>
            <div class="who">{{ c.kindred.ru }} · {{ c.profile.ru }} · {{ c.level }} ур. · {{ c.alignment.ru }}</div>
            <div class="muted" style="font-size: 0.78rem; margin-bottom: 6px">Игрок: <b>{{ c.owner || '— не указан —' }}</b></div>
            <div class="mini">
              <span>ХП <b>{{ c.hp.max }}</b></span>
              <span>КБ <b>{{ c.ac.value }}</b></span>
              <span>Атака <b>{{ fm(c.attack) }}</b></span>
              <span>Скор. <b>{{ c.speed.value }}</b></span>
            </div>
            <div class="btn-row">
              <NuxtLink class="btn small" :to="`/characters/${c.id}`">Открыть лист</NuxtLink>
              <button v-if="c.status === 'alive'" class="small danger" @click="setStatus(c.id, 'dead')">Погиб</button>
              <button v-else class="small" @click="setStatus(c.id, 'alive')">Вернуть в строй</button>
              <button class="small danger" @click="del(c)">✕</button>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
