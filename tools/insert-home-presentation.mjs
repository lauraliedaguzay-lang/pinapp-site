import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fp = path.join(__dirname, '../index.html');
let s = fs.readFileSync(fp, 'utf8');

const marker =
  '        </section>\n\n        \n        <section class="section" id="home-services"';
if (!s.includes(marker)) {
  throw new Error('hero/home-services marker not found');
}
if (s.includes('id="home-presentation"')) {
  console.log('Already inserted, skip');
  process.exit(0);
}

const cards = [1, 2, 3, 4, 5]
  .map(
    (n) =>
      `
              <div role="listitem" style="flex: 0 0 min(220px, 72vw); scroll-snap-align: start; border-radius: 14px; overflow: hidden; border: 1px solid rgba(179, 136, 255, 0.12); background: rgba(255,255,255,0.04)">
                <div style="aspect-ratio: 9/14; background: linear-gradient(160deg, rgba(0,229,176,0.12), rgba(91,79,232,0.2)); display: flex; align-items: center; justify-content: center; position: relative">
                  <span style="font-size: 2rem; opacity: 0.85" aria-hidden="true">▶</span>
                  <span style="position: absolute; bottom: 8px; left: 8px; font-size: 0.62rem; padding: 0.2rem 0.45rem; border-radius: 6px; background: rgba(0,0,0,0.45); color: #e8f4f8">100 % IA</span>
                </div>
                <p style="margin: 0.5rem 0.65rem 0.65rem; font-size: 0.72rem; color: rgba(232,244,248,0.5)">Démo ` +
      n +
      `</p>
              </div>`,
  )
  .join('');

const insert =
  `        </section>

        <section class="section" id="home-presentation" aria-labelledby="home-films-ia-h2" style="padding: 1.5rem 0 2rem">
          <div class="wrap">
            <div
              id="pinapp-home-pres-video"
              style="
                max-width: 1100px;
                margin: 0 auto;
                aspect-ratio: 16/9;
                border-radius: 18px;
                overflow: hidden;
                position: relative;
                background: linear-gradient(145deg, #0d1f2a 0%, #050a14 55%, #0a1624 100%);
                border: 1px solid rgba(0, 229, 176, 0.18);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 0.75rem;
                padding: 1.5rem;
              ">
              <span class="sr-only">Vidéo de présentation Pinapp — bientôt disponible</span>
              <button
                type="button"
                disabled
                aria-disabled="true"
                style="
                  width: 72px;
                  height: 72px;
                  border-radius: 50%;
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  background: rgba(255, 255, 255, 0.06);
                  color: #fff;
                  font-size: 1.5rem;
                  cursor: default;
                  animation: pinapp-pres-pulse 2.2s ease-in-out infinite;
                "
                aria-label="Lecture indisponible pour le moment">
                ▶
              </button>
              <p style="margin: 0; font-size: 0.95rem; color: rgba(232, 244, 248, 0.75); text-align: center">
                Notre vidéo de présentation arrive bientôt
              </p>
            </div>
            <p style="text-align: center; margin: 0.65rem 0 0; font-size: 0.78rem; color: rgba(240, 248, 255, 0.45)">
              Lauralie &amp; Michaël · Pinapp · Bordeaux
            </p>
            <style>
              @keyframes pinapp-pres-pulse {
                0%,
                100% {
                  transform: scale(1);
                  opacity: 0.95;
                }
                50% {
                  transform: scale(1.06);
                  opacity: 0.65;
                }
              }
            </style>

            <h2
              id="home-films-ia-h2"
              style="
                text-align: center;
                margin: 2.25rem 0 0.5rem;
                font-size: clamp(1.35rem, 3vw, 2rem);
                letter-spacing: -0.02em;
                text-wrap: balance;
              ">
              Et si c'était vous dans le prochain film ?
            </h2>
            <p
              style="
                text-align: center;
                max-width: 36rem;
                margin: 0 auto 1.25rem;
                font-size: 0.92rem;
                line-height: 1.65;
                color: rgba(232, 244, 248, 0.62);
              ">
              Offrez une expérience unique. Un clip IA où vous ou un proche devenez le héros. 10 photos suffisent.
            </p>
            <div
              class="pinapp-films-ia-strip"
              role="list"
              style="
                display: flex;
                gap: 1rem;
                overflow-x: auto;
                padding: 0.25rem 0 0.75rem;
                scroll-snap-type: x mandatory;
                -webkit-overflow-scrolling: touch;
              ">` +
  cards +
  `
            </div>
            <p style="text-align: center; font-size: 0.8rem; color: rgba(232, 244, 248, 0.55); margin: 0.5rem 0 1rem">
              À partir de 1&nbsp;000&nbsp;€ · 10 photos · Livré en 5–7 jours
            </p>
            <div style="display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: center; margin-bottom: 0.5rem">
              <a class="btn btn--primary" href="/diagnostic/?besoin=film-ia">Je veux mon film IA →</a>
              <a
                class="btn btn--ghost"
                href="/diagnostic/?besoin=film-ia-cadeau"
                style="border-color: rgba(212, 160, 23, 0.35); color: #d4a017"
                >Offrir un film IA →</a
              >
            </div>
            <p style="text-align: center; font-size: 0.65rem; color: rgba(232, 244, 248, 0.35); max-width: 40rem; margin: 0 auto; line-height: 1.5">
              Démonstrations techniques à des fins artistiques. Les univers représentés appartiennent à leurs détenteurs respectifs.
            </p>
          </div>
        </section>

        <section class="section" id="home-services"`;

s = s.replace(marker, insert);
fs.writeFileSync(fp, s);
console.log('Inserted home-presentation block');
