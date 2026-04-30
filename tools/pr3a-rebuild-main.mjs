/**
 * PR3a — rebuild <main> inner HTML (reorder + removals + placeholders).
 * Run: node tools/pr3a-rebuild-main.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'voyage-v9', 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

const MAIN_OPEN = '<main id="main">';
const i0 = html.indexOf(MAIN_OPEN);
const i1 = html.indexOf('</main>', i0);
if (i0 < 0 || i1 < 0) throw new Error('main not found');
const pre = html.slice(0, i0 + MAIN_OPEN.length);
const post = html.slice(i1);
let inner = html.slice(i0 + MAIN_OPEN.length, i1);
if (inner.includes('id="presentation-video"')) {
  console.error('Refuse: main already rebuilt (presentation-video present).');
  process.exit(1);
}

function extractSection(id) {
  const esc = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`\\n\\s*<section id="${esc}"[\\s\\S]*?\\n\\s*</section>`, 'm');
  const m = inner.match(re);
  if (!m) throw new Error('Missing section: ' + id);
  inner = inner.replace(re, '\n');
  return m[0];
}

const ids = [
  'hero',
  'domaines',
  'orientation',
  'diagnostic',
  'pourquoi-moins-cher',
  'duo',
  'engagements',
  'auto',
  'auto-faq',
  'pack',
  'realisations',
  'cinema-artistes',
  'captation-na',
  'laboratoire',
  's09b',
  'methode',
  'methode-formations',
  'methode-tarifs',
  'contact',
];
const S = {};
for (const id of ids) {
  S[id] = extractSection(id);
}

// Remove marquee (gold) between pack and realisations — leftover in inner
inner = inner.replace(/\n\s*<div class="marquee marquee--gold"[\s\S]*?<\/div>\s*\n\s*<\/div>\s*/m, '\n');

inner = inner.trim();
if (inner.replace(/<!--CUT[\s\S]*?-->/g, '').trim()) {
  console.warn('WARN: leftover in main after extraction:', inner.slice(0, 200));
}

const presentationVideo = `
  <section id="presentation-video" class="scene scene--presentation-video" data-stage="hero-1" aria-labelledby="presentation-video-h2">
    <div class="scene__inner">
      <p class="eyebrow" data-reveal>CE QU'ON FAIT EN 60 SECONDES</p>
      <h2 id="presentation-video-h2" class="display display--h2" data-reveal>Vidéo de présentation Pinapp.</h2>
      <div class="presentation-video-frame" data-reveal>
        <button type="button" class="presentation-video-play" aria-label="Lecture · vidéo en tournage" disabled>
          <span class="presentation-video-play__tri" aria-hidden="true"></span>
        </button>
      </div>
      <p class="presentation-video-status" data-reveal>Vidéo en tournage · Disponible bientôt</p>
    </div>
  </section>`;

const temoignages = `
  <!-- TEMOIGNAGES MASQUÉS - retirer style="display:none" quand 3 avis sont recueillis avec consentement client -->
  <section id="temoignages" class="scene scene--temoignages" style="display:none" data-stage="hero-2" aria-labelledby="temoignages-h2">
    <div class="scene__inner">
      <p class="eyebrow">ILS EN PARLENT</p>
      <h2 id="temoignages-h2" class="display display--h2">Ce qu'ils disent.</h2>
      <div class="temoignages-grid">
        <article class="card--glass temoignage-card">
          <div class="temoignage-logo" aria-hidden="true">◇</div>
          <p class="temoignage-stars" aria-label="5 sur 5">★★★★★</p>
          <p class="temoignage-text">« Texte témoignage placeholder 1 »</p>
          <p class="temoignage-author">Prénom · Société</p>
        </article>
        <article class="card--glass temoignage-card">
          <div class="temoignage-logo" aria-hidden="true">◇</div>
          <p class="temoignage-stars" aria-label="5 sur 5">★★★★★</p>
          <p class="temoignage-text">« Texte témoignage placeholder 2 »</p>
          <p class="temoignage-author">Prénom · Société</p>
        </article>
        <article class="card--glass temoignage-card">
          <div class="temoignage-logo" aria-hidden="true">◇</div>
          <p class="temoignage-stars" aria-label="5 sur 5">★★★★★</p>
          <p class="temoignage-text">« Texte témoignage placeholder 3 »</p>
          <p class="temoignage-author">Prénom · Société</p>
        </article>
      </div>
    </div>
  </section>`;

let cinema = S['cinema-artistes'].replace(
  '<section id="cinema-artistes"',
  `<!-- MIGRATION VERS /studio-micha/ EN PR3b - section masquée temporairement, à supprimer après création sous-page -->\n  <section id="cinema-artistes" style="display:none"`,
);
let captation = S['captation-na'].replace(
  '<section id="captation-na"',
  `<!-- MIGRATION VERS /studio-micha/ EN PR3b - section masquée temporairement, à supprimer après création sous-page -->\n  <section id="captation-na" style="display:none"`,
);

// PR3a markers — replaced by search in index or second script
const OFFRES_MARKER = '<!-- PR3A_OFFRES_BODY -->';
const METHODE_MARKER = '<!-- PR3A_METHODE_BODY -->';
const DIAG_MARKER = '<!-- PR3A_DIAGNOSTIC_BODY -->';
const CONTACT_MARKER = '<!-- PR3A_CONTACT_BODY -->';

const newInner =
  '\n' +
  [
    S.hero,
    presentationVideo,
    S.duo,
    S.engagements,
    S.domaines,
    S.realisations,
    S['pourquoi-moins-cher'],
    temoignages,
    S.laboratoire,
    cinema,
    captation,
    OFFRES_MARKER,
    METHODE_MARKER,
    DIAG_MARKER,
    CONTACT_MARKER,
  ].join('\n\n') +
  '\n';

fs.writeFileSync(htmlPath, pre + newInner + post, 'utf8');
console.log('OK: main rebuilt. Markers: OFFRES, METHODE, DIAGNOSTIC, CONTACT');
