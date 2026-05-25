#!/usr/bin/env node
// Crée en LIVE les produits + prix + Payment Links des 5 formations Pinapp,
// puis réécrit les 5 fiches HTML avec les vrais liens et retire les
// commentaires « MODE TEST ». Idempotent : relançable sans créer de doublon
// (les ressources sont retrouvées via metadata[pinapp_slug]).
//
// Pré-requis : compte Stripe activé (KYC) + Node 18+.
// Usage :
//   STRIPE_SECRET_KEY=sk_live_xxxxx node scripts/stripe-seed-live.mjs
//
// Après exécution : vérifier le diff puis `git add -A && git commit`.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const KEY = process.env.STRIPE_SECRET_KEY;
if (!KEY) {
  console.error('✗ STRIPE_SECRET_KEY manquante. Ex : STRIPE_SECRET_KEY=sk_live_xxx node scripts/stripe-seed-live.mjs');
  process.exit(1);
}
if (KEY.startsWith('sk_test_')) {
  console.error('✗ Clé TEST détectée. Ce script crée en PRODUCTION : fournis une clé sk_live_…');
  process.exit(1);
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TEST_COMMENT = 'Paiement Stripe (MODE TEST';

// Slug = dossier sous /formations/. oldTest = lien test actuellement dans la fiche.
const FORMATIONS = [
  {
    slug: 'site-autonome', code: 'L1', amount: 39000,
    oldTest: 'https://buy.stripe.com/test_dRm9AUcPG1KI3Ui8ya0ZW00',
    name: 'Formation — Mon site qui travaille tout seul (L1)',
    description: "Formation Pinapp en autonomie, guidée pas à pas. Un site qui convertit : message clair, page qui travaille, autonomie totale. 30 jours d'accompagnement sur rendez-vous inclus, accès à vie, quiz.",
  },
  {
    slug: 'automatisation', code: 'L2', amount: 39000,
    oldTest: 'https://buy.stripe.com/test_eVq3cw16Yahe8ay3dQ0ZW01',
    name: 'Formation — Automatisation n8n (L2)',
    description: "Formation Pinapp en autonomie, guidée pas à pas. Automatisez avec n8n : workflows qui rapportent, votre premier workflow, plan 30 jours. 30 jours d'accompagnement sur rendez-vous inclus, accès à vie, quiz.",
  },
  {
    slug: 'ia-collegue', code: 'L3', amount: 39000,
    oldTest: 'https://buy.stripe.com/test_dRm7sMaHy896bmK3dQ0ZW02',
    name: "Formation — L'IA, mon collègue (L3)",
    description: "Formation Pinapp en autonomie, guidée pas à pas. L'IA comme collègue : prompts, assistant métier (Claude/ChatGPT), plan IA. 30 jours d'accompagnement sur rendez-vous inclus, accès à vie, quiz.",
  },
  {
    slug: 'filmer-telephone', code: 'M1', amount: 39000,
    oldTest: 'https://buy.stripe.com/test_9B65kE02U0GEcqO5lY0ZW03',
    name: "Formation — Créer des vidéos avec l'IA (M1)",
    description: "Formation Pinapp en autonomie, guidée pas à pas. La méthode du studio : génération de vidéos avec l'IA (Runway), montage pro (Adobe Premiere Pro, Photoshop). 30 jours d'accompagnement sur rendez-vous inclus, accès à vie, quiz.",
  },
  {
    slug: 'contenu-reseaux', code: 'M2', amount: 59000,
    oldTest: 'https://buy.stripe.com/test_4gM9AUdTK3SQ3UibKm0ZW04',
    name: 'Formation — Contenu pro pour mes réseaux (M2)',
    description: "Formation Pinapp en autonomie, guidée pas à pas. Un mois de contenu réseaux : identité visuelle, visuels assistés par IA + Photoshop, vidéos Premiere Pro, calendrier programmé. 30 jours d'accompagnement sur rendez-vous inclus, accès à vie, quiz.",
  },
];

const flatten = (params) => {
  const body = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      for (const [k2, v2] of Object.entries(v)) body.append(`${k}[${k2}]`, String(v2));
    } else {
      body.append(k, String(v));
    }
  }
  return body;
};

async function stripePost(path, params) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/x-www-form-urlencoded' },
    body: flatten(params),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`POST ${path} → ${json.error?.message || res.status}`);
  return json;
}

async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`GET ${path} → ${json.error?.message || res.status}`);
  return json;
}

async function findProductBySlug(slug) {
  const q = encodeURIComponent(`metadata['pinapp_slug']:'${slug}'`);
  const res = await fetch(`https://api.stripe.com/v1/products/search?query=${q}`, {
    headers: { Authorization: `Bearer ${KEY}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`search ${slug} → ${json.error?.message || res.status}`);
  return json.data?.[0];
}

async function patchFiche(slug, oldTest, liveUrl) {
  const file = join(ROOT, 'formations', slug, 'index.html');
  const before = await readFile(file, 'utf8');
  const after = before
    .split('\n')
    .filter((line) => !line.includes(TEST_COMMENT))
    .join('\n')
    .split(oldTest)
    .join(liveUrl);
  if (after !== before) await writeFile(file, after);
  return after !== before;
}

// Préflight : refuser net si la clé n'est pas réellement en mode LIVE.
const balance = await stripeGet('balance');
if (!balance.livemode) {
  console.error('✗ Connecteur en mode TEST (livemode=false). Ouvre une NOUVELLE session avec une clé sk_live_… activée, puis relance.');
  process.exit(1);
}
const account = await stripeGet('account');
const accountName = account.settings?.dashboard?.display_name || account.business_profile?.name || account.id;
console.log(`Compte Stripe LIVE : ${accountName} (${account.id})\n`);

const results = [];
for (const f of FORMATIONS) {
  let product = await findProductBySlug(f.slug);
  if (product) {
    console.log(`= produit ${f.code} existant : ${product.id}`);
  } else {
    product = await stripePost('products', {
      name: f.name,
      description: f.description,
      metadata: { pinapp_slug: f.slug, pinapp_code: f.code },
    });
    console.log(`+ produit ${f.code} créé : ${product.id}`);
  }

  let priceId = product.default_price;
  if (!priceId) {
    const price = await stripePost('prices', { currency: 'eur', unit_amount: f.amount, product: product.id });
    priceId = price.id;
    await stripePost(`products/${product.id}`, { default_price: priceId });
    console.log(`+ prix ${f.code} créé : ${priceId} (${f.amount / 100} €)`);
  } else {
    console.log(`= prix ${f.code} existant : ${priceId}`);
  }

  let liveUrl = product.metadata?.pinapp_payment_link;
  if (!liveUrl) {
    const link = await stripePost('payment_links', {
      'line_items[0][price]': priceId,
      'line_items[0][quantity]': 1,
    });
    liveUrl = link.url;
    await stripePost(`products/${product.id}`, { metadata: { pinapp_payment_link: liveUrl } });
    console.log(`+ lien ${f.code} créé : ${liveUrl}`);
  } else {
    console.log(`= lien ${f.code} existant : ${liveUrl}`);
  }

  const patched = await patchFiche(f.slug, f.oldTest, liveUrl);
  console.log(`  fiche ${f.slug} : ${patched ? 'mise à jour' : 'déjà à jour'}`);
  results.push({ code: f.code, slug: f.slug, prix: `${f.amount / 100} €`, lien: liveUrl });
}

console.log('\n=== Récapitulatif LIVE ===');
console.table(results);
console.log('\nVérifie le diff puis : git add -A && git commit -m "feat(formations): liens de paiement Stripe LIVE"');
