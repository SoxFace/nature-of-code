'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { PerlinWalker, createPane, disposePane, Pane, bindings } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 7,
  title: 'Perlin Noise Walker',
  description: 'Smooth, organic movement using Perlin noise. Adjust the increment to change smoothness of motion.',
};

const params = {
  noiseIncrement: 0.01,
  stepSize: 1,
  drawLines: true,
};

export default function PerlinWalkerSketch() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const walkerRef = useRef<PerlinWalker | null>(null);
  const p5Ref = useRef<p5 | null>(null);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        const noiseFolder = pane.addFolder({ title: 'Noise Settings' });
        noiseFolder
          .addBinding(params, 'noiseIncrement', {
            ...bindings.noiseIncrement,
            label: 'Increment',
          })
          .on('change', (ev) => {
            walkerRef.current?.setTimeIncrement(ev.value);
          });

        pane.addBinding(params, 'stepSize', {
          ...bindings.stepSize,
          max: 5,
        });

        pane.addBinding(params, 'drawLines', { label: 'Draw Lines' });

        pane.addButton({ title: 'Reset' }).on('click', () => {
          setResetKey((k) => k + 1);
        });
      },
      { title: 'Perlin Walker' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (resetKey > 0 && p5Ref.current) {
      p5Ref.current.background(255);
      walkerRef.current = new PerlinWalker({
        stepSize: params.stepSize,
        timeIncrement: params.noiseIncrement,
        drawLines: params.drawLines,
      });
      walkerRef.current.init(p5Ref.current);
    }
  }, [resetKey]);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      p5Ref.current = p;

      walkerRef.current = new PerlinWalker({
        stepSize: params.stepSize,
        timeIncrement: params.noiseIncrement,
        drawLines: params.drawLines,
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
