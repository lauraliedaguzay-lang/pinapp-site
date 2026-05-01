'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, PerspectiveCamera } from '@react-three/drei';
import type { MutableRefObject } from 'react';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

export type FlaconV3Phase = 'line' | 'morph' | 'visible';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

function EnableLocalClipping() {
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
    return () => {
      gl.localClippingEnabled = false;
    };
  }, [gl]);
  return null;
}

type SceneProps = {
  startTime: number;
  phaseRef: MutableRefObject<FlaconV3Phase>;
  reducedMotion: boolean;
  active: boolean;
  latheSegments: number;
  mouseX: number;
  mouseY: number;
  cameraFov: number;
};

function FlaconScene({
  startTime,
  phaseRef,
  reducedMotion,
  active,
  latheSegments,
  mouseX,
  mouseY,
  cameraFov,
}: SceneProps) {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Mesh>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  const capGroupRef = useRef<THREE.Group>(null);
  const clipPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.5));

  const camBase = useMemo(() => new THREE.Vector3(0, 0, 5.5), []);

  const {
    bodyGeo,
    liquidGeo,
    capGeo,
    ringGeo,
    bodyMat,
    liquidMat,
    capMat,
    ringMat,
  } = useMemo(() => {
    const profilePoints = [
      new THREE.Vector2(0, -1.4),
      new THREE.Vector2(0.95, -1.4),
      new THREE.Vector2(1.05, -1.2),
      new THREE.Vector2(1.15, -0.8),
      new THREE.Vector2(1.18, -0.4),
      new THREE.Vector2(1.1, 0.0),
      new THREE.Vector2(0.85, 0.4),
      new THREE.Vector2(0.55, 0.7),
      new THREE.Vector2(0.4, 0.95),
      new THREE.Vector2(0.4, 1.15),
      new THREE.Vector2(0, 1.15),
    ];
    const bodyGeometry = new THREE.LatheGeometry(profilePoints, latheSegments);
    const innerProfile = profilePoints.map((p) => new THREE.Vector2(p.x * 0.92, p.y));
    const liquidGeometry = new THREE.LatheGeometry(innerProfile, latheSegments);
    const capGeometry = new THREE.CylinderGeometry(0.55, 0.45, 0.55, latheSegments);
    const ringGeometry = new THREE.TorusGeometry(0.42, 0.05, 16, latheSegments);

    const bodyMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C49A8A'),
      metalness: 0,
      roughness: 0.05,
      transmission: 1,
      transparent: true,
      opacity: 0,
      thickness: 1.5,
      ior: 1.5,
      side: THREE.DoubleSide,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color('#E8C5C0'),
      attenuationDistance: 0.5,
      envMapIntensity: 1.5,
    });

    const liquidMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#F4C977'),
      metalness: 0,
      roughness: 0.1,
      transmission: 0.3,
      transparent: true,
      opacity: 0.92,
      ior: 1.33,
      side: THREE.DoubleSide,
      clippingPlanes: [clipPlane.current],
      clipShadows: false,
    });

    const capMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4a574,
      metalness: 1,
      roughness: 0.15,
      clearcoat: 1,
      transparent: true,
      opacity: 0,
      envMapIntensity: 1.5,
    });

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd4a574,
      metalness: 1,
      roughness: 0.18,
      transparent: true,
      opacity: 0,
      envMapIntensity: 1.2,
    });

    return {
      bodyGeo: bodyGeometry,
      liquidGeo: liquidGeometry,
      capGeo: capGeometry,
      ringGeo: ringGeometry,
      bodyMat: bodyMaterial,
      liquidMat: liquidMaterial,
      capMat: capMaterial,
      ringMat: ringMaterial,
    };
  }, [latheSegments]);

  useEffect(() => {
    return () => {
      bodyGeo.dispose();
      liquidGeo.dispose();
      capGeo.dispose();
      ringGeo.dispose();
      bodyMat.dispose();
      liquidMat.dispose();
      capMat.dispose();
      ringMat.dispose();
    };
  }, [bodyGeo, liquidGeo, capGeo, ringGeo, bodyMat, liquidMat, capMat, ringMat]);

  useFrame((state) => {
    if (!active) return;
    const elapsed = (performance.now() - startTime) / 1000;
    const t = state.clock.elapsedTime;

    if (reducedMotion) {
      bodyMat.opacity = 0.72;
      bodyMat.transmission = 0.92;
      liquidMat.clippingPlanes = [];
      clipPlane.current.set(new THREE.Vector3(0, 1, 0), 1.4);
      if (liquidRef.current) liquidRef.current.position.y = 0;
      if (capGroupRef.current) capGroupRef.current.position.y = 1.45;
      capMat.opacity = 1;
      ringMat.opacity = 1;
      camera.position.copy(camBase);
      camera.lookAt(0, 0, 0);
      phaseRef.current = 'visible';
      if (groupRef.current) groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
      return;
    }

    const orbitX = mouseX * 0.35;
    const orbitY = mouseY * 0.22;
    camera.position.set(camBase.x + orbitX, camBase.y + orbitY, camBase.z);
    camera.lookAt(0, 0, 0);

    if (elapsed < 1) {
      phaseRef.current = 'line';
      bodyMat.opacity = 0;
      capMat.opacity = 0;
      ringMat.opacity = 0;
    } else if (elapsed < 2.5) {
      phaseRef.current = 'morph';
      const u = easeOutCubic((elapsed - 1) / 1.5);
      bodyMat.opacity = u * 0.78;
      capMat.opacity = Math.max(0, (u - 0.35) / 0.65);
      ringMat.opacity = Math.max(0, (u - 0.5) / 0.5);
    } else {
      phaseRef.current = 'visible';
      bodyMat.opacity = 0.78;
      capMat.opacity = 1;
      ringMat.opacity = 1;
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.05;
    }

    liquidMat.clippingPlanes = [clipPlane.current];
    if (elapsed < 1.2) {
      clipPlane.current.set(new THREE.Vector3(0, 1, 0), -1.5);
    } else if (elapsed < 2.2) {
      const u = easeOutCubic((elapsed - 1.2) / 1);
      clipPlane.current.set(new THREE.Vector3(0, 1, 0), -1.5 + u * 2.9);
    } else {
      clipPlane.current.set(new THREE.Vector3(0, 1, 0), 1.4);
    }

    if (elapsed >= 1 && elapsed < 2.5) {
      const u = easeOutCubic((elapsed - 1) / 1.5);
      if (capGroupRef.current) capGroupRef.current.position.y = 4 - u * 2.55;
    } else if (elapsed >= 2.5) {
      if (capGroupRef.current) capGroupRef.current.position.y = 1.45;
    } else if (capGroupRef.current) {
      capGroupRef.current.position.y = 4;
    }
  });

  return (
    <>
      <EnableLocalClipping />
      <PerspectiveCamera makeDefault fov={cameraFov} position={[0, 0, 5.5]} />
      <ambientLight intensity={0.2} color="#F0E5D0" />
      <directionalLight intensity={2.5} position={[4, 5, 5]} color="#F4C977" />
      <directionalLight intensity={1} position={[-3, 2, -3]} color="#4A1F1F" />
      <directionalLight intensity={0.4} position={[0, -2, 3]} color="#C49A8A" />
      <Suspense fallback={null}>
        <Environment preset="night" />
      </Suspense>

      <group ref={groupRef} scale={0.266}>
        <mesh ref={bodyRef} geometry={bodyGeo} material={bodyMat} />
        <mesh ref={liquidRef} geometry={liquidGeo} material={liquidMat} />
        <group ref={capGroupRef} position={[0, 4, 0]}>
          <mesh geometry={capGeo} material={capMat} />
        </group>
        <group position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh geometry={ringGeo} material={ringMat} />
        </group>
      </group>
    </>
  );
}

type Props = {
  startTime: number;
  phaseRef: MutableRefObject<FlaconV3Phase>;
  reducedMotion?: boolean;
  active?: boolean;
  latheSegments?: number;
  mouseX?: number;
  mouseY?: number;
  cameraFov?: number;
};

export function FlaconRealistic({
  startTime,
  phaseRef,
  reducedMotion = false,
  active = true,
  latheSegments = 64,
  mouseX = 0,
  mouseY = 0,
  cameraFov = 35,
}: Props) {
  return (
    <Canvas
      className="h-full w-full"
      gl={{ alpha: true, antialias: true, localClippingEnabled: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <FlaconScene
          startTime={startTime}
          phaseRef={phaseRef}
          reducedMotion={reducedMotion}
          active={active}
          latheSegments={latheSegments}
          mouseX={mouseX}
          mouseY={mouseY}
          cameraFov={cameraFov}
        />
      </Suspense>
    </Canvas>
  );
}
