/* Сборка промпта для генератора изображений по сгенерированному персонажу. */

var KINDRED_LOOK = {
  human: 'a human',
  breggle: 'a breggle — a goat-headed humanoid with a caprine face, cloven-ish hands, woolly fur and curling horns',
  elf: 'an elf of Fairy — human-like but unmistakably otherworldly, carrying an air of unearthly, cold beauty',
  grimalkin: 'a grimalkin — a small upright cat-fairy in estray form: a humanoid cat, roughly 3 feet tall, walking on two legs and wearing clothes',
  mossling: 'a mossling — a short, squat, pot-bellied humanoid of gnarled bark-like skin in green, yellow and brown, patched with moss, lichen and fungus; hair and beard are plant-like, mossy green or black',
  woodgrue: 'a woodgrue — a small bat-faced demi-fey goblin about 3 feet tall, with huge flapping ears and soft down on head and chest, the rest of the body like a human child'
};

var HORN_BY_LEVEL = { 1: 'very short 1-inch horns (shorthorn caste)', 4: '4-inch horns (longhorn caste)' };

function join(list) {
  return list.filter(function (x) { return x && String(x).trim(); }).join(', ');
}

function buildEn(ch) {
  var kin = ch.kindred.id;
  var d = ch.details || {};
  var eq = ch.equipment || {};
  var bits = [];

  bits.push('Fantasy character portrait, three-quarter view, full figure');
  bits.push('subject: ' + (KINDRED_LOOK[kin] || 'a humanoid'));

  /* Пол и возраст */
  var g = ch.gender === 'male' ? 'male' : (ch.gender === 'female' ? 'female' : 'androgynous');
  var age = ch.physical && ch.physical.age;
  var ageWord = '';
  if (kin === 'human' || kin === 'breggle') {
    ageWord = age < 22 ? 'young' : (age < 32 ? 'adult' : 'weathered');
  } else if (kin === 'mossling') {
    ageWord = 'ancient but hale';
  } else if (kin === 'elf' || kin === 'grimalkin') {
    ageWord = 'ageless';
  }
  bits.push(join([g, ageWord]));

  /* Приметы */
  var look = [];
  ['head', 'face', 'body', 'fur'].forEach(function (k) {
    if (d[k]) look.push(d[k].en.toLowerCase());
  });
  if (look.length) bits.push('features: ' + look.join('; '));

  if (kin === 'breggle') bits.push('horns: ' + HORN_BY_LEVEL[1]);
  if (kin === 'mossling' && ch.magic && ch.magic.symbioticFlesh) {
    bits.push('symbiotic growth: ' + ch.magic.symbioticFlesh.map(function (s) { return s.en.replace(/\.$/, '').toLowerCase(); }).join('; '));
  }

  /* Одежда и снаряжение */
  if (d.dress) bits.push('clothing: ' + d.dress.en.toLowerCase());
  var gear = [];
  if (eq.armour && eq.armour.id !== 'none') gear.push(eq.armour.en.toLowerCase());
  if (eq.shield) gear.push('a shield');
  (eq.weapons || []).forEach(function (w) { gear.push(w.en.toLowerCase()); });
  (eq.equipped || []).forEach(function (i) {
    if (i.cat === 'tools' || i.cat === 'holy') gear.push(i.en.toLowerCase());
  });
  if (gear.length) bits.push('carrying: ' + gear.join(', '));

  /* Профессия и характер */
  bits.push('profession: level ' + (ch.level || 1) + ' ' + ch.profile.en.toLowerCase().replace(' kindred-class', '') +
    (ch.background ? ', formerly a ' + ch.background.en.toLowerCase() : ''));
  if (d.demeanour) bits.push('demeanour: ' + d.demeanour.en.toLowerCase());

  /* Сеттинг и стиль */
  bits.push('setting: Dolmenwood — a tangled fairytale forest of ancient oaks, standing stones, toadstools and drifting mist; overcast, autumnal light');
  bits.push('style: painterly old-school fantasy illustration, muted earthy palette of moss green, bark brown, ochre and faded gold, fine ink linework, storybook folk-horror mood, detailed but not glossy');
  bits.push('no text, no watermark, no modern objects');

  return bits.filter(Boolean).join('. ') + '.';
}

function buildRu(ch) {
  var d = ch.details || {};
  var eq = ch.equipment || {};
  var parts = [];
  parts.push('Портрет фэнтезийного персонажа в полный рост, вид в три четверти');
  parts.push('Кто: ' + ch.kindred.ru.toLowerCase() + ', ' +
    (ch.gender === 'male' ? 'мужчина' : (ch.gender === 'female' ? 'женщина' : 'пол неясен')) +
    ', ' + ch.profile.ru.toLowerCase() + ' ' + (ch.level || 1) + ' уровня' + (ch.background ? ' (в прошлом — ' + ch.background.ru.toLowerCase() + ')' : ''));
  var look = [];
  ['head', 'face', 'body', 'fur'].forEach(function (k) { if (d[k]) look.push(d[k].label.toLowerCase() + ': ' + d[k].ru.toLowerCase()); });
  if (look.length) parts.push('Внешность — ' + look.join('; '));
  if (d.dress) parts.push('Одежда: ' + d.dress.ru.toLowerCase());
  var gear = [];
  if (eq.armour && eq.armour.id !== 'none') gear.push(eq.armour.ru.toLowerCase());
  if (eq.shield) gear.push('щит');
  (eq.weapons || []).forEach(function (w) { gear.push(w.ru.toLowerCase()); });
  if (gear.length) parts.push('Снаряжение: ' + gear.join(', '));
  if (d.demeanour) parts.push('Настроение: ' + d.demeanour.ru.toLowerCase());
  parts.push('Место: Дольменвуд — сказочный спутанный лес древних дубов, стоячих камней, поганок и ползущего тумана; пасмурный осенний свет');
  parts.push('Стиль: живописная старошкольная фэнтези-иллюстрация, приглушённая земляная палитра (мох, кора, охра, потускневшее золото), тонкая тушевая линия, настроение книжного фольк-хоррора');
  parts.push('Без текста и водяных знаков');
  return parts.join('. ') + '.';
}

export const portraitPrompt = function (ch) {
  return { en: buildEn(ch), ru: buildRu(ch) };
};
