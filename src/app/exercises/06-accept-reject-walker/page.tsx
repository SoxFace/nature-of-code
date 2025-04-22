'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function AcceptRejectwalker() {

    // Define the sketch function
    const sketch = (p5: p5) => {

        let walker: Walker;

        class Walker {
            x: number;
            y: number;

            constructor() {
                this.x = p5.width / 2;
                this.y = p5.height / 2;
            }

            display() {
                p5.stroke(0);
                p5.point(this.x, this.y);
            }

            step() {
                // Generate random steps using Gaussian distribution
                const step = 10;
                const stepX = p5.random(-step, step);
                const stepY = p5.random(-step, step);
                this.x += stepX;
                this.y += stepY;
            }
        }

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(255);
            walker = new Walker();
        };

        p5.draw = () => {
            walker.step();
            walker.display();
        };
    };

    return (
        <SketchLayout
            title="Exercise 0.6: Accept-Reject walker"
            description="A gaussian distribution walker"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}