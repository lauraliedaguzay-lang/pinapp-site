# -*- coding: utf-8 -*-
"""Réordonne index.html : barre de confiance après hero, section vidéo après démos."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
p = ROOT / "index.html"
t = p.read_text(encoding="utf-8")

TRUST = """        <section class="section pp-trust-wrap" aria-label="Confiance" style="padding: 0.65rem 0 0">
          <div class="wrap">
            <p class="pp-trust-bar" role="note">
              11 secteurs couverts<span class="pp-mid" aria-hidden="true">·</span>30 jours satisfait ou remboursé<span
                class="pp-mid"
                aria-hidden="true"
                >·</span
              >Réponse sous 24h<span class="pp-mid" aria-hidden="true">·</span>Basés à Bordeaux
            </p>
          </div>
        </section>

"""

# 1) Insérer barre de confiance entre hero et home-presentation (une seule fois)
needle = "        </section>\n\n        <section class=\"section\" id=\"home-presentation\""
if "pp-trust-wrap" not in t and needle in t:
    t = t.replace(needle, "        </section>\n\n" + TRUST + "        <section class=\"section\" id=\"home-presentation\"", 1)

# 2) Extraire home-presentation et retirer de son emplacement actuel
start = t.find('<section class="section" id="home-presentation"')
svc = '<section class="section" id="home-services"'
end = t.find(svc)
if start == -1 or end == -1 or start >= end:
    raise SystemExit("home-presentation / home-services introuvables")

pres_block = t[start:end]
t = t[:start] + t[end:]

# 3) Insérer présentation juste avant #temoignages (après fermeture #demos)
idx = t.find('        <section id="temoignages"')
if idx == -1:
    raise SystemExit("section temoignages introuvable")

t = t[:idx] + pres_block + "\n" + t[idx:]

p.write_text(t, encoding="utf-8")
print("OK: trust + déplacement home-presentation")
