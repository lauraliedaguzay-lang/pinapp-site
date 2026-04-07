import { chromium } from 'playwright';
import fs from 'node:fs';

const outDir = '/workspace/.artifacts/wow';
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  ['home', '/index.html'],
  ['offres', '/offres/index.html'],
  ['offre-auto', '/offres/automatisation/index.html'],
  ['offre-sites', '/offres/sites/index.html'],
  ['offre-systeme', '/offres/systeme-complet/index.html'],
  ['diagnostic', '/diagnostic/index.html'],
  ['realisations', '/realisations/index.html'],
  ['auralis', '/auralis/index.html'],
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const themes = ['dark', 'light'];

for (const theme of themes) {
  for (const vp of viewports) {
    const browser = await chromium.launch();
    const ctx = await browser.newContext({ viewport: vp });

    await ctx.addInitScript((t) => {
      localStorage.setItem('pinapp-theme', t);
      localStorage.setItem('pinapp-mode', t === 'light' ? 'jour' : 'nuit');
    }, theme);

    const page = await ctx.newPage();

    for (const [slug, path] of pages) {
      await page.goto('http://127.0.0.1:4173' + path, { waitUntil: 'networkidle' });
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${outDir}/${slug}-${theme}-${vp.name}.png`, fullPage: true });
    }

    await browser.close();
  }
}
