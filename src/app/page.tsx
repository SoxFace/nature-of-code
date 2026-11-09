'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import SketchViewer from '@/components/SketchViewer';
import {
  chapters,
  getSketchBySlug,
  getSketchesGroupedByChapter,
} from '@/sketches';
import type { SketchModule } from '@/sketches/types';

export default function Home() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [activeSketch, setActiveSketch] = useState<SketchModule | null>(null);

  const sketchesByChapter = useMemo(() => getSketchesGroupedByChapter(), []);

  const handleSketchSelect = useCallback((slug: string) => {
    setActiveSlug(slug);
    const sketch = getSketchBySlug(slug);
    setActiveSketch(sketch || null);

    // Update URL without navigation for shareable links
    window.history.pushState({}, '', `/?sketch=${slug}`);
  }, []);

  // Load sketch from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sketchSlug = params.get('sketch');
    if (sketchSlug) {
      const sketch = getSketchBySlug(sketchSlug);
      if (sketch) {
        setActiveSlug(sketchSlug);
        setActiveSketch(sketch);
      }
    }
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const sketchSlug = params.get('sketch');
      if (sketchSlug) {
        const sketch = getSketchBySlug(sketchSlug);
        if (sketch) {
          setActiveSlug(sketchSlug);
          setActiveSketch(sketch);
        }
      } else {
        setActiveSlug(null);
        setActiveSketch(null);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        chapters={chapters}
        sketchesByChapter={sketchesByChapter}
        activeSlug={activeSlug}
        onSketchSelect={handleSketchSelect}
      />
      <main className="flex-1 p-8 overflow-y-auto">
        <SketchViewer sketch={activeSketch} />
      </main>
    </div>
  );
}
