import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fp = path.join(__dirname, '../index.html');
let s = fs.readFileSync(fp, 'utf8');
const a = '\n            <section id="video-showreel"';
const b = '\n            <!-- Onglets -->';
const i = s.indexOf(a);
const j = s.indexOf(b);
if (i === -1 || j === -1 || j < i) {
  console.error('markers', i, j);
  process.exit(1);
}
s = s.slice(0, i) + '\n' + s.slice(j);
fs.writeFileSync(fp, s);
console.log('Removed nested video-showreel from formations');
