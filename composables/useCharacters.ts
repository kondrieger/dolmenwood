/**
 * Каталог персонажей поверх файлового хранилища.
 *
 * Список грузится с сервера один раз и живёт в useState, поэтому чтение
 * остаётся синхронным (важно для листа, который постоянно перерисовывается).
 * Запись уходит на сервер с задержкой, чтобы правка поля не била по диску
 * на каждое нажатие клавиши.
 */

export type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export function useCharacters() {
  const list = useState<any[]>('dw-characters', () => [])
  const loaded = useState<boolean>('dw-characters-loaded', () => false)
  const saveState = useState<SaveState>('dw-save-state', () => 'idle')

  /** Таймеры отложенной записи — по одному на персонажа. */
  const timers = useState<Record<string, any>>('dw-save-timers', () => ({}))

  async function load(force = false) {
    if (loaded.value && !force) return list.value
    const res = await $fetch<{ characters: any[] }>('/api/characters')
    list.value = res.characters || []
    loaded.value = true
    return list.value
  }

  function get(id: string) {
    return list.value.find((c) => c.id === id) || null
  }

  /** Немедленная запись на диск. */
  async function flush(ch: any) {
    saveState.value = 'saving'
    try {
      const saved = await $fetch(`/api/characters/${ch.id}`, { method: 'PUT', body: ch })
      const i = list.value.findIndex((c) => c.id === ch.id)
      if (i >= 0) list.value[i] = { ...list.value[i], updatedAt: (saved as any).updatedAt }
      saveState.value = 'saved'
      setTimeout(() => { if (saveState.value === 'saved') saveState.value = 'idle' }, 1400)
      return saved
    } catch (e) {
      saveState.value = 'error'
      console.error('Не удалось сохранить персонажа', e)
      throw e
    }
  }

  /** Отложенная запись: правки полей копятся 600 мс. */
  function save(ch: any, immediate = false) {
    const i = list.value.findIndex((c) => c.id === ch.id)
    if (i >= 0) list.value[i] = ch
    else list.value.unshift(ch)

    if (immediate) return flush(ch)

    clearTimeout(timers.value[ch.id])
    saveState.value = 'saving'
    timers.value[ch.id] = setTimeout(() => flush(ch).catch(() => {}), 600)
    return Promise.resolve(ch)
  }

  async function remove(id: string) {
    clearTimeout(timers.value[id])
    await $fetch(`/api/characters/${id}`, { method: 'DELETE' })
    list.value = list.value.filter((c) => c.id !== id)
  }

  async function setStatus(id: string, status: string) {
    const ch = get(id)
    if (!ch) return null
    ch.status = status
    if (status === 'dead' && !ch.diedAt) ch.diedAt = new Date().toISOString()
    if (status !== 'dead') delete ch.diedAt
    await flush(ch)
    return ch
  }

  return { list, loaded, saveState, load, get, save, flush, remove, setStatus }
}
