'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { createPane, disposePane, Pane } from '@/lib';
import { Pond, Skimmer, Fly, Fish, Leaf, type Creature } from '@/ecosystem';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 11,
  title: 'Ecosystem: Pond Life',
  description: 'Multiple creatures with distinct personalities interacting in a pond. This project evolves throughout the book.',
};

const params = {
  skimmers: 2,
  flies: 3,
  leaves: 2,
  fish: 2,
  showTrail: true,
  trailOpacity: 20,
};

export default function EcosystemPondSketch() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pondRef = useRef<Pond | null>(null);
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

        populationFolder.addBinding(params, 'skimmers', {
          min: 0, max: 5, step: 1, label: 'Skimmers',
        });
        populationFolder.addBinding(params, 'flies', {
          min: 0, max: 8, step: 1, label: 'Flies',
        });
        populationFolder.addBinding(params, 'leaves', {
          min: 0, max: 5, step: 1, label: 'Leaves',
        });
        populationFolder.addBinding(params, 'fish', {
          min: 0, max: 5, step: 1, label: 'Fish',
        });

        const visualFolder = pane.addFolder({ title: 'Visual' });
        visualFolder.addBinding(params, 'showTrail', { label: 'Show Trails' });
        visualFolder.addBinding(params, 'trailOpacity', {
          min: 5, max: 50, step: 5, label: 'Trail Fade',
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

  const createCreatures = (p: p5, pond: Pond): Creature[] => {
    const creatures: Creature[] = [];

    // Skimmers with blue variations
    for (let i = 0; i < params.skimmers; i++) {
      const hueShift = p.random(-20, 20);
      const creature = new Skimmer({
        color: [80 + hueShift, 120, 200 - hueShift],
        size: 20 + p.random(-3, 3),
      });
      creature.init(p, pond);
      creatures.push(creature);
    }

    // Flies with gray variations
    for (let i = 0; i < params.flies; i++) {
      const creature = new Fly({
        color: [40 + p.random(40), 40 + p.random(40), 40 + p.random(40)],
        size: 8 + p.random(-2, 2),
      });
      creature.init(p, pond);
      creatures.push(creature);
    }

    // Leaves (some autumn colored)
    for (let i = 0; i < params.leaves; i++) {
      const isAutumn = p.random() > 0.7;
      const creature = new Leaf(
        { size: 22 + p.random(-5, 8) },
        isAutumn
      );
      creature.init(p, pond);
      creatures.push(creature);
    }

    // Fish with orange/gold variations
    for (let i = 0; i < params.fish; i++) {
      const hueShift = p.random(-30, 30);
      const creature = new Fish({
        color: [220 + hueShift, 140 - hueShift * 0.5, 60],
        size: 18 + p.random(-3, 5),
      });
      creature.init(p, pond);
      creatures.push(creature);
    }

    return creatures;
  };

  const getTotalCreatures = () =>
    params.skimmers + params.flies + params.leaves + params.fish;

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current && pondRef.current) {
      pondRef.current.drawBackground(p5Ref.current);
      creaturesRef.current = createCreatures(p5Ref.current, pondRef.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p5Ref.current = p;

      // Create pond environment
      pondRef.current = new Pond();
      pondRef.current.init(p);
      pondRef.current.drawBackground(p);

      // Populate with creatures
      creaturesRef.current = createCreatures(p, pondRef.current);
    };

    p.draw = () => {
      const pond = pondRef.current;
      if (!pond) return;

      // Trail effect or clear background
      if (params.showTrail) {
        pond.applyTrailFade(p, params.trailOpacity);
      } else {
        pond.drawBackground(p);
      }

      // Draw pond decorations
      pond.drawForeground(p);

      // Rebuild creatures if count changed
      if (creaturesRef.current.length !== getTotalCreatures()) {
        creaturesRef.current = createCreatures(p, pond);
      }

      // Update all creatures
      const allCreatures = creaturesRef.current;
      for (const creature of allCreatures) {
        creature.update(allCreatures);
      }

      // Draw in layers: leaves (bottom) → fish → skimmers → flies (top)
      const layers = [
        allCreatures.filter((c) => c instanceof Leaf),
        allCreatures.filter((c) => c instanceof Fish),
        allCreatures.filter((c) => c instanceof Skimmer),
        allCreatures.filter((c) => c instanceof Fly),
      ];

      for (const layer of layers) {
        for (const creature of layer) {
          creature.display(p);
        }
      }

      // Creature count
      p.fill(100);
      p.noStroke();
      p.textSize(10);
      p.textAlign(p.LEFT, p.TOP);
      p.text(`Creatures: ${allCreatures.length}`, 10, 10);
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} key={resetKey} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
