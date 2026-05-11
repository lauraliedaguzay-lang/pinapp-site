'use client';

import { Scene1Opening } from './sections/Scene1Opening';
import { Scene2Verser } from './sections/Scene2Verser';
import { Scene3Manifesto } from './sections/Scene3Manifesto';
import { Scene4ThreeAubes } from './sections/Scene4ThreeAubes';
import { Scene5Emotion } from './sections/Scene5Emotion';
import { Scene6Collection } from './sections/Scene6Collection';
import { Scene7Contact } from './sections/Scene7Contact';
import { Scene8Footer } from './sections/Scene8Footer';

export function PageNarrative() {
  return (
    <>
      <main id="main-content">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[10000] focus:rounded focus:bg-or-pur focus:px-3 focus:py-2 focus:text-noir-profond"
        >
          Aller au contenu
        </a>
        <Scene1Opening />
        <Scene2Verser />
        <Scene3Manifesto />
        <Scene4ThreeAubes />
        <Scene5Emotion />
        <Scene6Collection />
        <Scene7Contact />
        <Scene8Footer />
      </main>
    </>
  );
}
