# Pinapp.fr — Démos immersives **10/10** (Cursor)

> **Objectif :** pages vitrine niveau **Awwwards Site of the Day** pour pinapp.fr — même socle technique, **palette + contenu + photos** adaptés au secteur.  
> **Références d’ambiance :** Carles Faus Arquitectura (SOTD), GKC Architecture (SOTD 2025), sites luxe / éditorial.

---

## Plan d’exécution

| Étape | Action |
|--------|--------|
| **1** | Utiliser ce fichier comme prompt maître dans Cursor → implémenter / itérer la démo ciblée → `git push` → vérifier **https://pinapp.fr** (ou déploiement GitHub Pages / cache DNS selon config). |
| **2** | Répéter pour chaque ligne du tableau **Démos par secteur** (même moteur d’effets, autre univers). |

---

## Démos par secteur

| Démo | Secteur | Style visuel |
|------|---------|----------------|
| **Atelier Rivage** | Architecte | Fait — scroll vertical, photos architecture, or / crème sur sombre. |
| **À faire** | Restaurant gastronomique | Photos plats, ambiance tamisée, **scroll horizontal** (ou sections horizontales + Lenis). |
| **À faire** | Joaillerie / luxe | Fond noir, or, **photos macro** bijoux, typo très fine. |
| **À faire** | Hôtel & spa | Blanc + crème, eau, sérénité, beaucoup d’air. |
| **À faire** | Domaine viticole | Terre, bordeaux, **editorial** (longs blocs, citations). |

Chaque démo réutilise les **mêmes effets signature** (voir ci-dessous), avec **variables CSS** (`--bg`, `--accent`, `--muted`, etc.) et **Unsplash** (ou assets maison) cohérents.

---

## Stack technique (ordre CDN obligatoire)

1. **GSAP** 3.12.x — `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`  
2. **ScrollTrigger** — même CDN, `ScrollTrigger.min.js`  
3. **Split text** — **pas** de Club GSAP : fonction **vanilla** qui wrappe chaque caractère dans `<span class="char">` (espaces → `&nbsp;`).  
4. **Lenis** — `https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js`  
   - Raccordement ScrollTrigger : `lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker.add((t) => lenis.raf(t * 1000))` + `gsap.ticker.lagSmoothing(0)`.  
   - **Ne pas** doubler avec un `requestAnimationFrame` séparé qui appelle aussi `lenis.raf`.

**Interdits pour la perf / la clarté :** preloader plein écran bloquant, Three.js sur les démos marketing (sauf demande explicite).

---

## Effets Awwwards (checklist commune)

| # | Effet | Exigence |
|---|--------|----------|
| 1 | **Curseur custom** | Dot + cercle (lerp ~0.12), états hover **lien** vs **média** (ex. libellé « Voir » sur images), `pointer-events: none`, désactivé **mobile** + `prefers-reduced-motion`. |
| 2 | **Lenis** | Scroll fluide ; refresh `ScrollTrigger` au resize. |
| 3 | **Split text** | Animation d’entrée `gsap.to('.char', { opacity: 1, y: 0, stagger, ease: 'power3.out', scrollTrigger: { start: 'top 85%' } })`. |
| 4 | **Image reveal** | `clip-path: inset(...)` + léger **scale** (ex. 1.15 → 1), `ease: 'power4.inOut'`, `once: true` si pertinent. |
| 5 | **Parallax scroll** | `scrub` sur wrapper ou image (éviter conflit `transform` avec le reveal — séparer wrapper / inner). |
| 6 | **Boutons magnétiques** | `mousemove` → `gsap.to(el, { x, y, ease: 'power2.out' })`, `mouseleave` → retour **elastic** ; désactivé mobile. |
| 7 | **Lignes** | `scaleX: 0` → 1, `transformOrigin: 'left'`, déclenché au scroll. |
| 8 | **Typo** | Au minimum **une serif éditoriale** (ex. Cormorant) + **sans humaniste** (ex. Outfit) ; tailles en `clamp()`. |
| 9 | **Badge Pinapp** | Fixe bas-droite, lien `https://pinapp.fr`, micro-interaction au hover. |
| 10 | **Accessibilité** | `prefers-reduced-motion` : contenu visible, animations coupées ou réduites ; focus clavier sur CTA / nav. |

---

## Performance

- `loading="lazy"` sur images **sauf** hero / above-the-fold.  
- Unsplash : `?w=1920&q=85` (ajuster si besoin).  
- `will-change: transform` ciblé (images / parallax).  
- Pas de double boucle Lenis.

---

## Structure HTML type (scroll vertical)

1. **Hero** (`100vh`) — image plein écran ou `background-image`, overlay, titre + split.  
2. **Intro / manifeste** — citation + ligne animée.  
3. **Blocs projet** — grilles asymétriques, alternance gauche/droite, 1–2 sections **pleine largeur** + texte overlay.  
4. **CTA** — fond clair contrasté (`#F0ECE4` ou variante secteur) + CTA magnétique.  
5. **Footer** minimal + © + mention Pinapp.

---

## Fichiers & déploiement

- Démo architecte actuelle : **`/realisations/cinematiques/architecte.html`** (repo `pinapp-site`).  
- Canonique SEO (si indexation un jour) : `https://pinapp.fr/realisations/cinematiques/architecte.html`.  
- Après modification : `git add -A` → commit message explicite → `git push origin main` → vérifier **Actions** GitHub + site en ligne.

---

## Prompt court à coller dans une nouvelle conversation Cursor

```
Contexte : repo pinapp-site, démo pinapp.fr 10/10.

Lis docs/CURSOR_PINAPP_10_SUR_10.md et applique la checklist (GSAP, ScrollTrigger, Lenis vanilla split, curseur, reveal clip-path, parallax scrub, magnétique, lignes).

Tâche : [DÉCRIRE LA DÉMO — secteur, nom fictif, nombre de sections, contrainte scroll horizontal ou non].

Contraintes : pas de preloader bloquant, pas de Three.js par défaut, mobile sans curseur custom, prefers-reduced-motion respecté.

Livrable : fichier HTML sous /realisations/... + push main.
```

---

## Statut

- **Atelier Rivage** : implémenté dans `realisations/cinematiques/architecte.html` (référence code pour les prochaines démos).  
- **Autres lignes du tableau** : à créer sur le même modèle avec ce document comme contrat qualité.
