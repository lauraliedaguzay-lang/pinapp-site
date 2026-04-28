import fs from 'fs';
import path from 'path';

const patches = [
  {
    file: 'votre-projet/index.html',
    title: 'Votre projet — Pinapp',
  },
  { file: 'expertise-ia/index.html', title: 'Expertise IA — Pinapp' },
  { file: 'confiance/index.html', title: 'Confiance — Engagements Pinapp' },
  { file: 'univers/index.html', title: 'Univers Pinapp — Le studio' },
  { file: 'merci/index.html', title: 'Merci — Pinapp' },
  { file: 'admin/index.html', title: 'Admin — Pinapp' },
  { file: 'client/index.html', title: 'Espace client — Pinapp' },
  { file: 'dashboard/index.html', title: 'Dashboard — Pinapp' },
];

const oldTitle = 'Index — Pinapp';

for (const { file, title } of patches) {
  const p = path.join(process.cwd(), file);
  let s = fs.readFileSync(p, 'utf8');
  s = s.replace(
    new RegExp(`<meta property="og:title" content="${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" />`, 'g'),
    `<meta property="og:title" content="${title}" />`,
  );
  s = s.replace(
    new RegExp(`<meta name="twitter:title" content="${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}" />`, 'g'),
    `<meta name="twitter:title" content="${title}" />`,
  );
  s = s.replace(
    new RegExp(`<title>${oldTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</title>`, 'g'),
    `<title>${title}</title>`,
  );
  fs.writeFileSync(p, s);
  console.log('patched', file);
}
