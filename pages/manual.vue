<script setup lang="ts">
/** Ручное добавление уже существующего персонажа — без кубиков, любого уровня. */
import * as D from '~/data'
import { Generator } from '~/utils/generator.js'
import {
  emptyDraft, profileFor, checkDraft, buildCharacter,
  glamourQuota, symbioticQuota, talentQuota, hpRange, languageQuota,
  arcaneKnownAllowed, giftBlocks, ABIL
} from '~/utils/manual.js'
import { matches } from '~/utils/text.js'
import { dice } from '~/utils/dice.js'

const { save, list } = useCharacters()
const router = useRouter()

const draft = ref<any>(emptyDraft())
const prof = computed(() => {
  try { return profileFor(draft.value) } catch { return null }
})
const kin = computed(() => D.KINDREDS[draft.value.kindred])
const issues = computed(() => {
  try { return checkDraft(draft.value) } catch (e: any) { return [{ level: 'error', what: 'Ошибка формы', note: e.message }] }
})
const blocking = computed(() => issues.value.filter((i: any) => i.level === 'error'))
const fm = Generator.fmtMod

const kindredPool = computed(() =>
  draft.value.mode === 'kindredclass' ? D.KINDRED_CLASS_ORDER : D.KINDRED_ORDER
)

watch(() => draft.value.mode, (m) => {
  if (m === 'kindredclass' && !D.KINDRED_CLASS_ORDER.includes(draft.value.kindred)) draft.value.kindred = 'mossling'
})
watch(() => draft.value.kindred, () => {
  if (draft.value.mode === 'class' && !Generator.classAllowedFor(draft.value.kindred, draft.value.cls).ok) {
    const ok = D.CLASS_ORDER.find((c) => Generator.classAllowedFor(draft.value.kindred, c).ok)
    if (ok) draft.value.cls = ok
  }
  // Таблицы примет и безделушек у каждого рода свои — при смене рода сбрасываем.
  draft.value.details = emptyDraft().details
  draft.value.trinket = emptyDraft().trinket
  trinketQuery.value = ''
  draft.value.symbiotic = []
  draft.value.knack = ''
})

const mods = computed(() => {
  const o: Record<string, number> = {}
  ABIL.forEach((a) => { o[a] = Generator.abilityMod(Number(draft.value.abilities[a]) || 0) })
  return o
})
const derived = computed(() => {
  const p = prof.value
  if (!p) return null
  const row = p.advancement[Math.min(15, draft.value.level) - 1]
  return {
    attack: row[3],
    saves: { doom: row[4], ray: row[5], hold: row[6], blast: row[7], spell: row[8] },
    xpNeeded: row[1],
    nextXp: p.advancement[Math.min(15, draft.value.level)] ? p.advancement[Math.min(15, draft.value.level)][1] : null
  }
})
const hp = computed(() => hpRange(draft.value))

/* Таблицы для выпадающих списков внешности.
   Набор у родов разный: у бреггла и гримолкина вместо «Тела» идёт «Шерсть»,
   поэтому берём то, что есть у рода, и подписи тоже из его данных. */
const DETAIL_ORDER = ['head', 'face', 'body', 'fur', 'dress', 'demeanour', 'speech', 'desires', 'beliefs']
const detailTables = computed(() => {
  const k = kin.value
  return [
    ...DETAIL_ORDER
      .filter((key) => k.details[key])
      .map((key) => ({ key, ru: k.details[key].ru, en: k.details[key].en, items: k.details[key].items || [] }))
  ]
})

/* ===== Безделушка рода (стр. 34) =====
   При генерации она бросается по d100; при ручном вводе её можно выбрать,
   бросить честной костью или вписать свою. */
const trinketQuery = ref('')
const trinketList = computed(() => {
  const all = kin.value.trinkets || []
  const q = trinketQuery.value
  return all.filter((t: any) => matches([t.ru, t.en].join(' '), q))
})
const trinketIsCustom = computed(() => {
  const t = draft.value.trinket
  if (!t?.ru) return false
  return !(kin.value.trinkets || []).some((x: any) => x.ru === t.ru)
})

function pickTrinket(en: string) {
  const t = (kin.value.trinkets || []).find((x: any) => x.en === en)
  draft.value.trinket = t ? { ru: t.ru, en: t.en, roll: null } : { ru: '', en: '', roll: null }
}
function rollTrinket() {
  const r = dice.rollD100()
  const all = kin.value.trinkets || []
  const t = all.find((x: any) => r.total >= x.from && r.total <= x.to) || all[all.length - 1]
  draft.value.trinket = { ru: t.ru, en: t.en, roll: r.total }
  trinketQuery.value = ''
}
function customTrinket(text: string) {
  draft.value.trinket = { ru: text, en: text, roll: null }
}

/* Что вообще можно выбрать в «Особых дарах» у этого персонажа.
   Список живёт в manual.js — там же его проверяет сверка по всем родам и классам.
   У вудгрю (и у бреггла до 4 уровня) выбирать нечего: все дары автоматические,
   и пустая карточка только сбивает с толку — прячем её целиком. */
const gifts = computed(() => giftBlocks(draft.value))

const backgroundTable = computed(() => kin.value.backgroundsD100 || kin.value.backgrounds || [])

function toggle(list: string[], value: string, max: number) {
  const i = list.indexOf(value)
  if (i >= 0) list.splice(i, 1)
  else if (max === 0 || list.length < max) list.push(value)
}

const saving = ref(false)
async function create() {
  if (blocking.value.length) return
  saving.value = true
  try {
    const ch = buildCharacter(draft.value, list.value.map((c: any) => c.id))
    await save(ch, true)
    router.push(`/characters/${ch.id}`)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div>
    <div class="card">
      <div class="card-head">
        <h2>Внести существующего персонажа</h2>
        <NuxtLink class="btn small" to="/">🎲 К генератору</NuxtLink>
      </div>
      <p class="muted" style="margin: 0">
        Заполнение вручную, без кубиков — для тех, кто уже создал персонажа за столом или на другом сайте.
        Уровень любой. Всё, что выводится правилами — модификаторы, атака, спасброски, цели навыков, пороги
        опыта, КБ и вес — приложение посчитает само и покажет справа. Нарушения правил не запрещаются молча,
        а выводятся списком внизу.
      </p>
    </div>

    <div class="grid two">
      <!-- ======== ЛЕВАЯ КОЛОНКА: ввод ======== -->
      <div>
        <div class="card">
          <h3>Кто это</h3>
          <label class="field"><span>Схема</span></label>
          <div class="chips">
            <button class="chip" :class="{ on: draft.mode === 'class' }" @click="draft.mode = 'class'">Род + класс</button>
            <button class="chip" :class="{ on: draft.mode === 'kindredclass' }" @click="draft.mode = 'kindredclass'">Род-класс</button>
          </div>

          <label class="field" style="margin-top: 12px"><span>Род <span class="en">Kindred</span></span></label>
          <div class="chips">
            <button v-for="k in kindredPool" :key="k" class="chip" :class="{ on: draft.kindred === k }" @click="draft.kindred = k">
              {{ D.KINDREDS[k].ru }}
            </button>
          </div>

          <template v-if="draft.mode === 'class'">
            <label class="field" style="margin-top: 12px"><span>Класс <span class="en">Class</span></span></label>
            <div class="chips">
              <button
                v-for="c in D.CLASS_ORDER" :key="c" class="chip"
                :class="{ on: draft.cls === c, disabled: !Generator.classAllowedFor(draft.kindred, c).ok }"
                :disabled="!Generator.classAllowedFor(draft.kindred, c).ok"
                :title="Generator.classAllowedFor(draft.kindred, c).why || ''"
                @click="draft.cls = c"
              >{{ D.CLASSES[c].ru }}</button>
            </div>
          </template>

          <label class="field" style="margin-top: 14px">
            <span>Игрок <span class="en">обязательно</span></span>
          </label>
          <div class="chips">
            <button
              v-for="p in D.PLAYERS" :key="p" class="chip"
              :class="{ on: draft.owner === p }" @click="draft.owner = p"
            >{{ p }}</button>
          </div>

          <div class="vtt-row" style="margin-top: 14px">
            <label class="field"><span>Имя по-русски</span>
              <input v-model="draft.nameRu" class="edit-field" placeholder="Обольм Томдаун"></label>
            <label class="field"><span>Имя латиницей <span class="en">для VTT</span></span>
              <input v-model="draft.nameEn" class="edit-field" placeholder="Obolm Tomdown"></label>
          </div>
          <div class="vtt-row">
            <label class="field"><span>Уровень</span>
              <input v-model.number="draft.level" type="number" min="1" max="15" class="edit-field"></label>
            <label class="field"><span>Опыт <span class="en">XP</span></span>
              <input v-model.number="draft.xp" type="number" min="0" class="edit-field"></label>
            <label class="field"><span>Мировоззрение</span>
              <select v-model="draft.alignment" class="edit-field">
                <option value="Lawful">Закон — Lawful</option>
                <option value="Neutral">Нейтралитет — Neutral</option>
                <option value="Chaotic">Хаос — Chaotic</option>
              </select></label>
          </div>
          <div class="vtt-row">
            <label class="field"><span>Пол</span>
              <select v-model="draft.gender" class="edit-field">
                <option value="male">Мужской</option><option value="female">Женский</option><option value="unisex">Не указан</option>
              </select></label>
            <label class="field"><span>Прошлое <span class="en">Background</span></span>
              <select
                class="edit-field"
                @change="(e: any) => { const it = backgroundTable[e.target.selectedIndex - 1]; draft.backgroundRu = it ? it.ru : ''; draft.backgroundEn = it ? it.en : '' }"
              >
                <option value="">— выбери из таблицы рода —</option>
                <option v-for="(b, i) in backgroundTable" :key="i" :value="b.en">{{ b.ru }} — {{ b.en }}</option>
              </select></label>
            <label class="field"><span>Золото</span>
              <input v-model.number="draft.gold" type="number" min="0" class="edit-field"></label>
          </div>
        </div>

        <div class="card">
          <h3>Характеристики</h3>
          <div class="vtt-boxes six">
            <div v-for="a in ABIL" :key="a" class="vtt-box">
              <div class="vtt-box-label">{{ Generator.ABIL_EN[a] }}</div>
              <input v-model.number="draft.abilities[a]" type="number" min="3" max="18" class="edit-field num">
              <div class="vtt-box-ru">{{ Generator.ABIL_RU[a] }}</div>
              <div class="vtt-box-sub">мод. {{ fm(mods[a]) }}</div>
            </div>
          </div>

          <div class="vtt-row" style="margin-top: 14px">
            <label class="field">
              <span>Хиты, максимум <span class="en">HP</span></span>
              <input v-model.number="draft.hpMax" type="number" min="1" class="edit-field">
              <small class="muted">Для {{ draft.level }} ур. допустимо от {{ hp.min }} до {{ hp.max }}</small>
            </label>
            <label class="field" v-if="languageQuota(draft) > 0">
              <span>Дополнительные языки за Интеллект: {{ draft.extraLanguages.length }} из {{ languageQuota(draft) }}</span>
              <div class="chips">
                <button
                  v-for="l in D.COMMON_LANGUAGES" :key="l.en" class="chip"
                  :class="{ on: draft.extraLanguages.includes(l.en) }"
                  @click="toggle(draft.extraLanguages, l.en, languageQuota(draft))"
                >{{ l.ru }}</button>
              </div>
            </label>
          </div>
        </div>

        <!-- Особые дары. Если выбирать нечего — карточки нет вовсе. -->
        <div v-if="prof && gifts.length" class="card">
          <h3>Особые дары</h3>

          <template v-if="glamourQuota(draft) > 0">
            <label class="field"><span>Гламуры: {{ draft.glamours.length }} из {{ glamourQuota(draft) }}</span></label>
            <div class="chips">
              <button
                v-for="g in D.GLAMOURS" :key="g.en" class="chip"
                :class="{ on: draft.glamours.includes(g.en) }"
                :title="g.d"
                @click="toggle(draft.glamours, g.en, glamourQuota(draft))"
              >{{ g.ru }}</button>
            </div>
          </template>

          <template v-if="prof.grantsLesserRune">
            <label class="field" style="margin-top: 14px"><span>Руны фей <span class="en">выбери все, что есть у персонажа</span></span></label>
            <div class="chips">
              <button v-for="r in D.LESSER_RUNES" :key="r.en" class="chip" :class="{ on: draft.lesserRunes.includes(r.en) }" @click="toggle(draft.lesserRunes, r.en, 0)">{{ r.ru }}</button>
            </div>
            <div class="chips" style="margin-top: 6px">
              <button v-for="r in D.GREATER_RUNES" :key="r.en" class="chip" :class="{ on: draft.greaterRunes.includes(r.en) }" @click="toggle(draft.greaterRunes, r.en, 0)">{{ r.ru }} <span class="en">великая</span></button>
            </div>
            <div class="chips" style="margin-top: 6px">
              <button v-for="r in D.MIGHTY_RUNES" :key="r.en" class="chip" :class="{ on: draft.mightyRunes.includes(r.en) }" @click="toggle(draft.mightyRunes, r.en, 0)">{{ r.ru }} <span class="en">могучая</span></button>
            </div>
          </template>

          <template v-if="prof.grantsKnack || (prof.mode === 'class' && kin.id === 'mossling')">
            <label class="field" style="margin-top: 14px"><span>Сноровка <span class="en">Knack</span></span></label>
            <div class="chips">
              <button v-for="k in D.KNACKS" :key="k.en" class="chip" :class="{ on: draft.knack === k.en }" :title="k.d" @click="draft.knack = k.en">{{ k.ru }}</button>
            </div>
          </template>

          <template v-if="symbioticQuota(draft) > 0">
            <label class="field" style="margin-top: 14px">
              <span>Симбиотическая плоть: {{ draft.symbiotic.length }} из {{ symbioticQuota(draft) }} — по одной за уровень</span>
            </label>
            <div class="chips">
              <button
                v-for="s in kin.symbioticFlesh" :key="s.en" class="chip"
                :class="{ on: draft.symbiotic.includes(s.en) }"
                @click="toggle(draft.symbiotic, s.en, symbioticQuota(draft))"
              >{{ s.ru.replace(/\.$/, '') }}</button>
            </div>
          </template>

          <template v-if="talentQuota(draft) > 0">
            <label class="field" style="margin-top: 14px"><span>Боевые таланты: {{ draft.combatTalents.length }} из {{ talentQuota(draft) }}</span></label>
            <div class="chips">
              <button
                v-for="t in prof.combatTalents" :key="t.en" class="chip"
                :class="{ on: draft.combatTalents.includes(t.en) }" :title="t.d"
                @click="toggle(draft.combatTalents, t.en, talentQuota(draft))"
              >{{ t.ru }}</button>
            </div>
          </template>

          <template v-if="prof.grantsSpellBook">
            <label class="field" style="margin-top: 14px"><span>Книга заклинаний</span></label>
            <select v-model="draft.spellBook" class="edit-field">
              <option value="">— выбери книгу —</option>
              <option v-for="b in D.SPELL_BOOKS" :key="b.en" :value="b.en">{{ b.ru }} — {{ b.en }}</option>
            </select>
          </template>

          <template v-if="arcaneKnownAllowed(draft) > 0">
            <label class="field" style="margin-top: 14px">
              <span>Выученные тайные заклинания <span class="en">Arcane spells</span></span>
            </label>
            <p class="muted" style="margin-top: -6px; font-size: 0.84rem">
              С 4 уровня длиннорогий заучивает {{ arcaneKnownAllowed(draft) }} закл. 1 ранга в день (стр. 181).
              Стартовой книги у него нет: заклинания он учит у наставника, из найденных книг или
              исследованием — отметь те, что персонаж уже знает.
            </p>
            <div class="chips">
              <button
                v-for="(s, id) in D.ARCANE_R1" :key="id" class="chip"
                :class="{ on: draft.arcaneSpells.includes(id) }" :title="s.d"
                @click="toggle(draft.arcaneSpells, id, 0)"
              >{{ s.ru }}</button>
            </div>
            <p class="muted" style="font-size: 0.8rem">
              В приложении пока есть только заклинания 1 ранга. Заклинания старших рангов
              вписывай в заметки — выдумывать их из головы нельзя.
            </p>
          </template>

          <template v-if="prof.id === 'cleric' && draft.level >= 2">
            <label class="field" style="margin-top: 14px"><span>Святой орден</span></label>
            <div class="chips">
              <button v-for="o in D.HOLY_ORDERS" :key="o.id" class="chip" :class="{ on: draft.holyOrder === o.id }" :title="o.d" @click="draft.holyOrder = o.id">{{ o.ru }}</button>
            </div>
          </template>

          <template v-if="prof.needsLiege">
            <label class="field" style="margin-top: 14px"><span>Сюзерен</span></label>
            <select class="edit-field" @change="(e: any) => { draft.liege = prof.lieges[e.target.selectedIndex - 1] || null }">
              <option value="">— выбери дом —</option>
              <option v-for="l in prof.lieges" :key="l.n" :value="l.en">{{ l.ru }} ({{ l.al }})</option>
            </select>
          </template>
        </div>

        <div class="card">
          <h3>Внешность и повадки</h3>
          <p class="muted" style="margin-top: -6px; font-size: 0.84rem">Всё необязательно — но с ними промпт для портрета получается куда лучше.</p>
          <div class="vtt-row">
            <label v-for="t in detailTables" :key="t.key" class="field">
              <span>{{ t.ru }} <span class="en">{{ t.en }}</span></span>
              <select v-model="draft.details[t.key]" class="edit-field">
                <option value="">—</option>
                <option v-for="it in t.items" :key="it.en" :value="it.en">{{ it.ru }}</option>
              </select>
            </label>
          </div>

          <div class="vtt-row" style="margin-top: 10px">
            <label class="field"><span>Возраст</span><input v-model.number="draft.physical.age" type="number" class="edit-field"></label>
            <label class="field"><span>Рост, см</span><input v-model.number="draft.physical.heightCm" type="number" class="edit-field"></label>
            <label class="field"><span>Вес, кг</span><input v-model.number="draft.physical.weightKg" type="number" class="edit-field"></label>
            <label class="field"><span>Срок жизни</span><input v-model.number="draft.physical.lifespan" type="number" class="edit-field"></label>
          </div>

          <label v-if="kin.type !== 'fairy'" class="field">
            <span>Лунный знак <span class="en">Moon Sign</span></span>
            <select v-model="draft.moonSign" class="edit-field">
              <option value="">— нет —</option>
              <option v-for="s in D.MOON_SIGNS" :key="s.moonEn" :value="s.moonEn">{{ s.moon }} луна, {{ s.phase }} — {{ s.moonEn }}</option>
            </select>
          </label>

          <hr class="rule">
          <label class="field">
            <span>Безделушка <span class="en">Trinket</span> — таблица рода, стр. 34</span>
          </label>
          <p class="muted" style="margin-top: -6px; font-size: 0.84rem">
            При создании персонаж получает безделушку броском d100. Выбери из таблицы,
            брось кость или впиши свою, если Рефери дал что-то особое.
          </p>

          <div v-if="draft.trinket.ru" class="callout" style="margin-bottom: 10px">
            <b>{{ draft.trinket.ru }}</b>
            <span v-if="draft.trinket.roll" class="muted"> · выпало {{ draft.trinket.roll }}</span>
            <span v-if="trinketIsCustom" class="muted"> · своя, в таблице рода такой нет</span>
            <br><span class="en">{{ draft.trinket.en }}</span>
            <div style="margin-top: 8px">
              <button class="small" @click="draft.trinket = { ru: '', en: '', roll: null }">Убрать</button>
            </div>
          </div>

          <div class="btn-row" style="margin-bottom: 8px">
            <button class="small" @click="rollTrinket">🎲 Бросить d100</button>
          </div>

          <input
            v-model="trinketQuery" type="text" class="edit-field"
            placeholder="Поиск по таблице: свеча, кость, письмо…"
          >
          <select
            class="edit-field" style="margin-top: 8px"
            :value="trinketIsCustom ? '' : draft.trinket.en"
            @change="pickTrinket(($event.target as HTMLSelectElement).value)"
          >
            <option value="">— выбери из таблицы рода ({{ trinketList.length }}) —</option>
            <option v-for="t in trinketList" :key="t.en" :value="t.en">{{ t.from }}–{{ t.to }} · {{ t.ru }}</option>
          </select>

          <label class="field" style="margin-top: 8px">
            <span>…или впиши свою</span>
            <input
              type="text" class="edit-field" :value="trinketIsCustom ? draft.trinket.ru : ''"
              placeholder="Например: обломок рога, добытый в игре"
              @input="customTrinket(($event.target as HTMLInputElement).value)"
            >
          </label>

          <hr class="rule">
          <label class="field"><span>Заметки</span>
            <textarea v-model="draft.notes" class="edit-field" style="min-height: 90px; font-family: var(--font)" /></label>
        </div>
      </div>

      <!-- ======== ПРАВАЯ КОЛОНКА: что посчитано ======== -->
      <div>
        <div class="card" style="position: sticky; top: 78px">
          <h3>Считается по правилам</h3>
          <template v-if="derived && prof">
            <div class="vtt-boxes four">
              <div class="vtt-box"><div class="vtt-box-label">Attack</div><div class="vtt-box-value">{{ fm(derived.attack) }}</div><div class="vtt-box-ru">Атака</div></div>
              <div class="vtt-box"><div class="vtt-box-label">Magic Res.</div><div class="vtt-box-value">{{ fm(mods.WIS + (prof.mode === 'class' && (kin.id === 'elf' || kin.id === 'grimalkin') ? 2 : 0)) }}</div><div class="vtt-box-ru">Сопр. магии</div></div>
              <div class="vtt-box"><div class="vtt-box-label">Hit Die</div><div class="vtt-box-value">{{ prof.hitDie }}</div></div>
            </div>
            <div class="vtt-boxes six" style="margin-top: 10px">
              <div v-for="(v, k) in derived.saves" :key="k" class="vtt-box">
                <div class="vtt-box-label">{{ k }}</div><div class="vtt-box-value">{{ v }}</div>
              </div>
            </div>
            <dl class="kv" style="margin-top: 14px">
              <dt>Главные</dt><dd>{{ prof.primeRu }}</dd>
              <dt>Подготовка</dt><dd>{{ prof.aptitudeRu }}</dd>
              <dt>Броня</dt><dd>{{ prof.armour }}</dd>
              <dt>Оружие</dt><dd>{{ prof.weapons }}</dd>
              <dt>XP на уровень</dt><dd>{{ derived.xpNeeded.toLocaleString('ru-RU') }}</dd>
              <dt>До следующего</dt><dd>{{ derived.nextXp ? derived.nextXp.toLocaleString('ru-RU') : '— максимум' }}</dd>
            </dl>
            <p class="muted" style="font-size: 0.82rem">
              Снаряжение добавишь на странице персонажа через каталог предметов — там же посчитаются КБ, вес и скорость.
            </p>
          </template>

          <hr class="rule">
          <h3>Проверка по книге</h3>
          <p v-if="!issues.length" class="callout good" style="margin: 0">Всё сходится с правилами.</p>
          <div
            v-for="(i, n) in issues" :key="n"
            class="callout"
            :class="{ danger: i.level === 'error', good: i.level === 'info' }"
            style="font-size: 0.86rem"
          >
            <b>{{ i.what }}</b><br>{{ i.note }}
          </div>

          <hr class="rule">
          <button class="primary" style="width: 100%; padding: 12px" :disabled="blocking.length > 0 || saving" @click="create">
            {{ blocking.length ? 'Сначала исправь ошибки' : '💾 Создать персонажа' }}
          </button>
          <p class="muted" style="font-size: 0.8rem; margin-top: 8px">
            Предупреждения (жёлтые) не мешают сохранить — они попадут в раздел «Сверка с книгой»
            на странице персонажа, чтобы их видел гейм-мастер.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
