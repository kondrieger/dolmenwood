<script setup lang="ts">
/**
 * Мастер повышения уровня.
 * Ведёт по шагам из книги (стр. 25): хиты → атака и спасброски →
 * заклинания и навыки → прочие черты рода и класса → порог следующего уровня.
 * Всё, что по правилам бросается, бросается здесь и пишется в журнал.
 */
import * as D from '~/data'
import { dice } from '~/utils/dice.js'
import { profileOf, kindredOf, recompute } from '~/utils/sheet.js'

interface Props {
  character: any
}
const props = defineProps<Props>()
const emit = defineEmits<{ close: []; applied: [] }>()

const ch = props.character
const prof = profileOf(ch)
const kin = kindredOf(ch)

const fromLevel = ch.level || 1
const toLevel = Math.min(15, fromLevel + 1)
const rowFrom = prof.advancement[fromLevel - 1]
const rowTo = prof.advancement[toLevel - 1]

const fm = (n: number) => (n >= 0 ? '+' : '') + n

/* ---------- 1. Хиты ---------- */
const hpRoll = ref<any>(null)
const hpFixed = toLevel > 10
const hpDie = Number(String(prof.hitDie).slice(1))
const conMod = ch.mods.CON || 0

const hpGain = computed(() => {
  if (hpFixed) return prof.hpAfter10 || 1
  if (!hpRoll.value) return null
  // Модификатор Телосложения прибавляется только до 10 уровня, минимум +1 за уровень.
  return Math.max(1, hpRoll.value.total + conMod)
})

function rollHp() {
  hpRoll.value = dice.roll(1, hpDie)
}
function rerollHp() {
  hpRoll.value = null
  nextTick(rollHp)
}

/* ---------- 3. Заклинания и навыки ---------- */
const spellsFrom = prof.spellsPerDay ? prof.spellsPerDay[fromLevel - 1] : null
const spellsTo = prof.spellsPerDay ? prof.spellsPerDay[toLevel - 1] : null
const spellsChanged = computed(() =>
  spellsFrom && spellsTo && spellsFrom.join(',') !== spellsTo.join(',')
)

const skillChanges = computed(() => {
  const out: any[] = []
  ;(prof.skills || []).forEach((s: any) => {
    const a = s.targets[fromLevel - 1]
    const b = s.targets[toLevel - 1]
    if (a !== b) out.push({ ru: s.ru, en: s.en, from: a, to: b })
  })
  return out
})

/* ---------- 4. Прочие черты ---------- */

/* Боевой талант воина — на 2, 6, 10 и 14 уровнях */
const talentsFrom = prof.talentsByLevel ? prof.talentsByLevel[fromLevel - 1] : 0
const talentsTo = prof.talentsByLevel ? prof.talentsByLevel[toLevel - 1] : 0
const needsTalent = computed(() => talentsTo > talentsFrom)
const talentPick = ref<any>(null)
function rollTalent() {
  const r = dice.roll(1, 8)
  talentPick.value = { ...prof.combatTalents[r.total - 1], rolled: r.total }
}

/* Гламуры — у чароплёта, эльфа и гримолкина */
const glamFrom = prof.glamoursByLevel ? prof.glamoursByLevel[fromLevel - 1] : 0
const glamTo = prof.glamoursByLevel ? prof.glamoursByLevel[toLevel - 1] : 0
const needsGlamours = computed(() => glamTo > glamFrom)
const newGlamours = ref<any[]>([])
function rollGlamour() {
  const known = [...(ch.magic?.glamours || []), ...newGlamours.value].map((g: any) => g.en)
  for (let i = 0; i < 60; i++) {
    const r = dice.roll(1, 20)
    const g = D.GLAMOURS[r.total - 1]
    if (!known.includes(g.en)) { newGlamours.value.push({ ...g, rolled: r.total }); return }
  }
}

/* Руна фей — бросок 2d6 с бонусом за уровень (стр. 92) */
const canGetRune = prof.grantsLesserRune
const runeRoll = ref<any>(null)
const runeBonus = toLevel >= 10 ? 3 : toLevel >= 6 ? 2 : toLevel >= 3 ? 1 : 0
function rollRune() {
  const r = dice.roll(2, 6, runeBonus)
  let kind: string, pool: any[] | null = null
  if (r.total <= 2) kind = 'Капризное недовольство — руны нет'
  else if (r.total <= 7) { kind = 'малая руна'; pool = D.LESSER_RUNES }
  else if (r.total <= 11) { kind = 'великая руна'; pool = D.GREATER_RUNES }
  else { kind = 'могучая руна'; pool = D.MIGHTY_RUNES }
  let rune = null
  if (pool) {
    const p = dice.roll(1, 6)
    rune = { ...pool[p.total - 1], pick: p.total }
  }
  runeRoll.value = { roll: r, kind, rune }
}

/* Симбиотическая плоть мослинга — новая черта на каждом уровне */
const needsSymbiotic = prof.grantsSymbiotic || (prof.mode === 'class' && kin.id === 'mossling')
const newSymbiotic = ref<any>(null)
function rollSymbiotic() {
  const r = dice.roll(1, 20)
  newSymbiotic.value = { ...kin.symbioticFlesh[r.total - 1], rolled: r.total }
}

/* Новая ступень сноровки мослинга — на 3, 5 и 7 уровнях */
const knackTier = computed(() => {
  if (!ch.magic?.knack) return null
  return ch.magic.knack.levels.find((l: any) => l.lv === toLevel) || null
})

/* Святой орден клирика — выбирается на 2 уровне */
const needsHolyOrder = computed(() => prof.id === 'cleric' && toLevel === 2 && !ch.magic?.holyOrder)
const orderPick = ref<any>(null)

/* Прочие пороговые черты */
const milestones = computed(() => {
  const out: string[] = []
  if (kin.id === 'breggle') {
    if (toLevel === 4) out.push('Рога доросли до 4 дюймов — тебя признают длиннорогим. Появляется Взгляд (1 раз в день).')
    if (toLevel === 6) out.push('Урон рогами вырос до 1d6.')
    if (toLevel === 9) out.push('Урон рогами вырос до 1d6+1.')
    if (prof.mode === 'kindredclass' && toLevel === 4) out.push('Длиннорогие начинают изучать тайную магию — заклинания надо выучить у наставника или из книг.')
  }
  if (prof.id === 'knight') {
    if (toLevel === 3) out.push('Тебя посвящают в рыцари: появляется право на герб и на гостеприимство знати.')
    if (toLevel === 5) out.push('Убийца чудовищ: +2 к атаке и урону против Больших существ. Раз в день можно подстегнуть скакуна (+10 Скорости на 6 ходов).')
  }
  if (prof.id === 'cleric' && toLevel === 2) out.push('Клирик получает святую магию и вступает в один из орденов.')
  if (kin.id === 'mossling' && toLevel === 4) out.push('Грибной симбиоз: можно вступать в союз с чудовищными грибами.')
  if (kin.id === 'woodgrue') out.push('Безумное веселье теперь можно играть ' + toLevel + ' раз(а) в день.')
  if (prof.acBonusByLevel && prof.acBonusByLevel[toLevel - 1] !== prof.acBonusByLevel[fromLevel - 1]) {
    out.push('Броня веры выросла до ' + fm(prof.acBonusByLevel[toLevel - 1]) + ' к КБ.')
  }
  return out
})

/* ---------- Готовность и применение ---------- */
const ready = computed(() => {
  if (!hpFixed && !hpRoll.value) return false
  if (needsTalent.value && !talentPick.value) return false
  if (needsGlamours.value && newGlamours.value.length < glamTo - glamFrom) return false
  if (needsSymbiotic && !newSymbiotic.value) return false
  if (needsHolyOrder.value && !orderPick.value) return false
  return true
})

function apply() {
  const log = ch.log || (ch.log = [])
  const push = (label: string, res: any, text: string) => {
    log.push({
      i: log.length + 1, step: 'levelup-' + toLevel, label,
      notation: res ? (res.n + 'd' + res.sides + (res.mod ? fm(res.mod) : '')) : '—',
      dice: res ? res.dice.slice() : [], total: res ? res.total : null,
      result: text, manual: !res
    })
  }

  // 1. Хиты
  ch.hp.max += hpGain.value as number
  ch.hp.current += hpGain.value as number
  push('Хиты за ' + toLevel + ' уровень', hpRoll.value,
    hpFixed ? 'Фиксированные ' + fm(prof.hpAfter10) + ' хитов (после 10 уровня)'
            : hpRoll.value.total + ' ' + fm(conMod) + ' = ' + hpGain.value + ' хитов')

  // 2. Атака и спасброски
  ch.attack = rowTo[3]
  ch.saves = { doom: rowTo[4], ray: rowTo[5], hold: rowTo[6], blast: rowTo[7], spell: rowTo[8] }
  push('Атака и спасброски', null,
    'Атака ' + fm(rowTo[3]) + '; спасброски ' + rowTo.slice(4).join('/'))

  // 3. Заклинания и навыки
  if (spellsTo) {
    ch.magic = ch.magic || {}
    ch.magic.spellsPerDay = spellsTo
    if (spellsChanged.value) push('Заклинаний в день', null, spellsTo.join(' / '))
  }
  if (skillChanges.value.length) {
    ch.skills.class = (prof.skills || []).map((s: any) => ({
      ru: s.ru, en: s.en, target: s.targets[toLevel - 1], d: s.d || ''
    }))
    push('Цели навыков', null, skillChanges.value.map((s) => s.ru + ' ' + s.from + '→' + s.to).join(', '))
  }

  // 4. Черты
  if (talentPick.value) {
    ch.magic = ch.magic || {}
    ch.combatTalents = ch.combatTalents || []
    ch.combatTalents.push({ ru: talentPick.value.ru, en: talentPick.value.en, d: talentPick.value.d })
    push('Боевой талант (d8)', { n: 1, sides: 8, dice: [talentPick.value.rolled], mod: 0, total: talentPick.value.rolled },
      talentPick.value.ru)
  }
  if (newGlamours.value.length) {
    ch.magic = ch.magic || {}
    ch.magic.glamours = [...(ch.magic.glamours || []), ...newGlamours.value.map((g) => ({ ...g, rolled: undefined }))]
    newGlamours.value.forEach((g) => push('Новый гламур (d20)', { n: 1, sides: 20, dice: [g.rolled], mod: 0, total: g.rolled }, g.ru))
  }
  if (runeRoll.value) {
    if (runeRoll.value.rune) {
      ch.magic = ch.magic || {}
      const bucket = runeRoll.value.kind === 'малая руна' ? 'lesserRunes'
        : runeRoll.value.kind === 'великая руна' ? 'greaterRunes' : 'mightyRunes'
      ch.magic[bucket] = [...(ch.magic[bucket] || []), runeRoll.value.rune]
    }
    push('Дар руны фей (2d6' + (runeBonus ? fm(runeBonus) : '') + ')', runeRoll.value.roll,
      runeRoll.value.kind + (runeRoll.value.rune ? ': ' + runeRoll.value.rune.ru : ''))
  }
  if (newSymbiotic.value) {
    ch.magic = ch.magic || {}
    ch.magic.symbioticFlesh = [...(ch.magic.symbioticFlesh || []), { ru: newSymbiotic.value.ru, en: newSymbiotic.value.en }]
    push('Симбиотическая плоть (d20)', { n: 1, sides: 20, dice: [newSymbiotic.value.rolled], mod: 0, total: newSymbiotic.value.rolled },
      newSymbiotic.value.ru)
  }
  if (orderPick.value) {
    ch.magic = ch.magic || {}
    ch.magic.holyOrder = orderPick.value
    push('Святой орден', null, orderPick.value.ru)
  }
  if (knackTier.value) {
    push('Новая ступень сноровки', null, knackTier.value.ru + ' — ' + knackTier.value.d)
  }
  milestones.value.forEach((m) => push('Веха уровня', null, m))

  // 5. Уровень и порог
  ch.level = toLevel
  recompute(ch)
  ch.checksum = Generator.checksum(ch)
  emit('applied')
}
</script>

<template>
  <UiModalDialog
    :title="'Повышение уровня: ' + fromLevel + ' → ' + toLevel"
    :subtitle="ch.name.ru + ' · ' + prof.ru + ' · порядок шагов по Player’s Book, стр. 25'"
    wide
    hide-close
    @close="emit('close')"
  >
    <!-- 1. Хиты -->
    <div class="lvl-step" :class="{ done: hpGain !== null }">
      <h3>1. Хиты</h3>
      <div class="sub">
        <template v-if="hpFixed">После 10 уровня кость не бросается — прибавка фиксированная</template>
        <template v-else>Бросок 1{{ prof.hitDie }} + модификатор Телосложения ({{ fm(conMod) }}), минимум 1 за уровень</template>
      </div>

      <div v-if="!hpFixed && !hpRoll">
        <button class="primary" @click="rollHp">🎲 Бросить 1{{ prof.hitDie }}</button>
      </div>
      <div v-else>
        <span class="lvl-delta">
          <span class="from">{{ ch.hp.max }}</span>
          <span class="lvl-arrow">→</span>
          <b>{{ ch.hp.max + (hpGain || 0) }}</b>
          хитов
        </span>
        <span v-if="hpRoll" class="muted" style="font-size: 0.84rem">
          выпало {{ hpRoll.total }}, Телосложение {{ fm(conMod) }} → {{ hpGain }}
        </span>
        <button v-if="!hpFixed && hpRoll && hpRoll.total <= 2" class="small" style="margin-left: 8px" @click="rerollHp">
          Перебросить (правило стр. 19)
        </button>
      </div>
    </div>

    <!-- 2. Атака и спасброски -->
    <div class="lvl-step done">
      <h3>2. Атака и спасброски</h3>
      <div class="sub">Берутся из таблицы развития — бросков не требуют</div>
      <span v-if="rowFrom[3] !== rowTo[3]" class="lvl-delta">
        Атака <span class="from">{{ fm(rowFrom[3]) }}</span><span class="lvl-arrow">→</span><b>{{ fm(rowTo[3]) }}</b>
      </span>
      <span v-else class="lvl-delta">Атака <b>{{ fm(rowTo[3]) }}</b> — без изменений</span>
      <div style="margin-top: 6px">
        <span v-for="(nm, i) in ['Рок', 'Луч', 'Захват', 'Взрыв', 'Заклинание']" :key="nm" class="lvl-delta">
          {{ nm }}
          <template v-if="rowFrom[i + 4] !== rowTo[i + 4]">
            <span class="from">{{ rowFrom[i + 4] }}</span><span class="lvl-arrow">→</span><b>{{ rowTo[i + 4] }}</b>
          </template>
          <b v-else>{{ rowTo[i + 4] }}</b>
        </span>
      </div>
    </div>

    <!-- 3. Заклинания и навыки -->
    <div v-if="spellsChanged || skillChanges.length" class="lvl-step done">
      <h3>3. Заклинания и навыки</h3>
      <div v-if="spellsChanged" class="sub">Заклинаний в день по рангам</div>
      <div v-if="spellsChanged">
        <span v-for="(n, i) in spellsTo" :key="i" class="lvl-delta">
          Ранг {{ i + 1 }}
          <template v-if="spellsFrom[i] !== n"><span class="from">{{ spellsFrom[i] || '—' }}</span><span class="lvl-arrow">→</span></template>
          <b>{{ n || '—' }}</b>
        </span>
      </div>
      <div v-if="skillChanges.length" style="margin-top: 6px">
        <span v-for="s in skillChanges" :key="s.en" class="lvl-delta">
          {{ s.ru }} <span class="from">{{ s.from }}</span><span class="lvl-arrow">→</span><b>{{ s.to }}</b>
        </span>
      </div>
    </div>

    <!-- 4. Черты, требующие броска или выбора -->
    <div v-if="needsTalent" class="lvl-step" :class="{ done: talentPick }">
      <h3>Боевой талант</h3>
      <div class="sub">Воин получает талант на 2, 6, 10 и 14 уровнях. Можно бросить d8 или выбрать</div>
      <button v-if="!talentPick" class="primary" style="margin-bottom: 10px" @click="rollTalent">🎲 Бросить d8</button>
      <div class="pick-grid">
        <button
          v-for="(t, i) in prof.combatTalents"
          :key="t.en"
          class="pick-card"
          :class="{ on: talentPick && talentPick.en === t.en }"
          @click="talentPick = { ...t, rolled: i + 1 }"
        >
          <b>{{ t.ru }}</b><span>{{ t.d }}</span>
        </button>
      </div>
    </div>

    <div v-if="needsGlamours" class="lvl-step" :class="{ done: newGlamours.length >= glamTo - glamFrom }">
      <h3>Новые гламуры</h3>
      <div class="sub">{{ glamFrom }} → {{ glamTo }}. Гламуры определяются случайно (d20)</div>
      <button v-if="newGlamours.length < glamTo - glamFrom" class="primary" @click="rollGlamour">🎲 Бросить d20</button>
      <div v-for="g in newGlamours" :key="g.en" class="callout good">
        <b>{{ g.ru }}</b> <span class="en">{{ g.en }}</span><br>{{ g.d }}
      </div>
    </div>

    <div v-if="canGetRune" class="lvl-step" :class="{ done: runeRoll }">
      <h3>Дар руны фей</h3>
      <div class="sub">
        При каждом уровне бросается 2d6<template v-if="runeBonus"> с бонусом {{ fm(runeBonus) }} за уровень</template>:
        2 и меньше — руны нет, 3–7 малая, 8–11 великая, 12+ могучая (стр. 92)
      </div>
      <button v-if="!runeRoll" class="primary" @click="rollRune">🎲 Бросить 2d6</button>
      <div v-else class="callout" :class="{ good: runeRoll.rune }">
        Выпало <b>{{ runeRoll.roll.total }}</b> — {{ runeRoll.kind }}
        <template v-if="runeRoll.rune"><br><b>{{ runeRoll.rune.ru }}</b> <span class="en">{{ runeRoll.rune.en }}</span></template>
      </div>
    </div>

    <div v-if="needsSymbiotic" class="lvl-step" :class="{ done: newSymbiotic }">
      <h3>Симбиотическая плоть</h3>
      <div class="sub">мослинг получает новую случайную черту на каждом уровне (d20, стр. 49)</div>
      <button v-if="!newSymbiotic" class="primary" @click="rollSymbiotic">🎲 Бросить d20</button>
      <div v-else class="callout good">{{ newSymbiotic.ru }} <span class="en">{{ newSymbiotic.en }}</span></div>
    </div>

    <div v-if="needsHolyOrder" class="lvl-step" :class="{ done: orderPick }">
      <h3>Святой орден</h3>
      <div class="sub">На 2 уровне клирик вступает в один из орденов (стр. 61)</div>
      <div class="pick-grid">
        <button
          v-for="o in D.HOLY_ORDERS"
          :key="o.id"
          class="pick-card"
          :class="{ on: orderPick && orderPick.id === o.id }"
          @click="orderPick = o"
        >
          <b>{{ o.ru }}</b><span>{{ o.d }}</span>
        </button>
      </div>
    </div>

    <div v-if="knackTier" class="lvl-step done">
      <h3>Новая ступень сноровки: {{ knackTier.ru }}</h3>
      <div class="sub">{{ ch.magic.knack.ru }} — умение {{ toLevel }} уровня</div>
      <p style="margin: 0">{{ knackTier.d }}</p>
    </div>

    <div v-if="milestones.length" class="lvl-step done">
      <h3>Вехи уровня</h3>
      <ul style="margin: 0; padding-left: 20px">
        <li v-for="m in milestones" :key="m">{{ m }}</li>
      </ul>
    </div>

    <div class="lvl-step done">
      <h3>5. Опыт до следующего уровня</h3>
      <div class="sub">Пороги берутся из таблицы развития класса</div>
      <span class="lvl-delta">
        Следующий уровень: <b>{{ prof.advancement[toLevel] ? prof.advancement[toLevel][1].toLocaleString('ru-RU') : '—' }} XP</b>
      </span>
    </div>

    <template #footer>
      <button @click="emit('close')">Отмена</button>
      <button class="primary" :disabled="!ready" @click="apply">
        Применить и стать {{ toLevel }} уровнем
      </button>
    </template>
  </UiModalDialog>
</template>
