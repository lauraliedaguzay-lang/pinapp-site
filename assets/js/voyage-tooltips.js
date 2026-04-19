/**
 * V2.3 — Tooltips diégétiques + pause timeline + modal « En savoir plus ».
 * Attend window.__V23_MAIN_TL__ (gsap.core.Timeline) et window.__V23_SET_PAUSED__(fn).
 */
(function () {
  var tip = null;
  var modal = null;
  var backdrop = null;
  var mainTl = null;

  function getTl() {
    return window.__V23_MAIN_TL__;
  }

  function setPaused(p) {
    if (typeof window.__V23_SET_PAUSED__ === 'function') window.__V23_SET_PAUSED__(p);
    else {
      var tl = getTl();
      if (tl) {
        if (p) tl.pause();
        else tl.resume();
      }
    }
  }

  function positionTipNear(el) {
    if (!tip || !el) return;
    var r = el.getBoundingClientRect();
    var tw = tip.offsetWidth || 280;
    var th = tip.offsetHeight || 120;
    var left = r.left + r.width / 2 - tw / 2;
    var top = r.bottom + 12;
    if (left < 8) left = 8;
    if (left + tw > window.innerWidth - 8) left = window.innerWidth - tw - 8;
    if (top + th > window.innerHeight - 8) top = r.top - th - 12;
    tip.style.left = Math.round(left) + 'px';
    tip.style.top = Math.round(top) + 'px';
  }

  function openTip(btn) {
    tip = document.getElementById('v23-diegetic-tip');
    if (!tip) return;
    var title = btn.getAttribute('data-title') || '';
    var prix = btn.getAttribute('data-prix') || '';
    var benef = btn.getAttribute('data-benefice') || '';
    var more = btn.getAttribute('data-more') || '#';
    tip.innerHTML =
      '<h3>' +
      title +
      '</h3><p class="prix">' +
      prix +
      '</p><p style="margin:0;font-size:0.9rem;color:rgba(255,255,255,0.72)">' +
      benef +
      '</p><button type="button" class="btn-magenta" data-modal-open="' +
      more +
      '">En savoir plus</button>';
    tip.hidden = false;
    positionTipNear(btn);
    setPaused(true);
    tip.querySelector('.btn-magenta').addEventListener('click', function () {
      var href = this.getAttribute('data-modal-open') || '#';
      openModal(href, title, benef);
    });
  }

  function closeTip() {
    if (tip) tip.hidden = true;
    setPaused(false);
  }

  function openModal(href, title, body) {
    modal = document.getElementById('v23-service-modal');
    if (!modal) return;
    var inner = modal.querySelector('.v23-modal__inner');
    if (inner) {
      inner.innerHTML =
        '<h2 style="margin:0 0 0.5rem;font-size:1.1rem">' +
        (title || 'Service') +
        '</h2><p style="margin:0;color:rgba(255,255,255,0.75);font-size:0.95rem">' +
        (body || '') +
        '</p><p style="margin-top:1rem"><a class="btn btn-secondary" href="' +
        href +
        '">Voir la page dédiée</a></p><button type="button" class="btn btn-secondary v23-modal__close" id="v23-modal-close">Fermer</button>';
      document.getElementById('v23-modal-close').addEventListener('click', closeModal);
    }
    modal.hidden = false;
    setPaused(true);
  }

  function closeModal() {
    if (modal) modal.hidden = true;
    closeTip();
  }

  document.addEventListener('DOMContentLoaded', function () {
    tip = document.getElementById('v23-diegetic-tip');
    modal = document.getElementById('v23-service-modal');

    document.querySelectorAll('.objet-diegetique').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () {
        openTip(btn);
      });
      btn.addEventListener('focus', function () {
        openTip(btn);
      });
      btn.addEventListener('mouseleave', function () {
        /* desktop: leave closes — mobile uses tap outside */
        if (window.matchMedia('(hover: hover)').matches) closeTip();
      });
      btn.addEventListener('blur', function () {
        if (window.matchMedia('(hover: hover)').matches) closeTip();
      });
      btn.addEventListener('click', function (e) {
        if (!window.matchMedia('(hover: hover)').matches) {
          e.preventDefault();
          if (tip && !tip.hidden) closeTip();
          else openTip(btn);
        }
      });
    });

    document.addEventListener(
      'click',
      function (e) {
        if (!tip || tip.hidden) return;
        if (e.target.closest('.objet-diegetique') || e.target.closest('#v23-diegetic-tip')) return;
        closeTip();
      },
      true
    );

    window.addEventListener(
      'resize',
      function () {
        var openBtn = document.querySelector('.objet-diegetique:focus');
        if (openBtn && tip && !tip.hidden) positionTipNear(openBtn);
      },
      { passive: true }
    );
  });
})();
