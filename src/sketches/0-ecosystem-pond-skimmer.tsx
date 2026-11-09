'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { Creature, createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 11,
  title: 'Ecosystem: Pond Skimmer',
  description: 'A creature expressing personality through motion. Combines Perlin noise, random bursts, and center attraction.',
};

const params = {
  creatureCount: 3,
  calmness: 0.7,
  speed: 2,
  burstChance: 0.02,
  centerAttraction: 0.3,
  size: 20,
  showTrail: true,
  trailOpacity: 15,
};

export default function EcosystemPondSkimmer() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const creaturesRef = useRef<Creature[]>([]);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        const populationFolder = pane.addFolder({ title: 'Population' });
        populationFolder.addBinding(params, 'creatureCount', {
          min: 1,
          max: 10,
          step: 1,
          label: 'Creatures',
        });

        const behaviorFolder = pane.addFolder({ title: 'Behavior' });
        behaviorFolder
          .addBinding(params, 'calmness', {
            min: 0,
            max: 1,
            step: 0.05,
            label: 'Calmness',
          })
          .on('change', (ev) => {
            creaturesRef.current.forEach((c) => c.setCalmness(ev.value));
          });

        behaviorFolder
          .addBinding(params, 'speed', {
            min: 0.5,
            max: 5,
            step: 0.5,
            label: 'Speed',
          })
          .on('change', (ev) => {
            creaturesRef.current.forEach((c) => c.setSpeed(ev.value));
          });

        behaviorFolder
          .addBinding(params, 'burstChance', {
            min: 0,
            max: 0.1,
            step: 0.01,
            label: 'Burst Chance',
          })
          .on('change', (ev) => {
            creaturesRef.current.forEach((c) => c.setBurstChance(ev.value));
          });

        behaviorFolder
          .addBinding(params, 'centerAttraction', {
            min: 0,
            max: 1,
            step: 0.1,
            label: 'Center Pull',
          })
          .on('change', (ev) => {
            creaturesRef.current.forEach((c) => c.setCenterAttraction(ev.value));
          });

        const visualFolder = pane.addFolder({ title: 'Visual' });
        visualFolder
          .addBinding(params, 'size', {
            min: 10,
            max: 40,
            step: 2,
            label: 'Size',
          })
          .on('change', (ev) => {
            creaturesRef.current.forEach((c) => c.setSize(ev.value));
          });

        visualFolder.addBinding(params, 'showTrail', { label: 'Show Trail' });
        visualFolder.addBinding(params, 'trailOpacity', {
          min: 5,
          max: 50,
          step: 5,
          label: 'Trail Fade',
        });

        pane.addButton({ title: 'Reset Pond' }).on('click', () => {
          setResetKey((k) => k + 1);
        });
      },
      { title: 'Pond Ecosystem' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  // Helper to create creatures with slight variation
  const createCreatures = (p: p5, count: number): Creature[] => {
    const creatures: Creature[] = [];
    const baseColors: [number, number, number][] = [
      [80, 120, 200],   // blue
      [100, 180, 120],  // green
      [180, 100, 140],  // purple
      [200, 160, 80],   // gold
      [120, 200, 200],  // cyan
    ];

    for (let i = 0; i < count; i++) {
      const creature = new Creature({
        calmness: params.calmness + p.random(-0.1, 0.1),
        speed: params.speed + p.random(-0.5, 0.5),
        burstChance: params.burstChance,
        centerAttraction: params.centerAttraction,
        size: params.size + p.random(-4, 4),
        color: baseColors[i % baseColors.length],
      });
      creature.init(p);
      creatures.push(creature);
    }
    return creatures;
  };

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(240, 248, 255);
      creaturesRef.current = createCreatures(p5Ref.current, params.creatureCount);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(240, 248, 255); // Light blue pond
      p5Ref.current = p;
      creaturesRef.current = createCreatures(p, params.creatureCount);
    };

    p.draw = () => {
      // Fade effect for trails
      if (params.showTrail) {
        p.fill(240, 248, 255, params.trailOpacity);
        p.noStroke();
        p.rect(0, 0, p.width, p.height);
      } else {
        p.background(240, 248, 255);
      }

      // Draw pond edge
      p.noFill();
      p.stroke(180, 200, 220);
      p.strokeWeight(3);
      p.ellipse(p.width / 2, p.height / 2, p.width - 20, p.height - 20);

      // Adjust creature count if changed
      if (creaturesRef.current.length !== params.creatureCount) {
        creaturesRef.current = createCreatures(p, params.creatureCount);
      }

      // Update and draw creatures
      for (const creature of creaturesRef.current) {
        creature.update();
        creature.display(p);
      }
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} key={resetKey} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
