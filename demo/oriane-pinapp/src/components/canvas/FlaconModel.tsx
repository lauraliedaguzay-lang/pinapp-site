'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Préchargement pour éviter le flash
useGLTF.preload('/models/water-bottle.glb');

type Props = {
  scrollProgress: React.MutableRefObject<number>;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
};

export function FlaconModel({ scrollProgress, mouseX, mouseY }: Props) {
  const groupRef   = useRef<THREE.Group>(null);
  const currentX   = useRef(0);
  const currentY   = useRef(0);

  const { nodes } = useGLTF('/models/water-bottle.glb') as {
    nodes: { WaterBottle: THREE.Mesh };
    materials: Record<string, THREE.Material>;
  };

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    // Mouse lerp delta-based
    const LERP = 1 - Math.pow(0.08, delta);
    currentX.current += (mouseX.current * 0.12 - currentX.current) * LERP;
    currentY.current += (mouseY.current * 0.14 - currentY.current) * LERP;

    g.rotation.x = currentX.current;
    g.rotation.y = state.clock.elapsedTime * 0.06 + currentY.current;

    // Scroll drift
    const sv = Math.max(0, Math.min(1, scrollProgress.current));
    g.position.y  =  0.2 + sv * 2.5;
    g.position.z  =  sv * -3.0;
    g.scale.setScalar(1.0 - sv * 0.18);
  });

  return (
    <Float speed={0.9} rotationIntensity={0.05} floatIntensity={0.20}>
      <group ref={groupRef} position={[0, -0.2, 0]} scale={8}>
        {/* Bouteille principale — verre luxe via MeshTransmissionMaterial */}
        <mesh
          geometry={nodes.WaterBottle.geometry}
          castShadow
          receiveShadow
        >
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.5}
            transmission={1.0}
            roughness={0.03}
            thickness={1.4}
            ior={1.52}
            chromaticAberration={0.06}
            anisotropy={0.35}
            distortion={0.35}
            distortionScale={0.28}
            temporalDistortion={0.08}
            color="#EED8B8"
            attenuationDistance={0.6}
            attenuationColor="#D4A574"
            resolution={512}
            samples={8}
            envMapIntensity={1.8}
          />
        </mesh>
      </group>
    </Float>
  );
}
