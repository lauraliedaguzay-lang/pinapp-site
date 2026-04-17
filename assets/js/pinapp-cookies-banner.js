/**
 * Bandeau cookies — cookies strictement nécessaires, pas de tracking publicitaire.
 * Clé localStorage : pp-cookies (ok | no). Les valeurs historiques « ko » sont traitées comme un refus enregistré.
 */
(function () {
  'use strict';

  var KEY = 'pp-cookies';

  function stored() {
    try {
      return localStorage.getItem(KEY);
    } catch (e) {
      return 'ok';
    }
  }

  function hide(el) {
    if (el) el.style.display = 'none';
  }

  function wire(bar) {
    var acc = bar.querySelector('[data-pp-cookie-accept]');
    var rej = bar.querySelector('[data-pp-cookie-refuse]');
    function close(val) {
      hide(bar);
      try {
        localStorage.setItem(KEY, val);
      } catch (e) {}
    }
    if (acc) acc.addEventListener('click', function () { close('ok'); });
    if (rej) rej.addEventListener('click', function () { close('no'); });
  }

  function init() {
    if (document.getElementById('cookie-banner')) return;
    var v = stored();
    if (v === 'ok' || v === 'no' || v === 'ko') {
      hide(document.getElementById('ppCookies'));
      hide(document.getElementById('pp-cookies'));
      return;
    }

    var existing = document.getElementById('ppCookies') || document.getElementById('pp-cookies');
    if (existing) {
      existing.style.display = 'flex';
      wire(existing);
      return;
    }

    var bar = document.createElement('div');
    bar.id = 'ppCookies';
    bar.setAttribute('role', 'region');
    bar.setAttribute('aria-label', 'Cookies');
    bar.style.cssText =
      'position:fixed;bottom:0;left:0;right:0;background:rgba(5,10,20,0.95);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);padding:1rem 1.5rem;z-index:99998;border-top:1px solid rgba(0,229,204,0.1);font-size:0.813rem;color:rgba(232,244,248,0.7);display:flex;align-items:center;justify-content:space-between;gap:1rem;flex-wrap:wrap;box-sizing:border-box;font-family:Inter,system-ui,sans-serif;';

    bar.innerHTML =
      '<p style="margin:0;flex:1;min-width:200px;line-height:1.5;">Ce site utilise des cookies strictement nécessaires. Aucun tracking publicitaire. <a href="/legal/confidentialite.html" style="color:#00E5B0;text-decoration:none;">En savoir plus</a></p>' +
      '<div style="display:flex;gap:0.5rem;flex-shrink:0;">' +
      '<button type="button" data-pp-cookie-accept style="padding:0.5rem 1.25rem;background:#7B4FE8;color:#fff;border:none;border-radius:100px;cursor:pointer;font-size:0.813rem;">Accepter</button>' +
      '<button type="button" data-pp-cookie-refuse style="padding:0.5rem 1.25rem;background:transparent;color:rgba(232,244,248,0.55);border:1px solid rgba(232,244,248,0.15);border-radius:100px;cursor:pointer;font-size:0.813rem;">Refuser</button>' +
      '</div>';

    document.body.appendChild(bar);
    wire(bar);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
