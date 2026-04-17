import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const p = path.join(ROOT, 'index.html');
let t = fs.readFileSync(p, 'utf8');

const TRUST = `        <section class="section pp-trust-wrap" aria-label="Confiance" style="padding: 0.65rem 0 0">
          <div class="wrap">
            <p class="pp-trust-bar" role="note">
              11 secteurs couverts<span class="pp-mid" aria-hidden="true">·</span>30 jours satisfait ou remboursé<span
                class="pp-mid"
                aria-hidden="true"
                >·</span
              >Réponse sous 24h<span class="pp-mid" aria-hidden="true">·</span>Basés à Bordeaux
            </p>
          </div>
        </section>

`;

const needle = '        </section>\n\n        <section class="section" id="home-presentation"';
if (!t.includes('pp-trust-wrap') && t.includes(needle)) {
  t = t.replace(
    needle,
    `        </section>\n\n${TRUST}        <section class="section" id="home-presentation"`,
  );
}

const start = t.indexOf('<section class="section" id="home-presentation"');
const svc = '<section class="section" id="home-services"';
const end = t.indexOf(svc);
if (start === -1 || end === -1 || start >= end) {
  console.error('skip extract: home-presentation or home-services');
} else {
  const presBlock = t.slice(start, end);
  t = t.slice(0, start) + t.slice(end);
  const idx = t.indexOf('        <section id="temoignages"');
  if (idx === -1) throw new Error('temoignages not found');
  t = t.slice(0, idx) + presBlock + '\n' + t.slice(idx);
}

fs.writeFileSync(p, t, 'utf8');
console.log('OK patch-index-marketing');
