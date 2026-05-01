'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import type { MutableRefObject } from 'react';
import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  CylinderGeometry,
  DoubleSide,
  EdgesGeometry,
  Group,
  LatheGeometry,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhysicalMaterial,
  NormalBlending,
  Plane,
  Points,
  PointsMaterial,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three';

export type FlaconPhase = 'building' | 'visible' | 'fading';

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);
}

function easeOutQuad(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return 1 - (1 - x) * (1 - x);
}

function easeInOutCubic(t: number) {
  const x = Math.min(1, Math.max(0, t));
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

function makeSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,248,220,0.85)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
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

type GoldDustProps = {
  startTime: number;
  reducedMotion: boolean;
  active: boolean;
};

function GoldDust({ startTime, reducedMotion, active }: GoldDustProps) {
  const pointsRef = useRef<Points>(null);
  const matRef = useRef<PointsMaterial>(null);
  const count = reducedMotion ? 100 : 300;

  const { geo, startPos, targetPos, sparkleMap } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const start = new Float32Array(count * 3);
    const target = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      const r = 8 * (0.85 + Math.random() * 0.15);
      const x = r * Math.sin(v) * Math.cos(u);
      const y = r * Math.sin(v) * Math.sin(u);
      const z = r * Math.cos(v);
      start[i * 3] = x;
      start[i * 3 + 1] = y;
      start[i * 3 + 2] = z;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      const u2 = Math.random() * Math.PI * 2;
      const v2 = Math.acos(2 * Math.random() - 1);
      const r2 = 2.5 * (0.4 + Math.random() * 0.6);
      target[i * 3] = r2 * Math.sin(v2) * Math.cos(u2);
      target[i * 3 + 1] = r2 * Math.sin(v2) * Math.sin(u2);
      target[i * 3 + 2] = r2 * Math.cos(v2);
    }
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(positions, 3));
    const map = makeSparkleTexture();
    return { geo: g, startPos: start, targetPos: target, sparkleMap: map };
  }, [count]);

  const pointsMaterial = useMemo(() => {
    const m = new PointsMaterial({
      color: 0xd4a574,
      map: sparkleMap ?? undefined,
      size: 0.045,
      transparent: true,
      opacity: 0,
      depthWrite: false,
      blending: NormalBlending,
      sizeAttenuation: true,
    });
    matRef.current = m;
    return m;
  }, [sparkleMap]);

  useEffect(() => {
    return () => {
      geo.dispose();
      pointsMaterial.dispose();
      sparkleMap?.dispose();
    };
  }, [geo, pointsMaterial, sparkleMap]);

  useFrame((state) => {
    if (!active) return;
    const elapsed = (performance.now() - startTime) / 1000;
    const t = state.clock.elapsedTime;
    const pts = pointsRef.current;
    const mat = matRef.current;
    if (!pts || !mat) return;

    const posAttr = pts.geometry.attributes.position;
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;

    if (reducedMotion) {
      mat.opacity = 0.55;
      for (let i = 0; i < count; i++) {
        const idx = i * 3;
        const u = easeOutCubic(Math.min(1, (elapsed - 0.5) / 2));
        arr[idx] = startPos[idx]! * (1 - u) + targetPos[idx]! * u;
        arr[idx + 1] = startPos[idx + 1]! * (1 - u) + targetPos[idx + 1]! * u;
        arr[idx + 2] = startPos[idx + 2]! * (1 - u) + targetPos[idx + 2]! * u;
        arr[idx] += Math.sin(t * 0.3 + i) * 0.001;
        arr[idx + 1] += Math.cos(t * 0.25 + i) * 0.0008;
        arr[idx + 2] += Math.sin(t * 0.28 + i * 0.7) * 0.001;
      }
      posAttr.needsUpdate = true;
      pts.rotation.y = t * 0.03;
      return;
    }

    if (elapsed < 0.5) {
      mat.opacity = 0;
    } else if (elapsed < 2) {
      mat.opacity = easeOutCubic((elapsed - 0.5) / 1.5) * 0.9;
    } else {
      mat.opacity = 0.85 + Math.sin(t * 3.2) * 0.08;
    }

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      let x = arr[idx]!;
      let y = arr[idx + 1]!;
      let z = arr[idx + 2]!;

      if (elapsed >= 0.5 && elapsed < 2.5) {
        const u = easeOutCubic((elapsed - 0.5) / 2);
        x = startPos[idx]! * (1 - u) + targetPos[idx]! * u;
        y = startPos[idx + 1]! * (1 - u) + targetPos[idx + 1]! * u;
        z = startPos[idx + 2]! * (1 - u) + targetPos[idx + 2]! * u;
      }

      x += Math.sin(t * 0.5 + i * 0.7) * 0.002;
      y += Math.cos(t * 0.4 + i * 0.9) * 0.0015 + 0.0008;
      z += Math.sin(t * 0.6 + i * 0.5) * 0.002;

      const distSq = x * x + y * y + z * z;
      if (distSq > 16) {
        const ang = Math.random() * Math.PI * 2;
        const rad = 1 + Math.random() * 2;
        x = Math.cos(ang) * rad;
        y = (Math.random() - 0.5) * 3;
        z = Math.sin(ang) * rad;
      }

      arr[idx] = x;
      arr[idx + 1] = y;
      arr[idx + 2] = z;
    }
    posAttr.needsUpdate = true;
    pts.rotation.y = t * 0.05;
  });

  return (
    <points ref={pointsRef} geometry={geo} material={pointsMaterial} />
  );
}

type SceneProps = {
  startTime: number;
  phaseRef: MutableRefObject<FlaconPhase>;
  reducedMotion: boolean;
  active: boolean;
};

function FlaconScene({ startTime, phaseRef, reducedMotion, active }: SceneProps) {
  const { camera } = useThree();
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const liquidRef = useRef<Mesh>(null);
  const capGroupRef = useRef<Group>(null);
  const bodyLinesRef = useRef<LineSegments>(null);
  const clipPlane = useRef(new Plane(new Vector3(0, 1, 0), -1.5));

  const camKey = useMemo(
    () => [
      new Vector3(0, 0, 7),
      new Vector3(0.3, 0.2, 5.5),
      new Vector3(0, 0, 5),
    ],
    [],
  );

  const {
    bodyGeo,
    liquidGeo,
    capGeo,
    ringGeo,
    bodyEdgesGeo,
    capEdgesGeo,
    ringEdgesGeo,
    bodyMat,
    liquidMat,
    capMat,
    ringMat,
    bodyLineMat,
    capLineMat,
    ringLineMat,
  } = useMemo(() => {
    const profilePoints = [
      new Vector2(0, -1.4),
      new Vector2(0.95, -1.4),
      new Vector2(1.05, -1.2),
      new Vector2(1.15, -0.8),
      new Vector2(1.18, -0.4),
      new Vector2(1.1, 0.0),
      new Vector2(0.85, 0.4),
      new Vector2(0.55, 0.7),
      new Vector2(0.4, 0.95),
      new Vector2(0.4, 1.15),
      new Vector2(0, 1.15),
    ];
    const bodyGeometry = new LatheGeometry(profilePoints, 48);
    const innerProfile = profilePoints.map((p) => new Vector2(p.x * 0.92, p.y));
    const liquidGeometry = new LatheGeometry(innerProfile, 48);
    const capGeometry = new CylinderGeometry(0.55, 0.45, 0.55, 48);
    const ringGeometry = new TorusGeometry(0.42, 0.05, 16, 48);

    const bodyEdgesGeometry = new EdgesGeometry(bodyGeometry, 1);
    const capEdgesGeometry = new EdgesGeometry(capGeometry, 1);
    const ringEdgesGeometry = new EdgesGeometry(ringGeometry, 1);

    const bodyMaterial = new MeshPhysicalMaterial({
      color: 0xe8c5c0,
      metalness: 0,
      roughness: 0.05,
      transmission: 0.85,
      transparent: true,
      opacity: 0,
      thickness: 0.5,
      ior: 1.45,
      side: DoubleSide,
      clearcoat: 1,
      clearcoatRoughness: 0.15,
      envMapIntensity: 0.8,
    });

    const liquidMaterial = new MeshPhysicalMaterial({
      color: 0xd4a574,
      metalness: 0,
      roughness: 0.15,
      transmission: 0.4,
      transparent: true,
      opacity: 0.85,
      ior: 1.33,
      side: DoubleSide,
      clippingPlanes: [clipPlane.current],
      clipShadows: false,
    });

    const capMaterial = new MeshPhysicalMaterial({
      color: 0xd4a574,
      metalness: 0.85,
      roughness: 0.25,
      clearcoat: 1,
      transparent: true,
      opacity: 0,
    });

    const ringMaterial = new MeshPhysicalMaterial({
      color: 0xd4a574,
      metalness: 0.95,
      roughness: 0.2,
      transparent: true,
      opacity: 0,
    });

    const bl = new LineBasicMaterial({
      color: 0x1a1614,
      transparent: true,
      opacity: 0,
    });
    const cl = new LineBasicMaterial({
      color: 0x1a1614,
      transparent: true,
      opacity: 0,
    });
    const rl = new LineBasicMaterial({
      color: 0x1a1614,
      transparent: true,
      opacity: 0,
    });

    return {
      bodyGeo: bodyGeometry,
      liquidGeo: liquidGeometry,
      capGeo: capGeometry,
      ringGeo: ringGeometry,
      bodyEdgesGeo: bodyEdgesGeometry,
      capEdgesGeo: capEdgesGeometry,
      ringEdgesGeo: ringEdgesGeometry,
      bodyMat: bodyMaterial,
      liquidMat: liquidMaterial,
      capMat: capMaterial,
      ringMat: ringMaterial,
      bodyLineMat: bl,
      capLineMat: cl,
      ringLineMat: rl,
    };
  }, []);

  useEffect(() => {
    return () => {
      bodyGeo.dispose();
      liquidGeo.dispose();
      capGeo.dispose();
      ringGeo.dispose();
      bodyEdgesGeo.dispose();
      capEdgesGeo.dispose();
      ringEdgesGeo.dispose();
      bodyMat.dispose();
      liquidMat.dispose();
      capMat.dispose();
      ringMat.dispose();
      bodyLineMat.dispose();
      capLineMat.dispose();
      ringLineMat.dispose();
    };
  }, [
    bodyGeo,
    liquidGeo,
    capGeo,
    ringGeo,
    bodyEdgesGeo,
    capEdgesGeo,
    ringEdgesGeo,
    bodyMat,
    liquidMat,
    capMat,
    ringMat,
    bodyLineMat,
    capLineMat,
    ringLineMat,
  ]);

  useFrame((state) => {
    if (!active) return;
    const elapsed = (performance.now() - startTime) / 1000;
    const t = state.clock.elapsedTime;

    if (!reducedMotion) {
      if (elapsed < 3) {
        let u = 0;
        if (elapsed < 1.5) {
          u = easeInOutCubic(elapsed / 1.5);
          camera.position.lerpVectors(camKey[0]!, camKey[1]!, u);
        } else {
          u = easeInOutCubic((elapsed - 1.5) / 1.5);
          camera.position.lerpVectors(camKey[1]!, camKey[2]!, u);
        }
      } else {
        const bx = Math.sin(t * 0.2) * 0.1;
        const by = Math.sin(t * 0.22) * 0.08;
        camera.position.set(bx, by, 5);
      }
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.set(0, 0, 5);
      camera.lookAt(0, 0, 0);
    }

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
    }

    if (reducedMotion) {
      bodyLineMat.opacity = 0;
      capLineMat.opacity = 0;
      ringLineMat.opacity = 0;
      bodyMat.opacity = 0.65;
      liquidMat.clippingPlanes = [];
      if (liquidRef.current) liquidRef.current.position.y = 0;
      if (capGroupRef.current) capGroupRef.current.position.y = 1.45;
      capMat.opacity = 1;
      ringMat.opacity = 1;
      clipPlane.current.set(new Vector3(0, 1, 0), 1.4);
      if (elapsed >= 0.5) phaseRef.current = 'visible';
      else phaseRef.current = 'building';
      return;
    }

    if (elapsed < 0.3) {
      bodyLineMat.opacity = 0;
      capLineMat.opacity = 0;
      ringLineMat.opacity = 0;
    } else {
      if (elapsed < 1.5) {
        bodyLineMat.opacity = easeOutQuad((elapsed - 0.3) / 1.2);
      } else if (elapsed < 2.5) {
        bodyLineMat.opacity = 1 - easeOutQuad((elapsed - 1.5) / 0.3) * 0.95;
      } else {
        bodyLineMat.opacity = 0.05;
      }

      if (elapsed < 0.8) {
        capLineMat.opacity = 0;
      } else if (elapsed < 1.6) {
        capLineMat.opacity = easeOutQuad((elapsed - 0.8) / 0.8);
      } else if (elapsed < 2.5) {
        capLineMat.opacity = 1 - easeOutQuad((elapsed - 1.6) / 0.35) * 0.9;
      } else {
        capLineMat.opacity = 0.1;
      }

      if (elapsed < 1.0) {
        ringLineMat.opacity = 0;
      } else if (elapsed < 1.8) {
        ringLineMat.opacity = easeOutQuad((elapsed - 1.0) / 0.8);
      } else if (elapsed < 2.5) {
        ringLineMat.opacity = 1 - easeOutQuad((elapsed - 1.8) / 0.35) * 0.9;
      } else {
        ringLineMat.opacity = 0.1;
      }
    }

    if (elapsed >= 1.5 && elapsed < 2.5) {
      const u = easeOutCubic((elapsed - 1.5) / 1);
      bodyMat.opacity = u * 0.65;
    } else if (elapsed >= 2.5) {
      bodyMat.opacity = 0.65;
    } else {
      bodyMat.opacity = 0;
    }

    if (liquidRef.current) {
      liquidRef.current.position.y = 0;
    }
    liquidMat.clippingPlanes = [clipPlane.current];
    if (elapsed < 1.8) {
      clipPlane.current.set(new Vector3(0, 1, 0), -1.5);
    } else if (elapsed < 2.8) {
      const u = easeOutCubic((elapsed - 1.8) / 1);
      const c = -1.5 + u * 2.9;
      clipPlane.current.set(new Vector3(0, 1, 0), c);
    } else {
      clipPlane.current.set(new Vector3(0, 1, 0), 1.4);
    }

    if (elapsed >= 1.5 && elapsed < 2.5) {
      const u = easeOutCubic((elapsed - 1.5) / 1);
      if (capGroupRef.current) {
        capGroupRef.current.position.y = 4 - u * 2.55;
      }
    } else if (elapsed >= 2.5) {
      if (capGroupRef.current) capGroupRef.current.position.y = 1.45;
    } else if (capGroupRef.current) {
      capGroupRef.current.position.y = 4;
    }

    if (elapsed >= 1.5 && elapsed < 2) {
      const u = easeOutCubic((elapsed - 1.5) / 0.5);
      capMat.opacity = u;
    } else if (elapsed >= 2) {
      capMat.opacity = 1;
    } else {
      capMat.opacity = 0;
    }

    if (elapsed >= 2 && elapsed < 2.35) {
      const u = easeOutCubic((elapsed - 2) / 0.35);
      ringMat.opacity = u;
    } else if (elapsed >= 2.35) {
      ringMat.opacity = 1;
    } else {
      ringMat.opacity = 0;
    }

    if (elapsed >= 3) {
      phaseRef.current = 'visible';
    } else {
      phaseRef.current = 'building';
    }
  });

  return (
    <>
      <EnableLocalClipping />
      <PerspectiveCamera makeDefault fov={45} position={[0, 0, 7]} />
      <ambientLight intensity={0.6} color="#F7F1EA" />
      <directionalLight intensity={1.2} position={[-3, 4, 5]} />
      <directionalLight intensity={0.7} color="#E8C5C0" position={[4, -2, 3]} />
      <pointLight intensity={1.5} color="#D4A574" position={[2, 3, -2]} distance={10} />
      <pointLight intensity={0.8} color="#B8A2C8" position={[-2, -1, -3]} distance={8} />
      <pointLight intensity={0.6} color="#ffffff" position={[0.5, 1.2, 4]} distance={6} />

      <group ref={groupRef} scale={0.38}>
        <GoldDust startTime={startTime} reducedMotion={reducedMotion} active={active} />
        <lineSegments ref={bodyLinesRef} geometry={bodyEdgesGeo} material={bodyLineMat} />
        <mesh ref={bodyRef} geometry={bodyGeo} material={bodyMat} />
        <mesh ref={liquidRef} geometry={liquidGeo} material={liquidMat} position={[0, 0, 0]} />
        <group ref={capGroupRef} position={[0, 4, 0]}>
          <lineSegments geometry={capEdgesGeo} material={capLineMat} />
          <mesh geometry={capGeo} material={capMat} />
        </group>
        <group position={[0, 1.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <lineSegments geometry={ringEdgesGeo} material={ringLineMat} />
          <mesh geometry={ringGeo} material={ringMat} />
        </group>
      </group>
    </>
  );
}

type Props = {
  startTime: number;
  phaseRef: MutableRefObject<FlaconPhase>;
  reducedMotion?: boolean;
  active?: boolean;
};

function FlaconInner({ startTime, phaseRef, reducedMotion = false, active = true }: Props) {
  return (
    <FlaconScene
      startTime={startTime}
      phaseRef={phaseRef}
      reducedMotion={reducedMotion}
      active={active}
    />
  );
}

export function FlaconLathe({
  startTime,
  phaseRef,
  reducedMotion = false,
  active = true,
}: Props) {
  return (
    <Canvas
      className="h-full w-full"
      gl={{ alpha: true, antialias: true, localClippingEnabled: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <FlaconInner
          startTime={startTime}
          phaseRef={phaseRef}
          reducedMotion={reducedMotion}
          active={active}
        />
      </Suspense>
    </Canvas>
  );
}
