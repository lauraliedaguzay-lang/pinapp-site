# PATCH — Correctif formulaire diagnostic + a11y (voyage-v9)

**Scope** : 4 correctifs (les `.placeholder-asset` sont déjà `display:none` hors draft-mode — pas de blocker).

## Correctif 1 — `<select>` + automatisation + n8n

- Toutes les options ont un `value` stable.
- `<optgroup>` : Prestations · Films IA · Événementiel · Formations + « Je ne sais pas ».
- Sous-menu `#diagAutoFields` + `select[name="auto_scenario"]` visible si `besoin === auto-pack` (5 scénarios : `#auto-lead`, `#auto-devis`, `#auto-formation`, `#auto-livraison`, `#auto-autre`).
- Objet `n8nMap` + `data.n8n_route_tag` ; `telegram_digest` et mail fallback enrichis (`auto_scenario` si pack auto).

## Correctif 2 — Contraste

- `--ivoire-mute` : `0.48` → `0.62` (meilleur ratio sur fond sombre).

## Correctif 3 — Labels formulaire + erreurs

- Classe `.diag__label` (visible) pour les champs du diagnostic.
- `#diag-error` `role="alert"` + `aria-live="assertive"` ; affichage si échec webhook au lieu du seul `alert`.
- Consentement : `aria-describedby="diag-consent-desc"` + paragraphe RGPD court.

## Correctif 4 — Rivage dots

- Boutons dots : `role="tab"`, `aria-selected`, roving `tabindex`, flèches / Home / End.
- `aria-hidden` retiré du wrapper `.rivage-hero__nav`.
- Viewport : `role="tabpanel"`, `aria-controls` sur les tabs → `#rivageViewport`.

## Bonus technique

- Parallax souris hero : appliqué sur `.stage__layer[data-stage="01"] video` uniquement (ne casse plus le Ken Burns du calque).

---

## Bash de validation (post-merge)

```bash
cd /path/to/pinapp-site
grep -c 'class="placeholder-asset"' voyage-v9/index.html   # attendu : 13
grep -c 'value="auto-pack"' voyage-v9/index.html
grep -c 'diag-auto-scenario' voyage-v9/index.html
grep -c 'n8nMap' voyage-v9/index.html
grep -c 'diag-error' voyage-v9/index.html
grep -c 'aria-describedby="diag-consent-desc"' voyage-v9/index.html
grep -c 'role="tab"' voyage-v9/index.html
```

---

*Aligné avec le prompt Cursor — avril 2026.*
