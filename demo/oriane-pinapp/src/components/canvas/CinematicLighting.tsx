'use client';

import { Environment, Lightformer } from '@react-three/drei';

/**
 * Cinematic 3-point lighting setup — palette parfumerie luxe dorée
 * Inspiré de adrianhajdin/iphone Lights.jsx, adapté à l'univers ORIANE.
 */
export function CinematicLighting() {
  return (
    <group name="lights">
      <Environment resolution={512}>
        {/* Key — dorée chaude haut-droite, lumière principale */}
        <Lightformer
          form="rect"
          intensity={4.5}
          color="#F4C977"
          position={[3, 5, 2]}
          rotation={[-Math.PI / 4, 0, 0]}
          scale={[4, 2, 1]}
        />
        {/* Fill — bleu-froid gauche, compense les ombres */}
        <Lightformer
          form="rect"
          intensity={2.0}
          color="#B8C8E8"
          position={[-4, 1, 1]}
          rotation={[0, Math.PI / 3, 0]}
          scale={[3, 3, 1]}
        />
        {/* Rim — blanc pur derrière, silhouette du flacon */}
        <Lightformer
          form="rect"
          intensity={5.0}
          color="#FFFFFF"
          position={[0, 2, -4]}
          scale={[6, 4, 1]}
        />
        {/* Bounce — doré bordeaux au sol */}
        <Lightformer
          form="rect"
          intensity={1.2}
          color="#C4894A"
          position={[0, -3, 2]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[5, 5, 1]}
        />
        {/* Accent — violet subtil côté droit pour profondeur */}
        <Lightformer
          form="ring"
          intensity={0.8}
          color="#D4B0FF"
          position={[4, -1, -1]}
          rotation={[0, -Math.PI / 3, 0]}
          scale={[2, 2, 1]}
        />
      </Environment>

      {/* SpotLights (pattern adrianhajdin/iphone Lights.jsx) */}
      <spotLight
        position={[-2, 10, 5]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.3}
        color="#FFF8E8"
      />
      <spotLight
        position={[0, -20, 8]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI * 0.15}
        color="#FFF8E8"
      />
      <spotLight
        position={[0, 12, 4]}
        angle={0.12}
        penumbra={0.8}
        decay={0.1}
        intensity={Math.PI * 2.5}
        color="#FFFFFF"
      />
    </group>
  );
}
