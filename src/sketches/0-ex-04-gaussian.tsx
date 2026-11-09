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
  number: 4,
  title: 'Gaussian Distribution',
  description: 'Normal distribution visualization. Adjust std deviation to see tighter or wider spread.',
};

const params = {
  mean: 320,
  stdDev: 60,
  circleSize: 16,
  opacity: 10,
};

export default function GaussianDistribution() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      pane.addBinding(params, 'mean', { min: 100, max: 540, step: 10, label: 'Mean (center)' });
      pane.addBinding(params, 'stdDev', { min: 10, max: 150, step: 5, label: 'Std Deviation' });
      pane.addBinding(params, 'circleSize', { min: 4, max: 40, step: 2, label: 'Circle Size' });
      pane.addBinding(params, 'opacity', { min: 5, max: 50, step: 5, label: 'Opacity' });
      pane.addButton({ title: 'Clear' }).on('click', () => setResetKey((k) => k + 1));
    }, { title: 'Gaussian' });

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
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;
    };

    p.draw = () => {
      const x = p.randomGaussian(params.mean, params.stdDev);
      p.noStroke();
      p.fill(0, params.opacity);
      p.circle(x, p.height / 2, params.circleSize);
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} key={resetKey} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
