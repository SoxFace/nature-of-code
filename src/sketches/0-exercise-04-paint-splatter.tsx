'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 4,
  title: 'Gaussian Paint Splatter',
  description: 'Paint splatters with Gaussian distribution. Adjust spread to see how standard deviation affects clustering.',
};

const params = {
  stdDev: 50,
  dotSize: 16,
  opacity: 150,
};

export default function PaintSplatter() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        pane.addBinding(params, 'stdDev', {
          min: 10,
          max: 150,
          step: 1,
          label: 'Spread',
        });

        pane.addBinding(params, 'dotSize', {
          min: 4,
          max: 40,
          step: 1,
          label: 'Dot Size',
        });

        pane.addBinding(params, 'opacity', {
          min: 50,
          max: 255,
          step: 1,
          label: 'Opacity',
        });

        pane.addButton({ title: 'Clear Canvas' }).on('click', () => {
          setResetKey((k) => k + 1);
        });
      },
      { title: 'Paint Splatter' }
    );

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
      const x = p.randomGaussian(p.width / 2, params.stdDev);
      const y = p.randomGaussian(p.height / 2, params.stdDev);

      const r = p.random(255);
      const g = p.random(255);
      const b = p.random(255);

      p.noStroke();
      p.fill(r, g, b, params.opacity);
      p.circle(x, y, params.dotSize);
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
