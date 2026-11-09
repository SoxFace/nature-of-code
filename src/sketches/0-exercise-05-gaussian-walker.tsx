'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { GaussianWalker, createPane, disposePane, Pane, bindings } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 5,
  title: 'Gaussian Walker',
  description: 'A walker with Gaussian-distributed step sizes. Higher standard deviation = more varied step sizes.',
};

const params = {
  stdDev: 3,
};

export default function GaussianWalkerSketch() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const walkerRef = useRef<GaussianWalker | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        pane
          .addBinding(params, 'stdDev', {
            ...bindings.stdDev,
            label: 'Std Deviation',
          })
          .on('change', (ev) => {
            walkerRef.current?.setStdDev(ev.value);
          });

        pane.addButton({ title: 'Reset' }).on('click', () => {
          setResetKey((k) => k + 1);
        });
      },
      { title: 'Gaussian Walker' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(255);
      walkerRef.current = new GaussianWalker({
        stdDev: params.stdDev,
      });
      walkerRef.current.init(p5Ref.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;

      walkerRef.current = new GaussianWalker({
        stdDev: params.stdDev,
      });
      walkerRef.current.init(p);
    };

    p.draw = () => {
      if (!walkerRef.current) return;
      walkerRef.current.step();
      walkerRef.current.display(p);
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
