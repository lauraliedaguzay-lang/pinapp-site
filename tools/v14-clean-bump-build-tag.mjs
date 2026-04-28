import fs from 'node:fs';

const BUILD = 'v14-clean-2026-04-28';
const files = process.argv.slice(2);

if (files.length === 0) {
  console.error('Usage: node tools/v14-clean-bump-build-tag.mjs <file...>');
  process.exit(2);
}

function bump(html) {
  const re = /<meta\s+name="pinapp-build"\s+content="[^"]*"\s*\/?>/i;
  if (!re.test(html)) return html;
  return html.replace(re, `<meta name="pinapp-build" content="${BUILD}" />`);
}

let changed = 0;
for (const f of files) {
  if (!fs.existsSync(f)) continue;
  const before = fs.readFileSync(f, 'utf8');
  const after = bump(before);
  if (after !== before) {
    fs.writeFileSync(f, after, 'utf8');
    changed++;
    console.log(`updated ${f}`);
  } else {
    console.log(`nochange ${f}`);
  }
}

console.log(`done (${changed}/${files.length} updated)`);

