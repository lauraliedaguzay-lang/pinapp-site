import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });

  // A local HTTP server is expected on 4173 (used by other preview tools).
  // Using HTTP keeps relative asset loading consistent.
  await page.goto('http://127.0.0.1:4173/og-image.html', { waitUntil: 'networkidle' });
  await page.waitForTimeout(200);

  const outWebp = path.join(root, 'og-image.webp');
  const pngBuf = await page.screenshot({ type: 'png' });
  await sharp(pngBuf).webp({ quality: 84 }).toFile(outWebp);

  await browser.close();
  process.stdout.write(`Generated ${outWebp}\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
