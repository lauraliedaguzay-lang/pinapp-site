/**
 * PINAPP — previews-carousel.js
 * Remplit les cartes du carousel 3D avec 2 screenshots (desktop + mobile).
 */
(function () {
  'use strict';

  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function cssUrl(u) {
    return 'url("' + String(u || '').replace(/"/g, '%22') + '")';
  }

  function applyCardPreview(card) {
    var desktop = card.getAttribute('data-preview-desktop') || '';
    var mobile = card.getAttribute('data-preview-mobile') || '';
    var stage = card.querySelector('.demo-card-preview-bg');
    if (!stage) return;

    if (desktop) stage.style.backgroundImage = cssUrl(desktop);

    var phone = card.querySelector('.demo-card-preview-phone');
    if (!phone) {
      phone = document.createElement('div');
      phone.className = 'demo-card-preview-phone';
      phone.setAttribute('aria-hidden', 'true');
      stage.parentNode.appendChild(phone);
    }
    if (mobile) phone.style.backgroundImage = cssUrl(mobile);
  }

  function applyAll() {
    qsa('.carousel-3d .demo-card-3d').forEach(applyCardPreview);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyAll);
  } else {
    applyAll();
  }
})();
