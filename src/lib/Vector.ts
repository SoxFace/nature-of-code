/**
 * A 2D Vector class for motion simulation.
 *
 * Vectors are fundamental to physics simulation. They represent:
 * - Position: where something is
 * - Velocity: how fast and which direction it's moving
 * - Acceleration: how velocity is changing
 * - Force: what causes acceleration
 *
 * Key insight: All these concepts are just vectors being added together!
 * position += velocity
 * velocity += acceleration
 * acceleration = force / mass
 */

import type { IVector } from './types';

export class Vector implements IVector {
  constructor(
    public x: number = 0,
    public y: number = 0
  ) {}

  // ============================================
  // STATIC FACTORY METHODS
  // These create new vectors without needing an instance
  // ============================================

  /** Create a vector from x, y components */
  static create(x: number, y: number): Vector {
    return new Vector(x, y);
  }

  /** Create a random vector with components between -1 and 1 */
  static random(): Vector {
    return new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
  }

  /**
   * Create a random unit vector (magnitude = 1).
   * Useful for random directions without bias toward corners.
   */
  static randomUnit(): Vector {
    const angle = Math.random() * Math.PI * 2;
    return new Vector(Math.cos(angle), Math.sin(angle));
  }

  /** Create a vector from an angle (in radians) */
  static fromAngle(angle: number, magnitude: number = 1): Vector {
    return new Vector(Math.cos(angle) * magnitude, Math.sin(angle) * magnitude);
  }

  /** Add two vectors, returning a new vector */
  static add(v1: IVector, v2: IVector): Vector {
    return new Vector(v1.x + v2.x, v1.y + v2.y);
  }

  /** Subtract v2 from v1, returning a new vector */
  static sub(v1: IVector, v2: IVector): Vector {
    return new Vector(v1.x - v2.x, v1.y - v2.y);
  }

  /** Calculate distance between two vectors (as points) */
  static dist(v1: IVector, v2: IVector): number {
    const dx = v1.x - v2.x;
    const dy = v1.y - v2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // ============================================
  // INSTANCE METHODS (Immutable - return new vectors)
  // These don't modify the original, enabling chaining
  // ============================================

  /** Create a copy of this vector */
  copy(): Vector {
    return new Vector(this.x, this.y);
  }

  /** Add another vector, returning a NEW vector */
  add(v: IVector): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  /** Subtract another vector, returning a NEW vector */
  sub(v: IVector): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  /** Multiply by scalar, returning a NEW vector */
  mult(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  /** Divide by scalar, returning a NEW vector */
  div(scalar: number): Vector {
    if (scalar === 0) {
      console.warn('Vector.div: Division by zero');
      return this.copy();
    }
    return new Vector(this.x / scalar, this.y / scalar);
  }

  /**
   * Get magnitude (length) of the vector.
   * Uses Pythagorean theorem: magnitude = √(x² + y²)
   */
  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /** Get magnitude squared (faster, avoids sqrt) */
  magSq(): number {
    return this.x * this.x + this.y * this.y;
  }

  /**
   * Normalize to unit vector (magnitude = 1).
   * A unit vector preserves direction but has length 1.
   * Useful for getting pure direction.
   */
  normalize(): Vector {
    const m = this.mag();
    if (m === 0) return this.copy();
    return this.div(m);
  }

  /**
   * Limit magnitude to a maximum value.
   * If current magnitude > max, scale down to max.
   * Essential for capping velocity (terminal velocity).
   */
  limit(max: number): Vector {
    const mSq = this.magSq();
    if (mSq > max * max) {
      return this.normalize().mult(max);
    }
    return this.copy();
  }

  /** Set magnitude to a specific value */
  setMag(magnitude: number): Vector {
    return this.normalize().mult(magnitude);
  }

  /** Get the angle of this vector (in radians) */
  heading(): number {
    return Math.atan2(this.y, this.x);
  }

  /** Rotate vector by an angle (in radians) */
  rotate(angle: number): Vector {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  /** Calculate dot product with another vector */
  dot(v: IVector): number {
    return this.x * v.x + this.y * v.y;
  }

  /** Linear interpolation toward another vector */
  lerp(target: IVector, amount: number): Vector {
    return new Vector(
      this.x + (target.x - this.x) * amount,
      this.y + (target.y - this.y) * amount
    );
  }

  // ============================================
  // MUTATING METHODS (modify in place)
  // Use these for performance in tight loops
  // ============================================

  /** Add in place (modifies this vector) */
  addMut(v: IVector): this {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  /** Subtract in place (modifies this vector) */
  subMut(v: IVector): this {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  /** Multiply in place (modifies this vector) */
  multMut(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  /** Divide in place (modifies this vector) */
  divMut(scalar: number): this {
    if (scalar !== 0) {
      this.x /= scalar;
      this.y /= scalar;
    }
    return this;
  }

  /** Set x and y directly */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  /** String representation for debugging */
  toString(): string {
    return `Vector(${this.x.toFixed(2)}, ${this.y.toFixed(2)})`;
  }
}
