import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const TEXT_EXTS = new Set(['.html', '.css', '.js', '.mjs']);
const ASSET_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.ico', '.avif']);
const SKIP_DIRS = new Set(['.git', 'node_modules', '_site', '.cursor', '.artifacts', 'tools']);

function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(p, out);
    } else {
      const ext = path.extname(ent.name).toLowerCase();
      if (TEXT_EXTS.has(ext)) out.push(p);
    }
  }
  return out;
}

function uniq(arr) {
  return [...new Set(arr)];
}

function isExternal(u) {
  return /^https?:\/\//i.test(u) || /^\/\//.test(u);
}
function isData(u) {
  return /^data:/i.test(u);
}

function normalizeUrlLike(raw) {
  const s = raw.trim();
  // remove wrapping quotes if present
  const unq = s.replace(/^['"]|['"]$/g, '').trim();
  // strip query/hash for fs checks
  const cleaned = unq.split('#')[0].split('?')[0];
  // Sentinel used in CSS @supports probes (not an actual asset)
  if (cleaned === 'x.png') return '';
  // Template literals / placeholders (not resolvable statically)
  if (cleaned.includes('${')) return '';
  return cleaned;
}

function extractFromHtml(text) {
  const refs = [];

  // src / href attributes
  for (const m of text.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)) refs.push(m[1]);

  // srcset (take URLs before whitespace)
  for (const m of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
    const parts = m[1]
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => x.split(/\s+/)[0]);
    refs.push(...parts);
  }

  return refs;
}

function extractFromCss(text) {
  const refs = [];
  for (const m of text.matchAll(/url\(([^)]+)\)/gi)) refs.push(m[1]);
  return refs;
}

function extractFromJs(text) {
  const refs = [];
  for (const m of text.matchAll(
    /["'`]([^"'`]+\.(?:png|jpe?g|webp|svg|gif|ico|avif))(?:[?#][^"'`]*)?["'`]/gi,
  )) {
    const v = m[1];
    // JS often stores just filenames (joined later at runtime). We only check path-like refs.
    // Accept: /..., ./..., ../..., or anything containing a slash.
    if (!(v.startsWith('/') || v.startsWith('./') || v.startsWith('../') || v.includes('/')))
      continue;
    refs.push(v);
  }
  return refs;
}

function fileExistsCaseSensitive(p) {
  // Fast path
  if (fs.existsSync(p)) return true;
  return false;
}

function resolveRef(fromFile, ref) {
  const cleaned = normalizeUrlLike(ref);
  if (!cleaned) return null;
  if (isExternal(cleaned) || isData(cleaned)) return null;

  // Root absolute -> workspace root
  if (cleaned.startsWith('/')) return path.join(root, cleaned);
  // Relative -> from file dir
  return path.join(path.dirname(fromFile), cleaned);
}

function looksLikeAsset(ref) {
  const cleaned = normalizeUrlLike(ref);
  const ext = path.extname(cleaned).toLowerCase();
  if (!ext) return false;
  return ASSET_EXTS.has(ext);
}

function main() {
  const files = walk(root);

  const missing = [];
  const externals = [];

  for (const f of files) {
    const ext = path.extname(f).toLowerCase();
    const text = fs.readFileSync(f, 'utf8');
    const refs =
      ext === '.html'
        ? extractFromHtml(text)
        : ext === '.css'
          ? extractFromCss(text)
          : ext === '.js' || ext === '.mjs'
            ? extractFromJs(text)
            : [];

    for (const refRaw of refs) {
      const ref = normalizeUrlLike(refRaw);
      if (!ref) continue;
      if (isExternal(ref)) {
        if (looksLikeAsset(ref)) externals.push({ file: f, ref });
        continue;
      }
      if (isData(ref)) continue;
      if (!looksLikeAsset(ref)) continue;

      const resolved = resolveRef(f, ref);
      if (!resolved) continue;

      if (!fileExistsCaseSensitive(resolved)) {
        missing.push({ file: f, ref, resolved: path.relative(root, resolved) });
      }
    }
  }

  const missingKey = (m) => `${m.ref} @ ${m.file}`;
  const externalKey = (e) => `${e.ref} @ ${e.file}`;

  const uniqMissing = uniq(missing.map((m) => JSON.stringify(m))).map((s) => JSON.parse(s));
  const uniqExternals = uniq(externals.map((e) => JSON.stringify(e))).map((s) => JSON.parse(s));

  uniqMissing.sort((a, b) => (a.resolved + a.file).localeCompare(b.resolved + b.file));
  uniqExternals.sort((a, b) => (a.ref + a.file).localeCompare(b.ref + b.file));

  if (uniqMissing.length === 0) {
    console.log('check-asset-refs: OK — aucun asset manquant (HTML/CSS).');
  } else {
    console.log(`check-asset-refs: MISSING ${uniqMissing.length} asset reference(s):`);
    for (const m of uniqMissing) {
      console.log(`- ${m.ref} (from ${path.relative(root, m.file)}) -> ${m.resolved}`);
    }
  }

  if (uniqExternals.length) {
    console.log(`\ncheck-asset-refs: EXTERNAL ${uniqExternals.length} asset reference(s):`);
    for (const e of uniqExternals) {
      console.log(`- ${e.ref} (from ${path.relative(root, e.file)})`);
    }
  }

  process.exit(uniqMissing.length ? 2 : 0);
}

main();
