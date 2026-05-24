/**
 * Applique le bloc SEO (PINAPP_SEO_MANAGED), title, meta description,
 * JSON-LD (index racine), H1 sr-only (index racine), images (lazy/async/alt),
 * defer sur scripts externes.
 * Exclut : _site/, node_modules/, .git/, fichiers *backup*, *archived*, *legacy*, *tdah-backup*
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

const SKIP_DIR = new Set(['node_modules', '.git', '_site']);
const SKIP_FILE = (name) =>
  /backup|archived|legacy|tdah-backup/i.test(name) || name === 'og-image.html';

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIR.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (ent.isFile() && ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function toPosix(rel) {
  return rel.split(path.sep).join('/');
}

function canonicalFromRel(relPosix) {
  if (relPosix === 'index.html') return 'https://pinapp.fr/';
  if (relPosix.endsWith('/index.html')) {
    const dir = relPosix.slice(0, -'/index.html'.length);
    return `https://pinapp.fr/${dir}/`;
  }
  return `https://pinapp.fr/${relPosix}`;
}

/** Contenu d’attributs meta / OG / Twitter */
function escAttr(s) {
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

/** Contenu de <title> (texte, pas d’échappement des guillemets) */
function escTitle(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/** Titres & descriptions explicites (chemins posix depuis racine) */
const META = {
  'index.html': {
    title: 'Pinapp — Automatisation IA & sites premium · Bordeaux',
    desc: 'Sites premium, automatisation n8n et IA sur-mesure pour TPE/PME. Bordeaux, Nouvelle-Aquitaine. Diagnostic offert 30 min.',
  },
  'offres/index.html': {
    title: 'Offres & tarifs — Sites, automatisation, IA · Pinapp',
    desc: 'Sites dès 1 800€, automatisation dès 900€, IA sur mesure. Prix HT, satisfait ou remboursé 30 jours. Pinapp Inc.',
  },
  'a-propos/index.html': {
    title: 'Qui sommes-nous — Lauralie & Michaël · Pinapp Inc.',
    desc: 'Lauralie Daguzay & Michaël Bouilhac. Stratégie digitale, code, vidéo. Cofondateurs Pinapp Inc. Nouvelle-Aquitaine.',
  },
  'auralis/index.html': {
    title: 'Auralis RH — Bien-être des équipes · Pinapp',
    desc: "Auralis RH détecte le burnout avant qu'il n'arrive. Lancement été 2026. 99€/mois. Par Pinapp Inc.",
  },
  'diagnostic/index.html': {
    title: 'Diagnostic offert 30 min — Pinapp',
    desc: 'Décrivez votre besoin en 2 min. Réponse sous 24h avec diagnostic concret. Aucun engagement. Pinapp Inc.',
  },
  'demo/index.html': {
    title: 'Nos réalisations — Démos sites premium · Pinapp',
    desc: '11 démos de sites premium par secteur : restaurant, artisan, coach, beauté, juridique, e-commerce. Pinapp Studio.',
  },
  'demo/restaurant/index.html': {
    title: 'Maison Aurore — Restaurant gastronomique · Démo Pinapp',
    desc: 'Démo site restaurant haut de gamme : menu, réservation, ambiance. Pinapp Studio, Bordeaux.',
  },
  'demo/barbier/index.html': {
    title: 'The Blade Society — Barbershop premium · Démo Pinapp',
    desc: 'Démo barbershop premium : prise de rendez-vous, portfolio, identité forte. Pinapp Studio.',
  },
  'demo/artisan/index.html': {
    title: 'Renov & Co — Artisan BTP Bordeaux · Démo Pinapp',
    desc: 'Démo artisan BTP : chantiers, devis, zone d’intervention. Exemple Pinapp Studio.',
  },
  'demo/coach/index.html': {
    title: 'Clara Fontaine — Coach ICF · Démo Pinapp',
    desc: 'Démo coach certifiée : offres, témoignages, prise de contact. Pinapp Studio.',
  },
  'faq/index.html': {
    title: 'FAQ — Questions fréquentes · Pinapp',
    desc: 'Réponses sur délais, prix HT, process, IA et livrables. Pinapp Inc., Bordeaux.',
  },
  'formation-gratuite/index.html': {
    title: 'Formation gratuite — Pinapp',
    desc: 'Vidéos et ressources pour démarrer avec l’IA utile en entreprise. Pinapp Inc.',
  },
  'pourquoi-pinapp/index.html': {
    title: 'Pourquoi Pinapp — Notre différence',
    desc: 'Méthode, transparence, duo technique + image. Ce qui nous distingue. Pinapp Inc.',
  },
  'memoire-et-presence/index.html': {
    title: 'Mémoire & Présence — Hommages numériques · Pinapp',
    desc: 'Transmission et présence numérique, avec sens. Projet porté par Pinapp. Nouvelle-Aquitaine.',
  },
  'google-site-verification.html': {
    title: 'Google Search Console — Pinapp Inc.',
    desc: 'Fichier de vérification Google Search Console (placeholder). Remplacez par le code fourni par Google.',
  },
  'engagements/index.html': {
    title: 'Engagements — Éthique, écologie & inclusion · Pinapp',
    desc: 'Éthique, écologie, accessibilité et transparence : nos engagements concrets. Pinapp Inc., Bordeaux, Nouvelle-Aquitaine.',
  },
};

/** Titres démo dossiers (nom — Démo Pinapp Studio) */
const DEMO_FOLDER_TITLE = {
  avocat: 'Cabinet Avocat & Associés',
  boulangerie: 'Maison Camille — Boulangerie',
  cils: 'Atelier du Regard — Extensions de cils',
  coiffeur: 'Salon Lumière — Coiffure',
  estheticienne: 'Institut Éclat — Esthétique',
  ongles: 'Studio Vernis — Onglerie',
  'sur-mesure': 'L’Atelier Sur-Mesure',
  tatoueuse: 'Ink & Aura — Tatouage artistique',
  trainer: 'Peak Form — Coaching sportif',
};

function humanizeDemoSlug(slug) {
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function fallbackMeta(relPosix) {
  if (META[relPosix]) return META[relPosix];
  // legal
  const legalMatch = relPosix.match(/^legal\/(.+)\.html$/);
  if (legalMatch) {
    const f = legalMatch[1];
    const map = {
      'mentions-legales': 'Mentions légales',
      cgv: 'CGV',
      confidentialite: 'Confidentialité',
      accessibilite: 'Accessibilité',
      ecologie: 'Écologie',
      ethique: 'Éthique',
      mentions: 'Mentions',
    };
    const label = map[f] || humanizeDemoSlug(f.replace(/\.html$/, ''));
    return {
      title: `${label} — Pinapp Inc.`,
      desc: `${label} Pinapp Inc. : informations légales et contact contact@pinapp.fr.`,
    };
  }
  // demo flat *.html
  const flatDemo = relPosix.match(/^demo\/([^/]+)\.html$/);
  if (flatDemo) {
    const slug = flatDemo[1];
    const name = humanizeDemoSlug(slug);
    return {
      title: `${name} — Démo Pinapp Studio`,
      desc: `Démo site ${name.toLowerCase()} — aperçu interactif Pinapp Studio.`,
    };
  }
  // demo/*/index.html
  const demoIdx = relPosix.match(/^demo\/([^/]+)\/index\.html$/);
  if (demoIdx) {
    const slug = demoIdx[1];
    const name = DEMO_FOLDER_TITLE[slug] || humanizeDemoSlug(slug);
    return {
      title: `${name} — Démo Pinapp Studio`,
      desc: `Démo site ${name} — Pinapp Studio, vitrine premium par secteur.`,
    };
  }
  // blog
  const blog = relPosix.match(/^blog\/([^/]+)\/index\.html$/);
  if (blog) {
    const slug = blog[1];
    const name = humanizeDemoSlug(slug.replace(/-/g, ' '));
    return {
      title: `${name} — Blog Pinapp`,
      desc: `Article ${name} : veille et conseils pour TPE/PME. Pinapp Inc.`,
    };
  }
  if (relPosix === 'blog/index.html') {
    return {
      title: 'Blog — Automatisation, sites & IA · Pinapp',
      desc: 'Articles sur sites premium, n8n, IA utile et méthode Pinapp. Moins de bruit, plus d’impact.',
    };
  }
  if (relPosix === 'formations/index.html') {
    return {
      title: 'Formations — IA, site, automatisation · Pinapp',
      desc: 'Parcours courts : site autonome, IA collègue, automatisation, prompts. Pinapp Inc.',
    };
  }
  if (relPosix.startsWith('formations/')) {
    const slug = relPosix.replace(/^formations\//, '').replace(/\/index\.html$/, '') || 'hub';
    const name = humanizeDemoSlug(slug);
    return {
      title: `${name} — Formations Pinapp`,
      desc: `Formation ${name} : méthode courte, applicable demain. Pinapp Inc.`,
    };
  }
  // offres sous-pages
  if (relPosix.startsWith('offres/') && relPosix !== 'offres/index.html') {
    const slug = relPosix.replace(/^offres\//, '').replace(/\/index\.html$/, '');
    return {
      title: `${humanizeDemoSlug(slug)} — Offres Pinapp`,
      desc: `Détail offre ${humanizeDemoSlug(slug)} : périmètre, délais, tarifs HT. Pinapp Inc.`,
    };
  }
  // engagements
  if (relPosix.startsWith('engagements/')) {
    const file = path.basename(relPosix, '.html');
    const name = file === 'index' ? 'Engagements Pinapp' : humanizeDemoSlug(file);
    return {
      title: `${name} — Engagements Pinapp`,
      desc: `Engagement ${name} : transparence Pinapp Inc. Bordeaux, Nouvelle-Aquitaine.`,
    };
  }
  // auralis pages
  if (relPosix.startsWith('auralis/') && relPosix !== 'auralis/index.html') {
    const base = path.basename(relPosix, '.html');
    return {
      title: `${humanizeDemoSlug(base)} — Auralis RH · Pinapp`,
      desc: `Auralis RH : ${humanizeDemoSlug(base).toLowerCase()}. Produit Pinapp Inc.`,
    };
  }
  // root misc
  const base = path.basename(relPosix, '.html');
  return {
    title: `${humanizeDemoSlug(base)} — Pinapp`,
    desc: `Page ${humanizeDemoSlug(base)} — Pinapp Inc., agence digitale Bordeaux.`,
  };
}

// Internal/utility sections that must never be indexed (mirrors sitemap exclusions).
function noindexRel(relPosix) {
  return /^(admin|dashboard|client|interne|tools|emails|storyboard|docs|memoire-et-presence)\//.test(relPosix);
}

const SEO_BLOCK_TMPL = (canonical, title, desc, robots = 'index, follow') => `<!-- PINAPP_SEO_MANAGED -->
    <meta name="robots" content="${robots}" />
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin />
    <link rel="dns-prefetch" href="https://fonts.bunny.net" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="Pinapp Inc." />
    <meta property="og:title" content="${escAttr(title)}" />
    <meta property="og:description" content="${escAttr(desc)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="https://pinapp.fr/assets/images/og-pinapp-share.jpg" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(title)}" />
    <meta name="twitter:description" content="${escAttr(desc)}" />
    <meta name="twitter:image" content="https://pinapp.fr/assets/images/og-pinapp-share.jpg" />
    <!-- /PINAPP_SEO_MANAGED -->`;

const JSONLD = `{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Pinapp Inc.",
  "alternateName": "Pinapp Studio",
  "description": "Agence digitale : automatisation IA, sites web premium et vidéo professionnelle pour TPE/PME",
  "url": "https://pinapp.fr",
  "logo": "https://pinapp.fr/assets/images/pinapp-logo.png",
  "email": "contact@pinapp.fr",
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Nouvelle-Aquitaine",
    "addressCountry": "FR"
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": { "@type": "GeoCoordinates", "latitude": 44.8378, "longitude": -0.5792 },
    "geoRadius": "200000"
  },
  "founder": [
    { "@type": "Person", "name": "Lauralie Daguzay", "jobTitle": "Co-fondatrice" },
    { "@type": "Person", "name": "Michaël Bouilhac", "jobTitle": "Co-fondateur" }
  ],
  "sameAs": ["https://www.linkedin.com/in/lauralie-daguzay-4a4542197/"],
  "priceRange": "€€",
  "serviceType": [
    "Création de sites web",
    "Automatisation n8n",
    "Intelligence artificielle",
    "Production vidéo",
    "Formation digitale"
  ]
}`;

function replaceSeoBlock(html, block) {
  const re = /<!--\s*PINAPP_SEO_MANAGED\s*-->[\s\S]*?<!--\s*\/PINAPP_SEO_MANAGED\s*-->/;
  if (re.test(html)) return html.replace(re, block);
  // Insérer après charset
  const m = html.match(/<meta\s+charset=["']UTF-8["']\s*\/?>/i);
  if (m) return html.replace(m, (x) => `${x}\n    ${block}`);
  return html.replace(/<head[^>]*>/i, (h) => `${h}\n    ${block}`);
}

function replaceTitle(html, title) {
  return html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escTitle(title)}</title>`);
}

function replaceDesc(html, desc) {
  const e = escAttr(desc);
  if (/<meta\s+name=["']description["']/i.test(html)) {
    return html.replace(
      /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
      `<meta name="description" content="${e}" />`,
    );
  }
  return html.replace(/<\/title>/i, `</title>\n    <meta name="description" content="${e}" />`);
}

function replaceJsonLdRoot(html) {
  const re = /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i;
  if (!re.test(html)) return html;
  return html.replace(re, `<script type="application/ld+json">\n      ${JSONLD}\n    </script>`);
}

function ensureViewport(html) {
  return html.replace(
    /<meta\s+name=["']viewport["'][^>]*>/i,
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />',
  );
}

function insertH1Home(html) {
  const h1 =
    '<h1 class="sr-only">Pinapp Inc. — Agence automatisation IA, sites web premium et vidéo à Bordeaux, Nouvelle-Aquitaine</h1>';
  if (/class=["']sr-only["'][^>]*>\s*Pinapp Inc\. — Agence/.test(html)) return html;
  return html.replace(/<body([^>]*)>/i, `<body$1>\n    ${h1}`);
}

function fixScriptsDefer(html) {
  return html.replace(/<script([^>]*)>/gi, (m, inner) => {
    if (!/\bsrc\s*=/i.test(inner)) return m;
    if (/\bdefer\b/i.test(inner) || /\basync\b/i.test(inner)) return m;
    if (/type\s*=\s*["']module["']/i.test(inner)) return m;
    return `<script defer${inner}>`;
  });
}

function fixImages(html) {
  return html.replace(/<img\b([\s\S]*?)(\/)?\s*>/gi, (full, inner, slash) => {
    const selfClose = slash === '/';
    let attrs = inner || '';
    const blob = attrs.toLowerCase();
    const isHero =
      /class=["'][^"']*hero[^"']*"/i.test(attrs) ||
      /id=["'][^"']*hero[^"']*"/i.test(attrs) ||
      /\bdata-hero\b/i.test(attrs);
    const isLogo =
      /pinapp-logo|pinapp-icon\.png|\/favicon|logo\.svg/i.test(blob) ||
      /\balt=["'][^"']*pinapp[^"']*logo[^"']*["']/i.test(attrs);

    if (!/\bloading\s*=/i.test(attrs)) {
      attrs += isHero ? ' loading="eager"' : ' loading="lazy"';
    }
    if (!/\bdecoding\s*=/i.test(attrs)) attrs += ' decoding="async"';
    if (isHero && !/\bfetchpriority\s*=/i.test(attrs)) attrs += ' fetchpriority="high"';
    if (!/\balt\s*=/i.test(attrs)) {
      attrs += isLogo ? ' alt="Pinapp Inc. — Agence digitale Bordeaux"' : ' alt=""';
    } else if (isLogo && /alt=["']\s*["']|alt=["']["']/i.test(attrs)) {
      attrs = attrs.replace(
        /\balt=["'][^"']*["']/i,
        'alt="Pinapp Inc. — Agence digitale Bordeaux"',
      );
    }
    const close = selfClose ? ' />' : '>';
    return `<img${attrs}${close}`;
  });
}

const FOOTER_SNIPPET = `<a href="/">Accueil</a>
          <a href="/offres/">Offres</a>
          <a href="/realisations/">Réalisations</a>
          <a href="/auralis/">Auralis RH</a>
          <a href="/diagnostic/">Diagnostic</a>
          <a href="/faq/">FAQ</a>
          <a href="/mentions-legales/">Mentions légales</a>
          <a href="/cgv/">CGV</a>
          <a href="/confidentialite/">Confidentialité</a>`;

function ensureFooterLinks(html) {
  const navRe = /(<nav\s+class=["']footer__links["'][^>]*>)([\s\S]*?)(<\/nav>)/i;
  const m = html.match(navRe);
  if (!m) return html;
  const [, open, body, close] = m;
  const adds = [];
  if (!body.includes('href="/faq/"')) adds.push('<a href="/faq/">FAQ</a>');
  if (!body.includes('href="/mentions-legales/"'))
    adds.push('<a href="/mentions-legales/">Mentions légales</a>');
  if (!body.includes('href="/cgv/"')) adds.push('<a href="/cgv/">CGV</a>');
  if (!body.includes('href="/confidentialite/"'))
    adds.push('<a href="/confidentialite/">Confidentialité</a>');
  if (!adds.length) return html;
  const inject = adds.map((a) => `\n          ${a}`).join('');
  return html.replace(navRe, `${open}${body}${inject}\n        ${close}`);
}

function processFile(absPath) {
  const rel = path.relative(ROOT, absPath);
  const relPosix = toPosix(rel);
  if (SKIP_FILE(path.basename(absPath))) return false;

  let html = fs.readFileSync(absPath, 'utf8');
  const orig = html;
  const { title, desc } = fallbackMeta(relPosix);
  const canonical = canonicalFromRel(relPosix);

  const robots = noindexRel(relPosix) ? 'noindex, nofollow' : 'index, follow';
  html = replaceSeoBlock(html, SEO_BLOCK_TMPL(canonical, title, desc, robots));
  html = replaceTitle(html, title);
  html = replaceDesc(html, desc);
  html = ensureViewport(html);

  if (relPosix === 'index.html') {
    html = replaceJsonLdRoot(html);
    html = insertH1Home(html);
  }

  html = fixScriptsDefer(html);
  html = fixImages(html);
  html = ensureFooterLinks(html);

  if (html !== orig) {
    fs.writeFileSync(absPath, html, 'utf8');
    return true;
  }
  return false;
}

function sitemapLocFromRel(relPosix) {
  return canonicalFromRel(relPosix);
}

function sitemapPriority(relPosix) {
  if (relPosix === 'index.html') return '1.0';
  if (relPosix === 'offres/index.html' || relPosix === 'diagnostic/index.html') return '0.9';
  if (relPosix.startsWith('offres/') && relPosix !== 'offres/index.html') return '0.85';
  if (
    relPosix === 'a-propos/index.html' ||
    relPosix === 'auralis/index.html' ||
    relPosix === 'demo/index.html' ||
    relPosix === 'blog/index.html'
  )
    return '0.8';
  if (relPosix.startsWith('demo/') && relPosix !== 'demo/index.html') return '0.6';
  if (/^blog\/[^/]+\/index\.html$/.test(relPosix)) return '0.7';
  if (relPosix.startsWith('legal/')) return '0.4';
  if (relPosix === 'faq/index.html') return '0.4';
  if (relPosix === 'formations/index.html') return '0.72';
  if (relPosix.startsWith('formations/')) return '0.65';
  if (relPosix === 'google-site-verification.html') return '0.3';
  return '0.65';
}

function sitemapSkip(relPosix) {
  return (
    /^_site\//.test(relPosix) ||
    /backup|legacy|archived|tdah-backup|og-image\.html$/i.test(relPosix) ||
    /^(admin|dashboard|client|interne|tools|emails|storyboard|docs|assets)\//.test(relPosix) ||
    relPosix.startsWith('memoire-et-presence/') ||
    relPosix.startsWith('pinapp-site-vitrine/') ||
    relPosix.startsWith('_site/')
  );
}

function writeSitemap() {
  const LASTMOD = '2026-04-15';
  const urls = [];
  for (const f of walk(ROOT)) {
    const rel = toPosix(path.relative(ROOT, f));
    if (sitemapSkip(rel)) continue;
    if (!rel.endsWith('.html')) continue;
    urls.push({ loc: sitemapLocFromRel(rel), priority: sitemapPriority(rel) });
  }
  urls.sort((a, b) => a.loc.localeCompare(b.loc));
  const lines = urls.map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <priority>${u.priority}</priority>
  </url>`,
  );
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${lines.join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  console.error('Wrote sitemap.xml', urls.length, 'urls');
}

const files = walk(ROOT);
let n = 0;
for (const f of files) {
  if (processFile(f)) {
    n++;
    console.error('OK', path.relative(ROOT, f));
  }
}
console.error('Updated', n, 'files');
writeSitemap();
