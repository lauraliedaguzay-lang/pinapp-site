/**
 * Pinapp — Mobile guide (Gmail notif + suggestions Claude)
 *
 * Objectif : sur téléphone, recevoir des rappels actionnables + un lien vers le fil,
 * pour simplement « ouvrir → approuver → copier-coller si besoin → envoyer ».
 *
 * IMPORTANT :
 * - Ne JAMAIS envoyer automatiquement de réponse client générée par Claude.
 * - Les notifications sont envoyées à CONFIG.MON_EMAIL (votre email), pour déclencher les push Gmail.
 *
 * Propriétés du script (Script Properties) :
 * - MON_EMAIL : email qui reçoit les notifications (ex: lauralie.daguzay@pinapp.fr)
 * - PINAPP_REMIND_LABEL : label Gmail à surveiller pour les rappels (défaut: Pinapp-À-traiter)
 * - PINAPP_REMIND_MIN_AGE_MIN : âge minimum du fil en minutes avant rappel (défaut: 30)
 * - PINAPP_REMIND_MAX : nb max de notifs par passage (défaut: 5)
 * - PINAPP_REMIND_MUTE_LABEL : label à mettre pour éviter spam (défaut: Pinapp-Notifié)
 */

var PINAPP_MOBILE_DEFAULTS = {
  remindLabel: 'Pinapp-À-traiter',
  muteLabel: 'Pinapp-Notifié',
  minAgeMin: 30,
  maxReminds: 5,
};

function pinappGetProp_(key, fallback) {
  var v = PropertiesService.getScriptProperties().getProperty(key);
  return v != null && String(v).trim() !== '' ? String(v).trim() : fallback;
}

function pinappGetOrCreateLabel_(name) {
  var lbl = GmailApp.getUserLabelByName(name);
  return lbl || GmailApp.createLabel(name);
}

function pinappMobileInstallTriggerEvery30Minutes() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    if (t.getHandlerFunction && t.getHandlerFunction() === 'pinappMobileGuidePass') {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger('pinappMobileGuidePass').timeBased().everyMinutes(30).create();
}

function pinappMobileRemoveTriggers() {
  ScriptApp.getProjectTriggers().forEach(function (t) {
    var fn = t.getHandlerFunction && t.getHandlerFunction();
    if (fn === 'pinappMobileGuidePass') ScriptApp.deleteTrigger(t);
  });
}

/**
 * Passage « guide mobile » : notifie si des fils attendent depuis un moment.
 * Ne dépend PAS de Claude : c'est un garde-fou pour les oublis.
 */
function pinappMobileGuidePass() {
  var monEmail = pinappGetProp_('MON_EMAIL', '');
  if (!monEmail) return;

  var labelName = pinappGetProp_('PINAPP_REMIND_LABEL', PINAPP_MOBILE_DEFAULTS.remindLabel);
  var muteName = pinappGetProp_('PINAPP_REMIND_MUTE_LABEL', PINAPP_MOBILE_DEFAULTS.muteLabel);
  var minAge = parseInt(pinappGetProp_('PINAPP_REMIND_MIN_AGE_MIN', String(PINAPP_MOBILE_DEFAULTS.minAgeMin)), 10) || PINAPP_MOBILE_DEFAULTS.minAgeMin;
  var maxN = parseInt(pinappGetProp_('PINAPP_REMIND_MAX', String(PINAPP_MOBILE_DEFAULTS.maxReminds)), 10) || PINAPP_MOBILE_DEFAULTS.maxReminds;

  var inLabel = GmailApp.getUserLabelByName(labelName);
  if (!inLabel) return;
  var muteLabel = pinappGetOrCreateLabel_(muteName);

  // older_than:XXm n'existe pas ; on filtre côté script via last message date.
  var query = 'label:"' + labelName + '" -label:"' + muteName + '" newer_than:14d';
  var threads = GmailApp.search(query, 0, 50);
  if (!threads || threads.length === 0) return;

  var now = new Date().getTime();
  var sent = 0;
  for (var i = 0; i < threads.length; i++) {
    if (sent >= maxN) break;
    var t = threads[i];
    var msgs = t.getMessages();
    if (!msgs.length) continue;
    var last = msgs[msgs.length - 1];
    var ageMin = Math.floor((now - last.getDate().getTime()) / 60000);
    if (ageMin < minAge) continue;

    var subject = last.getSubject() || '(sans sujet)';
    var from = last.getFrom() || '';
    var snippet = (last.getPlainBody() || '').replace(/\s+/g, ' ').trim();
    if (snippet.length > 220) snippet = snippet.substring(0, 220) + '…';

    MailApp.sendEmail({
      to: monEmail,
      subject: '🔔 Pinapp — à approuver : ' + subject.substring(0, 46),
      body:
        'Un fil attend votre approbation.\n\n' +
        'De : ' + from + '\n' +
        'Sujet : ' + subject + '\n' +
        'Âge : ' + ageMin + ' min\n\n' +
        'Étapes :\n' +
        '1) Ouvrir Gmail\n' +
        '2) Ouvrir le fil (label: ' + labelName + ')\n' +
        '3) Lire le brouillon Claude + valider\n\n' +
        'Extrait : ' + snippet + '\n',
    });

    t.addLabel(muteLabel);
    sent++;
  }
}

