import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, '../offres/sites/index.html');
const repPath = path.join(__dirname, 'sites-main-replacement.html');
let s = fs.readFileSync(htmlPath, 'utf8');
const rep = fs.readFileSync(repPath, 'utf8');
const start = s.indexOf('      <section class="section">\n        <div class="container" style="max-width: 700px">');
const end = s.indexOf('\n    </main>');
if (start === -1 || end === -1) {
  console.error('markers not found', start, end);
  process.exit(1);
}
const out = s.slice(0, start) + rep.trimEnd() + s.slice(end);
fs.writeFileSync(htmlPath, out);
console.log('Patched', htmlPath);
