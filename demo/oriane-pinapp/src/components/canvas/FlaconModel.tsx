'use client';

import { useRef, useMemo, useEffect, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

// ─── Profil flacon — LatheGeometry (r, y) ────────────────────────────────────
// Proportions inspirées des grands flacons de parfumerie (Chanel N°5, Dior J'adore)
// 22 points de contrôle pour une courbe plus naturelle
function buildFlaconProfile(): THREE.Vector2[] {
  const pts: [number, number][] = [
    // ── Base plate ──
    [0.000, -1.200],  // centre
    [0.420, -1.200],  // bord
    [0.465, -1.155],  // arrondi ext
    // ── Corps ──
    [0.490, -1.000],
    [0.500, -0.700],
    [0.498, -0.200],
    [0.495,  0.200],
    [0.492,  0.500],
    // ── Épaule concave ──
    [0.480,  0.680],
    [0.440,  0.820],
    [0.360,  0.960],
    [0.260,  1.060],
    // ── Col resserré ──
    [0.195,  1.160],
    [0.182,  1.280],
    [0.185,  1.420],
    // ── Bague dorée ──
    [0.210,  1.440],  // début bague
    [0.215,  1.510],
    [0.210,  1.560],  // fin bague
    // ── Goulot ──
    [0.185,  1.560],
    [0.185,  1.780],
    // ── Lèvre ──
    [0.220,  1.790],
    [0.220,  1.840],
    [0.180,  1.840],
    [0.000,  1.840],  // fermeture axiale
  ];
  return pts.map(([r, y]) => new THREE.Vector2(r, y));
}

function buildCapProfile(): THREE.Vector2[] {
  // Capuchon à facettes légèrement bombé
  const pts: [number, number][] = [
    [0.000, 0.000],
    [0.200, 0.000],
    [0.225, 0.030],
    [0.235, 0.100],
    [0.232, 0.400],
    [0.225, 0.620],
    [0.200, 0.720],
    [0.120, 0.760],
    [0.000, 0.760],
  ];
  return pts.map(([r, y]) => new THREE.Vector2(r, y));
}

// ─── Bague décorative entre épaule et col ─────────────────────────────────────
function CollarRing() {
  const geo = useMemo(() => new THREE.TorusGeometry(0.215, 0.014, 8, 64), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={[0, 1.50, 0]} rotation={[Math.PI / 2, 0, 0]}>
      <meshPhysicalMaterial
        color="#C9A84C"
        metalness={1.0}
        roughness={0.06}
        envMapIntensity={3.0}
        clearcoat={1.0}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}

// ─── Fond de flacon ────────────────────────────────────────────────────────────
function FlaconBase() {
  const geo = useMemo(() => new THREE.CylinderGeometry(0.42, 0.42, 0.06, 80), []);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <mesh geometry={geo} position={[0, -1.20, 0]}>
      <meshPhysicalMaterial
        color="#1A0F06"
        metalness={0.05}
        roughness={0.8}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

// ─── Gravure "ORIANE" simulée (quad label) ─────────────────────────────────────
function Label() {
  return (
    <>
      {/* Face avant */}
      <mesh position={[0, -0.05, 0.502]}>
        <planeGeometry args={[0.64, 0.90]} />
        <meshStandardMaterial
          color="#0D0704"
          transparent
          opacity={0.50}
          depthWrite={false}
          roughness={0.6}
        />
      </mesh>
      {/* Face arrière */}
      <mesh position={[0, -0.05, -0.502]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.64, 0.90]} />
        <meshStandardMaterial
          color="#0D0704"
          transparent
          opacity={0.40}
          depthWrite={false}
          roughness={0.6}
        />
      </mesh>
    </>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type FlaconModelHandle = {
  group: THREE.Group | null;
};

type Props = {
  scrollProgress: React.MutableRefObject<number>;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
};

// ─── Composant principal ──────────────────────────────────────────────────────
export const FlaconModel = forwardRef<FlaconModelHandle, Props>(
  function FlaconModel({ scrollProgress, mouseX, mouseY }, ref) {
    const groupRef = useRef<THREE.Group>(null);
    const capRef   = useRef<THREE.Mesh>(null);
    const currentX = useRef(0);
    const currentY = useRef(0);

    // Expose group ref
    useEffect(() => {
      if (ref && typeof ref === 'object') {
        ref.current = { group: groupRef.current };
      }
    });

    const flaconGeo = useMemo(() => new THREE.LatheGeometry(buildFlaconProfile(), 96), []);
    const capGeo    = useMemo(() => new THREE.LatheGeometry(buildCapProfile(), 80), []);

    useEffect(() => {
      return () => { flaconGeo.dispose(); capGeo.dispose(); };
    }, [flaconGeo, capGeo]);

    useFrame((state, delta) => {
      const g = groupRef.current;
      if (!g) return;

      // Mouse rig — lerp delta-based (identique au pattern adrianhajdin)
      const LERP = 1 - Math.pow(0.08, delta);
      currentX.current += (mouseX.current * 0.15 - currentX.current) * LERP;
      currentY.current += (mouseY.current * 0.10 - currentY.current) * LERP;

      g.rotation.x = currentX.current;
      // Rotation Y continue + mouse X
      g.rotation.y = state.clock.elapsedTime * 0.05 + currentY.current;

      // Scroll : le flacon monte et s'éloigne
      const sv = Math.max(0, Math.min(1, scrollProgress.current));
      g.position.y  = sv * 2.5;
      g.position.z  = sv * -3.0;
      g.scale.setScalar(1.0 - sv * 0.2);
    });

    return (
      <Float speed={1.0} rotationIntensity={0.06} floatIntensity={0.22}>
        <group ref={groupRef} position={[0, -0.5, 0]}>
          {/* Corps verre — MeshTransmissionMaterial */}
          <mesh geometry={flaconGeo} castShadow receiveShadow>
            <MeshTransmissionMaterial
              backside
              backsideThickness={0.5}
              transmission={1.0}
              roughness={0.03}
              thickness={1.4}
              ior={1.52}
              chromaticAberration={0.06}
              anisotropy={0.3}
              distortion={0.35}
              distortionScale={0.28}
              temporalDistortion={0.08}
              color="#EED8B8"
              attenuationDistance={0.55}
              attenuationColor="#D4A574"
              resolution={512}
              samples={8}
              envMapIntensity={1.6}
            />
          </mesh>

          {/* Capuchon — or métallique */}
          <mesh
            ref={capRef}
            geometry={capGeo}
            castShadow
            position={[0, 1.84, 0]}
          >
            <meshPhysicalMaterial
              color="#C9A84C"
              metalness={1.0}
              roughness={0.12}
              envMapIntensity={2.5}
              clearcoat={0.8}
              clearcoatRoughness={0.08}
              emissive={new THREE.Color('#8A6A20')}
              emissiveIntensity={0.06}
            />
          </mesh>

          <CollarRing />
          <FlaconBase />
          <Label />
        </group>
      </Float>
    );
  }
);
