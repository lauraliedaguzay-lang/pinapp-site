import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

/**
 * Serveur de dev multi-pages (MPA) — les fichiers HTML/CSS/JS restent tels quels.
 * La prod (pinapp.fr / GitHub Pages) déploie les fichiers sources sans étape Vite.
 */
const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  appType: 'mpa',
  root: __dirname,
  server: {
    // Écoute sur toutes les interfaces (IPv4 + IPv6) : évite refused si localhost/127.0.0.1 ne matche pas
    host: true,
    port: 5173,
    strictPort: false,
    open: '/index.html',
  },
});
