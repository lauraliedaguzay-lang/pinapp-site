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

  var ALLOWED_MIME = {
    'image/jpeg': true,
    'image/png': true,
    'video/mp4': true,
    'video/quicktime': true,
    'application/pdf': true,
    'application/zip': true,
  };
  var MAX_FILE = 25 * 1024 * 1024;
  var MAX_TOTAL = 100 * 1024 * 1024;

  var uploadInput = document.getElementById('upload-files');
  var uploadZone = document.getElementById('wizard-upload');
  var uploadListEl = document.getElementById('upload-list');
  var uploadErrEl = document.getElementById('upload-error');
  var uploadProgressEl = document.getElementById('upload-progress');
  var uploadProgressFill = document.getElementById('upload-progress-fill');
  var submissionUuidEl = document.getElementById('cw-submission-uuid');
  var selectedFiles = [];

  function genUuid32() {
    try {
      if (window.crypto && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID().replace(/-/g, '');
      }
    } catch (e0) {}
    var s = '';
    for (var i = 0; i < 32; i++) s += ((Math.random() * 16) | 0).toString(16);
    return s;
  }

  function ensureSubmissionUuid() {
    if (submissionUuidEl && !submissionUuidEl.value) {
      submissionUuidEl.value = genUuid32();
    }
  }
  ensureSubmissionUuid();

  function totalSize(arr) {
    var t = 0;
    for (var i = 0; i < arr.length; i++) t += arr[i].size;
    return t;
  }

  function formatSize(n) {
    if (n < 1024) return n + ' o';
    if (n < 1048576) return (n / 1024).toFixed(1) + ' Ko';
    return (n / 1048576).toFixed(1) + ' Mo';
  }

  function showUploadErrors(errs) {
    if (!uploadErrEl) return;
    if (!errs || !errs.length) {
      uploadErrEl.textContent = '';
      uploadErrEl.classList.remove('is-visible');
      return;
    }
    uploadErrEl.textContent = errs.join(' ');
    uploadErrEl.classList.add('is-visible');
  }

  function syncInputFromFiles() {
    if (!uploadInput) return;
    try {
      var dt = new DataTransfer();
      for (var i = 0; i < selectedFiles.length; i++) dt.items.add(selectedFiles[i]);
      uploadInput.files = dt.files;
    } catch (e1) {}
  }

  function renderFileList() {
    if (!uploadListEl) return;
    uploadListEl.innerHTML = '';
    for (var i = 0; i < selectedFiles.length; i++) {
      (function (fileRef) {
        var li = document.createElement('li');
        li.className = 'upload-list__item';
        var name = document.createElement('span');
        name.className = 'upload-list__name';
        name.textContent = fileRef.name;
        var sz = document.createElement('span');
        sz.className = 'upload-list__size';
        sz.textContent = formatSize(fileRef.size);
        var rm = document.createElement('button');
        rm.type = 'button';
        rm.className = 'upload-list__remove';
        rm.setAttribute('aria-label', 'Retirer ' + fileRef.name);
        rm.innerHTML = '×';
        rm.addEventListener('click', function () {
          selectedFiles = selectedFiles.filter(function (x) {
            return x !== fileRef;
          });
          syncInputFromFiles();
          renderFileList();
          showUploadErrors([]);
        });
        li.appendChild(name);
        li.appendChild(sz);
        li.appendChild(rm);
        uploadListEl.appendChild(li);
      })(selectedFiles[i]);
    }
  }

  function processIncomingFileList(fileList) {
    var errs = [];
    var merged = selectedFiles.slice();
    var t = totalSize(merged);
    var list = [].slice.call(fileList || []);
    for (var i = 0; i < list.length; i++) {
      var f = list[i];
      if (!ALLOWED_MIME[f.type]) {
        errs.push('Type non accepté · ' + f.name + '.');
        continue;
      }
      if (f.size > MAX_FILE) {
        errs.push('25 Mo max · ' + f.name + '.');
        continue;
      }
      if (t + f.size > MAX_TOTAL) {
        errs.push('100 Mo max au total.');
        continue;
      }
      merged.push(f);
      t += f.size;
    }
    selectedFiles = merged;
    syncInputFromFiles();
    renderFileList();
    showUploadErrors(errs);
  }

  if (uploadZone && uploadInput) {
    uploadZone.addEventListener('dragover', function (e) {
      e.preventDefault();
      e.stopPropagation();
      uploadZone.classList.add('is-dragging');
    });
    uploadZone.addEventListener('dragleave', function (e) {
      e.preventDefault();
      uploadZone.classList.remove('is-dragging');
    });
    uploadZone.addEventListener('drop', function (e) {
      e.preventDefault();
      uploadZone.classList.remove('is-dragging');
      if (e.dataTransfer && e.dataTransfer.files) processIncomingFileList(e.dataTransfer.files);
    });
    uploadInput.addEventListener('change', function () {
      if (uploadInput.files) processIncomingFileList(uploadInput.files);
    });
  }

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
    ensureSubmissionUuid();
    showUploadErrors([]);

    var hasFiles = selectedFiles.length > 0;
    if (uploadProgressEl) uploadProgressEl.classList.remove('is-visible');
    if (uploadProgressFill) uploadProgressFill.style.width = '0%';

    function onOk() {
      if (uploadProgressEl) {
        uploadProgressEl.classList.remove('is-visible');
        uploadProgressEl.setAttribute('aria-hidden', 'true');
      }
      if (uploadProgressFill) uploadProgressFill.style.width = '0%';
      showSuccess();
    }

    if (hasFiles) {
      if (uploadProgressEl) {
        uploadProgressEl.classList.add('is-visible');
        uploadProgressEl.setAttribute('aria-hidden', 'false');
      }
      var fd = new FormData();
      fd.append('nom_complet', payload.nom_complet);
      fd.append('email', payload.email);
      fd.append('telephone', payload.telephone);
      fd.append('entreprise', payload.entreprise);
      fd.append('secteur', payload.secteur);
      fd.append('categorie', payload.categorie);
      fd.append('description', payload.description);
      fd.append('references', payload.references);
      fd.append('pack_envisage', payload.pack_envisage);
      fd.append('budget', payload.budget);
      fd.append('delai', payload.delai);
      fd.append('contact_preference', payload.contact_preference);
      fd.append('creneau', payload.creneau);
      fd.append('rgpd_consent', payload.rgpd_consent ? 'true' : 'false');
      fd.append('website', payload.website || '');
      fd.append('source', payload.source || '');
      fd.append('submission_uuid', submissionUuidEl ? submissionUuidEl.value : '');
      for (var fi = 0; fi < selectedFiles.length; fi++) {
        fd.append('files[]', selectedFiles[fi]);
      }
      var xhr = new XMLHttpRequest();
      xhr.open('POST', url);
      xhr.upload.onprogress = function (e) {
        if (!uploadProgressFill || !e.lengthComputable) return;
        var p = Math.round((100 * e.loaded) / e.total);
        uploadProgressFill.style.width = p + '%';
      };
      xhr.onload = function () {
        var ok = false;
        try {
          var data = JSON.parse(xhr.responseText || '{}');
          ok = xhr.status >= 200 && xhr.status < 300 && data && data.ok === true;
        } catch (e4) {}
        if (ok) onOk();
        else {
          if (uploadProgressEl) {
            uploadProgressEl.classList.remove('is-visible');
            uploadProgressEl.setAttribute('aria-hidden', 'true');
          }
          if (uploadProgressFill) uploadProgressFill.style.width = '0%';
          showUploadErrors(["L'envoi a échoué. Réessayez ou écrivez à contact@pinapp.fr."]);
        }
      };
      xhr.onerror = function () {
        if (uploadProgressEl) {
          uploadProgressEl.classList.remove('is-visible');
          uploadProgressEl.setAttribute('aria-hidden', 'true');
        }
        if (uploadProgressFill) uploadProgressFill.style.width = '0%';
        showUploadErrors(["L'envoi a échoué. Réessayez ou écrivez à contact@pinapp.fr."]);
      };
      xhr.send(fd);
      return;
    }

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
          onOk();
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
