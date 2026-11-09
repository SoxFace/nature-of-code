import p5 from 'p5';
import { Creature, type CreatureConfig } from '../Creature';

/**
 * Fish
 *
 * Smooth swimming with occasional quick turns.
 * Stays mostly underwater (conceptually).
 */
export const fishDefaults: Partial<CreatureConfig> = {
  speed: 1.8,
  maxSpeed: 4,
  burstChance: 0.008,
  burstMultiplier: 2.5,
  calmness: 0.88,
  socialDistance: 40,
  fleeStrength: 0.4,
  size: 18,
  color: [220, 140, 60],
};

export class Fish extends Creature {
  constructor(config: Partial<CreatureConfig> = {}) {
    super({ ...fishDefaults, ...config });
  }

  display(p: p5): void {
    const [r, g, b] = this.config.color;
    const s = this.config.size;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.getHeading());

    // Tail
    p.fill(r * 0.9, g * 0.9, b * 0.9, 200);
    p.noStroke();
    p.triangle(-s * 0.3, 0, -s * 0.7, -s * 0.3, -s * 0.7, s * 0.3);

    // Body
    p.fill(r, g, b, 220);
    p.stroke(r * 0.6, g * 0.6, b * 0.6);
    p.strokeWeight(1);
    p.ellipse(0, 0, s, s * 0.5);

    // Dorsal fin
    p.fill(r * 0.8, g * 0.8, b * 0.8);
    p.noStroke();
    p.triangle(0, -s * 0.25, -s * 0.2, -s * 0.25, -s * 0.1, -s * 0.45);

    // Eye
    p.fill(255);
    p.stroke(0);
    p.strokeWeight(0.5);
    p.ellipse(s * 0.25, -s * 0.05, s * 0.15, s * 0.15);
    p.fill(0);
    p.noStroke();
    p.ellipse(s * 0.27, -s * 0.05, s * 0.07, s * 0.07);

    // Scales hint
    p.stroke(r * 0.7, g * 0.7, b * 0.7, 100);
    p.strokeWeight(0.5);
    p.noFill();
    for (let i = 0; i < 3; i++) {
      p.arc(-s * 0.1 + i * s * 0.15, 0, s * 0.2, s * 0.3, -p.HALF_PI, p.HALF_PI);
    }

    p.pop();
  }
}
