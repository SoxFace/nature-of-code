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
  number: 3,
  title: 'Walker Tends Right',
  description: 'Biased random walk. Increase right probability to see stronger drift.',
};

const params = {
  rightProb: 0.4,
  stepSize: 1,
};

export default function WalkerRight() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      pane.addBinding(params, 'rightProb', { min: 0.1, max: 0.9, step: 0.05, label: 'Right Probability' });
      pane.addBinding(params, 'stepSize', { min: 1, max: 5, step: 1, label: 'Step Size' });
      pane.addButton({ title: 'Reset' }).on('click', () => setResetKey((k) => k + 1));
    }, { title: 'Biased Walker' });

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
    let x: number, y: number;

    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;
      x = p.width / 2;
      y = p.height / 2;
    };

    p.draw = () => {
      const remaining = 1 - params.rightProb;
      const otherProb = remaining / 3;

      const r = p.random(1);
      if (r < params.rightProb) x += params.stepSize;
      else if (r < params.rightProb + otherProb) x -= params.stepSize;
      else if (r < params.rightProb + otherProb * 2) y += params.stepSize;
      else y -= params.stepSize;

      x = p.constrain(x, 0, p.width);
      y = p.constrain(y, 0, p.height);

      p.stroke(0);
      p.point(x, y);
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} key={resetKey} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
