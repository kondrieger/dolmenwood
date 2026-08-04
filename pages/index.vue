<script setup lang="ts">
/** Генератор персонажа: выбор рода и класса, пошаговый прогон с кубиками. */
import * as D from '~/data'
import { Generator } from '~/utils/generator.js'
import { newCharacterId } from '~/utils/ids.js'

const { settings, set } = useSettings()
const { save, list } = useCharacters()
const router = useRouter()

const result = ref<any>(null)
const shownSteps = ref<any[]>([])
const running = ref(false)
const skipped = ref(false)

const kindredPool = computed(() =>
  settings.value.mode === 'kindredclass' ? D.KINDRED_CLASS_ORDER : D.KINDRED_ORDER
)
const kindred = computed(() => D.KINDREDS[settings.value.kindred])
const klass = computed(() => D.CLASSES[settings.value.cls])
/**
 * В режиме род-класса выбранный класс не участвует вообще, поэтому его
 * ограничения не должны блокировать кнопку. Раньше залежавшийся в настройках
 * «клирик» гасил генерацию для эльфа, гримолкина и вудгрю.
 */
const allowed = computed(() =>
  settings.value.mode === 'kindredclass'
    ? { ok: true, why: '' }
    : Generator.classAllowedFor(settings.value.kindred, settings.value.cls)
)

watch(
  () => settings.value.mode,
  (m) => {
    if (m === 'kindredclass' && !D.KINDRED_CLASS_ORDER.includes(settings.value.kindred)) {
      set({ kindred: 'mossling' })
    }
  }
)
watch(
  () => settings.value.kindred,
  () => {
    if (settings.value.mode === 'class' && !allowed.value.ok) {
      const ok = D.CLASS_ORDER.find((c) => Generator.classAllowedFor(settings.value.kindred, c).ok)
      if (ok) set({ cls: ok })
    }
  }
)

function randomise() {
  const pool = kindredPool.value
  const k = pool[Math.floor(Math.random() * pool.length)]
  set({ kindred: k })
  if (settings.value.mode === 'class') {
    const ok = D.CLASS_ORDER.filter((c) => Generator.classAllowedFor(k, c).ok)
    set({ cls: ok[Math.floor(Math.random() * ok.length)] })
  }
}

async function generate() {
  if (running.value) return
  running.value = true
  skipped.value = false
  shownSteps.value = []
  result.value = null

  const res = Generator.generate({
    mode: settings.value.mode,
    kindred: settings.value.kindred,
    cls: settings.value.cls,
    abilityMethod: settings.value.abilityMethod,
    gender: settings.value.gender,
    moonSign: settings.value.moonSign
  })

  for (const step of res.steps) {
    shownSteps.value.push(step)
    if (settings.value.animate && !skipped.value) {
      await new Promise((r) => setTimeout(r, 520 + (step.dice?.length || 0) * 40))
    }
  }
  result.value = res
  running.value = false
}

const owner = ref('')

async function keep() {
  if (!owner.value) return
  const ch = result.value.character
  // Имя файла складывается из игрока, имени и случайного хвоста —
  // так персонажи в общем репозитории заведомо не столкнутся.
  ch.owner = owner.value
  ch.id = newCharacterId(owner.value, ch.name.ru, list.value.map((c: any) => c.id))
  await save(ch, true)
  router.push(`/characters/${ch.id}`)
}
</script>

<template>
  <div>
    <div class="card">
      <h2>Кузница персонажей</h2>

      <div class="grid two" style="margin-top: 14px">
        <div>
          <label class="field"><span>Схема создания</span></label>
          <div class="chips">
            <button class="chip" :class="{ on: settings.mode === 'class' }" @click="set({ mode: 'class' })">Род + класс</button>
            <button class="chip" :class="{ on: settings.mode === 'kindredclass' }" @click="set({ mode: 'kindredclass' })">
              Род-класс (приложение)
            </button>
          </div>
          <p class="muted" style="margin-top: 8px; font-size: 0.84rem">
            <template v-if="settings.mode === 'class'">
              Классическая схема книги: род даёт особые черты, класс — профессию.
            </template>
            <template v-else>
              Схема из приложения (стр. 180+): род и класс слиты. Черты рода из основной части книги
              <b>не действуют</b>. У людей род-класса нет.
            </template>
          </p>
        </div>
        <div>
          <label class="field"><span>Настройки бросков</span></label>
          <select :value="settings.abilityMethod" class="edit-field" @change="set({ abilityMethod: ($event.target as HTMLSelectElement).value })">
            <option value="3d6-in-order">3d6 по порядку — как в книге</option>
            <option value="4d6-drop-lowest">4d6, отбросить худшую (домашнее правило)</option>
          </select>
          <div style="height: 8px" />
          <select :value="settings.gender" class="edit-field" @change="set({ gender: ($event.target as HTMLSelectElement).value })">
            <option value="any">Пол — случайно</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
            <option value="unisex">Унисекс-имя</option>
          </select>
          <div style="height: 10px" />
          <label class="check">
            <input type="checkbox" :checked="settings.moonSign" @change="set({ moonSign: ($event.target as HTMLInputElement).checked })">
            Бросать <span class="term" data-tip="moon-sign">лунный знак</span>
          </label>
          <label class="check">
            <input type="checkbox" :checked="settings.animate" @change="set({ animate: ($event.target as HTMLInputElement).checked })">
            Анимация кубиков
          </label>
        </div>
      </div>

      <hr class="rule">
      <label class="field"><span>Род <span class="en">Kindred</span></span></label>
      <div class="chips">
        <button
          v-for="k in kindredPool" :key="k" class="chip"
          :class="{ on: settings.kindred === k }" @click="set({ kindred: k })"
        >{{ D.KINDREDS[k].ru }}</button>
      </div>
      <div class="muted" style="margin-top: 9px; font-size: 0.88rem">
        <b>{{ kindred.ru }}</b> — {{ kindred.tagline }} <span class="en">{{ kindred.en }}</span><br>
        {{ kindred.classAdvice }}
      </div>

      <template v-if="settings.mode === 'class'">
        <hr class="rule">
        <label class="field"><span>Класс <span class="en">Class</span></span></label>
        <div class="chips">
          <button
            v-for="c in D.CLASS_ORDER" :key="c" class="chip"
            :class="{ on: settings.cls === c, disabled: !Generator.classAllowedFor(settings.kindred, c).ok }"
            :disabled="!Generator.classAllowedFor(settings.kindred, c).ok"
            :title="Generator.classAllowedFor(settings.kindred, c).why || ''"
            @click="set({ cls: c })"
          >{{ D.CLASSES[c].ru }}</button>
        </div>
        <div class="muted" style="margin-top: 9px; font-size: 0.88rem">
          <b>{{ klass.ru }}</b> — {{ klass.tagline }}<br>
          Хиты {{ klass.hitDie }} · {{ klass.aptitudeRu }} подготовка · главные: {{ klass.primeRu }}<br>
          Броня: {{ klass.armour }}. Оружие: {{ klass.weapons }}.
        </div>
      </template>

      <hr class="rule">
      <div class="btn-row">
        <button class="primary" style="font-size: 1rem; padding: 12px 28px" :disabled="running || !allowed.ok" @click="generate">
          🎲 Сгенерировать персонажа
        </button>
        <button :disabled="running" @click="randomise">Случайный род и класс</button>
        <button v-if="running && settings.animate" @click="skipped = true">⏩ Показать сразу</button>
        <NuxtLink class="btn" to="/manual">✎ Внести готового персонажа</NuxtLink>
      </div>
    </div>

    <div v-if="shownSteps.length" class="card">
      <h2>{{ result ? 'Протокол генерации' : 'Бросаем кости…' }}</h2>
      <div v-for="(s, i) in shownSteps" :key="i" class="step">
        <h3>{{ s.title }}</h3>
        <div v-if="s.subtitle" class="sub">{{ s.subtitle }}</div>
        <DiceTray v-if="s.dice?.length" :groups="s.dice" :animate="settings.animate && !skipped" />
        <ul v-if="s.lines?.length"><li v-for="(l, j) in s.lines" :key="j">{{ l }}</li></ul>
        <div v-if="s.warn" class="warn">{{ s.warn }}</div>
      </div>
    </div>

    <div v-if="result" class="card">
      <h2>{{ result.character.name.ru }}</h2>
      <p class="dim">
        {{ result.character.kindred.ru }} · {{ result.character.profile.ru }} · 1 уровень · {{ result.character.alignment.ru }}
      </p>
      <div class="stat-row" style="margin: 14px 0">
        <div v-for="a in Generator.ABIL" :key="a" class="stat">
          <div class="k">{{ Generator.ABIL_RU[a] }}</div>
          <div class="v">{{ result.character.abilities[a] }}</div>
          <div class="m">{{ Generator.fmtMod(result.character.mods[a]) }}</div>
        </div>
      </div>
      <div class="stat-row">
        <div class="stat"><div class="k">Хиты</div><div class="v">{{ result.character.hp.max }}</div></div>
        <div class="stat"><div class="k">КБ</div><div class="v">{{ result.character.ac.value }}</div></div>
        <div class="stat"><div class="k">Атака</div><div class="v">{{ Generator.fmtMod(result.character.attack) }}</div></div>
        <div class="stat"><div class="k">Скорость</div><div class="v">{{ result.character.speed.value }}</div></div>
        <div class="stat"><div class="k">Золото</div><div class="v">{{ result.character.gold }}</div></div>
      </div>
      <hr class="rule">
      <label class="field"><span>Чей это персонаж? <span class="en">обязательно</span></span></label>
      <div class="chips">
        <button v-for="p in D.PLAYERS" :key="p" class="chip" :class="{ on: owner === p }" @click="owner = p">{{ p }}</button>
      </div>
      <div class="btn-row" style="margin-top: 12px">
        <button class="primary" :disabled="!owner" @click="keep">
          {{ owner ? '💾 Сохранить в файл и открыть лист' : 'Сначала выбери игрока' }}
        </button>
        <button @click="generate">🎲 Перебросить заново</button>
      </div>
    </div>
  </div>
</template>
