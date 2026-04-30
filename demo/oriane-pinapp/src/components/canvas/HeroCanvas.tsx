'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { PerspectiveCamera, useTexture } from '@react-three/drei';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  Points,
  SRGBColorSpace,
} from 'three';
import { fragrances } from '../../data/fragrances';

type SceneProps = {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  active: boolean;
};

function HeroScene({ mouseX, mouseY, scrollProgress, active }: SceneProps) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const pointsRef = useRef<Points>(null);

  const photoUrl = fragrances[0]!.photoUrl;
  const texture = useTexture(photoUrl);
  texture.colorSpace = SRGBColorSpace;

  const particlesGeo = useMemo(() => {
    const geo = new BufferGeometry();
    const count = 50;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    return geo;
  }, []);

  useFrame((state) => {
    if (!active) return;
    const t = state.clock.elapsedTime;
    const g = groupRef.current;
    if (g) {
      g.rotation.y = mouseX * 0.4 + Math.sin(t * 0.3) * 0.1 - scrollProgress * 0.5;
      g.rotation.x = -mouseY * 0.3 + scrollProgress * 0.3;
      g.position.y = Math.sin(t) * 0.1 - scrollProgress * 1.5;
      g.position.z = -scrollProgress * 2;
    }

    const mesh = meshRef.current;
    if (mesh) {
      const posAttr = mesh.geometry.attributes.position as BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        const x = posAttr.getX(i);
        const y = posAttr.getY(i);
        const z =
          Math.sin(x * 1.5 + t) * 0.04 + Math.cos(y * 1.5 + t * 0.7) * 0.04;
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
    }

    const pts = pointsRef.current;
    if (pts) {
      const posAttr = pts.geometry.attributes.position as BufferAttribute;
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        y += 0.005;
        if (y > 4) y = -4;
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={meshRef}>
        <planeGeometry args={[6, 8, 30, 30]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0.85}
          side={DoubleSide}
        />
      </mesh>
      <points ref={pointsRef} geometry={particlesGeo}>
        <pointsMaterial
          color={new Color('#E8C5C0')}
          size={0.08}
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

export type HeroCanvasProps = {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  active?: boolean;
};

export function HeroCanvas({
  mouseX,
  mouseY,
  scrollProgress,
  active = true,
}: HeroCanvasProps) {
  return (
    <Canvas
      className="h-full w-full"
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <Suspense fallback={null}>
        <PerspectiveCamera makeDefault fov={45} position={[0, 0, 5]} />
        <ambientLight intensity={0.6} color="#F7F1EA" />
        <directionalLight intensity={1.2} position={[-3, 4, 5]} />
        <pointLight
          intensity={1.5}
          color="#D4A574"
          position={[2, 3, -2]}
          distance={10}
        />
        <pointLight
          intensity={0.8}
          color="#B8A2C8"
          position={[-2, -1, -3]}
          distance={8}
        />
        <HeroScene
          mouseX={mouseX}
          mouseY={mouseY}
          scrollProgress={scrollProgress}
          active={active}
        />
      </Suspense>
    </Canvas>
  );
}
