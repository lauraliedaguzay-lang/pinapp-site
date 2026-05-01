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
    const geo = new THREE.SphereGeometry(0.15, 32, 32);
    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F4C977'),
      metalness: 0,
      roughness: 0.05,
      transmission: 0.3,
      transparent: true,
      opacity: 0,
      emissive: new THREE.Color('#F4C977'),
      emissiveIntensity: 0.4,
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

    if (t < 1) {
      mesh.visible = false;
      mat.opacity = 0;
      mesh.scale.setScalar(0.0001);
      return;
    }

    mesh.visible = true;

    if (t < 1.5) {
      const u = easeOutCubic((t - 1) / 0.5);
      mat.opacity = u;
      mesh.scale.setScalar(u);
      return;
    }

    const pulse = 1 + Math.sin((t - 1.5) * 2) * 0.1;

    if (t < 1.8) {
      const stretchU = easeOutCubic((t - 1.5) / 0.3);
      const sy = 1 + stretchU * 1.5;
      mesh.scale.set(pulse, pulse * sy, pulse);
      mat.opacity = 1;
      return;
    }

    if (t < 2.5) {
      const fade = 1 - easeOutCubic((t - 1.8) / 0.7);
      mat.opacity = Math.max(0, fade);
      mesh.scale.set(pulse, pulse * 2.5, pulse);
      if (fade < 0.02) mesh.visible = false;
      return;
    }

    mesh.visible = false;
    mat.opacity = 0;
  });

  if (reducedMotion) return null;

  return (
    <>
      <pointLight position={[0.4, 0.5, 1.2]} color="#F4C977" intensity={2} distance={5} decay={2} />
      <mesh ref={meshRef} geometry={geometry} material={material} position={[0, 0, 0]} visible={false} />
    </>
  );
}
