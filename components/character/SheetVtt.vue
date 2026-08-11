<script setup lang="ts">
/**
 * Лист персонажа в раскладке игрового VTT: те же вкладки и те же
 * английские названия полей. Всё, что правилами не выводится, редактируется
 * прямо здесь и сразу уходит в characters/<id>.json.
 */
import * as D from '~/data'
import { recompute, profileOf } from '~/utils/sheet.js'

interface Props {
  character: any
}
const props = defineProps<Props>()
const emit = defineEmits<{
  changed: []
  levelup: []
  items: []
  open: [where: string, index: number]
  custom: []
}>()

const ch = props.character
const tab = ref('stats')
const tabs = [
  { id: 'stats', en: 'Stats', ru: 'Статы', icon: '👤' },
  { id: 'inventory', en: 'Inventory', ru: 'Инвентарь', icon: '🎒' },
  { id: 'magic', en: 'Magic', ru: 'Магия', icon: '✦' },
  { id: 'traits', en: 'Traits', ru: 'Черты', icon: '☀' },
  { id: 'extra', en: 'Extra Details', ru: 'Детали', icon: '◉' },
  { id: 'notes', en: 'Notes', ru: 'Заметки', icon: '📓' }
]

const prof = computed(() => profileOf(ch))
const fm = (n: number) => (n >= 0 ? '+' : '') + n

const ABIL_META: Record<string, { en: string; ru: string; sub: string }> = {
  STR: { en: 'Strength', ru: 'Сила', sub: 'Melee attacks/damage' },
  INT: { en: 'Intelligence', ru: 'Интеллект', sub: 'Extra languages' },
  WIS: { en: 'Wisdom', ru: 'Мудрость', sub: 'Magic Resistance' },
  DEX: { en: 'Dexterity', ru: 'Ловкость', sub: 'AC and missile attacks' },
  CON: { en: 'Constitution', ru: 'Телосложение', sub: 'Hit Points per Level' },
  CHA: { en: 'Charisma', ru: 'Харизма', sub: 'Reaction Rolls' }
}
const ABIL = ['STR', 'INT', 'WIS', 'DEX', 'CON', 'CHA']
const SAVES = [
  { k: 'doom', en: 'Doom', ru: 'Рок' },
  { k: 'ray', en: 'Ray', ru: 'Луч' },
  { k: 'hold', en: 'Hold', ru: 'Захват' },
  { k: 'blast', en: 'Blast', ru: 'Взрыв' },
  { k: 'spell', en: 'Spell', ru: 'Заклинание' }
]

/** Любая правка: пересчитать выводимое и сообщить наверх для сохранения. */
function touch(withRecompute = true) {
  if (withRecompute) recompute(ch)
  emit('changed')
}

function setAbility(key: string, value: string) {
  const n = Math.max(1, Math.min(20, Number(value) || 0))
  ch.abilities[key] = n
  touch()
}

/* Монеты: в книге вес монеты — 1, поэтому золото влияет на нагрузку. */
ch.coins = ch.coins || { copper: 0, silver: 0, gold: ch.gold || 0, pellucidium: 0 }
watch(() => ch.coins.gold, (v) => { ch.gold = Number(v) || 0; touch() })

const xpPercent = computed(() => {
  if (!ch.xpForNextLevel) return 100
  return Math.min(100, Math.round(((ch.xp || 0) / ch.xpForNextLevel) * 100))
})
const canLevelUp = computed(() => ch.xpForNextLevel && (ch.xp || 0) >= ch.xpForNextLevel && ch.level < 15)

const detailKeys = [
  { k: 'head', en: 'Head', ru: 'Голова' },
  { k: 'face', en: 'Face', ru: 'Лицо' },
  { k: 'dress', en: 'Dress', ru: 'Одежда' },
  { k: 'body', en: 'Body', ru: 'Тело' },
  { k: 'demeanour', en: 'Demeanour', ru: 'Нрав' },
  { k: 'desires', en: 'Desires', ru: 'Желания' },
  { k: 'beliefs', en: 'Beliefs', ru: 'Убеждения' },
  { k: 'speech', en: 'Speech', ru: 'Речь' }
]
function detailValue(k: string) {
  const d = ch.details || {}
  if (k === 'body' && !d.body && d.fur) return d.fur.en
  return d[k]?.en || ''
}
function setDetail(k: string, v: string) {
  ch.details = ch.details || {}
  const label = detailKeys.find((x) => x.k === k)
  ch.details[k] = { label: label?.ru || k, labelEn: label?.en || k, ru: ch.details[k]?.ru || v, en: v }
  touch(false)
}

const moonSignEn = computed(() => {
  if (!ch.moonSign) return ''
  const m = /^(.*?)\s*\(([WFw])\)$/.exec(ch.moonSign.en || '')
  if (!m) return ch.moonSign.en
  const phase = m[2] === 'W' ? 'Waxing' : m[2] === 'F' ? 'Full' : 'Waning'
  return `${m[1]} Moon (${phase})`
})
</script>

<template>
  <div class="card vtt-card">
    <div class="card-head">
      <h2>Лист персонажа <span class="en">Character sheet</span></h2>
      <div class="btn-row no-print">
        <button v-if="canLevelUp" class="primary" @click="emit('levelup')">⬆ Повысить уровень</button>
        <button v-else class="small" :disabled="ch.level >= 15" @click="emit('levelup')">Повысить уровень</button>
        <button class="small" @click="emit('items')">🎒 Каталог предметов</button>
      </div>
    </div>
    <p class="muted" style="margin-top: -4px">
      Названия полей те же, что на игровом сайте. Всё, что можно править, правится прямо здесь
      и сразу пишется в файл. Серым показано то, что считается по правилам автоматически.
    </p>

    <div class="vtt-tabs no-print">
      <button v-for="t in tabs" :key="t.id" class="vtt-tab" :class="{ on: tab === t.id }" @click="tab = t.id">
        {{ t.icon }} {{ t.en }}<span class="vtt-ru">{{ t.ru }}</span>
      </button>
    </div>

    <!-- ============ STATS ============ -->
    <div v-show="tab === 'stats'" class="vtt-pane">
      <div class="vtt-panel">
        <div class="vtt-panel-head">Details <span class="vtt-ru">Детали</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Name <span class="vtt-ru">Имя</span></div>
              <input v-model="ch.name.ru" class="edit-field" @input="touch(false)">
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Kindred <span class="vtt-ru">Род</span></div>
              <div class="vtt-value">{{ ch.kindred.en }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Class <span class="vtt-ru">Класс</span></div>
              <div class="vtt-value">{{ ch.profile.mode === 'kindredclass' ? ch.kindred.en : ch.profile.en }}</div>
            </div>
          </div>
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Игрок <span class="vtt-ru">чей персонаж</span></div>
              <select v-model="ch.owner" class="edit-field" @change="touch(false)">
                <option v-for="p in D.PLAYERS" :key="p" :value="p">{{ p }}</option>
              </select>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Affiliation <span class="vtt-ru">Принадлежность</span></div>
              <input v-model="ch.affiliation" class="edit-field" placeholder="—" @input="touch(false)">
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Background <span class="vtt-ru">Прошлое</span></div>
              <input v-model="ch.background.ru" class="edit-field" @input="touch(false)">
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Alignment <span class="vtt-ru">Мировоззрение</span></div>
              <select v-model="ch.alignment.en" class="edit-field" @change="touch(false)">
                <option value="Lawful">Lawful — Закон</option>
                <option value="Neutral">Neutral — Нейтралитет</option>
                <option value="Chaotic">Chaotic — Хаос</option>
              </select>
            </div>
          </div>
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Languages <span class="vtt-ru">Языки</span></div>
              <div class="vtt-value">{{ ch.languages.map((l: any) => l.en).join(', ') }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Level <span class="vtt-ru">Уровень</span></div>
              <div class="vtt-value">{{ ch.level }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">XP <span class="vtt-ru">Опыт ({{ fm(ch.xpModifier) }}% modifier)</span></div>
              <div style="display: flex; gap: 6px; align-items: center">
                <input :value="ch.xp || 0" type="number" class="edit-field num sm" style="width: 6em"
                       @input="ch.xp = Number(($event.target as HTMLInputElement).value) || 0; touch(false)">
                <span class="muted">/ {{ ch.xpForNextLevel || '—' }}</span>
              </div>
              <div class="xp-bar"><div class="xp-fill" :style="{ width: xpPercent + '%' }" /></div>
              <div v-if="canLevelUp" style="font-size: 0.78rem; color: var(--moss)">Хватает на новый уровень!</div>
            </div>
          </div>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Ability Scores <span class="vtt-ru">Характеристики</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-boxes six">
            <div v-for="a in ABIL" :key="a" class="vtt-abil">
              <div class="vtt-box-label">{{ ABIL_META[a].en }}</div>
              <div class="vtt-abil-pair">
                <div>
                  <span class="vtt-mini">Score</span>
                  <input :value="ch.abilities[a]" type="number" class="edit-field num sm"
                         @input="setAbility(a, ($event.target as HTMLInputElement).value)">
                </div>
                <div><span class="vtt-mini">Mod</span><b>{{ ch.mods[a] }}</b></div>
              </div>
              <div class="vtt-box-ru">{{ ABIL_META[a].ru }}</div>
              <div class="vtt-box-sub">{{ ABIL_META[a].sub }}</div>
            </div>
          </div>
          <p class="vtt-note">Модификатор считается по таблице (стр. 22) — меняется сам вслед за значением.</p>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Save Targets <span class="vtt-ru">Спасброски</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-boxes six">
            <div v-for="s in SAVES" :key="s.k" class="vtt-box">
              <div class="vtt-box-label">{{ s.en }}</div>
              <input :value="ch.saves[s.k]" type="number" class="edit-field num"
                     @input="ch.saves[s.k] = Number(($event.target as HTMLInputElement).value) || 0; touch(false)">
              <div class="vtt-box-ru">{{ s.ru }}</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">Magic Res.</div>
              <div class="vtt-box-value">{{ fm(ch.magicResistance) }}</div>
              <div class="vtt-box-ru">Сопр. магии</div>
            </div>
          </div>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Combat <span class="vtt-ru">Бой</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-boxes four">
            <div class="vtt-box">
              <div class="vtt-box-label">HP</div>
              <div style="display: flex; align-items: center; gap: 4px; justify-content: center">
                <input :value="ch.hp.current" type="number" class="edit-field num sm" style="width: 3.2em"
                       @input="ch.hp.current = Number(($event.target as HTMLInputElement).value); touch(false)">
                <span class="muted">/</span>
                <input :value="ch.hp.max" type="number" class="edit-field num sm" style="width: 3.2em"
                       @input="ch.hp.max = Number(($event.target as HTMLInputElement).value); touch(false)">
              </div>
              <div class="vtt-box-ru">Хиты</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">AC</div>
              <div class="vtt-box-value">{{ ch.ac.value }}</div>
              <div class="vtt-box-ru">Класс Брони</div>
              <div class="vtt-box-sub">считается из брони</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">Attack</div>
              <input :value="ch.attack" type="number" class="edit-field num"
                     @input="ch.attack = Number(($event.target as HTMLInputElement).value) || 0; touch(false)">
              <div class="vtt-box-ru">Атака</div>
            </div>
          </div>
          <p class="vtt-note">{{ ch.ac.breakdown.join(' · ') }}</p>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Skill Targets <span class="vtt-ru">Цели навыков</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-boxes six">
            <div class="vtt-box">
              <div class="vtt-box-label">Listen</div>
              <input :value="ch.skills.basic.listen" type="number" class="edit-field num"
                     @input="ch.skills.basic.listen = Number(($event.target as HTMLInputElement).value); touch(false)">
              <div class="vtt-box-ru">Слушать</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">Search</div>
              <input :value="ch.skills.basic.search" type="number" class="edit-field num"
                     @input="ch.skills.basic.search = Number(($event.target as HTMLInputElement).value); touch(false)">
              <div class="vtt-box-ru">Обыскивать</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">Survival</div>
              <input :value="ch.skills.basic.survival" type="number" class="edit-field num"
                     @input="ch.skills.basic.survival = Number(($event.target as HTMLInputElement).value); touch(false)">
              <div class="vtt-box-ru">Выживание</div>
            </div>
            <div v-if="ch.skills.basic.survivalForaging" class="vtt-box">
              <div class="vtt-box-label">Survival (forage)</div>
              <div class="vtt-box-value">{{ ch.skills.basic.survivalForaging }}</div>
              <div class="vtt-box-ru">Собирательство</div>
            </div>
            <div v-for="s in ch.skills.class" :key="s.en" class="vtt-box">
              <div class="vtt-box-label">{{ s.en }}</div>
              <div class="vtt-box-value">{{ s.target }}</div>
              <div class="vtt-box-ru">{{ s.ru }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Movement <span class="vtt-ru">Движение</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-boxes four">
            <div class="vtt-box">
              <div class="vtt-box-label">Speed</div><div class="vtt-box-value">{{ ch.speed.value }}</div>
              <div class="vtt-box-sub">Feet / Round</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">Exploring</div><div class="vtt-box-value">{{ ch.speed.value * 3 }}</div>
              <div class="vtt-box-sub">Feet / Turn</div>
            </div>
            <div class="vtt-box">
              <div class="vtt-box-label">Overland</div><div class="vtt-box-value">{{ Math.floor(ch.speed.value / 5) }}</div>
              <div class="vtt-box-sub">Travel Points / day</div>
            </div>
          </div>
          <p class="vtt-note">Скорость выводится из веса переносимого — правится через инвентарь.</p>
        </div>
      </div>
    </div>

    <!-- ============ INVENTORY ============ -->
    <div v-show="tab === 'inventory'" class="vtt-pane">
      <CharacterInventoryPanel
        :character="ch"
        @changed="touch(true)"
        @items="emit('items')"
        @custom="emit('custom')"
        @open="(where, index) => emit('open', where, index)"
      />
    </div>

    <!-- ============ MAGIC ============ -->
    <div v-show="tab === 'magic'" class="vtt-pane">
      <CharacterMagicPanel :character="ch" />
    </div>

    <!-- ============ TRAITS ============ -->
    <div v-show="tab === 'traits'" class="vtt-pane">
      <div class="vtt-panel">
        <div class="vtt-panel-head">{{ ch.kindred.en }} Traits <span class="vtt-ru">Черты</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-traits">
            <div v-for="t in [...(ch.traits.kindred || []), ...(ch.traits.class || [])]" :key="t.en" class="vtt-trait">
              <b>{{ t.en }}</b><span class="vtt-ru">{{ t.ru }}</span>
            </div>
            <div v-for="t in (ch.combatTalents || [])" :key="t.en" class="vtt-trait">
              <b>{{ t.en }}</b><span class="vtt-ru">{{ t.ru }} — боевой талант</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ EXTRA DETAILS ============ -->
    <div v-show="tab === 'extra'" class="vtt-pane">
      <div class="vtt-panel">
        <div class="vtt-panel-head">Extra Details <span class="vtt-ru">Внешность и повадки</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-row">
            <div v-for="d in detailKeys" :key="d.k" class="vtt-field">
              <div class="vtt-label">{{ d.en }} <span class="vtt-ru">{{ d.ru }}</span></div>
              <input :value="detailValue(d.k)" class="edit-field" @input="setDetail(d.k, ($event.target as HTMLInputElement).value)">
            </div>
          </div>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Kindred Details <span class="vtt-ru">Детали рода</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Kindred Type <span class="vtt-ru">Тип</span></div>
              <div class="vtt-value">{{ ch.kindred.type === 'mortal' ? 'Mortal' : ch.kindred.type === 'fairy' ? 'Fairy' : 'Demi-fey' }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Height (cm) <span class="vtt-ru">Рост</span></div>
              <input :value="ch.physical.heightCm" type="number" class="edit-field"
                     @input="ch.physical.heightCm = Number(($event.target as HTMLInputElement).value); touch(false)">
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Weight (kg) <span class="vtt-ru">Вес</span></div>
              <input :value="ch.physical.weightKg" type="number" class="edit-field"
                     @input="ch.physical.weightKg = Number(($event.target as HTMLInputElement).value); touch(false)">
            </div>
          </div>
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Current Age <span class="vtt-ru">Возраст</span></div>
              <input :value="ch.physical.age" type="number" class="edit-field"
                     @input="ch.physical.age = Number(($event.target as HTMLInputElement).value); touch(false)">
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Lifespan <span class="vtt-ru">Срок жизни</span></div>
              <div class="vtt-value">{{ ch.physical.lifespan }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Moon Sign <span class="vtt-ru">Лунный знак</span></div>
              <div class="vtt-value">{{ moonSignEn || '—' }}</div>
            </div>
          </div>
          <div v-if="ch.birthday" class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Birthday — month <span class="vtt-ru">Месяц</span></div>
              <div class="vtt-value">{{ ch.birthday.monthEn }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Birthday — day <span class="vtt-ru">Число</span></div>
              <div class="vtt-value">{{ ch.birthday.day }}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="vtt-panel">
        <div class="vtt-panel-head">Class Details <span class="vtt-ru">Детали класса</span></div>
        <div class="vtt-panel-body">
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Prime Abilities</div>
              <div class="vtt-value">{{ ch.profile.primeAbilities.map((a: string) => ABIL_META[a].en).join(', ') }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Hit Points</div>
              <div class="vtt-value">1{{ ch.profile.hitDie }} per level</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Combat Aptitude</div>
              <div class="vtt-value">
                {{ ch.profile.aptitude === 'martial' ? 'Martial' : ch.profile.aptitude === 'semi-martial' ? 'Semi-Martial' : 'Non-Martial' }}
              </div>
            </div>
          </div>
          <div class="vtt-row">
            <div class="vtt-field">
              <div class="vtt-label">Armour</div>
              <div class="vtt-value">{{ prof.armourEn || prof.armour }}</div>
            </div>
            <div class="vtt-field">
              <div class="vtt-label">Weapons</div>
              <div class="vtt-value">{{ prof.weaponsEn || prof.weapons }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ============ NOTES ============ -->
    <div v-show="tab === 'notes'" class="vtt-pane">
      <div class="vtt-panel">
        <div class="vtt-panel-head">Notes <span class="vtt-ru">Заметки</span></div>
        <div class="vtt-panel-body">
          <textarea v-model="ch.notes" class="edit-field" style="min-height: 340px; font-family: var(--font)"
                    placeholder="Хроника, зацепки, долги, планы…" @input="touch(false)" />
          <p class="vtt-note">Сохраняется автоматически в characters/{{ ch.id }}.json</p>
        </div>
      </div>
    </div>
  </div>
</template>
