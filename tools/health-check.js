/**
 * PINAPP — Agent de maintenance auto-réparant
 * Node 18+ (ESM) : node tools/health-check.js
 *
 * Pour n8n / CommonJS : utiliser tools/health-check.cjs (même logique).
 */

export const SITE = 'https://pinapp.fr';
export const PAGES = [
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

export const CHECKS = {
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
        error: res.status >= 400 ? `HTTP ${res.status}` : null,
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
      return { ok: false, error: 'SSL invalide ou expiré' };
    }
  },

  async checkContent(url, mustContain) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
      const html = await res.text();
      const missing = mustContain.filter((k) => !html.includes(k));
      return { ok: missing.length === 0, missing, error: null };
    } catch (e) {
      return { ok: false, missing: mustContain, error: e.message };
    }
  },
};

/** Résumé santé du site (uptime, SSL basique, mots-clés page d’accueil). */
export async function runHealthCheck() {
  const results = [];
  const errors = [];

  for (const page of PAGES) {
    const check = await CHECKS.checkUptime(SITE + page);
    results.push(check);
    if (!check.ok) errors.push(check);
    if (check.ok && check.duration > 3000) {
      errors.push({
        url: check.url,
        status: check.status,
        duration: check.duration,
        ok: false,
        error: 'slow',
      });
    }
  }

  const ssl = await CHECKS.checkSSL(SITE);
  if (!ssl.ok) errors.push({ url: SITE, error: ssl.error });

  const content = await CHECKS.checkContent(SITE, ['Pinapp', 'contact@pinapp.fr', '523 884 898']);
  if (!content.ok) {
    errors.push({ url: SITE, error: 'Contenu manquant', missing: content.missing });
  }

  return {
    timestamp: new Date().toISOString(),
    totalPages: PAGES.length,
    pagesOk: results.filter((r) => r.ok).length,
    pagesDown: errors.length,
    avgDuration: Math.round(
      results.reduce((a, r) => a + r.duration, 0) / Math.max(results.length, 1),
    ),
    errors,
  };
}

export default { runHealthCheck, PAGES, SITE, CHECKS };

const isCli = /health-check\.js$/i.test(process.argv[1] || '');
if (isCli) {
  runHealthCheck()
    .then((s) => {
      console.log(JSON.stringify(s, null, 2));
      if (s.errors.length) process.exitCode = 1;
    })
    .catch((e) => {
      console.error(e);
      process.exitCode = 1;
    });
}
