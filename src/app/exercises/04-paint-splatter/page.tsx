"use client";

import P5Wrapper from '@/components/P5Wrapper';
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function PaintSplatter() {

    // Define the sketch function
    const sketch = (p5: p5) => {

        let slider: p5.Element;

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.background(255);
            // Parameters: min, max, starting value, step size
            slider = p5.createSlider(10, 100, 10, 1);
            slider.position(120, 150);
            slider.style('width', '80px');
        };

        p5.draw = () => {
            const currentStdDev = slider.value() as number;
            const x = p5.randomGaussian(p5.width / 2, currentStdDev);
            const y = p5.randomGaussian(p5.height / 2, currentStdDev);

            // Generate random color
            const r = p5.random(255);
            const g = p5.random(255);
            const b = p5.random(255);

            // Draw the paint splatter
            p5.noStroke();
            p5.fill(r, g, b, 150);
            p5.circle(x, y, 16);

            // Display the current standard deviation
            p5.fill(0);
            p5.rect(10, 40, 200, 20);
            p5.fill(255);
            p5.textSize(12);
            p5.text(`Standard Deviation: ${currentStdDev}`, 15, 55);
        };
    };

    return (
        <SketchLayout
            title="Exercise 0.4: Normal paint splatter"
            description="A normal distribution of paint splatters"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}