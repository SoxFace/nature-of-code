'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function GaussianDistribution() {
    // Define the sketch function
    const sketch = (p5: p5) => {

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(255);
        };

        p5.draw = () => {
            const num = p5.randomGaussian(320, 60);

            p5.noStroke();
            p5.fill(0, 10);
            p5.circle(num, 120, 16);

        };
    };

    return (
        <SketchLayout
            title="Example 0.4: A Gaussian Distribution"
            description="A normal distribution with mean 320 and Standard deviation of 60"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}