<script setup lang="ts">
/** Персональная шпаргалка «как этим играть» с тултипами на термины. */
interface Props { character: any }
const props = defineProps<Props>()
const ch = props.character
const b = computed(() => ch.skills.basic)
const isSmall = computed(() => ch.kindred.size === 'Small')
const isFey = computed(() => ch.kindred.type === 'fairy' || ch.kindred.type === 'demi-fey')
const fm = (n: number) => (n >= 0 ? '+' : '') + n

const personal = computed(() => {
  const out: string[] = []
  if (isSmall.value) out.push('Ты <b>Малого размера</b>: Большое оружие (лэнс, длинный лук, древковое, двуручный меч) недоступно, броню надо подгонять.')
  if (ch.kindred.id === 'grimalkin' || ch.kindred.id === 'woodgrue') out.push(`В ближнем бою с <b>Большими</b> существами твой КБ выше на 2 → <b>${ch.ac.value + 2}</b>.`)
  if (isFey.value) out.push('Ты уязвим к <b>холодному железу</b>: +1 урона тебе.')
  if (ch.kindred.id === 'mossling' && ch.profile.mode === 'class') out.push('<b>Стойкость:</b> +2 ко всем спасброскам и +4 против грибных спор и ядов — прибавляй сам, в числах выше этого нет.')
  if (ch.kindred.id === 'breggle') out.push('<b>Шерсть</b> даёт +1 КБ только без брони или в Лёгкой броне.')
  if (ch.kindred.id === 'human') out.push('<b>Задор:</b> +10% опыта. <b>Решительность:</b> при ничьей в инициативе ходишь первым.')
  if (ch.kindred.id === 'woodgrue') out.push('<b>Лунное зрение:</b> видишь в темноте на 60 футов без штрафов.')
  if (ch.profile.id === 'knight') out.push('<b>Стрелковым оружием не пользуешься</b> — рыцарь считает это бесчестным.')
  if (ch.hp.max <= 3) out.push(`<b>У тебя ${ch.hp.max} хитов.</b> При 0 персонаж <b>умирает</b>. Держись позади.`)
  out.push(`Твой модификатор опыта: <b>${fm(ch.xpModifier)}%</b>. До следующего уровня нужно <b>${ch.xpForNextLevel ?? '—'} XP</b>.`)
  return out
})
</script>

<template>
  <div class="card cheat">
    <h2>Шпаргалка: как этим играть</h2>
    <p class="muted" style="margin-top: -4px">Термины с пунктиром — наведи, появится объяснение.</p>

    <details open>
      <summary>⚡ Твоя личная специфика</summary>
      <div class="body">
        <ul><li v-for="(p, i) in personal" :key="i" v-html="p" /></ul>
      </div>
    </details>

    <details>
      <summary>🎲 Четыре броска, которые решают всё</summary>
      <div class="body">
        <p><b>Бросок атаки</b> — d20 + бонус, нужно набрать <span class="term" data-tip="ac">КБ</span> цели.</p>
        <p><b><span class="term" data-tip="saving-throw">Спасбросок</span></b> — d20, нужно выбросить цель или больше.
          Против магии прибавь {{ fm(ch.magicResistance) }}.</p>
        <p><b><span class="term" data-tip="skill-check">Проверка навыка</span></b> — d6, нужно цель или больше.
          Твои: Слушать {{ b.listen }}+, Обыскивать {{ b.search }}+, Выживание {{ b.survival }}+.</p>
        <p><b><span class="term" data-tip="ability-check">Проверка характеристики</span></b> — d6 + модификатор, нужно 4+.</p>
        <div class="callout">Натуральные 1 и 20 на d20, 1 и 6 на d6 — всегда провал и всегда успех.</div>
      </div>
    </details>

    <details>
      <summary>⚔️ Раунд боя</summary>
      <div class="body">
        <p><b>1. Объявления</b> — заклинание, <span class="term" data-tip="rune">руна</span> или бегство из ближнего боя.</p>
        <p><b>2. <span class="term" data-tip="initiative">Инициатива</span></b> — 1d6 за сторону, заново каждый раунд.</p>
        <p><b>3–4. Действия</b> — движение, стрельба, магия, ближний бой.</p>
        <p><b>5. <span class="term" data-tip="morale">Мораль</span></b> — Рефери проверяет, не побегут ли монстры.</p>
        <div class="callout danger">
          Бегство из ближнего боя объявляется заранее, ты теряешь атаку, а противники получают +2 к атаке и игнорируют щит.
        </div>
        <p class="muted">В ближнем бою движение — половина Скорости ({{ Math.floor(ch.speed.value / 2) }} футов), вне боя — {{ ch.speed.value }}, бег — {{ ch.speed.value * 3 }}.</p>
      </div>
    </details>

    <details>
      <summary>🤝 Встреча и главный совет новичку</summary>
      <div class="body">
        <p><b><span class="term" data-tip="reaction">Реакция</span></b>: 2d6 + Харизма говорящего.
          2− атакуют · 3–5 враждебны · 6–8 насторожены · 9–11 можно договориться · 12+ дружелюбны.
          Твоя Харизма {{ ch.abilities.CHA }} ({{ fm(ch.mods.CHA) }}).</p>
        <div class="callout good">
          Dolmenwood — это OSR: бой смертельно опасен и почти не даёт опыта. Три четверти опыта партия получает
          за <b>вынесенные сокровища</b> — 1 XP за 1 золотой. Прокрасться, подкупить или убежать почти всегда выгоднее драки.
        </div>
      </div>
    </details>

    <details>
      <summary>💀 Раны и смерть</summary>
      <div class="body">
        <div class="callout danger"><b>0 хитов = смерть.</b> Не «без сознания». Именно поэтому осторожность — главный навык.</div>
        <p>Если персонаж погиб — отметь его в каталоге и сгенерируй нового в два клика. Файл старого останется.</p>
      </div>
    </details>
  </div>
</template>
