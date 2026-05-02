# STATUS — Maison ORIANE · Audit 2026-05-02

## Fix appliqués (commit `e0d33aa0`)

| # | Bug | Fichier | Fix |
|---|-----|---------|-----|
| 1 | Compteur "03/03" débordait sur S5-8 | `Scene4ThreeAubes.tsx` | Guard `progress > 0.005 && < 0.995` |
| 2/3 | S5/S6/S7/S8 invisibles, espaces noirs | S5–S8 tsx | `IntersectionObserver` remplace `ScrollTrigger once:true` |
| 4a | Paillettes S2 invisibles | `Scene2Verser.tsx` | 28 keyframes uniques (valeurs px hardcodées, pas de `var()` dans `calc()`) |
| 4b | Phrase S2 non visible | `Scene2Verser.tsx` | `gsap.set()` au mount, suppression `opacity:0` inline |
| 5 | SparkleRain global invisible | `SparkleRain.tsx` | `CameraFrustumFix` : frustum `left=-1.2/right=1.2` + aspect ratio |

---

## Ce que Lauralie doit vérifier ce matin

### ✅ Attendu après les fix

1. **Scène 2** : En scrollant, le capuchon se lève, **des paillettes jaillissent** vers le haut en éventail, puis la phrase "Capturer l'instant…" apparaît. Le flacon dérive vers le coin haut-droit.

2. **Scène 3** : Les 3 phrases s'affichent UNE PAR UNE au scroll (sans superposition). La ligne verticale se déroule en fin.

3. **Scène 4** : Le compteur `01/03 → 03/03` n'apparaît PAS par-dessus les scènes suivantes.

4. **Scènes 5/6/7/8** : Toutes visibles et animées. Pas d'espaces noirs.

5. **SparkleRain** : Des paillettes dorées tombent en arrière-plan sur l'ensemble du site.

### ⚠️ Points à confirmer visuellement

- **S2 paillettes** : l'éventail doit partir vers le HAUT depuis le capuchon. Si les particules vont dans le mauvais sens, vérifier les angles dans `Scene2Verser.tsx` (ligne `const angle = -160 + (i / (count - 1)) * 140`).

- **SparkleRain taille** : les paillettes peuvent paraître un peu grosses (PointsMaterial size 0.045–0.11 avec le nouveau frustum). Si trop grandes, réduire dans `SparkleRain.tsx` lignes 174/181/188 (`pointSize` → essayer 0.025 / 0.045 / 0.07).

- **S5/S6/S7 timing d'apparition** : avec `threshold: 0.12–0.15`, les éléments se révèlent quand 12-15% de la section est visible. Si trop tardif, baisser à `threshold: 0.05`.

### 🔴 Bugs résiduels potentiels

- **S3 Manifeste timing** : si les 3 phrases semblent trop lentes ou trop rapides, ajuster `end: '+=220%'` dans `Scene3Manifesto.tsx` (plus petit = plus rapide).

- **S2 phrase timing** : la phrase apparaît à 55% du scrub. Si non visible malgré le scroll, tester en réduisant `0.55` à `0.45` dans `Scene2Verser.tsx`.

- **S6 clipPath** : `clip-path: polygon(0 3%, ...)` peut masquer du contenu sur certaines résolutions mobile. Vérifier sur iPhone viewport.

---

## État de la branche

Branche : `cursor/oriane-source-zip-6c99`  
Dernier commit : `e0d33aa0` — fix(audit): 5 bugs visuels  
Dev server : `http://localhost:4321` (à relancer si fermé : `npm run dev`)
