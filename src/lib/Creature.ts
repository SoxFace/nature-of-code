import p5 from 'p5';
import { Vector } from './Vector';

/**
 * Creature personality traits that affect behavior
 */
export interface CreatureTraits {
  // Identity
  type: 'skimmer' | 'fly' | 'leaf' | 'fish';

  // Movement characteristics
  calmness: number;      // 0-1: low = jittery, high = smooth
  speed: number;         // base movement speed
  burstChance: number;   // 0-1: probability of sudden movement
  burstMultiplier: number; // how much faster bursts are

  // Behavioral tendencies
  centerAttraction: number; // 0-1: tendency to stay near center
  wanderlust: number;       // 0-1: desire to explore edges
  socialDistance: number;   // preferred distance from others
  fleeSpeed: number;        // how fast to flee when too close

  // Visual
  size: number;
  color: [number, number, number];
}

/**
 * Default traits for a calm pond skimmer
 */
export const defaultTraits: CreatureTraits = {
  type: 'skimmer',
  calmness: 0.7,
  speed: 2,
  burstChance: 0.02,
  burstMultiplier: 4,
  centerAttraction: 0.3,
  wanderlust: 0.1,
  socialDistance: 50,
  fleeSpeed: 0.5,
  size: 20,
  color: [80, 120, 200],
};

/**
 * Preset creature types with distinct personalities
 */
export const creaturePresets: Record<string, Partial<CreatureTraits>> = {
  // Pond skimmer - very smooth gliding, graceful
  skimmer: {
    type: 'skimmer',
    calmness: 0.92,
    speed: 1.5,
    burstChance: 0.005,
    burstMultiplier: 2,
    centerAttraction: 0.2,
    socialDistance: 50,
    fleeSpeed: 0.3,
    size: 20,
    color: [80, 120, 200],
  },

  // Fly - erratic, jittery, fast
  fly: {
    type: 'fly',
    calmness: 0.2,
    speed: 3.5,
    burstChance: 0.08,
    burstMultiplier: 3,
    centerAttraction: 0.1,
    socialDistance: 30,
    fleeSpeed: 2,
    size: 8,
    color: [60, 60, 60],
  },

  // Leaf - drifting, slow, peaceful
  leaf: {
    type: 'leaf',
    calmness: 0.95,
    speed: 0.8,
    burstChance: 0,
    burstMultiplier: 1,
    centerAttraction: 0.05,
    socialDistance: 0, // doesn't care about others
    fleeSpeed: 0,
    size: 25,
    color: [120, 160, 60],
  },

  // Fish - smooth swimming with rare quick turns
  fish: {
    type: 'fish',
    calmness: 0.88,
    speed: 1.8,
    burstChance: 0.008,
    burstMultiplier: 2.5,
    centerAttraction: 0.25,
    socialDistance: 40,
    fleeSpeed: 0.4,
    size: 18,
    color: [220, 140, 60],
  },
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
   * @param others - Other creatures for social behavior
   */
  update(others: Creature[] = []): void {
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

    // Social behavior - avoid others if too close
    if (this.traits.socialDistance > 0 && this.traits.fleeSpeed > 0) {
      for (const other of others) {
        if (other === this) continue;

        const toOther = other.position.sub(this.position);
        const dist = toOther.mag();

        if (dist < this.traits.socialDistance && dist > 0) {
          // Flee away from the other creature
          const fleeStrength = p.map(
            dist,
            0,
            this.traits.socialDistance,
            this.traits.fleeSpeed,
            0
          );
          const flee = toOther.normalize().mult(-fleeStrength);
          vx += flee.x;
          vy += flee.y;
        }
      }
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
   * Draw the creature based on its type
   */
  display(p: p5): void {
    const [r, g, b] = this.traits.color;

    p.push();
    p.translate(this.position.x, this.position.y);

    // Rotate to face movement direction
    const angle = this.velocity.mag() > 0.1
      ? Math.atan2(this.velocity.y, this.velocity.x)
      : 0;
    p.rotate(angle);

    switch (this.traits.type) {
      case 'fly':
        this.drawFly(p, r, g, b);
        break;
      case 'leaf':
        this.drawLeaf(p, r, g, b);
        break;
      case 'fish':
        this.drawFish(p, r, g, b);
        break;
      default:
        this.drawSkimmer(p, r, g, b);
    }

    p.pop();
  }

  private drawSkimmer(p: p5, r: number, g: number, b: number): void {
    const s = this.traits.size;

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
  }

  private drawFly(p: p5, r: number, g: number, b: number): void {
    const s = this.traits.size;

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
    p.ellipse(s * 0.5, -s * 0.1, s * 0.15, s * 0.15);
    p.ellipse(s * 0.5, s * 0.1, s * 0.15, s * 0.15);
  }

  private drawLeaf(p: p5, r: number, g: number, b: number): void {
    const s = this.traits.size;

    // Leaf shape
    p.fill(r, g, b, 180);
    p.stroke(r * 0.6, g * 0.6, b * 0.6);
    p.strokeWeight(1);

    p.beginShape();
    p.vertex(s * 0.5, 0);
    p.bezierVertex(s * 0.3, -s * 0.3, -s * 0.3, -s * 0.25, -s * 0.5, 0);
    p.bezierVertex(-s * 0.3, s * 0.25, s * 0.3, s * 0.3, s * 0.5, 0);
    p.endShape();

    // Vein
    p.stroke(r * 0.5, g * 0.5, b * 0.5);
    p.strokeWeight(1);
    p.line(-s * 0.4, 0, s * 0.4, 0);
  }

  private drawFish(p: p5, r: number, g: number, b: number): void {
    const s = this.traits.size;

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
