import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function includeHtml(file) {
  return fs.readFileSync(path.join(__dirname, 'html-includes', file), 'utf8');
}

/** Nombre de ../ depuis le dossier du fichier HTML jusqu'à la racine du site (pour file:// et zip). */
function pathToRootPrefix(file) {
  const dir = path.dirname(file);
  if (!dir || dir === '.') return '';
  const depth = dir.split(/[/\\]/).filter(Boolean).length;
  return '../'.repeat(depth);
}

function assetHref(rootPrefix, absPath) {
  const tail = absPath.replace(/^\//, '');
  if (!rootPrefix) return tail;
  return rootPrefix + tail;
}

/** Chemins /foo/ → relatifs (file:// + déploiement sous-dossier). Racine : sans premier slash. */
function siteUrl(rootPrefix, pathname) {
  let hash = '';
  let x = pathname;
  const hi = x.indexOf('#');
  if (hi !== -1) {
    hash = x.slice(hi);
    x = x.slice(0, hi);
  }
  let query = '';
  const qi = x.indexOf('?');
  if (qi !== -1) {
    query = x.slice(qi);
    x = x.slice(0, qi);
  }
  const raw = x.replace(/^\/+/, '').replace(/\/+$/, '');
  if (!raw) return (rootPrefix || '') + 'index.html' + query + hash;
  const lastSeg = raw.split('/').pop() || '';
  if (/\.[a-z0-9]{2,8}$/i.test(lastSeg)) {
    return (rootPrefix || '') + raw + query + hash;
  }
  return (rootPrefix || '') + raw + '/index.html' + query + hash;
}

function rewriteBodySiteLinks(html, rootPrefix) {
  let out = html.replace(/\bhref=(["'])(\/[^"']*)\1/g, (m, q, pth) => {
    if (pth.startsWith('//')) return m;
    return 'href=' + q + siteUrl(rootPrefix, pth) + q;
  });
  out = out.replace(/\bsrc=(["'])(\/[^"']+)\1/g, (m, q, pth) => {
    if (/^\/\//.test(pth)) return m;
    return 'src=' + q + assetHref(rootPrefix, pth) + q;
  });
  return out;
}

export function shell(title, desc, ogPath, mainInner, includeLdJson = true, rootPrefix = '') {
  const a = (p) => assetHref(rootPrefix, p);
  const u = (p) => siteUrl(rootPrefix, p);
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="theme-color" id="pinapp-theme-color" content="#050A14">
  <script src="${a('/assets/js/theme-init.js')}"></script>
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc.replace(/"/g, '&quot;')}">
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}">
  <meta property="og:description" content="${desc.replace(/"/g, '&quot;')}">
  <meta property="og:image" content="https://pinapp.fr/og-image.webp">
  <meta property="og:url" content="https://pinapp.fr${ogPath}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" type="image/svg+xml" href="${a('/favicon.svg')}">
  <link rel="preload" href="${a('/assets/fonts/inter-var.woff2')}" as="font" type="font/woff2" crossorigin>
  <link rel="stylesheet" href="${a('/assets/variables.css')}">
  <link rel="stylesheet" href="${a('/assets/grid.css')}">
  <link rel="stylesheet" href="${a('/assets/animations.css')}">
  ${includeLdJson ? `<script type="application/ld+json">
  {"@context":"https://schema.org","@type":"ProfessionalService","name":"Pinapp Studio","founder":{"@type":"Person","name":"Lauralie Daguzay"},"email":"lauralie.daguzay@pinapp.fr","url":"https://pinapp.fr","sameAs":"https://www.linkedin.com/in/lauralie-daguzay-4a4542197/"}
  </script>` : ''}
</head>
<body class="page-with-bottom-nav">
  <a href="#contenu-principal" class="skip-link">Aller au contenu principal</a>
  <div class="scroll-progress" id="scrollProgress"></div>
  <div id="loader" role="status" aria-label="Chargement">
    <svg viewBox="0 0 40 48" width="48" height="58" fill="none" stroke="var(--accent-teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M20 2 C16 6 12 8 14 12"/><path d="M20 2 C20 7 20 9 20 12"/><path d="M20 2 C24 6 28 8 26 12"/>
      <ellipse cx="20" cy="30" rx="12" ry="16"/>
      <path d="M8 24 L20 18 L32 24 L20 30 Z"/><path d="M8 30 L20 24 L32 30 L20 36 Z"/><path d="M8 36 L20 30 L32 36 L20 42 Z"/>
    </svg>
    <p>Pinapp se prépare.</p>
  </div>
  <div class="noise-overlay" aria-hidden="true"></div>
  <nav class="nav" id="mainNav" role="navigation">
    <div class="container nav-inner">
      <a href="${u('/')}" class="pinapp-breathe nav-logo" aria-label="Pinapp Studio — accueil">
        <img src="${a('/assets/images/pinapp-logo.png')}" alt="Pinapp" width="200" height="60" decoding="async" class="nav-logo-img">
      </a>
      <div class="nav-links">
        <a href="${u('/pourquoi-pinapp/')}" class="nav-link" style="font-size:14px;opacity:0.8;" title="Pourquoi Pinapp">Pourquoi</a>
        <a href="${u('/comment-ca-marche/')}" class="nav-link" style="font-size:14px;opacity:0.8;">Comment ça marche</a>
        <a href="${u('/offres/')}" class="nav-link" style="font-size:14px;opacity:0.8;">Offres</a>
        <a href="${u('/realisations/')}" class="nav-link" style="font-size:14px;opacity:0.8;">Réalisations</a>
        <a href="${u('/diagnostic/')}" class="btn btn-primary" style="font-size:13px;padding:10px 20px;">Diagnostic offert</a>
      </div>
      <div class="nav-trailing">
        <button type="button" class="theme-toggle" id="themeToggle" aria-label="Changer le thème">
          <svg class="theme-icon-sun" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
          <svg class="theme-icon-moon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>
        <button type="button" class="burger" id="burger" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobileDrawer">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>
    </div>
  </nav>
  <div class="mobile-drawer" id="mobileDrawer" aria-hidden="true" role="dialog" aria-label="Menu" aria-modal="true">
    <div class="mobile-drawer-panel">
      <button type="button" id="drawerClose" aria-label="Fermer le menu">×</button>
      <a href="${u('/pourquoi-pinapp/')}">Pourquoi Pinapp</a>
      <a href="${u('/comment-ca-marche/')}">Comment ça marche</a>
      <a href="${u('/offres/')}">Offres</a>
      <a href="${u('/realisations/')}">Réalisations</a>
      <a href="${u('/confiance/')}">Confiance</a>
      <a href="${u('/votre-projet/')}">Votre projet</a>
      <a href="${u('/faq/')}">FAQ</a>
      <a href="${u('/auralis/')}">Auralis RH</a>
      <a href="${u('/diagnostic/')}">Diagnostic offert</a>
      <a href="${u('/a-propos/')}">À propos</a>
    </div>
  </div>
  <div class="bottom-bar" role="navigation" aria-label="Navigation mobile">
    <a href="${u('/')}">Accueil</a>
    <a href="${u('/offres/')}">Offres</a>
    <a href="${u('/realisations/')}">Réalisations</a>
    <a href="${u('/diagnostic/')}">Diagnostic</a>
  </div>
  <main id="contenu-principal" class="stack-above-bg" tabindex="-1">
${mainInner}
  </main>
  <footer style="border-top:1px solid var(--separator);padding:var(--space-5) 0;">
    <div class="container" style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:var(--space-3);opacity:0.6;font-size:13px;">
      <span>Pinapp © 2026</span>
      <div style="display:flex;gap:var(--space-3);">
        <a href="https://www.linkedin.com/in/lauralie-daguzay-4a4542197/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:lauralie.daguzay@pinapp.fr">Contact</a>
      </div>
      <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">
        <a href="${u('/legal/mentions.html')}">Mentions légales</a>
        <a href="${u('/legal/cgv.html')}">CGV</a>
        <a href="${u('/legal/confidentialite.html')}">Confidentialité</a>
        <a href="${u('/legal/accessibilite.html')}">Accessibilité</a>
        <a href="${u('/legal/ethique.html')}">Éthique</a>
      </div>
      <span style="width:100%;text-align:center;font-size:var(--text-label);color:var(--accent-teal);opacity:0.6;letter-spacing:0.12em;">PINAPP AU CONCOURS LÉPINE 2026</span>
    </div>
  </footer>
  <div id="cookie-banner" role="dialog" aria-label="Cookies" style="position:fixed;bottom:0;left:0;right:0;padding:var(--space-3);background:var(--bg-card);border-top:1px solid var(--border-card);backdrop-filter:blur(20px);z-index:9000;display:none;">
    <div class="container" style="display:flex;align-items:center;justify-content:space-between;gap:var(--space-3);flex-wrap:wrap;">
      <p style="font-size:13px;opacity:0.8;max-width:600px;">Ce site utilise des cookies de mesure d'audience anonymes (Plausible Analytics — sans tracking personnel).</p>
      <div style="display:flex;gap:var(--space-2);">
        <button type="button" id="cookieAccept" class="btn btn-primary" style="font-size:13px;padding:10px 20px;">Accepter</button>
        <button type="button" id="cookieRefuse" class="btn btn-secondary" style="font-size:13px;padding:10px 20px;">Refuser</button>
      </div>
    </div>
  </div>
  <script src="${a('/assets/js/main.js')}" defer></script>
</body>
</html>`;
}

const pages = [
  {
    file: 'comment-ca-marche/index.html',
    title: 'Comment ça marche — Pinapp Studio',
    desc: 'Process Pinapp : diagnostic, proposition, construction, livraison.',
    og: '/comment-ca-marche/',
    body: `    <section class="section">
      <div class="container" style="max-width:800px;">
        <p class="label" style="margin-bottom:var(--space-2);">SIMPLE ET TRANSPARENT</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;margin-bottom:var(--space-3);">Comment ça marche</h1>
        <p style="font-size:20px;opacity:0.7;margin-bottom:var(--space-7);">De la première conversation à la livraison finale. Voici exactement ce qui se passe.</p>
        <div class="step-item" style="display:grid;grid-template-columns:64px 1fr;gap:var(--space-4);margin-bottom:var(--space-6);">
          <div style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent-violet);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:24px;color:var(--accent-violet);">1</span></div>
          <div>
            <h2 style="font-size:24px;margin-bottom:var(--space-1);">On se parle — 30 minutes offertes</h2>
            <p style="opacity:0.7;line-height:1.8;margin-bottom:var(--space-2);">Vous me racontez votre quotidien. Vos outils, vos tâches, ce qui vous prend du temps, ce qui vous frustre. Je cartographie tout et identifie 3 opportunités concrètes.</p>
            <p style="opacity:0.7;line-height:1.8;">Vous repartez avec des idées actionnables — même si vous ne travaillez pas avec moi ensuite. C'est offert. Zéro engagement.</p>
            <a href="/diagnostic/" class="btn btn-primary" style="display:inline-flex;margin-top:var(--space-3);">Réserver mon diagnostic</a>
          </div>
        </div>
        <div class="step-item" style="display:grid;grid-template-columns:64px 1fr;gap:var(--space-4);margin-bottom:var(--space-6);">
          <div style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent-violet);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:24px;color:var(--accent-violet);">2</span></div>
          <div>
            <h2 style="font-size:24px;margin-bottom:var(--space-1);">Une proposition claire sous 48h</h2>
            <p style="opacity:0.7;line-height:1.8;">Une page. Pas un roman. Ce qu'on fait exactement, ce que ça coûte, ce que vous gagnez. Délai précis. Prix fixe. Vous signez électroniquement si ça vous convient — sinon aucun problème.</p>
          </div>
        </div>
        <div class="step-item" style="display:grid;grid-template-columns:64px 1fr;gap:var(--space-4);margin-bottom:var(--space-6);">
          <div style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent-violet);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:24px;color:var(--accent-violet);">3</span></div>
          <div>
            <h2 style="font-size:24px;margin-bottom:var(--space-1);">Je construis — vous vivez votre vie</h2>
            <p style="opacity:0.7;line-height:1.8;">Vous me donnez les accès nécessaires. Je travaille. Je vous tiens informé à chaque étape clé — pas chaque heure. Votre temps est précieux. Vous intervenez uniquement pour les validations importantes.</p>
          </div>
        </div>
        <div class="step-item" style="display:grid;grid-template-columns:64px 1fr;gap:var(--space-4);margin-bottom:var(--space-6);">
          <div style="width:64px;height:64px;border-radius:50%;border:2px solid var(--accent-green);display:flex;align-items:center;justify-content:center;flex-shrink:0;"><span style="font-size:24px;color:var(--accent-green);">4</span></div>
          <div>
            <h2 style="font-size:24px;margin-bottom:var(--space-1);">Votre business tourne tout seul</h2>
            <p style="opacity:0.7;line-height:1.8;margin-bottom:var(--space-2);">On teste ensemble. Si quelque chose ne va pas — on corrige. Pas de livraison définitive tant que vous n'êtes pas satisfait.</p>
            <p style="opacity:0.7;line-height:1.8;">Une fois livré, votre système fonctionne sans vous. Je reste disponible pour la maintenance mensuelle si vous le souhaitez.</p>
          </div>
        </div>
        <div style="text-align:center;padding:var(--space-6);background:var(--bg-card);border-radius:var(--radius-card-lg);border:1px solid var(--border-card);">
          <h3 style="font-size:24px;margin-bottom:var(--space-2);">Prêt à commencer ?</h3>
          <p style="opacity:0.7;margin-bottom:var(--space-4);">30 minutes offertes. Zéro engagement. Vous repartez avec des idées concrètes.</p>
          <a href="/diagnostic/" class="btn btn-primary pinapp-breathe">Réserver mon diagnostic offert</a>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'diagnostic/index.html',
    title: 'Diagnostic offert — Pinapp Studio',
    desc: 'Réservez 30 minutes avec Pinapp : cartographie et 3 opportunités concrètes.',
    og: '/diagnostic/',
    body: `    <section class="section">
      <div class="container" style="max-width:700px;text-align:center;">
        <p class="label" style="margin-bottom:var(--space-2);">OFFERT · SANS ENGAGEMENT</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;margin-bottom:var(--space-3);">30 minutes pour transformer votre business.</h1>
        <p style="font-size:18px;opacity:0.7;margin-bottom:var(--space-6);">Pas de présentation. Pas de pitch. Une conversation.</p>
        <div class="grid grid-3" style="margin-bottom:var(--space-6);text-align:left;">
          <div>
            <h3 style="font-size:16px;color:var(--accent-teal);margin-bottom:var(--space-1);">Ce qu'on fait</h3>
            <p style="font-size:14px;opacity:0.7;">Je cartographie vos tâches répétitives et identifie vos opportunités digitales.</p>
          </div>
          <div>
            <h3 style="font-size:16px;color:var(--accent-teal);margin-bottom:var(--space-1);">Ce que vous gagnez</h3>
            <p style="font-size:14px;opacity:0.7;">3 opportunités concrètes identifiées. Actionnables immédiatement — avec ou sans Pinapp.</p>
          </div>
          <div>
            <h3 style="font-size:16px;color:var(--accent-teal);margin-bottom:var(--space-1);">Comment ça se passe</h3>
            <p style="font-size:14px;opacity:0.7;">Google Meet ou téléphone. Vous parlez, j'écoute. Simple.</p>
          </div>
        </div>
        <div style="background:var(--bg-card);border:1px solid var(--border-card);border-radius:var(--radius-card-lg);padding:var(--space-5);margin-bottom:var(--space-4);">
          <!-- Calendly : remplacer par le widget officiel -->
          <p style="opacity:0.5;font-size:14px;">Calendly : à configurer (widget inline + script Calendly).</p>
          <p style="opacity:0.7;font-size:14px;margin-top:var(--space-3);">En attendant, contact direct :</p>
          <a href="mailto:lauralie.daguzay@pinapp.fr?subject=Demande%20de%20diagnostic%20Pinapp" class="btn btn-primary" style="margin-top:var(--space-3);">Envoyer un email</a>
        </div>
        <div style="background:var(--bg-card);border-radius:var(--radius-card);padding:var(--space-3);border:1px solid rgba(57,224,117,0.2);">
          <p style="font-size:14px;opacity:0.7;"><strong style="color:var(--accent-green);">Garantie :</strong> Si ces 30 minutes ne vous apportent rien de concret, je vous offre un template de votre secteur.</p>
        </div>
        <p style="font-size:var(--text-legal);opacity:0.4;margin-top:var(--space-4);">Vos informations sont utilisées uniquement pour organiser ce rendez-vous. Aucun démarchage ultérieur sans votre accord. <a href="/legal/confidentialite.html" style="text-decoration:underline;">Politique de confidentialité</a></p>
      </div>
    </section>`,
  },
  {
    file: 'a-propos/index.html',
    title: 'À propos — Pinapp Studio',
    desc: 'Pinapp, Lauralie Daguzay : systèmes sur-mesure, IA et automatisation pour les PME.',
    og: '/a-propos/',
    body: `    <section class="section">
      <div class="container prose" style="max-width:700px;">
        <p class="label">À PROPOS</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;margin-bottom:var(--space-3);">Qui est Pinapp ?</h1>
        <p style="font-size:18px;line-height:1.8;margin-bottom:var(--space-4);">Pinapp, c'est Lauralie Daguzay — fondatrice, conceptrice et exécutante.</p>
        <p style="opacity:0.7;line-height:1.8;margin-bottom:var(--space-4);">J'ai construit Pinapp parce que je voyais des PME et des indépendants débordés par des tâches répétitives, avec des sites qui ne convertissaient pas, sans accès aux outils que les grandes entreprises utilisent.</p>
        <p style="opacity:0.7;line-height:1.8;margin-bottom:var(--space-4);">Ma réponse : des systèmes intelligents sur-mesure, accessibles sans avoir à comprendre la technique. Vous décrivez votre problème. Je construis la solution.</p>
        <p style="opacity:0.7;line-height:1.8;margin-bottom:var(--space-5);">La preuve que ça fonctionne : Auralis RH — un assistant IA anti-burnout conçu de A à Z, présenté au Concours Lépine 2026.</p>
        <h2 style="font-size:24px;margin-bottom:var(--space-3);">Ce en quoi Pinapp croit</h2>
        <ul style="opacity:0.7;line-height:2;">
          <li>La technologie doit servir l'humain — pas l'inverse.</li>
          <li>Un client informé est un client satisfait.</li>
          <li>Vous décidez. Toujours.</li>
          <li>La simplicité est le luxe ultime.</li>
          <li>Mieux vaut un système imparfait qui tourne qu'un système parfait qui n'existe pas.</li>
        </ul>
        <div style="margin-top:var(--space-6);text-align:center;">
          <a href="/diagnostic/" class="btn btn-primary pinapp-breathe">Travaillons ensemble</a>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'formation-gratuite/index.html',
    title: 'Guide offert — 5 automatisations pour votre PME — Pinapp Studio',
    desc: 'Téléchargez le guide offert Pinapp : 5 automatisations pour votre PME.',
    og: '/formation-gratuite/',
    body: `    <section class="section">
      <div class="container" style="max-width:600px;text-align:center;">
        <p class="label">OFFERT</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;">5 automatisations pour votre PME</h1>
        <p style="font-size:18px;opacity:0.7;margin-bottom:var(--space-3);">Téléchargez le guide. Appliquez dès aujourd'hui. Sans coder. Sans technicien.</p>
        <p style="font-size:14px;opacity:0.55;margin-bottom:var(--space-5);max-width:28rem;margin-left:auto;margin-right:auto;line-height:1.6;">Pour aller plus loin : parcours <strong>97€</strong> (vidéos + accès à vie) et <strong>497€</strong> (6 semaines live). <a href="/offres/formation/" style="color:var(--accent-teal);text-decoration:underline;">Voir les formations Pinapp</a></p>
        <div style="background:var(--bg-card);border-radius:var(--radius-card-lg);padding:var(--space-5);border:1px solid var(--border-card);">
          <label class="visually-hidden" for="leadEmail">Adresse email</label>
          <input type="email" placeholder="votre@email.fr" id="leadEmail" autocomplete="email" style="width:100%;margin-bottom:var(--space-3);">
          <button type="button" class="btn btn-primary" style="width:100%;" id="leadSubmit">Recevoir le guide</button>
          <!-- Connecter à Make / Tally pour envoi PDF -->
        </div>
        <p style="font-size:var(--text-legal);opacity:0.4;margin-top:var(--space-3);">Zéro spam. Désinscription en un clic.</p>
      </div>
    </section>`,
  },
  {
    file: 'offres/index.html',
    title: 'Offres — Pinapp Studio',
    desc: 'Sites premium, automatisation, système complet, Starter, formations.',
    og: '/offres/',
    body: `    <section class="section">
      <div class="container">
        <p class="label" style="margin-bottom:var(--space-2);">OFFRES</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;margin-bottom:var(--space-3);">Ce que Pinapp construit</h1>
        <p style="font-size:18px;opacity:0.7;margin-bottom:var(--space-6);max-width:36rem;">Des offres claires, des délais annoncés, vous décidez à chaque étape.</p>
        <div class="grid grid-2" style="gap:var(--space-4);">
          <a href="/offres/sites/" class="card" style="text-decoration:none;display:block;">
            <p class="label">SITE</p>
            <h2 style="font-size:1.5rem;margin:var(--space-2) 0;">Site web premium</h2>
            <p style="opacity:0.7;font-size:14px;">À partir de 900€</p>
          </a>
          <a href="/offres/automatisation/" class="card" style="text-decoration:none;display:block;">
            <p class="label">FLUX</p>
            <h2 style="font-size:1.5rem;margin:var(--space-2) 0;">Automatisation</h2>
            <p style="opacity:0.7;font-size:14px;">À partir de 800€</p>
          </a>
          <a href="/offres/systeme-complet/" class="card" style="text-decoration:none;display:block;">
            <p class="label">SYSTÈME</p>
            <h2 style="font-size:1.5rem;margin:var(--space-2) 0;">Système complet</h2>
            <p style="opacity:0.7;font-size:14px;">À partir de 1500€</p>
          </a>
          <a href="/offres/starter/" class="card" style="text-decoration:none;display:block;border-color:var(--accent-violet);">
            <p class="label">RAPIDE</p>
            <h2 style="font-size:1.5rem;margin:var(--space-2) 0;">Pinapp Starter</h2>
            <p style="opacity:0.7;font-size:14px;">297€ · 48h</p>
          </a>
        </div>
        <div style="margin-top:var(--space-6);text-align:center;">
          <a href="/offres/formation/" class="btn btn-secondary">Formations</a>
          <a href="/diagnostic/" class="btn btn-primary" style="margin-left:var(--space-2);">Diagnostic offert</a>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'offres/sites/index.html',
    title: 'Site web premium — Pinapp Studio',
    desc: 'Site web premium Pinapp : design mobile-first, SEO, formation.',
    og: '/offres/sites/',
    body: `    <section class="section">
      <div class="container prose" style="max-width:800px;">
        <p class="label">OFFRE SITE WEB</p>
        <h1>Un site qui travaille pour vous.</h1>
        <p class="lead">Pas un site vitrine. Un outil de conversion.</p>
        <h2>Ce qui est inclus</h2>
        <ul>
          <li>Design premium mobile-first</li>
          <li>Copy rédigé avec vous</li>
          <li>Formulaire de contact connecté</li>
          <li>Mode sombre et mode clair automatiques (réglages système)</li>
          <li>Optimisation SEO de base</li>
          <li>Déploiement sur votre hébergement</li>
          <li>Formation à la mise à jour (1h)</li>
          <li>1 mois de support inclus</li>
        </ul>
        <h2>Options</h2>
        <ul>
          <li>Chatbot FAQ automatisé (+300€)</li>
          <li>Formulaire devis automatisé (+200€)</li>
          <li>Maintenance mensuelle (150€/mois)</li>
        </ul>
        <div style="background:var(--bg-card);border-radius:var(--radius-card);padding:var(--space-4);border:1px solid var(--border-card);margin:var(--space-4) 0;">
          <p style="font-size:32px;font-weight:600;">À partir de 900€</p>
          <p style="opacity:0.6;font-size:14px;">TVA non applicable — art. 293B CGI · 50% à la commande · 50% à la livraison · Délai 5–7 jours</p>
        </div>
        <a href="/diagnostic/" class="btn btn-primary">Réserver mon diagnostic</a>
      </div>
    </section>`,
  },
  {
    file: 'offres/automatisation/index.html',
    title: 'Automatisation — Pinapp Studio',
    desc: 'Automatisation des tâches répétitives pour PME et indépendants.',
    og: '/offres/automatisation/',
    body: `    <section class="section">
      <div class="container prose" style="max-width:800px;">
        <p class="label">OFFRE AUTOMATISATION</p>
        <h1>Vos tâches répétitives. Automatisées.</h1>
        <p class="lead">Relances, confirmations, devis, rapports. Tout ce qui vous prend du temps sans vous apporter de valeur.</p>
        <h2>Exemples d'automatisations</h2>
        <ul>
          <li>Relance devis automatique (J+2, J+7)</li>
          <li>Confirmation RDV + rappel J-1</li>
          <li>Email de bienvenue client après signature</li>
          <li>Rapport mensuel automatique</li>
          <li>Notification lead entrant</li>
          <li>Synchronisation CRM automatique</li>
        </ul>
        <h2>Ce qui est inclus</h2>
        <ul>
          <li>Audit de vos process actuels</li>
          <li>Configuration des pipelines</li>
          <li>Tests complets</li>
          <li>Formation (1h)</li>
          <li>1 mois de support</li>
        </ul>
        <div style="background:var(--bg-card);border-radius:var(--radius-card);padding:var(--space-4);border:1px solid var(--border-card);margin:var(--space-4) 0;">
          <p style="font-size:32px;font-weight:600;">À partir de 800€</p>
          <p style="opacity:0.6;font-size:14px;">Délai 3–5 jours · 50% commande · 50% livraison</p>
        </div>
        <a href="/diagnostic/" class="btn btn-primary">Réserver mon diagnostic</a>
      </div>
    </section>`,
  },
  {
    file: 'offres/systeme-complet/index.html',
    title: 'Système complet — Pinapp Studio',
    desc: 'Site premium, automatisations et IA : système complet Pinapp.',
    og: '/offres/systeme-complet/',
    body: `    <section class="section">
      <div class="container prose" style="max-width:800px;">
        <p class="label">OFFRE SYSTÈME COMPLET</p>
        <h1>Site + Automatisation + IA.</h1>
        <p class="lead">Votre business tourne pendant que vous dormez.</p>
        <h2>Ce que comprend le système</h2>
        <ul>
          <li>Site web premium complet</li>
          <li>3 automatisations clés</li>
          <li>Chatbot IA formé sur votre contenu</li>
          <li>Dashboard de suivi basique</li>
          <li>Formation complète (2h)</li>
          <li>2 mois de support inclus</li>
        </ul>
        <div style="background:var(--bg-card);border-radius:var(--radius-card);padding:var(--space-4);border:1px solid var(--border-card);margin:var(--space-4) 0;">
          <p style="font-size:32px;font-weight:600;">À partir de 1500€</p>
          <p style="opacity:0.6;font-size:14px;">Délai 10–15 jours · 50% commande · 50% livraison</p>
        </div>
        <a href="/diagnostic/" class="btn btn-primary">Réserver mon diagnostic</a>
      </div>
    </section>`,
  },
  {
    file: 'offres/starter/index.html',
    title: 'Pinapp Starter 297€ — Pinapp Studio',
    desc: 'Site sectoriel premium livré en 48h sans diagnostic.',
    og: '/offres/starter/',
    body: `    <section class="section">
      <div class="container" style="max-width:700px;text-align:center;">
        <p class="label">RAPIDE · ACCESSIBLE</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;">Pinapp Starter</h1>
        <p style="font-size:48px;font-weight:600;color:var(--accent-violet);">297€</p>
        <p style="font-size:20px;opacity:0.7;margin-bottom:var(--space-5);">Un site sectoriel premium. Livré en 48h. Sans diagnostic.</p>
        <h2 style="font-size:1.25rem;margin-bottom:var(--space-2);">Ce qui est inclus</h2>
        <ul style="text-align:left;max-width:400px;margin:0 auto var(--space-5);opacity:0.85;line-height:1.8;">
          <li>Template sectoriel au choix (5 disponibles)</li>
          <li>Personnalisation : nom, couleurs, contact</li>
          <li>Formulaire de contact fonctionnel</li>
          <li>Mobile-first responsive</li>
          <li>Déploiement sur votre hébergement</li>
          <li>Livraison garantie 48h</li>
        </ul>
        <h2 style="font-size:1.25rem;margin-bottom:var(--space-2);">Secteurs disponibles</h2>
        <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:var(--space-5);">
          <span style="padding:6px 16px;border-radius:100px;border:1px solid var(--border-card);font-size:13px;">Artisan/BTP</span>
          <span style="padding:6px 16px;border-radius:100px;border:1px solid var(--border-card);font-size:13px;">Restaurant</span>
          <span style="padding:6px 16px;border-radius:100px;border:1px solid var(--border-card);font-size:13px;">Coach</span>
          <span style="padding:6px 16px;border-radius:100px;border:1px solid var(--border-card);font-size:13px;">Avocat</span>
          <span style="padding:6px 16px;border-radius:100px;border:1px solid var(--border-card);font-size:13px;">Esthéticienne</span>
        </div>
        <div style="background:var(--bg-card);border-radius:var(--radius-card-lg);padding:var(--space-5);border:1px solid var(--border-card);">
          <h3 style="margin-bottom:var(--space-3);">Commander maintenant</h3>
          <p style="opacity:0.6;font-size:14px;margin-bottom:var(--space-4);">Choisissez votre secteur et payez. Je vous contacte dans l'heure pour démarrer.</p>
          <!-- Paiement : lien Stripe Payment Link à configurer -->
          <a href="mailto:lauralie.daguzay@pinapp.fr?subject=Commande%20Pinapp%20Starter" class="btn btn-primary">Commander — 297€</a>
          <p style="font-size:var(--text-legal);opacity:0.4;margin-top:var(--space-3);">Paiement sécurisé · TVA non applicable art. 293B CGI · Satisfait ou révision offerte</p>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'offres/formation/index.html',
    title: 'Formations — Pinapp Studio',
    desc: 'Formations Pinapp : 97€ accès à vie (4h vidéo) · 497€ parcours 6 semaines live. Lead magnet guide offert.',
    og: '/offres/formation/',
    body: `    <section class="section">
      <div class="container" style="max-width:800px;">
        <p class="label">FORMATIONS</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;">Apprenez à automatiser votre business.</h1>
        <p style="font-size:20px;opacity:0.7;margin-bottom:var(--space-6);">Des formations concrètes. Un résultat mesurable à la fin.</p>
        <div class="card" style="margin-bottom:var(--space-4);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-3);">
            <div>
              <p class="label" style="margin-bottom:var(--space-1);">FORMATION COURTE</p>
              <h2 style="font-size:24px;margin-bottom:var(--space-2);">Automatiser sa PME en 1 journée</h2>
              <p style="opacity:0.7;font-size:14px;max-width:500px;line-height:1.65;">4h de vidéos asynchrones + exercices pratiques. À la fin : votre première automatisation est en place. Accès à vie.</p>
            </div>
            <div style="text-align:right;">
              <p style="font-size:32px;font-weight:600;color:var(--accent-violet);">97€</p>
              <p style="font-size:12px;opacity:0.5;">Accès à vie</p>
            </div>
          </div>
          <a href="mailto:lauralie.daguzay@pinapp.fr?subject=Formation%20Pinapp%2097%E2%82%AC" class="btn btn-primary pinapp-breathe" style="margin-top:var(--space-3);">Je m'inscris</a>
          <p style="font-size:var(--text-legal);opacity:0.45;margin-top:var(--space-2);">Prix HT · TVA non applicable art. 293B CGI · Paiement et accès confirmés par email</p>
        </div>
        <div class="card" style="border-color:var(--accent-violet);">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:var(--space-3);">
            <div>
              <p class="label" style="margin-bottom:var(--space-1);">FORMATION PREMIUM</p>
              <h2 style="font-size:24px;margin-bottom:var(--space-2);">Devenir autonome sur l'IA — 6 semaines</h2>
              <p style="opacity:0.7;font-size:14px;max-width:500px;line-height:1.65;">Programme complet : sites, automatisations, IA, contenu. Sessions live hebdomadaires + accompagnement. Prochaine session : dates communiquées sur inscription.</p>
            </div>
            <div style="text-align:right;">
              <p style="font-size:32px;font-weight:600;color:var(--accent-violet);">497€</p>
              <p style="font-size:12px;opacity:0.5;">6 semaines · live</p>
            </div>
          </div>
          <a href="mailto:lauralie.daguzay@pinapp.fr?subject=Formation%20premium%20Pinapp%20497%E2%82%AC" class="btn btn-primary pinapp-breathe" style="margin-top:var(--space-3);">Je m'inscris</a>
          <p style="font-size:var(--text-legal);opacity:0.45;margin-top:var(--space-2);">Prix HT · TVA non applicable art. 293B CGI · Places limitées</p>
        </div>
        <div style="text-align:center;margin-top:var(--space-6);padding:var(--space-5);background:var(--bg-card);border-radius:var(--radius-card);border:1px solid var(--border-card);">
          <h2 style="font-size:1.25rem;margin-bottom:var(--space-2);font-weight:600;">Pas encore prêt ? Commencez par là.</h2>
          <p style="opacity:0.7;margin-bottom:var(--space-4);max-width:28rem;margin-left:auto;margin-right:auto;font-size:14px;line-height:1.6;">Lead magnet : le guide offert — 5 automatisations concrètes pour votre PME (sans engagement).</p>
          <a href="/formation-gratuite/" class="btn btn-secondary">Télécharger le guide</a>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'pourquoi-pinapp/index.html',
    title: 'Pourquoi Pinapp — constat & besoin — Pinapp Studio',
    desc: 'Pourquoi les messages et les tâches s’accumulent : Pinapp prépare, vous validez.',
    og: '/pourquoi-pinapp/',
    body: `    <section class="section" data-chapter="probleme">
      <div class="container" style="max-width:37.5rem;text-align:center;">
        <p class="label" style="margin-bottom:var(--space-2);">CONSTAT</p>
        <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;margin-bottom:var(--space-5);">Vous ouvrez vos messages.<br>Vous repoussez.<br>Et ça s’accumule.</h1>
        <p style="font-size:clamp(1.125rem,2vw,1.35rem);line-height:1.8;opacity:0.85;margin-bottom:var(--space-5);">Ce n’est pas un problème d’organisation.<br>C’est que <strong style="color:var(--accent-teal);">tout repose sur vous.</strong></p>
        <p style="font-size:1rem;opacity:0.55;margin-bottom:var(--space-6);">Pinapp ne le fait pas à votre place.<br>Pinapp prépare. Vous décidez. C’est réglé.</p>
        <div style="display:flex;flex-wrap:wrap;gap:var(--space-3);justify-content:center;">
          <a href="/comment-ca-marche/" class="btn btn-secondary">Voir la méthode →</a>
          <a href="/confiance/" class="btn btn-secondary">Confiance &amp; cadre →</a>
          <a href="/diagnostic/" class="btn btn-primary">Diagnostic offert</a>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'confiance/index.html',
    title: 'Confiance — vous décidez toujours — Pinapp Studio',
    desc: 'Contrôle, validation et transparence : comment Pinapp travaille avec vous.',
    og: '/confiance/',
    body: `    <section class="section">
      <div class="container">
        <p class="label" style="text-align:center;margin-bottom:var(--space-2);">CADRE</p>
        <h1 style="font-size:var(--text-h1);text-align:center;letter-spacing:-0.02em;margin-bottom:var(--space-2);">Vous décidez. Toujours.</h1>
        <p style="text-align:center;opacity:0.6;margin-bottom:var(--space-6);max-width:32rem;margin-left:auto;margin-right:auto;">Pinapp pense avec vous. Pas à votre place. Chaque automatisation attend votre accord.</p>
        <div class="grid grid-3">
          <div class="card" style="text-align:center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto var(--space-2);" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
            <h2 style="font-size:18px;margin-bottom:var(--space-1);">Vous décidez</h2>
            <p style="font-size:14px;opacity:0.7;">Chaque action automatique attend votre accord. Un clic suffit. Toujours.</p>
          </div>
          <div class="card" style="text-align:center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto var(--space-2);" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <h2 style="font-size:18px;margin-bottom:var(--space-1);">Vous gardez le contrôle</h2>
            <p style="font-size:14px;opacity:0.7;">Aucun email ne part, aucun devis n’est envoyé sans votre validation explicite.</p>
          </div>
          <div class="card" style="text-align:center;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin:0 auto var(--space-2);" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <h2 style="font-size:18px;margin-bottom:var(--space-1);">Vous gagnez du temps</h2>
            <p style="font-size:14px;opacity:0.7;">Les tâches répétitives sont préparées pour vous. Vous approuvez en quelques secondes.</p>
          </div>
        </div>
      </div>
    </section>
    <section class="section" style="background:var(--bg-deep);">
      <div class="container">
        <p class="label" style="text-align:center;margin-bottom:var(--space-2);">ILS EN PARLENT MIEUX QUE NOUS</p>
        <h2 style="font-size:var(--text-h2);text-align:center;letter-spacing:-0.02em;margin-bottom:var(--space-6);">Ce qu’ils disent</h2>
        <div class="grid grid-3">
          <div class="card" style="opacity:0.4;border-style:dashed;">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--border-card);margin-bottom:var(--space-2);"></div>
            <p style="font-style:italic;font-size:14px;opacity:0.6;">Votre témoignage ici bientôt.</p>
          </div>
          <div class="card" style="opacity:0.4;border-style:dashed;">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--border-card);margin-bottom:var(--space-2);"></div>
            <p style="font-style:italic;font-size:14px;opacity:0.6;">Votre témoignage ici bientôt.</p>
          </div>
          <div class="card" style="opacity:0.4;border-style:dashed;">
            <div style="width:40px;height:40px;border-radius:50%;background:var(--border-card);margin-bottom:var(--space-2);"></div>
            <p style="font-style:italic;font-size:14px;opacity:0.6;">Votre témoignage ici bientôt.</p>
          </div>
        </div>
        <div style="text-align:center;margin-top:var(--space-6);">
          <a href="/realisations/" class="btn btn-secondary" style="margin-right:var(--space-2);">Voir les démos →</a>
          <a href="/votre-projet/" class="btn btn-primary">Décrire mon projet</a>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'realisations/index.html',
    title: 'Réalisations & démos — Pinapp Studio',
    desc: 'Exemples de sites sectoriels Pinapp : artisans, restauration, coachs, avocats, beauté.',
    og: '/realisations/',
    body: includeHtml('realisations-main.html'),
  },
  {
    file: 'votre-projet/index.html',
    title: 'Votre projet — questionnaire Pinapp Studio',
    desc: 'Quelques questions pour cadrer votre besoin : réponse sous 24h.',
    og: '/votre-projet/',
    body: includeHtml('votre-projet-main.html'),
  },
  {
    file: 'faq/index.html',
    title: 'FAQ — questions fréquentes — Pinapp Studio',
    desc: 'Délais, paiement, révisions, types de clients : réponses courtes sur Pinapp.',
    og: '/faq/',
    body: includeHtml('faq-main.html'),
  },
  {
    file: 'auralis/index.html',
    title: 'Auralis RH — produit Pinapp — Pinapp Studio',
    desc: 'Auralis RH : assistant IA anti-burnout, conçu par Pinapp — Concours Lépine 2026.',
    og: '/auralis/',
    body: `    <section class="section" style="background:var(--bg-deep);" data-chapter="auralis">
      <div class="container">
        <div class="auralis-split">
          <div>
            <p class="label" style="margin-bottom:var(--space-2);">PRODUIT PINAPP · EN DÉVELOPPEMENT</p>
            <h1 style="font-size:var(--text-h1);letter-spacing:-0.02em;margin-bottom:var(--space-3);">La preuve par l’exemple.</h1>
            <p style="opacity:0.7;margin-bottom:var(--space-2);">Auralis RH — conçu par Pinapp. Un assistant IA qui prévient le burnout avant qu’il n’arrive.</p>
            <p style="opacity:0.7;margin-bottom:var(--space-5);">Pinapp l’a pensé, conçu et structuré. Votre projet mérite le même niveau d’exigence.</p>
            <div style="display:flex;gap:var(--space-2);align-items:center;flex-wrap:wrap;">
              <span style="background:var(--accent-green);color:#050A14;font-size:11px;font-weight:600;padding:4px 12px;border-radius:100px;">Concours Lépine 2026</span>
              <a href="/diagnostic/?projet=auralis" style="font-size:14px;color:var(--accent-teal);">Parler de mon projet →</a>
            </div>
          </div>
          <div style="display:flex;justify-content:center;">
            <div style="width:240px;height:480px;background:#0A1628;border-radius:32px;border:2px solid rgba(62,235,214,0.22);box-shadow:0 0 40px rgba(62,235,214,0.1),0 0 80px rgba(62,235,214,0.05);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:var(--space-4);gap:var(--space-3);">
              <p style="font-size:14px;color:var(--accent-teal);letter-spacing:0.1em;">AURALIS RH</p>
              <svg width="100" height="100" viewBox="0 0 100 100" aria-hidden="true">
                <circle cx="50" cy="50" r="36" fill="none" stroke="rgba(62,235,214,0.18)" stroke-width="3"/>
                <circle cx="50" cy="50" r="36" fill="none" stroke="#3EEBD6" stroke-width="3" stroke-dasharray="226" stroke-dashoffset="68" stroke-linecap="round" transform="rotate(-90 50 50)"/>
                <text x="50" y="50" text-anchor="middle" dominant-baseline="central" font-family="Jost,sans-serif" font-size="20" font-weight="600" fill="#E4F7F3">82</text>
                <text x="50" y="65" text-anchor="middle" font-family="Jost,sans-serif" font-size="8" fill="rgba(228,247,243,0.5)">/100</text>
              </svg>
              <div style="width:100%;">
                <p style="font-size:10px;opacity:0.5;margin-bottom:6px;font-family:Jost,sans-serif;letter-spacing:0.1em;">BIEN-ÊTRE</p>
                <div style="height:3px;background:rgba(62,235,214,0.18);border-radius:100px;"><div class="auralis-bar" style="height:3px;width:68%;"></div></div>
              </div>
              <div style="background:rgba(62,235,214,0.06);border:1px solid rgba(62,235,214,0.12);border-radius:12px;padding:10px;width:100%;">
                <p style="font-size:11px;opacity:0.7;font-family:Jost,sans-serif;line-height:1.5;">Votre semaine semble chargée. Une pause de 10 min est disponible.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'dashboard/index.html',
    title: 'Dashboard — Pinapp',
    desc: 'Tableau de bord interne Pinapp.',
    og: '/dashboard/',
    body: `    <section class="section" style="padding-top:var(--space-8);">
      <div class="container" style="max-width:75rem;">
        <h1 style="font-size:32px;margin-bottom:var(--space-5);">Bonjour Lauralie</h1>
        <div class="grid grid-4" style="margin-bottom:var(--space-4);">
          <div class="card">
            <p class="label" style="margin-bottom:var(--space-1);">CA CE MOIS</p>
            <p style="font-size:32px;font-weight:600;">0€</p>
            <p style="font-size:12px;opacity:0.5;">Objectif : à définir</p>
            <div class="progress-bar" style="height:3px;margin-top:var(--space-2);width:0%;"></div>
          </div>
          <div class="card">
            <p class="label" style="margin-bottom:var(--space-1);">DIAGNOSTICS</p>
            <p style="font-size:32px;font-weight:600;">0</p>
            <p style="font-size:12px;opacity:0.5;">Cette semaine</p>
          </div>
          <div class="card">
            <p class="label" style="margin-bottom:var(--space-1);">MISSIONS ACTIVES</p>
            <p style="font-size:32px;font-weight:600;">0</p>
            <p style="font-size:12px;opacity:0.5;">En cours</p>
          </div>
          <div class="card">
            <p class="label" style="margin-bottom:var(--space-1);">CHARGE SEMAINE</p>
            <p style="font-size:32px;font-weight:600;">0h</p>
            <p style="font-size:12px;opacity:0.5;">/ 25h max</p>
            <div class="progress-bar" style="height:3px;margin-top:var(--space-2);width:0%;"></div>
          </div>
        </div>
        <div class="card" style="margin-bottom:var(--space-4);">
          <h2 style="font-size:18px;margin-bottom:var(--space-3);">En attente de toi</h2>
          <p style="opacity:0.5;font-size:14px;">Aucune action en attente. Les actions peuvent être branchées via Make après configuration.</p>
        </div>
        <div class="card">
          <h2 style="font-size:18px;margin-bottom:var(--space-3);">Sites en ligne</h2>
          <div style="display:flex;align-items:center;gap:var(--space-2);margin-bottom:var(--space-2);">
            <span class="live-dot"></span>
            <span style="font-size:14px;">pinapp.fr</span>
            <span style="font-size:12px;opacity:0.5;margin-left:auto;">Opérationnel</span>
          </div>
        </div>
      </div>
    </section>`,
  },
  {
    file: 'client/index.html',
    title: 'Votre espace — Pinapp',
    desc: 'Espace client Pinapp : suivi de mission et documents.',
    og: '/client/',
    body: `    <section class="section" style="padding-top:var(--space-8);">
      <div class="container" style="max-width:600px;">
        <p class="label" style="margin-bottom:var(--space-2);">VOTRE ESPACE PINAPP</p>
        <h1 style="font-size:32px;margin-bottom:var(--space-5);">Bienvenue</h1>
        <div class="card" style="margin-bottom:var(--space-3);">
          <p class="label" style="margin-bottom:var(--space-1);">VOTRE PROJET</p>
          <h2 style="font-size:18px;margin-bottom:var(--space-2);">Nom de la mission</h2>
          <p style="font-size:14px;opacity:0.6;margin-bottom:var(--space-2);">Statut : en cours</p>
          <div style="height:3px;background:var(--border-card);border-radius:100px;">
            <div class="progress-bar" style="width:60%;height:3px;"></div>
          </div>
          <p style="font-size:12px;opacity:0.4;margin-top:8px;">Livraison estimée : à confirmer</p>
        </div>
        <div class="card" style="margin-bottom:var(--space-3);">
          <p class="label" style="margin-bottom:var(--space-2);">VOS DOCUMENTS</p>
          <div style="display:flex;flex-direction:column;gap:var(--space-2);">
            <a href="#" style="font-size:14px;color:var(--accent-teal);">Devis signé</a>
            <a href="#" style="font-size:14px;color:var(--accent-teal);">Facture acompte</a>
            <a href="/legal/cgv.html" style="font-size:14px;color:var(--accent-teal);">CGV</a>
          </div>
        </div>
        <div class="card">
          <p class="label" style="margin-bottom:var(--space-2);">UNE QUESTION ?</p>
          <a href="mailto:lauralie.daguzay@pinapp.fr" class="btn btn-primary">Envoyer un message</a>
        </div>
      </div>
    </section>`,
  },
];

for (const p of pages) {
  const dir = path.join(root, path.dirname(p.file));
  fs.mkdirSync(dir, { recursive: true });
  const rootPrefix = pathToRootPrefix(p.file);
  const body = rewriteBodySiteLinks(p.body, rootPrefix);
  fs.writeFileSync(
    path.join(root, p.file),
    shell(p.title, p.desc, p.og, body, true, rootPrefix),
    'utf8'
  );
  console.log('Wrote', p.file);
}
