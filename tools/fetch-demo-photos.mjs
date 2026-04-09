import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const OUT_DIR = path.join(root, 'assets', 'images', 'demo');

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function safeName(x) {
  return String(x)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function fetchToFile(url, outPath) {
  return new Promise((resolve, reject) => {
    const tmp = outPath + '.tmp';
    const file = fs.createWriteStream(tmp);
    const req = https.get(url, { headers: { 'User-Agent': 'pinapp-site-demo-fetch' } }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close(() => {});
        fs.rmSync(tmp, { force: true });
        fetchToFile(res.headers.location, outPath).then(resolve, reject);
        return;
      }
      if (res.statusCode !== 200) {
        file.close(() => {});
        fs.rmSync(tmp, { force: true });
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => {
          fs.renameSync(tmp, outPath);
          resolve();
        });
      });
    });
    req.on('error', (err) => {
      file.close(() => {});
      fs.rmSync(tmp, { force: true });
      reject(err);
    });
  });
}

function parseDemoPhotoPacks(jsText) {
  // Very small parser: looks for img('ID', qX) patterns to build unsplash URLs.
  // We use the same base as the script: https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1600&q=82
  const ids = new Set();
  const re = /img\(\s*'([0-9a-zA-Z_-]{12,})'\s*,\s*(q|qM|qS)\s*\)/g;
  let m;
  while ((m = re.exec(jsText))) {
    ids.add(`${m[1]}|${m[2]}`);
  }
  return Array.from(ids).map((x) => {
    const [id, qv] = x.split('|');
    const tail =
      qv === 'qM'
        ? '?auto=format&fit=crop&w=1000&q=82'
        : qv === 'qS'
          ? '?auto=format&fit=crop&w=640&q=80'
          : '?auto=format&fit=crop&w=1600&q=82';
    return { id, url: `https://images.unsplash.com/photo-${id}${tail}` };
  });
}

async function main() {
  ensureDir(OUT_DIR);

  const packsPath = path.join(root, 'assets', 'js', 'demo-photo-packs.js');
  const packs = fs.readFileSync(packsPath, 'utf8');

  const items = parseDemoPhotoPacks(packs);
  if (!items.length) {
    console.log('No Unsplash IDs found in demo-photo-packs.js');
    return;
  }

  let ok = 0;
  let fail = 0;
  for (const it of items) {
    const filename = `unsplash-${safeName(it.id)}.jpg`;
    const outPath = path.join(OUT_DIR, filename);
    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10_000) {
      ok++;
      continue;
    }
    try {
      await fetchToFile(it.url, outPath);
      ok++;
    } catch (e) {
      fail++;
      console.error(`Failed: ${it.id} → ${e.message}`);
    }
  }
  console.log(`Fetched demo photos: ok=${ok} fail=${fail} out=${path.relative(root, OUT_DIR)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

