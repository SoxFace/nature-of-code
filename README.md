# Nature of Code

A Next.js application exploring concepts from Daniel Shiffman's ["The Nature of Code 2024 Ed."](https://natureofcode.com/) using p5.js and TypeScript.

## Getting Started

```bash
mise install
npx install
npx run dev   # localhost:3000
npx vercel --prod # deploy
```

## Deployed

[Live Site](https://nature-of-code-psi.vercel.app)

## Tech Stack

- **Next.js 16** - React framework with App Router and Turbopack
- **React 19** - UI library
- **p5.js** - Creative coding library
- **TypeScript** - Type-safe JavaScript
- **Tweakpane** - Interactive parameter controls
- **Tailwind CSS** - Utility-first CSS framework

## Project Structure

```
nature-of-code/
├── src/
│   ├── app/
│   │   └── page.tsx          # SPA home with sidebar + sketch viewer
│   ├── components/
│   │   ├── P5Wrapper.tsx     # p5.js React integration
│   │   ├── Sidebar.tsx       # Collapsible chapter navigation
│   │   └── SketchViewer.tsx  # Dynamic sketch loader
│   ├── lib/
│   │   ├── Vector.ts         # 2D vector math
│   │   ├── Walker.ts         # Walker class variants
│   │   ├── useTweakpane.ts   # Tweakpane utilities
│   │   └── types.ts          # Core interfaces
│   └── sketches/
│       ├── types.ts          # SketchMeta, SketchModule types
│       ├── chapters.ts       # Chapter metadata (0-10)
│       ├── index.ts          # Registry exports
│       ├── 0-ex-*.tsx        # Chapter 0 examples
│       └── 0-exercise-*.tsx  # Chapter 0 exercises
```

## Adding New Sketches

Create a new file in `src/sketches/` following the naming convention:

```tsx
// src/sketches/1-ex-01-vectors.tsx
'use client';

import type { SketchMeta } from './types';

export const meta: SketchMeta = {
  chapter: 1,
  type: 'example',
  number: 1,
  title: 'Bouncing Ball',
  description: 'Basic vector motion example.',
};

export default function BouncingBall() {
  // Your p5.js sketch component
}
```

Then add the import to `src/sketches/index.ts`.

## Shared Library

The `src/lib/` folder contains reusable utilities:

- **Vector** - 2D vector math (add, sub, normalize, limit, etc.)
- **Walker variants** - BiasedWalker, GaussianWalker, PerlinWalker, MouseSeekingWalker, AcceptRejectWalker
- **Tweakpane helpers** - `createPane()`, `disposePane()`, common bindings

## Implementation Notes

All p5.js sketches use client-side rendering:

```tsx
'use client';

import dynamic from 'next/dynamic';
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
```

## Acknowledgements

- Daniel Shiffman for "The Nature of Code" book and concepts
- p5.js for the creative coding library
- Next.js team for the React framework

## Learning Objectives

- Vector math (addition, subtraction, normalization, dot product)
- Random distributions (uniform, Gaussian, Perlin noise, accept-reject)
- Object-oriented design with class hierarchies (Walker variants)
- Registry pattern for content management (like Storybook/Astro)
- TypeScript interfaces for domain modeling
- SPA architecture with URL-based navigation
