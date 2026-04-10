// netlify/functions/aurora.js
// Analyse d'activité via Claude — clé API jamais en front-end

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://pinapp.fr',
    'Access-Control-Allow-Headers': 'Content-Type',
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

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid JSON' }),
    };
  }

  const { activite } = body;
  if (!activite || activite.length > 300) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid input' }),
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
        max_tokens: 400,
        system: `Tu es Aurora, l'IA de Pinapp Studio.
Pinapp automatise les tâches répétitives des TPE et indépendants français.

Analyse l'activité décrite.
Réponds EXACTEMENT dans ce format :

"[Prénom si mentionné sinon rien], je vois 3 automatisations immédiates :

① [Automatisation 1 — concrète — courte]
② [Automatisation 2 — concrète — courte]
③ [Automatisation 3 — concrète — courte]

Estimation : [X]h récupérées par mois."

Règles :
→ Maximum 80 mots
→ Automatisations très concrètes au secteur
→ Jamais de jargon technique
→ Toujours en français`,
        messages: [{ role: 'user', content: activite.trim() }],
      }),
    });

    if (!resp.ok) throw new Error('API error');
    const data = await resp.json();
    const text = data.content?.[0]?.text || '';

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ result: text }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Service temporairement indisponible' }),
    };
  }
};
