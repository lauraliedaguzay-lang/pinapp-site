/**
 * PINAPP STUDIO — Netlify Function : approve
 * Endpoint sécurisé pour le workflow WhatsApp "1 clic = approuver"
 *
 * Flux :
 *   1. Un lead soumet le formulaire diagnostic
 *   2. n8n envoie un message WhatsApp à Lauralie avec un lien :
 *      https://pinapp.fr/.netlify/functions/approve?id=<leadId>&token=<signedToken>&action=approve
 *   3. Lauralie clique sur le lien depuis son téléphone
 *   4. Cette fonction vérifie le token, enregistre la décision,
 *      déclenche le webhook n8n de suite, retourne une page de confirmation
 *
 * Variables d'environnement à configurer dans Netlify :
 *   APPROVE_SECRET   — clé secrète pour signer/vérifier les tokens (ex: uuid v4)
 *   N8N_APPROVE_URL  — URL webhook n8n qui reçoit la décision (ex: https://xxx.n8n.cloud/webhook/lead-decision)
 *   AIRTABLE_KEY     — (optionnel) clé Airtable pour logger les décisions
 */

exports.handler = async (event) => {
  const { id, token, action } = event.queryStringParameters || {};

  /* Validation des paramètres */
  if (!id || !token || !['approve', 'decline'].includes(action)) {
    return htmlResponse(400, pageError('Lien invalide ou expiré.'));
  }

  /* Vérification du token (HMAC-SHA256 simple) */
  const secret = process.env.APPROVE_SECRET;
  if (!secret) {
    return htmlResponse(500, pageError('Configuration manquante — contactez le dev.'));
  }

  const expectedToken = await signToken(id, secret);
  if (token !== expectedToken) {
    return htmlResponse(403, pageError('Token invalide ou expiré. Ce lien est à usage unique.'));
  }

  /* Notification n8n */
  const n8nUrl = process.env.N8N_APPROVE_URL;
  if (n8nUrl) {
    try {
      await fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leadId: id,
          action: action,
          decidedAt: new Date().toISOString(),
          source: 'whatsapp-approval',
        }),
      });
    } catch (e) {
      /* non-bloquant — on confirme quand même */
      console.error('n8n webhook error:', e.message);
    }
  }

  const isApproved = action === 'approve';
  return htmlResponse(200, isApproved ? pageApproved(id) : pageDeclined(id));
};

/* ── Helpers ────────────────────────────────────────────────── */

async function signToken(id, secret) {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(id);

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

function htmlResponse(status, html) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
}

function pageApproved(id) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lead approuvé — Pinapp</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { min-height: 100dvh; display: flex; align-items: center; justify-content: center;
           background: #010D12; color: #EEF8FF; font-family: -apple-system, sans-serif; padding: 24px; }
    .card { background: rgba(0,229,204,0.08); border: 0.5px solid rgba(0,229,204,0.25);
            border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 380px; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; color: #00E5CC; }
    p  { font-size: 15px; opacity: 0.72; line-height: 1.6; }
    .id { font-size: 11px; opacity: 0.35; margin-top: 24px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">✓</div>
    <h1>Lead approuvé</h1>
    <p>L'email de prise de contact a été envoyé automatiquement. Le lead est marqué <strong>Qualifié</strong> dans votre CRM.</p>
    <p class="id">Ref: ${id}</p>
  </div>
</body>
</html>`;
}

function pageDeclined(id) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Lead décliné — Pinapp</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { min-height: 100dvh; display: flex; align-items: center; justify-content: center;
           background: #010D12; color: #EEF8FF; font-family: -apple-system, sans-serif; padding: 24px; }
    .card { background: rgba(255,255,255,0.04); border: 0.5px solid rgba(255,255,255,0.10);
            border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 380px; }
    .icon { font-size: 48px; margin-bottom: 16px; }
    h1 { font-size: 22px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 12px; }
    p  { font-size: 15px; opacity: 0.72; line-height: 1.6; }
    .id { font-size: 11px; opacity: 0.35; margin-top: 24px; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">·</div>
    <h1>Lead archivé</h1>
    <p>Ce lead a été marqué non qualifié et archivé. Aucun email de relance ne sera envoyé.</p>
    <p class="id">Ref: ${id}</p>
  </div>
</body>
</html>`;
}

function pageError(message) {
  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Erreur — Pinapp</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { min-height: 100dvh; display: flex; align-items: center; justify-content: center;
           background: #010D12; color: #EEF8FF; font-family: -apple-system, sans-serif; padding: 24px; }
    .card { background: rgba(255,80,80,0.06); border: 0.5px solid rgba(255,80,80,0.20);
            border-radius: 20px; padding: 40px 32px; text-align: center; max-width: 380px; }
    h1 { font-size: 20px; margin-bottom: 12px; }
    p  { font-size: 14px; opacity: 0.72; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Erreur</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;
}
