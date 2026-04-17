/**
 * Insère Plausible avant </head>, garantit favicon + apple-touch-icon,
 * ajoute le bloc parrainage dans les footers (remplace l’ancienne ligne 10% si présente).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const PLAUSIBLE =
  '<script defer data-domain="pinapp.fr" src="https://plausible.io/js/script.js"></script>';

const PARRAINAGE = `          <p style="font-size:0.75rem;color:rgba(232,244,248,0.4);margin-top:1rem;">
            🍍 Parrainage — Recommandez un client, recevez 10&nbsp;% sur votre prochaine prestation.
            <a href="mailto:contact@pinapp.fr?subject=Parrainage" style="color:#00E5B0;">En savoir plus</a>
          </p>`;

const PARRAINAGE_DEMO = `      <p style="font-size:0.75rem;color:rgba(232,244,248,0.4);margin-top:1rem;text-align:center;max-width:36rem;margin-left:auto;margin-right:auto;line-height:1.5;">
        🍍 Parrainage — Recommandez un client, recevez 10&nbsp;% sur votre prochaine prestation.
        <a href="mailto:contact@pinapp.fr?subject=Parrainage" style="color:#00E5B0;">En savoir plus</a>
      </p>`;

const OLD_RECOMMANDEZ =
  /<p[^>]*>\s*Recommandez un client → 10&nbsp;% sur votre prochaine prestation\s*<\/p>/gi;

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, out);
    else if (ent.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function ensureHeadTags(html) {
  let h = html;
  h = h.replace(
    /\s*<script defer data-domain="pinapp\.fr" src="https:\/\/plausible\.io\/js\/script\.js"><\/script>\s*/gi,
    '\n',
  );
  const headClose = h.toLowerCase().lastIndexOf('</head>');
  if (headClose === -1) return h;
  const insert = `\n    ${PLAUSIBLE}\n`;
  h = h.slice(0, headClose) + insert + h.slice(headClose);

  if (!/rel=["']icon["'][^>]*href=["']\/favicon\.svg["']/i.test(h)) {
    const m = h.match(/<meta\s+charset=["']UTF-8["']\s*\/?>/i);
    if (m) {
      const idx = h.indexOf(m[0]) + m[0].length;
      h =
        h.slice(0, idx) +
        `\n    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />` +
        h.slice(idx);
    }
  }
  if (!/rel=["']apple-touch-icon["']/i.test(h)) {
    const fi = h.search(/<link\s+rel=["']icon["'][^>]*href=["']\/favicon\.svg["'][^>]*>/i);
    if (fi !== -1) {
      const end = h.indexOf('>', fi) + 1;
      h =
        h.slice(0, end) +
        `\n    <link rel="apple-touch-icon" href="/assets/images/pinapp-icon.png" />` +
        h.slice(end);
    } else {
      const headClose2 = h.toLowerCase().lastIndexOf('</head>');
      if (headClose2 !== -1) {
        h =
          h.slice(0, headClose2) +
          `\n    <link rel="apple-touch-icon" href="/assets/images/pinapp-icon.png" />\n` +
          h.slice(headClose2);
      }
    }
  }
  return h;
}

function applyFooter(html) {
  let h = html;
  if (h.includes('🍍 Parrainage')) return h;

  if (OLD_RECOMMANDEZ.test(h)) {
    OLD_RECOMMANDEZ.lastIndex = 0;
    return h.replace(OLD_RECOMMANDEZ, PARRAINAGE.trim());
  }

  const savNeedle = /(<p[^>]*>[\s\S]*?Réponse sous 24h[\s\S]*?<\/p>)/i;
  if (savNeedle.test(h) && /<footer/i.test(h)) {
    return h.replace(savNeedle, (block) => `${block}\n${PARRAINAGE}`);
  }

  const li = h.lastIndexOf('</footer>');
  if (li === -1) return h;
  const fi = h.lastIndexOf('<footer', li);
  if (fi === -1) return h;
  const frag = h.slice(fi, li);
  if (!/contact@pinapp|pinapp\.fr/i.test(frag)) return h;
  return h.slice(0, li) + '\n' + PARRAINAGE_DEMO + '\n    ' + h.slice(li);
}

let files = 0;
let touched = 0;
for (const full of walkHtml(ROOT)) {
  const rel = path.relative(ROOT, full).split(path.sep).join('/');
  if (rel.startsWith('pinapp-site-vitrine/')) continue;
  let raw = fs.readFileSync(full, 'utf8');
  if (!/<\/head>/i.test(raw)) continue;
  files++;
  const orig = raw;
  raw = ensureHeadTags(raw);
  raw = applyFooter(raw);
  if (raw !== orig) {
    fs.writeFileSync(full, raw, 'utf8');
    touched++;
  }
}
console.log('apply-plausible-favicon-parrainage:', touched, '/', files, 'html files updated');
