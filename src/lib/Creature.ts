import p5 from 'p5';
import { Vector } from './Vector';

/**
 * Creature personality traits that affect behavior
 */
export interface CreatureTraits {
  // Movement characteristics
  calmness: number;      // 0-1: low = jittery, high = smooth
  speed: number;         // base movement speed
  burstChance: number;   // 0-1: probability of sudden movement
  burstMultiplier: number; // how much faster bursts are

  // Behavioral tendencies
  centerAttraction: number; // 0-1: tendency to stay near center
  wanderlust: number;       // 0-1: desire to explore edges

  // Visual
  size: number;
  color: [number, number, number];
}

/**
 * Default traits for a calm pond skimmer
 */
export const defaultTraits: CreatureTraits = {
  calmness: 0.7,
  speed: 2,
  burstChance: 0.02,
  burstMultiplier: 4,
  centerAttraction: 0.3,
  wanderlust: 0.1,
  size: 20,
  color: [80, 120, 200],
};

/**
 * A creature that combines multiple movement behaviors
 * to express personality through motion.
 */
export class Creature {
  position: Vector;
  velocity: Vector;
  traits: CreatureTraits;

  // Perlin noise offsets for smooth movement
  private noiseOffsetX: number;
  private noiseOffsetY: number;
  private noiseIncrement: number;

  // Reference to p5 instance
  private p: p5 | null = null;

  // Canvas bounds
  private width: number = 640;
  private height: number = 360;

  constructor(traits: Partial<CreatureTraits> = {}) {
    this.traits = { ...defaultTraits, ...traits };
    this.position = Vector.create(0, 0);
    this.velocity = Vector.create(0, 0);

    // Random starting points in noise space
    this.noiseOffsetX = Math.random() * 1000;
    this.noiseOffsetY = Math.random() * 1000;

    // Calmness affects how quickly we move through noise space
    // Lower calmness = faster noise traversal = more erratic
    this.noiseIncrement = 0.005 + (1 - this.traits.calmness) * 0.02;
  }

  /**
   * Initialize creature with p5 instance
   */
  init(p: p5): void {
    this.p = p;
    this.width = p.width;
    this.height = p.height;

    // Start at random position
    this.position = Vector.create(
      p.random(this.traits.size, this.width - this.traits.size),
      p.random(this.traits.size, this.height - this.traits.size)
    );
  }

  /**
   * Update creature position based on personality
   */
  update(): void {
    if (!this.p) return;

    const p = this.p;

    // Base movement from Perlin noise (smooth, organic)
    const noiseX = p.noise(this.noiseOffsetX);
    const noiseY = p.noise(this.noiseOffsetY);

    // Map noise to velocity (-1 to 1 range)
    let vx = p.map(noiseX, 0, 1, -1, 1);
    let vy = p.map(noiseY, 0, 1, -1, 1);

    // Apply center attraction - gentle pull toward pond center
    const center = Vector.create(this.width / 2, this.height / 2);
    const toCenter = center.sub(this.position);
    const distFromCenter = toCenter.mag();
    const maxDist = Math.min(this.width, this.height) / 2;

    if (distFromCenter > maxDist * 0.5) {
      // The further from center, the stronger the pull
      const pullStrength = this.traits.centerAttraction *
        p.map(distFromCenter, maxDist * 0.5, maxDist, 0, 0.5);
      const pull = toCenter.normalize().mult(pullStrength);
      vx += pull.x;
      vy += pull.y;
    }

    // Random burst behavior (sudden quick movements)
    let speedMultiplier = 1;
    if (p.random() < this.traits.burstChance) {
      speedMultiplier = this.traits.burstMultiplier;
      // Bursts can go any direction
      vx = p.random(-1, 1);
      vy = p.random(-1, 1);
    }

    // Apply speed
    this.velocity = Vector.create(vx, vy)
      .normalize()
      .mult(this.traits.speed * speedMultiplier);

    // Update position
    this.position = this.position.add(this.velocity);

    // Keep within bounds (soft bounce)
    this.constrainToBounds();

    // Advance through noise space
    this.noiseOffsetX += this.noiseIncrement;
    this.noiseOffsetY += this.noiseIncrement;
  }

  /**
   * Soft boundary constraint - slow down and turn when near edges
   */
  private constrainToBounds(): void {
    const margin = this.traits.size;
    const damping = 0.8;

    if (this.position.x < margin) {
      this.position = Vector.create(margin, this.position.y);
      this.velocity = Vector.create(-this.velocity.x * damping, this.velocity.y);
    }
    if (this.position.x > this.width - margin) {
      this.position = Vector.create(this.width - margin, this.position.y);
      this.velocity = Vector.create(-this.velocity.x * damping, this.velocity.y);
    }
    if (this.position.y < margin) {
      this.position = Vector.create(this.position.x, margin);
      this.velocity = Vector.create(this.velocity.x, -this.velocity.y * damping);
    }
    if (this.position.y > this.height - margin) {
      this.position = Vector.create(this.position.x, this.height - margin);
      this.velocity = Vector.create(this.velocity.x, -this.velocity.y * damping);
    }
  }

  /**
   * Draw the creature
   * Override this method for custom visuals
   */
  display(p: p5): void {
    const [r, g, b] = this.traits.color;

    p.push();
    p.translate(this.position.x, this.position.y);

    // Rotate to face movement direction
    if (this.velocity.mag() > 0.1) {
      p.rotate(Math.atan2(this.velocity.y, this.velocity.x));
    }

    // Simple body - ellipse stretched in movement direction
    p.fill(r, g, b, 200);
    p.stroke(r * 0.7, g * 0.7, b * 0.7);
    p.strokeWeight(1);
    p.ellipse(0, 0, this.traits.size, this.traits.size * 0.6);

    // Small head
    p.fill(r * 0.8, g * 0.8, b * 0.8);
    p.ellipse(this.traits.size * 0.35, 0, this.traits.size * 0.3, this.traits.size * 0.3);

    p.pop();
  }

  // Setters for real-time parameter updates
  setCalmness(value: number): void {
    this.traits.calmness = value;
    this.noiseIncrement = 0.005 + (1 - value) * 0.02;
  }

  setSpeed(value: number): void {
    this.traits.speed = value;
  }

  setBurstChance(value: number): void {
    this.traits.burstChance = value;
  }

  setCenterAttraction(value: number): void {
    this.traits.centerAttraction = value;
  }

  setSize(value: number): void {
    this.traits.size = value;
  }
}
