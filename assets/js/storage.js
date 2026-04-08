// assets/js/storage.js — Pinapp localStorage centralisé
// TOUTES les opérations localStorage passent ici

const PinappStorage = {
  KEYS: {
    MODE: 'pinapp-mode',
    INTEL: 'pinapp-intel',
    UNIVERS: 'pinapp-univers',
    PRENOM: 'pinapp-prenom',
    OFFRE: 'pinapp-offre',
    THEME: 'pinapp-theme',
  },

  get(key) {
    try {
      const val = localStorage.getItem(key);
      if (!val) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    } catch (e) {
      console.warn('[Storage] get failed:', key);
      return null;
    }
  },

  set(key, value) {
    try {
      const val = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, val);
      return true;
    } catch (e) {
      console.warn('[Storage] set failed:', key);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      Object.values(this.KEYS).forEach((k) => localStorage.removeItem(k));
      return true;
    } catch (e) {
      return false;
    }
  },

  getMode() {
    return this.get(this.KEYS.MODE);
  },
  getUnivers() {
    return this.get(this.KEYS.UNIVERS);
  },
  getPrenom() {
    return this.get(this.KEYS.PRENOM);
  },
  getIntel() {
    return this.get(this.KEYS.INTEL) || {};
  },

  setMode(m) {
    return this.set(this.KEYS.MODE, m);
  },
  setUnivers(u) {
    return this.set(this.KEYS.UNIVERS, u);
  },
  setPrenom(p) {
    return this.set(this.KEYS.PRENOM, p);
  },

  updateIntel(updates) {
    const current = this.getIntel();
    return this.set(this.KEYS.INTEL, {
      ...current,
      ...updates,
      lastUpdate: new Date().toISOString(),
    });
  },
};

window.PinappStorage = PinappStorage;
