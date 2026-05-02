'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef } from 'react';
import * as THREE from 'three';
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { CinematicLighting } from './CinematicLighting';
import { GlitterPour } from './GlitterPour';

useGLTF.preload('/models/water-bottle.glb');

// ─── Progression par phase ────────────────────────────────────────────────────
// Phase B (0.25→0.5) : wireframe apparaît
// Phase C (0.5→0.75) : wireframe → PBR
// Phase D (0.75→1.0) : PBR complet + glitter
function wireframeOp(p: number): number {
  if (p < 0.25) return 0;
  if (p < 0.5)  return (p - 0.25) * 4;
  if (p < 0.75) return 1 - (p - 0.5) * 4;
  return 0;
}
function pbrOp(p: number): number {
  if (p < 0.5)  return 0;
  if (p < 0.75) return (p - 0.5) * 4;
  return 1;
}

// ─── Composant 3D interne ─────────────────────────────────────────────────────
interface RevealProps {
  progressRef: React.MutableRefObject<number>;
}

function FlaconReveal({ progressRef }: RevealProps) {
  const groupRef   = useRef<THREE.Group>(null);
  const wireMat    = useRef<THREE.MeshBasicMaterial>(null);
  const pbrMeshRef = useRef<THREE.Mesh>(null);

  const { nodes } = useGLTF('/models/water-bottle.glb') as {
    nodes: { WaterBottle: THREE.Mesh };
    materials: Record<string, THREE.Material>;
  };

  useFrame((state) => {
    const p = progressRef.current;
    const g = groupRef.current;
    if (!g) return;

    // Idle
    g.rotation.y = state.clock.elapsedTime * 0.2;
    g.position.y = -0.5 + Math.sin(state.clock.elapsedTime * 0.5) * 0.04;

    // Wireframe opacity
    if (wireMat.current) wireMat.current.opacity = wireframeOp(p);

    // PBR visibility
    if (pbrMeshRef.current) pbrMeshRef.current.visible = pbrOp(p) > 0.02;
  });

  return (
    <group ref={groupRef} scale={4}>
      {/* Wireframe doré (Phase B → C) */}
      <mesh geometry={nodes.WaterBottle.geometry}>
        <meshBasicMaterial
          ref={wireMat}
          color="#D4A574"
          wireframe
          transparent
          opacity={0}
        />
      </mesh>

      {/* PBR verre (Phase C → D) */}
      <mesh ref={pbrMeshRef} geometry={nodes.WaterBottle.geometry} visible={false}>
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
    </group>
  );
}

// ─── Canvas principal ─────────────────────────────────────────────────────────
interface Props {
  progressRef: React.MutableRefObject<number>;
}

export function FlaconRevealScene({ progressRef }: Props) {
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
      <color attach="background" args={['#0A0805']} />
      <CinematicLighting />
      <Suspense fallback={null}>
        <FlaconReveal  progressRef={progressRef} />
        <GlitterPour   progressRef={progressRef} />
      </Suspense>
    </Canvas>
  );
}
