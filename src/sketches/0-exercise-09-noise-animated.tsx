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
  number: 9,
  title: 'Animated Perlin Noise',
  description: 'Perlin noise animated through the z-axis. Adjust speed to control how fast the pattern evolves.',
};

const params = {
  octaves: 4,
  falloff: 0.5,
  xScale: 0.01,
  yScale: 0.01,
  animationSpeed: 0.01,
  paused: false,
};

export default function NoiseAnimated() {
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

        const animFolder = pane.addFolder({ title: 'Animation' });

        animFolder.addBinding(params, 'animationSpeed', {
          min: 0.001,
          max: 0.05,
          step: 0.001,
          label: 'Speed',
        });

        animFolder.addBinding(params, 'paused', { label: 'Paused' });

        pane.addButton({ title: 'Randomize Seed' }).on('click', () => {
          if (p5Ref.current) {
            p5Ref.current.noiseSeed(Math.random() * 1000000);
          }
        });
      },
      { title: 'Animated Noise' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  const sketch = (p: p5) => {
    let zoff = 0;

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
          const noiseVal = p.noise(xoff, yoff, zoff);
          const bright = p.map(noiseVal, 0, 1, 0, 255);
          const hue = p.map(noiseVal, 0, 1, 0, 360);
          const col = p.color(hue, 100, bright);
          p.set(x, y, col);
          yoff += params.yScale;
        }
        xoff += params.xScale;
      }

      p.updatePixels();

      if (!params.paused) {
        zoff += params.animationSpeed;
      }
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
