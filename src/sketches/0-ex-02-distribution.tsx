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
  number: 2,
  title: 'Random Distribution',
  description: 'Uniform distribution - all buckets should grow at roughly equal rates.',
};

const params = {
  buckets: 20,
  speed: 1,
};

export default function RandomDistribution() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      pane.addBinding(params, 'buckets', { min: 5, max: 50, step: 1, label: 'Buckets' });
      pane.addBinding(params, 'speed', { min: 1, max: 10, step: 1, label: 'Speed' });
      pane.addButton({ title: 'Reset' }).on('click', () => setResetKey((k) => k + 1));
    }, { title: 'Distribution' });

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  const sketch = (p: p5) => {
    let randomCounts: number[] = [];
    let currentBuckets = params.buckets;

    p.setup = () => {
      p.createCanvas(640, 360);
      initCounts();
    };

    function initCounts() {
      randomCounts = [];
      currentBuckets = params.buckets;
      for (let i = 0; i < currentBuckets; i++) {
        randomCounts[i] = 0;
      }
    }

    p.draw = () => {
      if (params.buckets !== currentBuckets) initCounts();

      for (let s = 0; s < params.speed; s++) {
        const index = Math.floor(p.random(currentBuckets));
        randomCounts[index]++;
      }

      p.background(255);
      p.stroke(0);
      p.fill(175);

      const w = p.width / currentBuckets;
      for (let i = 0; i < currentBuckets; i++) {
        p.rect(i * w, p.height - randomCounts[i], w - 1, randomCounts[i]);
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
