import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const demoDir = path.join(root, 'demo');

function listDemoHtmlFiles() {
  if (!fs.existsSync(demoDir)) return [];
  return fs
    .readdirSync(demoDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => path.join(demoDir, d.name, 'index.html'))
    .filter((p) => fs.existsSync(p));
}

function normalizeRobotsMeta(html) {
  const desired = '<meta name="robots" content="noindex, nofollow">';
  if (html.includes(desired)) return html;

  if (/<meta\s+name=["']robots["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']robots["'][^>]*>/i, desired);
  }

  // Insert after description when possible, otherwise after viewport.
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    return html.replace(/(<meta\s+name=["']description["'][^>]*>\s*)/i, '$1' + desired + '\n  ');
  }
  if (/<meta\s+name=["']viewport["'][^>]*>/i.test(html)) {
    return html.replace(/(<meta\s+name=["']viewport["'][^>]*>\s*)/i, '$1' + desired + '\n  ');
  }
  return html;
}

function main() {
  const files = listDemoHtmlFiles();
  let changed = 0;

  files.forEach((file) => {
    const before = fs.readFileSync(file, 'utf8');
    let after = before;
    after = normalizeRobotsMeta(after);
    if (after !== before) {
      fs.writeFileSync(file, after);
      changed++;
    }
  });

  console.log(`Normalized demos: ${changed}/${files.length} updated`);
}

main();
