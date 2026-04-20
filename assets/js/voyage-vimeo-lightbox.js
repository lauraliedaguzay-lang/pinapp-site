/**
 * Lightbox Vimeo — iframe uniquement au clic (dnt=1). `<dialog>` natif.
 */
(function () {
  function reducedMotion() {
    try {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (e) {
      return false;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var dialog = document.getElementById('voyage-vimeo-dialog');
    var slot = document.getElementById('voyage-vimeo-slot');
    var closeBtn = document.querySelector('.voyage-vimeo-dialog__close');
    if (!dialog || !slot) return;

    var lastFocus = null;
    var iframe = null;

    function lockScroll(on) {
      document.body.classList.toggle('is-modal-open', !!on);
    }

    function buildSrc(id) {
      var base = 'https://player.vimeo.com/video/' + encodeURIComponent(String(id));
      return (
        base +
        '?dnt=1&autoplay=1&muted=' +
        (reducedMotion() ? '1' : '0') +
        '&loop=0&title=0&byline=0&portrait=0'
      );
    }

    function removeIframe() {
      slot.innerHTML = '';
      iframe = null;
    }

    function closeModal() {
      removeIframe();
      lockScroll(false);
      try {
        if (dialog.open) dialog.close();
      } catch (e) {}
      if (lastFocus && typeof lastFocus.focus === 'function') {
        try {
          lastFocus.focus();
        } catch (e2) {}
      }
      lastFocus = null;
    }

    function openModal(id, opener) {
      lastFocus = opener || document.activeElement;
      removeIframe();
      iframe = document.createElement('iframe');
      iframe.setAttribute('src', buildSrc(id));
      iframe.setAttribute('title', 'Vidéo Vimeo');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      iframe.setAttribute('loading', 'eager');
      iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      slot.appendChild(iframe);
      lockScroll(true);
      try {
        if (typeof dialog.showModal === 'function') {
          dialog.showModal();
        } else {
          dialog.setAttribute('open', '');
        }
      } catch (e3) {}
      window.setTimeout(function () {
        if (!closeBtn) return;
        try {
          closeBtn.focus();
        } catch (e4) {}
      }, 60);
    }

    function openFromAnywhere(id, opener) {
      var clean = String(id || '').trim();
      if (!clean) return;
      openModal(clean, opener || null);
    }
    try {
      window.PinappVimeoOpen = openFromAnywhere;
    } catch (eG) {}

    document.addEventListener(
      'click',
      function (ev) {
        var t = ev.target;
        if (!t || !t.closest) return;
        var btn = t.closest('[data-vimeo-id]');
        if (!btn || !btn.getAttribute('data-vimeo-id')) return;
        var id = btn.getAttribute('data-vimeo-id').trim();
        if (!id) return;
        ev.preventDefault();
        ev.stopPropagation();
        openModal(id, btn);
      },
      true
    );

    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        closeModal();
      });
    }

    dialog.addEventListener('cancel', function (e) {
      e.preventDefault();
      closeModal();
    });

    dialog.addEventListener('click', function (e) {
      if (e.target === dialog) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      var open = false;
      try {
        open = !!dialog.open;
      } catch (e5) {
        open = dialog.hasAttribute('open');
      }
      if (e.key === 'Escape' && open) {
        closeModal();
      }
    });
  });
})();
