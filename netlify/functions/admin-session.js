/**
 * Pinapp — session console admin (Netlify Function)
 *
 * Variables Netlify (recommandé en prod) :
 *   PINAPP_ADMIN_PASSWORD         — mot de passe console (jamais dans le JS statique)
 *   PINAPP_ADMIN_SESSION_SECRET   — optionnel, clé HMAC des jetons (défaut : même valeur que le mot de passe,
 *                                   ou APPROVE_SECRET si défini)
 *
 * POST { "password": "…" }     → 200 { ok, token } | 401 wrong_password | 503 not_configured
 * POST { "action":"verify", "token": "…" } → 200 { ok:true } | 401
 * GET  Authorization: Bearer … → idem verify
 */

const { timingSafeEqual, randomBytes } = require('crypto');

const TOKEN_TTL_SEC = 8 * 3600;

function corsOrigin(event) {
  const o = String(event.headers.origin || event.headers.Origin || '').trim();
  if (!o) return null;
  if (o === 'https://pinapp.fr' || o === 'https://www.pinapp.fr') return o;
  if (/^https:\/\/[a-z0-9-]+\.netlify\.app$/i.test(o)) return o;
  if (/^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(o)) return o;
  return null;
}

function baseHeaders(origin) {
  const h = { 'Content-Type': 'application/json; charset=utf-8' };
  if (origin) {
    h['Access-Control-Allow-Origin'] = origin;
    h['Access-Control-Allow-Headers'] = 'Authorization, Content-Type';
    h['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
  }
  return h;
}

function jsonResponse(statusCode, origin, body) {
  return { statusCode, headers: baseHeaders(origin), body: JSON.stringify(body) };
}

function timingSafePasswordEqual(input, expected) {
  const a = Buffer.from(String(input), 'utf8');
  const b = Buffer.from(String(expected), 'utf8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function safeHexEqual(received, expected) {
  if (
    typeof received !== 'string' ||
    typeof expected !== 'string' ||
    received.length !== expected.length
  ) {
    return false;
  }
  try {
    const a = Buffer.from(received, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length || a.length === 0) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

async function hmacHex(secret, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return Buffer.from(sig).toString('hex');
}

function sessionSecret() {
  return (
    process.env.PINAPP_ADMIN_SESSION_SECRET ||
    process.env.PINAPP_ADMIN_PASSWORD ||
    process.env.APPROVE_SECRET ||
    ''
  );
}

async function createToken(secret) {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    exp: now + TOKEN_TTL_SEC,
    iat: now,
    jti: randomBytes(9).toString('base64url'),
  };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = Buffer.from(payloadStr, 'utf8').toString('base64url');
  const sig = await hmacHex(secret, payloadB64);
  return `${payloadB64}.${sig}`;
}

async function verifyToken(token, secret) {
  if (!secret || typeof token !== 'string') return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payloadB64 = token.slice(0, dot);
  const sigHex = token.slice(dot + 1);
  if (!payloadB64 || sigHex.length !== 64) return false;
  const expectedSig = await hmacHex(secret, payloadB64);
  if (!safeHexEqual(sigHex, expectedSig)) return false;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));
  } catch {
    return false;
  }
  if (!payload || typeof payload.exp !== 'number') return false;
  if (Math.floor(Date.now() / 1000) > payload.exp) return false;
  return true;
}

exports.handler = async (event) => {
  const origin = corsOrigin(event);
  const headers = baseHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  const adminPassword = process.env.PINAPP_ADMIN_PASSWORD;
  const secret = sessionSecret();

  if (event.httpMethod === 'GET') {
    const auth = event.headers.authorization || event.headers.Authorization || '';
    const m = /^Bearer\s+(\S+)/i.exec(auth);
    if (!m || !secret) {
      return jsonResponse(401, origin, { error: 'unauthorized' });
    }
    const ok = await verifyToken(m[1], secret);
    return ok
      ? jsonResponse(200, origin, { ok: true })
      : jsonResponse(401, origin, { error: 'invalid_token' });
  }

  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, origin, { error: 'method_not_allowed' });
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return jsonResponse(400, origin, { error: 'invalid_json' });
  }

  if (body && body.action === 'verify' && typeof body.token === 'string') {
    if (!secret) {
      return jsonResponse(503, origin, {
        error: 'not_configured',
        message: 'Secret de session absent (PINAPP_ADMIN_SESSION_SECRET ou PINAPP_ADMIN_PASSWORD).',
      });
    }
    const ok = await verifyToken(body.token.trim(), secret);
    return ok
      ? jsonResponse(200, origin, { ok: true })
      : jsonResponse(401, origin, { error: 'invalid_token' });
  }

  if (!adminPassword) {
    return jsonResponse(503, origin, {
      error: 'not_configured',
      message:
        'Définissez PINAPP_ADMIN_PASSWORD dans les variables d’environnement Netlify. En local sans Netlify, le mot de passe de secours dans admin-dashboard.js reste utilisable.',
    });
  }

  if (typeof body.password !== 'string') {
    return jsonResponse(400, origin, { error: 'missing_password' });
  }

  if (!secret) {
    return jsonResponse(500, origin, { error: 'server_misconfigured' });
  }

  if (!timingSafePasswordEqual(body.password, adminPassword)) {
    return jsonResponse(401, origin, { error: 'wrong_password' });
  }

  const token = await createToken(secret);
  return jsonResponse(200, origin, { ok: true, token });
};
