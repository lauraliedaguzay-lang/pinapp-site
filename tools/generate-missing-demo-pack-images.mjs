/**
 * PINAPP — generate missing demo-pack images locally (procedural)
 *
 * Goal: user explicitly wants generated images written into the folder.
 * This script:
 * - scans `assets/images/demo-packs/_download-report.json` for failures (missing Unsplash assets)
 * - generates deterministic placeholder images (fractal / cellular automaton) as WebP
 * - writes them to `assets/images/demo-packs/<id>-<size>.webp`
 *
 * Notes:
 * - No external network calls.
 * - Uses ffmpeg generators: mandelbrot / cellauto.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const REPORT = path.join(ROOT, 'assets/images/demo-packs/_download-report.json');
const OUT_DIR = path.join(ROOT, 'assets/images/demo-packs');

function run(cmd, args, { cwd } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: 'inherit' });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

function dimsForSize(size) {
  if (size === 'w640') return { w: 640, h: 420 };
  if (size === 'w1000') return { w: 1000, h: 660 };
  return { w: 1600, h: 960 };
}

function stableSeed(s) {
  const hex = createHash('sha1').update(String(s)).digest('hex').slice(0, 8);
  return parseInt(hex, 16) >>> 0;
}

function pickGenerator(seed) {
  return seed % 2 === 0 ? 'mandelbrot' : 'cellauto';
}

async function generateWebp({ id, size, outPath }) {
  const { w, h } = dimsForSize(size);
  const seed = stableSeed(`${id}-${size}`);
  const gen = pickGenerator(seed);

  // We keep it "photo-like": subtle motionless textures, no text overlay.
  // mandelbrot: fractal with zoom/pan derived from seed
  // cellauto: cellular automaton with deterministic rule derived from seed
  let filter;
  if (gen === 'mandelbrot') {
    // This ffmpeg build supports start_x/start_y + start_scale/end_scale (no end_x/end_y).
    const cx = -0.743 + ((seed >>> 8) % 1200) / 100000; // small drift around default
    const cy = -0.131 + ((seed >>> 16) % 1200) / 100000;
    const startScale = 2.8 + (seed % 40) / 40; // 2.8..3.8
    const endScale = 0.28 + ((seed >>> 24) % 30) / 100; // 0.28..0.58
    const endPts = 1; // single frame
    const outer = (seed % 4); // 0..3
    const inner = (seed % 4); // 0..3
    filter =
      `mandelbrot=size=${w}x${h}` +
      `:start_x=${cx}:start_y=${cy}` +
      `:start_scale=${startScale}:end_scale=${endScale}` +
      `:end_pts=${endPts}:maxiter=4096:outer=${outer}:inner=${inner},format=rgb24`;
  } else {
    const rule = 30 + (seed % 226); // 30..255
    filter = `cellauto=size=${w}x${h}:rule=${rule}:rate=1,format=rgb24`;
  }

  // Encode to webp
  await run('ffmpeg', [
    '-y',
    '-hide_banner',
    '-loglevel',
    'error',
    '-f',
    'lavfi',
    '-i',
    filter,
    '-frames:v',
    '1',
    '-map_metadata',
    '-1',
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
  await mkdir(OUT_DIR, { recursive: true });

  let report;
  try {
    report = JSON.parse(await readFile(REPORT, 'utf8'));
  } catch {
    console.error(`Missing report file at ${REPORT}. Run: node tools/download-demo-photos.mjs first.`);
    process.exitCode = 1;
    return;
  }

  const failures = Array.isArray(report.failures) ? report.failures : [];
  if (!failures.length) {
    console.log('[generate-missing] No failures found; nothing to generate.');
    return;
  }

  const unique = new Map(); // key -> {id,size}
  for (const f of failures) {
    if (!f || !f.id || !f.size) continue;
    unique.set(`${f.id}-${f.size}`, { id: f.id, size: f.size });
  }

  const generated = [];
  for (const { id, size } of unique.values()) {
    const file = `${id}-${size}.webp`;
    const outPath = path.join(OUT_DIR, file);
    await generateWebp({ id, size, outPath });
    generated.push(file);
  }

  const notePath = path.join(OUT_DIR, '_generated-local.json');
  await writeFile(
    notePath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        generator: 'ffmpeg lavfi (mandelbrot/cellauto)',
        count: generated.length,
        files: generated.sort()
      },
      null,
      2
    )
  );

  console.log(`[generate-missing] Generated ${generated.length} images into ${OUT_DIR}`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});

