/**
 * Pinapp Academy — admin demo helpers (unlock/reset).
 * No backend: purely localStorage, safe in static hosting.
 */
(function () {
  'use strict';

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function safeSet(key, value) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  }

  function safeRemove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  function unlockAll() {
    const raw = localStorage.getItem('pinapp-academy-progress');
    const p = raw ? JSON.parse(raw) : { done: {}, score: {}, lastSeen: null };

    // Déverrouille toutes les cartes présentes sur la page admin
    document.querySelectorAll('[data-module][data-module-id]').forEach((card) => {
      const id = card.getAttribute('data-module-id');
      if (id) p.done[id] = true;
    });

    p.lastSeen = new Date().toISOString();
    safeSet('pinapp-academy-progress', JSON.stringify(p));
  }

  function resetAll() {
    safeRemove('pinapp-academy-progress');
  }

  function bind() {
    const btnUnlock = qs('#academyUnlockAll');
    const btnReset = qs('#academyResetAll');

    btnUnlock?.addEventListener('click', () => {
      unlockAll();
      // academy.js recalculates on next tick
      window.setTimeout(() => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }, 0);
    });

    btnReset?.addEventListener('click', () => {
      resetAll();
      window.setTimeout(() => {
        document.dispatchEvent(new Event('DOMContentLoaded'));
      }, 0);
    });
  }

  document.addEventListener('DOMContentLoaded', bind);
})();
