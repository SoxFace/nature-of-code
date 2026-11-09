import p5 from 'p5';
import { Creature, type CreatureConfig } from '../Creature';

/**
 * Pond Skimmer (Water Strider)
 *
 * Graceful, smooth movement across the water surface.
 * Very calm with rare, gentle bursts.
 */
export const skimmerDefaults: Partial<CreatureConfig> = {
  speed: 1.5,
  maxSpeed: 3,
  burstChance: 0.005,
  burstMultiplier: 2,
  calmness: 0.92,
  socialDistance: 50,
  fleeStrength: 0.3,
  size: 20,
  color: [80, 120, 200],
};

export class Skimmer extends Creature {
  constructor(config: Partial<CreatureConfig> = {}) {
    super({ ...skimmerDefaults, ...config });
  }

  display(p: p5): void {
    const [r, g, b] = this.config.color;
    const s = this.config.size;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.getHeading());

    // Body
    p.fill(r, g, b, 200);
    p.stroke(r * 0.7, g * 0.7, b * 0.7);
    p.strokeWeight(1);
    p.ellipse(0, 0, s, s * 0.6);

    // Head
    p.fill(r * 0.8, g * 0.8, b * 0.8);
    p.ellipse(s * 0.35, 0, s * 0.3, s * 0.3);

    // Legs (water strider style)
    p.stroke(r * 0.5, g * 0.5, b * 0.5);
    p.strokeWeight(1);
    p.line(-s * 0.2, 0, -s * 0.6, -s * 0.5);
    p.line(-s * 0.2, 0, -s * 0.6, s * 0.5);
    p.line(0, 0, -s * 0.3, -s * 0.6);
    p.line(0, 0, -s * 0.3, s * 0.6);

    p.pop();
  }
}
