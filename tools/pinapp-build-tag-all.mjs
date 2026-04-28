import fs from 'fs';
import path from 'path';

const root = process.cwd();
const tag = 'v13-rescue-2026-04-28';
const skipDirs = new Set(['node_modules', '.git', '_site', 'dist', '.next']);

function walk(dir, out = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (skipDirs.has(e.name)) continue;
      walk(full, out);
    } else if (e.name === 'index.html') {
      out.push(full);
    }
  }
  return out;
}

const files = walk(root);
let n = 0;
for (const f of files) {
  if (f.includes(path.join('node_modules', ''))) continue;
  let s = fs.readFileSync(f, 'utf8');
  if (s.includes('name="pinapp-build"')) continue;
  const re = /(<meta\s+charset="[^"]*"\s*\/?>)/i;
  if (re.test(s)) {
    s = s.replace(re, `$1\n    <meta name="pinapp-build" content="${tag}" />`);
    fs.writeFileSync(f, s);
    n++;
  }
}
console.log('Inserted build tag in', n, 'files');
