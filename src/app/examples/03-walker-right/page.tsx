'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function RightWalker() {
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
                const r = p5.random(1);
                if ( r < 0.4) {
                    this.x++;
                } else if ( r < 0.6) {
                    this.x--;
                }
                else if ( r < 0.8) {
                    this.y++;
                } else {
                    this.y--;
                }

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
            title="Example 0.3: Right Walker"
            description="A random walker moves to the right"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}