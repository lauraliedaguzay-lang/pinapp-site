/**
 * PINAPP — Agent de maintenance (vérifications HTTP)
 * Exécution : Node 20+ — `node tools/health-check.js`
 * n8n : nœud « Code » — `const { runHealthCheck } = await import('./tools/health-check.js');`
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SITE = 'https://pinapp.fr';
const PAGES = [
  '/',
  '/offres/',
  '/a-propos/',
  '/auralis/',
  '/diagnostic/',
  '/demo/',
  '/demo/restaurant/',
  '/demo/barbier/',
  '/demo/coach/',
  '/legal/mentions-legales.html',
  '/sitemap.xml',
  '/robots.txt',
];

const CHECKS = {
  async checkUptime(url) {
    const start = Date.now();
    try {
      const res = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(5000) });
      const duration = Date.now() - start;
      return {
        url,
        status: res.status,
        duration,
        ok: res.status >= 200 && res.status < 400,
        error: res.status >= 400 ? 'HTTP ' + res.status : null,
      };
    } catch (e) {
      return { url, status: 0, duration: Date.now() - start, ok: false, error: e.message };
    }
  },

  async checkSSL(url) {
    try {
      await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(8000) });
      return { ok: true, error: null };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  },

  async checkContent(url, mustContain) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
      const html = await res.text();
      const missing = mustContain.filter(function (k) {
        return !html.includes(k);
      });
      return { ok: missing.length === 0, missing };
    } catch (e) {
      return { ok: false, missing: mustContain, error: e.message };
    }
  },
};

async function runHealthCheck() {
  const results = [];
  const errors = [];

  for (const page of PAGES) {
    const check = await CHECKS.checkUptime(SITE + page);
    results.push(check);
    if (!check.ok) errors.push(check);
  }

  const ssl = await CHECKS.checkSSL(SITE);
  if (!ssl.ok) errors.push({ url: SITE, error: ssl.error });

  const content = await CHECKS.checkContent(SITE, ['Pinapp', 'contact@pinapp.fr', '523 884 898']);
  if (!content.ok) errors.push({ url: SITE, error: 'Contenu manquant', missing: content.missing });

  const summary = {
    timestamp: new Date().toISOString(),
    totalPages: PAGES.length,
    pagesOk: results.filter(function (r) {
      return r.ok;
    }).length,
    pagesDown: errors.length,
    avgDuration: Math.round(results.reduce(function (a, r) {
      return a + r.duration;
    }, 0) / results.length),
    errors,
  };

  return summary;
}

const __filename = fileURLToPath(import.meta.url);
function isMain() {
  const a = process.argv[1];
  return Boolean(a && path.resolve(a) === path.resolve(__filename));
}

if (isMain()) {
  runHealthCheck()
    .then(function (s) {
      console.log(JSON.stringify(s, null, 2));
      process.exit(s.errors.length ? 1 : 0);
    })
    .catch(function (e) {
      console.error(e);
      process.exit(1);
    });
}

export { runHealthCheck, PAGES, SITE, CHECKS };
