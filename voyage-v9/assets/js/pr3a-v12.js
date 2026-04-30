/* PR3a — offres toggle, detail drawers, contact wizard 4 étapes + submit */
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
  var dots = [].slice.call(form.querySelectorAll('#cwProgressDots .cw-dot'));
  var labelEl = document.getElementById('cwStepLabel');
  var successEl = document.getElementById('contact-wizard-success');
  var creneauWrap = document.getElementById('cw-creneau-wrap');

  var stepLabels = ['1/4 Identité', '2/4 Besoin', '3/4 Pack envisagé', '4/4 Cadrage'];

  function syncDots() {
    dots.forEach(function (d, i) {
      d.classList.remove('is-on', 'is-done');
      if (i < cur) d.classList.add('is-done');
      else if (i === cur) {
        d.classList.add('is-on');
        d.setAttribute('aria-current', 'step');
      } else d.removeAttribute('aria-current');
    });
  }

  function setStep(i) {
    cur = Math.max(0, Math.min(steps.length - 1, i));
    steps.forEach(function (fs, j) {
      fs.hidden = j !== cur;
    });
    syncDots();
    if (labelEl) labelEl.textContent = stepLabels[cur] || '';
    updateCreneau();
  }

  function updateCreneau() {
    if (!creneauWrap) return;
    var pref = (form.querySelector('input[name="contact_preference"]:checked') || {}).value;
    creneauWrap.hidden = pref !== 'telephone' && pref !== 'visio';
  }

  form.querySelectorAll('input[name="contact_preference"]').forEach(function (r) {
    r.addEventListener('change', updateCreneau);
  });

  function validateStep0() {
    var n = form.querySelector('#cw-nom');
    var em = form.querySelector('#cw-email');
    var se = form.querySelector('#cw-secteur');
    if (n && !n.value.trim()) {
      n.reportValidity();
      return false;
    }
    if (em && !em.checkValidity()) {
      em.reportValidity();
      return false;
    }
    if (se && !se.value) {
      se.reportValidity();
      return false;
    }
    return true;
  }

  function validateStep1() {
    var cat = form.querySelector('input[name="categorie"]:checked');
    if (!cat) {
      var first = form.querySelector('input[name="categorie"][required]') || form.querySelector('input[name="categorie"]');
      if (first) first.reportValidity();
      return false;
    }
    var d = form.querySelector('#cw-desc');
    if (d && !d.value.trim()) {
      d.reportValidity();
      return false;
    }
    return true;
  }

  function validateStep2() {
    var p = form.querySelector('input[name="pack_envisage"]:checked');
    if (!p) {
      var first =
        form.querySelector('input[name="pack_envisage"][required]') ||
        form.querySelector('input[name="pack_envisage"]');
      if (first) first.reportValidity();
      return false;
    }
    return true;
  }

  function validateStep3() {
    if (!form.querySelector('input[name="budget"]:checked')) {
      var b = form.querySelector('input[name="budget"][required]') || form.querySelector('input[name="budget"]');
      if (b) b.reportValidity();
      return false;
    }
    if (!form.querySelector('input[name="delai"]:checked')) {
      var d = form.querySelector('input[name="delai"][required]') || form.querySelector('input[name="delai"]');
      if (d) d.reportValidity();
      return false;
    }
    if (!form.querySelector('input[name="contact_preference"]:checked')) {
      var c =
        form.querySelector('input[name="contact_preference"][required]') ||
        form.querySelector('input[name="contact_preference"]');
      if (c) c.reportValidity();
      return false;
    }
    var rgpd = form.querySelector('#cw-rgpd');
    if (rgpd && !rgpd.checked) {
      rgpd.reportValidity();
      return false;
    }
    return true;
  }

  form.querySelectorAll('[data-cw-next]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (cur === 0) {
        if (!validateStep0()) return;
      } else if (cur === 1) {
        if (!validateStep1()) return;
      } else if (cur === 2) {
        if (!validateStep2()) return;
      }
      setStep(cur + 1);
    });
  });

  form.querySelectorAll('[data-cw-prev]').forEach(function (b) {
    b.addEventListener('click', function () {
      setStep(cur - 1);
    });
  });

  function buildPayload() {
    var nom = (form.querySelector('[name="nom_complet"]') || {}).value || '';
    var email = (form.querySelector('[name="email"]') || {}).value || '';
    var tel = (form.querySelector('[name="telephone"]') || {}).value || '';
    var ent = (form.querySelector('[name="entreprise"]') || {}).value || '';
    var secteur = (form.querySelector('[name="secteur"]') || {}).value || '';
    var categorie = (form.querySelector('input[name="categorie"]:checked') || {}).value || '';
    var description = (form.querySelector('[name="description"]') || {}).value || '';
    var references = (form.querySelector('[name="references"]') || {}).value || '';
    var pack_envisage = (form.querySelector('input[name="pack_envisage"]:checked') || {}).value || '';
    var budget = (form.querySelector('input[name="budget"]:checked') || {}).value || '';
    var delai = (form.querySelector('input[name="delai"]:checked') || {}).value || '';
    var contact_preference = (form.querySelector('input[name="contact_preference"]:checked') || {}).value || '';
    var creneau = (form.querySelector('[name="creneau"]') || {}).value || '';
    var rgpd = !!(form.querySelector('#cw-rgpd') || {}).checked;
    return {
      nom_complet: nom.trim(),
      email: email.trim(),
      telephone: tel.trim(),
      entreprise: ent.trim(),
      secteur: secteur,
      categorie: categorie,
      description: description.trim(),
      references: references.trim(),
      pack_envisage: pack_envisage,
      budget: budget,
      delai: delai,
      contact_preference: contact_preference,
      creneau: creneau.trim(),
      rgpd_consent: rgpd,
      website: (form.querySelector('[name="website"]') || {}).value || '',
      source: 'voyage-v9-contact-wizard',
    };
  }

  function fallbackMailto(payload) {
    try {
      console.log({ step: 'submit', payload: payload });
    } catch (e1) {}
    var nom = payload.nom_complet || 'contact';
    var cat = payload.categorie || 'demande';
    var pack = payload.pack_envisage || '';
    var subj = '[Pinapp Diagnostic] ' + nom + ' — ' + cat + (pack ? ' — ' + pack : '');
    var bodyLines = [];
    Object.keys(payload).forEach(function (k) {
      bodyLines.push(k + ': ' + payload[k]);
    });
    try {
      window.location.href =
        'mailto:contact@pinapp.fr?subject=' +
        encodeURIComponent(subj) +
        '&body=' +
        encodeURIComponent(bodyLines.join('\n'));
    } catch (e2) {}
  }

  function showSuccess() {
    form.style.display = 'none';
    if (successEl) successEl.hidden = false;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var hp = form.querySelector('[name="website"]');
    if (hp && hp.value) return;
    if (!validateStep0()) {
      setStep(0);
      return;
    }
    if (!validateStep1()) {
      setStep(1);
      return;
    }
    if (!validateStep2()) {
      setStep(2);
      return;
    }
    if (!validateStep3()) {
      setStep(3);
      return;
    }

    var payload = buildPayload();
    if (!payload.rgpd_consent) return;

    var wh = (form.getAttribute('data-webhook-url') || '').trim();
    var useN8n =
      !!window.PINAPP_USE_N8N &&
      window.PINAPP_N8N_URL &&
      String(window.PINAPP_N8N_URL).indexOf('https://') === 0 &&
      String(window.PINAPP_N8N_URL).indexOf('webhook') !== -1;

    if (!wh && !useN8n) {
      fallbackMailto(payload);
      showSuccess();
      return;
    }

    var url = wh || String(window.PINAPP_N8N_URL || '');
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
      .then(function (r) {
        return r
          .json()
          .catch(function () {
            return {};
          })
          .then(function (data) {
            return { okHttp: r.ok, data: data };
          });
      })
      .then(function (x) {
        if (x.okHttp && x.data && x.data.ok) {
          showSuccess();
          return;
        }
        throw new Error('bad response');
      })
      .catch(function () {
        try {
          console.log({ step: 'submit-fallback', payload: payload });
        } catch (e3) {}
        fallbackMailto(payload);
        showSuccess();
      });
  });

  setStep(0);

  try {
    var u = new URL(window.location.href);
    var catParam = u.searchParams.get('categorie');
    if (catParam === 'cadeau') {
      var rImg = form.querySelector('input[name="categorie"][value="imagerie"]');
      if (rImg) rImg.checked = true;
      var rPack = form.querySelector('input[name="pack_envisage"][value="anniversaire"]');
      if (rPack) rPack.checked = true;
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
