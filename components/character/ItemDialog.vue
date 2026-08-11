<script setup lang="ts">
/**
 * Карточка одного предмета: что о нём говорит книга и что игрок поправил руками.
 * Тот же диалог создаёт свой предмет, которого в книге нет.
 */
import {
  itemAt, bookEntry, divergences, updateItem, resetToBook,
  relocateItem, removeItem, addCustomItem
} from '~/utils/sheet.js'
import { formatPrice, priceCp } from '~/utils/money.js'

interface Props {
  character: any
  /** Где лежит предмет; 'new' — режим создания своего предмета. */
  where: string
  index?: number
}
const props = withDefaults(defineProps<Props>(), { index: 0 })
const emit = defineEmits<{ close: []; changed: [] }>()

const creating = computed(() => props.where === 'new')
const item = computed<any>(() => (creating.value ? null : itemAt(props.character, props.where, props.index)))
const book = computed<any>(() => bookEntry(item.value))
const diffs = computed(() => (item.value ? divergences(item.value) : []))

/* Куда предмет можно переложить. Броня и щит носятся только надетыми,
   имущество живёт отдельно — их не двигаем. */
const movable = computed(() => ['weapons', 'equipped', 'stowed'].includes(props.where))
const targets = computed(() => {
  if (!movable.value) return []
  const all = [
    { id: 'weapons', ru: 'В руках' },
    { id: 'equipped', ru: 'На себе' },
    { id: 'stowed', ru: 'В рюкзаке' }
  ]
  // Оружие не кладут в «на себе»: атаки берутся из списка «в руках».
  const isWeapon = item.value?.kind === 'weapon'
  return all.filter((t) => (isWeapon ? t.id !== 'equipped' : t.id !== 'weapons'))
})

/* Черновик правки: сначала показываем, что есть, пишем по кнопке. */
const draft = reactive<any>({
  ru: '', en: '', qty: 1, weight: '', cp: '', slots: 0, dmg: '', d: '', kind: 'gear', size: 'Medium'
})
const target = ref(props.where)

watchEffect(() => {
  const it = item.value
  if (!it) return
  draft.ru = it.ru ?? ''
  draft.en = it.en ?? ''
  draft.qty = it.qty ?? 1
  draft.weight = it.weight ?? ''
  draft.cp = priceCp(it) ?? ''
  draft.slots = it.slots ?? 0
  draft.dmg = it.dmg ?? ''
  draft.d = it.d ?? ''
  target.value = props.where
})

const FIELD_RU: Record<string, string> = {
  ru: 'Название', en: 'Название по-английски', weight: 'Вес',
  cp: 'Цена', slots: 'Слоты', dmg: 'Урон'
}

function apply() {
  const patch: any = {
    ru: draft.ru, en: draft.en, qty: Number(draft.qty) || 1,
    weight: draft.weight === '' ? null : Number(draft.weight),
    cp: draft.cp === '' ? null : Number(draft.cp),
    slots: Number(draft.slots) || 0,
    d: draft.d
  }
  if (item.value?.kind === 'weapon') patch.dmg = draft.dmg
  updateItem(props.character, props.where, props.index, patch)
  if (movable.value && target.value !== props.where) {
    relocateItem(props.character, props.where, props.index, target.value)
  }
  emit('changed')
  emit('close')
}

function toBook() {
  resetToBook(props.character, props.where, props.index)
  emit('changed')
  emit('close')
}

function drop() {
  if (!confirm(`Убрать «${item.value?.ru}» из листа?`)) return
  removeItem(props.character, props.where, props.index)
  emit('changed')
  emit('close')
}

/* --- создание своего предмета --- */
const newDraft = reactive<any>({
  ru: '', en: '', qty: 1, weight: '', cp: '', slots: 1, d: '', kind: 'gear', dmg: '1d6', size: 'Medium'
})
const newTarget = ref('stowed')
const canCreate = computed(() => String(newDraft.ru).trim().length > 0)

function create() {
  if (!canCreate.value) return
  addCustomItem(props.character, newDraft.kind === 'weapon' && newTarget.value === 'weapons' ? 'weapons' : newTarget.value, newDraft)
  emit('changed')
  emit('close')
}
</script>

<template>
  <UiModalDialog
    :title="creating ? 'Свой предмет' : (item?.ru || 'Предмет')"
    :subtitle="creating
      ? 'Того, чего нет в книге. Такой предмет помечается как отсебятина — решает Рефери'
      : (book ? 'Player’s Book' + (book.page ? ', стр. ' + book.page : '') : 'Этого предмета нет в книге')"
    @close="emit('close')"
  >
    <!-- ================= правка существующего ================= -->
    <template v-if="!creating && item">
      <div v-if="item.custom" class="callout warn-callout">
        <b>Свой предмет.</b> Его нет в Player’s Book — правила его не знают.
      </div>
      <div v-else-if="diffs.length" class="callout warn-callout">
        <b>Отличается от книги:</b>
        <ul style="margin: 6px 0 0">
          <li v-for="d in diffs" :key="d.field">
            {{ FIELD_RU[d.field] || d.field }} —
            в книге <b>{{ d.field === 'cp' ? formatPrice(d.book) : d.book }}</b>,
            у нас <b>{{ d.field === 'cp' ? formatPrice(d.ours) : d.ours }}</b>
          </li>
        </ul>
      </div>

      <div v-if="book" class="book-card">
        <div class="book-title">Как в книге</div>
        <div class="book-grid">
          <div><span>Название</span><b>{{ book.ru }} <span class="en">{{ book.en }}</span></b></div>
          <div><span>Цена</span><b>{{ formatPrice(priceCp(book)) }}</b></div>
          <div>
            <span>Вес</span>
            <b>{{ book.weight == null ? '— (в книге не указан)' : book.weight + ' монет' }}</b>
          </div>
          <div v-if="book.dmg"><span>Урон</span><b>{{ book.dmg }} · {{ book.size }}</b></div>
          <div v-if="book.ac"><span>Класс Брони</span><b>{{ book.ac }} · {{ book.bulkRu }}</b></div>
        </div>
        <p v-if="book.d" class="muted" style="margin: 8px 0 0; font-size: 0.84rem">{{ book.d }}</p>
        <p v-if="book.stat" class="muted mono" style="margin: 6px 0 0; font-size: 0.78rem">{{ book.stat }}</p>
      </div>

      <hr class="rule">

      <div class="grid two">
        <label class="field"><span>Название</span>
          <input v-model="draft.ru" class="edit-field" type="text"></label>
        <label class="field"><span>По-английски <span class="en">для VTT</span></span>
          <input v-model="draft.en" class="edit-field" type="text"></label>
        <label class="field"><span>Количество</span>
          <input v-model.number="draft.qty" class="edit-field num" type="number" min="1"></label>
        <label class="field"><span>Вес <span class="en">в монетах</span></span>
          <input v-model="draft.weight" class="edit-field num" type="number" placeholder="не указан"></label>
        <label class="field"><span>Цена <span class="en">в медяках</span></span>
          <input v-model="draft.cp" class="edit-field num" type="number" placeholder="не указана"></label>
        <label class="field"><span>Слоты</span>
          <input v-model.number="draft.slots" class="edit-field num" type="number" min="0"></label>
        <label v-if="item.kind === 'weapon'" class="field"><span>Урон</span>
          <input v-model="draft.dmg" class="edit-field" type="text"></label>
        <label v-if="movable" class="field"><span>Где лежит</span>
          <select v-model="target" class="edit-field">
            <option v-for="t in targets" :key="t.id" :value="t.id">{{ t.ru }}</option>
          </select>
        </label>
      </div>

      <label class="field" style="margin-top: 10px"><span>Заметка</span>
        <textarea v-model="draft.d" class="edit-field" rows="3" /></label>

      <p class="muted" style="font-size: 0.8rem">
        Цена в медяках: 1 зм = 100 мм, 1 см = 10 мм. Сейчас — {{ formatPrice(draft.cp === '' ? null : Number(draft.cp)) }}.
        Пустой вес значит «в книге не указан» и в нагрузку не идёт.
      </p>
    </template>

    <!-- ================= создание своего ================= -->
    <template v-else-if="creating">
      <div class="callout warn-callout">
        Книга — источник истины. Всё, что заведено здесь, ею не предусмотрено
        и будет помечено, чтобы Рефери это видел.
      </div>
      <div class="grid two">
        <label class="field"><span>Название <span class="en">обязательно</span></span>
          <input v-model="newDraft.ru" class="edit-field" type="text" placeholder="Крукхорнское копьё"></label>
        <label class="field"><span>По-английски</span>
          <input v-model="newDraft.en" class="edit-field" type="text" placeholder="Crookhorn Spear"></label>
        <label class="field"><span>Что это</span>
          <select v-model="newDraft.kind" class="edit-field">
            <option value="gear">Снаряжение</option>
            <option value="weapon">Оружие</option>
          </select>
        </label>
        <label class="field"><span>Где лежит</span>
          <select v-model="newTarget" class="edit-field">
            <option v-if="newDraft.kind === 'weapon'" value="weapons">В руках</option>
            <option value="equipped">На себе</option>
            <option value="stowed">В рюкзаке</option>
          </select>
        </label>
        <label class="field"><span>Количество</span>
          <input v-model.number="newDraft.qty" class="edit-field num" type="number" min="1"></label>
        <label class="field"><span>Вес <span class="en">в монетах</span></span>
          <input v-model="newDraft.weight" class="edit-field num" type="number" placeholder="0"></label>
        <label class="field"><span>Цена <span class="en">в медяках</span></span>
          <input v-model="newDraft.cp" class="edit-field num" type="number" placeholder="0"></label>
        <label class="field"><span>Слоты</span>
          <input v-model.number="newDraft.slots" class="edit-field num" type="number" min="0"></label>
        <template v-if="newDraft.kind === 'weapon'">
          <label class="field"><span>Урон</span>
            <input v-model="newDraft.dmg" class="edit-field" type="text" placeholder="1d6"></label>
          <label class="field"><span>Размер</span>
            <select v-model="newDraft.size" class="edit-field">
              <option value="Small">Малое</option>
              <option value="Medium">Среднее</option>
              <option value="Large">Большое</option>
            </select>
          </label>
        </template>
      </div>
      <label class="field" style="margin-top: 10px"><span>Описание и особые свойства</span>
        <textarea v-model="newDraft.d" class="edit-field" rows="3"
                  placeholder="Например: при попадании жертва делает спасбросок против Рока. Трофей, добытый в игре." /></label>
    </template>

    <template v-else>
      <p class="muted">Предмет не найден — возможно, его уже убрали.</p>
    </template>

    <template #footer>
      <template v-if="creating">
        <button class="primary" :disabled="!canCreate" @click="create">
          {{ canCreate ? 'Добавить предмет' : 'Впиши название' }}
        </button>
        <button @click="emit('close')">Отмена</button>
      </template>
      <template v-else-if="item">
        <button class="primary" @click="apply">Сохранить</button>
        <button v-if="book && (diffs.length || item.edited)" @click="toBook">Вернуть как в книге</button>
        <button class="danger" @click="drop">Убрать из листа</button>
        <button @click="emit('close')">Отмена</button>
      </template>
      <button v-else @click="emit('close')">Закрыть</button>
    </template>
  </UiModalDialog>
</template>

<style scoped>
.warn-callout {
  border-left: 3px solid var(--gold);
  margin-bottom: 12px;
}
.book-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 10px 12px;
  background: color-mix(in srgb, var(--gold) 6%, transparent);
}
.book-title {
  font-size: 0.76rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 6px;
}
.book-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 4px 16px;
}
.book-grid span {
  display: block;
  font-size: 0.74rem;
  opacity: 0.7;
}
</style>
