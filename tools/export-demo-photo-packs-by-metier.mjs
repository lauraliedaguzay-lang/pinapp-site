/**
 * PINAPP — export demo photos "par métier"
 *
 * Source of truth: assets/js/demo-photo-packs.js
 * - This file already maps each pack to local `/assets/images/demo-packs/<id>-wXYZ.webp`
 * - Some Unsplash IDs may fail (404). In that case, demos still work thanks to runtime fallback.
 *
 * This export script aims to produce "complete" folders per métier by:
 * - copying existing local demo-packs assets
 * - downloading missing ones from Unsplash (best effort) and converting to WebP
 *
 * Output:
 * - exports/demo-photos/<metier>/*.webp
 * - exports/demo-photos/<metier>/_manifest.json (list of expected files + missing)
 *
 * Notes:
 * - You can still pre-populate with `node tools/download-demo-photos.mjs`, but this script can fill gaps automatically.
 */
import { mkdir, readFile, writeFile, stat, copyFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const PACKS_FILE = path.join(ROOT, 'assets/js/demo-photo-packs.js');
const DEMO_PACKS_DIR = path.join(ROOT, 'assets/images/demo-packs');
const EXPORT_ROOT = path.join(ROOT, 'exports/demo-photos');
const TMP_DIR = path.join(ROOT, '.tmp-export-demo-photos');

function run(cmd, args, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function tailFromSize(size) {
  if (size === 'w1000') return '?auto=format&fit=crop&w=1000&q=82';
  if (size === 'w640') return '?auto=format&fit=crop&w=640&q=80';
  return '?auto=format&fit=crop&w=1600&q=82';
}

function parseIdAndSizeFromFilename(name) {
  const m = String(name).match(/^([0-9]{8,}-[a-z0-9]{8,})-(w1600|w1000|w640)\.webp$/i);
  if (!m) return null;
  return { id: m[1], size: m[2].toLowerCase() };
}

async function downloadToFile(url, dest) {
  const res = await fetch(url, {
    headers: { accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8' }
  });
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(dest, buf);
}

async function toWebp(inputPath, outputPath) {
  await run('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    inputPath,
    '-map_metadata',
    '-1',
    '-c:v',
    'libwebp',
    '-preset',
    'photo',
    '-quality',
    '82',
    outputPath
  ]);
}

async function ensureLocalDemoPackFile(relPath) {
  const abs = path.join(ROOT, relPath.replace(/^\//, ''));
  if (await exists(abs)) return { ok: true, abs, downloaded: false };

  const base = path.basename(abs);
  const parsed = parseIdAndSizeFromFilename(base);
  if (!parsed) return { ok: false, abs, downloaded: false, reason: 'unparseable filename' };

  const url = `https://images.unsplash.com/photo-${parsed.id}${tailFromSize(parsed.size)}`;
  await mkdir(TMP_DIR, { recursive: true });
  const tmpIn = path.join(TMP_DIR, `${parsed.id}-${parsed.size}.img`);

  try {
    await downloadToFile(url, tmpIn);
    await mkdir(path.dirname(abs), { recursive: true });
    await toWebp(tmpIn, abs);
    return { ok: true, abs, downloaded: true };
  } catch (e) {
    return { ok: false, abs, downloaded: false, reason: e instanceof Error ? e.message : String(e), url };
  } finally {
    await rm(tmpIn, { force: true });
  }
}

async function listAvailableLocalForPack(relPaths) {
  const available = [];
  for (const rel of relPaths) {
    const abs = path.join(ROOT, rel.replace(/^\//, ''));
    if (await exists(abs)) {
      available.push({ rel, abs, base: path.basename(abs), parsed: parseIdAndSizeFromFilename(path.basename(abs)) });
    }
  }
  return available.filter((x) => x.parsed);
}

function stableSlug(s) {
  return String(s || '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function sha1(s) {
  return createHash('sha1').update(s).digest('hex').slice(0, 10);
}

function parsePackKeys(src) {
  // We only need top-level pack keys defined as: <key>: {
  // inside g.PINAPP_DEMO_PHOTO_PACKS = { ... }
  const start = src.indexOf('g.PINAPP_DEMO_PHOTO_PACKS');
  if (start < 0) return [];
  const after = src.slice(start);
  const m = after.match(/g\.PINAPP_DEMO_PHOTO_PACKS\s*=\s*\{([\s\S]*?)\n\s*\};/);
  if (!m) return [];
  const body = m[1];
  const keys = new Set();
  const re = /^\s*([a-zA-Z0-9_-]+)\s*:\s*\{/gm;
  let mm;
  while ((mm = re.exec(body))) keys.add(mm[1]);
  return [...keys];
}

function extractLocalWebpPathsForPack(src, packKey) {
  // Extract all occurrences of img('ID' ...) within a given pack block.
  // Then map to local filenames: assets/images/demo-packs/<ID>-<size>.webp
  const packRe = new RegExp(`\\n\\s*${packKey}\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\}\\s*,`, 'm');
  const m = src.match(packRe);
  if (!m) return [];
  const block = m[1];

  const ids = [];
  const idRe = /\bimg\(\s*'([0-9]{8,}-[a-z0-9]{8,})'\s*(?:,|\))/gi;
  let mm;
  while ((mm = idRe.exec(block))) ids.push(mm[1]);

  // Very approximate size inference: if the call uses qM/qS, we map to w1000/w640. Otherwise w1600.
  const calls = [];
  const callRe = /\bimg\(\s*'([0-9]{8,}-[a-z0-9]{8,})'\s*(?:,\s*(qM|qS)\s*)?\)/gi;
  while ((mm = callRe.exec(block))) {
    const id = mm[1];
    const which = mm[2] || 'q';
    const size = which === 'qM' ? 'w1000' : which === 'qS' ? 'w640' : 'w1600';
    calls.push({ id, size });
  }

  const rel = calls.map((c) => `/assets/images/demo-packs/${c.id}-${c.size}.webp`);
  return [...new Set(rel)];
}

async function copyPack(packKey, relPaths, { downloadMissing } = {}) {
  const outDir = path.join(EXPORT_ROOT, packKey);
  await mkdir(outDir, { recursive: true });

  const copied = [];
  const missing = [];
  const downloaded = [];
  const substituted = [];

  const available = await listAvailableLocalForPack(relPaths);
  const availableBySize = new Map();
  for (const a of available) {
    const s = a.parsed.size;
    if (!availableBySize.has(s)) availableBySize.set(s, []);
    availableBySize.get(s).push(a);
  }

  for (const rel of relPaths) {
    if (downloadMissing) {
      const ensured = await ensureLocalDemoPackFile(rel);
      if (ensured.downloaded) downloaded.push(path.basename(ensured.abs));
    }

    const from = path.join(ROOT, rel.replace(/^\//, ''));
    const baseName = path.basename(from);
    const to = path.join(outDir, baseName);
    if (await exists(from)) {
      await copyFile(from, to);
      copied.push(baseName);
    } else {
      // If download failed (often 404), substitute with another photo from same pack and same size.
      const parsed = parseIdAndSizeFromFilename(baseName);
      const candidates = parsed ? availableBySize.get(parsed.size) || [] : [];
      if (parsed && candidates.length) {
        const pick = candidates[(copied.length + missing.length) % candidates.length];
        const substituteFrom = pick.abs;
        await copyFile(substituteFrom, to);
        copied.push(baseName);
        substituted.push({
          file: baseName,
          substituted_from: path.basename(substituteFrom),
          reason: 'missing source asset; substituted from same pack/size'
        });
      } else {
        missing.push({ file: baseName, source: rel });
      }
    }
  }

  const manifest = {
    pack: packKey,
    total_expected: relPaths.length,
    copied: copied.length,
    missing: missing.length,
    downloaded: downloaded.length,
    substituted: substituted.length,
    files: copied.sort(),
    missing_files: missing,
    downloaded_files: downloaded.sort(),
    substituted_files: substituted
  };
  await writeFile(path.join(outDir, '_manifest.json'), JSON.stringify(manifest, null, 2));
  return manifest;
}

async function main() {
  await mkdir(EXPORT_ROOT, { recursive: true });

  const src = await readFile(PACKS_FILE, 'utf8');
  const packKeys = parsePackKeys(src);
  if (!packKeys.length) {
    console.error('No packs found in demo-photo-packs.js');
    process.exitCode = 1;
    return;
  }

  await mkdir(DEMO_PACKS_DIR, { recursive: true });

  const manifests = [];
  for (const packKey of packKeys) {
    const rel = extractLocalWebpPathsForPack(src, packKey);
    const mf = await copyPack(packKey, rel, { downloadMissing: true });
    manifests.push(mf);
  }

  const summary = {
    generated_at: new Date().toISOString(),
    export_root: 'exports/demo-photos',
    packs: manifests,
    totals: {
      expected: manifests.reduce((a, m) => a + (m.total_expected || 0), 0),
      copied: manifests.reduce((a, m) => a + (m.copied || 0), 0),
      downloaded: manifests.reduce((a, m) => a + (m.downloaded || 0), 0),
      missing: manifests.reduce((a, m) => a + (m.missing || 0), 0)
    }
  };
  await writeFile(path.join(EXPORT_ROOT, '_summary.json'), JSON.stringify(summary, null, 2));

  // Optional: create a zip for convenience (non-committed)
  const zipName = `pinapp-demo-photos-par-metier-${sha1(summary.generated_at)}.zip`;
  const zipPath = path.join(ROOT, 'exports', zipName);
  await mkdir(path.join(ROOT, 'exports'), { recursive: true });
  await run('zip', ['-r', zipPath, 'demo-photos'], { cwd: path.join(ROOT, 'exports') }).catch(() => {});

  await rm(TMP_DIR, { recursive: true, force: true });

  // The zip command above is intentionally best-effort; if zip is absent, exports folder is still ready.
  console.log(`[export] Done. Folder: ${EXPORT_ROOT}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

