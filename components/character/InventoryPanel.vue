<script setup lang="ts">
/** Инвентарь: вес по правилам, перенос между «на себе» и рюкзаком, удаление. */
import { removeItem, moveItem } from '~/utils/sheet.js'
import { Generator } from '~/utils/generator.js'
import { formatPrice } from '~/utils/money.js'

interface Props {
  character: any
}
const props = defineProps<Props>()
const emit = defineEmits<{
  changed: []
  items: []
  /** Открыть карточку предмета: где лежит и под каким номером. */
  open: [where: string, index: number]
  /** Открыть карточку создания своего предмета. */
  custom: []
}>()

const ch = props.character
const counts = Generator.countsForLoad

const load = computed(() => ch.speed?.load ?? Generator.computeLoad(ch).total)
const maxLoad = computed(() => ch.speed?.maxLoad ?? 1600)
const pct = computed(() => Math.min(100, Math.round((load.value / maxLoad.value) * 100)))

const property = computed(() => ch.equipment.property || [])
const equippedGear = computed(() => (ch.equipment.equipped || []).filter((g: any) => counts(g)))
const stowedGear = computed(() => (ch.equipment.stowed || []).filter((g: any) => counts(g)))
const exempt = computed(() =>
  [...(ch.equipment.equipped || []), ...(ch.equipment.stowed || [])].filter((g: any) => !counts(g))
)

function realIndex(list: any[], item: any) {
  return list.indexOf(item)
}
function drop(where: string, item: any) {
  const list = where === 'equipped' ? ch.equipment.equipped : ch.equipment.stowed
  removeItem(ch, where, realIndex(list, item))
  emit('changed')
}
function shift(where: string, item: any) {
  const list = where === 'equipped' ? ch.equipment.equipped : ch.equipment.stowed
  moveItem(ch, where, realIndex(list, item))
  emit('changed')
}
/** Открыть карточку предмета из списка «на себе» или «в рюкзаке». */
function openGear(where: string, item: any) {
  const list = where === 'equipped' ? ch.equipment.equipped : ch.equipment.stowed
  emit('open', where, realIndex(list, item))
}
function dropProperty(i: number) { removeItem(ch, 'property', i); emit('changed') }
function dropWeapon(i: number) { removeItem(ch, 'weapons', i); emit('changed') }
/** Убрать оружие из рук в рюкзак: оно перестаёт быть доступным для атаки, но вес остаётся. */
function stowWeapon(i: number) { moveItem(ch, 'weapons', i); emit('changed') }
function dropArmour() { removeItem(ch, 'armour', 0); emit('changed') }
function dropShield() { removeItem(ch, 'shield', 0); emit('changed') }
</script>

<template>
  <div class="vtt-panel">
    <div class="vtt-panel-head">Encumbrance <span class="vtt-ru">Нагрузка</span></div>
    <div class="vtt-panel-body">
      <div class="load-bar-wrap">
        <div class="load-bar"><div class="load-fill" :style="{ width: pct + '%' }" /></div>
        <div class="load-nums"><b>{{ load }}</b> / {{ maxLoad }} <span class="en">Load</span></div>
      </div>
      <div class="vtt-boxes four" style="margin-top: 10px">
        <div class="vtt-box"><div class="vtt-box-label">Speed</div><div class="vtt-box-value">{{ ch.speed.value }}</div></div>
        <div class="vtt-box">
          <div class="vtt-box-label">Gold</div>
          <input :value="ch.coins.gold" type="number" class="edit-field num"
                 @input="ch.coins.gold = Number(($event.target as HTMLInputElement).value) || 0">
          <div class="vtt-box-ru">Золотые</div>
        </div>
        <div class="vtt-box">
          <div class="vtt-box-label">Silver</div>
          <input v-model.number="ch.coins.silver" type="number" class="edit-field num" @input="emit('changed')">
        </div>
        <div class="vtt-box">
          <div class="vtt-box-label">Copper</div>
          <input v-model.number="ch.coins.copper" type="number" class="edit-field num" @input="emit('changed')">
        </div>
      </div>
      <p class="vtt-note">
        Вес в монетах, 10 монет = 1 фунт. До 400 → Скорость 40 · до 600 → 30 · до 800 → 20 · до 1600 → 10.
        Монеты весят по 1 и считаются.
      </p>
    </div>
  </div>

  <div class="vtt-panel">
    <div class="vtt-panel-head">
      Items <span class="vtt-ru">Предметы</span>
    </div>
    <div class="vtt-panel-body">
      <div class="btn-row no-print" style="margin-bottom: 12px">
        <button class="primary" @click="emit('items')">＋ Добавить из каталога книги</button>
        <button @click="emit('custom')">✎ Свой предмет</button>
      </div>
      <p class="vtt-note" style="margin-top: -6px">
        Щёлкни по названию, чтобы открыть карточку предмета и поправить её.
      </p>

      <table class="item-table">
        <thead>
          <tr><th>На себе <span class="en">Equipped</span></th><th style="text-align: right">Вес</th><th /></tr>
        </thead>
        <tbody>
          <tr v-if="ch.equipment.armour && ch.equipment.armour.id !== 'none'">
            <td>
              <button class="item-open" @click="emit('open', 'armour', 0)">
                <b>{{ ch.equipment.armour.ru }}</b> <span class="en">{{ ch.equipment.armour.en }}</span>
              </button>
              <span class="muted"> · КБ {{ ch.equipment.armour.ac }} · {{ ch.equipment.armour.bulkRu }}</span>
            </td>
            <td class="num">{{ ch.equipment.armour.weight }}</td>
            <td class="row-actions"><button class="small danger" title="Снять" @click="dropArmour">✕</button></td>
          </tr>
          <tr v-if="ch.equipment.shield">
            <td>
              <button class="item-open" @click="emit('open', 'shield', 0)">
                <b>Щит</b> <span class="en">Shield</span>
              </button>
              <span class="muted"> · +1 КБ</span>
            </td>
            <td class="num">100</td>
            <td class="row-actions"><button class="small danger" @click="dropShield">✕</button></td>
          </tr>
          <tr v-for="(w, i) in ch.equipment.weapons" :key="'w' + i">
            <td>
              <button class="item-open" @click="emit('open', 'weapons', i)">
                <b>{{ w.ru }}</b> <span class="en">{{ w.en }}</span>
              </button>
              <span class="muted"> · {{ w.dmg }}</span>
              <span v-if="w.custom" class="mark" title="Своего предмета нет в книге">своё</span>
              <span v-else-if="w.edited" class="mark" title="Значение изменено вручную">правлено</span>
              <div v-if="w.special" class="muted" style="font-size: 0.76rem; color: var(--gold)">{{ w.special }}</div>
            </td>
            <td class="num">{{ w.weight }}</td>
            <td class="row-actions">
              <button class="small" title="Убрать в рюкзак" @click="stowWeapon(i)">↓</button>
              <button class="small danger" @click="dropWeapon(i)">✕</button>
            </td>
          </tr>
          <tr v-for="g in equippedGear" :key="'e' + g.id">
            <td>
              <button class="item-open" @click="openGear('equipped', g)">
                <b>{{ g.ru }}</b> <span class="en">{{ g.en }}</span>
              </button>
              <span v-if="g.qty > 1" class="muted"> ×{{ g.qty }}</span>
              <span v-if="g.custom" class="mark" title="Своего предмета нет в книге">своё</span>
              <span v-else-if="g.edited" class="mark" title="Значение изменено вручную">правлено</span>
            </td>
            <td class="num">{{ (g.weight || 0) * (g.qty || 1) }}</td>
            <td class="row-actions">
              <button class="small" title="В рюкзак" @click="shift('equipped', g)">↓</button>
              <button class="small danger" @click="drop('equipped', g)">✕</button>
            </td>
          </tr>
        </tbody>
      </table>

      <table class="item-table" style="margin-top: 16px">
        <thead>
          <tr><th>В рюкзаке <span class="en">Stowed</span></th><th style="text-align: right">Вес</th><th /></tr>
        </thead>
        <tbody>
          <tr v-for="(g, i) in stowedGear" :key="'s' + i + (g.kind || '') + g.id">
            <td>
              <button class="item-open" @click="openGear('stowed', g)">
                <b>{{ g.ru }}</b> <span class="en">{{ g.en }}</span>
              </button>
              <span v-if="g.qty > 1" class="muted"> ×{{ g.qty }}</span>
              <span v-if="g.custom" class="mark" title="Своего предмета нет в книге">своё</span>
              <span v-else-if="g.edited" class="mark" title="Значение изменено вручную">правлено</span>
              <span v-if="g.kind === 'weapon'" class="muted"> · {{ g.dmg }} · убрано, для атаки надо достать</span>
            </td>
            <td class="num">{{ (g.weight || 0) * (g.qty || 1) }}</td>
            <td class="row-actions">
              <button class="small" :title="g.kind === 'weapon' ? 'Взять в руки' : 'На себя'" @click="shift('stowed', g)">↑</button>
              <button class="small danger" @click="drop('stowed', g)">✕</button>
            </td>
          </tr>
          <tr v-if="!stowedGear.length"><td colspan="3" class="muted">Пусто</td></tr>
        </tbody>
      </table>

      <table v-if="property.length" class="item-table" style="margin-top: 16px">
        <thead>
          <tr><th>Имущество и животные <span class="en">Property</span></th><th style="text-align: right">Цена</th><th /></tr>
        </thead>
        <tbody>
          <tr v-for="(p, i) in property" :key="'p' + i + p.id">
            <td>
              <button class="item-open" @click="emit('open', 'property', i)">
                <b>{{ p.ru }}</b> <span class="en">{{ p.en }}</span>
              </button>
              <span v-if="p.qty > 1" class="muted"> ×{{ p.qty }}</span>
              <div v-if="p.stat" class="muted" style="font-size: 0.74rem">{{ p.stat }}</div>
              <div v-if="p.load" class="muted" style="font-size: 0.74rem">Везёт {{ p.load }} монет на обычной Скорости, вдвое больше — на половинной.</div>
              <div v-if="p.cargo" class="muted" style="font-size: 0.74rem">Груз до {{ p.cargo }} монет.</div>
            </td>
            <td class="num">{{ formatPrice(p.cp) }}</td>
            <td class="row-actions"><button class="small danger" @click="dropProperty(i)">✕</button></td>
          </tr>
        </tbody>
      </table>
      <p v-if="property.length" class="vtt-note">
        Имущество в нагрузку не входит — его несёт не персонаж. Поклажу, навьюченную
        на животное, считает Рефери по его грузоподъёмности (стр. 120).
      </p>

      <p v-if="exempt.length" class="vtt-note">
        Не учитывается по правилу Рефери: {{ exempt.map((g: any) => g.ru).join(', ') }}.
      </p>
      <div v-if="ch.trinket" class="callout" style="margin-top: 12px">
        <b>Безделушка:</b> {{ ch.trinket.ru }}<br><span class="en">{{ ch.trinket.en }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Название предмета — кнопка, но выглядит как текст: щелчок открывает карточку. */
.item-open {
  all: unset;
  cursor: pointer;
  border-bottom: 1px dotted var(--line);
}
.item-open:hover b { color: var(--gold); }
.item-open:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }

/* Пометка, что значение не книжное — Рефери должен это видеть. */
.mark {
  display: inline-block;
  margin-left: 6px;
  padding: 0 6px;
  border: 1px solid var(--gold);
  border-radius: 999px;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--gold);
  vertical-align: middle;
}
</style>
