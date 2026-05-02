'use client';

import { Suspense, useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  MeshTransmissionMaterial,
  Sparkles,
  Float,
  Environment,
  Lightformer,
  OrbitControls,
} from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── Seeded random ───────────────────────────────────────────────────────────
function sr(i: number, k: number): number {
  const x = Math.sin((i * 37.3 + k * 4.17 + 1.9) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// ─── Flacon procédural ───────────────────────────────────────────────────────
function buildFlaconPoints(): THREE.Vector2[] {
  // Points de profil (r, y) — revolved autour de Y
  // Fond légèrement courbé → épaule → col → goulot → lèvre
  const raw: [number, number][] = [
    [0.00,  -1.10],  // base centre
    [0.48,  -1.10],  // base bord
    [0.54,  -1.00],  // arrondi base
    [0.56,  -0.80],
    [0.56,   0.40],  // corps principal
    [0.52,   0.70],  // début épaule
    [0.38,   0.90],  // mi-épaule
    [0.22,   1.00],  // col
    [0.20,   1.20],
    [0.24,   1.30],  // légère rebord col
    [0.20,   1.35],
    [0.20,   1.60],  // goulot droit
    [0.24,   1.65],  // lèvre ext
    [0.24,   1.72],
    [0.18,   1.72],  // lèvre int
    [0.18,   1.60],
    [0.00,   1.60],  // axe pour fermer
  ];
  return raw.map(([r, y]) => new THREE.Vector2(r, y));
}

function buildCapPoints(): THREE.Vector2[] {
  const raw: [number, number][] = [
    [0.00,  0.00],
    [0.28,  0.00],
    [0.30,  0.04],
    [0.30,  0.60],
    [0.28,  0.68],
    [0.20,  0.72],
    [0.00,  0.72],
  ];
  return raw.map(([r, y]) => new THREE.Vector2(r, y));
}

// ─── Matériaux partagés ───────────────────────────────────────────────────────
const colorGold = new THREE.Color('#C9A84C');
const colorGoldLight = new THREE.Color('#E8C97A');
const colorBordeaux = new THREE.Color('#2A0A0A');

// ─── Composant Flacon ────────────────────────────────────────────────────────
function Flacon({ scrollRef }: { scrollRef: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null);
  const capRef = useRef<THREE.Mesh>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMouse = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);
    return () => window.removeEventListener('mousemove', onMouse);
  }, []);

  const flaconGeo = useMemo(() => new THREE.LatheGeometry(buildFlaconPoints(), 80), []);
  const capGeo    = useMemo(() => new THREE.LatheGeometry(buildCapPoints(), 64), []);

  useEffect(() => {
    return () => { flaconGeo.dispose(); capGeo.dispose(); };
  }, [flaconGeo, capGeo]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    const LERP = 1 - Math.pow(0.08, delta);
    currentRot.current.x += (mouseRef.current.y * 0.12 - currentRot.current.x) * LERP;
    currentRot.current.y += (mouseRef.current.x * 0.18 - currentRot.current.y) * LERP;

    g.rotation.x = currentRot.current.x;
    g.rotation.y = currentRot.current.y + state.clock.elapsedTime * 0.06;

    // Scroll animation: dérive vers le haut et s'éloigne
    const sv = Math.max(0, Math.min(1, scrollRef.current));
    g.position.y = sv * 1.8;
    g.position.z = sv * -2.0;
    g.scale.setScalar(1 - sv * 0.15);
  });

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
      <group ref={groupRef} position={[0, -0.3, 0]}>
        {/* Corps du flacon — verre */}
        <mesh geometry={flaconGeo} castShadow>
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.3}
            thickness={0.35}
            chromaticAberration={0.06}
            anisotropicBlur={0.12}
            distortion={0.12}
            distortionScale={0.35}
            temporalDistortion={0.05}
            transmission={0.96}
            ior={1.52}
            roughness={0.04}
            metalness={0.0}
            color="#E8D5B5"
            attenuationColor="#D4A96A"
            attenuationDistance={0.8}
            envMapIntensity={1.4}
          />
        </mesh>

        {/* Capuchon — métal doré */}
        <mesh
          ref={capRef}
          geometry={capGeo}
          castShadow
          position={[0, 1.60, 0]}
        >
          <meshPhysicalMaterial
            color={colorGold}
            metalness={0.92}
            roughness={0.08}
            envMapIntensity={2.2}
            emissive={colorGoldLight}
            emissiveIntensity={0.12}
            reflectivity={1}
          />
        </mesh>

        {/* Fond du flacon — légèrement opaque */}
        <mesh position={[0, -1.10, 0]}>
          <cylinderGeometry args={[0.48, 0.48, 0.04, 64]} />
          <meshPhysicalMaterial
            color="#2A1A08"
            metalness={0.1}
            roughness={0.6}
            transparent
            opacity={0.7}
          />
        </mesh>

        {/* Label simulé — quad bordeaux subtil */}
        <mesh position={[0, -0.1, 0.575]}>
          <planeGeometry args={[0.72, 0.88]} />
          <meshBasicMaterial
            color="#1A0A06"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>
      </group>
    </Float>
  );
}

// ─── Background plane (shader bordeaux → noir) ───────────────────────────────
function BackdropPlane() {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const shader = useMemo(() => ({
    uniforms: {
      uTime: { value: 0 },
    },
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
        vec3 cDark   = vec3(0.02, 0.005, 0.005);
        vec3 cBordeaux = vec3(0.16, 0.03, 0.04);
        vec3 cGold   = vec3(0.22, 0.14, 0.04);

        float d = length(vUv - vec2(0.5, 0.45));
        float pulse = 0.5 + 0.5 * sin(uTime * 0.35);

        // Fond bordeaux radial au centre
        float r1 = smoothstep(0.7, 0.05, d);
        // Halo doré léger
        float r2 = smoothstep(0.45, 0.10, d) * (0.18 + pulse * 0.08);

        vec3 col = mix(cDark, cBordeaux, r1);
        col = mix(col, cGold, r2);

        gl_FragColor = vec4(col, 1.0);
      }
    `,
  }), []);

  useFrame((state) => {
    if (mat.current) mat.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, -4]}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial ref={mat} args={[shader]} />
    </mesh>
  );
}

// ─── Lights ──────────────────────────────────────────────────────────────────
function Lights() {
  return (
    <Environment resolution={256}>
      {/* Key light — chaud haut gauche */}
      <Lightformer
        intensity={4.5}
        color="#FFE4A0"
        position={[-3, 4, 2]}
        rotation={[0, Math.PI / 3, 0]}
        scale={[3, 2, 1]}
        form="rect"
      />
      {/* Fill light — froid bas droite */}
      <Lightformer
        intensity={1.8}
        color="#B0C8FF"
        position={[4, -2, 1]}
        rotation={[0, -Math.PI / 4, 0]}
        scale={[2, 3, 1]}
        form="rect"
      />
      {/* Rim light — blanc derrière */}
      <Lightformer
        intensity={3.2}
        color="#FFFFFF"
        position={[0, 0, -5]}
        scale={[6, 6, 1]}
        form="rect"
      />
      {/* Bounce doré bas */}
      <Lightformer
        intensity={1.2}
        color="#D4A96A"
        position={[0, -3, 2]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[4, 4, 1]}
        form="rect"
      />
    </Environment>
  );
}

// ─── Postprocessing (desktop only) ──────────────────────────────────────────
function PostFX({ isMobile }: { isMobile: boolean }) {
  if (isMobile) return null;
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={1.15}
        luminanceThreshold={0.55}
        luminanceSmoothing={0.7}
        mipmapBlur
      />
      <DepthOfField
        focusDistance={0.0}
        focalLength={0.06}
        bokehScale={2.8}
        height={480}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.0018, 0.0018) as unknown as [number, number]}
        radialModulation={false}
        modulationOffset={0}
      />
      <Vignette eskil={false} offset={0.22} darkness={0.65} />
    </EffectComposer>
  );
}

// ─── Scene R3F ───────────────────────────────────────────────────────────────
function Scene3D({ isMobile, scrollRef }: { isMobile: boolean; scrollRef: React.MutableRefObject<number> }) {
  const count = isMobile ? 60 : 150;
  return (
    <>
      <BackdropPlane />
      <Lights />
      <Flacon scrollRef={scrollRef} />

      {/* Sparkles fond lointain */}
      <Sparkles
        count={count}
        scale={8}
        size={isMobile ? 1.8 : 2.8}
        speed={0.25}
        opacity={0.55}
        color="#C9A84C"
        position={[0, 0, -2]}
      />
      {/* Sparkles proches — autour du flacon */}
      <Sparkles
        count={Math.floor(count * 0.4)}
        scale={3}
        size={isMobile ? 1.2 : 2.0}
        speed={0.45}
        opacity={0.7}
        color="#F4E4C1"
        position={[0, 0, 0]}
      />

      <PostFX isMobile={isMobile} />
    </>
  );
}

// ─── Intro animation overlay ──────────────────────────────────────────────────
function useIntroAnim(
  titleRef: React.RefObject<HTMLDivElement | null>,
  taglineRef: React.RefObject<HTMLDivElement | null>,
  scrollHintRef: React.RefObject<HTMLDivElement | null>,
) {
  useEffect(() => {
    const title    = titleRef.current;
    const tagline  = taglineRef.current;
    const hint     = scrollHintRef.current;
    if (!title || !tagline || !hint) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set([title, tagline, hint], { opacity: 1, y: 0, filter: 'none' });
      return;
    }

    gsap.set(title,   { opacity: 0, y: 28, filter: 'blur(12px)' });
    gsap.set(tagline, { opacity: 0, y: 16, filter: 'blur(6px)' });
    gsap.set(hint,    { opacity: 0 });

    const tl = gsap.timeline({ delay: 0.5 });
    tl.to(title,   { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.4, ease: 'power3.out' }, 0);
    tl.to(tagline, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.1, ease: 'power3.out' }, 0.55);
    tl.to(hint,    { opacity: 1, duration: 0.8, ease: 'power2.out' }, 1.4);
  }, [titleRef, taglineRef, scrollHintRef]);
}

// ─── Section principale ───────────────────────────────────────────────────────
export function Scene1Opening() {
  const sectionRef    = useRef<HTMLElement>(null);
  const titleRef      = useRef<HTMLDivElement>(null);
  const taglineRef    = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const scrollRef     = useRef(0);

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const mq = window.matchMedia('(max-width: 768px)');
    setIsMobile(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      scrollRef.current = Math.max(0, Math.min(1, -rect.top / window.innerHeight));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useIntroAnim(titleRef, taglineRef, scrollHintRef);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100dvh] w-full overflow-hidden bg-[#080202]"
      aria-label="Maison ORIANE — Ouverture"
    >
      {/* Canvas 3D — fond plein écran (client-only via mounted guard) */}
      {mounted && !reducedMotion && (
        <div className="absolute inset-0 z-0">
          <Canvas
            camera={{ position: [0, 0, 5.5], fov: 38, near: 0.1, far: 40 }}
            gl={{
              alpha: false,
              antialias: !isMobile,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.15,
            }}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            className="h-full w-full"
          >
            <Suspense fallback={null}>
              <Scene3D isMobile={isMobile} scrollRef={scrollRef} />
            </Suspense>
          </Canvas>
        </div>
      )}

      {/* Fallback fond — avant mount ou reduced-motion */}
      {(!mounted || reducedMotion) && (
        <div
          className="absolute inset-0 z-0"
          style={{ background: 'radial-gradient(ellipse at 50% 45%, #280808 0%, #0D0303 40%, #040101 100%)' }}
        />
      )}

      {/* Overlay gradient bas — fondu vers section suivante */}
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 h-48"
        style={{ background: 'linear-gradient(to bottom, transparent, #040101)' }}
        aria-hidden
      />

      {/* Contenu HTML — mix-blend-mode screen pour fusion avec 3D */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        {/* Ornement haut */}
        <div
          className="mb-5 text-[0.55rem] font-light uppercase tracking-[0.55em] text-or-pale/60"
          style={{ fontFamily: 'var(--font-body, serif)' }}
        >
          Bordeaux · 2026
        </div>

        {/* Titre principal */}
        <div
          ref={titleRef}
          className="relative select-none"
          style={{ mixBlendMode: 'screen' }}
        >
          <h1
            className="font-display font-extralight uppercase leading-none text-or-liquide"
            style={{
              fontSize: 'clamp(4.5rem, 13vw, 11rem)',
              letterSpacing: '0.22em',
              textShadow: [
                '0 0 60px rgba(212,169,106,0.55)',
                '0 0 120px rgba(212,169,106,0.25)',
                '0 0 240px rgba(180,100,60,0.18)',
                '0 2px 4px rgba(0,0,0,0.6)',
              ].join(', '),
            }}
          >
            ORIANE
          </h1>
        </div>

        {/* Ligne ornementale */}
        <div className="my-5 flex items-center gap-4" aria-hidden>
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-or-pale/50" />
          <div className="h-[3px] w-[3px] rounded-full bg-or-pale/70" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-or-pale/50" />
        </div>

        {/* Tagline */}
        <div
          ref={taglineRef}
          style={{ mixBlendMode: 'screen' }}
        >
          <p
            className="font-body font-extralight uppercase text-or-pale"
            style={{
              fontSize: 'clamp(0.6rem, 1.4vw, 0.82rem)',
              letterSpacing: '0.48em',
              textShadow: '0 0 20px rgba(212,169,106,0.35)',
            }}
          >
            Une parfumerie.
          </p>
        </div>
      </div>

      {/* Scroll hint */}
      <div
        ref={scrollHintRef}
        className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-hidden
      >
        <span
          className="font-body text-[0.5rem] uppercase tracking-[0.45em] text-or-pale/40"
        >
          Scroll
        </span>
        <div
          className="h-8 w-px bg-gradient-to-b from-or-pale/30 to-transparent"
          style={{ animation: 'scene1ScrollPulse 2s ease-in-out infinite' }}
        />
      </div>

      <style>{`
        @keyframes scene1ScrollPulse {
          0%, 100% { opacity: 0.3; transform: scaleY(1); }
          50% { opacity: 0.8; transform: scaleY(1.3); }
        }
      `}</style>
    </section>
  );
}
