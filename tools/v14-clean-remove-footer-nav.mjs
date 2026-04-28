import fs from 'node:fs';
import path from 'node:path';

const INPUT_FILES = process.argv.slice(2);

const IGNORE_DIRS = new Set(['node_modules', '_site', 'dist', '.git']);

function walkHtmlFiles(rootDir) {
  const out = [];
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    if (!dir) continue;
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const ent of entries) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) {
        if (IGNORE_DIRS.has(ent.name)) continue;
        stack.push(full);
        continue;
      }
      if (ent.isFile() && ent.name.endsWith('.html')) out.push(full);
    }
  }
  return out;
}

function removeFooterNav(html) {
  // Remove only the footer navigation block used across the site.
  // We intentionally target the "footer__links" nav to avoid touching header navs.
  let next = html;

  // 1) Standard footer links block.
  next = next.replace(/(\s*)<nav\b[^>]*class="footer__links"[^>]*>[\s\S]*?<\/nav>\s*/g, '\n');

  // 2) Any other <nav> that lives INSIDE a <footer> and looks like the global site nav.
  // Keep legal links in the footer (mentions/cgv/confidentialite) but remove
  // any other footer navigation (global links, secondary links, etc.).
  next = next.replace(
    /(<footer\b[\s\S]*?)(<nav\b[\s\S]*?<\/nav>)([\s\S]*?<\/footer>)/gi,
    (m, a, nav, c) => {
      const navLower = String(nav).toLowerCase();
      const looksGlobal =
        navLower.includes('>accueil<') ||
        navLower.includes('href="/offres/') ||
        navLower.includes('href="/realisations/') ||
        navLower.includes('href="/auralis/') ||
        navLower.includes('href="/diagnostic/') ||
        navLower.includes('href="/faq/') ||
        navLower.includes('href="/univers/') ||
        navLower.includes('href="/blog/') ||
        navLower.includes('aria-label="pinapp"') ||
        navLower.includes('aria-label="footer"');

      // If the nav is ONLY the three legal links, keep it.
      const legalOnly =
        !looksGlobal &&
        navLower.includes('href="/mentions-legales/') &&
        navLower.includes('href="/cgv/') &&
        navLower.includes('href="/confidentialite/') &&
        // no other internal hub links
        !navLower.includes('href="/offres/') &&
        !navLower.includes('href="/realisations/') &&
        !navLower.includes('href="/auralis/') &&
        !navLower.includes('href="/diagnostic/') &&
        !navLower.includes('href="/faq/') &&
        !navLower.includes('href="/univers/') &&
        !navLower.includes('href="/blog/') &&
        !navLower.includes('>accueil<');

      if (legalOnly) return m;
      // Any non-legal footer navigation is considered "parasite" per V14-CLEAN.
      return `${a}\n${c}`;
    }
  );

  // 3) Fallback: if a footer contains multiple <nav> blocks and at least one looks global,
  // remove all <nav> blocks in that footer except the legal-only nav.
  next = next.replace(/<footer\b[\s\S]*?<\/footer>/gi, (footerBlock) => {
    const navs = footerBlock.match(/<nav\b[\s\S]*?<\/nav>/gi) || [];
    if (navs.length <= 1) return footerBlock;

    const hasGlobal = navs.some((nav) => {
      const navLower = String(nav).toLowerCase();
      return (
        navLower.includes('>accueil<') ||
        navLower.includes('href="/offres/') ||
        navLower.includes('href="/realisations/') ||
        navLower.includes('href="/auralis/') ||
        navLower.includes('href="/diagnostic/') ||
        navLower.includes('href="/faq/') ||
        navLower.includes('href="/univers/') ||
        navLower.includes('href="/blog/') ||
        navLower.includes('aria-label="pinapp"') ||
        navLower.includes('aria-label="footer"')
      );
    });

    if (!hasGlobal) return footerBlock;

    return footerBlock.replace(/<nav\b[\s\S]*?<\/nav>/gi, (nav) => {
      const navLower = String(nav).toLowerCase();
      const legalOnly =
        navLower.includes('href="/mentions-legales/') &&
        navLower.includes('href="/cgv/') &&
        navLower.includes('href="/confidentialite/') &&
        !navLower.includes('href="/offres/') &&
        !navLower.includes('href="/realisations/') &&
        !navLower.includes('href="/auralis/') &&
        !navLower.includes('href="/diagnostic/') &&
        !navLower.includes('href="/faq/') &&
        !navLower.includes('href="/univers/') &&
        !navLower.includes('href="/blog/') &&
        !navLower.includes('>accueil<');
      return legalOnly ? nav : '\n';
    });
  });

  return next;
}

let changed = 0;
const files =
  INPUT_FILES.length > 0
    ? INPUT_FILES
    : walkHtmlFiles(process.cwd());

if (files.length === 0) {
  console.error('No HTML files found.');
  process.exit(2);
}

for (const f of files) {
  const before = fs.readFileSync(f, 'utf8');
  const after = removeFooterNav(before);
  if (after !== before) {
    fs.writeFileSync(f, after, 'utf8');
    changed++;
    console.log(`updated ${f}`);
  } else {
    console.log(`nochange ${f}`);
  }
}

console.log(`done (${changed}/${files.length} updated)`);

