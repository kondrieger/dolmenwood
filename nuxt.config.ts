// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },

  // Локальный инструмент для одного стола: рендерить на сервере нечего,
  // а SPA-режим убирает возню с гидратацией на живо редактируемом листе.
  ssr: false,

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: 'Кузница персонажей Dolmenwood',
      htmlAttrs: { lang: 'ru', 'data-theme': 'dark' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        {
          name: 'description',
          content: 'Генератор персонажей Dolmenwood по правилам Player’s Book: честные броски, каталог, лист персонажа и перенос в VTT.'
        }
      ],
      link: [
        {
          rel: 'icon',
          href: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🍄</text></svg>"
        }
      ]
    }
  },

  // Папка с персонажами — обычный JSON на диске, чтобы его можно было
  // открыть, положить в бэкап или показать гейм-мастеру.
  runtimeConfig: {
    charactersDir: 'characters'
  }
})
