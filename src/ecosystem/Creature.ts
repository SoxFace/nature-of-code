import p5 from 'p5';
import { Vector } from '@/lib';
import { WanderBehavior, FleeBehavior, type Positioned } from './behaviors';
import type { Pond } from './Pond';

/**
 * Creature Configuration
 */
export interface CreatureConfig {
  // Movement
  speed: number;
  maxSpeed: number;

  // Burst behavior (sudden movements)
  burstChance: number;
  burstMultiplier: number;

  // Behaviors
  calmness: number;          // For wander behavior
  socialDistance: number;    // For flee behavior
  fleeStrength: number;
  boundaryMargin: number;    // How far from edge to start turning

  // Visual
  size: number;
  color: [number, number, number];
}

export const defaultCreatureConfig: CreatureConfig = {
  speed: 1.5,
  maxSpeed: 4,
  burstChance: 0.005,
  burstMultiplier: 2,
  calmness: 0.9,
  socialDistance: 50,
  fleeStrength: 0.3,
  boundaryMargin: 50,
  size: 20,
  color: [100, 100, 100],
};

/**
 * Base Creature Class
 *
 * Extensible creature with composable behaviors.
 * Subclass this to create specific creature types.
 */
export abstract class Creature implements Positioned {
  position: Vector;
  velocity: Vector;
  acceleration: Vector;
  config: CreatureConfig;

  // Behaviors
  protected wanderBehavior: WanderBehavior;
  protected fleeBehavior: FleeBehavior;

  // Reference to environment
  protected pond: Pond | null = null;
  protected p: p5 | null = null;

  constructor(config: Partial<CreatureConfig> = {}) {
    this.config = { ...defaultCreatureConfig, ...config };
    this.position = Vector.create(0, 0);
    this.velocity = Vector.create(0, 0);
    this.acceleration = Vector.create(0, 0);

    // Initialize behaviors
    this.wanderBehavior = new WanderBehavior({
      calmness: this.config.calmness,
    });

    this.fleeBehavior = new FleeBehavior({
      distance: this.config.socialDistance,
      strength: this.config.fleeStrength,
    });
  }

  /**
   * Initialize creature in the pond
   */
  init(p: p5, pond: Pond): void {
    this.p = p;
    this.pond = pond;

    // Random starting position within bounds
    const bounds = pond.bounds;
    this.position = Vector.create(
      p.random(bounds.left + this.config.size, bounds.right - this.config.size),
      p.random(bounds.top + this.config.size, bounds.bottom - this.config.size)
    );

    // Small random initial velocity
    this.velocity = Vector.random().mult(this.config.speed * 0.5);
  }

  /**
   * Apply a force to the creature
   */
  applyForce(force: Vector): void {
    this.acceleration = this.acceleration.add(force);
  }

  /**
   * Update creature state
   */
  update(others: Creature[] = []): void {
    if (!this.p || !this.pond) return;

    const p = this.p;

    // Reset acceleration
    this.acceleration = Vector.create(0, 0);

    // Apply wander behavior
    const wanderForce = this.wanderBehavior.calculate(p);
    this.applyForce(wanderForce);

    // Apply flee behavior (avoid others)
    const fleeForce = this.fleeBehavior.calculate(p, this, others);
    this.applyForce(fleeForce);

    // Apply boundary force (stay in pond)
    const boundaryForce = this.pond.getBoundaryForce(
      this.position,
      this.config.boundaryMargin
    );
    this.applyForce(boundaryForce.mult(0.5));

    // Random burst behavior
    let speedMult = 1;
    if (p.random() < this.config.burstChance) {
      speedMult = this.config.burstMultiplier;
      // Burst in random direction
      this.acceleration = Vector.random();
    }

    // Update velocity
    this.velocity = this.velocity.add(this.acceleration);

    // Limit and apply speed
    const targetSpeed = this.config.speed * speedMult;
    if (this.velocity.mag() > 0) {
      this.velocity = this.velocity.normalize().mult(targetSpeed);
    }

    // Limit max speed
    if (this.velocity.mag() > this.config.maxSpeed) {
      this.velocity = this.velocity.normalize().mult(this.config.maxSpeed);
    }

    // Update position
    this.position = this.position.add(this.velocity);

    // Hard boundary constraint
    this.position = this.pond.constrain(this.position, this.config.size);
  }

  /**
   * Display the creature - override in subclasses
   */
  abstract display(p: p5): void;

  /**
   * Get the angle the creature is facing
   */
  protected getHeading(): number {
    return this.velocity.mag() > 0.1
      ? Math.atan2(this.velocity.y, this.velocity.x)
      : 0;
  }

  // Config setters for Tweakpane
  setCalmness(value: number): void {
    this.config.calmness = value;
    this.wanderBehavior.setCalmness(value);
  }

  setSpeed(value: number): void {
    this.config.speed = value;
  }

  setBurstChance(value: number): void {
    this.config.burstChance = value;
  }

  setSocialDistance(value: number): void {
    this.config.socialDistance = value;
    this.fleeBehavior.setDistance(value);
  }

  setFleeStrength(value: number): void {
    this.config.fleeStrength = value;
    this.fleeBehavior.setStrength(value);
  }

  setSize(value: number): void {
    this.config.size = value;
  }
}
