import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const SKIP_DIRS = new Set(['.git', 'node_modules', '_site', '.cursor', '.artifacts', 'tools']);

function walk(dir, cb) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_DIRS.has(ent.name)) continue;
      walk(path.join(dir, ent.name), cb);
    } else {
      cb(path.join(dir, ent.name));
    }
  }
}

function normalizeHtml(s) {
  let out = s;

  // Drawer should include an "Accueil" link at the very top.
  // We derive the correct relative href from the existing "Offres" href in the drawer.
  // Important: check within the drawer panel only (bottom-bar also contains "Accueil").
  const drawerBlock =
    out.match(/<div class=["']mobile-drawer-panel["'][\s\S]*?<\/div>\s*<\/div>/i)?.[0] || '';
  if (drawerBlock && !/>\s*Accueil\s*</i.test(drawerBlock)) {
    out = out.replace(
      /(<div class=["']mobile-drawer-panel["']>\s*<button[^>]*id=["']drawerClose["'][\s\S]*?<\/button>)([\s\S]*?<a\s+href=(["'])([^"']*?)offres\/index\.html\3>\s*Offres\s*<\/a>)/i,
      function (m, closeBtn, after, q, offresHrefPrefix) {
        // offresHrefPrefix is the part before "offres/index.html" (e.g. "../" or "../../")
        const homeHref = `${offresHrefPrefix}index.html`;
        return `${closeBtn}\n        <a href="${homeHref}">Accueil</a>${after}`;
      },
    );
  }

  // Drawer "Formations" should point to the paid formation page, not the free lead-magnet.
  // Keep both pages: /offres/formation/ (menu) vs /formation-gratuite/ (lead magnet elsewhere).
  out = out.replace(
    /href=(["'])([^"']*?)formation-gratuite\/index\.html\1(\s*>\s*Formations\s*<)/gi,
    'href=$1$2offres/formation/index.html$1$3',
  );

  // Ensure canonical on public pages.
  // Use og:url when present (single source of truth), otherwise derive from file path later.
  if (!/\s<link\s+rel=["']canonical["']/i.test(out)) {
    const og = out.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']\s*\/?>/i);
    const href = og?.[1];
    if (href && /^https?:\/\//i.test(href)) {
      const canonical = `<link rel="canonical" href="${href}" />`;
      // Insert right after og:url when available.
      out = out.replace(
        /(<meta\s+property=["']og:url["']\s+content=["'][^"']+["']\s*\/?>)/i,
        `$1\n    ${canonical}`,
      );
    }
  }

  // Logo: prefer SVG everywhere.
  out = out.replace(/assets\/images\/pinapp-logo\.png/g, 'assets/images/pinapp-logo.svg');
  out = out.replace(/\/assets\/images\/pinapp-logo\.png/g, '/assets/images/pinapp-logo.svg');
  out = out.replace(/(\bsrc=["'][^"']*?)pinapp-logo\.png(["'])/g, '$1pinapp-logo.svg$2');

  // Remove external font provider (visual inconsistency + CSP risk).
  // Pinapp relies on system stacks if local font isn't shipped.
  out = out.replace(
    /\s*<link\s+rel=["']preconnect["']\s+href=["']https:\/\/fonts\.bunny\.net["']\s*\/?>\s*/gi,
    '',
  );
  out = out.replace(
    /\s*<link\s+rel=["']stylesheet["']\s+href=["']https:\/\/fonts\.bunny\.net\/css\?family=inter:[^"']+["']\s*\/?>\s*/gi,
    '',
  );

  // Remove preload to missing local font file.
  // (Some pages still include it; build step also removes it, but keep sources clean.)
  out = out.replace(
    /\s*<link\s+rel=["']preload["'][^>]*href=["'][^"']*assets\/fonts\/inter-var\.woff2[^"']*["'][^>]*>\s*/gi,
    '',
  );

  // Ensure iOS glass layer is loaded on pages that use the main Pinapp UI shell.
  // (Skip if already present. Relative prefix is derived from the variables.css href.)
  if (!/assets\/css\/ios-glass\.css/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const glassLink = `<link rel="stylesheet" href="${prefix}assets/css/ios-glass.css" />`;

      // Prefer inserting after apple-finish.css when present, otherwise after animations.css, otherwise after variables.css.
      if (/assets\/css\/apple-finish\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/css\/apple-finish\.css["']\s*\/?>)/i,
          `$1\n    ${glassLink}`,
        );
      } else if (/assets\/animations\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/animations\.css["']\s*\/?>)/i,
          `$1\n    ${glassLink}`,
        );
      } else {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/variables\.css["']\s*\/?>)/i,
          `$1\n    ${glassLink}`,
        );
      }
    }
  }

  // Ensure WOW senior layer is loaded (micro-interactions + speculars).
  if (!/assets\/css\/wow-senior\.css/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const wowSeniorLink = `<link rel="stylesheet" href="${prefix}assets/css/wow-senior.css" />`;

      // Prefer inserting after wow-visuals.css if present, else after ios-glass.css, else after apple-finish.css.
      if (/assets\/css\/wow-visuals\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/css\/wow-visuals\.css["']\s*\/?>)/i,
          `$1\n    ${wowSeniorLink}`,
        );
      } else if (/assets\/css\/ios-glass\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/css\/ios-glass\.css["']\s*\/?>)/i,
          `$1\n    ${wowSeniorLink}`,
        );
      } else if (/assets\/css\/apple-finish\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/css\/apple-finish\.css["']\s*\/?>)/i,
          `$1\n    ${wowSeniorLink}`,
        );
      } else if (/assets\/animations\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/animations\.css["']\s*\/?>)/i,
          `$1\n    ${wowSeniorLink}`,
        );
      } else {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/variables\.css["']\s*\/?>)/i,
          `$1\n    ${wowSeniorLink}`,
        );
      }
    }
  }

  // Ensure WOW senior JS is loaded (tilt/shine on desktop pointer-fine only).
  if (!/assets\/js\/wow-senior\.js/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const wowSeniorScript = `<script src="${prefix}assets/js/wow-senior.js" defer></script>`;
      if (/assets\/js\/cursor\.js/.test(out)) {
        out = out.replace(
          /(<script\s+src=["'][^"']*assets\/js\/cursor\.js["']\s+defer><\/script>)/i,
          `$1\n    ${wowSeniorScript}`,
        );
      } else if (/<\/body>/i.test(out)) {
        out = out.replace(/<\/body>/i, `    ${wowSeniorScript}\n  </body>`);
      }
    }
  }

  return out;
}

let changed = 0;
walk(root, (p) => {
  if (!p.endsWith('.html')) return;
  // Skip internal include templates & og-image builder.
  const rel = path.relative(root, p).replace(/\\/g, '/');
  if (rel.startsWith('tools/')) return;
  if (rel === 'og-image.html') return;
  const before = fs.readFileSync(p, 'utf8');
  let after = normalizeHtml(before);

  // Canonical fallback if still missing: derive from file path.
  if (!/\s<link\s+rel=["']canonical["']/i.test(after)) {
    // Derive a site path like "/" or "/offres/sites/".
    let urlPath = '/' + rel.replace(/index\.html$/i, '').replace(/\.html$/i, '');
    // Normalize: ensure leading slash and trailing slash for directory pages.
    if (!urlPath.startsWith('/')) urlPath = '/' + urlPath;
    if (!urlPath.endsWith('/')) urlPath += '/';
    if (urlPath === '//') urlPath = '/';
    const href = 'https://pinapp.fr' + urlPath;
    const canonical = `<link rel="canonical" href="${href}" />`;
    const ogUrl = after.match(/<meta\s+property=["']og:url["']\s+content=["'][^"']+["']\s*\/?>/i);
    if (ogUrl) {
      after = after.replace(ogUrl[0], `${ogUrl[0]}\n    ${canonical}`);
    } else if (/<meta\s+name=["']description["']/i.test(after)) {
      after = after.replace(/(<meta\s+name=["']description["'][^>]*>)/i, `$1\n    ${canonical}`);
    } else {
      after = after.replace(/<\/title>\s*/i, (m) => `${m}    ${canonical}\n`);
    }
  }

  if (after !== before) {
    fs.writeFileSync(p, after);
    changed++;
  }
});

console.log(`normalize-html: updated ${changed} file(s)`);
