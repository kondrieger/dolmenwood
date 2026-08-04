<script setup lang="ts">
const { settings, toggleTheme } = useSettings()
</script>

<template>
  <header class="topbar">
    <div class="brand">
      <b>🍄 Кузница персонажей</b>
      <span>Dolmenwood · Player’s Book</span>
    </div>
    <nav class="nav">
      <NuxtLink to="/">Генератор</NuxtLink>
      <NuxtLink to="/catalog">Каталог</NuxtLink>
      <NuxtLink to="/rules">Справочник</NuxtLink>
      <a href="#" :title="settings.theme === 'dark' ? 'Светлая тема' : 'Тёмная тема'" @click.prevent="toggleTheme">◐</a>
    </nav>
  </header>
</template>

<style scoped>
/* Активную ссылку подсвечивает router-link-active из Nuxt. */
.nav :deep(a.router-link-active) {
  color: var(--bg);
  background: var(--gold);
  border-color: var(--gold);
  font-weight: 600;
}
html[data-theme='light'] .nav :deep(a.router-link-active) { color: #f7f1e1; }
</style>
