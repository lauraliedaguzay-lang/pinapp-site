'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = /* glsl */`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */`
  uniform float uTime;
  varying vec2 vUv;
  void main() {
    vec2 center = vec2(0.5);
    float dist = distance(vUv, center);
    vec3 bordeaux = vec3(0.29, 0.12, 0.12);
    vec3 noir     = vec3(0.04, 0.01, 0.02);
    vec3 gold     = vec3(0.96, 0.78, 0.45);
    float pulse   = sin(uTime * 0.4) * 0.5 + 0.5;
    vec3 col = mix(bordeaux, noir, smoothstep(0.0, 0.7, dist));
    col += gold * 0.05 * pulse * (1.0 - dist);
    gl_FragColor  = vec4(col, 1.0);
  }
`;

export function BackdropPlane() {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -2]} renderOrder={-1}>
      <planeGeometry args={[20, 20]} />
      <shaderMaterial
        ref={matRef}
        uniforms={{ uTime: { value: 0 } }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        depthWrite={false}
      />
    </mesh>
  );
}
