/**
 * Sketch Registry
 *
 * Auto-exports all sketches with their metadata for dynamic routing.
 * Each sketch exports a `meta` object and a default component.
 */

import type { SketchModule, SketchMeta } from './types';
import { generateSlug } from './types';
export { chapters } from './chapters';
export type { SketchMeta, SketchModule, ChapterMeta } from './types';

// Chapter 0: Randomness - Examples
export * as Ex01RandomWalk from './0-ex-01-random-walk';
export * as Ex02Distribution from './0-ex-02-distribution';
export * as Ex03WalkerRight from './0-ex-03-walker-right';
export * as Ex04Gaussian from './0-ex-04-gaussian';
export * as Ex05AcceptReject from './0-ex-05-accept-reject';
export * as Ex06PerlinWalker from './0-ex-06-perlin-walker';
export * as Ex07FractalTree from './0-ex-07-fractal-tree';

// Chapter 0: Randomness - Exercises
export * as Exercise01BiasedWalker from './0-exercise-01-biased-walker';
export * as Exercise02TwoAces from './0-exercise-02-two-aces';
export * as Exercise03MouseWalker from './0-exercise-03-mouse-walker';
export * as Exercise04PaintSplatter from './0-exercise-04-paint-splatter';
export * as Exercise05GaussianWalker from './0-exercise-05-gaussian-walker';
export * as Exercise06AcceptRejectWalker from './0-exercise-06-accept-reject-walker';
export * as Exercise07PerlinWalker from './0-exercise-07-perlin-walker';
export * as Exercise08NoiseDetail from './0-exercise-08-noise-detail';
export * as Exercise09NoiseAnimated from './0-exercise-09-noise-animated';
export * as Exercise10NoiseElevation from './0-exercise-10-noise-elevation';

// Registry of all sketch modules
const sketchModules: SketchModule[] = [
  // Examples
  require('./0-ex-01-random-walk'),
  require('./0-ex-02-distribution'),
  require('./0-ex-03-walker-right'),
  require('./0-ex-04-gaussian'),
  require('./0-ex-05-accept-reject'),
  require('./0-ex-06-perlin-walker'),
  require('./0-ex-07-fractal-tree'),
  // Exercises
  require('./0-exercise-01-biased-walker'),
  require('./0-exercise-02-two-aces'),
  require('./0-exercise-03-mouse-walker'),
  require('./0-exercise-04-paint-splatter'),
  require('./0-exercise-05-gaussian-walker'),
  require('./0-exercise-06-accept-reject-walker'),
  require('./0-exercise-07-perlin-walker'),
  require('./0-exercise-08-noise-detail'),
  require('./0-exercise-09-noise-animated'),
  require('./0-exercise-10-noise-elevation'),
];

// Build lookup maps
const sketchBySlug = new Map<string, SketchModule>();
const sketchesByChapter = new Map<number, SketchModule[]>();

for (const mod of sketchModules) {
  const slug = generateSlug(mod.meta);
  sketchBySlug.set(slug, mod);

  const chapterSketches = sketchesByChapter.get(mod.meta.chapter) || [];
  chapterSketches.push(mod);
  sketchesByChapter.set(mod.meta.chapter, chapterSketches);
}

// Sort sketches within each chapter by type (examples first) then number
for (const [chapter, sketches] of sketchesByChapter) {
  sketches.sort((a, b) => {
    if (a.meta.type !== b.meta.type) {
      return a.meta.type === 'example' ? -1 : 1;
    }
    return a.meta.number - b.meta.number;
  });
  sketchesByChapter.set(chapter, sketches);
}

/**
 * Get a sketch module by its slug
 */
export function getSketchBySlug(slug: string): SketchModule | undefined {
  return sketchBySlug.get(slug);
}

/**
 * Get all sketches for a chapter
 */
export function getSketchesByChapter(chapter: number): SketchModule[] {
  return sketchesByChapter.get(chapter) || [];
}

/**
 * Get all sketch slugs
 */
export function getAllSlugs(): string[] {
  return Array.from(sketchBySlug.keys());
}

/**
 * Get all sketches
 */
export function getAllSketches(): SketchModule[] {
  return sketchModules;
}

/**
 * Get sketches grouped by chapter
 */
export function getSketchesGroupedByChapter(): Map<number, SketchModule[]> {
  return sketchesByChapter;
}
