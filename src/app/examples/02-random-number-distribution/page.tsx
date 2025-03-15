"use client";

import P5Wrapper from '@/components/P5Wrapper';
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function RandomNumberDistribution() {
    // Define the sketch function
    const sketch = (p5: p5) => {
        const randomCounts: number[] = [];
        const total: number = 20;        

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(0);
            for (let i = 0; i < total; i++) {
                randomCounts[i] = 0;
            }
        };

        p5.draw = () => {
            p5.background(0);
            const index = p5.floor(p5.random(randomCounts.length));
            randomCounts[index]++;
            p5.stroke(255);
            p5.fill(27)
            const w = p5.width / randomCounts.length;

            for (let x = 0; x < randomCounts.length; x++) {
                p5.rect(x * w, p5.height - randomCounts[x], w - 1, randomCounts[x]);
            }
        };
    };

    return (
        <SketchLayout
            title="Example 0.2: Random Number Distribution"
            description="A random number generator"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}