# STATUS — Maison ORIANE · Audit 2026-05-02 (session 3)

## Hero V5 livré (commit `b082d7ec`)

### Ce que Lauralie doit voir en ouvrant `http://localhost:4321`

**Scène 1 — Hero V5 photorealistic 3D**

1. **Fond** : noir profond avec halo bordeaux pulsant + lueur dorée centrale (shader GLSL).
2. **Flacon** : procédural LatheGeometry, verre semi-transparent teinté or pâle. MeshTransmissionMaterial avec réflexions, distorsion subtile, et aberration chromatique. Capuchon doré métallique.
3. **Sparkles** : paillettes dorées à deux niveaux de profondeur — fond large (scale 8) + proches du flacon (scale 3).
4. **Titre ORIANE** : apparaît avec `blur(12px) → 0` + translateY, `mix-blend-mode: screen` pour fusion avec les lumières 3D.
5. **Mouse parallax** : bouger la souris incline doucement le flacon (lerp 8%/frame).
6. **Scroll** : en scrollant, le flacon dérive vers le haut et recule légèrement — transition douce vers la Scène 2.
7. **Postprocessing** (desktop uniquement) : Bloom sur le flacon + sparkles, légère aberration chromatique sur les bords, vignette.

---

## ⚠️ Points à calibrer visuellement

| Élément | Réglage | Fichier · Ligne |
|---------|---------|-----------------|
| Bloom trop fort | Réduire `intensity` de 1.15 → 0.7 | `Scene1Opening.tsx` `<Bloom intensity={...}` |
| DOF trop flou | Réduire `bokehScale` 2.8 → 1.5 | `<DepthOfField bokehScale={...}` |
| Flacon trop petit/grand | Ajuster `position={[0, 0, 5.5]}` de la camera | `<Canvas camera={{ position: [0,0,5.5] ...}` |
| Sparkles trop denses | Réduire `count` : 150 → 80 / 60 → 30 | `<Sparkles count={...}` (2 instances) |
| Flacon trop sombre | Augmenter `envMapIntensity` sur MeshTransmissionMaterial 1.4 → 2.0 | `Scene1Opening.tsx` |
| Capuchon trop brillant | Réduire `envMapIntensity` sur meshPhysicalMaterial 2.2 → 1.5 | même fichier |
| Glass trop transparent | Réduire `transmission` 0.96 → 0.88 | MeshTransmissionMaterial |
| Halo backdrop trop intense | Réduire `r2` multiplication 0.18 → 0.10 | GLSL fragment shader |

---

## 🔴 Bugs potentiels

- **Flacon invisible au premier load** : si le Suspense ne résout pas, vérifier console — peut-être un import `@react-three/postprocessing` qui échoue côté client.
- **ChromaticAberration TS warning** : le prop `offset` accepte `Vector2` mais les types postprocessing peuvent déclarer `[number, number]`. Si erreur console, cast déjà appliqué `as unknown as`.
- **Performance mobile** : si frame rate < 30fps sur mobile, désactiver aussi les Sparkles en mobile (passer count=0).
- **Float rotation conflict** : `<Float>` applique sa propre rotation — peut sembler instable avec la rotation souris. Si trop de mouvement, réduire `rotationIntensity={0.08}` → 0.

---

## État de la branche

Branche : `cursor/oriane-source-zip-6c99`
Dernier commit : `b082d7ec` — feat(scene-1): rebuild Hero V5 photorealistic 3D parfumerie cinema-grade
Dev server : `http://localhost:4321` (à relancer si fermé : `npm run dev`)

---

## Fixes précédents (session 2 — commit `e0d33aa0`)

| # | Bug | Fix |
|---|-----|-----|
| 1 | Compteur "03/03" débordait sur S5-8 | Guard `progress > 0.005 && < 0.995` |
| 2/3 | S5/S6/S7/S8 invisibles | `IntersectionObserver` remplace `ScrollTrigger once:true` |
| 4a | Paillettes S2 invisibles | 28 keyframes uniques valeurs px hardcodées |
| 4b | Phrase S2 non visible | `gsap.set()` au mount, suppression `opacity:0` inline |
| 5 | SparkleRain global invisible | `CameraFrustumFix` : frustum `left=-1.2/right=1.2` |
