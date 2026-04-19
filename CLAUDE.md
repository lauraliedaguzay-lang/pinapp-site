# PINAPP — Notes cerveau stratégique (Claude)

Ce fichier documente la doctrine **pinapp.fr vs sites clients** pour tout agent qui lit le dépôt sans passer par `.cursorrules`.

## Règle fondatrice · pinapp.fr vs sites clients

**Distinction critique** : Pinapp produit 2 types de sites, chacun avec ses règles opposées.

### pinapp.fr (vaisseau-amiral Pinapp)

C'est la **vitrine Pinapp elle-même**. Elle peut assumer un **voyage cinématique scroll-driven** avec parallax multi-couches et sections pinnées. C'est le showcase qui prouve le savoir-faire auprès des prospects TPE/PME.

**Autorisé et attendu (quand le chantier le prévoit, ex. refonte V2)** :

- Scroll narratif plein écran (scènes plan-séquence type Passengers / 1917)
- Parallax multi-couches (scale, clip-path, transforms sur calques dédiés)
- Pin ScrollTrigger pendant la lecture d'une scène
- Canvas particules (densité selon scène, plafond raisonnable)
- Cross-fade, blur-reveal sur contenu, text split
- Hero plein écran cinéma, accents biolumi (cyan, violet, magenta)

**Obligatoire malgré tout (garde-fous)** :

- `prefers-reduced-motion: reduce` désactive le spectacle lourd (CSS + JS)
- Bouton **Mode sobre** visible (ex. menu hamburger) : coupe le scroll narratif, navigation classique par ancres
- Textes marketing dans le **HTML visible**, jamais Canvas seul (SEO)
- Performance : budget global cible raisonnable (ex. ≤ ~2 Mo assets critiques), LCP cible ≤ 1,5 s desktop / ≤ 2,5 s mobile 4G, Lighthouse ≥ 90 (perf / a11y / SEO) objectifs
- Mode `.low-perf` si `navigator.hardwareConcurrency < 4` : moins de particules, moins de blur

### Sites clients Pinapp (démos, vitrines livrées, etc.)

**Inverse** : sobriété, pas de parallax décoratif gratuit, pas de scroll narratif imposé si ce n'est pas le brief. La marque **client** prime ; conversion > immersion. Voir `.cursor/rules/pinapp-zero-scroll.mdc`.

### Principe de décision

> Avant une animation scroll-driven ou une parallax : **c'est pinapp.fr (vitrine) ou un site client ?**
>
> - **pinapp.fr** → immersion cinéma **assumée** si documenté (ex. `PINAPP_CURSOR_V2_MASTER.md`)
> - **Site client** → règle **zéro scroll / pas de parallax décorative** du dépôt

### Abrogation ciblée

Les règles générales « zéro scroll » / « pas de parallax sur le scroll » **ne s'appliquent pas** à la **home pinapp.fr** en mode **voyage cinématique V2** validé sur la branche de refonte. Elles **restent** pour les sites et démos clients.

---

*Aligné avec `.cursorrules` (section du même nom) et `PINAPP_CURSOR_V2_MASTER.md`.*
