/**
 * PINAPP — fill missing demo photo sizes locally.
 *
 * Some Unsplash IDs can 404 for specific variants; rather than leaving holes,
 * we generate missing sizes from the closest available local WebP.
 *
 * Input:  assets/images/demo-packs/<id>-w{640,1000,1600}.webp
 * Output: missing files generated in-place.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');
const PACK_DIR = path.join(REPO_ROOT, 'assets/images/demo-packs');

const SIZES = [
  { label: 'w640', w: 640 },
  { label: 'w1000', w: 1000 },
  { label: 'w1600', w: 1600 }
];

function run(cmd, args, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

function parseId(filename) {
  const m = filename.match(/^(.+)-(w640|w1000|w1600)\.webp$/);
  return m ? { id: m[1], size: m[2] } : null;
}

function bestSourcePathFor(id, targetLabel) {
  // Prefer closest bigger size, otherwise smaller.
  const order = targetLabel === 'w640' ? ['w1000', 'w1600'] : targetLabel === 'w1000' ? ['w1600', 'w640'] : ['w1000', 'w640'];
  return order.map((s) => path.join(PACK_DIR, `${id}-${s}.webp`));
}

async function makeResizedWebp(srcPath, targetWidth, outPath) {
  // Use ffmpeg scale with "min" to avoid upscaling.
  await run('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    srcPath,
    '-map_metadata',
    '-1',
    '-vf',
    `scale='min(${targetWidth},iw)':-2`,
    '-c:v',
    'libwebp',
    '-preset',
    'photo',
    '-quality',
    '82',
    outPath
  ]);
}

async function main() {
  const files = await readdir(PACK_DIR).catch(() => []);
  const ids = new Set();
  for (const f of files) {
    const p = parseId(f);
    if (p) ids.add(p.id);
  }
  if (!ids.size) {
    console.log('[fill-sizes] No demo packs found.');
    return;
  }

  let generated = 0;
  let skipped = 0;

  for (const id of ids) {
    for (const s of SIZES) {
      const outPath = path.join(PACK_DIR, `${id}-${s.label}.webp`);
      if (await fileExists(outPath)) {
        skipped++;
        continue;
      }
      const candidates = bestSourcePathFor(id, s.label);
      let src = null;
      for (const c of candidates) {
        if (await fileExists(c)) {
          src = c;
          break;
        }
      }
      if (!src) continue;
      await makeResizedWebp(src, s.w, outPath);
      generated++;
    }
  }

  console.log(`[fill-sizes] Generated ${generated} missing variants (${skipped} already present).`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

