(function () {
  function metaKey(storageKey) {
    return `${storageKey}__meta`;
  }

  function deepCopy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function read(storageKey) {
    try {
      return JSON.parse(localStorage.getItem(storageKey));
    } catch (_) {
      return null;
    }
  }

  function load(storageKey, seedData) {
    const saved = read(storageKey);
    if (saved) return saved;
    return deepCopy(seedData);
  }

  function save(storageKey, data) {
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  function readMeta(storageKey) {
    try {
      return JSON.parse(localStorage.getItem(metaKey(storageKey))) || {};
    } catch (_) {
      return {};
    }
  }

  function writeMeta(storageKey, meta) {
    localStorage.setItem(metaKey(storageKey), JSON.stringify(meta || {}));
  }

  function markLocalWrite(storageKey, isoTime) {
    const meta = readMeta(storageKey);
    meta.lastLocalWriteAt = isoTime || new Date().toISOString();
    writeMeta(storageKey, meta);
  }

  function getLocalWriteTime(storageKey) {
    const meta = readMeta(storageKey);
    return meta.lastLocalWriteAt || null;
  }

  window.TrackerStorage = {
    deepCopy,
    read,
    load,
    save,
    markLocalWrite,
    getLocalWriteTime
  };
})();
