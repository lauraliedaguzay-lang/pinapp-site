/**
 * HTML global : lang fr, dns-prefetch Plausible, skip #main en tête du <body>,
 * id main unifié, alt sur <img>, rel sur target=_blank, picture+webp pour pinapp-icon,
 * <h1 class="sr-only"> → <p class="sr-only"> (évite double h1).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const SKIP_FIRST = new Set(['pinapp-site-vitrine/index.html', 'pinapp-site-vitrine/histoire.html']);

const SKIP_LINK =
  '<a href="#main" class="skip-link">Aller au contenu principal</a>';

const DNS_PLAUSIBLE = '    <link rel="dns-prefetch" href="https://plausible.io" />\n';

function walkHtml(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === '.git') continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkHtml(full, out);
    else if (ent.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function ensureLang(html, rel) {
  if (rel === 'en/index.html') return html;
  return html.replace(/<html([^>]*)>/i, (_, rest) => {
    const r = rest.trim();
    if (/\blang\s*=\s*["']fr["']/i.test(r)) return `<html ${r}>`;
    if (/\blang\s*=/i.test(r)) {
      const r2 = r.replace(/\blang\s*=\s*["'][^"']*["']/i, 'lang="fr"');
      return `<html ${r2}>`;
    }
    return `<html lang="fr" ${r}>`;
  });
}

function ensureDnsPrefetch(html) {
  if (/<link[^>]*dns-prefetch[^>]*href\s*=\s*["']https:\/\/plausible\.io/i.test(html)) return html;
  const i = html.toLowerCase().indexOf('</head>');
  if (i === -1) return html;
  return html.slice(0, i) + DNS_PLAUSIBLE + html.slice(i);
}

function normalizeSkip(html) {
  let h = html.replace(/<a\s+[^>]*class="[^"]*skip-link[^"]*"[^>]*>[\s\S]*?<\/a>\s*/gi, '');
  const m = h.match(/<body[^>]*>/i);
  if (!m) return h;
  const pos = m.index + m[0].length;
  return h.slice(0, pos) + '\n    ' + SKIP_LINK + '\n' + h.slice(pos);
}

function unifyMainId(html) {
  let h = html.replace(/<main\s+id="contenu-principal"/gi, '<main id="main"');
  h = h.replace(/#contenu-principal/g, '#main');
  h = h.replace(/<main\b(?![^>]*\bid=)([^>]*)>/gi, '<main id="main"$1>');
  return h;
}

function fixImgsAlt(html) {
  return html.replace(/<img\b((?:(?!>).)*?)>/gi, (full, attrs) => {
    if (/\balt\s*=/.test(attrs)) return full;
    const t = attrs.trimEnd();
    const sp = t.length ? ' ' : '';
    return `<img${t}${sp}alt="">`;
  });
}

function fixBlankTargets(html) {
  return html.replace(
    /<a\b([^>]*\btarget\s*=\s*["']?_blank["']?[^>]*)>/gi,
    (full, attrs) => {
      if (/rel\s*=\s*[^>]*noopener/.test(attrs)) return full;
      const relM = attrs.match(/\brel\s*=\s*("([^"]*)"|'([^']*)')/i);
      if (relM) {
        const q = relM[1][0];
        const val = relM[2] || relM[3];
        const newVal = val.includes('noopener') ? val : `${val} noopener noreferrer`;
        return full.replace(relM[0], `rel=${q}${newVal}${q}`);
      }
      return `<a${attrs} rel="noopener noreferrer">`;
    },
  );
}

function picturePinappIcon(html) {
  if (html.includes('pinapp-icon.webp')) return html;
  return html.replace(
    /<img(\s[^>]*\bsrc="\/assets\/images\/pinapp-icon\.png"[^>]*)>/gi,
    '<picture><source srcset="/assets/images/pinapp-icon.webp" type="image/webp"><img$1></picture>',
  );
}

function fixSrOnlyH1(html) {
  return html.replace(
    /<h1(\s+class="sr-only"[^>]*)>([\s\S]*?)<\/h1>/gi,
    '<p$1>$2</p>',
  );
}

let n = 0;
for (const full of walkHtml(ROOT)) {
  const rel = path.relative(ROOT, full).split(path.sep).join('/');
  if (SKIP_FIRST.has(rel)) continue;
  let html = fs.readFileSync(full, 'utf8');
  if (!/<\/head>/i.test(html)) continue;
  const orig = html;
  html = ensureLang(html, rel);
  html = ensureDnsPrefetch(html);
  html = normalizeSkip(html);
  html = unifyMainId(html);
  html = picturePinappIcon(html);
  html = fixImgsAlt(html);
  html = fixBlankTargets(html);
  html = fixSrOnlyH1(html);
  html = html.replace(/src="\/script\.js(\?[^"]*)?"/g, 'src="/script.min.js$1"');
  if (html !== orig) {
    fs.writeFileSync(full, html, 'utf8');
    n++;
  }
}
console.log('apply-a11y-perf-html:', n, 'files');
