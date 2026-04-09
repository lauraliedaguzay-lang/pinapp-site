/**
 * Claude Driver — assistant “pilotage” via GitHub Issues (avec accord humain)
 *
 * Mode d’emploi:
 * - Ouvrir une Issue via le template "Claude Driver — pilotage".
 * - Le workflow GitHub Actions appelle ce script.
 * - Le script poste un commentaire avec:
 *   - ACTIONS (quoi faire maintenant)
 *   - RÉPONSES PROPOSÉES (à copier/coller)
 *   - PROMPTS CURSOR (prêts à envoyer)
 *
 * GARDE-FOUS:
 * - Aucune action externe (email, réseaux sociaux, paiement) n’est exécutée.
 * - Pas de secret dans le repo.
 */
import process from 'node:process';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const ANTHROPIC_API_KEY = process.env.PINAPP_CLAUDE_DRIVER_ANTHROPIC_API_KEY || '';
const MODEL = process.env.PINAPP_CLAUDE_DRIVER_MODEL || 'claude-3-5-sonnet-latest';
const REPO_FULL = process.env.GITHUB_REPOSITORY || '';
const ISSUE_NUMBER = Number(process.env.ISSUE_NUMBER || '');
const ISSUE_TITLE = process.env.ISSUE_TITLE || '';
const ISSUE_BODY = process.env.ISSUE_BODY || '';

function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (!GITHUB_TOKEN) die('claude-driver: GITHUB_TOKEN manquant');
if (!ANTHROPIC_API_KEY) die('claude-driver: PINAPP_CLAUDE_DRIVER_ANTHROPIC_API_KEY manquant');
if (!REPO_FULL) die('claude-driver: GITHUB_REPOSITORY manquant');
if (!Number.isFinite(ISSUE_NUMBER) || ISSUE_NUMBER <= 0)
  die('claude-driver: ISSUE_NUMBER invalide');

const [OWNER, REPO] = REPO_FULL.split('/');
if (!OWNER || !REPO) die('claude-driver: GITHUB_REPOSITORY invalide');

async function ghJson(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(options.headers || {}),
    },
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`GitHub API ${res.status} ${res.statusText} — ${url}\n${t}`);
  }
  return await res.json();
}

async function createIssueComment(body) {
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues/${ISSUE_NUMBER}/comments`;
  return await ghJson(url, { method: 'POST', body: JSON.stringify({ body }) });
}

async function anthropicMessages({ system, user }) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1400,
      temperature: 0.2,
      system,
      messages: [{ role: 'user', content: user }],
    }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Anthropic API ${res.status} ${res.statusText}\n${t}`);
  }
  const data = await res.json();
  return (data?.content || [])
    .map((c) => (typeof c?.text === 'string' ? c.text : ''))
    .join('\n')
    .trim();
}

function extractSection(label) {
  const re = new RegExp(`^###\\s*${label}\\s*$([\\s\\S]*?)(^###\\s*|$)`, 'm');
  const m = ISSUE_BODY.match(re);
  return (m?.[1] || '').trim();
}

const context = extractSection('Contexte');
const request = extractSection('Demande');
const constraints = extractSection('Contraintes');
const target = extractSection('Cible');
const inputText = extractSection('Texte / Email / Message à traiter');

const system = [
  "Tu es 'Claude Driver' pour Pinapp Studio. Tu aides Lauralie à décider et à agir sans friction.",
  'Règles strictes:',
  '- Tu ne fais JAMAIS d’envoi automatique. Tu proposes des textes à copier/coller.',
  '- Tu proposes des prompts Cursor prêts à exécuter (courts, actionnables).',
  '- Tu es premium, humble, clair. Zéro promesse magique.',
  '- Tu sépares: ACTIONS / RÉPONSES / PROMPTS CURSOR.',
  '- Tu poses 0 question si tu peux faire sans; sinon une mini-liste "À confirmer".',
].join('\n');

const user = [
  `Issue: ${ISSUE_TITLE}`,
  '',
  'Données fournies (peut contenir du texte client):',
  `- Contexte: ${context || '(vide)'}`,
  `- Demande: ${request || '(vide)'}`,
  `- Contraintes: ${constraints || '(vide)'}`,
  `- Cible: ${target || '(vide)'}`,
  '',
  'Texte à traiter:',
  inputText || '(aucun texte fourni)',
  '',
  'Format de sortie OBLIGATOIRE:',
  'ACTIONS (5 max):',
  '- ...',
  '',
  'RÉPONSES PROPOSÉES:',
  '- Option A (courte):',
  '  ...',
  '- Option B (plus complète):',
  '  ...',
  '',
  'PROMPTS CURSOR (copier-coller):',
  '- Prompt 1:',
  '  ```',
  '  ...',
  '  ```',
  '- Prompt 2:',
  '  ```',
  '  ...',
  '  ```',
  '',
  'À CONFIRMER (si nécessaire, 3 max):',
  '- ...',
].join('\n');

const analysis = await anthropicMessages({ system, user });

const comment = [
  '## Claude Driver — propositions (validation humaine requise)',
  '',
  '> Rien n’est envoyé ni exécuté automatiquement. Copie/colle ce que tu valides.',
  '',
  analysis,
  '',
  '---',
  '### Rappel “accord”',
  '- Si une réponse engage prix/délais/périmètre: valider avant envoi.',
  '- Si c’est un accusé neutre: OK à envoyer après relecture.',
].join('\n');

await createIssueComment(comment);
