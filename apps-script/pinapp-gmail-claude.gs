/**
 * Pinapp Studio — Gmail × Claude (mode H24 assisté)
 *
 * Principe (non négociable) :
 *   - Claude analyse les fils étiquetés ; sortie structurée actions + brouillon client.
 *   - Aucun envoi automatique au client : uniquement GmailApp.createDraft (vous validez puis Envoyez).
 *
 * Installation : voir docs/claude-consultation/10-APPS-SCRIPT-H24-SETUP.md
 *
 * Propriétés du script (Éditeur > Projet > Paramètres du projet > Propriétés du script) :
 *   ANTHROPIC_API_KEY   — clé API Anthropic (obligatoire)
 *   CLAUDE_MODEL        — optionnel, défaut : claude-sonnet-4-20250514
 *   MAX_THREADS         — optionnel, défaut : 5 (par exécution)
 *   LABEL_IN            — optionnel, défaut : Pinapp-À-traiter
 *   LABEL_OUT           — optionnel, défaut : Pinapp-Traité-Claude
 */

var PINAPP_DEFAULTS = {
  model: 'claude-sonnet-4-20250514',
  maxThreads: 5,
  labelIn: 'Pinapp-À-traiter',
  labelOut: 'Pinapp-Traité-Claude',
  anthropicVersion: '2023-06-01',
};

function getProp_(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return v != null && String(v).trim() !== '' ? String(v).trim() : fallback;
}

function pinappGetLabels_() {
  var nameIn = getProp_('LABEL_IN', PINAPP_DEFAULTS.labelIn);
  var nameOut = getProp_('LABEL_OUT', PINAPP_DEFAULTS.labelOut);
  var inLabel = GmailApp.getUserLabelByName(nameIn);
  var outLabel = GmailApp.getUserLabelByName(nameOut);
  if (!inLabel) throw new Error('Label Gmail manquant : créez l’étiquette « ' + nameIn + ' » et appliquez-la aux mails à traiter.');
  if (!outLabel) outLabel = GmailApp.createLabel(nameOut);
  return { inLabel: inLabel, outLabel: outLabel, nameIn: nameIn, nameOut: nameOut };
}

/**
 * Point d’entrée pour déclencheur horaire (ex. toutes les 5 min) — « disponible H24 » côté exécution.
 */
function runPinappClaudePass() {
  var apiKey = getProp_('ANTHROPIC_API_KEY', '');
  if (!apiKey) {
    console.error('Pinapp Claude : renseignez ANTHROPIC_API_KEY dans les propriétés du script.');
    return;
  }

  var labels = pinappGetLabels_();
  var maxN = parseInt(getProp_('MAX_THREADS', String(PINAPP_DEFAULTS.maxThreads)), 10) || PINAPP_DEFAULTS.maxThreads;
  var model = getProp_('CLAUDE_MODEL', PINAPP_DEFAULTS.model);

  // Fils : à traiter, pas encore marqués comme passés Claude (guillemets = noms avec espaces / accents)
  var query =
    'label:"' + labels.nameIn + '" -label:"' + labels.nameOut + '" newer_than:7d';
  var threads = GmailApp.search(query, 0, maxN);

  if (!threads || threads.length === 0) return;

  for (var i = 0; i < threads.length; i++) {
    try {
      pinappProcessOneThread_(threads[i], apiKey, model, labels);
    } catch (err) {
      console.error('Pinapp Claude fil ' + threads[i].getId() + ' : ' + err);
    }
  }
}

function pinappProcessOneThread_(thread, apiKey, model, labels) {
  var messages = thread.getMessages();
  if (!messages.length) return;

  var last = messages[messages.length - 1];
  var from = last.getFrom();
  var subj = last.getSubject();
  var body = last.getPlainBody();
  if (body.length > 48000) body = body.substring(0, 48000) + '\n[…tronqué]';

  // Ne pas retraiter si le dernier message est sortant (vous)
  var myEmail = Session.getActiveUser().getEmail().toLowerCase();
  if (last.getFrom().toLowerCase().indexOf(myEmail) !== -1) {
    thread.addLabel(labels.outLabel);
    return;
  }

  var system = [
    'Tu es l’assistant de rédaction et d’analyse pour Pinapp Studio (ingénierie web, automatisation, IA pour TPE).',
    'Tu écris en français, ton professionnel, chaleureux, jamais survendeur.',
    'Tu ne promets jamais de prix ou de délais précis sans données ; tu proposes des pistes et un plan d’action.',
    'Sortie OBLIGATOIRE avec les marqueurs exacts suivants (rien avant le premier marqueur) :',
    '',
    '===ACTIONS_LAURALIE===',
    '1. …',
    '2. …',
    '===FIN_ACTIONS===',
    '',
    '===BROUILLON_CLIENT===',
    '(texte prêt à envoyer au client, ton Pinapp)',
    '===FIN_BROUILLON===',
    '',
    'Règle : le brouillon client doit être autonome ; les actions sont pour Lauralie uniquement.',
  ].join('\n');

  var userMsg = [
    'Analyse ce fil (dernier message reçu). Propose les actions internes et un brouillon de réponse email.',
    '',
    'De : ' + from,
    'Sujet : ' + subj,
    '',
    'Corps :',
    body,
  ].join('\n');

  var text = pinappCallAnthropic_(apiKey, model, system, userMsg);
  var parsed = pinappParseClaudeBlocks_(text);

  var draftBody = [
    '=== Repères internes — à retirer avant envoi client ===',
    '',
    parsed.actions || '(aucune section ACTIONS parsée — voir brut ci-dessous)',
    '',
    '=== Fin repères internes ===',
    '',
    parsed.client || text,
  ].join('\n');

  var replySubject = subj.indexOf('Re:') === 0 ? subj : 'Re: ' + subj;
  GmailApp.createDraft(last.getFrom(), replySubject, draftBody, { replyTo: last });

  thread.addLabel(labels.outLabel);
}

function pinappCallAnthropic_(apiKey, model, system, userText) {
  var url = 'https://api.anthropic.com/v1/messages';
  var payload = {
    model: model,
    max_tokens: 4096,
    system: system,
    messages: [{ role: 'user', content: userText }],
  };

  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': PINAPP_DEFAULTS.anthropicVersion,
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  var code = res.getResponseCode();
  var raw = res.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error('API Anthropic HTTP ' + code + ' : ' + raw.substring(0, 500));
  }

  var json = JSON.parse(raw);
  if (!json.content || !json.content.length) throw new Error('Réponse Anthropic vide');
  var block = json.content[0];
  if (block.type !== 'text' || !block.text) throw new Error('Format réponse Anthropic inattendu');
  return block.text;
}

function pinappParseClaudeBlocks_(text) {
  var actions = '';
  var client = '';
  var a0 = text.indexOf('===ACTIONS_LAURALIE===');
  var a1 = text.indexOf('===FIN_ACTIONS===');
  var c0 = text.indexOf('===BROUILLON_CLIENT===');
  var c1 = text.indexOf('===FIN_BROUILLON===');
  if (a0 !== -1 && a1 !== -1 && a1 > a0) {
    actions = text.substring(a0 + '===ACTIONS_LAURALIE==='.length, a1).trim();
  }
  if (c0 !== -1 && c1 !== -1 && c1 > c0) {
    client = text.substring(c0 + '===BROUILLON_CLIENT==='.length, c1).trim();
  }
  return { actions: actions, client: client };
}

/** À lancer une fois depuis l’éditeur Apps Script : déclencheur toutes les 5 minutes. */
function pinappInstallTriggerEvery5Minutes() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction && t.getHandlerFunction() === 'runPinappClaudePass') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('runPinappClaudePass').timeBased().everyMinutes(5).create();
}

/** Supprime les déclencheurs installés par pinappInstallTriggerEvery5Minutes. */
function pinappRemoveTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction && t.getHandlerFunction() === 'runPinappClaudePass') {
      ScriptApp.deleteTrigger(t);
    }
  });
}

/** Test manuel sans attendre le trigger. */
function pinappManualRun() {
  runPinappClaudePass();
}
