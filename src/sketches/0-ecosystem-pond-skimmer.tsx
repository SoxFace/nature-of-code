'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { Creature, creaturePresets, createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 11,
  title: 'Ecosystem: Pond Life',
  description: 'Multiple creatures with distinct personalities interacting in a pond. Each type has unique movement and behavior.',
};

const params = {
  skimmers: 2,
  flies: 3,
  leaves: 2,
  fish: 2,
  showTrail: true,
  trailOpacity: 20,
};

export default function EcosystemPond() {
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

        populationFolder.addBinding(params, 'skimmers', {
          min: 0,
          max: 5,
          step: 1,
          label: 'Skimmers',
        });

        populationFolder.addBinding(params, 'flies', {
          min: 0,
          max: 8,
          step: 1,
          label: 'Flies',
        });

        populationFolder.addBinding(params, 'leaves', {
          min: 0,
          max: 5,
          step: 1,
          label: 'Leaves',
        });

        populationFolder.addBinding(params, 'fish', {
          min: 0,
          max: 5,
          step: 1,
          label: 'Fish',
        });

        const visualFolder = pane.addFolder({ title: 'Visual' });
        visualFolder.addBinding(params, 'showTrail', { label: 'Show Trails' });
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

  const createAllCreatures = (p: p5): Creature[] => {
    const creatures: Creature[] = [];

    // Create skimmers with blue color variations
    for (let i = 0; i < params.skimmers; i++) {
      const hueShift = p.random(-20, 20);
      const creature = new Creature({
        ...creaturePresets.skimmer,
        color: [80 + hueShift, 120, 200 - hueShift],
        size: 20 + p.random(-3, 3),
      });
      creature.init(p);
      creatures.push(creature);
    }

    // Create flies
    for (let i = 0; i < params.flies; i++) {
      const creature = new Creature({
        ...creaturePresets.fly,
        color: [40 + p.random(40), 40 + p.random(40), 40 + p.random(40)],
        size: 8 + p.random(-2, 2),
      });
      creature.init(p);
      creatures.push(creature);
    }

    // Create leaves with green/brown variations
    for (let i = 0; i < params.leaves; i++) {
      const isAutumn = p.random() > 0.7;
      const creature = new Creature({
        ...creaturePresets.leaf,
        color: isAutumn
          ? [180 + p.random(40), 100 + p.random(40), 40]
          : [80 + p.random(40), 140 + p.random(40), 50 + p.random(30)],
        size: 22 + p.random(-5, 8),
      });
      creature.init(p);
      creatures.push(creature);
    }

    // Create fish with orange/gold variations
    for (let i = 0; i < params.fish; i++) {
      const hueShift = p.random(-30, 30);
      const creature = new Creature({
        ...creaturePresets.fish,
        color: [220 + hueShift, 140 - hueShift * 0.5, 60],
        size: 18 + p.random(-3, 5),
      });
      creature.init(p);
      creatures.push(creature);
    }

    return creatures;
  };

  const getTotalCreatures = () =>
    params.skimmers + params.flies + params.leaves + params.fish;

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(240, 248, 255);
      creaturesRef.current = createAllCreatures(p5Ref.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(240, 248, 255);
      p5Ref.current = p;
      creaturesRef.current = createAllCreatures(p);
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

      // Draw some subtle water ripples
      p.stroke(200, 220, 240, 50);
      p.strokeWeight(1);
      for (let i = 0; i < 3; i++) {
        const rippleSize = 100 + i * 80 + Math.sin(p.frameCount * 0.02 + i) * 20;
        p.ellipse(p.width / 2, p.height / 2, rippleSize, rippleSize * 0.6);
      }

      // Rebuild creatures if count changed
      if (creaturesRef.current.length !== getTotalCreatures()) {
        creaturesRef.current = createAllCreatures(p);
      }

      // Update and draw creatures (pass all creatures for social behavior)
      const allCreatures = creaturesRef.current;
      for (const creature of allCreatures) {
        creature.update(allCreatures);
      }

      // Draw in order: leaves (bottom), fish, skimmers, flies (top)
      const leaves = allCreatures.filter((c) => c.traits.type === 'leaf');
      const fish = allCreatures.filter((c) => c.traits.type === 'fish');
      const skimmers = allCreatures.filter((c) => c.traits.type === 'skimmer');
      const flies = allCreatures.filter((c) => c.traits.type === 'fly');

      for (const creature of [...leaves, ...fish, ...skimmers, ...flies]) {
        creature.display(p);
      }

      // Draw creature count
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
