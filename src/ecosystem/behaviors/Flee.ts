import p5 from 'p5';
import { Vector } from '@/lib';

/**
 * Flee Behavior (Chapter 0: Social distance)
 *
 * Simple avoidance - move away from nearby entities.
 * Will be enhanced in Chapter 5 with proper steering.
 */
export interface FleeConfig {
  distance: number;   // How close before fleeing
  strength: number;   // How strongly to flee
}

export interface Positioned {
  position: Vector;
}

export class FleeBehavior {
  constructor(private config: FleeConfig) {}

  setDistance(value: number): void {
    this.config.distance = value;
  }

  setStrength(value: number): void {
    this.config.strength = value;
  }

  /**
   * Calculate flee force away from nearby entities
   */
  calculate(p: p5, self: Positioned, others: Positioned[]): Vector {
    let fleeForce = Vector.create(0, 0);

    if (this.config.distance <= 0 || this.config.strength <= 0) {
      return fleeForce;
    }

    for (const other of others) {
      if (other === self) continue;

      const toOther = other.position.sub(self.position);
      const dist = toOther.mag();

      if (dist < this.config.distance && dist > 0) {
        // Flee strength increases as distance decreases
        const strength = p.map(
          dist,
          0,
          this.config.distance,
          this.config.strength,
          0
        );
        const flee = toOther.normalize().mult(-strength);
        fleeForce = fleeForce.add(flee);
      }
    }

    return fleeForce;
  }
}
