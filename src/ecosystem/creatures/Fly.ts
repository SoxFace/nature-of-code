import p5 from 'p5';
import { Creature, type CreatureConfig } from '../Creature';

/**
 * Fly
 *
 * Erratic, jittery movement with frequent direction changes.
 * Small, fast, and nervous.
 */
export const flyDefaults: Partial<CreatureConfig> = {
  speed: 3.5,
  maxSpeed: 6,
  burstChance: 0.08,
  burstMultiplier: 3,
  calmness: 0.2,
  socialDistance: 30,
  fleeStrength: 2,
  size: 8,
  color: [60, 60, 60],
};

export class Fly extends Creature {
  constructor(config: Partial<CreatureConfig> = {}) {
    super({ ...flyDefaults, ...config });
  }

  display(p: p5): void {
    const [r, g, b] = this.config.color;
    const s = this.config.size;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.getHeading());

    // Wings (flutter based on time)
    const flutter = Math.sin(p.frameCount * 0.5) * 0.3;
    p.fill(200, 200, 200, 100);
    p.noStroke();
    p.ellipse(-s * 0.1, -s * 0.4 - flutter * s, s * 0.6, s * 0.3);
    p.ellipse(-s * 0.1, s * 0.4 + flutter * s, s * 0.6, s * 0.3);

    // Body
    p.fill(r, g, b);
    p.stroke(0);
    p.strokeWeight(0.5);
    p.ellipse(0, 0, s, s * 0.5);

    // Head
    p.fill(r * 0.8, g * 0.8, b * 0.8);
    p.ellipse(s * 0.4, 0, s * 0.4, s * 0.4);

    // Eyes
    p.fill(255, 0, 0, 150);
    p.noStroke();
    p.ellipse(s * 0.5, -s * 0.1, s * 0.15, s * 0.15);
    p.ellipse(s * 0.5, s * 0.1, s * 0.15, s * 0.15);

    p.pop();
  }
}
