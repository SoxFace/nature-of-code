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
  number: 1,
  title: 'Random Walk',
  description: 'Classic random walk. Toggle discrete mode for grid-like vs smooth movement.',
};

const params = {
  discrete: true,
  stepSize: 10,
  pointLimit: 1000,
  strokeWeight: 2,
};

export default function RandomWalk() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(containerRef.current, params, (pane) => {
      pane.addBinding(params, 'discrete', { label: 'Discrete Mode' });
      pane.addBinding(params, 'stepSize', { min: 1, max: 30, step: 1, label: 'Step Size' });
      pane.addBinding(params, 'strokeWeight', { min: 1, max: 10, step: 1, label: 'Stroke Weight' });
      pane.addBinding(params, 'pointLimit', { min: 100, max: 5000, step: 100, label: 'Point Limit' });
      pane.addButton({ title: 'Reset' }).on('click', () => setResetKey((k) => k + 1));
    }, { title: 'Random Walk' });

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(50);
      p5Ref.current.loop();
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    let x: number, y: number;
    let pointCounter = 0;

    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(50);
      p5Ref.current = p;
      x = p.width / 2;
      y = p.height / 2;
      pointCounter = 0;
    };

    p.draw = () => {
      if (pointCounter >= params.pointLimit) {
        p.noLoop();
        return;
      }

      let xStep, yStep;
      if (params.discrete) {
        xStep = p.floor(p.random(3)) - 1;
        yStep = p.floor(p.random(3)) - 1;
      } else {
        xStep = p.random(-1, 1);
        yStep = p.random(-1, 1);
      }

      x += xStep * params.stepSize;
      y += yStep * params.stepSize;
      x = p.constrain(x, 0, p.width);
      y = p.constrain(y, 0, p.height);

      p.stroke(255);
      p.strokeWeight(params.strokeWeight);
      p.point(x, y);
      pointCounter++;
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
