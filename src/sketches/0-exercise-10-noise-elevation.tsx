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
  number: 10,
  title: 'Perlin Noise Elevation',
  description: '3D terrain generated with Perlin noise. Adjust noise scale for rougher/smoother terrain.',
};

const params = {
  scale: 20,
  noiseScale: 0.1,
  heightRange: 120,
  rotationSpeed: 0.0025,
  animateNoise: true,
};

export default function NoiseElevation() {
  const paneRef = useRef<Pane | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || paneRef.current) return;

    paneRef.current = createPane(
      containerRef.current,
      params,
      (pane) => {
        const terrainFolder = pane.addFolder({ title: 'Terrain' });

        terrainFolder.addBinding(params, 'scale', {
          min: 10,
          max: 40,
          step: 5,
          label: 'Grid Scale',
        });

        terrainFolder.addBinding(params, 'heightRange', {
          min: 50,
          max: 200,
          step: 10,
          label: 'Height Range',
        });

        const noiseFolder = pane.addFolder({ title: 'Noise' });

        noiseFolder.addBinding(params, 'noiseScale', {
          min: 0.05,
          max: 0.3,
          step: 0.01,
          label: 'Noise Scale',
        });

        noiseFolder.addBinding(params, 'animateNoise', {
          label: 'Animate',
        });

        const viewFolder = pane.addFolder({ title: 'View' });

        viewFolder.addBinding(params, 'rotationSpeed', {
          min: 0,
          max: 0.01,
          step: 0.0005,
          label: 'Rotation Speed',
        });
      },
      { title: '3D Terrain' }
    );

    return () => {
      disposePane(paneRef.current);
      paneRef.current = null;
    };
  }, []);

  const sketch = (p: p5) => {
    let theta = 0;
    let zoff = 0;

    const terrainWidth = 800;
    const terrainHeight = 400;

    p.setup = () => {
      p.createCanvas(640, 360, p.WEBGL);
    };

    p.draw = () => {
      p.background(255);

      const cols = Math.floor(terrainWidth / params.scale);
      const rows = Math.floor(terrainHeight / params.scale);

      const z: number[][] = [];
      let xoff = 0;
      for (let i = 0; i < cols; i++) {
        z[i] = [];
        let yoff = 0;
        for (let j = 0; j < rows; j++) {
          z[i][j] = p.map(
            p.noise(xoff, yoff, zoff),
            0,
            1,
            -params.heightRange,
            params.heightRange
          );
          yoff += params.noiseScale;
        }
        xoff += params.noiseScale;
      }

      if (params.animateNoise) {
        zoff += 0.01;
      }

      p.push();
      p.translate(0, 20, -200);
      p.rotateX(p.PI / 3);
      p.rotateZ(theta);

      for (let x = 0; x < cols - 1; x++) {
        p.beginShape(p.QUAD_STRIP);
        for (let y = 0; y < rows; y++) {
          p.stroke(0);
          const elevation = z[x][y];
          const shade = p.map(elevation, -params.heightRange, params.heightRange, 0, 255);
          p.fill(shade, 255);

          const xCoord = x * params.scale - terrainWidth / 2;
          const yCoord = y * params.scale - terrainHeight / 2;
          p.vertex(xCoord, yCoord, z[x][y]);
          p.vertex(xCoord + params.scale, yCoord, z[x + 1][y]);
        }
        p.endShape();
      }

      p.pop();

      theta += params.rotationSpeed;
    };
  };

  return (
    <div className="flex gap-4">
      <P5Wrapper sketch={sketch} />
      <div ref={containerRef} className="min-w-[250px]" />
    </div>
  );
}
