import fs from 'fs';
import path from 'path';

const files = ['en/index.html', 'interne/trello/index.html', 'docs/claude-consultation/index.html'];

for (const rel of files) {
  const f = path.join(process.cwd(), rel);
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/\.\.\/\.\.\//g, '/');
  s = s.replace(/\.\.\//g, '/');
  fs.writeFileSync(f, s);
  console.log('fixed', rel, 'remaining ../', (s.match(/\.\.\//g) || []).length);
}
