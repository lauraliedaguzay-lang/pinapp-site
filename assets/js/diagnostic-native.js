/**
 * Diagnostic Pinapp — formulaire 5 étapes, webhook n8n ou mailto.
 * window.__PINAPP__.WEBHOOK_DIAGNOSTIC (prioritaire) ou WEBHOOK_N8N
 */
(function () {
  'use strict';

  var shell = document.getElementById('diagFormShell');
  var form = document.getElementById('diagnosticForm');
  if (!shell || !form) return;

  var track = document.getElementById('diagTrack');
  var progressBars = document.querySelectorAll('.pp-form-progress-bar');
  var errEl = document.getElementById('diagFormErr');
  var thanksName = document.getElementById('diagThanksName');
  var recapEl = document.getElementById('diagRecap');
  var btnPrev = document.getElementById('diagBtnPrev');
  var btnNext = document.getElementById('diagBtnNext');
  var btnSubmit = document.getElementById('diagBtnSubmit');
  var secteur = document.getElementById('secteur');
  var secteurAutreWrap = document.getElementById('secteur_autre_wrap');
  var secteurAutre = document.getElementById('secteur_autre');
  var messageLibre = document.getElementById('message_libre');
  var charCount = document.getElementById('charCount');
  var fichier = document.getElementById('fichier');
  var interestAutreWrap = document.getElementById('interest_autre_wrap');
  var interestAutre = document.getElementById('interest_autre');
  var secteurFilter = document.getElementById('secteur_filter');
  var outilsAutre = document.getElementById('outils_autre');
  var outilsAutreWrap = document.getElementById('outils_autre_wrap');

  var currentStep = 0;
  var maxStep = 4;
  var FILE_MAX = 5 * 1024 * 1024;

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

  function getWebhook() {
    var cfg = window.__PINAPP__ || {};
    var a = typeof cfg.WEBHOOK_DIAGNOSTIC === 'string' ? cfg.WEBHOOK_DIAGNOSTIC.trim() : '';
    var b = typeof cfg.WEBHOOK_N8N === 'string' ? cfg.WEBHOOK_N8N.trim() : '';
    return a || b;
  }

  function updateProgress() {
    progressBars.forEach(function (bar, i) {
      bar.classList.remove('done', 'active');
      if (i < currentStep) bar.classList.add('done');
      if (i === currentStep) bar.classList.add('active');
    });
  }

  function slideTo(step) {
    currentStep = Math.max(0, Math.min(maxStep, step));
    if (track) track.style.transform = 'translateX(-' + currentStep * 20 + '%)';
    updateProgress();
    setErr('');
    var wraps = form.querySelectorAll('.pp-form-step-wrap');
    wraps.forEach(function (w, i) {
      w.setAttribute('aria-hidden', i === currentStep ? 'false' : 'true');
    });
    if (btnPrev) btnPrev.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    if (btnNext) btnNext.style.display = currentStep === maxStep ? 'none' : 'inline-flex';
    if (btnSubmit) btnSubmit.style.display = currentStep === maxStep ? 'inline-flex' : 'none';
    if (currentStep === maxStep) buildRecap();
    var focusable = form.querySelector(
      '.pp-form-step-wrap[aria-hidden="false"] input:not([type="hidden"]), .pp-form-step-wrap[aria-hidden="false"] select, .pp-form-step-wrap[aria-hidden="false"] textarea, .pp-form-step-wrap[aria-hidden="false"] button',
    );
    if (focusable) focusable.focus();
  }

  function val(el) {
    return el ? String(el.value || '').trim() : '';
  }

  function validateStep(step) {
    if (step === 0) {
      if (!val(document.getElementById('prenom'))) return 'Merci d’indiquer votre prénom.';
      if (!val(document.getElementById('nom'))) return 'Merci d’indiquer votre nom.';
      var em = val(document.getElementById('email'));
      if (!em || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) return 'Merci d’indiquer un e-mail professionnel valide.';
      var tel = val(document.getElementById('telephone'));
      if (!tel || tel.replace(/\s/g, '').length < 10) return 'Merci d’indiquer un numéro de téléphone valide.';
    }
    if (step === 1) {
      if (!val(document.getElementById('entreprise'))) return 'Merci d’indiquer le nom de l’entreprise.';
      var s = val(secteur);
      if (!s) return 'Merci de choisir un secteur d’activité.';
      if (s === 'Autre (précisez)' && !val(secteurAutre))
        return 'Merci de préciser votre secteur (champ « Autre (précisez) »).';
      if (!val(document.getElementById('ville'))) return 'Merci d’indiquer votre ville ou commune.';
      var siret = val(document.getElementById('siret'));
      if (siret && !/^[0-9\s]+$/.test(siret)) return 'Le SIRET ne doit contenir que des chiffres et des espaces.';
    }
    if (step === 2) {
      var boxes = form.querySelectorAll('input[name="interets"]:checked');
      if (!boxes.length) return 'Cochez au moins une option dans « Qu’est-ce qui vous intéresse ? ».';
      var autre = form.querySelector('input[name="interets"][value="Autre"]');
      if (autre && autre.checked && !val(interestAutre)) return 'Merci de préciser votre besoin dans le champ « Autre ».';
      if (!form.querySelector('input[name="contact_pref"]:checked'))
        return 'Merci d’indiquer comment vous préférez être contacté.';
      var oa = form.querySelector('input[name="outils_num"][value="Autre"]');
      if (oa && oa.checked && !val(outilsAutre))
        return 'Merci de préciser le champ « Autre » pour les outils numériques.';
    }
    if (step === 3) {
      var f = fichier && fichier.files[0] ? fichier.files[0] : null;
      if (f && f.size > FILE_MAX) return 'Le fichier dépasse 5 Mo.';
    }
    if (step === 4) {
      var rgpd = document.getElementById('rgpd_consent');
      if (!rgpd || !rgpd.checked) return 'Veuillez accepter le traitement de vos données pour continuer.';
    }
    return '';
  }

  function selectedInterets() {
    var out = [];
    form.querySelectorAll('input[name="interets"]:checked').forEach(function (c) {
      out.push(c.value);
    });
    return out;
  }

  function selectedOutilsNum() {
    var out = [];
    form.querySelectorAll('input[name="outils_num"]:checked').forEach(function (c) {
      out.push(c.value);
    });
    return out;
  }

  function secteurLabel() {
    var s = val(secteur);
    if (!s) return '';
    if (s === 'Autre (précisez)') return val(secteurAutre) || 'Autre (précisez)';
    return s;
  }

  function applySecteurFilter() {
    if (!secteur || !secteurFilter) return;
    var q = String(secteurFilter.value || '')
      .toLowerCase()
      .trim();
    secteur.querySelectorAll('optgroup').forEach(function (og) {
      var glabel = String(og.label || '').toLowerCase();
      var groupHit = q && glabel.indexOf(q) !== -1;
      og.querySelectorAll('option').forEach(function (opt) {
        var t = String(opt.textContent || '').toLowerCase();
        var match = !q || groupHit || t.indexOf(q) !== -1 || glabel.indexOf(q) !== -1;
        if (opt.disabled && opt.value === '') {
          opt.hidden = false;
          return;
        }
        opt.hidden = !match && !opt.selected;
      });
    });
  }

  function acquisitionSource() {
    var el = document.getElementById('ppSource');
    if (el && String(el.value || '').trim()) return String(el.value).trim();
    try {
      var q = new URLSearchParams(window.location.search);
      return String(q.get('source') || q.get('utm_source') || '').trim() || 'direct';
    } catch (_e) {
      return 'direct';
    }
  }

  function buildPayload() {
    var interets = selectedInterets();
    return {
      source: 'pinapp.fr/diagnostic',
      acquisition_source: acquisitionSource(),
      submittedAt: new Date().toISOString(),
      vous: {
        prenom: val(document.getElementById('prenom')),
        nom: val(document.getElementById('nom')),
        email: val(document.getElementById('email')),
        telephone: val(document.getElementById('telephone')),
        role: val(document.getElementById('role')),
      },
      entreprise: {
        nom: val(document.getElementById('entreprise')),
        siret: val(document.getElementById('siret')) || null,
        secteur: val(secteur),
        secteur_libelle: secteurLabel(),
        secteur_autre: val(secteur) === 'Autre (précisez)' ? val(secteurAutre) : null,
        effectif: val(document.getElementById('effectif')) || null,
        chiffre_affaires: val(document.getElementById('chiffre_affaires')) || null,
        site_web: val(document.getElementById('site_web')) || null,
        reseaux_sociaux: val(document.getElementById('reseaux_sociaux')) || null,
        google_my_business: val(document.getElementById('google_my_business')) || null,
        outils_numeriques: selectedOutilsNum(),
        outils_autre: val(outilsAutre) || null,
        ville: val(document.getElementById('ville')),
        departement: val(document.getElementById('departement')) || null,
      },
      besoin: {
        interets: interets,
        interets_autre: val(interestAutre) || null,
        probleme: val(document.getElementById('probleme')) || null,
        budget: val(document.getElementById('budget')) || null,
        delai: val(document.getElementById('delai')) || null,
        contact_pref: (function () {
          var r = form.querySelector('input[name="contact_pref"]:checked');
          return r ? r.value : null;
        })(),
        creneau_contact: val(document.getElementById('creneau_contact')) || null,
      },
      message_libre: val(messageLibre) || null,
      meta: {
        connu_pinapp: val(document.getElementById('connu_pinapp')) || null,
        fichier_nom: fichier && fichier.files[0] ? fichier.files[0].name : null,
        fichier_taille: fichier && fichier.files[0] ? fichier.files[0].size : null,
      },
    };
  }

  function formatTelegram(p) {
    var v = p.vous;
    var e = p.entreprise;
    var b = p.besoin;
    var inter = (b.interets || []).join(', ');
    var outils = (e.outils_numeriques || []).join(', ');
    var siretLine = e.siret ? e.siret : '—';
    var msg = p.message_libre || '—';
    var sec = e.secteur_libelle || e.secteur || '—';
    return (
      '🔔 NOUVEAU DIAGNOSTIC\n' +
      '📣 Source acquisition : ' +
      (p.acquisition_source || '—') +
      '\n\n' +
      '👤 ' +
      v.prenom +
      ' ' +
      v.nom +
      '\n📧 ' +
      v.email +
      '\n📱 ' +
      v.telephone +
      '\n🏢 ' +
      e.nom +
      ' — ' +
      sec +
      '\n📍 ' +
      e.ville +
      (e.departement ? ' (' + e.departement + ')' : '') +
      '\n🔢 SIRET : ' +
      siretLine +
      '\n📊 CA : ' +
      (e.chiffre_affaires || '—') +
      '\n🌐 Réseaux : ' +
      (e.reseaux_sociaux || '—') +
      '\n🗺 Google Business : ' +
      (e.google_my_business || '—') +
      '\n🛠 Outils : ' +
      (outils || '—') +
      '\n\n📋 Besoin : ' +
      inter +
      '\n💰 Budget : ' +
      (b.budget || '—') +
      '\n⏰ Délai : ' +
      (b.delai || '—') +
      '\n📞 Contact : ' +
      (b.contact_pref || '—') +
      '\n🕐 Créneau : ' +
      (b.creneau_contact || '—') +
      '\n\n💬 Message libre :\n' +
      msg +
      '\n\n→ Répondre sous 24h'
    );
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildRecap() {
    if (!recapEl) return;
    var p = buildPayload();
    var html = '';
    function row(label, val) {
      html += '<dt>' + escapeHtml(label) + '</dt><dd>' + escapeHtml(val || '—') + '</dd>';
    }
    row('Source acquisition', p.acquisition_source || '—');
    row('Identité', p.vous.prenom + ' ' + p.vous.nom);
    row('E-mail', p.vous.email);
    row('Téléphone', p.vous.telephone);
    row('Fonction', p.vous.role || '—');
    row('Entreprise', p.entreprise.nom);
    row('SIRET', p.entreprise.siret || '—');
    row('Secteur', p.entreprise.secteur_libelle || p.entreprise.secteur || '—');
    row('Effectif', p.entreprise.effectif || '—');
    row('Chiffre d’affaires', p.entreprise.chiffre_affaires || '—');
    row('Site web', p.entreprise.site_web || '—');
    row('Réseaux sociaux', p.entreprise.reseaux_sociaux || '—');
    row('Google My Business', p.entreprise.google_my_business || '—');
    row('Outils numériques', (p.entreprise.outils_numeriques || []).join(', ') || '—');
    row('Précision outils « Autre »', p.entreprise.outils_autre || '—');
    row('Ville', p.entreprise.ville);
    row('Département', p.entreprise.departement || '—');
    row('Intérêts', (p.besoin.interets || []).join(', '));
    row('Problème principal', p.besoin.probleme || '—');
    row('Budget', p.besoin.budget || '—');
    row('Délai', p.besoin.delai || '—');
    row('Contact préféré', p.besoin.contact_pref || '—');
    row('Créneau contact', p.besoin.creneau_contact || '—');
    row('Message libre', p.message_libre || '—');
    row('Connaissance Pinapp', p.meta.connu_pinapp || '—');
    row('Fichier', p.meta.fichier_nom || '—');
    recapEl.innerHTML = html;
  }

  function mailtoBody(p) {
    var tg = p.telegram_digest || formatTelegram(p);
    return (
      '=== DIAGNOSTIC PINAPP ===\n\n' +
      JSON.stringify(p, null, 2) +
      '\n\n--- Format Telegram ---\n' +
      tg
    );
  }

  function showThanks(prenom) {
    shell.classList.add('is-done');
    if (thanksName) thanksName.textContent = prenom || '';
    shell.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function submitForm() {
    var msg = validateStep(4);
    if (msg) {
      setErr(msg);
      return;
    }
    var payload = buildPayload();
    payload.telegram_digest = formatTelegram(payload);

    var webhook = getWebhook();
    var file = fichier && fichier.files[0] ? fichier.files[0] : null;
    if (file && file.size > FILE_MAX) {
      setErr('Le fichier dépasse 5 Mo. Merci de nous l’envoyer par e-mail en réponse à notre retour.');
      return;
    }

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Envoi en cours…';
    }

    function fallbackMailto() {
      var body = mailtoBody(payload);
      var max = 65000;
      if (body.length > max) body = body.slice(0, max) + '\n…(message tronqué — préférez le formulaire en ligne avec webhook)';
      window.location.href =
        'mailto:contact@pinapp.fr?subject=' +
        encodeURIComponent('Diagnostic Pinapp — ' + payload.vous.prenom + ' ' + payload.vous.nom) +
        '&body=' +
        encodeURIComponent(body);
      showThanks(payload.vous.prenom);
    }

    function onSendOk() {
      showThanks(payload.vous.prenom);
      if (btnSubmit) {
        btnSubmit.textContent = 'Envoyé ✓';
        btnSubmit.disabled = true;
      }
    }

    if (!webhook) {
      fallbackMailto();
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Envoyer mon diagnostic →';
      }
      return;
    }

    if (file) {
      var fd = new FormData();
      fd.append('payload', JSON.stringify(payload));
      fd.append('fichier', file, file.name);
      fetch(webhook, { method: 'POST', body: fd })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          onSendOk();
        })
        .catch(function () {
          fallbackMailto();
        })
        .finally(function () {
          if (btnSubmit && btnSubmit.textContent !== 'Envoyé ✓') {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Envoyer mon diagnostic →';
          }
        });
    } else {
      fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          onSendOk();
        })
        .catch(function () {
          fallbackMailto();
        })
        .finally(function () {
          if (btnSubmit && btnSubmit.textContent !== 'Envoyé ✓') {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Envoyer mon diagnostic →';
          }
        });
    }
  }

  if (btnNext) {
    btnNext.addEventListener('click', function () {
      var e = validateStep(currentStep);
      if (e) {
        setErr(e);
        return;
      }
      slideTo(currentStep + 1);
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', function () {
      slideTo(currentStep - 1);
    });
  }

  document.getElementById('diagBtnEdit') &&
    document.getElementById('diagBtnEdit').addEventListener('click', function () {
      slideTo(0);
    });

  if (btnSubmit) {
    btnSubmit.addEventListener('click', function (ev) {
      ev.preventDefault();
      submitForm();
    });
  }

  if (secteur && secteurAutreWrap) {
    secteur.addEventListener('change', function () {
      var show = secteur.value === 'Autre (précisez)';
      secteurAutreWrap.hidden = !show;
      if (secteurAutre) secteurAutre.required = show;
    });
  }

  if (secteurFilter) {
    secteurFilter.addEventListener('input', applySecteurFilter);
    secteurFilter.addEventListener('search', function () {
      if (secteurFilter.value === '') applySecteurFilter();
    });
  }
  applySecteurFilter();

  form.querySelectorAll('input[name="outils_num"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var aucun = form.querySelector('input[name="outils_num"][value="Aucun"]');
      var autreO = form.querySelector('input[name="outils_num"][value="Autre"]');
      if (aucun && aucun.checked) {
        form.querySelectorAll('input[name="outils_num"]').forEach(function (x) {
          if (x !== aucun) x.checked = false;
        });
      } else if (cb.checked && cb !== aucun && aucun) {
        aucun.checked = false;
      }
      if (outilsAutreWrap) {
        var on = autreO && autreO.checked;
        outilsAutreWrap.hidden = !on;
        if (outilsAutre) outilsAutre.required = !!on;
      }
    });
  });

  form.querySelectorAll('input[name="interets"]').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var autre = form.querySelector('input[name="interets"][value="Autre"]');
      var on = autre && autre.checked;
      if (interestAutreWrap) interestAutreWrap.hidden = !on;
      if (interestAutre) interestAutre.required = !!on;
    });
  });

  if (messageLibre && charCount) {
    function updCount() {
      var n = messageLibre.value.length;
      charCount.textContent = n + ' / 2000';
    }
    messageLibre.addEventListener('input', updCount);
    updCount();
  }

  if (fichier) {
    fichier.addEventListener('change', function () {
      var f = fichier.files[0];
      if (f && f.size > FILE_MAX) {
        setErr('Fichier trop volumineux (max 5 Mo).');
        fichier.value = '';
      } else setErr('');
    });
  }

  slideTo(0);
})();
