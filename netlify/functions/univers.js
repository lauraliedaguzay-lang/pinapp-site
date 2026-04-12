// netlify/functions/univers.js
// Génération d'univers digital via Claude — clé API jamais en front-end

const MAX_LIEU = 240;
const MAX_EMOTION = 240;
const MAX_REFERENCE = 800;

function strField(v, max) {
  if (v == null) return '';
  return String(v).replace(/\0/g, '').trim().slice(0, max);
}

function sanitizeHex(c) {
  if (c == null || typeof c !== 'string') return '#0a0a12';
  const s = c.trim();
  if (/^#[0-9A-Fa-f]{3}$/.test(s) || /^#[0-9A-Fa-f]{6}$/.test(s)) return s;
  return '#0a0a12';
}

/** Ne garde que les champs attendus (évite pollution de prototype / clés inattendues). */
function pickUnivers(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new Error('invalid shape');
  }
  const nom = strField(raw.nom, 200);
  const p = raw.palette && typeof raw.palette === 'object' ? raw.palette : {};
  const palette = {
    fond: sanitizeHex(p.fond),
    accent1: sanitizeHex(p.accent1),
    accent2: sanitizeHex(p.accent2),
  };
  return {
    nom: nom || 'Univers Pinapp',
    palette,
    atmosphere: strField(raw.atmosphere, 900),
    signature: strField(raw.signature, 400),
    promesse: strField(raw.promesse, 220),
  };
}

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://pinapp.fr',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return {
      statusCode: 503,
      headers,
      body: JSON.stringify({ error: 'Service indisponible' }),
    };
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const lieu = strField(body.lieu, MAX_LIEU);
  const emotion = strField(body.emotion, MAX_EMOTION);
  const reference = strField(body.reference, MAX_REFERENCE);

  if (!lieu || !emotion) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing fields' }),
    };
  }

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 500,
        system: `Tu es Aurora, directrice artistique de Pinapp Studio.
Tu crées des identités digitales uniques — jamais des templates.

Tu reçois 3 éléments d'un visiteur :
→ Un lieu qui lui ressemble
→ Une émotion à transmettre
→ Une référence culturelle

Tu inventes UN univers digital cohérent.

Réponds UNIQUEMENT en JSON valide :

{
  "nom": "[3-4 mots poétiques — toujours inventé]",
  "palette": {
    "fond": "[hex]",
    "accent1": "[hex]",
    "accent2": "[hex]"
  },
  "atmosphere": "[2 phrases — ce que ressent le visiteur]",
  "signature": "[1 effet CSS/JS concret et réalisable]",
  "promesse": "[1 phrase · max 10 mots]"
}

Règles :
→ Nom toujours inventé
→ Couleurs cohérentes avec l'univers
→ Tout en français
→ JSON valide uniquement`,
        messages: [
          {
            role: 'user',
            content: `Lieu : ${lieu}\nÉmotion : ${emotion}\nRéférence : ${reference || 'aucune'}`,
          },
        ],
      }),
    });

    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    const raw = data.content?.[0]?.text || '{}';
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    const univers = pickUnivers(parsed);

    /* Objet plat — aligné sur assets/js/univers.js et univers-questionnaire.js */
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(univers),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};
