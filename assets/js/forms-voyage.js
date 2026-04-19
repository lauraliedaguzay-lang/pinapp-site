/**
 * Formulaires voyage — fetch POST JSON, honeypot, rate limit localStorage, fallback offline.
 */
(function () {
  var RATE_MS = 120000;

  function getConfig() {
    return window.PINAPP_CONFIG || { webhooks: {} };
  }

  function rateOk(key) {
    try {
      var t = localStorage.getItem(key);
      if (!t) return true;
      return Date.now() - parseInt(t, 10) > RATE_MS;
    } catch (e) {
      return true;
    }
  }

  function setRate(key) {
    try {
      localStorage.setItem(key, String(Date.now()));
    } catch (e) {}
  }

  function queueOffline(type, payload) {
    try {
      var q = JSON.parse(localStorage.getItem('pinapp_voyage_queue') || '[]');
      q.push({ type: type, payload: payload, at: Date.now() });
      localStorage.setItem('pinapp_voyage_queue', JSON.stringify(q));
    } catch (e) {}
  }

  function setFeedback(el, msg, ok) {
    if (!el) return;
    el.textContent = msg;
    el.style.color = ok ? 'var(--cyan-glow)' : 'var(--magenta-rare)';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
  }

  function submitJson(url, data, onSuccess, onFail) {
    if (!url) {
      queueOffline('unknown', data);
      onFail('no_webhook');
      return;
    }
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (r) {
        if (r.ok) onSuccess();
        else onFail('http_' + r.status);
      })
      .catch(function () {
        queueOffline('fetch', data);
        onFail('network');
      });
  }

  function bindForm(formId, webhookKey, rateKey) {
    var form = document.getElementById(formId);
    if (!form) return;
    var feedback = document.getElementById(formId + '-feedback');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var hp = form.querySelector('.honeypot');
      if (hp && hp.value) return;

      if (!rateOk(rateKey)) {
        setFeedback(feedback, 'Merci de patienter quelques instants avant un nouvel envoi.', false);
        return;
      }

      var fd = new FormData(form);
      var data = {};
      fd.forEach(function (v, k) {
        if (k === 'website') return;
        data[k] = v;
      });
      try {
        var ref = document.cookie.match(/(?:^|; )pinapp_ref=([^;]+)/);
        if (ref) data.ref = decodeURIComponent(ref[1]);
      } catch (e2) {}

      var url = getConfig().webhooks && getConfig().webhooks[webhookKey];
      setFeedback(feedback, 'Envoi en cours…', true);

      submitJson(
        url,
        data,
        function () {
          setRate(rateKey);
          setFeedback(feedback, 'Message bien reçu. Nous revenons vers vous sous 24 h.', true);
          form.reset();
          if (typeof window.plausible === 'function') {
            window.plausible(formId === 'form-diagnostic' ? 'form_diagnostic_submitted' : 'newsletter_submitted');
          }
        },
        function (reason) {
          setFeedback(
            feedback,
            reason === 'no_webhook'
              ? 'Webhook non configuré : message enregistré localement. Configurez PINAPP_CONFIG.webhooks.'
              : 'Réception locale — nous réessaierons à la prochaine connexion.',
            reason === 'no_webhook'
          );
          if (reason !== 'no_webhook') setRate(rateKey);
        }
      );
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindForm('form-diagnostic', 'diagnostic', 'pinapp_voyage_diag_ts');
    bindForm('form-newsletter', 'newsletter', 'pinapp_voyage_nl_ts');
  });
})();
