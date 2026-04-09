import fs from 'fs';
import path from 'path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function walk(dir) {
  const out = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name === 'node_modules' || e.name === '.git') continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

function ensureInterPreload(html, relPrefix) {
  const preload = `${relPrefix}assets/fonts/inter-var.woff2`;
  const tag = `<link rel="preload" href="${preload}" as="font" type="font/woff2" crossorigin />`;
  if (html.includes(preload)) return html;

  // Insert after favicon if possible, otherwise before first stylesheet.
  const afterFavicon = html.match(/<link[^>]+rel="icon"[^>]*>\s*/i);
  if (afterFavicon) {
    return html.replace(afterFavicon[0], `${afterFavicon[0]}    ${tag}\n`);
  }

  const firstCss = html.match(/\s*<link[^>]+rel="stylesheet"[^>]*>\s*/i);
  if (firstCss) {
    return html.replace(firstCss[0], `\n    ${tag}\n${firstCss[0]}`);
  }
  return html;
}

function stripBunnyFonts(html) {
  // Remove bunny preconnect + stylesheet
  html = html.replace(/\s*<link[^>]+href="https:\/\/fonts\.bunny\.net"[^>]*>\s*\n?/gi, '');
  html = html.replace(
    /\s*<link[^>]+href="https:\/\/fonts\.bunny\.net\/css\?family=inter:[^"]+"[^>]*>\s*\n?/gi,
    '',
  );
  return html;
}

function relPrefixFor(filePath) {
  // filePath is absolute; compute relative to root.
  const rel = path.relative(root, filePath).replace(/\\/g, '/');
  const depth = rel.split('/').length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

function main() {
  const files = walk(root).filter((p) => p.endsWith('.html'));
  let changed = 0;
  for (const f of files) {
    let html = fs.readFileSync(f, 'utf8');
    const before = html;
    html = stripBunnyFonts(html);
    const relPrefix = relPrefixFor(f);
    html = ensureInterPreload(html, relPrefix);
    if (html !== before) {
      fs.writeFileSync(f, html, 'utf8');
      changed += 1;
    }
  }
  console.log(`normalize-fonts: updated ${changed} file(s)`);
}

main();
