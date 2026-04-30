import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const htmlPath = path.join(root, 'voyage-v9', 'index.html');
let h = fs.readFileSync(htmlPath, 'utf8');

const rep = (marker, file) => {
  const frag = fs.readFileSync(path.join(__dirname, file), 'utf8');
  if (!h.includes(marker)) throw new Error('Missing marker: ' + marker);
  h = h.replace(marker, frag.trimEnd());
};

rep('<!-- PR3A_OFFRES_BODY -->', 'pr3a-frag-offres.html');
rep('<!-- PR3A_METHODE_BODY -->', 'pr3a-frag-methode.html');
rep('<!-- PR3A_DIAGNOSTIC_BODY -->', 'pr3a-frag-diagnostic.html');
rep('<!-- PR3A_CONTACT_BODY -->', 'pr3a-frag-contact.html');

const drawersPath = path.join(__dirname, 'pr3a-frag-drawers.html');
if (fs.existsSync(drawersPath)) {
  const drawers = fs.readFileSync(drawersPath, 'utf8');
  h = h.replace(/\n<div class="marquee marquee--reverse"[\s\S]*?<\/div>\s*\n/s, '\n');
  h = h.replace('</main>', '</main>\n' + drawers);
}

fs.writeFileSync(htmlPath, h);
console.log('Inject OK');
