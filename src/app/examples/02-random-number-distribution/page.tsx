'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function RandomNumberDistribution() {
    // Define the sketch function
    const sketch = (p5: p5) => {
        const randomCounts: number[] = [];
        const totalNumbers = 20;

        p5.setup = () => {
            p5.createCanvas(640, 360);
            
            // Initialize array to 0
            for (let i = 0; i < totalNumbers; i++) {
                randomCounts[i] = 0;
            }
            
            p5.background(255);
        };

        p5.draw = () => {
            // Generate random number between 0 and totalNumbers
            const index = Math.floor(p5.random(totalNumbers));
            
            // Increment the count for this random number
            randomCounts[index]++;
            
            p5.background(255);
            
            // Draw the histogram
            p5.stroke(0);
            p5.fill(175);
            const w = p5.width / totalNumbers;
            
            for (let i = 0; i < totalNumbers; i++) {
                p5.rect(i * w, p5.height - randomCounts[i], w - 1, randomCounts[i]);
            }
        };
    };

    return (
        <SketchLayout
            title="Example 02: Random Number Distribution"
            description="Visualizing the distribution of random numbers"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}