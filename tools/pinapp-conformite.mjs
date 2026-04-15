/**
 * Conformité SEO / accessibilité de base : viewport-fit, canonical pinapp.fr,
 * lien d'évitement, id sur <main>, lang, charset, title, meta description.
 *
 * Usage:
 *   node tools/pinapp-conformite.mjs          — applique les correctifs
 *   node tools/pinapp-conformite.mjs --fix    — idem
 *   node tools/pinapp-conformite.mjs --audit  — rapport uniquement, exit 1 si écart
 *
 * Exclut tools/ (fragments), node_modules, _site, .git.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const SKIP_DIR = new Set(['node_modules', '_site', '.git', 'tools']);

/** URLs canoniques acceptées quand elles diffèrent du chemin fichier (redirections, dépôt GitHub, etc.). */
const CANONICAL_OVERRIDE = {
  'formations/index.html': 'https://pinapp.fr/offres/formation/',
  'votre-projet/index.html': 'https://pinapp.fr/diagnostic/',
  'index.legacy.html': 'https://pinapp.fr/',
  'docs/claude-consultation/index.html':
    'https://github.com/lauraliedaguzay-lang/pinapp-site/tree/main/docs/claude-consultation',
};

function expectedCanonicalHref(rel) {
  return CANONICAL_OVERRIDE[rel] ?? toCanonical(rel);
}

function relPath(abs) {
  return path.relative(ROOT, abs).replace(/\\/g, '/');
}

function shouldProcess(rel) {
  if (!rel.endsWith('.html')) return false;
  const seg = rel.split('/');
  for (const s of seg) {
    if (SKIP_DIR.has(s)) return false;
  }
  return true;
}

function toCanonical(rel) {
  if (rel === 'index.html') return 'https://pinapp.fr/';
  if (rel.endsWith('/index.html')) {
    const dir = rel.slice(0, -'/index.html'.length);
    return 'https://pinapp.fr/' + (dir ? dir + '/' : '');
  }
  return 'https://pinapp.fr/' + rel;
}

/** Comparaison tolérante (slash final, www). */
function normalizeCanonicalHref(href) {
  if (!href || typeof href !== 'string') return '';
  let u = href.trim();
  u = u.replace(/^https?:\/\/www\.pinapp\.fr/i, 'https://pinapp.fr');
  u = u.replace(/\/+$/, '');
  if (u === 'https://pinapp.fr') u = 'https://pinapp.fr/';
  if (u.startsWith('https://pinapp.fr') && !u.startsWith('https://pinapp.fr/')) {
    u = u.replace('https://pinapp.fr', 'https://pinapp.fr/');
  }
  return u;
}

function fixViewport(html) {
  return html.replace(
    /<meta\s+name=["']viewport["']\s+content=["']([^"']*)["'](\s*\/?)>/gi,
    (full, c, closing) => {
      if (/viewport-fit\s*=\s*cover/i.test(c)) return full;
      const trimmed = c.trim();
      const newc = trimmed.includes(',')
        ? `${trimmed}, viewport-fit=cover`
        : `${trimmed}, viewport-fit=cover`;
      return `<meta name="viewport" content="${newc}"${closing}>`;
    },
  );
}

function ensureCanonical(html, url) {
  if (/\srel=["']canonical["']/i.test(html)) return html;
  const line = `    <link rel="canonical" href="${url}" />\n`;
  const ch = html.match(/<meta\s+charset=[^>]+\/?>/i);
  if (ch) {
    const i = html.indexOf(ch[0]) + ch[0].length;
    return html.slice(0, i) + '\n' + line + html.slice(i);
  }
  const he = html.indexOf('</head>');
  if (he !== -1) return html.slice(0, he) + line + html.slice(he);
  return html;
}

function ensureMainId(html) {
  if (/\bid=["']main["']/i.test(html) || /\bid=["']contenu-principal["']/i.test(html)) return html;
  let replaced = false;
  return html.replace(/<main([^>]*)>/gi, (full, attrs) => {
    if (replaced) return full;
    if (/\bid\s*=/i.test(attrs)) {
      replaced = true;
      return full;
    }
    replaced = true;
    const a = (attrs || '').trim();
    return '<main id="main"' + (a ? ' ' + a : '') + '>';
  });
}

function detectMainAnchor(html) {
  const m = html.match(/<main[^>]*\bid=["']([^"']+)["']/i);
  if (m) return m[1];
  if (/\bid=["']main["']/i.test(html)) return 'main';
  if (/\bid=["']contenu-principal["']/i.test(html)) return 'contenu-principal';
  return null;
}

function hasSkipToAnchor(html, anchor) {
  if (!anchor) return true;
  const esc = anchor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp('href=["\']#' + esc + '["\']', 'i');
  if (re.test(html)) return true;
  if (/class=["'][^"']*skip-link/i.test(html) && /Aller au contenu/i.test(html)) return true;
  return false;
}

function ensureSkip(html, anchor) {
  if (!anchor) return html;
  if (hasSkipToAnchor(html, anchor)) return html;
  const bm = html.match(/<body[^>]*>/i);
  if (!bm) return html;
  const insert = `\n    <a class="skip-link" href="#${anchor}">Aller au contenu</a>\n`;
  const idx = bm.index + bm[0].length;
  return html.slice(0, idx) + insert + html.slice(idx);
}

function patchSpecial(rel, html) {
  if (rel === 'formations/index.html' && !/id=["']contenu-principal["']/i.test(html)) {
    html = html.replace('<p>', '<p id="contenu-principal">');
  }
  return html;
}

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIR.has(ent.name)) continue;
      walk(p, out);
    } else if (ent.name.endsWith('.html')) out.push(p);
  }
  return out;
}

/**
 * @returns {{ level: 'error' | 'warn', code: string, msg: string }[]}
 */
function collectAuditIssues(rel, html) {
  const issues = [];

  if (!/<html[^>]*\blang\s*=\s*["']?[a-z]/i.test(html)) {
    issues.push({ level: 'error', code: 'LANG', msg: '<html> sans attribut lang' });
  }

  if (!/<meta\s+charset\s*=\s*["']?utf-8/i.test(html)) {
    issues.push({ level: 'error', code: 'CHARSET', msg: 'meta charset utf-8 manquant ou non UTF-8' });
  }

  const vp = html.match(/<meta\s+name=["']viewport["']\s+content=["']([^"']*)["']/i);
  if (!vp) {
    issues.push({ level: 'error', code: 'VIEWPORT', msg: 'meta viewport absent' });
  } else if (!/viewport-fit\s*=\s*cover/i.test(vp[1])) {
    issues.push({ level: 'error', code: 'VIEWPORT_FIT', msg: 'viewport sans viewport-fit=cover' });
  }

  const canM = html.match(/<link[^>]*\srel=["']canonical["'][^>]*\s+href=["']([^"']*)["']/i);
  if (!canM) {
    issues.push({ level: 'error', code: 'CANONICAL', msg: 'link rel=canonical absent' });
  } else {
    const exp = normalizeCanonicalHref(expectedCanonicalHref(rel));
    const got = normalizeCanonicalHref(canM[1]);
    if (exp !== got) {
      issues.push({
        level: 'warn',
        code: 'CANONICAL_HREF',
        msg: `canonical: attendu "${expectedCanonicalHref(rel)}", trouvé "${canM[1]}"`,
      });
    }
  }

  const anchor = detectMainAnchor(html);
  if (!anchor) {
    issues.push({
      level: 'error',
      code: 'MAIN_ID',
      msg: 'aucune ancre #main / #contenu-principal sur <main> (ou id manquant)',
    });
  } else if (!hasSkipToAnchor(html, anchor)) {
    issues.push({
      level: 'error',
      code: 'SKIP_LINK',
      msg: `lien d'évitement manquant ou sans href="#${anchor}"`,
    });
  }

  const tit = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (!tit || !String(tit[1]).trim()) {
    issues.push({ level: 'error', code: 'TITLE', msg: '<title> vide ou absent' });
  }

  if (!/<meta\s+[^>]*\bname=["']description["']/i.test(html)) {
    issues.push({ level: 'warn', code: 'DESCRIPTION', msg: 'meta name=description absent' });
  }

  return issues;
}

function parseArgs(argv) {
  const audit = argv.includes('--audit') || argv.includes('-a');
  return { audit };
}

function runFix() {
  const files = walk(ROOT);
  let updated = 0;
  for (const abs of files) {
    const rel = relPath(abs);
    if (!shouldProcess(rel)) continue;
    let html = fs.readFileSync(abs, 'utf8');
    const orig = html;
    html = patchSpecial(rel, html);
    html = fixViewport(html);
    html = ensureCanonical(html, toCanonical(rel));
    html = ensureMainId(html);
    const anchor = detectMainAnchor(html);
    html = ensureSkip(html, anchor);
    if (html !== orig) {
      fs.writeFileSync(abs, html, 'utf8');
      updated++;
      console.log('pinapp-conformite:', rel);
    }
  }
  console.log('pinapp-conformite: fichiers modifiés:', updated);
}

function runAudit() {
  const files = walk(ROOT);
  let errCount = 0;
  let warnCount = 0;
  for (const abs of files) {
    const rel = relPath(abs);
    if (!shouldProcess(rel)) continue;
    const html = fs.readFileSync(abs, 'utf8');
    const issues = collectAuditIssues(rel, html);
    if (!issues.length) continue;
    for (const it of issues) {
      const tag = it.level === 'error' ? 'ERROR' : 'WARN ';
      console.log(`pinapp-conformite [${tag}] ${rel}: [${it.code}] ${it.msg}`);
      if (it.level === 'error') errCount++;
      else warnCount++;
    }
  }
  console.log(
    `pinapp-conformite --audit: ${errCount} erreur(s), ${warnCount} avertissement(s)`,
  );
  if (errCount > 0) process.exit(1);
}

const argv = process.argv.slice(2);
const { audit } = parseArgs(argv);
if (audit) runAudit();
else runFix();
