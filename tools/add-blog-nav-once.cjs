const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const SKIP_DIRS = new Set(['node_modules', '_site', 'dist', '.git', 'tools']);

function walk(dir, out = []) {
  for (const name of fs.readdirSync(dir, { withFileTypes: true })) {
    if (name.name.startsWith('.')) continue;
    const p = path.join(dir, name.name);
    if (name.isDirectory()) {
      if (SKIP_DIRS.has(name.name)) continue;
      walk(p, out);
    } else if (name.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function insertBlog(html) {
  if (html.includes('href="/blog/"') || html.includes("href='/blog/'")) return html;
  let c = html;
  c = c.replace(
    /(<a href="\/offres\/">[^<]+<\/a>)(\r?\n)([\t ]+)(<a href="\/realisations\/">)/g,
    (m, a, nl, sp, r) => `${a}${nl}${sp}<a href="/blog/">Blog</a>${nl}${sp}${r}`,
  );
  c = c.replace(
    /(<li><a href="\/offres\/">Offres<\/a><\/li>)(\r?\n)(\s*)(<li><a href="\/realisations\/">)/,
    `$1$2$3<li><a href="/blog/">Blog</a></li>$2$3$4`,
  );
  c = c.replace(
    /(<a href="\.\.\/offres\/index\.html"[^>]*>Offres<\/a>)(\r?\n)(\s*)(<a href="\.\.\/realisations)/g,
    `$1$2$3<a href="../blog/index.html" class="nav-link" style="font-size: 14px; opacity: 0.8">Blog</a>$2$3$4`,
  );
  c = c.replace(
    /(\n\s*<a href="\.\.\/offres\/index\.html">Offres<\/a>)(\r?\n)(\s*)(<a href="\.\.\/realisations)/g,
    `$1$2$3<a href="../blog/index.html">Blog</a>$2$3$4`,
  );
  return c;
}

let n = 0;
for (const file of walk(ROOT)) {
  const raw = fs.readFileSync(file, 'utf8');
  const next = insertBlog(raw);
  if (next !== raw) {
    fs.writeFileSync(file, next, 'utf8');
    n++;
    console.log(path.relative(ROOT, file));
  }
}
console.log('updated', n, 'files');
