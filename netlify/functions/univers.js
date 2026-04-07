// netlify/functions/univers.js
// Génération d'univers digital via Claude — clé API jamais en front-end

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': 'https://pinapp.fr',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
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

  const { lieu, emotion, reference } = body;
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
    const univers = JSON.parse(clean);

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ univers }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur' }),
    };
  }
};
