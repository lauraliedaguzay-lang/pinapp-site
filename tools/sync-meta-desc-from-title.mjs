import fs from 'fs';
import path from 'path';

const files = [
  'admin/index.html',
  'dashboard/index.html',
  'en/index.html',
  'interne/trello/index.html',
  'docs/claude-consultation/index.html',
  'univers/index.html',
  'votre-projet/index.html',
  'merci/index.html',
  'expertise-ia/index.html',
  'client/index.html',
  'confiance/index.html',
  'comment-ca-marche/index.html',
];

const boiler =
  'Page Index — Pinapp, agence digitale Bordeaux.';

for (const rel of files) {
  const f = path.join(process.cwd(), rel);
  let s = fs.readFileSync(f, 'utf8');
  const m = s.match(/<title>([^<]+)<\/title>/);
  if (!m) {
    console.warn('no title', rel);
    continue;
  }
  const title = m[1].replace(/&amp;/g, '&');
  const desc = `${title} · Studio digital Bordeaux.`;
  const n0 = (s.match(new RegExp(boiler.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  s = s.split(boiler).join(desc);
  fs.writeFileSync(f, s);
  console.log(rel, n0, '→', desc.slice(0, 50) + '…');
}
