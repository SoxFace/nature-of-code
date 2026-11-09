'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import p5 from 'p5';
import { createPane, disposePane, Pane } from '@/lib';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 8,
  title: 'Perlin Noise Detail',
  description: 'Explore how octaves and falloff affect Perlin noise texture. Higher octaves = more detail.',
};

const params = {
  octaves: 4,
  falloff: 0.5,
  xScale: 0.01,
  yScale: 0.01,
};

export default function NoiseDetail() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        const noiseFolder = pane.addFolder({ title: 'Noise Settings' });

        noiseFolder.addBinding(params, 'octaves', {
          min: 1,
          max: 10,
          step: 1,
          label: 'Octaves',
        });

        noiseFolder.addBinding(params, 'falloff', {
          min: 0,
          max: 1,
          step: 0.01,
          label: 'Falloff',
        });

        const scaleFolder = pane.addFolder({ title: 'Scale' });

        scaleFolder.addBinding(params, 'xScale', {
          min: 0.001,
          max: 0.1,
          step: 0.001,
          label: 'X Scale',
        });

        scaleFolder.addBinding(params, 'yScale', {
          min: 0.001,
          max: 0.1,
          step: 0.001,
          label: 'Y Scale',
        });

        pane.addButton({ title: 'Randomize Seed' }).on('click', () => {
          if (p5Ref.current) {
            p5Ref.current.noiseSeed(Math.random() * 1000000);
          }
        });
      },
      { title: 'Perlin Noise' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(640, 360);
      p.colorMode(p.HSB);
      p5Ref.current = p;
    };

    p.draw = () => {
      p.noiseDetail(params.octaves, params.falloff);
      p.loadPixels();

      let xoff = 0;
      for (let x = 0; x < p.width; x++) {
        let yoff = 0;
        for (let y = 0; y < p.height; y++) {
          const noiseVal = p.noise(xoff, yoff);
          const bright = p.map(noiseVal, 0, 1, 0, 255);
          const hue = p.map(noiseVal, 0, 1, 0, 360);
          const col = p.color(hue, 100, bright);
          p.set(x, y, col);
          yoff += params.yScale;
        }
        xoff += params.xScale;
      }

      p.updatePixels();
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
