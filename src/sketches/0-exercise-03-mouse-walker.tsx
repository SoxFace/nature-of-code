'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { MouseSeekingWalker, createPane, disposePane, Pane, bindings } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 3,
  title: 'Mouse-Seeking Walker',
  description: 'A walker with adjustable probability of moving toward the mouse. Move your mouse around the canvas!',
};

const params = {
  mouseInfluence: 0.5,
  stepSize: 1,
};

export default function MouseWalker() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const walkerRef = useRef<MouseSeekingWalker | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        pane
          .addBinding(params, 'mouseInfluence', bindings.mouseInfluence)
          .on('change', (ev) => {
            walkerRef.current?.setMouseInfluence(ev.value);
          });

        pane
          .addBinding(params, 'stepSize', bindings.stepSize)
          .on('change', (ev) => {
            walkerRef.current?.setStepSize(ev.value);
          });

        pane.addButton({ title: 'Reset' }).on('click', () => {
          setResetKey((k) => k + 1);
        });
      },
      { title: 'Mouse Walker' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(255);
      walkerRef.current = new MouseSeekingWalker({
        stepSize: params.stepSize,
        mouseInfluence: params.mouseInfluence,
      });
      walkerRef.current.init(p5Ref.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;

      walkerRef.current = new MouseSeekingWalker({
        stepSize: params.stepSize,
        mouseInfluence: params.mouseInfluence,
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
