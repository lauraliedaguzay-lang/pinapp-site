/**
 * Post-traitement de l’artefact _site/ : webhooks n8n + flags + ID Tally diagnostic.
 * Variables (fichier .env / pinapp-automation.env / secrets CI) :
 *   PINAPP_N8N_BASE_URL   — ex. https://lauralie.n8n.cloud (prioritaire)
 *   PINAPP_N8N_HOST       — ex. lauralie.n8n.cloud (https:// ajouté)
 *   PINAPP_TALLY_DIAGNOSTIC_DEFAULT — ID embed Tally (page /diagnostic/)
 *   PINAPP_DISABLE_AUTOMATION_FEATURES — si "1", force les flags à false
 *
 * Ne modifie que les fichiers sous siteRoot (copie _site), pas le dépôt source.
 *
 * Vidéos / photos / démos : voir GUIDE-CONTENU.md à la racine du dépôt (hors périmètre de ce script).
 */
import fs from 'fs';
import path from 'path';

const WEBHOOK_FLAGS = [
  'diagnosticWebhook',
  'onboardingWebhook',
  'leadWebhook',
  'auroraAnalyseIA',
  'auroraUniversIA',
  'whatsappNotifs',
  'diagnosticClaudePrep',
];

function normalizeBase(raw) {
  if (raw == null || typeof raw !== 'string') return '';
  let s = raw.trim();
  if (!s) return '';
  s = s.replace(/\/+$/, '');
  if (!/^https?:\/\//i.test(s)) s = 'https://' + s;
  return s;
}

export function injectAutomationConfig(siteRoot) {
  const out = { configUrl: false, tally: false, flags: false };
  const cfgPath = path.join(siteRoot, 'assets/js/config.js');
  if (!fs.existsSync(cfgPath)) return out;

  let cfg = fs.readFileSync(cfgPath, 'utf8');
  const base = normalizeBase(process.env.PINAPP_N8N_BASE_URL || process.env.PINAPP_N8N_HOST);

  /* Ne toucher qu’aux URL de webhooks (pas aux commentaires qui citent [TON-N8N]). */
  if (base && !/\[TON-N8N\]/.test(base)) {
    const next = cfg.replace(
      /'https:\/\/\[TON-N8N\](\/webhook\/[^']+)'/g,
      (_, path) => "'" + base + path + "'",
    );
    if (next !== cfg) {
      cfg = next;
      out.configUrl = true;
    }
  }

  if (process.env.PINAPP_DISABLE_AUTOMATION_FEATURES === '1') {
    for (const name of WEBHOOK_FLAGS) {
      const n = cfg.replace(new RegExp(`(${name}):\\s*true`, 'g'), '$1: false');
      if (n !== cfg) {
        cfg = n;
        out.flags = true;
      }
    }
  } else if (out.configUrl) {
    for (const name of WEBHOOK_FLAGS) {
      const n = cfg.replace(new RegExp(`(${name}):\\s*false`, 'g'), '$1: true');
      if (n !== cfg) {
        cfg = n;
        out.flags = true;
      }
    }
  }

  if (out.configUrl || out.flags) {
    fs.writeFileSync(cfgPath, cfg, 'utf8');
  }

  const tallyPath = path.join(siteRoot, 'assets/js/diagnostic-tally.ids.js');
  const tid = (process.env.PINAPP_TALLY_DIAGNOSTIC_DEFAULT || '').trim();
  if (tid && fs.existsSync(tallyPath)) {
    let t = fs.readFileSync(tallyPath, 'utf8');
    const esc = tid.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const replaced = t.replace(/default:\s*'[^']*'/, `default: '${esc}'`);
    if (replaced !== t) {
      fs.writeFileSync(tallyPath, replaced, 'utf8');
      out.tally = true;
    }
  }

  return out;
}
