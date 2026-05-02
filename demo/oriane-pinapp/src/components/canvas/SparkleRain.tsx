'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrthographicCamera } from '@react-three/drei';
import { useMemo, useRef, useEffect, type MutableRefObject } from 'react';
import * as THREE from 'three';

function makeSparkleTexture() {
  const c = document.createElement('canvas');
  c.width = 64;
  c.height = 64;
  const ctx = c.getContext('2d');
  if (!ctx) return null;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 28);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.15, 'rgba(255,248,230,0.85)');
  g.addColorStop(0.55, 'rgba(244,201,119,0.35)');
  g.addColorStop(1, 'rgba(244,201,119,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.needsUpdate = true;
  return tex;
}

const cOrLiq = new THREE.Color('#F4C977');
const cOrPur = new THREE.Color('#D4A574');
const cOrPale = new THREE.Color('#F4E4C1');

function fract01(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453123;
  return x - Math.floor(x);
}

function pickColor(seed: number) {
  const r = fract01(seed);
  const c = r < 0.8 ? cOrLiq : r < 0.95 ? cOrPur : cOrPale;
  return [c.r, c.g, c.b] as const;
}

type LayerProps = {
  scrollVelocityRef: MutableRefObject<number>;
  n: number;
  pointSize: number;
  seed: number;
  reducedMotion: boolean;
  isMobile: boolean;
  map: THREE.CanvasTexture | null;
};

function SparkleLayer({
  scrollVelocityRef,
  n,
  pointSize,
  seed,
  reducedMotion,
  isMobile,
  map,
}: LayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const freq = useRef<Float32Array | null>(null);
  const phase = useRef<Float32Array | null>(null);
  const speed = useRef<Float32Array | null>(null);

  const { geometry, material } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(n * 3);
    const colors = new Float32Array(n * 3);
    freq.current = new Float32Array(n);
    phase.current = new Float32Array(n);
    speed.current = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const r = (k: number) => fract01(seed * 0.001 + i * 31.7 + k);
      let x = (r(0) - 0.5) * 2.2;
      let y: number;
      if (r(1) < 0.7) {
        y = 0.6 + r(2) * 0.9;
      } else {
        x *= 0.35;
        y = 0.2 + r(3) * 0.5;
      }
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = (r(4) - 0.5) * 2.8;
      freq.current[i] = 0.1 + r(5) * 0.4;
      phase.current[i] = r(6) * Math.PI * 2;
      speed.current[i] = 0.05 + r(7) * 0.2;
      const [cr, cg, cb] = pickColor(seed + i * 997);
      colors[i * 3] = cr;
      colors[i * 3 + 1] = cg;
      colors[i * 3 + 2] = cb;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const m = new THREE.PointsMaterial({
      size: pointSize * (isMobile ? 1.35 : 1),
      map: map ?? undefined,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.NormalBlending,
      sizeAttenuation: true,
    });
    return { geometry: geo, material: m };
  }, [n, pointSize, seed, isMobile, map]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const vel = scrollVelocityRef.current;
    const pts = pointsRef.current;
    if (!pts || !freq.current || !phase.current || !speed.current) return;
    const pos = pts.geometry.attributes.position as THREE.BufferAttribute;
    const mult = 1 + Math.abs(vel) * 2;
    const d = Math.min(0.05, delta) * 60;

    for (let i = 0; i < n; i++) {
      const ph = phase.current[i]!;
      const fr = freq.current[i]!;
      const sp = speed.current[i]!;
      let x = pos.getX(i);
      let y = pos.getY(i);
      let z = pos.getZ(i);
      y -= sp * mult * 0.018 * d * (reducedMotion ? 0.5 : 1);
      x += Math.sin(t * fr + ph) * 0.0035;
      if (y < -1.25) {
        y = 1.1 + fract01(seed + i * 13 + t) * 0.35;
        x = (fract01(seed + i * 3 + t * 0.7) - 0.5) * 2.2;
        z = (fract01(seed + i * 5 + t * 0.3) - 0.5) * 2.8;
      }
      pos.setX(i, x);
      pos.setY(i, y);
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    const tw = 0.88 + Math.sin(t * 0.5) * 0.06;
    material.opacity = (reducedMotion ? 0.55 : 0.92) * tw;
  });

  return <points ref={pointsRef} geometry={geometry} material={material} />;
}

/**
 * Fixe le frustum de la caméra orthographique pour que les particules
 * (coordonnées ±1.1 en x, −1.25 à +1.5 en y) couvrent tout l'écran.
 * Sans ce fix, R3F hérite de left=−1 right=1 mais le zoom=1 n'est pas
 * calibré selon l'aspect ratio → particules invisibles ou trop petites.
 */
function CameraFrustumFix() {
  const { camera, size } = useThree();
  useEffect(() => {
    if (!(camera instanceof THREE.OrthographicCamera)) return;
    const aspect = size.width / size.height;
    // Espace x : −1.2 à 1.2 (particles ±1.1 → légère marge)
    camera.left = -1.2;
    camera.right = 1.2;
    // Espace y ajusté à l'aspect ratio, particules jusqu'à 1.5 en haut
    camera.top = 1.6 / aspect;
    camera.bottom = -1.6 / aspect;
    camera.zoom = 1;
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

type RainSceneProps = {
  scrollVelocityRef: MutableRefObject<number>;
  count: number;
  reducedMotion: boolean;
  isMobile: boolean;
};

function RainScene({ scrollVelocityRef, count, reducedMotion, isMobile }: RainSceneProps) {
  const map = useMemo(() => makeSparkleTexture(), []);
  useEffect(() => {
    return () => map?.dispose();
  }, [map]);

  const a = Math.floor(count / 3);
  const b = Math.floor(count / 3);
  const c = Math.max(0, count - a - b);

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 8]} near={0.1} far={20} />
      <CameraFrustumFix />
      <SparkleLayer
        scrollVelocityRef={scrollVelocityRef}
        n={a}
        pointSize={0.045}
        seed={1}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
        map={map}
      />
      <SparkleLayer
        scrollVelocityRef={scrollVelocityRef}
        n={b}
        pointSize={0.075}
        seed={10001}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
        map={map}
      />
      <SparkleLayer
        scrollVelocityRef={scrollVelocityRef}
        n={c}
        pointSize={0.11}
        seed={20003}
        reducedMotion={reducedMotion}
        isMobile={isMobile}
        map={map}
      />
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

  const count = reducedMotion ? Math.min(200, sparkleCount) : sparkleCount;

  if (reducedMotion) return null;

  return (
    <div className="pointer-events-none h-full w-full" aria-hidden>
      <Canvas
        className="block h-full w-full"
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
