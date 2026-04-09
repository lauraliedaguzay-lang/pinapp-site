import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const TEMPLATE_PATH = path.join(root, 'demo', 'artisan', 'index.html');
const tpl = fs.readFileSync(TEMPLATE_PATH, 'utf8');

/**
 * Mapping minimal: demo slug -> configuration
 * Keep it compact: 1 hero image + sector label + copy + interactive widget type.
 */
const DEMOS = {
  avocat: {
    title: 'Cabinet Renaud — Avocat Paris — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/avocat/',
    hero: '../../assets/images/demo-pack/avocat/hero-mobile.webp',
    chips: ['AVOCAT', 'PARIS'],
    h1: 'Un cabinet, lisible.\nUne prise de contact, claire.',
    lead:
      'Exemple de site pensé pour un cabinet : crédibilité, explication simple, et premier message structuré.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Demander une synthèse par écrit',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Droit du travail', d: 'Accompagnement employeur et salarié. Cadrage clair.', k: 'Réponse sous 24h' },
      { t: 'Contrats', d: 'Relecture et rédaction. Vous gardez le dernier mot.', k: 'Devis écrit' },
      { t: 'Contentieux', d: 'Préparation du dossier. Étapes simples à valider.', k: 'Suivi' },
    ],
    widget: { kind: 'estimation', label: 'Estimation indicative', suffix: '€', base: 120, mults: [120, 180, 240] },
    formTitle: 'Prendre contact',
    formHint: 'Démo : ce formulaire ne transmet rien. En situation réelle, il envoie une demande structurée.',
    accent: 'rgba(0,229,204,0.92)',
  },
  barbier: {
    title: 'Atelier Barber — Barbier — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/barbier/',
    hero: '../../assets/images/demo-pack/barbier/hero-mobile.webp',
    chips: ['BARBIER', 'CENTRE‑VILLE'],
    h1: 'Un planning, fluide.\nUne image, premium.',
    lead: 'Exemple de site barbier : prestations, prix, et réservation claire.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Réserver un créneau',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Coupe', d: 'Créneaux nets. Infos essentielles. Zéro friction.', k: '30 min' },
      { t: 'Barbe', d: 'Rituel précis. Résultat propre. Tarifs lisibles.', k: '25 min' },
      { t: 'Pack', d: 'Coupe + barbe — une seule réservation.', k: '55 min' },
    ],
    widget: { kind: 'slots', label: 'Disponibilités', slots: ['Aujourd’hui 18:10', 'Demain 12:40', 'Samedi 10:30'] },
    formTitle: 'Demande de réservation',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  boulangerie: {
    title: 'Maison Céleste — Boulangerie — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/boulangerie/',
    hero: '../../assets/images/demo-pack/boulangerie/hero-mobile.webp',
    chips: ['BOULANGERIE', 'QUARTIER'],
    h1: 'Une vitrine, claire.\nDes commandes, simples.',
    lead: 'Exemple de site boulangerie : offres, horaires, et click & collect.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Commander (démo)',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Pains', d: 'Disponibilités mises à jour, sans effort.', k: 'Chaque jour' },
      { t: 'Viennoiseries', d: 'Produits phares visibles en 1 écran.', k: 'Matin' },
      { t: 'Gâteaux', d: 'Commande anticipée, confirmation claire.', k: '48h' },
    ],
    widget: { kind: 'counter', label: 'Pains du jour (démo)', from: 14, to: 32, suffix: '' },
    formTitle: 'Click & collect',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  cils: {
    title: 'Studio Nova — Extensions de cils — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/cils/',
    hero: '../../assets/images/demo-pack/cils/hero-mobile.webp',
    chips: ['CILS', 'BEAUTÉ'],
    h1: 'Un agenda, rempli.\nSans promo.',
    lead: 'Exemple de site beauté : prestations, preuves, et prise de RDV claire.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Classique', d: 'Naturel, net. Résultat régulier.', k: '1h' },
      { t: 'Volume', d: 'Plus dense, sans surcharge.', k: '1h15' },
      { t: 'Remplissage', d: 'Rythme simple à réserver.', k: '45 min' },
    ],
    widget: { kind: 'estimation', label: 'Estimation indicative', suffix: '€', base: 65, mults: [65, 85, 105] },
    formTitle: 'Demande de RDV',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  coiffeur: {
    title: 'Atelier Lune — Coiffeur — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/coiffeur/',
    hero: '../../assets/images/demo-pack/coiffeur/hero-mobile.webp',
    chips: ['COIFFEUR', 'SALON'],
    h1: 'Des créneaux.\nUne expérience.',
    lead: 'Exemple de site coiffeur : services, prix, et prise de RDV rapide.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Réserver',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Coupe', d: 'Prise de RDV en 30 secondes.', k: '30 min' },
      { t: 'Coloration', d: 'Options claires, estimation simple.', k: '1h30' },
      { t: 'Soin', d: 'Ajoutable en 1 clic (démo).', k: '20 min' },
    ],
    widget: { kind: 'slots', label: 'Disponibilités', slots: ['Jeu 19:00', 'Ven 12:10', 'Sam 09:20'] },
    formTitle: 'Demande de RDV',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  estheticienne: {
    title: 'Studio Élise — Institut beauté — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/estheticienne/',
    hero: '../../assets/images/demo-pack/estheticienne/hero-mobile.webp',
    chips: ['INSTITUT', 'BEAUTÉ'],
    h1: 'Une présence, premium.\nUn agenda, net.',
    lead: 'Exemple de site institut : soins, preuves, et RDV simples.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Soin visage', d: 'Infos claires, réservation fluide.', k: '45 min' },
      { t: 'Massage', d: 'Choix guidé, confirmation nette.', k: '60 min' },
      { t: 'Épilation', d: 'Créneaux rapides.', k: '20 min' },
    ],
    widget: { kind: 'estimation', label: 'Estimation indicative', suffix: '€', base: 55, mults: [55, 75, 95] },
    formTitle: 'Demande de RDV',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  ongles: {
    title: 'Atelier Perle — Onglerie — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/ongles/',
    hero: '../../assets/images/demo-pack/ongles/hero-mobile.webp',
    chips: ['ONGLES', 'BEAUTÉ'],
    h1: 'Un rendu, net.\nUne réservation, simple.',
    lead: 'Exemple de site onglerie : prestations, prix, et RDV.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Prendre rendez-vous',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Pose', d: 'Choix guidé, résultat attendu.', k: '1h' },
      { t: 'Remplissage', d: 'Rythme simple.', k: '45 min' },
      { t: 'Nail art', d: 'Option claire (démo).', k: '+15 min' },
    ],
    widget: { kind: 'counter', label: 'Créneaux cette semaine (démo)', from: 3, to: 9, suffix: '' },
    formTitle: 'Demande de RDV',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  'sur-mesure': {
    title: 'Luminance & Lieu — Vitrine sur‑mesure — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/sur-mesure/',
    hero: '../../assets/images/demo-pack/sur-mesure/hero-mobile.webp',
    chips: ['SUR‑MESURE', 'PREMIUM'],
    h1: 'Une vitrine dense.\nSans surcharge.',
    lead: 'Exemple de vitrine premium : sections, preuves et contact.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Décrire mon projet',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Présentation', d: 'Positionnement clair, sans jargon.', k: '1 écran' },
      { t: 'Preuves', d: 'Avant/Après + détails concrets.', k: 'visuel' },
      { t: 'Contact', d: 'Message structuré, simple.', k: '1 min' },
    ],
    widget: { kind: 'estimation', label: 'Estimation indicative', suffix: '€', base: 1190, mults: [1190, 1990, 2490] },
    formTitle: 'Demande',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  tatoueuse: {
    title: 'Nocturne Ink — Tatoueuse — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/tatoueuse/',
    hero: '../../assets/images/demo-pack/tatoueuse/hero-mobile.webp',
    chips: ['TATOUAGE', 'STUDIO'],
    h1: 'Un book, clair.\nUn brief, propre.',
    lead: 'Exemple de site tatoueuse : book, style, et formulaire de brief.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Envoyer mon brief',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Style', d: 'Sélection lisible. Univers cohérent.', k: 'book' },
      { t: 'Devis', d: 'Brief clair, réponse par écrit.', k: '24h' },
      { t: 'RDV', d: 'Étapes simples.', k: 'calme' },
    ],
    widget: { kind: 'counter', label: 'Demandes cette semaine (démo)', from: 2, to: 7, suffix: '' },
    formTitle: 'Brief',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
  trainer: {
    title: 'Studio Atlas — Coach sportif — Démo Pinapp Studio',
    canonical: 'https://pinapp.fr/demo/trainer/',
    hero: '../../assets/images/demo-pack/trainer/hero-mobile.webp',
    chips: ['SPORT', 'COACHING'],
    h1: 'Un suivi.\nUne routine.\nÇa tourne.',
    lead: 'Exemple de site coach sportif : offres, planning et prise de contact.\nTout est fictif — juste pour se projeter.',
    ctaPrimary: 'Demander un plan',
    ctaSecondary: 'Voir d’autres démos',
    cards: [
      { t: 'Programme', d: 'Structure claire, sans friction.', k: '6 sem.' },
      { t: 'Suivi', d: 'Rappels utiles (démo).', k: 'simple' },
      { t: 'RDV', d: 'Créneaux nets.', k: '45 min' },
    ],
    widget: { kind: 'slots', label: 'Prochains créneaux', slots: ['Mar 18:30', 'Jeu 07:40', 'Sam 11:10'] },
    formTitle: 'Demande',
    formHint: 'Démo : ce formulaire ne transmet rien.',
    accent: 'rgba(0,229,204,0.92)',
  },
};

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function applyDemo(demoSlug, cfg) {
  let out = tpl;

  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(cfg.title)}</title>`);
  out = out.replace(
    /<meta\s+name=["']description["']\s+content=["'][^"']*["']\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(
      `Démonstration Pinapp Studio : ${cfg.title.replace(/\s+—\s+Démo Pinapp Studio$/, '')}. Contenu fictif illustratif.`,
    )}" />`,
  );
  out = out.replace(/<link\s+rel=["']canonical["']\s+href=["'][^"']*["']\s*\/?>/i, `<link rel="canonical" href="${cfg.canonical}" />`);

  // Hero image preload
  out = out.replace(
    /<link\s+rel=["']preload["']\s+as=["']image["']\s+href=["'][^"']*demo-pack\/artisan\/hero-mobile\.webp["'][^>]*>/i,
    `<link rel="preload" as="image" href="${cfg.hero}" fetchpriority="high" />`,
  );

  // Chips
  out = out.replace(/<span class="pill">ARTISAN<\/span>/i, `<span class="pill">${escapeHtml(cfg.chips?.[0] || 'DÉMO')}</span>`);
  out = out.replace(/<span class="pill">ÎLE-DE-FRANCE<\/span>/i, `<span class="pill">${escapeHtml(cfg.chips?.[1] || '')}</span>`);

  // H1 + lead
  out = out.replace(
    /<h1[^>]*>\s*Votre chantier,[\s\S]*?<\/h1>/i,
    `<h1>${escapeHtml(cfg.h1).replaceAll('\\n', '<br />')}</h1>`,
  );
  out = out.replace(
    /<p class="lead">[\s\S]*?<\/p>/i,
    `<p class="lead">${escapeHtml(cfg.lead).replaceAll('\\n', '<br />')}</p>`,
  );

  // CTA labels
  out = out.replace(/Demander un devis\s*→/i, `${escapeHtml(cfg.ctaPrimary)} →`);
  out = out.replace(/Voir d’autres démos/gi, escapeHtml(cfg.ctaSecondary || 'Voir d’autres démos'));

  // Cards
  const cardsHtml = (cfg.cards || [])
    .map(
      (c) => `<article class="card">
            <h3>${escapeHtml(c.t)}</h3>
            <p>${escapeHtml(c.d)}</p>
            <div class="kpi">${escapeHtml(c.k)}</div>
          </article>`,
    )
    .join('\n');
  out = out.replace(/<section class="grid">[\s\S]*?<\/section>/i, `<section class="grid">\n${cardsHtml}\n        </section>`);

  // Widget swap: keep base slider UI but adjust label & values via inline JS markers
  out = out.replace(/Estimation indicative/gi, escapeHtml(cfg.widget?.label || 'Estimation indicative'));
  // Form section title + hint
  out = out.replace(/<h2>Demande de devis<\/h2>/i, `<h2>${escapeHtml(cfg.formTitle || 'Demande')}</h2>`);
  out = out.replace(
    /<p class="muted">Démo : ce formulaire ne transmet rien\.[\s\S]*?<\/p>/i,
    `<p class="muted">${escapeHtml(cfg.formHint || 'Démo : ce formulaire ne transmet rien.')}</p>`,
  );

  // Accent
  out = out.replace(/--accent:\s*rgba\(123,\s*79,\s*232,\s*0\.92\);/i, `--accent: ${cfg.accent || 'rgba(0,229,204,0.92)'};`);

  // Hero image paths inside HTML
  out = out.replace(/demo-pack\/artisan\/hero-mobile\.webp/gi, cfg.hero.replace('../../assets/images/', 'demo-pack/' + demoSlug + '/hero-mobile.webp').includes('demo-pack/') ? cfg.hero.replace('../../assets/images/', '') : cfg.hero);
  // Simpler: set explicit src in <img>
  out = out.replace(/<img class="hero-img"[^>]*src="[^"]*"[^>]*>/i, (m) => {
    return m.replace(/src="[^"]*"/i, `src="${cfg.hero}"`);
  });

  return out;
}

function main() {
  for (const [slug, cfg] of Object.entries(DEMOS)) {
    const outPath = path.join(root, 'demo', slug, 'index.html');
    if (!fs.existsSync(path.dirname(outPath))) continue;
    const html = applyDemo(slug, cfg);
    fs.writeFileSync(outPath, html, 'utf8');
  }
  console.log(`generate-single-file-demos: wrote ${Object.keys(DEMOS).length} demo(s)`);
}

main();

