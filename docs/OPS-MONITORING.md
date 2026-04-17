# Monitoring Pinapp (double filet)

## n8n

Importer `n8n-workflows/monitoring-24h.json`, configurer les credentials **Telegram** (ou remplacer le nœud par email / Slack), puis activer le workflow.

Scripts Node optionnels (ESM, `package.json` en `"type": "module"`) : `tools/health-check.js` (résumé JSON) et `tools/auto-repair.js` (messages d’action). Dans n8n (nœud Code) : `const { runHealthCheck } = await import('/chemin/vers/tools/health-check.js');`

## UptimeRobot (gratuit)

1. Créer un compte sur [https://uptimerobot.com](https://uptimerobot.com).
2. Moniteur HTTP **https://pinapp.fr** (intervalle 5 min).
3. Moniteur **https://pinapp.fr/sitemap.xml**.
4. Alertes email vers **contact@pinapp.fr** si indisponible &gt; 1 minute.

Complète le monitoring n8n sans cookies côté site (voir **Plausible** dans la politique de confidentialité).
