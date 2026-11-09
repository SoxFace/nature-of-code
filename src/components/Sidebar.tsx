'use client';

import { useMemo, useState, useEffect } from 'react';
import type { SketchModule, ChapterMeta } from '@/sketches/types';
import { generateSlug } from '@/sketches/types';

interface SidebarProps {
  chapters: ChapterMeta[];
  sketchesByChapter: Map<number, SketchModule[]>;
  activeSlug: string | null;
  onSketchSelect: (slug: string) => void;
}

function ChevronIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <svg
      className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-90' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );
}

export default function Sidebar({
  chapters,
  sketchesByChapter,
  activeSlug,
  onSketchSelect,
}: SidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());

  const chaptersWithSketches = useMemo(() => {
    return chapters.filter((ch) => {
      const sketches = sketchesByChapter.get(ch.number);
      return sketches && sketches.length > 0;
    });
  }, [chapters, sketchesByChapter]);

  // Auto-expand chapter containing active sketch
  useEffect(() => {
    if (activeSlug) {
      for (const [chapterNum, sketches] of sketchesByChapter) {
        const hasActiveSketch = sketches.some(
          (s) => generateSlug(s.meta) === activeSlug
        );
        if (hasActiveSketch) {
          setExpandedChapters((prev) => new Set(prev).add(chapterNum));
          break;
        }
      }
    }
  }, [activeSlug, sketchesByChapter]);

  const toggleChapter = (chapterNum: number) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev);
      if (next.has(chapterNum)) {
        next.delete(chapterNum);
      } else {
        next.add(chapterNum);
      }
      return next;
    });
  };

  return (
    <nav className="w-72 h-screen overflow-y-auto border-r border-gray-200 bg-gray-50 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Nature of Code</h1>
        <p className="text-sm text-gray-500">Interactive sketches</p>
      </div>

      <div className="space-y-1">
        {chaptersWithSketches.map((chapter) => {
          const sketches = sketchesByChapter.get(chapter.number) || [];
          const examples = sketches.filter((s) => s.meta.type === 'example');
          const exercises = sketches.filter((s) => s.meta.type === 'exercise');
          const isExpanded = expandedChapters.has(chapter.number);
          const sketchCount = sketches.length;

          return (
            <div key={chapter.number}>
              <button
                onClick={() => toggleChapter(chapter.number)}
                className="w-full flex items-center justify-between px-2 py-2 text-left rounded hover:bg-gray-100 transition-colors"
              >
                <span className="text-sm font-semibold text-gray-900">
                  {chapter.number}. {chapter.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">{sketchCount}</span>
                  <ChevronIcon isOpen={isExpanded} />
                </div>
              </button>

              {isExpanded && (
                <div className="ml-2 mt-1 mb-3 border-l border-gray-200 pl-2">
                  {examples.length > 0 && (
                    <div className="mb-2">
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 px-2">
                        Examples
                      </h3>
                      <ul className="space-y-0.5">
                        {examples.map((sketch) => {
                          const slug = generateSlug(sketch.meta);
                          const isActive = slug === activeSlug;
                          return (
                            <li key={slug}>
                              <button
                                onClick={() => onSketchSelect(slug)}
                                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                                  isActive
                                    ? 'bg-blue-100 text-blue-800 font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {sketch.meta.number}. {sketch.meta.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}

                  {exercises.length > 0 && (
                    <div>
                      <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 px-2">
                        Exercises
                      </h3>
                      <ul className="space-y-0.5">
                        {exercises.map((sketch) => {
                          const slug = generateSlug(sketch.meta);
                          const isActive = slug === activeSlug;
                          return (
                            <li key={slug}>
                              <button
                                onClick={() => onSketchSelect(slug)}
                                className={`w-full text-left px-2 py-1.5 rounded text-sm transition-colors ${
                                  isActive
                                    ? 'bg-blue-100 text-blue-800 font-medium'
                                    : 'text-gray-700 hover:bg-gray-100'
                                }`}
                              >
                                {sketch.meta.number}. {sketch.meta.title}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </nav>
  );
}
