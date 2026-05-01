'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useMemo, useRef, useEffect, type MutableRefObject } from 'react';
import * as THREE from 'three';

function makeSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 32;
  c.height = 32;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 14);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.4, 'rgba(244,228,193,0.5)');
  g.addColorStop(1, 'rgba(212,165,116,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 32, 32);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

type RainSceneProps = {
  scrollVelocityRef: MutableRefObject<number>;
  count: number;
  reducedMotion: boolean;
  isMobile: boolean;
};

function RainScene({ scrollVelocityRef, count, reducedMotion, isMobile }: RainSceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const baseY = useRef<Float32Array | null>(null);
  const speed = useRef<Float32Array | null>(null);
  const phase = useRef<Float32Array | null>(null);
  const xBase = useRef<Float32Array | null>(null);

  const { geometry, material, map } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    baseY.current = new Float32Array(count);
    speed.current = new Float32Array(count);
    phase.current = new Float32Array(count);
    xBase.current = new Float32Array(count);
    const c1 = new THREE.Color('#D4A574');
    const c2 = new THREE.Color('#F4E4C1');
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 2.2;
      const y = Math.random() * 2.4 - 0.2;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
      baseY.current[i] = y;
      xBase.current[i] = x;
      speed.current[i] = 0.08 + Math.random() * 0.22;
      phase.current[i] = Math.random() * Math.PI * 2;
      const pick = Math.random() < 0.7 ? c1 : c2;
      colors[i * 3] = pick.r;
      colors[i * 3 + 1] = pick.g;
      colors[i * 3 + 2] = pick.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const m = new THREE.PointsMaterial({
      size: reducedMotion ? 0.09 : isMobile ? 0.14 : 0.12,
      map: makeSparkleTexture() ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.72,
      depthWrite: false,
      blending: THREE.NormalBlending,
      sizeAttenuation: false,
    });
    return { geometry: geo, material: m, map: m.map as THREE.CanvasTexture | null };
  }, [count, reducedMotion, isMobile]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
      map?.dispose();
    };
  }, [geometry, material, map]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const vel = scrollVelocityRef.current;
    const pts = pointsRef.current;
    if (!pts || !baseY.current || !speed.current || !phase.current || !xBase.current) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const h = typeof window !== 'undefined' ? window.innerHeight : 900;
    const w = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const scale = reducedMotion ? 0.45 : 1;
    const velBoost = 1 + Math.min(2.5, Math.max(-1.2, vel)) * 0.035;

    for (let i = 0; i < count; i++) {
      const ph = phase.current[i]!;
      let y = pos.getY(i);
      const sp = speed.current[i]! * scale * velBoost * 0.012;
      y -= sp * (reducedMotion ? 0.5 : 1);
      if (y < -1.15) {
        y = 1.15 + Math.random() * 0.35;
        const nx = ((Math.random() - 0.5) * w) / (w * 0.5) * 1.1;
        pos.setX(i, nx);
        xBase.current[i] = nx;
      } else {
        const x0 = xBase.current[i]!;
        const sway = Math.sin(t * 0.9 + ph) * 0.012 * (1 + Math.abs(vel) * 0.02);
        pos.setX(i, x0 + sway);
      }
      pos.setY(i, y);
      const tw = 0.88 + Math.sin(t * 2.4 + ph * 3) * 0.08;
      material.opacity = reducedMotion ? 0.5 : 0.72 * tw;
    }
    pos.needsUpdate = true;
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 1]} zoom={1} near={0.1} far={10} />
      <points ref={pointsRef} geometry={geometry} material={material} />
    </>
  );
}

type Props = {
  scrollVelocityRef: MutableRefObject<number>;
  sparkleCount: number;
  isMobile: boolean;
};

export function SparkleRain({ scrollVelocityRef, sparkleCount, isMobile }: Props) {
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const count = reducedMotion ? Math.min(100, sparkleCount) : sparkleCount;

  if (reducedMotion) return null;

  return (
    <div
      className="pointer-events-none h-full w-full min-h-0 min-w-0"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 1,
      }}
      aria-hidden
    >
      <Canvas
        className="block h-full w-full min-h-0"
        style={{ width: '100%', height: '100%', display: 'block' }}
        gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
        dpr={[1, 2]}
      >
        <RainScene
          scrollVelocityRef={scrollVelocityRef}
          count={count}
          reducedMotion={false}
          isMobile={isMobile}
        />
      </Canvas>
    </div>
  );
}
