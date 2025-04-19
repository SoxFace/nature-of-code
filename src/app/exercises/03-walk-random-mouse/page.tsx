'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function WalkRandomMouse() {
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
                // Determine if we should move toward mouse (50% chance)
                if (p5.random() < 0.5) {
                    // Move toward the mouse
                    // Determine the direction to the mouse
                    const dx = p5.mouseX > this.x ? 1 : -1;
                    const dy = p5.mouseY > this.y ? 1 : -1;
                    
                    // Move either horizontally or vertically toward mouse
                    if (p5.random() < 0.5) {
                        this.x += dx;
                    } else {
                        this.y += dy;
                    }
                } else {
                    // Move randomly in any of the four directions
                    const choice = p5.floor(p5.random(4));
                    
                    if (choice === 0) {
                        this.x++; // Right
                    } else if (choice === 1) {
                        this.x--; // Left
                    } else if (choice === 2) {
                        this.y++; // Down
                    } else {
                        this.y--; // Up
                    }
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
            title="Exercise 0.3: Random dynamic walker"
            description="A random walk that has a 50% chance of moving in the direction of the mouse."
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}