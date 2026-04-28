import fs from 'fs';
import path from 'path';

const files = [
  'faq/index.html',
  'realisations/index.html',
  'expertise-ia/index.html',
  'pourquoi-pinapp/index.html',
  'formation-gratuite/index.html',
  'confiance/index.html',
  'comment-ca-marche/index.html',
  'votre-projet/index.html',
  'univers/index.html',
  'client/index.html',
  'merci/index.html',
];

const root = process.cwd();

for (const rel of files) {
  const p = path.join(root, rel);
  let s = fs.readFileSync(p, 'utf8');
  const before = (s.match(/\.\.\//g) || []).length;
  s = s.split('../').join('/');
  s = s.replace(/href="\/index\.html"/gi, 'href="/"');
  s = s.replace(/href='\/index\.html'/gi, "href='/'");
  s = s.replace(/href="\/index\.html#/gi, 'href="/#');
  s = s.replace(/href='\/index\.html#/gi, "href='/#");
  const after = (s.match(/\.\.\//g) || []).length;
  fs.writeFileSync(p, s);
  console.log(rel, 'replaced', before, 'remaining', after);
}
