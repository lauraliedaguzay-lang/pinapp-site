'use client';

import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - THREE.MathUtils.clamp(t, 0, 1), 3);
}

type Props = {
  sceneEpochMs: number;
  reducedMotion: boolean;
};

/**
 * Goutte d'or (sphère) pour l'ouverture Scène 1 — timeline synchronisée sur sceneEpochMs
 * (même origine que FlaconRealisticScene variant scene1).
 */
export function Scene1Drop({ sceneEpochMs, reducedMotion }: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.SphereGeometry(0.28, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F4C977'),
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.2,
      transparent: true,
      opacity: 0,
      emissive: new THREE.Color('#F4C977'),
      emissiveIntensity: 1.2,
    });
    matRef.current = mat;
    return { geometry: geo, material: mat };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame(() => {
    const mesh = meshRef.current;
    const mat = matRef.current;
    if (!mesh || !mat) return;

    if (reducedMotion) {
      mesh.visible = false;
      return;
    }

    const t = (performance.now() - sceneEpochMs) / 1000;

    // Phase 0 : apparition de la goutte (t 0.6→1.2)
    if (t < 0.6) {
      mesh.visible = false;
      mat.opacity = 0;
      mesh.scale.setScalar(0.001);
      return;
    }

    mesh.visible = true;

    if (t < 1.2) {
      const u = easeOutCubic((t - 0.6) / 0.6);
      mat.opacity = u;
      mesh.scale.setScalar(0.4 + u * 0.6);
      return;
    }

    // Phase 1 : goutte stable + légère pulsation (t 1.2→1.8)
    const pulse = 1 + Math.sin((t - 1.2) * 3) * 0.08;

    if (t < 1.8) {
      mat.opacity = 1;
      mesh.scale.setScalar(pulse);
      return;
    }

    // Phase 2 : étirement vers le bas pour fusionner avec le flacon (t 1.8→2.5)
    if (t < 2.5) {
      const stretchU = easeOutCubic((t - 1.8) / 0.7);
      const fade = 1 - stretchU;
      mat.opacity = Math.max(0, fade);
      const sy = 1 + stretchU * 3;
      mesh.scale.set(pulse * (1 - stretchU * 0.4), pulse * sy, pulse * (1 - stretchU * 0.4));
      if (fade < 0.02) mesh.visible = false;
      return;
    }

    mesh.visible = false;
    mat.opacity = 0;
  });

  if (reducedMotion) return null;

  return (
    <>
      <pointLight position={[0, 0.6, 1.5]} color="#F4C977" intensity={6} distance={6} decay={2} />
      <pointLight position={[0.3, 0.2, 1.0]} color="#FFFFFF" intensity={2} distance={4} decay={2} />
      <mesh ref={meshRef} geometry={geometry} material={material} position={[0, 0.5, 0]} visible={false} />
    </>
  );
}
