/**
 * PINAPP STUDIO — Netlify Function : health
 * Sanity-check de configuration (env vars) + test reachability webhooks.
 *
 * BUT :
 * - Te permettre de vérifier en 1 clic (sur téléphone) que l’infra est prête.
 * - Ne révèle jamais les secrets.
 *
 * Usage :
 *   GET /.netlify/functions/health
 *   GET /.netlify/functions/health?probe=1   (tente un HEAD/POST vers les URLs configurées)
 */

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
    body: JSON.stringify(body, null, 2),
  };
}

function redacted(v) {
  if (!v) return '';
  const s = String(v);
  if (s.length <= 6) return '***';
  return s.slice(0, 3) + '…' + s.slice(-2);
}

async function probeUrl(url, opts) {
  const start = Date.now();
  try {
    const res = await fetch(url, opts);
    const ms = Date.now() - start;
    return { ok: res.ok, status: res.status, ms };
  } catch (e) {
    const ms = Date.now() - start;
    return { ok: false, status: 0, ms, error: String(e && e.message ? e.message : e) };
  }
}

exports.handler = async (event) => {
  const probe = (event.queryStringParameters || {}).probe === '1';

  const env = {
    APPROVE_SECRET: process.env.APPROVE_SECRET || '',
    N8N_APPROVE_URL: process.env.N8N_APPROVE_URL || '',
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
    PINAPP_N8N_BASE: process.env.PINAPP_N8N_BASE || '',
  };

  const checks = {
    approve: {
      required: ['APPROVE_SECRET'],
      optional: ['N8N_APPROVE_URL'],
    },
    aurora: {
      required: ['ANTHROPIC_API_KEY'],
    },
    univers: {
      required: ['ANTHROPIC_API_KEY'],
    },
    webhooks: {
      optional: ['PINAPP_N8N_BASE'],
    },
  };

  const missing = [];
  Object.keys(checks).forEach((k) => {
    const rule = checks[k];
    (rule.required || []).forEach((name) => {
      if (!env[name]) missing.push(name);
    });
  });

  const summary = {
    ok: missing.length === 0,
    missing: Array.from(new Set(missing)),
    present: Object.fromEntries(
      Object.keys(env).map((k) => [k, env[k] ? true : false]),
    ),
    redacted: {
      APPROVE_SECRET: env.APPROVE_SECRET ? redacted(env.APPROVE_SECRET) : '',
      N8N_APPROVE_URL: env.N8N_APPROVE_URL ? env.N8N_APPROVE_URL : '',
      PINAPP_N8N_BASE: env.PINAPP_N8N_BASE ? env.PINAPP_N8N_BASE : '',
    },
    notes: [
      'Ce endpoint ne révèle jamais les secrets.',
      'probe=1 tente de joindre les URLs configurées (utile après setup n8n).',
    ],
  };

  if (!probe) {
    return json(summary.ok ? 200 : 500, summary);
  }

  const probes = {};

  // Probe n8n approve URL (POST JSON)
  if (env.N8N_APPROVE_URL && /^https:\/\//.test(env.N8N_APPROVE_URL)) {
    probes.N8N_APPROVE_URL = await probeUrl(env.N8N_APPROVE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source: 'pinapp-health', ts: new Date().toISOString() }),
    });
  }

  // Probe n8n base (HEAD)
  if (env.PINAPP_N8N_BASE && /^https:\/\//.test(env.PINAPP_N8N_BASE)) {
    probes.PINAPP_N8N_BASE = await probeUrl(env.PINAPP_N8N_BASE, { method: 'HEAD' });
  }

  return json(summary.ok ? 200 : 500, Object.assign({}, summary, { probes }));
};

