/**
 * Voyage-v9 — routage n8n aligné sur docs/SCHEMA-WORKFLOWS-N8N.md
 * Produit n8n_route_tag + telegram_digest (payload JSON côté form-handler).
 */
(function () {
  'use strict';

  var EM = '\u2014';

  function trim(s) {
    return s == null ? '' : String(s).trim();
  }

  /** Renvoie la clé "besoin" (sans #) pour n8nMap §1.1, ou null si géré ailleurs / inconnu. */
  function pathToBesoinKey(data) {
    var p = trim(data.path);
    if (p === 'pack_duo') return 'duo-complet';
    if (p === 'tech') {
      var t = trim(data.tech_type);
      if (t === 'Site vitrine') return 'site-vitrine';
      if (t === 'Automatisation' || t === 'Assistant IA') return 'ia-mesure';
      if (t === 'Formation') return 'form-inconnu';
      if (t === 'Plusieurs' || t === '') return 'unsure';
    }
    if (p === 'image') {
      var it = trim(data.image_type);
      if (it === 'Direction artistique') return 'direction-artistique';
      if (it === 'Film cadeau IA') return 'film-ia-cadeau';
      if (it === 'Clip / Film IA' || it === 'Court-métrage IA') return 'film-ia-pro';
      if (it === 'Captation événement') {
        return 'event-autre';
      }
      if (it === '') return 'unsure';
    }
    return null;
  }

  function toTag(besoinKey) {
    if (!besoinKey) return EM;
    return '#' + besoinKey;
  }

  function formatTelegramDigest(data, tag) {
    var lines = [];
    lines.push('PINAPP · voyage-v9');
    lines.push('Routage : ' + tag);
    lines.push('Chemin : ' + (data.path || '—'));
    lines.push('Prénom : ' + (data.prenom || '—') + ' · ' + (data.entreprise || '—'));
    lines.push('Email : ' + (data.email || '—'));
    lines.push('CP : ' + (data.cp || '—'));
    if (data.path === 'tech') {
      lines.push('Tech : ' + (data.tech_type || '—') + ' | pain : ' + (data.tech_pain || '—'));
    } else if (data.path === 'image') {
      lines.push('Image : ' + (data.image_type || '—') + ' | ' + (data.image_duree || '—'));
      if (trim(data.image_lieu) || trim(data.image_date)) {
        lines.push('Lieu/évén. : ' + (data.image_lieu || '—') + ' · ' + (data.image_date || '—'));
      }
    } else if (data.path === 'pack_duo') {
      lines.push('Pack : ' + (data.pack_choix || '—'));
    }
    lines.push('Budget : ' + (data.budget || '—') + ' · Délai : ' + (data.delai || '—'));
    if (trim(data.message)) lines.push('Message : ' + trim(data.message));
    return lines.join('\n');
  }

  /**
   * @param {Object} data — champs du formulaire #pinapp-form
   * @returns {{ n8n_route_tag: string, telegram_digest: string, besoin_key: string }}
   */
  function resolve(data) {
    if (!data || typeof data !== 'object') {
      return { n8n_route_tag: EM, telegram_digest: '', besoin_key: '' };
    }
    var key = pathToBesoinKey(data);
    var tag = key == null ? EM : toTag(key);
    if (key === 'unsure') tag = '#lead-unsure';
    var dig = formatTelegramDigest(data, tag);
    return { n8n_route_tag: tag, telegram_digest: dig, besoin_key: key || '' };
  }

  window.PinappV9ResolveN8n = resolve;
})();
