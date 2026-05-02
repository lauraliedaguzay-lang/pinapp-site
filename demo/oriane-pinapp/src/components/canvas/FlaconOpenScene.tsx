'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { CinematicLighting } from './CinematicLighting';
import { FlaconModelOpenable } from './FlaconModelOpenable';

type Props = {
  scrollProgress: React.MutableRefObject<number>;
};

export function FlaconOpenScene({ scrollProgress }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.5], fov: 38, near: 0.1, far: 50 }}
      gl={{
        alpha: false,
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      shadows={false}
      className="h-full w-full"
    >
      {/* Fond opaque — visible dès frame 1 */}
      <color attach="background" args={['#0A0805']} />

      {/* Éclairage cinématique — HORS Suspense pour visibilité immédiate */}
      <CinematicLighting />

      {/* Flacon GLB — dans Suspense pendant le chargement */}
      <Suspense fallback={null}>
        <FlaconModelOpenable scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  );
}
