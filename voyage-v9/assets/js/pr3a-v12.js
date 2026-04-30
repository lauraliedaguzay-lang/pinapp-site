/* PR3a — offres toggle, detail drawers, contact wizard + submit */
(function () {
  'use strict';

  var toggleBtn = document.getElementById('offresToggleMs');
  var togglePanel = document.getElementById('offresPanelMs');
  if (toggleBtn && togglePanel) {
    var wrap = toggleBtn.closest('.offres-toggle-wrap');
    toggleBtn.addEventListener('click', function () {
      var open = !wrap.classList.contains('is-open');
      wrap.classList.toggle('is-open', open);
      toggleBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggleBtn.classList.toggle('is-open', open);
    });
  }

  var layer = document.getElementById('pinapp-detail-layer');
  if (layer) {
    var sheet = layer.querySelector('.pinapp-detail-sheet');
    if (sheet) {
      sheet.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
    var panels = [].slice.call(layer.querySelectorAll('.pinapp-detail-panel'));
    function openDetail(id) {
      layer.hidden = false;
      layer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      panels.forEach(function (p) {
        var on = p.id === id;
        p.hidden = !on;
        if (on) {
          try {
            p.focus();
          } catch (e) {}
        }
      });
    }
    function closeDetail() {
      layer.hidden = true;
      layer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      panels.forEach(function (p) {
        p.hidden = true;
      });
    }
    document.querySelectorAll('[data-open-detail]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-open-detail');
        if (id) openDetail(id);
      });
    });
    layer.querySelectorAll('[data-close-detail]').forEach(function (el) {
      el.addEventListener('click', closeDetail);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && layer.getAttribute('aria-hidden') === 'false') closeDetail();
    });
  }

  var form = document.getElementById('pinapp-contact-wizard');
  if (!form) return;

  var steps = [].slice.call(form.querySelectorAll('.cw-step'));
  var cur = 0;
  var dots = document.querySelectorAll('#cwProgressDots .cw-dot');
  var labelEl = document.getElementById('cwStepLabel');
  var routage = document.getElementById('cw-routage');
  var successEl = document.getElementById('contact-wizard-success');

  function setStep(i) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (fs, j) {
      fs.hidden = j !== cur;
    });
    dots.forEach(function (d, j) {
      d.classList.toggle('is-on', j === cur);
      if (j === cur) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    if (labelEl) {
      labelEl.textContent = cur === 0 ? '1/3 Identité' : cur === 1 ? '2/3 Besoin' : '3/3 Cadrage';
    }
  }

  form.querySelectorAll('[data-cw-next]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (cur === 0) {
        var n = form.querySelector('#cw-nom');
        var em = form.querySelector('#cw-email');
        if (n && !n.value.trim()) {
          n.reportValidity();
          return;
        }
        if (em && !em.checkValidity()) {
          em.reportValidity();
          return;
        }
      } else if (cur === 1) {
        var cat = form.querySelector('input[name="categorie"]:checked');
        if (!cat) return;
        var d = form.querySelector('#cw-desc');
        if (d && !d.value.trim()) {
          d.reportValidity();
          return;
        }
      }
      setStep(cur + 1);
    });
  });
  form.querySelectorAll('[data-cw-prev]').forEach(function (b) {
    b.addEventListener('click', function () {
      setStep(cur - 1);
    });
  });

  form.addEventListener('change', function () {
    var cat = (form.querySelector('input[name="categorie"]:checked') || {}).value;
    if (!routage) return;
    if (cat === 'code') routage.value = 'lauralie';
    else if (cat === 'imagerie') routage.value = 'micha';
    else if (cat === 'les_deux') routage.value = 'duo';
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return;
    if (!form.reportValidity()) return;

    var fd = new FormData(form);
    var payload = {};
    fd.forEach(function (v, k) {
      if (k === 'website') return;
      payload[k] = v;
    });
    payload.source = 'voyage-v9-contact-wizard';

    var wh = (form.getAttribute('data-webhook-url') || '').trim();
    var useN8n = !!window.PINAPP_USE_N8N && window.PINAPP_N8N_URL && String(window.PINAPP_N8N_URL).indexOf('https://') === 0 && String(window.PINAPP_N8N_URL).indexOf('webhook') !== -1;

    if (!wh && !useN8n) {
      try {
        console.log({ step: 'submit', payload: payload });
      } catch (e1) {}
      var nom = payload.nom_complet || 'contact';
      var cat = payload.categorie || 'demande';
      var subj = '[Pinapp Diagnostic] ' + nom + ' - ' + cat;
      var bodyLines = [];
      Object.keys(payload).forEach(function (k) {
        bodyLines.push(k + ': ' + payload[k]);
      });
      try {
        window.location.href =
          'mailto:contact@pinapp.fr?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(bodyLines.join('\n'));
      } catch (e2) {}
      form.style.display = 'none';
      if (successEl) successEl.hidden = false;
      return;
    }

    var url = wh || String(window.PINAPP_N8N_URL || '');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        if (!r.ok) throw new Error('bad');
        form.style.display = 'none';
        if (successEl) successEl.hidden = false;
      })
      .catch(function () {
        try {
          console.log({ step: 'submit-fallback', payload: payload });
        } catch (e3) {}
        form.style.display = 'none';
        if (successEl) successEl.hidden = false;
      });
  });

  setStep(0);

  try {
    var u = new URL(window.location.href);
    var cat = u.searchParams.get('categorie');
    if (cat === 'cadeau') {
      var rImg = form.querySelector('input[name="categorie"][value="imagerie"]');
      if (rImg) {
        rImg.checked = true;
        if (routage) routage.value = 'micha';
      }
      var descEl = form.querySelector('#cw-desc');
      if (descEl && !String(descEl.value || '').trim()) {
        descEl.placeholder =
          'Décrivez votre film cadeau (pour qui, date, ton souhaité, durée)…';
      }
    }
    if (u.hash === '#contact') {
      var csec = document.getElementById('contact');
      if (csec) {
        window.requestAnimationFrame(function () {
          csec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      }
    }
  } catch (e0) {}

  if ('IntersectionObserver' in window) {
    var barHost = document.querySelector('[data-bars-animate]');
    if (barHost) {
      new IntersectionObserver(
        function (en) {
          en.forEach(function (x) {
            if (x.isIntersecting) barHost.classList.add('is-in');
          });
        },
        { threshold: 0.12 },
      ).observe(barHost);
    }
  }
})();
