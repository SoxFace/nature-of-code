/**
 * Walker classes for random walk simulations.
 *
 * A Walker is the simplest form of motion simulation:
 * - It has a position
 * - It takes steps (changes position)
 * - It displays itself
 *
 * Different step() strategies produce different behaviors,
 * which is the core exploration of Chapter 0.
 */

import type p5 from 'p5';
import type { IWalker } from './types';
import { Vector } from './Vector';

/**
 * Configuration options for Walker.
 * Using an options object makes the API flexible and self-documenting.
 */
export interface WalkerOptions {
  /** Starting x position (default: center) */
  x?: number;
  /** Starting y position (default: center) */
  y?: number;
  /** Step size in pixels (default: 1) */
  stepSize?: number;
  /** Color as [r, g, b] or [r, g, b, a] (default: black) */
  color?: number[];
  /** Size of the walker point/circle (default: 1) */
  size?: number;
  /** Whether to constrain to canvas bounds (default: true) */
  constrain?: boolean;
}

/**
 * Base Walker class with random walk behavior.
 *
 * This is the classic random walk: equal probability
 * of stepping in any of 4 directions (up, down, left, right).
 */
export class Walker implements IWalker {
  position: Vector;
  protected stepSize: number;
  protected color: number[];
  protected size: number;
  protected constrain: boolean;
  protected canvasWidth: number = 640;
  protected canvasHeight: number = 360;

  constructor(options: WalkerOptions = {}) {
    this.position = new Vector(options.x ?? 0, options.y ?? 0);
    this.stepSize = options.stepSize ?? 1;
    this.color = options.color ?? [0];
    this.size = options.size ?? 1;
    this.constrain = options.constrain ?? true;
  }

  /** Initialize with canvas dimensions (call in setup) */
  init(p: p5): void {
    this.canvasWidth = p.width;
    this.canvasHeight = p.height;
    // Default to center if position wasn't specified
    if (this.position.x === 0 && this.position.y === 0) {
      this.position.set(p.width / 2, p.height / 2);
    }
  }

  /**
   * Take one step. Override this method for different behaviors.
   *
   * Default: Random walk with equal probability in 4 directions.
   */
  step(): void {
    const choice = Math.floor(Math.random() * 4);
    switch (choice) {
      case 0:
        this.position.x += this.stepSize;
        break;
      case 1:
        this.position.x -= this.stepSize;
        break;
      case 2:
        this.position.y += this.stepSize;
        break;
      case 3:
        this.position.y -= this.stepSize;
        break;
    }
    this.constrainToBounds();
  }

  /** Keep walker within canvas bounds */
  protected constrainToBounds(): void {
    if (this.constrain) {
      this.position.x = Math.max(0, Math.min(this.canvasWidth, this.position.x));
      this.position.y = Math.max(0, Math.min(this.canvasHeight, this.position.y));
    }
  }

  /** Display the walker. Override for custom rendering. */
  display(p: p5): void {
    // Handle color array (grayscale, RGB, or RGBA)
    if (this.color.length === 1) {
      p.stroke(this.color[0]);
    } else if (this.color.length === 3) {
      p.stroke(this.color[0], this.color[1], this.color[2]);
    } else if (this.color.length === 4) {
      p.stroke(this.color[0], this.color[1], this.color[2], this.color[3]);
    }
    p.strokeWeight(this.size);
    p.point(this.position.x, this.position.y);
  }

  /** Update step size (for interactive control) */
  setStepSize(value: number): void {
    this.stepSize = value;
  }
}

/**
 * A walker that tends to move in a biased direction.
 *
 * Exercise 0.1: Walker that tends to move down and to the right.
 * Demonstrates weighted probability.
 */
export class BiasedWalker extends Walker {
  /** Probability of moving in the biased direction (0-1) */
  private bias: number;
  /** Direction bias as a vector */
  private biasDirection: Vector;

  constructor(
    options: WalkerOptions & {
      bias?: number;
      biasDirection?: { x: number; y: number };
    } = {}
  ) {
    super(options);
    this.bias = options.bias ?? 0.6; // 60% chance to move in bias direction
    this.biasDirection = new Vector(
      options.biasDirection?.x ?? 1, // Default: right
      options.biasDirection?.y ?? 1 // Default: down
    );
  }

  step(): void {
    if (Math.random() < this.bias) {
      // Move in biased direction
      if (Math.random() < 0.5) {
        this.position.x += this.biasDirection.x * this.stepSize;
      } else {
        this.position.y += this.biasDirection.y * this.stepSize;
      }
    } else {
      // Random movement
      super.step();
    }
    this.constrainToBounds();
  }

  /** Update bias probability (for interactive control) */
  setBias(value: number): void {
    this.bias = value;
  }

  /** Update bias direction (for interactive control) */
  setBiasDirection(x: number, y: number): void {
    this.biasDirection.set(x, y);
  }
}

/**
 * A walker using Gaussian (normal) distribution for step size.
 *
 * Most steps are small, occasional steps are large.
 * Creates more natural-looking movement than uniform random.
 *
 * Uses Box-Muller transform for Gaussian random numbers.
 */
export class GaussianWalker extends Walker {
  private mean: number;
  private stdDev: number;

  constructor(
    options: WalkerOptions & {
      mean?: number;
      stdDev?: number;
    } = {}
  ) {
    super(options);
    this.mean = options.mean ?? 0;
    this.stdDev = options.stdDev ?? 2;
  }

  /** Box-Muller transform for Gaussian random numbers */
  private gaussianRandom(): number {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * this.stdDev + this.mean;
  }

  step(): void {
    this.position.x += this.gaussianRandom();
    this.position.y += this.gaussianRandom();
    this.constrainToBounds();
  }

  /** Update standard deviation (for interactive control) */
  setStdDev(value: number): void {
    this.stdDev = value;
  }
}

/**
 * A walker using Perlin noise for smooth, organic movement.
 *
 * Perlin noise produces values that change smoothly over time,
 * creating natural-looking motion unlike pure randomness.
 *
 * Key concept: We use separate time offsets for x and y
 * so they don't move in perfect diagonal.
 */
export class PerlinWalker extends Walker {
  private timeX: number;
  private timeY: number;
  private timeIncrement: number;
  private p5Instance: p5 | null = null;

  // For drawing lines between positions
  private previousPosition: Vector;
  private drawLines: boolean;

  constructor(
    options: WalkerOptions & {
      timeIncrement?: number;
      drawLines?: boolean;
    } = {}
  ) {
    super(options);
    this.timeX = 0;
    this.timeY = 10000; // Offset so x and y are uncorrelated
    this.timeIncrement = options.timeIncrement ?? 0.01;
    this.drawLines = options.drawLines ?? true;
    this.previousPosition = this.position.copy();
  }

  init(p: p5): void {
    super.init(p);
    this.p5Instance = p;
    this.previousPosition = this.position.copy();
  }

  step(): void {
    if (!this.p5Instance) return;

    this.previousPosition = this.position.copy();

    // Map noise (0-1) to step direction (-1 to 1)
    const stepX = this.p5Instance.map(
      this.p5Instance.noise(this.timeX),
      0,
      1,
      -this.stepSize,
      this.stepSize
    );
    const stepY = this.p5Instance.map(
      this.p5Instance.noise(this.timeY),
      0,
      1,
      -this.stepSize,
      this.stepSize
    );

    this.position.x += stepX;
    this.position.y += stepY;

    this.timeX += this.timeIncrement;
    this.timeY += this.timeIncrement;

    this.constrainToBounds();
  }

  display(p: p5): void {
    // Handle color array (grayscale, RGB, or RGBA)
    if (this.color.length === 1) {
      p.stroke(this.color[0]);
    } else if (this.color.length === 3) {
      p.stroke(this.color[0], this.color[1], this.color[2]);
    } else if (this.color.length === 4) {
      p.stroke(this.color[0], this.color[1], this.color[2], this.color[3]);
    }
    p.strokeWeight(this.size);

    if (this.drawLines) {
      p.line(
        this.previousPosition.x,
        this.previousPosition.y,
        this.position.x,
        this.position.y
      );
    } else {
      p.point(this.position.x, this.position.y);
    }
  }

  /** Update time increment (for interactive control) */
  setTimeIncrement(value: number): void {
    this.timeIncrement = value;
  }
}

/**
 * A walker that tends to move toward the mouse position.
 *
 * Demonstrates combining randomness with intentional behavior.
 * Higher mouseInfluence = more likely to move toward mouse.
 */
export class MouseSeekingWalker extends Walker {
  private mouseInfluence: number;
  private p5Instance: p5 | null = null;

  constructor(
    options: WalkerOptions & {
      mouseInfluence?: number;
    } = {}
  ) {
    super(options);
    this.mouseInfluence = options.mouseInfluence ?? 0.5;
  }

  init(p: p5): void {
    super.init(p);
    this.p5Instance = p;
  }

  step(): void {
    if (!this.p5Instance) {
      super.step();
      return;
    }

    const p = this.p5Instance;

    if (Math.random() < this.mouseInfluence) {
      // Move toward mouse
      if (p.mouseX > this.position.x) this.position.x += this.stepSize;
      else if (p.mouseX < this.position.x) this.position.x -= this.stepSize;

      if (p.mouseY > this.position.y) this.position.y += this.stepSize;
      else if (p.mouseY < this.position.y) this.position.y -= this.stepSize;
    } else {
      // Random step
      super.step();
    }

    this.constrainToBounds();
  }

  /** Update mouse influence (for interactive control) */
  setMouseInfluence(value: number): void {
    this.mouseInfluence = value;
  }
}

/**
 * A walker using the accept-reject (Monte Carlo) algorithm.
 *
 * The accept-reject algorithm creates custom probability distributions:
 * 1. Pick a random step size
 * 2. Pick a random "qualifying" value (0-1)
 * 3. If qualifying < probability(stepSize), accept; otherwise reject
 *
 * By default, uses a linear probability function where smaller steps
 * are more likely to be accepted than larger ones.
 */
export class AcceptRejectWalker extends Walker {
  private maxStep: number;

  constructor(
    options: WalkerOptions & {
      maxStep?: number;
    } = {}
  ) {
    super(options);
    this.maxStep = options.maxStep ?? 10;
  }

  /**
   * Probability function for accept-reject.
   * Returns probability (0-1) that a step of given size should be accepted.
   *
   * Default: Linear - smaller steps more likely (1 - stepSize/maxStep)
   * Override this for different distributions.
   */
  protected probability(stepSize: number): number {
    // Linear: smaller steps are more likely
    // stepSize=0 -> probability=1
    // stepSize=maxStep -> probability=0
    return 1 - stepSize / this.maxStep;
  }

  /**
   * Generate a step size using accept-reject algorithm.
   * Keeps trying until a value is accepted.
   */
  private acceptRejectStep(): number {
    while (true) {
      // Pick a random step size
      const stepSize = Math.random() * this.maxStep;

      // Pick a qualifying random value
      const qualifier = Math.random();

      // Accept if qualifier is less than probability
      if (qualifier < this.probability(stepSize)) {
        return stepSize;
      }
      // Otherwise reject and try again
    }
  }

  step(): void {
    // Get step magnitude using accept-reject
    const stepMagnitude = this.acceptRejectStep();

    // Random direction
    const angle = Math.random() * Math.PI * 2;
    this.position.x += Math.cos(angle) * stepMagnitude;
    this.position.y += Math.sin(angle) * stepMagnitude;

    this.constrainToBounds();
  }

  /** Update maximum step size (for interactive control) */
  setMaxStep(value: number): void {
    this.maxStep = value;
  }
}
