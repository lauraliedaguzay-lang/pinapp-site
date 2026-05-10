(function () {
  var KEY = 'pinapp_cookie_consent_v1';
  function $(sel, root) {
    return (root || document).querySelector(sel);
  }
  function hide(el) {
    if (!el) return;
    el.setAttribute('hidden', '');
    el.classList.remove('is-visible');
    el.setAttribute('aria-hidden', 'true');
  }
  function show(el) {
    if (!el) return;
    try {
      if (localStorage.getItem(KEY) != null) return;
    } catch (e) {
      return;
    }
    el.removeAttribute('hidden');
    el.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      el.classList.add('is-visible');
    });
  }
  function accept() {
    try {
      localStorage.setItem(KEY, 'accepted');
    } catch (e) {}
    hide($('#pinapp-cookie-banner'));
  }
  function reject() {
    try {
      localStorage.setItem(KEY, 'rejected');
    } catch (e) {}
    hide($('#pinapp-cookie-banner'));
  }
  document.addEventListener('DOMContentLoaded', function () {
    show($('#pinapp-cookie-banner'));
  });
  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t || !t.getAttribute) return;
    if (t.getAttribute('data-cookie-accept') != null) {
      e.preventDefault();
      accept();
    } else if (t.getAttribute('data-cookie-reject') != null) {
      e.preventDefault();
      reject();
    }
  });
})();
