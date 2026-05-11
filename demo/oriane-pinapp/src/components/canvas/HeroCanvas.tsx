'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
// PostProcessing désactivé — version mismatch (TODO V11)
// import { EffectComposer, ... } from '@react-three/postprocessing';
import * as THREE from 'three';
import { CinematicLighting } from './CinematicLighting';
import { FlaconModel } from './FlaconModel';
import { BackdropPlane } from './BackdropPlane';

// ─── Fond coloré stable (remplace ShaderMaterial fragile) ───────────────────
// Utilise scene.background via <color attach> — garanti opaque dès frame 1
function SceneBackground() {
  return <color attach="background" args={['#0D0203']} />;
}

// ─── Glow bordeaux CSS-side (via overlay dans Scene1Opening) ─────────────────
// Le shader backdrop était fragile en WebGL2. Le fond radial est en CSS.

// ─── Contenu asynchrone (GLB) ─────────────────────────────────────────────────
type AsyncProps = {
  isMobile: boolean;
  scrollProgress: React.MutableRefObject<number>;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
};

function AsyncContent({ isMobile, scrollProgress, mouseX, mouseY }: AsyncProps) {
  const sparkleCount = isMobile ? 50 : 140;
  return (
    <>
      <FlaconModel scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />

      {/* Paillettes fond */}
      <Sparkles
        count={sparkleCount}
        scale={9}
        size={isMobile ? 1.6 : 2.6}
        speed={0.22}
        opacity={0.5}
        color="#C9A84C"
        position={[0, 0.5, -1.5]}
      />
      {/* Paillettes proches */}
      <Sparkles
        count={Math.floor(sparkleCount * 0.38)}
        scale={3.2}
        size={isMobile ? 1.0 : 1.8}
        speed={0.4}
        opacity={0.65}
        color="#F4E4C1"
        position={[0, 0.2, 0]}
      />
    </>
  );
}

// ─── Canvas principal ─────────────────────────────────────────────────────────
type Props = {
  isMobile: boolean;
  scrollProgress: React.MutableRefObject<number>;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
};

export function HeroCanvas({ isMobile, scrollProgress, mouseX, mouseY }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 36, near: 0.1, far: 50 }}
      gl={{
        alpha: false,
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: 'high-performance',
      }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows={false}
      className="h-full w-full"
    >
      {/* Fond bordeaux opaque — visible dès frame 1, garanti non-transparent */}
      <SceneBackground />
      <BackdropPlane />
      <CinematicLighting />

      {/* Flacon + sparkles — suspendus pendant le chargement GLB */}
      <Suspense fallback={null}>
        <AsyncContent
          isMobile={isMobile}
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  );
}
