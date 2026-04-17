/**
 * PINAPP — Auto-réparation (notifications / actions à brancher dans n8n)
 * n8n : `const { autoRepair } = await import('./tools/auto-repair.js');`
 */

const REPAIRS = {
  async handle404(page) {
    console.log('[AUTO-REPAIR] Page 404 détectée : ' + page);
    return { action: 'notify', message: 'Page 404 : ' + page + ' — vérifier le fichier' };
  },

  async handleSlow(page, duration) {
    console.log('[AUTO-REPAIR] Page lente : ' + page + ' (' + duration + 'ms)');
    return { action: 'notify', message: 'Page lente : ' + page + ' — ' + duration + 'ms' };
  },

  async handleSSL() {
    console.log('[AUTO-REPAIR] CRITIQUE : SSL / connexion HTTPS');
    return { action: 'critical', message: 'SSL ou HTTPS — vérifier le certificat sur Hostinger' };
  },

  async handleContentMissing(missing) {
    console.log('[AUTO-REPAIR] Contenu manquant : ' + missing.join(', '));
    return {
      action: 'critical',
      message: "Contenu manquant sur l'accueil : " + missing.join(', ') + ' — vérifier le déploiement',
    };
  },
};

async function autoRepair(healthResult) {
  const actions = [];
  const errs = healthResult.errors || [];

  for (let i = 0; i < errs.length; i++) {
    const error = errs[i];
    if (error.status === 404) {
      actions.push(await REPAIRS.handle404(error.url));
    } else if (error.duration > 3000) {
      actions.push(await REPAIRS.handleSlow(error.url, error.duration));
    } else if (error.error && String(error.error).toLowerCase().includes('ssl')) {
      actions.push(await REPAIRS.handleSSL());
    } else if (error.missing) {
      actions.push(await REPAIRS.handleContentMissing(error.missing));
    }
  }

  return actions;
}

export { autoRepair, REPAIRS };
