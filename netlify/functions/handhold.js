/**
 * PINAPP STUDIO — Netlify Function : handhold (main dans la main)
 *
 * Objectif : fournir des liens de validation 1‑clic signés pour Telegram/email,
 * afin que Lauralie n’ait qu’à confirmer des actions proposées (Approve / Ignore).
 *
 * Cette fonction ne déclenche aucune action business par elle-même.
 * Elle génère des liens vers /.netlify/functions/approve avec :
 * - id   : identifiant du “dossier” (leadId, clientId…)
 * - ctx  : contexte d’étape (ex: "depot:check-links", "offer:send-quote-draft")
 * - exp  : expiration (epoch ms) pour limiter la fenêtre de clic
 * - token: HMAC-SHA256 du tuple (id|action|ctx|exp)
 *
 * Usage (POST JSON):
 *   POST /.netlify/functions/handhold
 *   { "id":"LEAD-123", "ctx":"depot:check-links", "expiresInMinutes": 4320 }
 *
 * Réponse JSON:
 *   { approveUrl, declineUrl, expiresAt }
 *
 * Sécurité:
 * - nécessite APPROVE_SECRET (même secret que approve.js)
 * - CORS permissif “site-only” (Origin pinapp.fr + GitHub Pages preview)
 */
exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { ok: false, error: 'Method not allowed' });
  }

  const secret = process.env.APPROVE_SECRET;
  if (!secret) return json(500, { ok: false, error: 'Missing APPROVE_SECRET' });

  let body = {};
  try {
    body = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { ok: false, error: 'Invalid JSON' });
  }

  const id = (body.id || '').toString().trim();
  const ctx = (body.ctx || '').toString().trim();
  const minutes = clampInt(body.expiresInMinutes, 10, 60 * 24 * 30); // 10 min → 30 jours
  if (!id) return json(400, { ok: false, error: 'Missing id' });

  const expMs = Date.now() + minutes * 60 * 1000;
  const exp = String(expMs);

  const approveToken = await signTokenV2_({ id, action: 'approve', ctx, expMs }, secret);
  const declineToken = await signTokenV2_({ id, action: 'decline', ctx, expMs }, secret);

  const origin = inferOrigin_(event) || 'https://pinapp.fr';
  const base = origin.replace(/\/$/, '');
  const approveUrl = `${base}/.netlify/functions/approve?id=${encodeURIComponent(id)}&action=approve&ctx=${encodeURIComponent(
    ctx,
  )}&exp=${encodeURIComponent(exp)}&token=${encodeURIComponent(approveToken)}`;
  const declineUrl = `${base}/.netlify/functions/approve?id=${encodeURIComponent(id)}&action=decline&ctx=${encodeURIComponent(
    ctx,
  )}&exp=${encodeURIComponent(exp)}&token=${encodeURIComponent(declineToken)}`;

  return json(200, {
    ok: true,
    id,
    ctx,
    expiresAt: new Date(expMs).toISOString(),
    approveUrl,
    declineUrl,
  });
};

function clampInt(v, min, max) {
  const n = parseInt(String(v == null ? '' : v), 10);
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...corsHeaders_(body && body.ok),
    },
    body: JSON.stringify(body, null, 2),
  };
}

function corsHeaders_() {
  // Allow same-site and GitHub Pages preview usage; keep it simple.
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };
}

function inferOrigin_(event) {
  const hdr = event.headers || {};
  return hdr.origin || hdr.Origin || '';
}

async function signTokenV2_({ id, action, ctx, expMs }, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msg = [id, action || '', ctx || '', expMs ? String(expMs) : ''].join('|');
  const msgData = encoder.encode(msg);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
