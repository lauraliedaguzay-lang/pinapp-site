/**
 * Generate demo homepage previews (desktop + mobile) into /assets/previews/.
 *
 * Why this exists:
 * - The carousel on /realisations/ needs REAL screenshots (web + mobile)
 * - We keep the site static; previews are generated in-repo.
 *
 * Usage:
 *   npm run previews:demo
 *
 * Output:
 *   assets/previews/demo-<slug>-desktop.webp
 *   assets/previews/demo-<slug>-mobile.webp
 */
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir, readdir, stat } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import puppeteer from 'puppeteer-core';

const pExecFile = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const demoDir = path.join(rootDir, 'demo');
const outDir = path.join(rootDir, 'assets', 'previews');

function safeSlug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function chromePath() {
  return process.env.CHROME_BIN || '/usr/local/bin/google-chrome';
}

async function listDemoSlugs() {
  const entries = await readdir(demoDir);
  const slugs = [];
  for (const e of entries) {
    const full = path.join(demoDir, e);
    try {
      const st = await stat(full);
      if (!st.isDirectory()) continue;
      const idx = path.join(full, 'index.html');
      const st2 = await stat(idx);
      if (st2.isFile()) slugs.push(e);
    } catch {
      // ignore
    }
  }
  slugs.sort();
  return slugs;
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function serveStatic(root, port = 4173) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', `http://127.0.0.1:${port}`);
    let p = decodeURIComponent(url.pathname);
    if (p.endsWith('/')) p += 'index.html';
    p = p.replace(/^\/+/, '');
    const full = path.join(root, p);
    if (!full.startsWith(root)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (!existsSync(full)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(full).toLowerCase();
    const type =
      ext === '.html'
        ? 'text/html; charset=utf-8'
        : ext === '.css'
          ? 'text/css; charset=utf-8'
          : ext === '.js' || ext === '.mjs'
            ? 'application/javascript; charset=utf-8'
            : ext === '.svg'
              ? 'image/svg+xml'
              : ext === '.webp'
                ? 'image/webp'
                : ext === '.png'
                  ? 'image/png'
                  : ext === '.jpg' || ext === '.jpeg'
                    ? 'image/jpeg'
                    : 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    createReadStream(full).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.on('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

async function pngToWebp(pngPath, webpPath) {
  await pExecFile('ffmpeg', [
    '-y',
    '-i',
    pngPath,
    '-vcodec',
    'libwebp',
    '-lossless',
    '0',
    '-q:v',
    '82',
    '-preset',
    'picture',
    '-an',
    webpPath,
  ]);
}

async function screenshotOne(page, { url, outPng, width, height, deviceScaleFactor }) {
  await page.setViewport({
    width,
    height,
    deviceScaleFactor,
    isMobile: width <= 430,
    hasTouch: width <= 430,
  });

  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
  await sleep(650);
  await page.screenshot({ path: outPng, type: 'png', fullPage: false });
}

async function generateOne(browser, baseUrl, slug) {
  const s = safeSlug(slug);
  const url = `${baseUrl}/demo/${encodeURIComponent(slug)}/`;

  const desktopPng = path.join(outDir, `demo-${s}-desktop.png`);
  const mobilePng = path.join(outDir, `demo-${s}-mobile.png`);
  const desktopWebp = path.join(outDir, `demo-${s}-desktop.webp`);
  const mobileWebp = path.join(outDir, `demo-${s}-mobile.webp`);

  const page = await browser.newPage();
  page.on('pageerror', () => {});
  page.on('console', () => {});

  await screenshotOne(page, {
    url,
    outPng: desktopPng,
    width: 1440,
    height: 900,
    deviceScaleFactor: 2,
  });
  await screenshotOne(page, {
    url,
    outPng: mobilePng,
    width: 390,
    height: 844,
    deviceScaleFactor: 3,
  });

  await pngToWebp(desktopPng, desktopWebp);
  await pngToWebp(mobilePng, mobileWebp);

  await page.close();
}

async function main() {
  await mkdir(outDir, { recursive: true });

  const port = 4173;
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = await serveStatic(rootDir, port);

  const slugs = await listDemoSlugs();
  if (slugs.length === 0) {
    console.log('No demos found in /demo/.');
    server.close();
    return;
  }

  console.log(`Generating previews for ${slugs.length} demos from ${baseUrl}`);

  const browser = await puppeteer.launch({
    executablePath: chromePath(),
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--font-render-hinting=none',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--metrics-recording-only',
      '--mute-audio',
    ],
  });

  try {
    for (const slug of slugs) {
      process.stdout.write(`- ${slug} ... `);
      try {
        await generateOne(browser, baseUrl, slug);
        console.log('ok');
      } catch (e) {
        console.log('FAILED');
        console.error(String(e && e.stack ? e.stack : e));
      }
    }
  } finally {
    await browser.close();
    server.close();
  }
}

await main();
