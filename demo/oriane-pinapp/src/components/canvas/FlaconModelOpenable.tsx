'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/water-bottle.glb');

type Props = {
  scrollProgress: React.MutableRefObject<number>;
};

export function FlaconModelOpenable({ scrollProgress }: Props) {
  const groupRef = useRef<THREE.Group>(null);
  const capRef   = useRef<THREE.Mesh>(null);

  const { nodes } = useGLTF('/models/water-bottle.glb') as {
    nodes: { WaterBottle: THREE.Mesh };
    materials: Record<string, THREE.Material>;
  };

  useFrame((state, delta) => {
    const g   = groupRef.current;
    const cap = capRef.current;
    if (!g || !cap) return;

    const sv = Math.max(0, Math.min(1, scrollProgress.current));

    // Idle float
    g.position.y = Math.sin(state.clock.elapsedTime * 0.55) * 0.04;
    // Slow ambient rotation
    g.rotation.y += delta * 0.15;

    // Scroll → zoom
    const targetScale = 4 * (1 + sv * 0.4);
    const cs = g.scale.x;
    g.scale.setScalar(cs + (targetScale - cs) * 0.06);

    // Scroll → capuchon s'élève
    const targetCapY = 0.4 + sv * 0.8;
    cap.position.y += (targetCapY - cap.position.y) * 0.08;
  });

  return (
    <group ref={groupRef} scale={4} position={[0, 0, 0]}>
      {/* Corps du flacon — verre luxe via MeshTransmissionMaterial */}
      <mesh geometry={nodes.WaterBottle.geometry} castShadow receiveShadow>
        <MeshTransmissionMaterial
          backside
          backsideThickness={0.4}
          transmission={0.95}
          roughness={0.05}
          thickness={1.2}
          ior={1.52}
          chromaticAberration={0.06}
          anisotropy={0.3}
          distortion={0.4}
          distortionScale={0.28}
          temporalDistortion={0.06}
          color="#F4E4C1"
          attenuationDistance={0.5}
          attenuationColor="#D4A574"
          resolution={512}
          samples={8}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Capuchon doré — cylindre placeholder (GLB single-mesh WaterBottle) */}
      <mesh ref={capRef} position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.18, 0.2, 0.15, 32]} />
        <meshPhysicalMaterial
          color="#D4A574"
          metalness={1.0}
          roughness={0.15}
          envMapIntensity={2.0}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {/* Halo doré pulsant à l'ouverture */}
      <pointLight
        position={[0, 0.3, 0]}
        intensity={2}
        color="#F4C977"
        distance={2}
        decay={2}
      />
    </group>
  );
}
