"use client"

import P5Wrapper from '@/components/P5Wrapper';
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';
import { useState } from 'react';

export default function TraditionalRandomWalker() {
    const [isDiscrete, setIsDiscrete] = useState(true);

    const sketch = (p5: p5) => {
        let walker: Walker;
        let pointCounter: number = 0;

        class Walker {
            x: number;
            y: number;
            constructor() {
                this.x = p5.width / 2;
                this.y = p5.height / 2;
            }

            show() {
                p5.stroke(255);
                p5.strokeWeight(p5.floor(p5.random(1, 10)));
                p5.point(this.x, this.y);
                pointCounter++;
            }

            step() {
                let xStep, yStep;

                if (isDiscrete) {
                    // Discrete Random Values -1, 0, or 1
                    // more grid-like, pixelated movement
                    xStep = p5.floor(p5.random(3)) - 1;
                    yStep = p5.floor(p5.random(3)) - 1;
                } else {
                    // Continuous Random Values -1 and 1 (inclusive of -1, but exclusive of 1)
                    // gradual movement in any direction
                    xStep = p5.random(-1, 1);
                    yStep = p5.random(-1, 1);
                }

                const stepSize = 10;

                this.x += xStep * stepSize;
                this.y += yStep * stepSize;

                // Ensure the walker stays within the canvas bounds
                this.x = p5.constrain(this.x, 0, p5.width);
                this.y = p5.constrain(this.y, 0, p5.height);
            }
        }

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(50);
            walker = new Walker();
        }

        p5.draw = () => {
            if (pointCounter < 1000) {
                walker.step();
                walker.show();
            } else {
                p5.noLoop(); // Stop the drawing loop when pointCounter reaches 1000
                console.log(`Drawing stopped at ${pointCounter} points`);
            }
        }
    }

    return (
        <SketchLayout
    title="Traditional Random Walk"
    description="A simple random walk simulation where each step moves in one of four directions with equal probability. It has a toggle to switch between discrete (grid-like) and continuous random values and automatically stops at 1000 data points."
>
    <div className="space-y-4">
        <P5Wrapper sketch={sketch} />
        <div className="pt-2">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => setIsDiscrete(!isDiscrete)}>
                Toggle to {isDiscrete ? "Continuous" : "Discrete"} Mode
            </button>
        </div>
    </div>
</SketchLayout>
    );
}