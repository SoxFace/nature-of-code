'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { BiasedWalker, createPane, disposePane, Pane, bindings } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 1,
  title: 'Biased Walker',
  description: 'A random walk with directional bias. Adjust bias strength and direction to control movement tendency.',
};

const params = {
  bias: 0.6,
  stepSize: 1,
  biasX: 1,
  biasY: 1,
};

export default function BiasedWalkerSketch() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const walkerRef = useRef<BiasedWalker | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        const biasFolder = pane.addFolder({ title: 'Bias Settings' });

        biasFolder
          .addBinding(params, 'bias', {
            ...bindings.probability,
            label: 'Bias Strength',
          })
          .on('change', (ev) => {
            walkerRef.current?.setBias(ev.value);
          });

        biasFolder
          .addBinding(params, 'biasX', {
            min: -1,
            max: 1,
            step: 1,
            label: 'X Direction',
          })
          .on('change', () => {
            walkerRef.current?.setBiasDirection(params.biasX, params.biasY);
          });

        biasFolder
          .addBinding(params, 'biasY', {
            min: -1,
            max: 1,
            step: 1,
            label: 'Y Direction',
          })
          .on('change', () => {
            walkerRef.current?.setBiasDirection(params.biasX, params.biasY);
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
      { title: 'Biased Walker' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current && walkerRef.current) {
      p5Ref.current.background(255);
      walkerRef.current = new BiasedWalker({
        stepSize: params.stepSize,
        bias: params.bias,
        biasDirection: { x: params.biasX, y: params.biasY },
      });
      walkerRef.current.init(p5Ref.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;

      walkerRef.current = new BiasedWalker({
        stepSize: params.stepSize,
        bias: params.bias,
        biasDirection: { x: params.biasX, y: params.biasY },
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
