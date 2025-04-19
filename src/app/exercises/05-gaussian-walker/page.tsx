'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function GaussianWalker() {

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
                const x = p5.randomGaussian(0, 3);
                const y = p5.randomGaussian(0, 3);
                this.x += x;
                this.y += y;

                // Ensure the walker stays within the canvas bounds
                this.x = p5.constrain(this.x, 0, p5.width);
                this.y = p5.constrain(this.y, 0, p5.height);
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
            title="Exercise 0.5: Gaussian walker"
            description="A gaussian distribution walker"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}