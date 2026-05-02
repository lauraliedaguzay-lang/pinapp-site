'use client';

import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { CinematicLighting } from './CinematicLighting';
import { FlaconModel } from './FlaconModel';

// ─── Backdrop shader bordeaux → noir ─────────────────────────────────────────
function BackdropPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(() => ({
    uniforms: { uTime: { value: 0 } },
    vertexShader: /* glsl */`
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
      }
    `,
    fragmentShader: /* glsl */`
      varying vec2 vUv;
      uniform float uTime;
      void main() {
        vec3 cDark    = vec3(0.018, 0.005, 0.006);
        vec3 cBordeau = vec3(0.14,  0.025, 0.030);
        vec3 cGold    = vec3(0.21,  0.13,  0.035);

        vec2 uv = vUv - vec2(0.5, 0.44);
        float d = length(uv * vec2(0.9, 1.1));
        float pulse = 0.5 + 0.5 * sin(uTime * 0.28);

        float r1 = smoothstep(0.75, 0.02, d);
        float r2 = smoothstep(0.42, 0.06, d) * (0.15 + pulse * 0.07);
        float vgn = smoothstep(0.0, 0.6, d);

        vec3 col = mix(cDark, cBordeau, r1);
        col = mix(col, cGold, r2);
        col = mix(col, cDark * 0.5, vgn * 0.4);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
  }), []);

  useFrame(s => { if (mat.current) mat.current.uniforms.uTime.value = s.clock.elapsedTime; });

  return (
    <mesh position={[0, 0, -6]}>
      <planeGeometry args={[22, 22]} />
      <shaderMaterial ref={mat} args={[shader]} />
    </mesh>
  );
}

// ─── PostFX ──────────────────────────────────────────────────────────────────
function PostFX({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.05}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.75}
        mipmapBlur
      />
      <DepthOfField
        focusDistance={0.0}
        focalLength={0.055}
        bokehScale={2.4}
        height={480}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0016, 0.0016) as unknown as [number, number]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.18} darkness={0.72} />
    </EffectComposer>
  );
}

// ─── Contenu de la scène ──────────────────────────────────────────────────────
type SceneProps = {
  isMobile: boolean;
  scrollProgress: React.MutableRefObject<number>;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
};

function SceneContent({ isMobile, scrollProgress, mouseX, mouseY }: SceneProps) {
  const sparkleCount = isMobile ? 50 : 140;
  return (
    <>
      <BackdropPlane />
      <CinematicLighting />
      <FlaconModel scrollProgress={scrollProgress} mouseX={mouseX} mouseY={mouseY} />

      {/* Paillettes fond */}
      <Sparkles
        count={sparkleCount}
        scale={9}
        size={isMobile ? 1.6 : 2.6}
        speed={0.22}
        opacity={0.5}
        color="#C9A84C"
        position={[0, 0.5, -1.5]}
      />
      {/* Paillettes proches */}
      <Sparkles
        count={Math.floor(sparkleCount * 0.38)}
        scale={3.2}
        size={isMobile ? 1.0 : 1.8}
        speed={0.4}
        opacity={0.65}
        color="#F4E4C1"
        position={[0, 0.2, 0]}
      />

      <PostFX enabled={!isMobile} />
    </>
  );
}

// ─── Canvas principal ─────────────────────────────────────────────────────────
type Props = {
  isMobile: boolean;
  scrollProgress: React.MutableRefObject<number>;
  mouseX: React.MutableRefObject<number>;
  mouseY: React.MutableRefObject<number>;
};

export function HeroCanvas({ isMobile, scrollProgress, mouseX, mouseY }: Props) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 36, near: 0.1, far: 50 }}
      gl={{
        alpha: false,
        antialias: !isMobile,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        powerPreference: 'high-performance',
      }}
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      shadows={false}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <SceneContent
          isMobile={isMobile}
          scrollProgress={scrollProgress}
          mouseX={mouseX}
          mouseY={mouseY}
        />
      </Suspense>
    </Canvas>
  );
}
