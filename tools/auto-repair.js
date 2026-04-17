/**
 * PINAPP — Auto-réparation (ESM)
 * Node 18+ : node tools/auto-repair.js  (nécessite un résumé health-check en JSON sur stdin — optionnel)
 */

export const REPAIRS = {
  async handle404(page) {
    console.log(`[AUTO-REPAIR] Page 404 détectée : ${page}`);
    return { action: 'notify', message: `Page 404 : ${page} — vérifier le fichier` };
  },

  async handleSlow(page, duration) {
    console.log(`[AUTO-REPAIR] Page lente : ${page} (${duration}ms)`);
    return { action: 'notify', message: `Page lente : ${page} — ${duration}ms` };
  },

  async handleSSL() {
    console.log('[AUTO-REPAIR] ⚠️ CRITIQUE : SSL expiré ou invalide');
    return { action: 'critical', message: 'SSL expiré — renouveler immédiatement sur Hostinger' };
  },

  async handleContentMissing(missing) {
    console.log(`[AUTO-REPAIR] Contenu manquant : ${missing.join(', ')}`);
    return {
      action: 'critical',
      message: `Contenu manquant sur l'accueil : ${missing.join(', ')} — vérifier le déploiement`,
    };
  },
};

export async function autoRepair(healthResult) {
  const actions = [];

  for (const error of healthResult.errors || []) {
    if (error.status === 404) {
      actions.push(await REPAIRS.handle404(error.url));
    } else if (error.duration > 3000 || error.error === 'slow') {
      actions.push(await REPAIRS.handleSlow(error.url, error.duration));
    } else if (error.error && String(error.error).includes('SSL')) {
      actions.push(await REPAIRS.handleSSL());
    } else if (error.missing) {
      actions.push(await REPAIRS.handleContentMissing(error.missing));
    }
  }

  return actions;
}

export default { autoRepair, REPAIRS };
