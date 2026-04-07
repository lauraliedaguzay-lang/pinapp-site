/**
 * Remplace APP_URL dans auralis-config.js (fichier copié ou source).
 * CI : toujours exécuter avec env (GitHub définit CI=true) — secret absent = URL vide.
 * Local : n’injecte que si AURALIS_APP_URL est défini dans l’environnement.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function injectAuralisAppUrl(filePath) {
  const inCi = process.env.CI === 'true';
  const raw = process.env.AURALIS_APP_URL;
  if (!inCi && raw === undefined) return;

  const url = (raw ?? '').trim();
  let c = fs.readFileSync(filePath, 'utf8');
  if (!/APP_URL:\s*['"]/.test(c)) {
    console.warn('inject-auralis-env: motif APP_URL introuvable dans', filePath);
    return;
  }
  c = c.replace(/APP_URL:\s*['"][^'"]*['"]/, `APP_URL: ${JSON.stringify(url)}`);
  fs.writeFileSync(filePath, c);
}

const self = fileURLToPath(import.meta.url);
const ranAsMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(self);
if (ranAsMain && process.argv[2]) {
  injectAuralisAppUrl(path.resolve(process.cwd(), process.argv[2]));
}
