import p5 from 'p5';
import { Vector } from '@/lib';
import type { Creature } from './Creature';

/**
 * Pond Environment
 *
 * The world in which creatures live. Handles:
 * - Boundaries and constraints
 * - Environmental rendering (water, ripples)
 * - Future: zones, food sources, currents
 */
export interface PondConfig {
  width: number;
  height: number;
  margin: number;
  backgroundColor: [number, number, number];
  borderColor: [number, number, number];
  showRipples: boolean;
}

const defaultPondConfig: PondConfig = {
  width: 640,
  height: 360,
  margin: 20,
  backgroundColor: [240, 248, 255],
  borderColor: [180, 200, 220],
  showRipples: true,
};

export class Pond {
  config: PondConfig;
  private p: p5 | null = null;

  constructor(config: Partial<PondConfig> = {}) {
    this.config = { ...defaultPondConfig, ...config };
  }

  init(p: p5): void {
    this.p = p;
    this.config.width = p.width;
    this.config.height = p.height;
  }

  get center(): Vector {
    return Vector.create(this.config.width / 2, this.config.height / 2);
  }

  get bounds() {
    const m = this.config.margin;
    return {
      left: m,
      right: this.config.width - m,
      top: m,
      bottom: this.config.height - m,
    };
  }

  /**
   * Check if a position is within pond bounds
   */
  contains(position: Vector): boolean {
    const b = this.bounds;
    return (
      position.x >= b.left &&
      position.x <= b.right &&
      position.y >= b.top &&
      position.y <= b.bottom
    );
  }

  /**
   * Get force pushing creature back into bounds
   */
  getBoundaryForce(position: Vector, margin: number = 50): Vector {
    if (!this.p) return Vector.create(0, 0);

    const p = this.p;
    const b = this.bounds;
    let force = Vector.create(0, 0);

    // Soft boundary - gradual push back
    if (position.x < b.left + margin) {
      const strength = p.map(position.x, b.left, b.left + margin, 1, 0);
      force = force.add(Vector.create(strength, 0));
    }
    if (position.x > b.right - margin) {
      const strength = p.map(position.x, b.right - margin, b.right, 0, 1);
      force = force.add(Vector.create(-strength, 0));
    }
    if (position.y < b.top + margin) {
      const strength = p.map(position.y, b.top, b.top + margin, 1, 0);
      force = force.add(Vector.create(0, strength));
    }
    if (position.y > b.bottom - margin) {
      const strength = p.map(position.y, b.bottom - margin, b.bottom, 0, 1);
      force = force.add(Vector.create(0, -strength));
    }

    return force;
  }

  /**
   * Constrain position to stay within bounds (hard limit)
   */
  constrain(position: Vector, size: number = 0): Vector {
    const b = this.bounds;
    const halfSize = size / 2;

    return Vector.create(
      Math.max(b.left + halfSize, Math.min(b.right - halfSize, position.x)),
      Math.max(b.top + halfSize, Math.min(b.bottom - halfSize, position.y))
    );
  }

  /**
   * Draw the pond background
   */
  drawBackground(p: p5): void {
    const [r, g, b] = this.config.backgroundColor;
    p.background(r, g, b);
  }

  /**
   * Draw the pond border and effects
   */
  drawForeground(p: p5): void {
    const [r, g, b] = this.config.borderColor;

    // Pond edge
    p.noFill();
    p.stroke(r, g, b);
    p.strokeWeight(3);
    p.ellipse(
      this.config.width / 2,
      this.config.height / 2,
      this.config.width - 20,
      this.config.height - 20
    );

    // Subtle water ripples
    if (this.config.showRipples) {
      p.stroke(r + 20, g + 20, b + 20, 50);
      p.strokeWeight(1);
      for (let i = 0; i < 3; i++) {
        const rippleSize = 100 + i * 80 + Math.sin(p.frameCount * 0.02 + i) * 20;
        p.ellipse(
          this.config.width / 2,
          this.config.height / 2,
          rippleSize,
          rippleSize * 0.6
        );
      }
    }
  }

  /**
   * Apply trail fade effect
   */
  applyTrailFade(p: p5, opacity: number): void {
    const [r, g, b] = this.config.backgroundColor;
    p.fill(r, g, b, opacity);
    p.noStroke();
    p.rect(0, 0, this.config.width, this.config.height);
  }
}
