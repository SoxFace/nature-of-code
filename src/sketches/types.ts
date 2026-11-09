import type { ComponentType } from 'react';

/**
 * Metadata for a sketch (example or exercise).
 * Each sketch file exports this alongside the component.
 */
export interface SketchMeta {
  /** Chapter number (0 = Randomness, 1 = Vectors, etc.) */
  chapter: number;

  /** 'example' for book examples, 'exercise' for practice */
  type: 'example' | 'exercise';

  /** Order within the chapter (1, 2, 3...) */
  number: number;

  /** Display title */
  title: string;

  /** Brief description */
  description: string;

  /** URL slug - auto-generated if not provided */
  slug?: string;
}

/**
 * A sketch module exports meta + default component.
 */
export interface SketchModule {
  meta: SketchMeta;
  default: ComponentType;
}

/**
 * Chapter metadata.
 */
export interface ChapterMeta {
  number: number;
  title: string;
  description: string;
}

/**
 * Generate a slug from chapter, type, and number.
 */
export function generateSlug(meta: SketchMeta): string {
  if (meta.slug) return meta.slug;
  const typePrefix = meta.type === 'example' ? 'ex' : 'pr';
  return `${meta.chapter}-${typePrefix}-${String(meta.number).padStart(2, '0')}`;
}

/**
 * Generate the URL path for a sketch.
 */
export function getSketchPath(meta: SketchMeta): string {
  const slug = generateSlug(meta);
  return `/sketch/${slug}`;
}
