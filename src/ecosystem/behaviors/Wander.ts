import p5 from 'p5';
import { Vector } from '@/lib';

/**
 * Wander Behavior (Chapter 0: Randomness)
 *
 * Uses Perlin noise for smooth, organic movement.
 * The calmness parameter controls how quickly we traverse noise space.
 */
export interface WanderConfig {
  calmness: number;  // 0-1: higher = smoother movement
}

export class WanderBehavior {
  private noiseOffsetX: number;
  private noiseOffsetY: number;
  private noiseIncrement: number;

  constructor(private config: WanderConfig) {
    this.noiseOffsetX = Math.random() * 1000;
    this.noiseOffsetY = Math.random() * 1000;
    // Initialize before calling updateNoiseIncrement
    this.noiseIncrement = 0.002 + (1 - this.config.calmness) * 0.02;
  }

  private updateNoiseIncrement(): void {
    // Lower calmness = faster noise traversal = more erratic
    this.noiseIncrement = 0.002 + (1 - this.config.calmness) * 0.02;
  }

  setCalmness(value: number): void {
    this.config.calmness = value;
    this.updateNoiseIncrement();
  }

  /**
   * Calculate wander force based on Perlin noise
   */
  calculate(p: p5): Vector {
    const noiseX = p.noise(this.noiseOffsetX);
    const noiseY = p.noise(this.noiseOffsetY);

    // Map noise to direction (-1 to 1 range)
    const x = p.map(noiseX, 0, 1, -1, 1);
    const y = p.map(noiseY, 0, 1, -1, 1);

    // Advance through noise space
    this.noiseOffsetX += this.noiseIncrement;
    this.noiseOffsetY += this.noiseIncrement;

    return Vector.create(x, y);
  }
}
