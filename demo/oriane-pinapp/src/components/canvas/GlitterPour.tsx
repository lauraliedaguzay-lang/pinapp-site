'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  progressRef: React.MutableRefObject<number>;
}

const PARTICLE_COUNT = 400;

function glitterIntensity(p: number) {
  if (p < 0.7) return 0;
  return (p - 0.7) / 0.3;
}

export function GlitterPour({ progressRef }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const matRef    = useRef<THREE.PointsMaterial>(null);

  const { positions, phases, colors } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const phases    = new Float32Array(PARTICLE_COUNT);
    const colors    = new Float32Array(PARTICLE_COUNT * 3);

    const colorA = new THREE.Color('#F4C977');
    const colorB = new THREE.Color('#F4E4C1');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 0.4;
      positions[i * 3 + 1] = 3; // hors vue au départ
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.4;

      phases[i] = Math.random() * 4;

      const c = Math.random() > 0.5 ? colorA : colorB;
      colors[i * 3]     = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return { positions, phases, colors };
  }, []);

  useFrame((state) => {
    if (!pointsRef.current || !matRef.current) return;

    const intensity = glitterIntensity(progressRef.current);

    // Opacité directe sur le matériau — pas de re-render React
    matRef.current.opacity = 0.9 * intensity;

    if (intensity < 0.01) return; // skip calcul si invisible

    const elapsed = state.clock.elapsedTime;
    const attr = pointsRef.current.geometry.attributes.position;
    const arr = attr.array as Float32Array;
    const cycleTime = 4;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const isActive = i / PARTICLE_COUNT < intensity;
      if (!isActive) {
        arr[i * 3 + 1] = 3; // cache
        continue;
      }
      const t = ((elapsed + phases[i]) % cycleTime) / cycleTime;
      arr[i * 3]     = Math.sin(t * Math.PI * 2 + phases[i]) * 0.3;
      arr[i * 3 + 1] = 2.5 - t * 4.5;
      arr[i * 3 + 2] = Math.cos(t * Math.PI * 2 + phases[i]) * 0.3;
    }
    attr.needsUpdate = true;

    pointsRef.current.rotation.y = elapsed * 0.1;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={PARTICLE_COUNT}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={PARTICLE_COUNT}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
