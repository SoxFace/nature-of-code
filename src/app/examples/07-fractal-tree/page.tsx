'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function FractalTree() {
    const sketch = (p5: p5) => {
        let seed = 0;
        let yoff = 0;

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(255);
        };

        p5.draw = () => {
            p5.background(255);
            p5.fill(0);
            p5.stroke(0);
            p5.translate(p5.width / 2, p5.height);
            yoff += 0.005;
            p5.randomSeed(seed);
            branch(60, 0);
        };

        p5.mousePressed = () => {
            yoff = p5.random(1000);
            seed = p5.millis();
        };

        function branch(height: number, xoff: number) {
            const sw = p5.map(height, 2, 100, 1, 5);
            p5.strokeWeight(sw);
            p5.line(0, 0, 0, -height);
            p5.translate(0, -height);

            height *= 0.7;
            xoff += 0.1;

            if (height > 4) {
                const n = p5.floor(p5.random(1, 5));
                for (let i = 0; i < n; i++) {
                    let theta = p5.map(p5.noise(xoff + i, yoff), 0, 1, -p5.PI / 2, p5.PI / 2);
                    if (n % 2 === 0) theta *= -1;

                    p5.push();
                    p5.rotate(theta);
                    branch(height, xoff);
                    p5.pop();
                }
            }
        }
    };

    return (
        <SketchLayout
            title="Example 0.7: Fractal Tree"
            description="A fractal tree and branches on mouseClick"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}