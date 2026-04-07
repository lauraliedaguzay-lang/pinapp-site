#!/usr/bin/env python3
"""
Harmonise la bottom-bar (5 liens = même carte que la nav principale) et injecte neuro-layout.css
sur toutes les pages HTML du site (hors demo/ et docs/).
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {"demo", "docs", "node_modules", ".git"}
NEURO_SNIPPET = '<link rel="stylesheet" href="{prefix}assets/css/neuro-layout.css">'


def href_prefix(html_path: Path) -> str:
    rel = html_path.relative_to(ROOT)
    depth = len(rel.parts) - 1
    return "../" * depth


def bottom_bar_block(prefix: str) -> str:
    return f'''  <div class="bottom-bar bottom-bar--site" aria-label="Navigation du site">
    <a href="{prefix}index.html">Accueil</a>
    <a href="{prefix}offres/index.html">Offres</a>
    <a href="{prefix}diagnostic/index.html" class="bottom-bar-cta">D&eacute;marrer</a>
    <a href="{prefix}univers/index.html">Univers</a>
    <a href="{prefix}realisations/index.html">R&eacute;alis.</a>
  </div>'''


def should_process(p: Path) -> bool:
    if p.suffix.lower() != ".html":
        return False
    parts = set(p.relative_to(ROOT).parts)
    if parts & SKIP_DIRS:
        return False
    return True


def inject_neuro_css(html: str, prefix: str) -> str:
    needle = "mobile-premium.css"
    if "neuro-layout.css" in html:
        return html
    idx = html.find(needle)
    if idx == -1:
        return html
    end = html.find(">", idx)
    if end == -1:
        return html
    insert = "\n  " + NEURO_SNIPPET.format(prefix=prefix) + "\n  "
    return html[: end + 1] + insert + html[end + 1 :]


def replace_bottom_bar(html: str, prefix: str) -> str:
    pattern = re.compile(
        r'<div class="bottom-bar[^"]*"[^>]*aria-label="[^"]*"[^>]*>.*?</div>\s*',
        re.DOTALL | re.IGNORECASE,
    )
    new_bar = bottom_bar_block(prefix) + "\n"
    return pattern.sub(new_bar, html, count=1)


def main() -> None:
    count = 0
    for html_path in sorted(ROOT.rglob("*.html")):
        if not should_process(html_path):
            continue
        text = html_path.read_text(encoding="utf-8")
        prefix = href_prefix(html_path)
        new_text = replace_bottom_bar(text, prefix)
        new_text = inject_neuro_css(new_text, prefix)
        if new_text != text:
            html_path.write_text(new_text, encoding="utf-8", newline="\n")
            count += 1
            print("updated:", html_path.relative_to(ROOT))
    print("done,", count, "files")


if __name__ == "__main__":
    main()
