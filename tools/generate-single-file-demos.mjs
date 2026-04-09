import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

/**
 * Démos : single-file, CSS/JS inline, photos distantes (Unsplash).
 * Objectifs:
 * - Conformité: bandeau démo, contenu fictif, noindex
 * - UX: rendu premium + responsive + bascule Web/Mobile dans la démo
 * - Métier: exemples crédibles (acompte, rappels, annulation, liste d'attente, etc.)
 */

const SITE_HOME = 'https://pinapp.fr/';
const REALISATIONS = 'https://pinapp.fr/realisations/';

function esc(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function unsplash(urlBase, w) {
  // urlBase is a full https://images.unsplash.com/... without query.
  const u = new URL(urlBase);
  u.searchParams.set('auto', 'format');
  u.searchParams.set('fit', 'crop');
  u.searchParams.set('q', '75');
  u.searchParams.set('w', String(w));
  u.searchParams.set('fm', 'webp');
  return u.toString();
}

function demoHtml(slug, cfg) {
  const canonical = `https://pinapp.fr/demo/${encodeURIComponent(slug)}/`;
  const hero320 = unsplash(cfg.hero.unsplash, 640);
  const hero720 = unsplash(cfg.hero.unsplash, 1200);
  const heroAlt = cfg.hero.alt || 'Photo illustrative';

  const chips = (cfg.chips || []).filter(Boolean).slice(0, 3);
  const cards = (cfg.cards || []).slice(0, 6);

  const widgetKind = cfg.widget?.kind || 'none';
  const widgetLabel = cfg.widget?.label || '';

  const featureHtml = (() => {
    if (widgetKind === 'scheduling') {
      // Inspiré veille Planity / logiciels RDV : acompte, rappels, annulation, liste d’attente
      return `
      <section class="section" aria-label="Organisation des rendez-vous (démo)">
        <div class="container">
          <div class="card feature">
            <div class="feature-head">
              <p class="feature-title">${esc(widgetLabel || 'Organisation des rendez-vous')}</p>
              <p class="feature-meta">Démo — exemples métier inspirés des outils du secteur</p>
            </div>
            <div class="grid grid-2" style="margin-top:14px;">
              <div class="subcard">
                <h3>Rappel automatique</h3>
                <p>Un rappel avant le rendez-vous. Moins d’oubli. Moins d’allers-retours.</p>
                <div class="kpi">SMS / email</div>
              </div>
              <div class="subcard">
                <h3>Acompte</h3>
                <p>Optionnel selon la prestation. Vous sécurisez les créneaux à forte demande.</p>
                <div class="kpi">0–30%</div>
              </div>
              <div class="subcard">
                <h3>Politique d’annulation</h3>
                <p>Règles lisibles pour éviter les “no‑show”. Tout est clair dès la réservation.</p>
                <div class="kpi">24–48h</div>
              </div>
              <div class="subcard">
                <h3>Liste d’attente</h3>
                <p>Quand un créneau se libère, un client est notifié. Votre planning se remplit.</p>
                <div class="kpi">Auto</div>
              </div>
            </div>
            <p class="note" style="margin-top:14px;">Démo : illustration. En production, ces règles sont configurées et testées selon votre fonctionnement.</p>
          </div>
        </div>
      </section>`;
    }
    if (widgetKind === 'estimation') {
      const base = Number(cfg.widget?.base || 0);
      const mults = cfg.widget?.mults || [1, 2, 3];
      const suffix = cfg.widget?.suffix || '';
      const label = widgetLabel || 'Estimation indicative';
      return `
      <section class="section" aria-label="Estimation (démo)">
        <div class="container">
          <div class="card feature">
            <div class="feature-head">
              <p class="feature-title">${esc(label)}</p>
              <p class="feature-meta">Vous validez avant tout engagement</p>
            </div>
            <div class="slider-row" style="margin-top:14px;">
              <input id="range" type="range" min="1" max="3" value="2" aria-label="Niveau" />
              <div><strong id="rangeLabel">Standard</strong></div>
            </div>
            <div class="result" aria-live="polite" style="margin-top:10px;">
              <span style="color: var(--text2)">Ordre de grandeur</span>
              <strong><span id="price">${esc(String(base * Number(mults[1] || 1)))}</span> ${esc(suffix)}</strong>
            </div>
            <p class="note">Démo : ordre de grandeur illustratif. En réel : devis écrit, clair, et validé.</p>
          </div>
        </div>
      </section>
      <script>
        (function(){
          var r=document.getElementById('range');
          var out=document.getElementById('price');
          var lab=document.getElementById('rangeLabel');
          if(!r||!out||!lab) return;
          var base=${JSON.stringify(base)};
          var mults=${JSON.stringify(mults)};
          var names=['Essentiel','Standard','Premium'];
          function render(){
            var i=Math.max(1,Math.min(3,parseInt(r.value||'2',10)))-1;
            lab.textContent=names[i]||'Standard';
            var v=Math.round(base*Number(mults[i]||1));
            out.textContent=String(v).replace(/\\B(?=(\\d{3})+(?!\\d))/g,' ');
          }
          r.addEventListener('input',render,{passive:true});
          render();
        })();
      </script>`;
    }
    return '';
  })();

  const cardsHtml = cards
    .map(
      (c) => `
        <article class="card">
          <h3>${esc(c.t)}</h3>
          <p>${esc(c.d)}</p>
          <div class="kpi">${esc(c.k)}</div>
        </article>`,
    )
    .join('\n');

  const chipsHtml = chips
    .map((t) => `<span class="pill">${esc(t)}</span>`)
    .join('');

  const ctaPrimary = esc(cfg.ctaPrimary || 'Démarrer');
  const ctaSecondary = esc(cfg.ctaSecondary || 'Voir d’autres démos');

  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <title>${esc(cfg.title)}</title>
    <meta name="description" content="${esc(cfg.description || 'Démonstration Pinapp Studio — contenu fictif illustratif.')}" />
    <meta name="robots" content="noindex, nofollow" />
    <link rel="canonical" href="${canonical}" />
    <link rel="icon" type="image/svg+xml" href="../../favicon.svg" />
    <link rel="preconnect" href="https://images.unsplash.com" />
    <link rel="preload" as="image" href="${hero320}" fetchpriority="high" />

    <style>
      :root{
        --bg:#070912;
        --text:#ffffff;
        --text2:rgba(255,255,255,0.72);
        --text3:rgba(255,255,255,0.50);
        --teal:#00E5CC;
        --violet:#7B4FE8;
        --glass:rgba(255,255,255,0.06);
        --glass2:rgba(255,255,255,0.035);
        --border:rgba(255,255,255,0.12);
        --shadow:0 24px 60px rgba(0,0,0,0.42);
        --r:18px;
        --pill:999px;
        --s1:8px;--s2:16px;--s3:24px;--s4:32px;--s5:48px;--s6:64px;
        --accent:${esc(cfg.accent || 'rgba(0,229,204,0.92)')};
      }
      html{scroll-behavior:auto;}
      *{box-sizing:border-box;}
      body{
        margin:0;
        font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
        color:var(--text);
        background:var(--bg);
        min-height:100svh;
        overflow-x:hidden;
      }
      body::before{
        content:'';
        position:fixed;inset:0;z-index:0;pointer-events:none;
        background:
          radial-gradient(ellipse 70% 55% at 10% 20%, rgba(123,79,232,0.12), transparent 60%),
          radial-gradient(ellipse 70% 55% at 85% 15%, rgba(0,229,204,0.10), transparent 62%),
          radial-gradient(ellipse 80% 60% at 70% 95%, rgba(57,224,117,0.07), transparent 60%),
          radial-gradient(ellipse 120% 85% at 50% 110%, rgba(0,229,204,0.08), transparent 70%),
          linear-gradient(180deg, rgba(3,6,14,0.92), rgba(2,6,12,0.96));
      }
      .demo-banner{
        position:fixed;top:0;left:0;right:0;z-index:50;
        height:calc(36px + env(safe-area-inset-top, 0px));
        padding:env(safe-area-inset-top, 0px) var(--s2) 0;
        display:flex;align-items:center;justify-content:center;gap:10px;
        font-size:11px;letter-spacing:0.1em;text-transform:uppercase;
        color:rgba(255,255,255,0.70);
        background:rgba(4,8,18,0.82);
        backdrop-filter:blur(16px) saturate(160%);
        -webkit-backdrop-filter:blur(16px) saturate(160%);
        border-bottom:1px solid rgba(255,255,255,0.08);
      }
      .live-dot{width:6px;height:6px;border-radius:50%;background:rgba(0,229,204,0.9);animation:live 2s linear infinite;}
      @keyframes live{0%,100%{opacity:1}50%{opacity:0.3}}
      main{position:relative;z-index:1;padding-top:calc(36px + env(safe-area-inset-top, 0px));}
      .container{width:min(1040px,100%);margin:0 auto;padding:0 var(--s2);}
      .toolbar{
        position:sticky;top:calc(36px + env(safe-area-inset-top, 0px));
        z-index:40; padding:10px 0 0;
      }
      .toolbar-inner{
        display:flex;align-items:center;justify-content:space-between;gap:12px;
        background:rgba(255,255,255,0.04);
        border:1px solid rgba(255,255,255,0.10);
        border-radius:999px;
        padding:8px 10px;
        backdrop-filter:blur(18px) saturate(160%);
        -webkit-backdrop-filter:blur(18px) saturate(160%);
      }
      .seg{display:inline-flex;gap:6px;align-items:center;}
      .seg button{
        border:1px solid rgba(255,255,255,0.12);
        background:rgba(0,0,0,0.18);
        color:var(--text);
        font-size:12px;
        padding:7px 10px;
        border-radius:999px;
        cursor:pointer;
        touch-action:manipulation;
      }
      .seg button[aria-pressed="true"]{
        border-color:rgba(0,229,204,0.35);
        background:rgba(0,229,204,0.12);
      }
      .brand a{color:var(--teal);text-decoration:none;font-weight:700;font-size:12px;letter-spacing:0.06em;}
      .viewport{
        margin-top:12px;
        border-radius:22px;
        border:1px solid rgba(255,255,255,0.10);
        background:rgba(255,255,255,0.03);
        backdrop-filter:blur(24px) saturate(160%);
        -webkit-backdrop-filter:blur(24px) saturate(160%);
        box-shadow:0 24px 90px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06) inset;
        overflow:hidden;
      }
      .viewport.is-mobile{
        max-width:430px;
        margin-left:auto;margin-right:auto;
        border-radius:34px;
      }
      .content{padding:0;}

      .hero{padding:var(--s5) 0 var(--s4);}
      .hero-grid{display:grid;gap:18px;grid-template-columns:1fr;}
      @media (min-width: 900px){.hero-grid{grid-template-columns:1.05fr 0.95fr;align-items:center;}}
      .kicker{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:12px;}
      .pill{display:inline-flex;align-items:center;gap:8px;border-radius:999px;padding:6px 12px;
        font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(255,255,255,0.78);
        border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);
        backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);
      }
      h1{margin:0 0 10px;font-weight:500;letter-spacing:-0.03em;line-height:1.05;font-size:clamp(34px,6vw,54px);}
      .lead{margin:0 0 16px;color:var(--text2);line-height:1.7;font-size:15px;}
      .cta-row{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:14px;}
      .btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;text-decoration:none;
        padding:10px 14px;border-radius:999px;font-size:13px;letter-spacing:0.02em;
        border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.04);color:var(--text);
        backdrop-filter:blur(18px) saturate(160%);-webkit-backdrop-filter:blur(18px) saturate(160%);
      }
      .btn-primary{border-color:rgba(123,79,232,0.42);background:rgba(123,79,232,0.22);}
      .btn-secondary{opacity:0.9}
      .note{margin:12px 0 0;color:var(--text3);font-size:12px;line-height:1.6;}

      .hero-photo{position:relative;border-radius:var(--r);overflow:hidden;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.03);}
      .hero-photo img{display:block;width:100%;height:320px;object-fit:cover;}
      @media (min-width: 900px){.hero-photo img{height:420px;}}
      .hero-photo::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.42) 100%);pointer-events:none;}

      .section{padding:var(--s4) 0;}
      .grid{display:grid;gap:12px;grid-template-columns:1fr;}
      @media (min-width: 900px){.grid{grid-template-columns:repeat(3,1fr);}}
      .grid-2{display:grid;gap:12px;grid-template-columns:1fr;}
      @media (min-width: 900px){.grid-2{grid-template-columns:repeat(2,1fr);}}

      .card{position:relative;background:var(--glass);border:1px solid var(--border);border-radius:var(--r);
        box-shadow:0 1px 0 rgba(255,255,255,0.08) inset, var(--shadow);
        backdrop-filter:blur(24px) saturate(160%);-webkit-backdrop-filter:blur(24px) saturate(160%);
        transform:translateZ(0);overflow:hidden;padding:18px;
      }
      .card h3{margin:0 0 8px;font-size:16px;letter-spacing:-0.02em;font-weight:600;}
      .card p{margin:0;color:var(--text2);font-size:13px;line-height:1.65;}
      .kpi{margin-top:12px;color:rgba(0,229,204,0.88);font-weight:700;font-size:12px;letter-spacing:0.06em;text-transform:uppercase;}
      .feature-head{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap;}
      .feature-title{margin:0;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(0,229,204,0.88);}
      .feature-meta{margin:0;color:var(--text3);font-size:12px;}
      .subcard{border:1px solid rgba(255,255,255,0.10);border-radius:16px;padding:14px;background:rgba(255,255,255,0.03);}

      .form label{display:block;font-size:12px;color:var(--text2);margin:0 0 6px;}
      .form input,.form textarea{
        width:100%;font-size:16px; /* iOS */
        border-radius:14px;border:1px solid rgba(255,255,255,0.12);
        background:rgba(0,0,0,0.18);color:var(--text);
        padding:12px 12px;
      }
      .form textarea{min-height:110px;resize:vertical;}
      .form .row{display:grid;gap:12px;grid-template-columns:1fr;}
      @media (min-width: 700px){.form .row{grid-template-columns:1fr 1fr;}}
      .ok{display:none;margin-top:12px;padding:12px 14px;border-radius:14px;border:1px solid rgba(57,224,117,0.30);background:rgba(57,224,117,0.08);color:rgba(255,255,255,0.88);font-size:13px;}
      footer{padding:var(--s4) 0 var(--s5);color:var(--text3);font-size:12px;}
      .footer-row{display:flex;flex-wrap:wrap;gap:12px;justify-content:space-between;align-items:center;}
      .back{color:rgba(0,229,204,0.9);text-decoration:none;border-bottom:1px solid rgba(0,229,204,0.25);padding-bottom:2px;}

      @media (prefers-reduced-motion: reduce){
        *{animation:none !important;transition:none !important;}
      }
    </style>
  </head>
  <body>
    <div class="demo-banner" role="note" aria-label="Bandeau de démonstration">
      <span class="live-dot" aria-hidden="true"></span>
      DÉMONSTRATION PINAPP — CONTENU FICTIF ILLUSTRATIF
    </div>
    <main>
      <div class="container toolbar" aria-label="Modes de vision (démo)">
        <div class="toolbar-inner">
          <div class="seg" role="group" aria-label="Choisir un mode de vision">
            <button type="button" id="viewWeb" aria-pressed="true">Web</button>
            <button type="button" id="viewMobile" aria-pressed="false">Mobile</button>
          </div>
          <div class="brand"><a href="${SITE_HOME}" rel="noopener noreferrer">Retour Pinapp Studio</a></div>
        </div>
      </div>

      <div class="container">
        <div class="viewport" id="viewport">
          <div class="content">
            <section class="hero" aria-label="Présentation">
              <div class="container hero-grid">
                <div>
                  <div class="kicker">${chipsHtml}</div>
                  <h1>${esc(cfg.h1).replaceAll('\\n', '<br />')}</h1>
                  <p class="lead">${esc(cfg.lead).replaceAll('\\n', '<br />')}</p>
                  <div class="cta-row">
                    <a class="btn btn-primary" href="#contact">${ctaPrimary} →</a>
                    <a class="btn btn-secondary" href="${REALISATIONS}" rel="noopener noreferrer">${ctaSecondary}</a>
                  </div>
                  <p class="note">Démo : aucune demande n’est transmise. En situation réelle, le formulaire est connecté.</p>
                </div>
                <div class="hero-photo" role="img" aria-label="${esc(heroAlt)}">
                  <img
                    src="${hero320}"
                    srcset="${hero320} 640w, ${hero720} 1200w"
                    sizes="(min-width: 900px) 44vw, 92vw"
                    alt="${esc(heroAlt)}"
                    loading="eager"
                    decoding="async" />
                </div>
              </div>
            </section>

            <section class="section" aria-label="Offre">
              <div class="container">
                <div class="grid">
${cardsHtml}
                </div>
              </div>
            </section>

${featureHtml}

            <section class="section" id="contact" aria-label="Contact (démo)">
              <div class="container">
                <div class="card form">
                  <div class="feature-head">
                    <p class="feature-title">${esc(cfg.formTitle || 'Demande')}</p>
                    <p class="feature-meta">${esc(cfg.formMeta || 'Réponse sous 24 h (exemple)')}</p>
                  </div>
                  <p class="note" style="margin-top:10px;">${esc(cfg.formHint || 'Démo : ce formulaire ne transmet rien.')}</p>
                  <form id="form">
                    <div class="row" style="margin-top:12px;">
                      <div>
                        <label for="name">Nom</label>
                        <input id="name" name="name" autocomplete="name" />
                      </div>
                      <div>
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" autocomplete="email" required />
                      </div>
                    </div>
                    <div style="margin-top:12px;">
                      <label for="msg">Votre besoin</label>
                      <textarea id="msg" name="message" placeholder="${esc(cfg.formPlaceholder || 'Ex: créneaux, tarifs, objectifs…')}"></textarea>
                    </div>
                    <div class="cta-row" style="margin-top:12px;">
                      <button class="btn btn-primary" type="submit">Envoyer →</button>
                      <a class="btn btn-secondary" href="${SITE_HOME}" rel="noopener noreferrer">Retour Pinapp Studio</a>
                    </div>
                    <div class="ok" id="ok">Reçu. (Démo) En réel, vous recevez une réponse sous 24 h.</div>
                  </form>
                </div>
              </div>
            </section>

            <footer>
              <div class="container footer-row">
                <span>${esc(cfg.footerLabel || cfg.brand || 'Démo fictive')}</span>
                <a class="back" href="${SITE_HOME}" rel="noopener noreferrer">Retour Pinapp Studio</a>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>

    <script>
      (function(){
        var viewport=document.getElementById('viewport');
        var web=document.getElementById('viewWeb');
        var mob=document.getElementById('viewMobile');
        function setMode(m){
          var isMobile = m==='mobile';
          viewport.classList.toggle('is-mobile', isMobile);
          web.setAttribute('aria-pressed', isMobile ? 'false' : 'true');
          mob.setAttribute('aria-pressed', isMobile ? 'true' : 'false');
          try { history.replaceState(null,'', location.pathname + (isMobile ? '?view=mobile' : '')); } catch(e){}
        }
        web && web.addEventListener('click', function(){ setMode('web'); });
        mob && mob.addEventListener('click', function(){ setMode('mobile'); });
        try{
          if (location.search && /view=mobile/.test(location.search)) setMode('mobile');
        } catch(e){}

        var form=document.getElementById('form');
        var ok=document.getElementById('ok');
        if(form){
          form.addEventListener('submit', function(e){
            e.preventDefault();
            if(ok) ok.style.display='block';
          });
        }
      })();
    </script>
  </body>
</html>`;
}

const DEMOS = {
  artisan: {
    title: 'Renov & Co — Artisan BTP Île-de-France — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : site premium pour artisan BTP, contenu fictif illustratif.',
    chips: ['ARTISAN / BTP', 'ÎLE‑DE‑FRANCE'],
    h1: 'Votre chantier, cadré.\nVotre devis, prêt.',
    lead:
      'Exemple de site pensé pour un artisan : crédibilité, prise de contact rapide, et estimation claire à valider.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Demander un devis',
    ctaSecondary: 'Voir d’autres démos',
    hero: {
      unsplash: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e',
      alt: 'Photo illustrative de chantier',
    },
    cards: [
      { t: 'Urgences', d: 'Plomberie, électricité, serrurerie. Réponse rapide par message.', k: 'Intervention sous 2h' },
      { t: 'Rénovation', d: 'Salle de bain, cuisine, pièce complète. Devis structuré.', k: 'Devis écrit' },
      { t: 'Entretien', d: 'Interventions planifiées. Contrats annuels.', k: 'À partir de 80€' },
    ],
    widget: { kind: 'estimation', label: 'Estimation indicative', suffix: '€', base: 2700, mults: [0.7, 1, 1.35] },
    formTitle: 'Demande de devis',
    formHint: 'Démo : ce formulaire ne transmet rien. En situation réelle, il envoie une demande structurée.',
  },
  restaurant: {
    title: 'Ōkami — Restaurant japonais Paris 6e — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : site premium pour restaurant, contenu fictif illustratif.',
    chips: ['RESTAURANT', 'PARIS 6E'],
    h1: 'Une table.\nUn moment.',
    lead:
      'Exemple de site pensé pour un restaurant : réservation claire, preuves, et une expérience mobile qui donne envie.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Réserver ce soir',
    ctaSecondary: 'Voir d’autres démos',
    hero: {
      unsplash: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba',
      alt: 'Photo illustrative de restaurant',
    },
    cards: [
      { t: 'Menu déjeuner', d: 'Entrée + plat + dessert. Midi en semaine.', k: '35€' },
      { t: 'Menu dégustation', d: '7 temps. Accords mets & sakés.', k: '75€' },
      { t: 'Privatisation', d: 'Événements, entreprises, anniversaires.', k: 'Sur devis' },
    ],
    widget: { kind: 'estimation', label: 'Organisation (démo)', suffix: '', base: 1, mults: [1, 1, 1] },
    formTitle: 'Réservation (démo)',
    formPlaceholder: 'Ex: 2 personnes, 19h30, allergie…',
  },
  coach: {
    title: 'Clara Fontaine — Coach ICF Paris — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : site premium pour coach, contenu fictif illustratif.',
    chips: ['COACHING', 'PARIS'],
    h1: 'Clarifier.\nDécider.\nAvancer.',
    lead:
      'Exemple de site pensé pour une coach : offre lisible, preuve, et demande structurée.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Demander une synthèse',
    ctaSecondary: 'Voir d’autres démos',
    hero: {
      unsplash: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df',
      alt: 'Photo illustrative de coaching',
    },
    cards: [
      { t: 'Coaching individuel', d: '4 séances mensuelles. Cap clair, plan d’action réaliste.', k: '1 mois' },
      { t: 'Bilan', d: 'Phases structurées. Vous validez chaque étape.', k: '6 semaines' },
      { t: 'Ateliers', d: 'Entreprises. Formats sur mesure.', k: 'Sur devis' },
    ],
    widget: { kind: 'estimation', label: 'Cadrage (démo)', suffix: '', base: 1, mults: [1, 1, 1] },
    formTitle: 'Demande',
  },
  avocat: {
    title: 'Cabinet Renaud — Avocat Paris — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : site premium pour avocat, contenu fictif illustratif.',
    chips: ['AVOCAT', 'PARIS'],
    h1: 'Un cabinet, lisible.\nUne prise de contact, claire.',
    lead:
      'Exemple de site pensé pour un cabinet : crédibilité, explication simple, et premier message structuré.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Écrire',
    ctaSecondary: 'Voir d’autres démos',
    hero: {
      unsplash: 'https://images.unsplash.com/photo-1521791136064-7986c2920216',
      alt: 'Photo illustrative de cabinet',
    },
    cards: [
      { t: 'Droit du travail', d: 'Accompagnement employeur et salarié. Cadrage clair.', k: 'Réponse sous 24h' },
      { t: 'Contrats', d: 'Relecture et rédaction. Vous gardez le dernier mot.', k: 'Devis écrit' },
      { t: 'Contentieux', d: 'Préparation du dossier. Étapes simples à valider.', k: 'Suivi' },
    ],
    widget: { kind: 'estimation', label: 'Ordre de grandeur', suffix: '€', base: 240, mults: [0.7, 1, 1.4] },
    formTitle: 'Prendre contact',
  },
  estheticienne: {
    title: 'Studio Élise — Institut beauté — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : institut beauté, contenu fictif illustratif.',
    chips: ['INSTITUT', 'BEAUTÉ'],
    h1: 'Une présence, premium.\nUn agenda, net.',
    lead:
      'Exemple de site institut : prestations, preuve, et réservation cadrée.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Voir d’autres démos',
    hero: {
      unsplash: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9',
      alt: 'Photo illustrative institut de beauté',
    },
    cards: [
      { t: 'Soin visage', d: 'Infos claires. Créneau simple à réserver.', k: '45 min' },
      { t: 'Massage', d: 'Choix guidé. Confirmation nette.', k: '60 min' },
      { t: 'Épilation', d: 'Créneaux rapides.', k: '20 min' },
    ],
    widget: { kind: 'scheduling', label: 'Rendez-vous (démo)' },
    formTitle: 'Demande de RDV',
    formPlaceholder: 'Ex: soin visage, jeudi 18h, première visite…',
  },
  cils: {
    title: 'Studio Nova — Extensions de cils — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : extensions de cils, contenu fictif illustratif.',
    chips: ['CILS', 'BEAUTÉ'],
    h1: 'Un agenda, rempli.\nSans promo.',
    lead: 'Exemple de site beauté : prestations, preuves, et prise de RDV claire.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1526045478516-99145907023c', alt: 'Photo illustrative beauty' },
    cards: [
      { t: 'Classique', d: 'Naturel, net. Résultat régulier.', k: '1h' },
      { t: 'Volume', d: 'Plus dense, sans surcharge.', k: '1h15' },
      { t: 'Remplissage', d: 'Rythme simple à réserver.', k: '45 min' },
    ],
    widget: { kind: 'scheduling', label: 'Rendez-vous (démo)' },
    formTitle: 'Demande de RDV',
  },
  ongles: {
    title: 'Atelier Perle — Onglerie — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : onglerie, contenu fictif illustratif.',
    chips: ['ONGLES', 'BEAUTÉ'],
    h1: 'Un rendu, net.\nUne réservation, simple.',
    lead: 'Exemple de site onglerie : prestations, prix, et RDV.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1522336572468-97b06e8ef143', alt: 'Photo illustrative onglerie' },
    cards: [
      { t: 'Pose', d: 'Choix guidé, résultat attendu.', k: '1h' },
      { t: 'Remplissage', d: 'Rythme simple.', k: '45 min' },
      { t: 'Nail art', d: 'Option claire.', k: '+15 min' },
    ],
    widget: { kind: 'scheduling', label: 'Rendez-vous (démo)' },
    formTitle: 'Demande de RDV',
  },
  coiffeur: {
    title: 'Atelier Lune — Coiffeur — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : coiffeur, contenu fictif illustratif.',
    chips: ['COIFFEUR', 'SALON'],
    h1: 'Des créneaux.\nUne expérience.',
    lead: 'Exemple de site coiffeur : services, prix, et prise de RDV rapide.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Réserver',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f', alt: 'Photo illustrative salon coiffure' },
    cards: [
      { t: 'Coupe', d: 'Prise de RDV en 30 secondes.', k: '30 min' },
      { t: 'Coloration', d: 'Options claires. Historique utile.', k: '1h30' },
      { t: 'Soin', d: 'Ajoutable facilement.', k: '20 min' },
    ],
    widget: { kind: 'scheduling', label: 'Rendez-vous (démo)' },
    formTitle: 'Demande de RDV',
  },
  barbier: {
    title: 'Atelier Barber — Barbier — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : barbier, contenu fictif illustratif.',
    chips: ['BARBIER', 'CENTRE‑VILLE'],
    h1: 'Un planning, fluide.\nUne image, premium.',
    lead: 'Exemple de site barbier : prestations, prix, et réservation claire.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Réserver',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438', alt: 'Photo illustrative barbier' },
    cards: [
      { t: 'Coupe', d: 'Créneaux nets. Infos essentielles.', k: '30 min' },
      { t: 'Barbe', d: 'Rituel précis. Résultat propre.', k: '25 min' },
      { t: 'Pack', d: 'Coupe + barbe. Une seule réservation.', k: '55 min' },
    ],
    widget: { kind: 'scheduling', label: 'Rendez-vous (démo)' },
    formTitle: 'Demande de RDV',
  },
  boulangerie: {
    title: 'Maison Céleste — Boulangerie — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : boulangerie, contenu fictif illustratif.',
    chips: ['BOULANGERIE', 'QUARTIER'],
    h1: 'Une vitrine, claire.\nDes commandes, simples.',
    lead: 'Exemple de site boulangerie : offres, horaires, et commande.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Commander (démo)',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1542838132-92c53300491e', alt: 'Photo illustrative boulangerie' },
    cards: [
      { t: 'Pains', d: 'Disponibilités mises à jour, sans effort.', k: 'Chaque jour' },
      { t: 'Viennoiseries', d: 'Produits phares visibles rapidement.', k: 'Matin' },
      { t: 'Gâteaux', d: 'Commande anticipée, confirmation claire.', k: '48h' },
    ],
    widget: { kind: 'estimation', label: 'Commande (démo)', suffix: '€', base: 24, mults: [0.8, 1, 1.3] },
    formTitle: 'Commande',
    formPlaceholder: 'Ex: 2 pains, 6 croissants, retrait 8h…',
  },
  trainer: {
    title: 'Studio Atlas — Coach sportif — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : coach sportif, contenu fictif illustratif.',
    chips: ['SPORT', 'COACHING'],
    h1: 'Un suivi.\nUne routine.\nÇa tourne.',
    lead: 'Exemple de site coach sportif : offres, planning, et demande claire.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Demander un plan',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1517832207067-4db24a2ae47c', alt: 'Photo illustrative sport' },
    cards: [
      { t: 'Programme', d: 'Structure claire, sans friction.', k: '6 sem.' },
      { t: 'Suivi', d: 'Rappels utiles, simples.', k: 'Hebdo' },
      { t: 'RDV', d: 'Créneaux nets.', k: '45 min' },
    ],
    widget: { kind: 'estimation', label: 'Organisation (démo)', suffix: '', base: 1, mults: [1, 1, 1] },
    formTitle: 'Demande',
  },
  'sur-mesure': {
    title: 'Luminance & Lieu — Vitrine sur‑mesure — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : vitrine sur‑mesure, contenu fictif illustratif.',
    chips: ['SUR‑MESURE', 'PREMIUM'],
    h1: 'Une vitrine dense.\nSans surcharge.',
    lead: 'Exemple de vitrine premium : sections, preuves et contact.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Décrire mon projet',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d', alt: 'Photo illustrative sur-mesure' },
    cards: [
      { t: 'Présentation', d: 'Positionnement clair, sans jargon.', k: '1 écran' },
      { t: 'Preuves', d: 'Avant/Après + détails concrets.', k: 'visuel' },
      { t: 'Contact', d: 'Message structuré, simple.', k: '1 min' },
    ],
    widget: { kind: 'estimation', label: 'Ordre de grandeur', suffix: '€', base: 1990, mults: [0.8, 1, 1.25] },
    formTitle: 'Demande',
  },
  tatoueuse: {
    title: 'Nocturne Ink — Tatoueuse — Démo Pinapp Studio',
    description: 'Démonstration Pinapp Studio : tatoueuse, contenu fictif illustratif.',
    chips: ['TATOUAGE', 'STUDIO'],
    h1: 'Un book, clair.\nUn brief, propre.',
    lead: 'Exemple de site tatoueuse : book, style, et formulaire de brief.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Envoyer mon brief',
    ctaSecondary: 'Voir d’autres démos',
    hero: { unsplash: 'https://images.unsplash.com/photo-1520975958225-0d64a5a5f3ab', alt: 'Photo illustrative tatouage' },
    cards: [
      { t: 'Styles', d: 'Sélection lisible. Univers cohérent.', k: 'Book' },
      { t: 'Devis', d: 'Brief clair, réponse par écrit.', k: '24h' },
      { t: 'RDV', d: 'Étapes simples.', k: 'Calme' },
    ],
    widget: { kind: 'estimation', label: 'Cadrage (démo)', suffix: '', base: 1, mults: [1, 1, 1] },
    formTitle: 'Brief',
    formPlaceholder: 'Ex: zone, taille, style, contraintes…',
  },
};

function main() {
  let wrote = 0;
  for (const [slug, cfg] of Object.entries(DEMOS)) {
    const outDir = path.join(root, 'demo', slug);
    const outPath = path.join(outDir, 'index.html');
    if (!fs.existsSync(outDir)) continue;
    fs.writeFileSync(outPath, demoHtml(slug, cfg), 'utf8');
    wrote++;
  }
  console.log(`generate-single-file-demos: wrote ${wrote} demo(s)`);
}

main();

