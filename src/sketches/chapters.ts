import type { ChapterMeta } from './types';

/**
 * All chapters in the Nature of Code curriculum.
 * Used for navigation and organization.
 */
export const chapters: ChapterMeta[] = [
  {
    number: 0,
    title: 'Randomness',
    description: 'Random walks, probability distributions, and Perlin noise',
  },
  {
    number: 1,
    title: 'Vectors',
    description: 'Vector math, motion, and acceleration',
  },
  {
    number: 2,
    title: 'Forces',
    description: 'Gravity, friction, and fluid resistance',
  },
  {
    number: 3,
    title: 'Oscillation',
    description: 'Trigonometry, waves, and pendulums',
  },
  {
    number: 4,
    title: 'Particle Systems',
    description: 'Emitters, particles, and forces',
  },
  {
    number: 5,
    title: 'Autonomous Agents',
    description: 'Steering behaviors and flocking',
  },
  {
    number: 6,
    title: 'Physics Libraries',
    description: 'Matter.js and physics simulation',
  },
  {
    number: 7,
    title: 'Cellular Automata',
    description: 'Game of Life and 2D CA',
  },
  {
    number: 8,
    title: 'Fractals',
    description: 'Self-similarity and recursive patterns',
  },
  {
    number: 9,
    title: 'Genetic Algorithms',
    description: 'Evolution and natural selection',
  },
  {
    number: 10,
    title: 'Neural Networks',
    description: 'Perceptrons and learning',
  },
];

export function getChapter(number: number): ChapterMeta | undefined {
  return chapters.find((c) => c.number === number);
}
