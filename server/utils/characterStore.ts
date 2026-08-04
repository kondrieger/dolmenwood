import { promises as fs } from 'node:fs'
import { join, resolve } from 'node:path'

/** Персонажи лежат по одному файлу на каждого: characters/<id>.json */
const DIR = resolve(process.cwd(), 'characters')

/** Идентификатор используется как имя файла — пускаем только безопасные. */
const ID_RE = /^[a-zA-Z0-9_-]{3,80}$/

export function assertId(id: string): string {
  if (!ID_RE.test(id)) {
    throw createError({ statusCode: 400, statusMessage: 'Недопустимый идентификатор персонажа' })
  }
  return id
}

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true })
}

function fileFor(id: string) {
  return join(DIR, `${assertId(id)}.json`)
}

export async function listCharacters(): Promise<any[]> {
  await ensureDir()
  const files = (await fs.readdir(DIR)).filter((f) => f.endsWith('.json'))
  const out: any[] = []
  for (const f of files) {
    try {
      out.push(JSON.parse(await fs.readFile(join(DIR, f), 'utf8')))
    } catch {
      // Битый файл не должен ронять весь каталог — просто пропускаем.
    }
  }
  out.sort((a, b) => String(b.updatedAt || b.generatedAt || '').localeCompare(String(a.updatedAt || a.generatedAt || '')))
  return out
}

export async function readCharacter(id: string): Promise<any | null> {
  try {
    return JSON.parse(await fs.readFile(fileFor(id), 'utf8'))
  } catch {
    return null
  }
}

export async function writeCharacter(id: string, data: any): Promise<any> {
  await ensureDir()
  const record = { ...data, id: assertId(id), updatedAt: new Date().toISOString() }
  // Пишем через временный файл, чтобы при сбое не остался обрезанный JSON.
  const target = fileFor(id)
  const tmp = `${target}.tmp`
  await fs.writeFile(tmp, JSON.stringify(record, null, 2), 'utf8')
  await fs.rename(tmp, target)
  return record
}

export async function deleteCharacter(id: string): Promise<boolean> {
  try {
    await fs.unlink(fileFor(id))
    return true
  } catch {
    return false
  }
}

/* ---- Настройки интерфейса (один файл на всё приложение) ---- */

const SETTINGS_FILE = resolve(process.cwd(), 'data', 'settings.json')

const DEFAULT_SETTINGS = {
  mode: 'class',
  kindred: 'human',
  cls: 'fighter',
  abilityMethod: '3d6-in-order',
  gender: 'any',
  moonSign: true,
  animate: true,
  theme: 'dark'
}

export async function readSettings(): Promise<Record<string, any>> {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(await fs.readFile(SETTINGS_FILE, 'utf8')) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export async function writeSettings(patch: Record<string, any>): Promise<Record<string, any>> {
  const next = { ...(await readSettings()), ...patch }
  await fs.mkdir(resolve(process.cwd(), 'data'), { recursive: true })
  await fs.writeFile(SETTINGS_FILE, JSON.stringify(next, null, 2), 'utf8')
  return next
}
