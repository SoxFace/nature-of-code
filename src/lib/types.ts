/**
 * Core interfaces for Nature of Code concepts.
 *
 * These interfaces define contracts that classes must implement.
 * They enable polymorphism - you can treat different implementations
 * uniformly (e.g., any IWalker can step() and display()).
 */

import type p5 from 'p5';

/**
 * A 2D vector representing position, velocity, acceleration, or force.
 *
 * Vectors are the foundation of motion simulation. They have:
 * - Magnitude (length): how much
 * - Direction: which way
 *
 * Operations like add(), sub(), mult() enable physics calculations.
 */
export interface IVector {
  x: number;
  y: number;

  /** Create a copy of this vector */
  copy(): IVector;

  /** Add another vector to this one (returns new vector) */
  add(v: IVector): IVector;

  /** Subtract another vector from this one (returns new vector) */
  sub(v: IVector): IVector;

  /** Multiply by a scalar (returns new vector) */
  mult(scalar: number): IVector;

  /** Divide by a scalar (returns new vector) */
  div(scalar: number): IVector;

  /** Get the magnitude (length) of this vector */
  mag(): number;

  /** Normalize to unit length (magnitude = 1) */
  normalize(): IVector;

  /** Limit magnitude to a maximum value */
  limit(max: number): IVector;

  /** Set the magnitude to a specific value */
  setMag(magnitude: number): IVector;
}

/**
 * A basic walker that moves around the canvas.
 *
 * Walkers are the simplest form of motion - they have position
 * and can step (move) and display themselves.
 *
 * Chapter 0 explores different step() strategies:
 * - Random walk (pure randomness)
 * - Gaussian distribution (clustered randomness)
 * - Perlin noise (smooth, organic randomness)
 */
export interface IWalker {
  /** Current position */
  position: IVector;

  /** Take one step (update position) */
  step(): void;

  /** Draw the walker on canvas */
  display(p: p5): void;
}

/**
 * A particle with full Newtonian physics.
 *
 * Extends the walker concept with velocity and acceleration.
 * Newton's second law: F = ma, so acceleration = Force / mass
 *
 * The update cycle is:
 * 1. Apply forces -> accumulate acceleration
 * 2. Add acceleration to velocity
 * 3. Add velocity to position
 * 4. Reset acceleration for next frame
 */
export interface IParticle {
  position: IVector;
  velocity: IVector;
  acceleration: IVector;
  mass: number;

  /** Apply a force to this particle (F = ma) */
  applyForce(force: IVector): void;

  /** Update physics (velocity += acceleration, position += velocity) */
  update(): void;

  /** Draw the particle */
  display(p: p5): void;

  /** Check if particle should be removed */
  isDead(): boolean;
}

/**
 * A force that can be applied to particles.
 *
 * Forces are vectors that cause acceleration.
 * Examples: gravity, friction, wind, attraction
 */
export interface IForce {
  /** Calculate the force vector to apply to a particle */
  calculate(particle: IParticle): IVector;
}

/**
 * Configuration for sketch controls.
 * Used with Tweakpane to create interactive parameters.
 */
export interface SketchParams {
  [key: string]: number | boolean | string;
}

/**
 * Factory function type for creating sketches.
 * This pattern allows passing configuration to sketches.
 */
export type SketchFactory = (p: p5) => void;
