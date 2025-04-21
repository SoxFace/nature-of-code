'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function AcceptRejectDistribution() {
    // Define the sketch function
    const sketch = (p5: p5) => {

        const randomCounts: number[] = [];

        p5.setup = () => {
            p5.createCanvas(640, 360);
            for (let i = 0; i < 20; i++) {
                randomCounts[i] = 0;
            }
        };

        p5.draw = () => {
            p5.background(255);
            // Pick a random number and increase the count
            const index = p5.int(acceptReject() * randomCounts.length);
            randomCounts[index]++;

            p5.stroke(0);
            p5.strokeWeight(2);
            p5.fill(127);

            const w = p5.width / randomCounts.length;
            for (let x = 0; x < randomCounts.length; x++) {
                p5.rect(x * w, p5.height - randomCounts[x], w, randomCounts[x], w - 1, randomCounts[x]);
            }
        };

        function acceptReject() {
            while (true) {
                const r1 = p5.random(1);
                const probability = r1;
                const r2 = p5.random(1);
                if (r2 < probability) {
                    return r1;
                }
            }
        }
    };



    return (
        <SketchLayout
            title="Example 0.5: Accept-Reject Distribution"
            description="Qualifying a random value using the accept-reject (Monte Carlo) distribution method"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}