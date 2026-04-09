/**
 * Generate Pinapp homepage previews (desktop + mobile) into /assets/previews/.
 *
 * Output:
 *   assets/previews/pinapp-home-desktop.webp
 *   assets/previews/pinapp-home-mobile.webp
 */
import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import puppeteer from 'puppeteer-core';

const pExecFile = promisify(execFile);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'assets', 'previews');

function chromePath() {
  return process.env.CHROME_BIN || '/usr/local/bin/google-chrome';
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

async function main() {
  await mkdir(outDir, { recursive: true });
  const port = 4173;
  const baseUrl = `http://127.0.0.1:${port}`;
  const server = await serveStatic(rootDir, port);

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
    const page = await browser.newPage();
    page.on('pageerror', () => {});
    page.on('console', () => {});

    const desktopPng = path.join(outDir, 'pinapp-home-desktop.png');
    const mobilePng = path.join(outDir, 'pinapp-home-mobile.png');
    const desktopWebp = path.join(outDir, 'pinapp-home-desktop.webp');
    const mobileWebp = path.join(outDir, 'pinapp-home-mobile.webp');

    await screenshotOne(page, {
      url: `${baseUrl}/`,
      outPng: desktopPng,
      width: 1440,
      height: 900,
      deviceScaleFactor: 2,
    });
    await screenshotOne(page, {
      url: `${baseUrl}/`,
      outPng: mobilePng,
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
    });

    await pngToWebp(desktopPng, desktopWebp);
    await pngToWebp(mobilePng, mobileWebp);

    await page.close();
  } finally {
    await browser.close();
    server.close();
  }
}

await main();
