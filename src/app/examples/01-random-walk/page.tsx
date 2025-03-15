"use client";

import P5Wrapper from '@/components/P5Wrapper';
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function TraditionalRandomWalkPage() {
  // Define the sketch function
  const sketch = (p: p5) => {
    let walker: Walker;
    
    class Walker {
      x: number;
      y: number;
      
      constructor() {
        this.x = p.width / 2;
        this.y = p.height / 2;
      }
      
      display() {
        p.stroke(0);
        p.point(this.x, this.y);
      }
      
      step() {
        const choice = p.floor(p.random(4));
        
        if (choice === 0) {
          this.x++;
        } else if (choice === 1) {
          this.x--;
        } else if (choice === 2) {
          this.y++;
        } else {
          this.y--;
        }
      }
    }
    
    p.setup = () => {
      p.createCanvas(640, 360);
      p.background(255);
      walker = new Walker();
    };
    
    p.draw = () => {
      walker.step();
      walker.display();
    };
  };
  
  return (
    <SketchLayout
      title="Traditional Random Walk"
      description="A simple random walk simulation where each step moves in one of four directions with equal probability."
    >
      <P5Wrapper sketch={sketch} />
    </SketchLayout>
  );
}