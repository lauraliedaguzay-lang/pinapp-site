const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'offres');

const files = [
  'starter/index.html',
  'sites/index.html',
  'automatisation/index.html',
  'systeme-complet/index.html',
].map((f) => path.join(ROOT, f));

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let c = fs.readFileSync(file, 'utf8');
  if (c.includes('blog/index.html')) continue;
  c = c.replace(
    /(<a href="\.\.\/\.\.\/offres\/index\.html"[^>]*>Offres<\/a>)(\r?\n)(\s*)(<a href="\.\.\/\.\.\/realisations)/g,
    `$1$2$3<a href="../../blog/index.html" class="nav-link" style="font-size: 14px; opacity: 0.8">Blog</a>$2$3$4`,
  );
  c = c.replace(
    /(\n\s*<a href="\.\.\/\.\.\/offres\/index\.html">Offres<\/a>)(\r?\n)(\s*)(<a href="\.\.\/\.\.\/realisations)/g,
    `$1$2$3<a href="../../blog/index.html">Blog</a>$2$3$4`,
  );
  fs.writeFileSync(file, c, 'utf8');
  console.log('ok', path.relative(path.join(__dirname, '..'), file));
}
