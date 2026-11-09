import p5 from 'p5';
import { Creature, type CreatureConfig } from '../Creature';

/**
 * Leaf
 *
 * Drifting, peaceful movement. Doesn't react to others.
 * Just floats on the water surface.
 */
export const leafDefaults: Partial<CreatureConfig> = {
  speed: 0.8,
  maxSpeed: 1.5,
  burstChance: 0,
  burstMultiplier: 1,
  calmness: 0.95,
  socialDistance: 0,  // Doesn't care about others
  fleeStrength: 0,
  size: 25,
  color: [120, 160, 60],
};

export class Leaf extends Creature {
  private isAutumn: boolean;

  constructor(config: Partial<CreatureConfig> = {}, isAutumn: boolean = false) {
    super({ ...leafDefaults, ...config });
    this.isAutumn = isAutumn;

    // Autumn leaves have different colors
    if (isAutumn && !config.color) {
      this.config.color = [
        180 + Math.random() * 40,
        100 + Math.random() * 40,
        40,
      ] as [number, number, number];
    }
  }

  display(p: p5): void {
    const [r, g, b] = this.config.color;
    const s = this.config.size;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.getHeading());

    // Leaf shape
    p.fill(r, g, b, 180);
    p.stroke(r * 0.6, g * 0.6, b * 0.6);
    p.strokeWeight(1);

    p.beginShape();
    p.vertex(s * 0.5, 0);
    p.bezierVertex(s * 0.3, -s * 0.3, -s * 0.3, -s * 0.25, -s * 0.5, 0);
    p.bezierVertex(-s * 0.3, s * 0.25, s * 0.3, s * 0.3, s * 0.5, 0);
    p.endShape();

    // Center vein
    p.stroke(r * 0.5, g * 0.5, b * 0.5);
    p.strokeWeight(1);
    p.line(-s * 0.4, 0, s * 0.4, 0);

    // Side veins
    p.strokeWeight(0.5);
    p.line(-s * 0.1, 0, -s * 0.25, -s * 0.12);
    p.line(-s * 0.1, 0, -s * 0.25, s * 0.12);
    p.line(s * 0.1, 0, s * 0.25, -s * 0.1);
    p.line(s * 0.1, 0, s * 0.25, s * 0.1);

    p.pop();
  }
}
