import fs from 'fs';
import path from 'path';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.') && e.name !== '.') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === '.git' || e.name === '_site') continue;
      walk(p, out);
    } else if (e.name.endsWith('.html')) {
      out.push(p);
    }
  }
  return out;
}

const root = process.cwd();
const files = walk(root);
let total = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  if (!s.includes('../')) continue;
  const n = (s.match(/\.\.\//g) || []).length;
  s = s.split('../').join('/');
  s = s.replace(/href="\/index\.html"/gi, 'href="/"');
  s = s.replace(/href='\/index\.html'/gi, "href='/'");
  s = s.replace(/href="\/index\.html#/gi, 'href="/#');
  s = s.replace(/href='\/index\.html#/gi, "href='/#");
  fs.writeFileSync(f, s);
  total += n;
  console.log(path.relative(root, f), n, 'replaced');
}
console.log('Total ../ segments fixed:', total);
