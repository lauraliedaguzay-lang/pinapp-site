/**
 * Formulaire diagnostic natif — /diagnostic/
 * POST JSON vers window.__PINAPP__.WEBHOOK_N8N si défini, sinon mailto.
 */
(function () {
  'use strict';

  var root = document.getElementById('ppDiag');
  if (!root) return;

  var steps = root.querySelectorAll('.pp-diag__step');
  var bar = document.getElementById('ppBar');
  var sendBtn = document.getElementById('ppSend');
  var errEl = document.getElementById('ppDiagErr');
  var total = 5;

  var data = {};

  function setErr(msg) {
    if (!errEl) return;
    if (msg) {
      errEl.textContent = msg;
      errEl.setAttribute('aria-hidden', 'false');
    } else {
      errEl.textContent = '';
      errEl.setAttribute('aria-hidden', 'true');
    }
  }

  function barPct(n) {
    if (n === 'done') return 100;
    var k = typeof n === 'number' ? n : parseInt(String(n), 10);
    if (isNaN(k) || k < 1) return 0;
    return Math.round(((k - 1) / total) * 100);
  }

  function go(n) {
    setErr('');
    steps.forEach(function (s) {
      s.classList.remove('active');
    });
    var sel = n === 'done' ? '[data-step="done"]' : '[data-step="' + n + '"]';
    var target = root.querySelector(sel);
    if (target) {
      target.classList.add('active');
      var focusable = target.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) focusable.focus();
    }
    if (bar) bar.style.width = barPct(n) + '%';
  }

  root.querySelectorAll('.pp-diag__pills').forEach(function (group) {
    group.querySelectorAll('.pp-diag__pill').forEach(function (pill) {
      pill.addEventListener('click', function () {
        var field = group.getAttribute('data-field');
        if (!field) return;
        data[field] = pill.getAttribute('data-value') || '';
        group.querySelectorAll('.pp-diag__pill').forEach(function (p) {
          p.classList.remove('selected');
          p.setAttribute('aria-pressed', 'false');
        });
        pill.classList.add('selected');
        pill.setAttribute('aria-pressed', 'true');
        var stepEl = pill.closest('.pp-diag__step');
        var step = parseInt(stepEl && stepEl.getAttribute('data-step'), 10);
        if (!isNaN(step)) {
          window.setTimeout(function () {
            go(step + 1);
          }, 320);
        }
      });
    });
  });

  function basicEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', function () {
      var nom = (document.getElementById('ppNom') && document.getElementById('ppNom').value) || '';
      nom = nom.trim();
      var email =
        (document.getElementById('ppEmail') && document.getElementById('ppEmail').value) || '';
      email = email.trim();
      var tel = (document.getElementById('ppTel') && document.getElementById('ppTel').value) || '';
      tel = tel.trim();
      var msg = (document.getElementById('ppMsg') && document.getElementById('ppMsg').value) || '';
      msg = msg.trim();

      if (!nom || !email) {
        setErr('Merci de renseigner votre prénom et votre adresse e-mail.');
        return;
      }
      if (!basicEmail(email)) {
        setErr('Adresse e-mail invalide.');
        return;
      }

      data.prenom = nom;
      data.email = email;
      data.telephone = tel;
      data.message = msg;
      data.source = 'pinapp.fr/diagnostic';
      data.date = new Date().toISOString();

      var cfg = window.__PINAPP__ || {};
      var webhook = typeof cfg.WEBHOOK_N8N === 'string' ? cfg.WEBHOOK_N8N.trim() : '';

      sendBtn.disabled = true;
      sendBtn.textContent = 'Envoi en cours…';

      function mailtoFallback() {
        var body =
          'Prénom : ' +
          data.prenom +
          '\nEmail : ' +
          data.email +
          '\nTél. : ' +
          (data.telephone || '—') +
          '\nBesoin : ' +
          (data.besoin || '—') +
          '\nStructure : ' +
          (data.structure || '—') +
          '\nDélai : ' +
          (data.delai || '—') +
          '\nBudget : ' +
          (data.budget || '—') +
          '\nMessage : ' +
          (data.message || '—');
        window.location.href =
          'mailto:contact@pinapp.fr?subject=' +
          encodeURIComponent('Diagnostic Pinapp') +
          '&body=' +
          encodeURIComponent(body);
        go('done');
      }

      if (webhook) {
        fetch(webhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
          .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            go('done');
          })
          .catch(function () {
            mailtoFallback();
          })
          .finally(function () {
            sendBtn.disabled = false;
            sendBtn.textContent = 'Envoyer mon diagnostic →';
          });
      } else {
        mailtoFallback();
        sendBtn.disabled = false;
        sendBtn.textContent = 'Envoyer mon diagnostic →';
      }
    });
  }
})();
