#!/usr/bin/env python3
"""Applique thème dark par défaut + id scroll-bar sur les HTML (hors _site / node_modules)."""
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {"_site", "node_modules", ".git"}

PAT_A = re.compile(
    r"(\s*)var t = localStorage\.getItem\('pinapp-theme'\) \|\| localStorage\.getItem\('pinapp-mode'\);\s*\n"
    r"\s*var d = window\.matchMedia\('\(prefers-color-scheme:dark\)'\)\.matches;\s*\n"
    r"\s*var m = t === 'light' \|\| t === 'jour' \? 'jour' : t === 'dark' \|\| t === 'nuit' \? 'nuit' : d \? 'nuit' : 'jour';",
    re.MULTILINE,
)
REP_A = (
    r"\1var t = localStorage.getItem('pinapp-theme') || localStorage.getItem('pinapp-mode');\n"
    r"\1var m = t === 'light' || t === 'jour' ? 'jour' : t === 'dark' || t === 'nuit' ? 'nuit' : 'nuit';"
)

PAT_B = re.compile(
    r"(\s*)var s = localStorage\.getItem\('pinapp-theme'\);\s*\n"
    r"\s*var d = window\.matchMedia\('\(prefers-color-scheme:dark\)'\)\.matches;\s*\n"
    r"\s*var m = s \|\| \(d \? 'nuit' : 'jour'\);\s*\n"
    r"\s*var t = m === 'nuit' \? 'dark' : 'light';\s*\n"
    r"\s*document\.documentElement\.setAttribute\('data-mode', m\);\s*\n"
    r"\s*document\.documentElement\.setAttribute\('data-theme', t\);",
    re.MULTILINE,
)
REP_B = (
    r"\1var t0 = localStorage.getItem('pinapp-theme') || localStorage.getItem('pinapp-mode');\n"
    r"\1var m = t0 === 'light' || t0 === 'jour' ? 'jour' : t0 === 'dark' || t0 === 'nuit' ? 'nuit' : 'nuit';\n"
    r"\1document.documentElement.setAttribute('data-mode', m);\n"
    r"\1document.documentElement.setAttribute('data-theme', m === 'jour' ? 'light' : 'dark');"
)

PAT_C = re.compile(
    r"(\s*)var s = localStorage\.getItem\('pinapp-theme'\);\s*\n"
    r"\s*var d = window\.matchMedia\('\(prefers-color-scheme:dark\)'\)\.matches;\s*\n"
    r"\s*var m = s \|\| \(d \? 'nuit' : 'jour'\);\s*\n"
    r"\s*document\.documentElement\.setAttribute\('data-mode', m\);\s*\n"
    r"\s*document\.documentElement\.setAttribute\('data-theme', m === 'jour' \? 'light' : 'dark'\);",
    re.MULTILINE,
)
REP_C = (
    r"\1var t0 = localStorage.getItem('pinapp-theme') || localStorage.getItem('pinapp-mode');\n"
    r"\1var m = t0 === 'light' || t0 === 'jour' ? 'jour' : t0 === 'dark' || t0 === 'nuit' ? 'nuit' : 'nuit';\n"
    r"\1document.documentElement.setAttribute('data-mode', m);\n"
    r"\1document.documentElement.setAttribute('data-theme', m === 'jour' ? 'light' : 'dark');"
)


def should_skip(p: Path) -> bool:
    return any(x in SKIP_DIRS for x in p.parts)


def main():
    n = 0
    for f in ROOT.rglob("*.html"):
        if should_skip(f):
            continue
        text = f.read_text(encoding="utf-8")
        orig = text
        text = PAT_A.sub(REP_A, text)
        text = PAT_B.sub(REP_B, text)
        text = PAT_C.sub(REP_C, text)
        text = text.replace('id="scrollProgress"', 'id="scroll-bar" class="scroll-progress"')
        if text != orig:
            f.write_text(text, encoding="utf-8", newline="\n")
            n += 1
            print("updated", f.relative_to(ROOT))
    print("files updated:", n)


if __name__ == "__main__":
    main()
