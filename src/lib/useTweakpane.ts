/**
 * React hook for using Tweakpane with p5.js sketches.
 *
 * Tweakpane creates a GUI panel for real-time parameter adjustment.
 * This hook handles:
 * - Creating/destroying the pane on mount/unmount
 * - Proper cleanup to avoid memory leaks
 * - Type-safe parameter bindings
 *
 * Usage:
 * ```tsx
 * const params = { speed: 1, size: 10, showTrail: true };
 * const paneRef = useRef<Pane | null>(null);
 *
 * // In useEffect or sketch setup:
 * if (!paneRef.current) {
 *   paneRef.current = createPane(containerRef.current, params, (p) => {
 *     p.addBinding(params, 'speed', { min: 0, max: 5, label: 'Speed' });
 *     p.addBinding(params, 'size', { min: 1, max: 50, label: 'Size' });
 *     p.addBinding(params, 'showTrail', { label: 'Show Trail' });
 *   });
 * }
 * ```
 */

import { Pane } from 'tweakpane';

export interface PaneConfig<T extends object> {
  /** Title for the pane */
  title?: string;
  /** Whether pane is expanded by default */
  expanded?: boolean;
}

/**
 * Create a Tweakpane instance with the given parameters.
 *
 * @param container - DOM element to attach the pane to (optional)
 * @param params - Object containing the parameters to control
 * @param setup - Function to configure bindings
 * @param config - Optional pane configuration
 * @returns The Pane instance (for cleanup)
 */
export function createPane<T extends object>(
  container: HTMLElement | null,
  params: T,
  setup: (pane: Pane, params: T) => void,
  config: PaneConfig<T> = {}
): Pane {
  const pane = new Pane({
    container: container ?? undefined,
    title: config.title ?? 'Controls',
    expanded: config.expanded ?? true,
  });

  setup(pane, params);

  return pane;
}

/**
 * Dispose of a Tweakpane instance safely.
 */
export function disposePane(pane: Pane | null): void {
  if (pane) {
    pane.dispose();
  }
}

/**
 * Common binding presets for Nature of Code parameters.
 * Use these to maintain consistency across sketches.
 */
export const bindings = {
  /** Standard step size binding */
  stepSize: { min: 0.1, max: 10, step: 0.1, label: 'Step Size' },

  /** Standard speed binding */
  speed: { min: 0, max: 5, step: 0.1, label: 'Speed' },

  /** Probability binding (0-1) */
  probability: { min: 0, max: 1, step: 0.01, label: 'Probability' },

  /** Standard deviation for Gaussian */
  stdDev: { min: 0.1, max: 20, step: 0.1, label: 'Std Dev' },

  /** Noise increment for Perlin */
  noiseIncrement: { min: 0.001, max: 0.1, step: 0.001, label: 'Noise Step' },

  /** Mouse influence */
  mouseInfluence: { min: 0, max: 1, step: 0.05, label: 'Mouse Influence' },
};

export { Pane };
