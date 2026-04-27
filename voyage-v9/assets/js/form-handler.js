/**
 * PINAPP voyage-v9 — formulaire #pinapp-form
 * Mode mailto (défaut) ou POST JSON vers n8n si PINAPP_USE_N8N + URL valides.
 */
(function () {
  'use strict';

  var USE_N8N = !!window.PINAPP_USE_N8N;
  var N8N_URL = String(window.PINAPP_N8N_URL || '').trim();
  var FALLBACK_EMAIL = 'contact@pinapp.fr';

  var RATE_LIMIT_KEY = 'pinapp_form_submissions_v82';
  var RATE_LIMIT_MAX = 5;
  var RATE_LIMIT_WINDOW_MS = 3600000;

  function isRealN8nUrl(url) {
    return url && url.indexOf('https://') === 0 && url.indexOf('webhook') !== -1;
  }

  function checkRateLimit() {
    var now = Date.now();
    var raw;
    try {
      raw = JSON.parse(localStorage.getItem(RATE_LIMIT_KEY) || '[]');
    } catch (e) {
      raw = [];
    }
    if (!Array.isArray(raw)) raw = [];
    var recent = raw.filter(function (ts) {
      return now - ts < RATE_LIMIT_WINDOW_MS;
    });
    if (recent.length >= RATE_LIMIT_MAX) return false;
    recent.push(now);
    try {
      localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(recent));
    } catch (e) {}
    return true;
  }

  function formatConditional(data) {
    var p = data.path || '';
    if (p === 'tech') {
      return (
        'Type : ' +
        (data.tech_type || '-') +
        '\nPain principal : ' +
        (data.tech_pain || '-') +
        '\nOutils actuels : ' +
        (data.tech_outils || '-')
      );
    }
    if (p === 'image') {
      return (
        'Type livrable : ' +
        (data.image_type || '-') +
        '\nDurée : ' +
        (data.image_duree || '-') +
        '\nDate événement : ' +
        (data.image_date || '-') +
        '\nLieu : ' +
        (data.image_lieu || '-') +
        '\nPour qui/quoi : ' +
        (data.image_pourquoi || '-') +
        '\nUnivers visuel : ' +
        (data.image_univers || '-')
      );
    }
    if (p === 'pack_duo') {
      return (
        'Pack envisagé : ' +
        (data.pack_choix || '-') +
        '\nÉchéance critique : ' +
        (data.pack_echeance || '-') +
        '\nDescription : ' +
        (data.pack_description || '-')
      );
    }
    return '';
  }

  function sendViaMailto(data) {
    var path = (data.path || 'autre').toUpperCase();
    var budget = data.budget || 'non précisé';
    var subject =
      '[PINAPP] ' + (data.prenom || 'Lead') + ' (' + (data.entreprise || '-') + ') · ' + path + ' · ' + budget;

    var body =
      'CHEMIN : ' +
      (data.path || 'non précisé') +
      '\n\n──────────────────────────────────────────────────────────\nPROSPECT\n──────────────────────────────────────────────────────────\n' +
      'Prénom : ' +
      (data.prenom || '') +
      '\nNom : ' +
      (data.nom || '') +
      '\nEntreprise : ' +
      (data.entreprise || '') +
      '\nEmail : ' +
      (data.email || '') +
      '\nTéléphone : ' +
      (data.tel || '') +
      '\nCode postal : ' +
      (data.cp || '') +
      '\nSite actuel : ' +
      (data.site || '') +
      '\n\n──────────────────────────────────────────────────────────\nDEMANDE\n──────────────────────────────────────────────────────────\n' +
      formatConditional(data) +
      '\n\nDélai souhaité : ' +
      (data.delai || '') +
      '\nBudget envisagé : ' +
      (data.budget || '') +
      '\n\n──────────────────────────────────────────────────────────\nÉLIGIBILITÉ -40%\n──────────────────────────────────────────────────────────\n' +
      (data.discount_eligible ? 'OUI · à vérifier SIRENE' : 'Non') +
      '\n\n──────────────────────────────────────────────────────────\nSOURCE\n──────────────────────────────────────────────────────────\n' +
      (data.source || 'non précisée') +
      '\n\n──────────────────────────────────────────────────────────\nNEWSLETTER\n──────────────────────────────────────────────────────────\n' +
      (data.newsletter ? 'Souscrit' : 'Non') +
      '\n\n──────────────────────────────────────────────────────────\nMESSAGE LIBRE\n──────────────────────────────────────────────────────────\n' +
      (data.message || '(vide)') +
      '\n\n──────────────────────────────────────────────────────────\nMETA\n──────────────────────────────────────────────────────────\n' +
      'Soumis : ' +
      (data.timestamp || '') +
      '\nReferrer : ' +
      (data.referrer || '') +
      '\nUTM source : ' +
      (data.utm_source || '') +
      '\nConsentement RGPD : ' +
      (data.consent ? 'Oui' : 'Non');

    window.location.href =
      'mailto:' +
      FALLBACK_EMAIL +
      '?subject=' +
      encodeURIComponent(subject) +
      '&body=' +
      encodeURIComponent(body);
  }

  function showSuccess(form, successEl) {
    if (form) form.style.display = 'none';
    if (successEl) {
      successEl.hidden = false;
      try {
        successEl.scrollIntoView({ behavior: 'auto', block: 'center' });
      } catch (e) {
        successEl.scrollIntoView(true);
      }
    }
  }

  function sendViaN8n(data, form, successEl, submitBtn) {
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Envoi en cours...';
    }
    fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('network');
        showSuccess(form, successEl);
      })
      .catch(function () {
        sendViaMailto(data);
        showSuccess(form, successEl);
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Envoyer mon brief — réponse écrite sous 24h';
        }
      });
  }

  function onReady() {
    var form = document.getElementById('pinapp-form');
    var success = document.getElementById('form-success');
    if (!form) return;

    var ts = document.getElementById('timestamp');
    var ref = document.getElementById('referrer');
    var utm = document.getElementById('utm_source');
    if (ts) ts.value = new Date().toISOString();
    if (ref) ref.value = document.referrer || 'direct';
    try {
      var params = new URLSearchParams(window.location.search);
      if (utm) utm.value = params.get('utm_source') || 'organic';
    } catch (e) {}

    var radios = form.querySelectorAll('input[name="path"]');
    var conditionals = form.querySelectorAll('.conditional-fields');
    radios.forEach(function (r) {
      r.addEventListener('change', function () {
        conditionals.forEach(function (f) {
          f.hidden = f.getAttribute('data-path') !== r.value;
        });
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('[name="website"]');
      if (hp && hp.value !== '') return;

      if (!checkRateLimit()) {
        window.alert(
          'Trop de tentatives récentes. Réessayez dans une heure ou écrivez-nous à ' + FALLBACK_EMAIL,
        );
        return;
      }

      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) {
        if (k === 'website') return;
        if (data[k] !== undefined) {
          if (!Array.isArray(data[k])) data[k] = [data[k]];
          data[k].push(v);
        } else {
          data[k] = v;
        }
      });

      var useWebhook = USE_N8N && isRealN8nUrl(N8N_URL);
      var submitBtn = document.getElementById('form-submit');

      if (!useWebhook) {
        sendViaMailto(data);
        showSuccess(form, success);
        return;
      }
      sendViaN8n(data, form, success, submitBtn);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onReady);
  } else {
    onReady();
  }
})();
