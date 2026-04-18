/* PINAPP DIAGNOSTIC FORM · v1.0
   Validation client + soumission Web3Forms (ou PINAPP_WEBHOOK_URL) + tracking Plausible.
*/
(function () {
  var cfg = window.__PINAPP__ || {};
  var WEBHOOK_URL =
    window.PINAPP_WEBHOOK_URL ||
    cfg.WEBHOOK_DIAGNOSTIC ||
    cfg.WEBHOOK_N8N ||
    'https://REPLACE-WITH-N8N-CLOUD-URL.app.n8n.cloud/webhook/pinapp-diagnostic';

  var form = document.getElementById('diag-form');
  if (!form) return;

  var submitBtn = document.getElementById('diag-submit');
  var statusEl = document.getElementById('diag-form-status');

  function setStatus(type, message) {
    if (!statusEl) return;
    statusEl.classList.remove('is-success', 'is-error');
    if (type) {
      statusEl.classList.add('is-' + type);
      statusEl.textContent = message;
    } else {
      statusEl.textContent = '';
    }
  }

  function setLoading(isLoading) {
    if (!submitBtn) return;
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle('is-loading', isLoading);
    submitBtn.setAttribute('aria-busy', isLoading ? 'true' : 'false');
  }

  function trackPlausible(event, props) {
    if (typeof window.plausible !== 'function') return;
    try {
      window.plausible(event, { props: props || {} });
    } catch (e) {}
  }

  function collectPayload() {
    var data = {};
    var fd = new FormData(form);
    fd.forEach(function (value, key) {
      if (key === 'website') return;
      if (key === 'projet') {
        if (!data.projet) data.projet = [];
        data.projet.push(value);
      } else if (key === 'rgpd' || key === 'newsletter') {
        data[key] = value === 'yes' ? 'yes' : '';
      } else {
        data[key] = value;
      }
    });
    if (!data.projet) data.projet = [];
    data._meta = {
      timestamp: new Date().toISOString(),
      url: window.location.href,
      referrer: document.referrer || 'direct',
      userAgent: navigator.userAgent,
      language: navigator.language,
      screen: window.screen.width + 'x' + window.screen.height,
      viewport: window.innerWidth + 'x' + window.innerHeight,
    };
    var score = 0;
    if (data.budget && /5k-10k|10k-25k|gt25k/.test(data.budget)) score += 30;
    else if (data.budget && /2k-5k/.test(data.budget)) score += 15;
    if (data.urgence === 'asap') score += 25;
    else if (data.urgence === '1-3m') score += 15;
    if (data.projet.length >= 2) score += 20;
    if (data.description && data.description.length > 200) score += 10;
    if (data.entreprise) score += 10;
    if (data.telephone) score += 5;
    data._meta.client_score = score;
    return data;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var hp = form.elements.website;
    if (hp && String(hp.value || '').trim() !== '') {
      setStatus('success', 'Merci, on revient vers vous sous 24h.');
      form.reset();
      return;
    }

    var projetBoxes = form.querySelectorAll('input[name="projet"]:checked');
    if (!projetBoxes.length) {
      setStatus('error', 'Merci de sélectionner au moins un type de projet.');
      var firstCb = form.querySelector('input[name="projet"]');
      if (firstCb) firstCb.focus();
      return;
    }

    if (!form.checkValidity()) {
      var firstInvalid = form.querySelector(':invalid');
      if (firstInvalid) firstInvalid.focus();
      setStatus('error', 'Merci de compléter les champs obligatoires.');
      return;
    }

    var data = collectPayload();

    var clientScoreForTrack =
      data._meta && typeof data._meta.client_score !== 'undefined' ? data._meta.client_score : '';

    if (window.PINAPP_WEB3FORMS_KEY) {
      data.access_key = window.PINAPP_WEB3FORMS_KEY;
      data.from_name = 'Pinapp Diagnostic — ' + (data.prenom || 'Lead');
      data.subject =
        '[Pinapp] Nouveau lead — ' + (data.secteur || 'projet') + ' — ' + (data.budget || 'budget non précisé');
      data.replyto = data.email;
      data._meta_json = JSON.stringify(data._meta || {});
      delete data._meta;
      data.projets_resume = Array.isArray(data.projet) ? data.projet.join(', ') : data.projet;
      delete data.projet;
    }

    setLoading(true);
    setStatus(null);

    fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function () {
        setStatus(
          'success',
          'Merci ' + data.prenom + ' — on revient vers vous sous 24h à ' + data.email + '.',
        );
        trackPlausible('Diagnostic Submit', {
          secteur: data.secteur,
          budget: data.budget,
          score: String(clientScoreForTrack),
        });
        form.reset();
        window.setTimeout(function () {
          if (statusEl) statusEl.scrollIntoView({ behavior: 'auto', block: 'center' });
        }, 100);
      })
      .catch(function (err) {
        setStatus('error', 'Une erreur est survenue. Réessayez ou écrivez à contact@pinapp.fr.');
        trackPlausible('Diagnostic Error', { error: String(err && err.message ? err.message : err) });
      })
      .finally(function () {
        setLoading(false);
      });
  });
})();
