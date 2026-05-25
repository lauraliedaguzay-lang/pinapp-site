/**
 * PINAPP — moteur de templates e-mail (DA V15).
 *
 * Source de vérité marque : docs/pinapp-brand.md
 *   Palette 4 teintes — Noir #050505 · Ivoire #F4EBD9 · Or #C9A96E · Bleu #1B2C3E
 *   Typo — Cormorant Garamond (display, italique) + Inter (corps)
 *   Zéro emoji · radius 4px · symboles autorisés : ·  —  /  (→ toléré en CTA)
 *
 * Usage :
 *   import { renderPinappEmail } from "./email-pinapp.mjs";
 *   const html = renderPinappEmail({ variant: "client", title: "…", intro: "…", … });
 *
 * Démo (génère les aperçus dans emails/previews/) :
 *   node scripts/email-pinapp.mjs
 */

const C = {
  noir: "#050505",
  noirPanel: "#0d0f14",
  ivoire: "#f4ebd9",
  ivoire60: "rgba(244,235,217,0.62)",
  ivoire38: "rgba(244,235,217,0.38)",
  or: "#c9a96e",
  orSoft: "rgba(201,169,110,0.14)",
  orBorder: "rgba(201,169,110,0.28)",
  bleu: "#1b2c3e",
};

const F_DISPLAY = `'Cormorant Garamond', Georgia, 'Times New Roman', serif`;
const F_BODY = `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;

const LOGO_URL = "https://pinapp.fr/assets/images/pinapp-logo-gold.png";

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function eyebrowFor(variant) {
  return variant === "interne" ? "Interne · Équipe Pinapp" : "Pinapp · Studio digital";
}

/** Un bloc section : titre or + corps HTML libre. */
function sectionHtml({ heading, body }) {
  const h = heading
    ? `<p style="margin:0 0 8px;font-family:${F_BODY};font-size:11px;font-weight:500;letter-spacing:0.18em;text-transform:uppercase;color:${C.or}">${esc(heading)}</p>`
    : "";
  return `
    <tr><td style="padding:0 0 24px">
      ${h}
      <div style="font-family:${F_BODY};font-size:16px;line-height:1.65;color:${C.ivoire};font-weight:400">${body}</div>
    </td></tr>`;
}

/** Encadré mis en avant (bordure or à gauche). */
function calloutHtml({ title, body }) {
  const t = title
    ? `<p style="margin:0 0 6px;font-family:${F_BODY};font-size:13px;font-weight:500;letter-spacing:0.04em;color:${C.or}">${esc(title)}</p>`
    : "";
  return `
    <tr><td style="padding:0 0 24px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="width:3px;background:${C.or}"></td>
          <td style="padding:16px 20px;background:${C.orSoft}">
            ${t}
            <div style="font-family:${F_BODY};font-size:15px;line-height:1.6;color:${C.ivoire}">${body}</div>
          </td>
        </tr>
      </table>
    </td></tr>`;
}

/** Bouton CTA (or plein, texte noir). */
function ctaHtml({ label, url }) {
  return `
    <tr><td style="padding:8px 0 28px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="background:${C.or};border-radius:4px">
          <a href="${esc(url)}" style="display:inline-block;padding:13px 28px;font-family:${F_BODY};font-size:14px;font-weight:500;letter-spacing:0.05em;color:${C.noir};text-decoration:none">${esc(label)} &rarr;</a>
        </td></tr>
      </table>
    </td></tr>`;
}

export function renderPinappEmail(opts = {}) {
  const {
    variant = "client",
    preheader = "",
    eyebrow = eyebrowFor(variant),
    title = "",
    intro = "",
    sections = [],
    callout = null,
    cta = null,
    signoff = "Lauralie Daguzay",
    signoffRole = "Studio Pinapp · Bordeaux",
    footer = `Pinapp — Studio digital premium · Bordeaux<br><a href="https://pinapp.fr" style="color:${C.or};text-decoration:none">pinapp.fr</a> · contact@pinapp.fr`,
  } = opts;

  const introHtml = intro
    ? `<tr><td style="padding:0 0 24px;font-family:${F_BODY};font-size:16px;line-height:1.7;color:${C.ivoire}">${intro}</td></tr>`
    : "";

  const sectionsHtml = sections.map(sectionHtml).join("");
  const calloutBlock = callout ? calloutHtml(callout) : "";
  const ctaBlock = cta ? ctaHtml(cta) : "";

  const signoffHtml = `
    <tr><td style="padding:8px 0 0;border-top:1px solid ${C.orBorder}">
      <p style="margin:20px 0 0;font-family:${F_DISPLAY};font-style:italic;font-size:22px;line-height:1.2;color:${C.ivoire}">${esc(signoff)}</p>
      ${signoffRole ? `<p style="margin:4px 0 0;font-family:${F_BODY};font-size:12px;letter-spacing:0.06em;color:${C.ivoire60}">${esc(signoffRole)}</p>` : ""}
    </td></tr>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<link rel="preconnect" href="https://fonts.bunny.net" crossorigin>
<link href="https://fonts.bunny.net/css?family=cormorant-garamond:400i,500i|inter:400,500&display=swap" rel="stylesheet">
<title>${esc(title)} — Pinapp</title>
</head>
<body style="margin:0;padding:0;background:${C.noir};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.noir};font-size:1px;line-height:1px">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.noir}">
  <tr><td align="center" style="padding:40px 16px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">

      <!-- Logo -->
      <tr><td align="center" style="padding:0 0 28px">
        <img src="${LOGO_URL}" width="132" alt="Pinapp" style="display:block;border:0;height:auto;max-width:132px;font-family:${F_DISPLAY};font-style:italic;font-size:24px;color:${C.or}">
      </td></tr>

      <!-- Carte -->
      <tr><td style="background:${C.noirPanel};border:1px solid ${C.orBorder};border-radius:4px;padding:40px 36px">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

          <tr><td style="padding:0 0 10px">
            <span style="font-family:${F_BODY};font-size:11px;font-weight:500;letter-spacing:0.3em;text-transform:uppercase;color:${C.or}">${esc(eyebrow)}</span>
          </td></tr>

          <tr><td style="padding:0 0 22px">
            <h1 style="margin:0;font-family:${F_DISPLAY};font-style:italic;font-weight:500;font-size:34px;line-height:1.15;color:${C.ivoire}">${esc(title)}</h1>
          </td></tr>

          ${introHtml}
          ${sectionsHtml}
          ${calloutBlock}
          ${ctaBlock}
          ${signoffHtml}

        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding:28px 16px 8px">
        <p style="margin:0;font-family:${F_BODY};font-size:11px;line-height:1.7;letter-spacing:0.04em;color:${C.ivoire38}">${footer}</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/* ---- Démo : exemples interne + client ------------------------------------ */

function demoInterne() {
  const li = "margin:0 0 6px";
  return renderPinappEmail({
    variant: "interne",
    preheader: "Dernière étape avant d'encaisser les formations : activer le compte Stripe.",
    title: "Activer Stripe pour les paiements",
    intro:
      "Salut Michaël,<br><br>J'ai besoin que tu prennes en charge l'activation Stripe du site : c'est la dernière étape avant qu'on encaisse de vrais paiements sur les formations. Tout le code est prêt, il ne manque que ça côté Stripe.",
    callout: {
      title: "Point à trancher — RIB",
      body: "Il faut renseigner un IBAN / RIB pour recevoir l'argent des ventes : le tien ou celui de ton père, à voir ensemble.",
    },
    sections: [
      {
        heading: "D'abord — vérifier le bon compte",
        body: `Sur <strong>dashboard.stripe.com</strong>, ouvre le sélecteur de compte (en haut à gauche). Le compte branché s'appelle « Environnement de test PINAPP » : s'il est listé sous « Sandboxes », il ne passera jamais en réel — il faut alors activer le vrai compte Pinapp.`,
      },
      {
        heading: "Étape A — Activer le compte (10–15 min)",
        body: `Clique « Activer le compte », puis prépare :
          <ul style="margin:10px 0 0;padding-left:20px">
            <li style="${li}">Statut + SIRET (auto-entrepreneur ou société)</li>
            <li style="${li}">IBAN / RIB — voir le point ci-dessus</li>
            <li style="${li}">Pièce d'identité (recto / verso)</li>
            <li style="${li}">Téléphone + l'URL du site : pinapp.fr</li>
          </ul>`,
      },
      {
        heading: "Étape B — Récupérer la clé live",
        body: `Bascule l'interrupteur Test → Live, puis Développeurs → Clés API, et copie la clé secrète qui commence par <strong>sk_live_</strong> (et non sk_test_). Cette clé donne accès à l'argent du compte : ne la transmets que par un canal privé.`,
      },
      {
        heading: "Étape C — Me transmettre la clé",
        body: `Envoie-moi la clé sk_live_ en privé. Je m'occupe du reste : la création des produits, prix et liens de paiement réels est automatique (~30 s).`,
      },
    ],
    cta: { label: "Ouvrir le dashboard Stripe", url: "https://dashboard.stripe.com" },
    signoff: "Lauralie",
    signoffRole: "Studio Pinapp · Bordeaux",
  });
}

function demoClient() {
  const li = "margin:0 0 6px";
  return renderPinappEmail({
    variant: "client",
    preheader: "Bienvenue chez Pinapp — voici comment on démarre votre projet.",
    title: "Bienvenue chez Pinapp",
    intro:
      "Bonjour [Prénom],<br><br>Merci de votre confiance. On est ravis de démarrer votre projet — voici comment on avance, étape par étape.",
    sections: [
      {
        heading: "Les prochaines étapes",
        body: `<ul style="margin:0;padding-left:20px">
            <li style="${li}">Vous nous transmettez vos contenus — textes, visuels, accès</li>
            <li style="${li}">On lance la production sous 48 h</li>
            <li style="${li}">Première version présentée sous [X] jours</li>
            <li style="${li}">Vos retours — ajustements — livraison finale</li>
          </ul>`,
      },
      {
        heading: "Votre interlocutrice",
        body: `Lauralie Daguzay — réponse sous 24 h ouvrées à contact@pinapp.fr.`,
      },
    ],
    callout: {
      title: "Un détail compte",
      body: "Plus vos contenus nous arrivent tôt, plus la première version est juste. On vous envoie une checklist dédiée si besoin.",
    },
    cta: { label: "Accéder à votre espace", url: "https://pinapp.fr" },
    signoff: "Lauralie Daguzay",
    signoffRole: "Studio Pinapp · Bordeaux",
  });
}

const isMain = process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const { writeFileSync, mkdirSync } = await import("node:fs");
  const dir = "emails/previews";
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/apercu-interne.html`, demoInterne());
  writeFileSync(`${dir}/apercu-client.html`, demoClient());
  console.log(`Aperçus générés dans ${dir}/ (apercu-interne.html, apercu-client.html)`);
}

export { demoInterne, demoClient };
