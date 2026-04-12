/**
 * Pinapp admin — mot de passe côté client uniquement (site statique).
 * Remplacez la phrase secrète avant mise en production.
 */
(function () {
  'use strict';

  var SESSION_KEY = 'pinapp_admin_ok';
  var CATALOG_PATH = '../assets/data/pinapp-catalog.json';

  /**
   * Mot de passe admin — à personnaliser impérativement.
   * Sur hébergement statique, toute personne peut lire le JS : combinez avec auth serveur (Basic Auth, Netlify, etc.) si besoin réel.
   */
  var ADMIN_PASSPHRASE = 'pinapp-change-me-admin';

  var loginRoot = document.getElementById('admin-login-root');
  var appRoot = document.getElementById('admin-app-root');
  var form = document.getElementById('admin-login-form');
  var errEl = document.getElementById('admin-login-error');

  function isAuthed() {
    try {
      return sessionStorage.getItem(SESSION_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function setAuthed() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1');
    } catch (e) {}
  }

  function clearAuthed() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch (e) {}
  }

  function showLogin() {
    if (loginRoot) loginRoot.hidden = false;
    if (appRoot) appRoot.hidden = true;
    document.body.classList.add('admin-root--login');
  }

  function showApp() {
    if (loginRoot) loginRoot.hidden = true;
    if (appRoot) appRoot.hidden = false;
    document.body.classList.remove('admin-root--login');
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = document.getElementById('admin-pass');
      var val = input ? input.value : '';
      if (val === ADMIN_PASSPHRASE) {
        setAuthed();
        if (errEl) errEl.textContent = '';
        if (input) input.value = '';
        showApp();
        bootApp();
      } else {
        if (errEl) errEl.textContent = 'Mot de passe incorrect.';
      }
    });
  }

  document.getElementById('admin-logout')?.addEventListener('click', function () {
    clearAuthed();
    showLogin();
  });

  function originBase() {
    return window.location.origin || '';
  }

  function fullUrl(path) {
    if (!path) return originBase() + '/';
    if (/^https?:\/\//i.test(path)) return path;
    var p = path.startsWith('/') ? path : '/' + path;
    return originBase() + p;
  }

  var catalogCache = null;

  function loadCatalog() {
    if (catalogCache) return Promise.resolve(catalogCache);
    return fetch(CATALOG_PATH, { credentials: 'same-origin' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        catalogCache = data;
        return data;
      });
  }

  function renderPrograms(data, container) {
    if (!container || !data.programs) return;
    container.innerHTML = '';
    data.programs.forEach(function (prog) {
      var article = document.createElement('article');
      article.className = 'admin-program';
      var h2 = document.createElement('h2');
      h2.textContent = prog.title || prog.id;
      article.appendChild(h2);
      var meta = document.createElement('p');
      meta.className = 'meta';
      meta.textContent = [prog.type, prog.status].filter(Boolean).join(' · ');
      article.appendChild(meta);
      if (prog.summary) {
        var p = document.createElement('p');
        p.className = 'meta';
        p.style.marginBottom = '0.5rem';
        p.textContent = prog.summary;
        article.appendChild(p);
      }
      var open = document.createElement('a');
      open.href = fullUrl(prog.publicPath || '/');
      open.target = '_blank';
      open.rel = 'noopener noreferrer';
      open.className = 'refonte-link-teal';
      open.style.fontSize = '0.875rem';
      open.textContent = 'Ouvrir la page publique (vue client) →';
      article.appendChild(open);

      if (prog.packs && prog.packs.length) {
        prog.packs.forEach(function (pack) {
          var packEl = document.createElement('div');
          packEl.className = 'admin-pack';
          var h3 = document.createElement('h3');
          h3.textContent = pack.name + (pack.priceEUR != null ? ' — ' + pack.priceEUR + ' €' : '');
          packEl.appendChild(h3);
          if (pack.prerequisites) {
            var pr = document.createElement('p');
            pr.className = 'meta';
            pr.style.margin = '0.25rem 0';
            pr.textContent = 'Prérequis : ' + pack.prerequisites;
            packEl.appendChild(pr);
          }
          if (pack.modules && pack.modules.length) {
            var ul = document.createElement('ul');
            pack.modules.forEach(function (m) {
              var li = document.createElement('li');
              li.textContent = m;
              ul.appendChild(li);
            });
            packEl.appendChild(ul);
          }
          article.appendChild(packEl);
        });
      }

      if (prog.offers && prog.offers.length) {
        prog.offers.forEach(function (off) {
          var packEl = document.createElement('div');
          packEl.className = 'admin-pack';
          var h3 = document.createElement('h3');
          h3.textContent = off.name + (off.priceEUR != null ? ' — ' + off.priceEUR + ' €' : '');
          packEl.appendChild(h3);
          article.appendChild(packEl);
        });
      }

      container.appendChild(article);
    });
  }

  function renderPages(data, container) {
    if (!container || !data.clientPages) return;
    container.innerHTML = '';
    var table = document.createElement('table');
    table.className = 'admin-pages-table';
    var thead = document.createElement('thead');
    thead.innerHTML = '<tr><th>Page</th><th>Chemin</th><th>Note</th><th></th></tr>';
    table.appendChild(thead);
    var tbody = document.createElement('tbody');
    data.clientPages.forEach(function (page) {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      td1.textContent = page.title || page.id;
      var td2 = document.createElement('td');
      td2.textContent = page.path || '';
      var td3 = document.createElement('td');
      td3.textContent = page.note || '';
      td3.style.fontSize = '0.8125rem';
      td3.style.color = 'var(--text-muted)';
      var td4 = document.createElement('td');
      var a = document.createElement('a');
      a.href = fullUrl(page.path);
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Voir';
      a.className = 'refonte-link-teal';
      a.style.fontSize = '0.8125rem';
      td4.appendChild(a);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    container.appendChild(table);
  }

  function fillPreviewSelect(data, select) {
    if (!select) return;
    select.innerHTML = '';
    var opt0 = document.createElement('option');
    opt0.value = '';
    opt0.textContent = 'Choisir une page…';
    select.appendChild(opt0);
    if (data.clientPages) {
      data.clientPages.forEach(function (page) {
        var o = document.createElement('option');
        o.value = fullUrl(page.path);
        o.textContent = (page.title || page.id) + ' — ' + page.path;
        select.appendChild(o);
      });
    }
    if (data.programs) {
      data.programs.forEach(function (prog) {
        var o = document.createElement('option');
        o.value = fullUrl(prog.publicPath);
        o.textContent = 'Programme : ' + (prog.title || prog.id);
        select.appendChild(o);
      });
    }
  }

  function setupTabs() {
    var tabs = document.querySelectorAll('.admin-tabs [role="tab"]');
    var panels = document.querySelectorAll('.admin-panel');
    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var id = tab.getAttribute('aria-controls');
        tabs.forEach(function (t) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        });
        panels.forEach(function (p) {
          p.hidden = p.id !== id;
        });
      });
    });
  }

  function bootApp() {
    var programsEl = document.getElementById('admin-programs');
    var pagesEl = document.getElementById('admin-pages');
    var preEl = document.getElementById('admin-json-pre');
    var apiNote = document.getElementById('admin-api-endpoint');
    var select = document.getElementById('admin-preview-url');
    var iframe = document.getElementById('admin-preview-iframe');
    var btnReload = document.getElementById('admin-preview-reload');

    loadCatalog()
      .then(function (data) {
        if (apiNote && data.api && data.api.endpoint) {
          apiNote.innerHTML =
            'Endpoint catalogue (API lecture) : <code>' +
            originBase() +
            data.api.endpoint +
            '</code>';
        }
        renderPrograms(data, programsEl);
        renderPages(data, pagesEl);
        if (preEl) preEl.textContent = JSON.stringify(data, null, 2);
        fillPreviewSelect(data, select);

        document.getElementById('admin-copy-json')?.addEventListener('click', function () {
          if (!preEl) return;
          navigator.clipboard.writeText(preEl.textContent).catch(function () {});
        });

        function loadIframe() {
          if (!iframe || !select) return;
          var u = select.value;
          if (u) iframe.src = u;
        }

        select?.addEventListener('change', loadIframe);
        btnReload?.addEventListener('click', loadIframe);
      })
      .catch(function () {
        if (programsEl) {
          programsEl.innerHTML =
            '<p class="meta">Impossible de charger le catalogue. Vérifiez le chemin assets/data/pinapp-catalog.json</p>';
        }
      });

    setupTabs();

    if (window.PinappAdminStudio && typeof window.PinappAdminStudio.init === 'function') {
      window.PinappAdminStudio.init();
    }
  }

  if (isAuthed()) {
    showApp();
    bootApp();
  } else {
    showLogin();
  }
})();
