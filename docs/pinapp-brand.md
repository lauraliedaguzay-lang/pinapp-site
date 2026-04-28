# Pinapp Brand · Source of Truth

## v15 · Avril 2026 · Lauralie Daguzay

Ce document est exécutable. Tout agent qui édite Pinapp doit consulter ce brand book avant chaque commit sur les chantiers V15. Toute valeur CSS hard-codée hors tokens est un bug à corriger.

## 1 · Identité

Pinapp est un studio digital premium français, basé à Bordeaux.

Mission : structurer l'activité de TPE/PME haut de gamme via sites, automatisations IA et films cinéma.

Positionnement : pas une agence, pas un freelance — un studio duo (Lauralie + Michaël) à finition cinéma.

## 2 · Palette stricte 4 teintes (V15 · abroge nacré)

- Noir profond `#050505` (fond)
- Ivoire `#F4EBD9` (texte principal)
- Or cuivré `#C9A96E` (accent unique)
- Bleu hublot `#1B2C3E` (profondeur Avalon)

Aucune autre couleur autorisée.

Pas de gris, pas de bleu clair, pas de vert, pas de rose, pas de turquoise, pas de violet, pas de nacré.

## 3 · Typographie stricte 2 fonts via Bunny Fonts

- Display : Cormorant Garamond · italic prioritaire
- UI/Body : Inter · weights 400 et 500 uniquement

URL Bunny :

`https://fonts.bunny.net/css?family=cormorant-garamond:400i,300i|inter:400,500&display=swap`

5 tailles autorisées (aucune autre) :

- 11px eyebrow (letter-spacing 0.3em uppercase)
- 16px body
- 24px h3 / sous-titre
- `clamp(32px, 4vw, 48px)` h2
- `clamp(48px, 8vw, 128px)` h1 monumental

## 4 · Espacement strict (système 8px)

8 · 16 · 24 · 32 · 48 · 64 · 96 · 128 px

Aucune valeur libre tolérée. Tout doit utiliser tokens.

## 5 · Border-radius

4px unique. Plus de variantes.

Exception tolérée : 50% pour avatars circulaires.

## 6 · Motion stricte

- Easing : `cubic-bezier(0.16, 1, 0.3, 1)`
- Durations : 200ms (micro) · 400ms (base) · 800ms (hero)
- `prefers-reduced-motion` respecté partout

## 7 · Iconographie

Zéro emoji Unicode.

Si icônes nécessaires : SVG inline 16px, monochrome ivoire ou or, trait 1.5px.

## 8 · Symboles décoratifs autorisés

Uniquement : · (interpoint) — (em-dash) / (slash)

Interdits : étoiles, coches, flèches décoratives, puces typographiques « fancy », etc.

Exception : « → » toléré uniquement dans un CTA bouton.

## 9 · Voix · positionnement

- Pas low-cost. Pas discount. Pas « moins cher que ».
- Pas gratuit (sauf « diagnostic offert » toléré)
- Pas jargon dev (« IA déclarée », « Stack EU », « &lt;1Mo »)
- Pas « hyper », « super », « trop »
- Confiance tranquille, pas démonstration.

## 10 · Pricing

Jamais de prix dans le hero ou avant la preuve.

Le pricing détaillé reste dans `/offres/` et `/tarifs/`.

Aucun « à partir de X € » en page d'accueil.
