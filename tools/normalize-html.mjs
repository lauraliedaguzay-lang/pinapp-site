import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set(['.git', 'node_modules', '_site', '.cursor', '.artifacts']);

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), cb);
    } else {
      cb(path.join(dir, ent.name));
    }
  }
}

function normalizeHtml(s) {
  let out = s;

  // Logo: prefer SVG everywhere.
  out = out.replace(/assets\/images\/pinapp-logo\.png/g, 'assets/images/pinapp-logo.svg');
  out = out.replace(/\/assets\/images\/pinapp-logo\.png/g, '/assets/images/pinapp-logo.svg');
  out = out.replace(/(\bsrc=["'][^"']*?)pinapp-logo\.png(["'])/g, '$1pinapp-logo.svg$2');

  // Remove external font provider (visual inconsistency + CSP risk).
  // Pinapp relies on system stacks if local font isn't shipped.
  out = out.replace(
    /\s*<link\s+rel=["']preconnect["']\s+href=["']https:\/\/fonts\.bunny\.net["']\s*\/?>\s*/gi,
    '',
  );
  out = out.replace(
    /\s*<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/fonts\.bunny\.net\/css\?family=inter:[^"']+["']\s*\/?>\s*/gi,
    '',
  );

  // Remove preload to missing local font file.
  // (Some pages still include it; build step also removes it, but keep sources clean.)
  out = out.replace(
    /\s*<link\s+rel=["']preload["'][^>]*href=["'][^"']*assets\/fonts\/inter-var\.woff2[^"']*["'][^>]*>\s*/gi,
    '',
  );

  return out;
}

let changed = 0;
walk(root, (p) => {
  if (!p.endsWith('.html')) return;
  const before = fs.readFileSync(p, 'utf8');
  const after = normalizeHtml(before);
  if (after !== before) {
    fs.writeFileSync(p, after);
    changed++;
  }
});

console.log(`normalize-html: updated ${changed} file(s)`);
