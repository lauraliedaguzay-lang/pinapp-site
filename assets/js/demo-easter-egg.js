/**
 * PR-AE — 5 clics sur la marque (nav ou zone hero coiffeur) → overlay constellation Avalon
 */
(function () {
  'use strict';

  var reduceMotion = false;
  try {
    reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_e) {}

  function findLogoTarget() {
    return (
      document.querySelector('[data-pinapp-demo-logo-easter]') ||
      document.querySelector('.pinapp-demo-logo-easter') ||
      document.querySelector('.demo-nav__brand')
    );
  }

  function injectFadeStyle() {
    if (document.getElementById('pinapp-avalon-easter-style')) return;
    var st = document.createElement('style');
    st.id = 'pinapp-avalon-easter-style';
    st.textContent =
      '@keyframes pinapp-avalon-fadeIn{from{opacity:0}to{opacity:1}}' +
      '#avalon-constellation.pinapp-avalon-overlay{animation:pinapp-avalon-fadeIn 0.55s ease forwards}';
    document.head.appendChild(st);
  }

  function revealConstellation() {
    injectFadeStyle();
    var existing = document.getElementById('avalon-constellation');
    if (existing) existing.remove();

    var overlay = document.createElement('div');
    overlay.id = 'avalon-constellation';
    overlay.className = 'pinapp-avalon-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Constellation Avalon');
    overlay.tabIndex = -1;

    var svgInner =
      '<svg viewBox="0 0 800 600" width="100%" height="100%" aria-hidden="true" focusable="false">' +
      '<circle cx="200" cy="200" r="2" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="3s" repeatCount="indefinite"/></circle>' +
      '<circle cx="350" cy="180" r="3" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="2.5s" repeatCount="indefinite"/></circle>' +
      '<circle cx="500" cy="220" r="2" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="3.5s" repeatCount="indefinite"/></circle>' +
      '<circle cx="600" cy="180" r="3" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="2.8s" repeatCount="indefinite"/></circle>' +
      '<circle cx="280" cy="350" r="2" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="3.2s" repeatCount="indefinite"/></circle>' +
      '<circle cx="420" cy="380" r="3" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="2.7s" repeatCount="indefinite"/></circle>' +
      '<circle cx="550" cy="350" r="2" fill="#C9A96E"><animate attributeName="opacity" values="0;1;0" dur="3.4s" repeatCount="indefinite"/></circle>' +
      '<line x1="200" y1="200" x2="350" y2="180" stroke="#C9A96E" stroke-opacity="0.35" stroke-width="0.5"/>' +
      '<line x1="350" y1="180" x2="500" y2="220" stroke="#C9A96E" stroke-opacity="0.35" stroke-width="0.5"/>' +
      '<line x1="500" y1="220" x2="600" y2="180" stroke="#C9A96E" stroke-opacity="0.35" stroke-width="0.5"/>' +
      '<line x1="280" y1="350" x2="420" y2="380" stroke="#C9A96E" stroke-opacity="0.35" stroke-width="0.5"/>' +
      '<line x1="420" y1="380" x2="550" y2="350" stroke="#C9A96E" stroke-opacity="0.35" stroke-width="0.5"/>' +
      '<text x="400" y="500" text-anchor="middle" fill="#C9A96E" font-family="Georgia, serif" font-size="20" font-style="italic" opacity="0.85">Bienvenue à bord de l\'Avalon</text>' +
      '</svg>';

    if (reduceMotion) {
      overlay.innerHTML =
        '<div style="max-width:28rem;padding:2rem;text-align:center;color:#F4EBD9;font-family:Georgia,serif;font-size:1.1rem;line-height:1.5">' +
        '<p style="margin:0 0 0.75rem;color:#C9A96E">Avalon</p>' +
        '<p style="margin:0;opacity:0.9">Bienvenue à bord — animation réduite (préférences système).</p>' +
        '</div>';
    } else {
      overlay.innerHTML = svgInner;
    }

    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100vw;height:100vh;max-width:100%;' +
      'background:radial-gradient(circle at center,rgba(10,14,26,0.94) 0%,rgba(10,14,26,0.99) 100%);' +
      'z-index:99999;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:1rem;box-sizing:border-box;' +
      'transform:translateZ(0);-webkit-backdrop-filter:blur(8px) saturate(140%);backdrop-filter:blur(8px) saturate(140%);';

    function close() {
      if (overlay && overlay.parentNode) overlay.remove();
    }

    overlay.addEventListener('click', close);
    document.body.appendChild(overlay);
    overlay.focus();

    setTimeout(function () {
      if (document.getElementById('avalon-constellation')) close();
    }, 6000);
  }

  var logo = findLogoTarget();
  if (!logo) return;

  var clicks = 0;
  var resetTimer;

  logo.style.cursor = 'pointer';
  logo.addEventListener(
    'click',
    function () {
      if (reduceMotion) return;
      clicks += 1;
      if (resetTimer) window.clearTimeout(resetTimer);
      if (clicks >= 5) {
        revealConstellation();
        clicks = 0;
      } else {
        resetTimer = window.setTimeout(function () {
          clicks = 0;
        }, 1500);
      }
    },
    true,
  );
})();
