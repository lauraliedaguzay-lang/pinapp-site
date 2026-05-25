/**
 * PINAPP — moteur de templates e-mail (DA du site live · index.html).
 *
 * Référence : index.html (home "voyage cinéma")
 *   Fond near-black #0b0c12 (dégradé #12121d → #08090c) · texte ivory #F4F1EA
 *   Dégradé signature champagne → violet → periwinkle  (#E9C46A → #9A6BF2 → #6D8FEA)
 *   Accent violet #8E6AD8 / lavender #A88BE0 · accents biolumi
 *   Typo : Poppins (display) + Geist (corps) via Google Fonts
 *   Logo : /assets/images/pinapp-logo-trans.png
 *
 * Usage :
 *   import { renderPinappEmail } from "./email-pinapp.mjs";
 *   const html = renderPinappEmail({ variant: "client", title: "…", intro: "…", … });
 *
 * Démo (génère les aperçus dans emails/previews/) :
 *   node scripts/email-pinapp.mjs
 */

const C = {
  bg: "#0b0c12",
  bgDeep: "#08090c",
  panel: "#13131d",
  panelBorder: "rgba(142,106,216,0.28)",
  ivory: "#f4f1ea",
  ivory60: "rgba(244,241,234,0.60)",
  ivory38: "rgba(244,241,234,0.38)",
  violet: "#8e6ad8",
  violetDeep: "#7b5bee",
  lavender: "#a88be0",
  periwinkle: "#6d8fea",
  champagne: "#e9c46a",
  calloutBg: "rgba(142,106,216,0.12)",
};

const GRAD = "linear-gradient(90deg,#e9c46a 0%,#9a6bf2 45%,#6d8fea 100%)";
const GRAD_CTA = "linear-gradient(90deg,#7b5bee 0%,#6d8fea 100%)";

const F_DISPLAY = `'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif`;
const F_BODY = `'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`;

const LOGO_URL = "https://pinapp.fr/assets/images/pinapp-logo-trans.png";

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

/** Un bloc section : titre lavande + corps HTML libre. */
function sectionHtml({ heading, body }) {
  const h = heading
    ? `<p style="margin:0 0 8px;font-family:${F_DISPLAY};font-size:12px;font-weight:600;letter-spacing:0.16em;text-transform:uppercase;color:${C.lavender}">${esc(heading)}</p>`
    : "";
  return `
    <tr><td style="padding:0 0 24px">
      ${h}
      <div style="font-family:${F_BODY};font-size:16px;line-height:1.65;color:${C.ivory};font-weight:400">${body}</div>
    </td></tr>`;
}

/** Encadré mis en avant (bordure violette à gauche, fond violet voilé). */
function calloutHtml({ title, body }) {
  const t = title
    ? `<p style="margin:0 0 6px;font-family:${F_DISPLAY};font-size:13px;font-weight:600;letter-spacing:0.03em;color:${C.lavender}">${esc(title)}</p>`
    : "";
  return `
    <tr><td style="padding:0 0 26px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.calloutBg};border-radius:10px">
        <tr>
          <td style="width:3px;background:${C.violet};border-radius:10px 0 0 10px"></td>
          <td style="padding:16px 20px">
            ${t}
            <div style="font-family:${F_BODY};font-size:15px;line-height:1.6;color:${C.ivory}">${body}</div>
          </td>
        </tr>
      </table>
    </td></tr>`;
}

/** Bouton CTA (dégradé violet → periwinkle, texte blanc). */
function ctaHtml({ label, url }) {
  return `
    <tr><td style="padding:6px 0 30px">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="background:${C.violetDeep};background:${GRAD_CTA};border-radius:10px">
          <a href="${esc(url)}" style="display:inline-block;padding:14px 30px;font-family:${F_DISPLAY};font-size:14px;font-weight:600;letter-spacing:0.04em;color:#ffffff;text-decoration:none">${esc(label)} &rarr;</a>
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
    footer = `Pinapp — Studio digital · Bordeaux<br>49 av. Edmond Rostand · 33700 Mérignac<br><a href="https://pinapp.fr" style="color:${C.lavender};text-decoration:none">pinapp.fr</a> · contact@pinapp.fr`,
  } = opts;

  const introHtml = intro
    ? `<tr><td style="padding:0 0 24px;font-family:${F_BODY};font-size:16px;line-height:1.7;color:${C.ivory}">${intro}</td></tr>`
    : "";

  const sectionsHtml = sections.map(sectionHtml).join("");
  const calloutBlock = callout ? calloutHtml(callout) : "";
  const ctaBlock = cta ? ctaHtml(cta) : "";

  const signoffHtml = `
    <tr><td style="padding:6px 0 0;border-top:1px solid ${C.panelBorder}">
      <p style="margin:20px 0 0;font-family:${F_DISPLAY};font-weight:600;font-size:18px;line-height:1.2;color:${C.ivory}">${esc(signoff)}</p>
      ${signoffRole ? `<p style="margin:4px 0 0;font-family:${F_BODY};font-size:12px;letter-spacing:0.05em;color:${C.ivory60}">${esc(signoffRole)}</p>` : ""}
    </td></tr>`;

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
<title>${esc(title)} — Pinapp</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};-webkit-text-size-adjust:100%">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.bg};font-size:1px;line-height:1px">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.bg};background:linear-gradient(160deg,#12121d 0%,#0b0c12 55%,#08090c 100%)">
  <tr><td align="center" style="padding:40px 16px">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:100%">

      <!-- Logo -->
      <tr><td align="center" style="padding:0 0 28px">
        <a href="https://pinapp.fr" style="text-decoration:none">
          <img src="${LOGO_URL}" width="158" alt="Pinapp" style="display:block;border:0;width:158px;max-width:158px;height:auto">
        </a>
      </td></tr>

      <!-- Carte -->
      <tr><td style="background:${C.panel};border:1px solid ${C.panelBorder};border-radius:16px;padding:0">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

          <!-- Filet dégradé signature -->
          <tr><td style="height:4px;line-height:4px;font-size:0;background:${C.violet};background:${GRAD};border-radius:16px 16px 0 0">&nbsp;</td></tr>

          <tr><td style="padding:36px 34px">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">

              <tr><td style="padding:0 0 12px">
                <span style="font-family:${F_DISPLAY};font-size:11px;font-weight:600;letter-spacing:0.26em;text-transform:uppercase;color:${C.lavender}">${esc(eyebrow)}</span>
              </td></tr>

              <tr><td style="padding:0 0 22px">
                <h1 style="margin:0;font-family:${F_DISPLAY};font-weight:600;font-size:30px;line-height:1.2;color:${C.ivory}">${esc(title)}</h1>
              </td></tr>

              ${introHtml}
              ${sectionsHtml}
              ${calloutBlock}
              ${ctaBlock}
              ${signoffHtml}

            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td align="center" style="padding:26px 16px 8px">
        <p style="margin:0;font-family:${F_BODY};font-size:11px;line-height:1.7;letter-spacing:0.03em;color:${C.ivory38}">${footer}</p>
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
