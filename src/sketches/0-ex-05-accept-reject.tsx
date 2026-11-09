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
  number: 5,
  title: 'Accept-Reject Distribution',
  description: 'Monte Carlo method creates custom distributions. Exponent controls the curve shape.',
};

const params = {
  buckets: 20,
  speed: 1,
  exponent: 1,
};

export default function AcceptRejectDist() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      pane.addBinding(params, 'buckets', { min: 5, max: 40, step: 1, label: 'Buckets' });
      pane.addBinding(params, 'speed', { min: 1, max: 10, step: 1, label: 'Speed' });
      pane.addBinding(params, 'exponent', { min: 0.5, max: 3, step: 0.5, label: 'Exponent' });
      pane.addButton({ title: 'Reset' }).on('click', () => setResetKey((k) => k + 1));
    }, { title: 'Accept-Reject' });

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
      for (let i = 0; i < currentBuckets; i++) randomCounts[i] = 0;
    }

    function acceptReject(): number {
      while (true) {
        const r1 = p.random(1);
        const probability = Math.pow(r1, params.exponent);
        const r2 = p.random(1);
        if (r2 < probability) return r1;
      }
    }

    p.draw = () => {
      if (params.buckets !== currentBuckets) initCounts();

      for (let s = 0; s < params.speed; s++) {
        const index = p.int(acceptReject() * currentBuckets);
        if (index < currentBuckets) randomCounts[index]++;
      }

      p.background(255);
      p.stroke(0);
      p.strokeWeight(2);
      p.fill(127);

      const w = p.width / currentBuckets;
      for (let x = 0; x < currentBuckets; x++) {
        p.rect(x * w, p.height - randomCounts[x], w - 1, randomCounts[x]);
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
