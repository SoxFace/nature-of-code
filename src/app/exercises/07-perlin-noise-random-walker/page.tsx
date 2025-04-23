'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function PerlinNoiseRandomWalker() {

    // Define the sketch function
    const sketch = (p5: p5) => {

        let walker: Walker;

        class Walker {
            x: number = 0;
            y: number = 0;
            timeX: number;
            timeY: number;
            oldx: number;
            oldy: number;

            constructor() {
                this.x = p5.width / 2;
                this.y = p5.height / 2;
                this.oldx = this.x;
                this.oldy = this.y;
                this.timeX = 0;
                this.timeY = 10000;
            }

            // map directly to walker's position
            step() {
                this.x += p5.map(p5.noise(this.timeX), 0, 1, -1, 1);
                this.y += p5.map(p5.noise(this.timeY), 0, 1, -1, 1);
                this.timeX += 0.01;
                this.timeY += 0.01;
            }

            show() {
                p5.stroke(0);
                p5.line(this.oldx, this.oldy, this.x, this.y);
                this.oldx = this.x;
                this.oldy = this.y;
            }
        }

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(255);
            walker = new Walker();
        };

        p5.draw = () => {
            walker.step();
            walker.show();
        };
    };

    return (
        <SketchLayout
            title="Exercise 0.7: Perlin Noise Random Walker"
            description="Perlin noise function is mapped directly to the walker's position"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}