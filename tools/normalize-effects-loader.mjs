import { readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';

const ROOT = process.cwd();

function isHtml(path) {
  return extname(path).toLowerCase() === '.html';
}

async function listFiles(dir) {
  const out = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    // ignore build artifacts / deps
    if (e.name === 'node_modules' || e.name === '.git' || e.name === '.artifacts') continue;
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      // demo pages use their own scoped scripts; skip
      if (full.split(sep).includes('demo')) continue;
      out.push(...(await listFiles(full)));
    } else if (e.isFile() && isHtml(full)) {
      out.push(full);
    }
  }
  return out;
}

function normSlashes(p) {
  return p.replaceAll('\\', '/');
}

function relPrefix(fromFileAbs) {
  // Relative path from html file dir to repo root
  const relToRoot = relative(join(ROOT, fromFileAbs ? '' : ''), ROOT);
  void relToRoot;
}

function computePrefix(fileAbs) {
  const fileDir = fileAbs.split(sep).slice(0, -1).join(sep) || ROOT;
  const rel = relative(fileDir, ROOT) || '.';
  const depth = rel === '.' ? 0 : normSlashes(rel).split('/').length;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function stripEffects(html, prefix) {
  const esc = prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const effectNames = ['particles', 'scroll-cinema', 'bio-particles', 'cursor'];
  for (const name of effectNames) {
    const re = new RegExp(
      `\\s*<script\\s+src=["']${esc}assets\\/js\\/${name}\\.js["']\\s+defer\\s*><\\/script>\\s*\\n?`,
      'g',
    );
    html = html.replace(re, '\n');
  }
  return html;
}

function ensureLoader(html, prefix) {
  const loaderTag = `<script src="${prefix}assets/js/effects-loader.js" defer></script>`;
  if (html.includes(loaderTag)) return html;

  // Prefer inserting right after main.js
  const mainTag = `<script src="${prefix}assets/js/main.js" defer></script>`;
  if (html.includes(mainTag)) {
    return html.replace(mainTag, `${mainTag}\n    ${loaderTag}`);
  }

  // Fallback: insert before closing body
  return html.replace(/<\/body>/i, `  ${loaderTag}\n  </body>`);
}

async function run() {
  const files = await listFiles(ROOT);
  let changed = 0;

  for (const abs of files) {
    const rel = relative(ROOT, abs);
    const prefix = computePrefix(abs);
    const original = await readFile(abs, 'utf8');
    let html = original;

    html = stripEffects(html, prefix);
    html = ensureLoader(html, prefix);

    // tidy extra blank lines from removals (keep formatting stable)
    html = html.replace(/\n{3,}/g, '\n\n');

    if (html !== original) {
      await writeFile(abs, html, 'utf8');
      changed++;
      // eslint-disable-next-line no-console
      console.log(`✓ ${rel}`);
    }
  }

  // eslint-disable-next-line no-console
  console.log(`Done. Updated ${changed} file(s).`);
}

run().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exitCode = 1;
});
