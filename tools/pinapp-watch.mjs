/**
 * Pinapp Watch — veille automatisée (cron GitHub Actions)
 *
 * Objectif: surveiller des signaux (releases, changelogs, sécurité) et
 * notifier Lauralie via une Issue GitHub quand c'est pertinent pour pinapp-site.
 *
 * IMPORTANT:
 * - Pas de post auto vers des réseaux sociaux.
 * - Aucune clé dans le code. Secrets via GitHub Actions.
 *
 * Secrets attendus:
 * - GITHUB_TOKEN (fourni par Actions automatiquement)
 * - ANTHROPIC_API_KEY (à ajouter dans Settings → Secrets and variables → Actions)
 */
import fs from 'fs';
import path from 'path';

const OWNER = process.env.GITHUB_REPOSITORY?.split('/')[0] || '';
const REPO = process.env.GITHUB_REPOSITORY?.split('/')[1] || '';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';

const root = path.resolve(process.cwd());
const stateDir = path.join(root, '.pinapp-watch');
const stateFile = path.join(stateDir, 'state.json');

function die(msg) {
  console.error(msg);
  process.exit(1);
}

if (!OWNER || !REPO) die('pinapp-watch: GITHUB_REPOSITORY manquant');
if (!GITHUB_TOKEN) die('pinapp-watch: GITHUB_TOKEN manquant');
if (!ANTHROPIC_API_KEY) die('pinapp-watch: ANTHROPIC_API_KEY manquant (secret Actions)');

function readState() {
  try {
    if (!fs.existsSync(stateFile)) return { seen: {} };
    return JSON.parse(fs.readFileSync(stateFile, 'utf8'));
  } catch {
    return { seen: {} };
  }
}

function writeState(state) {
  fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(stateFile, JSON.stringify(state, null, 2));
}

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

async function createIssue({ title, body, labels = ['watch'] }) {
  // Best-effort: create label if missing? (skip to avoid extra writes/permissions)
  const url = `https://api.github.com/repos/${OWNER}/${REPO}/issues`;
  return await ghJson(url, {
    method: 'POST',
    body: JSON.stringify({ title, body, labels }),
  });
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
      model: 'claude-3-5-sonnet-latest',
      max_tokens: 900,
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
  const text = (data?.content || [])
    .map((c) => (typeof c?.text === 'string' ? c.text : ''))
    .join('\n')
    .trim();
  return text;
}

async function listLatestReleases() {
  // On surveille les releases des dépendances “infrastructure dev” Pinapp.
  const repos = ['vitejs/vite', 'prettier/prettier', 'puppeteer/puppeteer'];
  const releases = [];
  for (const full of repos) {
    const url = `https://api.github.com/repos/${full}/releases?per_page=3`;
    const items = await ghJson(url);
    for (const r of items) {
      if (!r?.tag_name) continue;
      releases.push({
        source: full,
        tag: r.tag_name,
        name: r.name || r.tag_name,
        url: r.html_url,
        published_at: r.published_at || '',
        body: (r.body || '').slice(0, 5000),
        id: String(r.id || `${full}@${r.tag_name}`),
      });
    }
  }
  // plus récent d'abord
  releases.sort((a, b) => (b.published_at || '').localeCompare(a.published_at || ''));
  return releases;
}

function scoreGate(text) {
  // Claude renvoie une ligne "SCORE: N/10" -> on gate à 9+
  const m = text.match(/SCORE\s*:\s*(\d{1,2})\s*\/\s*10/i);
  if (!m) return { score: null };
  const score = Number(m[1]);
  return { score: Number.isFinite(score) ? score : null };
}

function todayKey() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

async function main() {
  const state = readState();
  const seen = state.seen || {};

  const releases = await listLatestReleases();
  const fresh = releases.filter((r) => !seen[r.id]);

  if (fresh.length === 0) {
    console.log('pinapp-watch: rien de nouveau (releases)');
    return;
  }

  const system =
    "Tu es l'assistant de veille de Pinapp Studio. Tu évalues si une nouveauté est pertinente pour le site vitrine pinapp-site (HTML/CSS/JS, Vite/Prettier, GitHub Actions). " +
    "Tu dois être strict: si ce n'est pas directement actionnable ou risqué, tu mets un score bas. " +
    'Tu produis un format court et actionnable.';

  for (const r of fresh.slice(0, 8)) {
    const prompt = [
      `Contexte: repo pinapp-site (site statique).`,
      `Nouveauté: ${r.source} — ${r.tag}`,
      `Lien: ${r.url}`,
      ``,
      `Extrait notes de release (peut être long):`,
      r.body || '(vide)',
      ``,
      `Ta réponse doit être EXACTEMENT au format:`,
      `SCORE: N/10`,
      `VERDICT: (une phrase)`,
      `IMPACT: (1-3 bullets max)`,
      `ACTION: (1-3 bullets max, concrètes dans un repo GitHub)`,
      `RISQUE: (0-2 bullets max)`,
      ``,
      `Règles: score 9/10 seulement si ça mérite une notification immédiate. Score 10 = sécurité critique ou breakage probable.`,
    ].join('\n');

    const analysis = await anthropicMessages({ system, user: prompt });
    const { score } = scoreGate(analysis);

    // Enregistrer comme vu (même si score bas) pour éviter spam
    seen[r.id] = { at: new Date().toISOString(), score: score ?? null };

    if ((score ?? 0) >= 9) {
      const title = `Veille Pinapp (${todayKey()}) — ${r.source} ${r.tag} (score ${score}/10)`;
      const body = [
        `**Source**: ${r.source}`,
        `**Version**: ${r.tag}`,
        `**Lien**: ${r.url}`,
        ``,
        `---`,
        analysis,
        ``,
        `---`,
        `Checklist rapide:`,
        `- [ ] Lire le changelog complet`,
        `- [ ] Si pertinent: créer une branche + PR`,
        `- [ ] Vérifier CI: \`npm run ci\``,
      ].join('\n');
      await createIssue({ title, body, labels: ['watch', 'maintenance'] });
      console.log('pinapp-watch: issue créée →', title);
    } else {
      console.log(`pinapp-watch: ${r.source} ${r.tag} score=${score ?? 'N/A'} (pas de notif)`);
    }
  }

  writeState({ seen });
}

main().catch((e) => {
  console.error(e?.stack || String(e));
  process.exit(1);
});
