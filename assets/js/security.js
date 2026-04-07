/**
 * Pinapp Security Utilities
 * Sanitize user input before DOM injection to prevent XSS.
 */
(function(w) {
  'use strict';

  /**
   * Escape HTML special characters.
   * Use this on any user-supplied or localStorage value before innerHTML injection.
   */
  function htmlEscape(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitize a localStorage value (parse JSON safely + escape).
   */
  function safeLocalStorage(key) {
    try {
      var raw = localStorage.getItem(key);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      // Deep escape all string values
      return deepEscape(obj);
    } catch(e) {
      return null;
    }
  }

  function deepEscape(obj) {
    if (typeof obj === 'string') return htmlEscape(obj);
    if (Array.isArray(obj)) return obj.map(deepEscape);
    if (obj && typeof obj === 'object') {
      var out = {};
      Object.keys(obj).forEach(function(k) { out[k] = deepEscape(obj[k]); });
      return out;
    }
    return obj;
  }

  w.PinappSec = { htmlEscape: htmlEscape, safeLocalStorage: safeLocalStorage };
})(window);