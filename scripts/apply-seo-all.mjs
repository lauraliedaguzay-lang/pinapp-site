/**
 * SEO : méta dans <head> uniquement (évite <title> dans SVG/body).
 * Canonical, OG, Twitter, robots, preconnect Bunny, viewport, charset.
 * defer sur scripts externes (sauf theme.js, async, module).
 * lazy/async sur <img> hors fetchpriority=high.
 */
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();
const LASTMOD = '2026-04-15';
const OG_IMG = 'https://pinapp.fr/assets/images/og-pinapp-share.png';

const EXCLUDE_DIRS = new Set(['node_modules', '.git', '_site']);
const EXCLUDE_REL_PREFIX = ['tools/html-includes/', 'pinapp-site-vitrine/'];
const EXCLUDE_FILE_RE = /index\.(backup|tdah-backup)|\.backup\./i;

const NOINDEX_PREFIX = [
  'admin/',
  'dashboard/',
  'client/',
  'interne/',
  'tools/',
  'storyboard/',
  'docs/claude-consultation/',
  'google-site-verification.html',
];

const SITEMAP_EXCLUDE_PREFIX = [
  '_site',
  'node_modules',
  'admin/',
  'dashboard/',
  'client/',
  'interne/',
  'tools/',
  'storyboard/',
  'pinapp-site-vitrine/',
  'docs/claude-consultation/',
];

const META = {
  'index.html': {
    title: 'Pinapp — Automatisation IA & sites premium · Bordeaux',
    desc: 'Sites premium, automatisation n8n et IA sur-mesure pour TPE/PME. Bordeaux, Nouvelle-Aquitaine. Diagnostic offert 30 min.',
  },
  'offres/index.html': {
    title: 'Offres & tarifs — Sites, automatisation, IA · Pinapp',
    desc: "Sites dès 1 800€, automatisation dès 900€, IA sur mesure. Prix HT, satisfait ou remboursé 30 jours. Pinapp Inc.",
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
    desc: 'Démo vitrine restaurant gastronomique : menu, réservation, ambiance premium. Pinapp Studio.',
  },
  'demo/barbier/index.html': {
    title: 'The Blade Society — Barbershop premium · Démo Pinapp',
    desc: 'Démo site barbershop premium : prise de rendez-vous, services, identité forte. Pinapp Studio.',
  },
  'demo/artisan/index.html': {
    title: 'Renov & Co — Artisan BTP Bordeaux · Démo Pinapp',
    desc: 'Démo site artisan BTP : chantiers, devis, zone Bordeaux. Pinapp Studio.',
  },
  'demo/coach/index.html': {
    title: 'Clara Fontaine — Coach ICF · Démo Pinapp',
    desc: 'Démo site coach certifié ICF : offres, prise de contact, crédibilité. Pinapp Studio.',
  },
  'faq/index.html': {
    title: 'FAQ — Questions fréquentes · Pinapp',
    desc: 'Délais, paiement, révisions, types de clients : réponses courtes sur Pinapp.',
  },
  'formation-gratuite/index.html': {
    title: 'Formation gratuite — Pinapp',
    desc: 'Guide gratuit IA & automatisation : premiers pas concrets pour TPE/PME. Pinapp Inc.',
  },
  'pourquoi-pinapp/index.html': {
    title: 'Pourquoi Pinapp — Notre différence',
    desc: 'Méthode, exigence qualité, canal unique par écrit, équipe Lauralie & Micha. Pourquoi choisir Pinapp.',
  },
  'memoire-et-presence/index.html': {
    title: 'Mémoire & Présence — Hommages numériques · Pinapp',
    desc: 'Transmission et hommages numériques, présence durable. Projet Pinapp — vocabulaire soigné.',
  },
  'demo/avocat/index.html': {
    title: 'Cabinet Rousseau — Avocat · Démo Pinapp Studio',
    desc: 'Démo site juridique : cabinet, expertises, prise de contact sécurisée. Pinapp Studio.',
  },
  'demo/estheticienne/index.html': {
    title: 'Institut Éclat — Esthéticienne · Démo Pinapp Studio',
    desc: 'Démo institut de beauté : soins, réservation, ambiance premium. Pinapp Studio.',
  },
  'demo/cils/index.html': {
    title: 'Lash Atelier — Extensions de cils · Démo Pinapp Studio',
    desc: 'Démo spécialiste cils : galerie, rendez-vous, offres. Pinapp Studio.',
  },
  'demo/ongles/index.html': {
    title: 'Nail Studio — Prothésiste ongulaire · Démo Pinapp Studio',
    desc: 'Démo salon ongulaire : créations, réservation, identité soignée. Pinapp Studio.',
  },
  'demo/coiffeur/index.html': {
    title: 'Salon Lumière — Coiffeur · Démo Pinapp Studio',
    desc: 'Démo salon de coiffure : services, équipe, réservation en ligne. Pinapp Studio.',
  },
  'demo/boulangerie/index.html': {
    title: 'Boulangerie Martin — Artisan boulanger · Démo Pinapp Studio',
    desc: 'Démo boulangerie : produits, horaires, commandes. Pinapp Studio.',
  },
  'demo/trainer/index.html': {
    title: 'Coach sportif — Performance · Démo Pinapp Studio',
    desc: 'Démo coach sportif : programmes, séances, contact. Pinapp Studio.',
  },
  'demo/tatoueuse/index.html': {
    title: 'Studio encre — Tatoueuse · Démo Pinapp Studio',
    desc: 'Démo studio tatouage : portfolio, prise de rendez-vous, hygiène. Pinapp Studio.',
  },
  'demo/sur-mesure/index.html': {
    title: 'Sur-mesure — Démo Pinapp Studio',
    desc: 'Démo page sur-mesure : sections modulables, CTA, image de marque. Pinapp Studio.',
  },
  'legal/mentions-legales.html': {
    title: 'Mentions légales — Pinapp Inc.',
    desc: 'Mentions légales Pinapp Inc. : éditeur, hébergeur, propriété intellectuelle, contact.',
  },
  'legal/mentions.html': {
    title: 'Mentions — Pinapp Inc.',
    desc: 'Informations légales complémentaires Pinapp Inc.',
  },
  'legal/cgv.html': {
    title: 'CGV — Pinapp Inc.',
    desc: 'Conditions générales de vente Pinapp Inc. : prestations, paiement, livraison.',
  },
  'legal/confidentialite.html': {
    title: 'Confidentialité — Pinapp Inc.',
    desc: 'Politique de confidentialité et données personnelles — Pinapp Inc.',
  },
  'legal/ethique.html': {
    title: 'Charte éthique — Pinapp Inc.',
    desc: 'Engagements éthiques Pinapp : transparence, accessibilité, responsabilité.',
  },
  'legal/accessibilite.html': {
    title: 'Accessibilité — Pinapp Inc.',
    desc: 'Déclaration et objectifs accessibilité numérique — Pinapp Inc.',
  },
  'legal/ecologie.html': {
    title: 'Écologie — Pinapp Inc.',
    desc: 'Démarche éco-responsable et sobriété numérique — Pinapp Inc.',
  },
};

function walkHtmlFiles(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, '/');
    if (ent.isDirectory()) {
      if (EXCLUDE_DIRS.has(ent.name)) continue;
      walkHtmlFiles(full, acc);
    } else if (ent.name.endsWith('.html')) {
      if (EXCLUDE_FILE_RE.test(rel)) continue;
      if (EXCLUDE_REL_PREFIX.some((p) => rel.startsWith(p))) continue;
      acc.push(rel);
    }
  }
  return acc;
}

function canonicalUrl(rel) {
  if (rel.endsWith('index.html')) {
    const d = path.posix.dirname(rel);
    if (d === '.') return 'https://pinapp.fr/';
    return `https://pinapp.fr/${d}/`;
  }
  return `https://pinapp.fr/${rel}`;
}

function isNoindex(rel) {
  return NOINDEX_PREFIX.some((p) => rel.startsWith(p));
}

function autoTitle(rel) {
  const base = rel.replace(/\.html$/, '').split('/').filter(Boolean);
  const last = base[base.length - 1] || 'Pinapp';
  const pretty = last.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  let t = `${pretty} — Pinapp`;
  if (rel.startsWith('demo/')) t = `${pretty} — Démo Pinapp Studio`;
  if (t.length > 60) t = t.slice(0, 57) + '…';
  return t;
}

function prettySegment(rel) {
  const m = rel.match(/demo\/([^/]+)\.html$/);
  return m ? m[1].replace(/-/g, ' ') : 'Pinapp';
}

function autoDesc(rel, title) {
  if (rel.startsWith('engagements/')) {
    return 'Engagement Pinapp Inc. : transparence, accessibilité et qualité de service pour vos projets digitaux.';
  }
  if (rel === '404.html') return "Page introuvable sur pinapp.fr. Retour à l'accueil ou diagnostic offert.";
  if (rel === 'offline.html') return 'Vous êtes hors ligne. Reconnectez-vous pour parcourir Pinapp.';
  if (rel === 'merci/index.html') return 'Merci : votre message a bien été reçu. Réponse sous 24 h — Pinapp Inc.';
  if (rel === 'histoire.html') return 'Lauralie & Micha : genèse de Pinapp, méthode et valeurs — Pinapp Inc.';
  if (rel === 'realisations/index.html') return 'Réalisations web, automatisation et image : études de cas Pinapp Studio.';
  if (rel === 'comment-ca-marche/index.html') return 'Comment nous travaillons : étapes, délais, livrables — Pinapp Studio.';
  if (rel === 'confiance/index.html') return 'Confiance & garanties : méthode, références, cadre commercial — Pinapp.';
  if (rel === 'expertise-ia/index.html') return 'Expertise IA & systèmes : cas d usage, sécurité, mise en production — Pinapp.';
  if (rel === 'votre-projet/index.html') return 'Décrivez votre projet : objectifs, budget, délais — premier échange Pinapp.';
  if (rel === 'univers/index.html') return "Univers créatif Pinapp : culture produit, image et innovation — Pinapp Inc.";
  if (rel === 'formations/index.html') return 'Formations Pinapp : IA, automatisation et efficacité au quotidien.';
  if (rel.startsWith('offres/')) {
    return 'Offre Pinapp Studio : détail, livrables et tarifs HT — Pinapp Inc.';
  }
  if (rel.startsWith('demo/') && rel.endsWith('.html') && !rel.endsWith('/index.html')) {
    return `Démo secteur ${prettySegment(rel)} — Pinapp Studio.`;
  }
  const short = title.replace(/ — Pinapp.*$/, '');
  let d = `${short} : informations et contact — Pinapp Inc.`;
  if (d.length > 155) d = d.slice(0, 152) + '…';
  return d;
}

function getMeta(rel) {
  if (META[rel]) return META[rel];
  const title = autoTitle(rel);
  let desc = autoDesc(rel, title);
  if (desc.length > 155) desc = desc.slice(0, 152) + '…';
  return { title, desc };
}

function buildSeoBlock(canonical, title, desc, robots) {
  const esc = (s) =>
    s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  return `<!-- PINAPP_SEO_MANAGED -->
    <meta name="robots" content="${robots}" />
    <link rel="preconnect" href="https://fonts.bunny.net" crossorigin />
    <link rel="dns-prefetch" href="https://fonts.bunny.net" />
    <link rel="canonical" href="${canonical}" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="fr_FR" />
    <meta property="og:site_name" content="Pinapp Inc." />
    <meta property="og:title" content="${esc(title)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${canonical}" />
    <meta property="og:image" content="${OG_IMG}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(title)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${OG_IMG}" />
    <!-- /PINAPP_SEO_MANAGED -->`;
}

function stripBunnyFromHead(inner) {
  return inner
    .replace(/<link\s+rel=["']preconnect["'][^>]*fonts\.bunny\.net[^>]*>\s*/gi, '')
    .replace(/<link\s+rel=["']dns-prefetch["'][^>]*fonts\.bunny\.net[^>]*>\s*/gi, '');
}

/** Supprime anciennes balises SEO sociales (lignes courtes + blocs multilignes fréquents). */
function stripSocialFromHead(inner) {
  let h = inner.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
  h = h.replace(/<meta\s+name=["']robots["'][^>]*\/?>\s*/gi, '');
  h = h.replace(/<meta\s+[\r\n\t ]+property="og:description"[\s\S]*?\/>/gi, '');
  h = h.replace(/<meta\s+[\r\n\t ]+property="og:title"[\s\S]*?\/>/gi, '');
  h = h.replace(/<meta\s+[\r\n\t ]+property="og:image"[\s\S]*?\/>/gi, '');
  h = h.replace(/<meta\s+property="og:[^"]+"\s+content="[^"]*"\s*\/>/gi, '');
  h = h.replace(/<meta\s+property="og:[^"]+"\s+content='[^']*'\s*\/>/gi, '');
  h = h.replace(/<meta\s+property="og:[^>]+>/gi, '');
  h = h.replace(/<meta\s+name="twitter:[^>]+>/gi, '');
  return h;
}

function removeManagedBlock(s) {
  return s.replace(/<!-- PINAPP_SEO_MANAGED -->[\s\S]*?<!-- \/PINAPP_SEO_MANAGED -->\s*/g, '');
}

function ensureCharsetInner(inner) {
  if (/<meta\s+charset=/i.test(inner)) {
    return inner.replace(/<meta\s+charset="UTF-8"[^>]*>/i, '<meta charset="UTF-8" />');
  }
  return `<meta charset="UTF-8" />\n${inner}`;
}

function ensureViewportInner(inner) {
  const v =
    '<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />';
  if (/<meta\s+name="viewport"/i.test(inner)) {
    return inner.replace(/<meta\s+name="viewport"[^>]*>/i, v);
  }
  return inner.replace(/(<meta\s+charset="UTF-8"\s*\/>)/i, `$1\n    ${v}`);
}

function setTitleInner(inner, title) {
  const esc = title.replace(/</g, '');
  if (/<title>/i.test(inner)) {
    return inner.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc}</title>`);
  }
  return `${inner}\n    <title>${esc}</title>`;
}

function setDescInner(inner, desc) {
  const esc = desc.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const tag = `<meta name="description" content="${esc}" />`;
  if (/<meta\s+name="description"/i.test(inner)) {
    return inner.replace(/<meta\s+name="description"[\s\S]*?\/>/i, tag);
  }
  return inner.replace(/<\/title>/i, `</title>\n    ${tag}`);
}

function insertManagedAfterCharset(inner, block) {
  let h = removeManagedBlock(inner);
  const b = block.trimEnd();
  if (/<meta\s+charset="UTF-8"\s*\/>/i.test(h)) {
    return h.replace(/(<meta\s+charset="UTF-8"\s*\/>)/i, `$1\n    ${b}`);
  }
  return `${b}\n${h}`;
}

function transformHead(html, fn) {
  return html.replace(/<head([^>]*)>([\s\S]*?)<\/head>/i, (_, a, inner) => `<head${a}>${fn(inner)}</head>`);
}

function addDeferToExternalScripts(html) {
  return html.replace(/<script(\s+[^>]*\bsrc=["'][^"']+["'][^>]*?)>/gi, (full, inner) => {
    if (/\bdefer\b/i.test(inner) || /\basync\b/i.test(inner)) return full;
    if (/\btype\s*=\s*["']module["']/i.test(inner)) return full;
    if (/theme\.js/i.test(inner)) return full;
    return `<script${inner} defer>`;
  });
}

function enhanceImages(html) {
  return html.replace(/<img\b([^>]*)>/gi, (match, attrs) => {
    let a = attrs;
    const isLogo = /nav__logo-img|class="[^"]*logo|pinapp-logo/i.test(a);
    const hasAlt = /\balt\s*=\s*["']/i.test(a);
    const altEmpty = /\balt\s*=\s*["']["']/i.test(a);
    if (!hasAlt || altEmpty) {
      if (isLogo) {
        a = a.replace(/\balt\s*=\s*["'][^"']*["']/i, '');
        a = ` alt="Pinapp Inc. — Agence digitale Bordeaux"${a}`;
      } else if (/aria-hidden|decorative|role="presentation"/i.test(a) || altEmpty) {
        if (!/\balt\s*=/.test(a)) a += ' alt=""';
      }
    }
    if (!/\bfetchpriority\s*=\s*["']high["']/i.test(a)) {
      if (!/\bloading\s*=/.test(a)) a += ' loading="lazy"';
      if (!/\bdecoding\s*=/.test(a)) a += ' decoding="async"';
    } else if (!/\bdecoding\s*=/.test(a)) {
      a += ' decoding="async"';
    }
    return `<img${a}>`;
  });
}

function processHtml(rel) {
  const abs = path.join(ROOT, rel);
  let html = fs.readFileSync(abs, 'utf8');
  const canonical = canonicalUrl(rel);
  const { title, desc } = getMeta(rel);
  const robots = isNoindex(rel) ? 'noindex, nofollow' : 'index, follow';
  const block = buildSeoBlock(canonical, title, desc, robots);

  html = transformHead(html, (inner) => {
    let h = inner;
    h = ensureCharsetInner(h);
    h = ensureViewportInner(h);
    h = stripBunnyFromHead(h);
    h = stripSocialFromHead(h);
    h = setTitleInner(h, title);
    h = setDescInner(h, desc);
    h = insertManagedAfterCharset(h, block);
    return h;
  });

  html = addDeferToExternalScripts(html);
  html = enhanceImages(html);
  fs.writeFileSync(abs, html, 'utf8');
  return { rel, canonical, title };
}

function sitemapPriority(rel) {
  if (rel === 'index.html') return '1.0';
  if (rel === 'offres/index.html' || rel === 'diagnostic/index.html') return '0.9';
  if (rel === 'a-propos/index.html' || rel === 'auralis/index.html' || rel === 'demo/index.html')
    return '0.8';
  if (rel.startsWith('demo/') && rel.endsWith('index.html')) return '0.6';
  if (rel.startsWith('legal/') || rel === 'faq/index.html') return '0.4';
  if (rel.startsWith('offres/')) return '0.85';
  return '0.65';
}

function shouldIncludeSitemap(rel) {
  if (SITEMAP_EXCLUDE_PREFIX.some((p) => rel.startsWith(p))) return false;
  if (EXCLUDE_FILE_RE.test(rel)) return false;
  if (rel.startsWith('tools/html-includes/')) return false;
  if (/og-image\.html$/i.test(rel)) return false;
  if (rel === 'google-site-verification.html') return false;
  return true;
}

function buildSitemap(entries) {
  const urls = entries
    .filter((e) => shouldIncludeSitemap(e.rel))
    .map((e) => ({ loc: e.canonical, priority: sitemapPriority(e.rel) }))
    .sort((a, b) => a.loc.localeCompare(b.loc));
  const seen = new Set();
  const uniq = [];
  for (const u of urls) {
    if (seen.has(u.loc)) continue;
    seen.add(u.loc);
    uniq.push(u);
  }
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  for (const u of uniq) {
    xml += `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${LASTMOD}</lastmod>
    <priority>${u.priority}</priority>
  </url>
`;
  }
  xml += `</urlset>
`;
  return xml;
}

const files = walkHtmlFiles(ROOT, []);
const results = [];
for (const rel of files.sort()) {
  try {
    results.push(processHtml(rel));
  } catch (e) {
    console.error(rel, e);
    process.exitCode = 1;
  }
}

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), buildSitemap(results), 'utf8');
console.log('SEO appliqué sur', results.length, 'fichiers HTML + sitemap.xml');
