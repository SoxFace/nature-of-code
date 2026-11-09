/**
 * Ecosystem Behaviors
 *
 * Composable behaviors that can be mixed into creatures.
 * New behaviors will be added as we progress through chapters.
 */

export { WanderBehavior, type WanderConfig } from './Wander';
export { FleeBehavior, type FleeConfig, type Positioned } from './Flee';

// Future behaviors (to be implemented in later chapters):
// - SeekBehavior (Ch 5: Steering toward target)
// - ArriveBehavior (Ch 5: Slow down when approaching)
// - FlockBehavior (Ch 5: Separation, alignment, cohesion)
// - AvoidObstacleBehavior (Ch 5: Obstacle avoidance)
// - PursuitBehavior (Ch 5: Predict and intercept)
// - EvadeBehavior (Ch 5: Predict and escape)
