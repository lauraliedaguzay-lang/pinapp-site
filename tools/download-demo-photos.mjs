/**
 * PINAPP — download demo photos locally (Unsplash → WebP)
 *
 * Why:
 * - demo-photo-packs.js currently references images.unsplash.com URLs
 * - local assets make demos reliable (offline-ish) and faster
 *
 * Output:
 * - /assets/images/demo-packs/<unsplashId>-w1600.webp
 * - /assets/images/demo-packs/<unsplashId>-w1000.webp
 * - /assets/images/demo-packs/<unsplashId>-w640.webp
 */
import { mkdir, readFile, writeFile, rm, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPO_ROOT = path.resolve(__dirname, '..');
const PACKS_FILE = path.join(REPO_ROOT, 'assets/js/demo-photo-packs.js');
const OUT_DIR = path.join(REPO_ROOT, 'assets/images/demo-packs');
const TMP_DIR = path.join(REPO_ROOT, '.tmp-demo-photos');

const SIZES = [
  { label: 'w1600', tail: '?auto=format&fit=crop&w=1600&q=82' },
  { label: 'w1000', tail: '?auto=format&fit=crop&w=1000&q=82' },
  { label: 'w640', tail: '?auto=format&fit=crop&w=640&q=80' }
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

function extractUnsplashIds(source) {
  // demo-photo-packs.js uses img('141423...') calls
  const ids = new Set();
  // Unsplash photo IDs are typically like: "1581094794329-c8112a89af12"
  // Keep it permissive but safe: digits + hyphen + hex-ish tail.
  const re = /\bimg\(\s*'([0-9]{8,}-[a-z0-9]{8,})'\s*(?:,|\))/gi;
  let m;
  while ((m = re.exec(source))) ids.add(m[1]);
  return [...ids];
}

async function fileExists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function downloadToFile(url, dest) {
  const res = await fetch(url, {
    headers: {
      // avoid rare 406 and encourage image response
      accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
    }
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
    // strip metadata if present
    '-map_metadata',
    '-1',
    // webp encode
    '-c:v',
    'libwebp',
    '-preset',
    'photo',
    '-quality',
    '82',
    outputPath
  ]);
}

async function main() {
  const src = await readFile(PACKS_FILE, 'utf8');
  const ids = extractUnsplashIds(src);
  if (!ids.length) {
    console.error('No Unsplash IDs found in demo-photo-packs.js');
    process.exitCode = 1;
    return;
  }

  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(TMP_DIR, { recursive: true });

  const tasks = [];
  for (const id of ids) {
    for (const s of SIZES) {
      tasks.push({ id, ...s });
    }
  }

  let done = 0;
  let failed = 0;
  const failures = [];
  const concurrency = 6;

  async function worker() {
    while (true) {
      const task = tasks.pop();
      if (!task) return;

      const outName = `${task.id}-${task.label}.webp`;
      const outPath = path.join(OUT_DIR, outName);
      if (await fileExists(outPath)) {
        done++;
        continue;
      }

      const url = `https://images.unsplash.com/photo-${task.id}${task.tail}`;
      const tmpIn = path.join(TMP_DIR, `${task.id}-${task.label}.img`);

      try {
        await downloadToFile(url, tmpIn);
        await toWebp(tmpIn, outPath);
      } catch (err) {
        failed++;
        failures.push({
          id: task.id,
          size: task.label,
          url,
          error: err instanceof Error ? err.message : String(err)
        });
      } finally {
        await rm(tmpIn, { force: true });
      }

      done++;
      if (done % 10 === 0) {
        console.log(
          `[demo-photos] ${done}/${ids.length * SIZES.length} processed (${failed} failed so far)`
        );
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  await rm(TMP_DIR, { recursive: true, force: true });

  if (failures.length) {
    const reportPath = path.join(REPO_ROOT, 'assets/images/demo-packs/_download-report.json');
    await writeFile(reportPath, JSON.stringify({ failures }, null, 2));
    console.log(`[demo-photos] Failures report: ${reportPath}`);
  }

  console.log(
    `[demo-photos] Completed: ${ids.length} ids × ${SIZES.length} sizes → ${OUT_DIR} (${failed} failed)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});

