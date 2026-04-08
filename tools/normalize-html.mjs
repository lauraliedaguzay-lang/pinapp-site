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

  // Ensure Pandora world layer is loaded on all pages using the Pinapp shell.
  // (Relative prefix is derived from the variables.css href.)
  if (!/assets\/css\/pandora-world\.css/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const pwLink = `<link rel="stylesheet" href="${prefix}assets/css/pandora-world.css" />`;
      out = out.replace(
        /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/variables\.css["']\s*\/?>)/i,
        `$1\n    ${pwLink}`,
      );
    }
  }

  // Ensure Pandora world JS is loaded (prefer after main.js when present).
  if (!/assets\/js\/pandora-world\.js/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const pwScript = `<script src="${prefix}assets/js/pandora-world.js" defer></script>`;
      if (/assets\/js\/main\.js/.test(out)) {
        out = out.replace(
          /(<script\s+src=["'][^"']*assets\/js\/main\.js["']\s+defer><\/script>)/i,
          `$1\n    ${pwScript}`,
        );
      } else if (/<\/body>/i.test(out)) {
        out = out.replace(/<\/body>/i, `    ${pwScript}\n  </body>`);
      }
    }
  }

  // Ensure Pandora world markup exists (insert right after <body ...>).
  // Keep IDs consistent with assets/js/pandora-world.js (#spores-container, #stars-container).
  if (!/id=["']pandora-world["']/.test(out)) {
    const bodyOpen = out.match(/<body\b[^>]*>/i)?.[0] || '';
    if (bodyOpen) {
      out = out.replace(
        /<body\b[^>]*>/i,
        (m) => `${m}
    <div id="pandora-world" aria-hidden="true">
      <div class="pandora-orbs">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
        <div class="orb orb-4"></div>
      </div>
      <div class="pandora-spores" id="spores-container"></div>
      <div class="pandora-stars" id="stars-container"></div>
      <div class="pandora-clouds" id="clouds-container">
        <div class="cloud cloud-1"></div>
        <div class="cloud cloud-2"></div>
        <div class="cloud cloud-3"></div>
      </div>
      <div class="holo-grid"></div>
    </div>`,
      );
    }
  }

  // Ensure guide tour CSS is loaded on all pages using the Pinapp shell.
  if (!/assets\/css\/guide-tour\.css/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const guideCss = `<link rel="stylesheet" href="${prefix}assets/css/guide-tour.css" />`;
      if (/assets\/css\/wow-senior\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/css\/wow-senior\.css["']\s*\/?>)/i,
          `$1\n    ${guideCss}`,
        );
      } else if (/assets\/css\/ios-glass\.css/.test(out)) {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/css\/ios-glass\.css["']\s*\/?>)/i,
          `$1\n    ${guideCss}`,
        );
      } else {
        out = out.replace(
          /(<link\s+rel=["']stylesheet["']\s+href=["'][^"']*assets\/variables\.css["']\s*\/?>)/i,
          `$1\n    ${guideCss}`,
        );
      }
    }
  }

  // Ensure guide tour JS is loaded (after main.js when present).
  if (!/assets\/js\/guide-tour\.js/.test(out)) {
    const vars = out.match(
      /<link\s+rel=["']stylesheet["']\s+href=["']([^"']*?)assets\/variables\.css["']\s*\/?>/i,
    );
    if (vars) {
      const prefix = vars[1] || '';
      const guideScript = `<script src="${prefix}assets/js/guide-tour.js" defer></script>`;
      if (/assets\/js\/main\.js/.test(out)) {
        out = out.replace(
          /(<script\s+src=["'][^"']*assets\/js\/main\.js["']\s+defer><\/script>)/i,
          `$1\n    ${guideScript}`,
        );
      } else if (/<\/body>/i.test(out)) {
        out = out.replace(/<\/body>/i, `    ${guideScript}\n  </body>`);
      }
    }
  }

  // Ensure Plausible is not hard-loaded in HTML.
  // It is loaded after cookie consent via assets/js/main.js.
  out = out.replace(
    /\s*<script\s+defer\s+data-domain=["']pinapp\.fr["']\s+src=["']https:\/\/plausible\.io\/js\/script\.js["']\s*><\/script>\s*/gi,
    '\n',
  );

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
    /(<a\b[^>]*?\bhref=)(["'])([^"']*?)formation-gratuite\/index\.html\2([^>]*>\s*Formations\s*<)/gi,
    '$1$2$3offres/formation/index.html$2$4',
  );

  // Bottom bar "Form." should point to the paid formation page (keep lead magnet linked elsewhere).
  out = out.replace(
    /(<a\b[^>]*?\bhref=)(["'])([^"']*?)formation-gratuite\/index\.html\2([^>]*>\s*Form\.\s*<)/gi,
    '$1$2$3offres/formation/index.html$2$4',
  );

  // Footer secondary: "Formation IA" should not point to the lead magnet unless explicitly intended.
  out = out.replace(
    /(<a\b[^>]*?\bhref=)(["'])([^"']*?)formation-gratuite\/index\.html\2([^>]*>\s*Formation IA\s*<)/gi,
    '$1$2$3offres/formation/index.html$2$4',
  );

  // Add aria-current="page" to nav/drawer/bottom-bar links when they match the current page.
  // We derive the current page absolute path from og:url (single source of truth) when present.
  // Works for both root (/) and directory pages (/offres/formation/).
  const ogUrl = out.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']\s*\/?>/i);
  const absUrl = ogUrl?.[1] || '';
  const absPath = (() => {
    try {
      if (!absUrl) return '';
      const u = new URL(absUrl);
      return u.pathname || '';
    } catch (e) {
      return '';
    }
  })();
  if (absPath) {
    const relFromAbs = absPath === '/' ? 'index.html' : absPath.replace(/\/$/, '') + '/index.html';
    const toAbs = (href) => {
      if (!href) return '';
      // Skip anchors/external.
      if (/^(https?:|mailto:|tel:|#)/i.test(href)) return '';
      // Normalize ./ and absolute-root.
      const h = href.replace(/^\.\//, '');
      if (h === 'index.html') return '/';
      if (h.endsWith('/index.html')) return '/' + h.replace(/\/index\.html$/, '') + '/';
      if (h.endsWith('.html')) return '/' + h.replace(/\.html$/, '/');
      if (h.endsWith('/')) return '/' + h;
      return '/' + h;
    };

    out = out.replace(
      /<a\s+([^>]*?)href=(["'])([^"']+)\2([^>]*)>/gi,
      function (m, pre, q, href, post) {
        // If already has aria-current, keep.
        if (/\baria-current\s*=/.test(m)) return m;
        const abs = toAbs(href);
        if (!abs) return m;
        // Consider both with and without trailing slash.
        const norm = (p) => (p.endsWith('/') ? p : p + '/');
        if (norm(abs) === norm(absPath) || href === relFromAbs) {
          return `<a ${pre}href=${q}${href}${q}${post} aria-current="page">`;
        }
        return m;
      },
    );
  }

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
