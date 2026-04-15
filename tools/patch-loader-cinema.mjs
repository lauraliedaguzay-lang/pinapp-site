/**
 * Remplace le loader Pandora (SVG seul) par le loader cinéma (vidéo + HUD).
 * Injecte la pause vidéo avant fade-out dans les scripts inline associés.
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SKIP = new Set(['node_modules', '_site', '.git']);

const CINEMA_PANDORA = `    <div id="pandora-loader" class="pinapp-cinema-loader" aria-hidden="true">
      <div class="pinapp-cinema-loader__aurora" aria-hidden="true"></div>
      <div class="pinapp-cinema-loader__video-wrap">
        <video
          class="pinapp-cinema-loader__video"
          autoplay
          muted
          playsinline
          loop
          preload="metadata"
          poster="/assets/images/bg-pandora-nuit.png"
        >
          <source src="/assets/video/pinapp-loader-intro.webm" type="video/webm" />
          <source src="/assets/video/pinapp-loader-intro.mp4" type="video/mp4" />
        </video>
        <div class="pinapp-cinema-loader__veil" aria-hidden="true"></div>
        <div class="pinapp-cinema-loader__hud" aria-hidden="true">
          <span class="pinapp-cinema-loader__corner pinapp-cinema-loader__corner--tl"></span>
          <span class="pinapp-cinema-loader__corner pinapp-cinema-loader__corner--tr"></span>
          <span class="pinapp-cinema-loader__corner pinapp-cinema-loader__corner--bl"></span>
          <span class="pinapp-cinema-loader__corner pinapp-cinema-loader__corner--br"></span>
          <div class="pinapp-cinema-loader__voice" aria-hidden="true">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>
      </div>
    </div>`;

const OLD_RE = /<div id="pandora-loader"[^>]*>\s*<svg[\s\S]*?<\/svg>\s*<\/div>/g;

const PAUSE_INJECT_RE =
  /(var l = document\.getElementById\('pandora-loader'\);\s*\n\s*if \(l && l\.parentNode\) \{\s*\n)(\s*)(l\.style\.opacity = '0';)/g;

function walkHtml(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP.has(name.name)) continue;
      walkHtml(p, out);
    } else if (name.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let files = 0;
let injectPause = 0;
for (const f of walkHtml(ROOT)) {
  let raw = fs.readFileSync(f, 'utf8');
  if (!OLD_RE.test(raw)) {
    OLD_RE.lastIndex = 0;
    continue;
  }
  OLD_RE.lastIndex = 0;
  let next = raw.replace(OLD_RE, CINEMA_PANDORA);
  const afterPause = next.replace(PAUSE_INJECT_RE, (_, a, sp, c) => {
    injectPause++;
    return `${a}${sp}var _pinappV = l.querySelector('video');\n${sp}if (_pinappV) try { _pinappV.pause(); } catch (_e) {}\n${sp}${c}`;
  });
  if (afterPause !== raw) {
    fs.writeFileSync(f, afterPause);
    files++;
  }
}

console.log(
  `patch-loader-cinema: ${files} fichiers HTML mis à jour, ${injectPause} scripts enrichis (pause vidéo).`,
);
