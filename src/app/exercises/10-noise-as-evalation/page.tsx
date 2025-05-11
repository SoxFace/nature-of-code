'use client';

import dynamic from 'next/dynamic';
// Dynamically import P5Wrapper to disable SSR
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function NoiseAsElevation() {

    // Define the sketch function
    const sketch = (p5: p5) => {

        let land: Terrain;
        let theta: number = 0;

        p5.setup = () => {
            p5.createCanvas(640, 360, p5.WEBGL);
            land = new Terrain(20, 800, 400);
        };

        p5.draw = () => {
            land.calculate();
            p5.background(255);
            p5.push();
            p5.translate(0, 20, -200);
            p5.rotateX(p5.PI / 3);
            p5.rotateZ(theta);
            land.render();
            p5.pop();
            theta += 0.0025;
        }

        function make2DArray(cols: number, rows: number): number[][] {
            const arr = new Array(cols);
            for (let i = 0; i < arr.length; i++) {
                arr[i] = new Array(rows);
            }
            return arr;
        }

        // Define the Terrain class
        class Terrain {
            width: number;
            height: number;
            scale: number;
            cols: number;
            rows: number;
            z: number[][];
            xoff: number;
            zoff: number = 0;

            constructor(scale: number, width: number, height: number) {
                this.scale = scale; // size of each cell
                this.width = width;
                this.height = height;
                // number of rows and columns
                this.cols = Math.floor(width / scale);
                this.rows = Math.floor(height / scale);
                // using an array to store the height values
                this.z = make2DArray(this.cols, this.rows);
                this.xoff = 0;
            }

            // Calculate height values (based off a neural network)
            calculate() {
                let xoff = 0;
                for (let i = 0; i < this.cols; i++) {
                    let yoff = 0;
                    for (let j = 0; j < this.rows; j++) {
                        this.z[i][j] = p5.map(p5.noise(xoff, yoff, this.zoff), 0, 1, -120, 120);
                        yoff += 0.1;
                    }
                    xoff += 0.1;
                }
                this.zoff += 0.01;
            }

            // Render landscape as grid of quads
            render() {
                // Every cell is an individual quad
                for (let x = 0; x < this.z.length - 1; x++) {
                    p5.beginShape(p5.QUAD_STRIP);
                    for (let y = 0; y < this.z[x].length; y++) {
                        // one quad at a time
                        // each quad's color is determined by the height value at each vertex
                        // (clean this part up)
                        p5.stroke(0);
                        const currentElevation = this.z[x][y];
                        const currentShade = p5.map(currentElevation, -120, 120, 0, 255);
                        p5.fill(currentShade, 255);
                        const xCoordinate = x * this.scale - this.width / 2;
                        const yCoordinate = y * this.scale - this.height / 2;
                        p5.vertex(xCoordinate, yCoordinate, this.z[x][y]);
                        p5.vertex(xCoordinate + this.scale, yCoordinate, this.z[x + 1][y]);
                    }
                    p5.endShape();
                }
            }
        }
    };
    return (
        <SketchLayout
            title="Exercise 0.10: Noise elevation"
            description="Different visual effects using noiseDetail animated"
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}


