'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function PerlinNoiseWalker() {
    // Define the sketch function
    const sketch = (p5: p5) => {

        let walker: Walker;

        class Walker {
            x: number = 0;
            y: number = 0;
            timeX: number;
            timeY: number;

            constructor() {
                this.timeX = 0;
                this.timeY = 10000;
            }

            step() {
                this.x = p5.map(p5.noise(this.timeX), 0, 1, 0, p5.width);
                this.y = p5.map(p5.noise(this.timeY), 0, 1, 0, p5.height);
                this.timeX += 0.01;
                this.timeY += 0.01;
            }

            show() {
                p5.strokeWeight(2);
                p5.fill(127);
                p5.stroke(0);  
                p5.circle(this.x, this.y, 48);
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
            title="Example 0.6: Perlin Noise Walker"
            description="A Perlin Noise Walker. Generates a trail to simulate motion"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}