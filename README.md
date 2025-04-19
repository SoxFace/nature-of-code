# Nature of Code
A Next.js application exploring concepts from Daniel Shiffman's ["The Nature of Code 2024 Ed."](https://natureofcode.com/) using p5.js

## Getting Started

- `npm install`
- `npm run dev` # localhost:3000
- `vercel`      # deploy

## 🚀 Deployed using Vercel
[Live Site](https://nature-of-code-jgcek5us5-sxofaces-projects.vercel.app/)

## Dependencies

- Next.js 15.3 - React framework with App Router
- p5.js - Creative coding library
- TypeScript - Type-safe JavaScript
- Tailwind CSS - Utility-first CSS framework
- Vercel - Deployment platform

## Structure

```
nature-of-code/
├── public/           
├── src/
│   ├── app/           # Next.js App Router
│   │   ├── examples/  # Examples
│   │   ├── exercises/ # Practice exercises
│   │   └── page.tsx   # Home page
│   └── components/    
│       ├── P5Wrapper.tsx    # p5.js integration
│       └── SketchLayout.tsx # Layout for sketches
```

## Implementation Notes

All p5.js components use the 'use client' directive to ensure they only run in the browser. Dynamic imports are used to prevent server-side rendering (SSR) issues:

```
'use client';

import dynamic from 'next/dynamic';
const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });
import SketchLayout from '@/components/SketchLayout';
```

🙏 Acknowledgements

- Daniel Shiffman for "The Nature of Code" book and concepts
- p5.js for the creative coding library
- Next.js for the React framework
- Vercel for deployment

## What I want to learn to do:

1. Create utility classes for common concepts like vectors, forces, etc.
2. Create shared sketch components like particles, springs, etc.
4. Use TypeScript interfaces for better code organization
5. Add controls to sketches or implement a suitable library