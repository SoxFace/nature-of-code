'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function NoiseDetail() {

    // Define the sketch function
    const sketch = (p5: p5) => {

        // Controls
        let octavesSlider: p5.Element;
        let falloffSlider: p5.Element;
        let xoffSlider: p5.Element;
        let yoffSlider: p5.Element;

        p5.setup = () => {
            p5.createCanvas(640, 360);
            p5.colorMode(p5.HSB);
            createControls(280)
            p5.background(255);
        };

        p5.draw = () => {
            //map slider values to variables
            p5.noiseDetail(Number(octavesSlider.value()), Number(falloffSlider.value()));
            const xoffValue = xoffSlider.value();
            const yoffValue = yoffSlider.value();

            // Tell p5 we will work with pixels
            p5.loadPixels();

            let xoff = 0.0;
            // Updating pixels with perlin noise
            for (let x = 0; x < p5.width; x++) {
                let yoff = 0.0;

                for (let y = 0; y < p5.height; y++) {
                    // Calculating brightness value for noise
                    const bright = p5.map(p5.noise(xoff, yoff), 0, 1, 0, 255);
                    //Calculating hue value for noise
                    const hu = p5.map(p5.noise(xoff, yoff), 0, 1, 0, 360);
                    const col = p5.color(hu, 100, bright);
                    p5.set(x, y, col);
                    yoff += Number(yoffValue);
                }
                xoff += Number(xoffValue);
            }

            p5.updatePixels();
        };

        function createControls(ypos: number) {
            let xpos = 200;
            
            const cpTitle = p5.createP("Perlin Noise");
            cpTitle.position(xpos, ypos + 300);
            cpTitle.style("font-size", "14pt");
            cpTitle.style("font-weight", "bold");
            xpos += 120;
          
            const randomizeButton = p5.createButton("Randomize");
            randomizeButton.position(xpos, ypos + 300);
            randomizeButton.mousePressed(randomizeButtonClicked);
            
            xpos = 250;
            const octavesTitle = p5.createP("Octaves");
            octavesTitle.position(xpos, ypos + 350);
            xpos += 60;
          
            octavesSlider = p5.createSlider(1, 10, 4, 1);
            octavesSlider.position(xpos, ypos + 350);
            octavesSlider.size(80);
            xpos += 100;
            
            const falloffTitle = p5.createP("Falloff");
            falloffTitle.position(xpos, ypos + 350);
            xpos += 50;
          
            falloffSlider = p5.createSlider(0, 1, 0.5, 0);
            falloffSlider.position(xpos, ypos + 350);
            falloffSlider.size(80);
            xpos += 100;
            
            const xoffTitle = p5.createP("xoff");
            xoffTitle.position(xpos, ypos + 350);
            xpos += 30;
          
            xoffSlider = p5.createSlider(0.01, 0.1, 0.01, 0.01);
            xoffSlider.position(xpos, ypos + 350);
            xoffSlider.size(80);
            xpos += 100;
            
            const yoffTitle = p5.createP("yoff");
            yoffTitle.position(xpos, ypos + 350);
            xpos += 30;
          
            yoffSlider = p5.createSlider(0.01,0.1,0.01, 0.01);
            yoffSlider.position(xpos, ypos + 350);
            yoffSlider.size(80);
            xpos += 100;
          }

          function randomizeButtonClicked() {
            p5.noiseSeed(p5.random(0, 1000000));
          }
    };

    return (
        <SketchLayout
            title="Exercise 0.8: Noise Detail"
            description="Different visual effects using noiseDetail"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}