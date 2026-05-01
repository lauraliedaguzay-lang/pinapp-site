'use client';

import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const COUNT = 200;

type ContactCanvasProps = {
  active?: boolean;
};

/** Scène R3F (à placer dans `<Canvas>` parent). */
export function ContactCanvas({ active = true }: ContactCanvasProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const baseY = useRef<Float32Array | null>(null);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    baseY.current = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      baseY.current[i] = positions[i * 3 + 1]!;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    const g = groupRef.current;
    if (g) g.rotation.y = t * 0.1;

    const pts = pointsRef.current;
    const base = baseY.current;
    if (!pts || !base) return;
    const posAttr = pts.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < COUNT; i++) {
      const y = base[i]! + Math.sin(t * 1.2 + i * 0.15) * 0.35;
      posAttr.setY(i, y);
    }
    posAttr.needsUpdate = true;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={45} position={[0, 0, 5]} />
      <ambientLight intensity={0.35} />
      <group ref={groupRef}>
        <points ref={pointsRef} geometry={geometry}>
          <pointsMaterial
            color={new THREE.Color('#D4A574')}
            size={0.05}
            transparent
            opacity={0.7}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            sizeAttenuation
          />
        </points>
      </group>
    </>
  );
}
