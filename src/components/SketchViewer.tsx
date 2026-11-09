'use client';

import { Suspense, useMemo } from 'react';
import type { SketchModule } from '@/sketches/types';

interface SketchViewerProps {
  sketch: SketchModule | null;
}

function SketchPlaceholder() {
  return (
    <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
      <div className="text-center text-gray-500">
        <p className="text-lg mb-2">Select a sketch from the sidebar</p>
        <p className="text-sm">Browse examples and exercises to get started</p>
      </div>
    </div>
  );
}

function SketchLoading() {
  return (
    <div className="flex items-center justify-center h-[400px] bg-gray-50 rounded-lg border border-gray-200">
      <div className="animate-pulse text-gray-400">Loading sketch...</div>
    </div>
  );
}

export default function SketchViewer({ sketch }: SketchViewerProps) {
  const SketchComponent = useMemo(() => {
    return sketch?.default ?? null;
  }, [sketch]);

  if (!sketch || !SketchComponent) {
    return <SketchPlaceholder />;
  }

  const { meta } = sketch;
  const typeLabel = meta.type === 'example' ? 'Example' : 'Exercise';

  return (
    <div className="space-y-4">
      <div className="border-b border-gray-200 pb-4">
        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded mb-2">
          Chapter {meta.chapter} · {typeLabel} {meta.number}
        </span>
        <h2 className="text-2xl font-bold">{meta.title}</h2>
        <p className="text-gray-600 mt-1">{meta.description}</p>
      </div>
      <Suspense fallback={<SketchLoading />}>
        <SketchComponent />
      </Suspense>
    </div>
  );
}
