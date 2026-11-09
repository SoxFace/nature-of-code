'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { AcceptRejectWalker, createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 6,
  title: 'Accept-Reject Walker',
  description: 'Monte Carlo accept-reject algorithm biases toward smaller steps. Larger max step = more variation.',
};

const params = {
  maxStep: 10,
};

export default function AcceptRejectWalkerSketch() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const walkerRef = useRef<AcceptRejectWalker | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        pane
          .addBinding(params, 'maxStep', {
            min: 1,
            max: 30,
            step: 1,
            label: 'Max Step Size',
          })
          .on('change', (ev) => {
            walkerRef.current?.setMaxStep(ev.value);
          });

        pane.addButton({ title: 'Reset' }).on('click', () => {
          setResetKey((k) => k + 1);
        });
      },
      { title: 'Accept-Reject Walker' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(255);
      walkerRef.current = new AcceptRejectWalker({
        maxStep: params.maxStep,
      });
      walkerRef.current.init(p5Ref.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;

      walkerRef.current = new AcceptRejectWalker({
        maxStep: params.maxStep,
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
