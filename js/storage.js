/* Каталог персонажей: localStorage + экспорт/импорт JSON. */
(function () {
  'use strict';

  var KEY = 'dolmenwood.characters.v1';
  var SETTINGS_KEY = 'dolmenwood.settings.v1';

  function safeParse(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; } catch (e) { return fallback; }
  }

  function all() {
    return safeParse(localStorage.getItem(KEY), []);
  }

  function writeAll(list) {
    try {
      localStorage.setItem(KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      alert('Не удалось сохранить в память браузера: ' + e.message + '\nСкачай JSON, чтобы не потерять персонажа.');
      return false;
    }
  }

  function get(id) {
    var list = all();
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function save(ch) {
    var list = all();
    var idx = -1;
    for (var i = 0; i < list.length; i++) if (list[i].id === ch.id) { idx = i; break; }
    ch.updatedAt = new Date().toISOString();
    if (idx >= 0) list[idx] = ch; else list.unshift(ch);
    writeAll(list);
    return ch;
  }

  function remove(id) {
    var list = all().filter(function (c) { return c.id !== id; });
    writeAll(list);
  }

  function setStatus(id, status) {
    var ch = get(id);
    if (!ch) return null;
    ch.status = status;
    if (status === 'dead' && !ch.diedAt) ch.diedAt = new Date().toISOString();
    if (status !== 'dead') delete ch.diedAt;
    return save(ch);
  }

  function settings() {
    return safeParse(localStorage.getItem(SETTINGS_KEY), {
      mode: 'class', kindred: 'human', cls: 'fighter',
      abilityMethod: '3d6-in-order', gender: 'any', moonSign: true, animate: true
    });
  }
  function saveSettings(s) {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); } catch (e) { /* игнорируем */ }
  }

  function slug(ch) {
    var n = (ch.name && ch.name.en) ? ch.name.en : 'character';
    return n.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function download(filename, text) {
    var blob = new Blob([text], { type: 'application/json;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(function () { document.body.removeChild(a); URL.revokeObjectURL(url); }, 100);
  }

  function exportOne(ch) {
    download('dolmenwood-' + slug(ch) + '.json', JSON.stringify(ch, null, 2));
  }
  function exportAll() {
    var payload = {
      schema: 'dolmenwood-catalogue/1',
      exportedAt: new Date().toISOString(),
      characters: all()
    };
    download('dolmenwood-catalogue.json', JSON.stringify(payload, null, 2));
  }

  function importJson(text) {
    var data = JSON.parse(text);
    var incoming = [];
    if (Array.isArray(data)) incoming = data;
    else if (data && Array.isArray(data.characters)) incoming = data.characters;
    else if (data && data.schema === 'dolmenwood-character/1') incoming = [data];
    else throw new Error('Не похоже на файл персонажа Dolmenwood.');

    var list = all();
    var added = 0, updated = 0;
    incoming.forEach(function (ch) {
      if (!ch || !ch.id) return;
      var idx = -1;
      for (var i = 0; i < list.length; i++) if (list[i].id === ch.id) { idx = i; break; }
      if (idx >= 0) { list[idx] = ch; updated++; } else { list.unshift(ch); added++; }
    });
    writeAll(list);
    return { added: added, updated: updated };
  }

  DW.store = {
    all: all, get: get, save: save, remove: remove, setStatus: setStatus,
    settings: settings, saveSettings: saveSettings,
    exportOne: exportOne, exportAll: exportAll, importJson: importJson,
    download: download, slug: slug
  };
})();
