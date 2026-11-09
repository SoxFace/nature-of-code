'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'example',
  number: 6,
  title: 'Perlin Noise Walker',
  description: 'Position mapped from Perlin noise. Lower noise speed = smoother movement.',
};

const params = {
  noiseIncrement: 0.01,
  circleSize: 48,
  showTrail: true,
  trailOpacity: 10,
};

export default function PerlinWalker() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      pane.addBinding(params, 'noiseIncrement', { min: 0.001, max: 0.05, step: 0.001, label: 'Noise Speed' });
      pane.addBinding(params, 'circleSize', { min: 10, max: 100, step: 5, label: 'Circle Size' });
      pane.addBinding(params, 'showTrail', { label: 'Show Trail' });
      pane.addBinding(params, 'trailOpacity', { min: 5, max: 50, step: 5, label: 'Trail Opacity' });
      pane.addButton({ title: 'Reset' }).on('click', () => setResetKey((k) => k + 1));
    }, { title: 'Perlin Walker' });

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(255);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    let timeX = 0;
    let timeY = 10000;

    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;
    };

    p.draw = () => {
      if (params.showTrail) {
        p.background(255, params.trailOpacity);
      } else {
        p.background(255);
      }

      const x = p.map(p.noise(timeX), 0, 1, 0, p.width);
      const y = p.map(p.noise(timeY), 0, 1, 0, p.height);

      p.strokeWeight(2);
      p.fill(127);
      p.stroke(0);
      p.circle(x, y, params.circleSize);

      timeX += params.noiseIncrement;
      timeY += params.noiseIncrement;
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} key={resetKey} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
