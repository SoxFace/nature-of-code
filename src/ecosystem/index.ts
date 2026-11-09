/**
 * Ecosystem Module
 *
 * A living pond simulation that evolves throughout the Nature of Code book.
 * New behaviors and capabilities are added with each chapter.
 */

// Environment
export { Pond, type PondConfig } from './Pond';

// Base creature
export { Creature, defaultCreatureConfig, type CreatureConfig } from './Creature';

// Creature types
export { Skimmer, skimmerDefaults } from './creatures/Skimmer';
export { Fly, flyDefaults } from './creatures/Fly';
export { Fish, fishDefaults } from './creatures/Fish';
export { Leaf, leafDefaults } from './creatures/Leaf';

// Behaviors
export {
  WanderBehavior,
  FleeBehavior,
  type WanderConfig,
  type FleeConfig,
} from './behaviors';
