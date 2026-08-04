/** Настройки интерфейса (выбор в генераторе, тема). Лежат в data/settings.json. */
export function useSettings() {
  const settings = useState<Record<string, any>>('dw-settings', () => ({
    mode: 'kindredclass',
    kindred: 'mossling',
    cls: 'fighter',
    abilityMethod: '3d6-in-order',
    gender: 'any',
    moonSign: true,
    animate: true,
    theme: 'dark'
  }))
  const loaded = useState<boolean>('dw-settings-loaded', () => false)
  const timer = useState<any>('dw-settings-timer', () => null)

  async function load() {
    if (loaded.value) return settings.value
    try {
      settings.value = await $fetch<Record<string, any>>('/api/settings')
    } catch {
      // Настройки не критичны — если сервер недоступен, работаем со значениями по умолчанию.
    }
    loaded.value = true
    applyTheme()
    return settings.value
  }

  function applyTheme() {
    if (import.meta.client) {
      document.documentElement.setAttribute('data-theme', settings.value.theme || 'dark')
    }
  }

  function persist() {
    clearTimeout(timer.value)
    timer.value = setTimeout(() => {
      $fetch('/api/settings', { method: 'PUT', body: settings.value }).catch(() => {})
    }, 400)
  }

  function set(patch: Record<string, any>) {
    Object.assign(settings.value, patch)
    if ('theme' in patch) applyTheme()
    persist()
  }

  function toggleTheme() {
    set({ theme: settings.value.theme === 'dark' ? 'light' : 'dark' })
  }

  return { settings, load, set, toggleTheme, applyTheme }
}
