'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'example',
  number: 7,
  title: 'Fractal Tree',
  description: 'Recursive branching with Perlin noise. Click canvas or use New Tree button to regenerate.',
};

const params = {
  initialHeight: 60,
  shrinkFactor: 0.7,
  minBranches: 1,
  maxBranches: 5,
  minHeight: 4,
  noiseSpeed: 0.005,
  animate: true,
};

export default function FractalTree() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const seedRef = useRef(0);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      const treeFolder = pane.addFolder({ title: 'Tree Structure' });
      treeFolder.addBinding(params, 'initialHeight', { min: 30, max: 100, step: 5, label: 'Trunk Height' });
      treeFolder.addBinding(params, 'shrinkFactor', { min: 0.5, max: 0.9, step: 0.05, label: 'Shrink Factor' });
      treeFolder.addBinding(params, 'minHeight', { min: 2, max: 10, step: 1, label: 'Min Branch' });

      const branchFolder = pane.addFolder({ title: 'Branching' });
      branchFolder.addBinding(params, 'minBranches', { min: 1, max: 3, step: 1, label: 'Min Branches' });
      branchFolder.addBinding(params, 'maxBranches', { min: 2, max: 6, step: 1, label: 'Max Branches' });

      const animFolder = pane.addFolder({ title: 'Animation' });
      animFolder.addBinding(params, 'animate', { label: 'Animate' });
      animFolder.addBinding(params, 'noiseSpeed', { min: 0.001, max: 0.02, step: 0.001, label: 'Noise Speed' });

      pane.addButton({ title: 'New Tree' }).on('click', () => {
        if (p5Ref.current) seedRef.current = p5Ref.current.millis();
      });
    }, { title: 'Fractal Tree' });

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  const sketch = (p: p5) => {
    let yoff = 0;

    p.setup = () => {
      p.createCanvas(640, 360);
      p5Ref.current = p;
    };

    p.draw = () => {
      p.background(255);
      p.fill(0);
      p.stroke(0);
      p.translate(p.width / 2, p.height);

      if (params.animate) yoff += params.noiseSpeed;

      p.randomSeed(seedRef.current);
      branch(params.initialHeight, 0);
    };

    p.mousePressed = () => {
      if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
        yoff = p.random(1000);
        seedRef.current = p.millis();
      }
    };

    function branch(height: number, xoff: number) {
      const sw = p.map(height, params.minHeight, 100, 1, 5);
      p.strokeWeight(sw);
      p.line(0, 0, 0, -height);
      p.translate(0, -height);

      height *= params.shrinkFactor;
      xoff += 0.1;

      if (height > params.minHeight) {
        const n = p.floor(p.random(params.minBranches, params.maxBranches + 1));
        for (let i = 0; i < n; i++) {
          let theta = p.map(p.noise(xoff + i, yoff), 0, 1, -p.PI / 2, p.PI / 2);
          if (n % 2 === 0) theta *= -1;

          p.push();
          p.rotate(theta);
          branch(height, xoff);
          p.pop();
        }
      }
    }
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
