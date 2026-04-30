/**
 * Compresse /demo/atelier-rivage/ → /demo/atelier-rivage/atelier-rivage-pinapp.zip
 * Exclut : .git, node_modules, .DS_Store, *.zip
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import os from 'os';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demoDir = path.join(root, 'demo', 'atelier-rivage');
const outName = 'atelier-rivage-pinapp.zip';
const outPath = path.join(demoDir, outName);

const EXCLUDE_NAMES = new Set(['.git', 'node_modules', '.DS_Store']);
const EXCLUDE_EXT = new Set(['.zip']);

function collectFiles(dir, base = dir) {
  const out = [];
  if (!fs.existsSync(dir)) throw new Error('Missing: ' + dir);
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDE_NAMES.has(name.name)) continue;
    const p = path.join(dir, name.name);
    const rel = path.relative(base, p);
    if (name.name === outName) continue;
    if (EXCLUDE_EXT.has(path.extname(name.name).toLowerCase())) continue;
    if (name.isDirectory()) out.push(...collectFiles(p, base));
    else out.push(rel);
  }
  return out;
}

function main() {
  const files = collectFiles(demoDir);
  if (fs.existsSync(outPath)) fs.rmSync(outPath, { force: true });

  const platform = os.platform();
  if (platform === 'win32') {
    const tmp = path.join(os.tmpdir(), `pinapp-atelier-${Date.now()}.zip`);
    const inner = path.join(demoDir, '.zip-staging');
    try {
      if (fs.existsSync(inner)) fs.rmSync(inner, { recursive: true, force: true });
      fs.mkdirSync(inner, { recursive: true });
      for (const rel of files) {
        const from = path.join(demoDir, rel);
        const to = path.join(inner, rel);
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
      }
      execSync(
        `powershell -NoProfile -Command "Compress-Archive -Path '${inner.replace(/'/g, "''")}\\*' -DestinationPath '${tmp.replace(/'/g, "''")}' -Force"`,
        { stdio: 'inherit' },
      );
      fs.copyFileSync(tmp, outPath);
      fs.rmSync(tmp, { force: true });
    } finally {
      if (fs.existsSync(inner)) fs.rmSync(inner, { recursive: true, force: true });
    }
  } else {
    const list = files.map((f) => JSON.stringify(f)).join(' ');
    execSync(`cd ${JSON.stringify(demoDir)} && zip -r ${JSON.stringify(outName)} ${list}`, {
      stdio: 'inherit',
      shell: '/bin/bash',
    });
  }

  const st = fs.statSync(outPath);
  console.log('[build-demo-zip] OK', outPath, st.size, 'bytes', `(${files.length} fichiers)`);
}

main();
