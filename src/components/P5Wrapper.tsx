'use client';

import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p5: p5) => void;
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ sketch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const p5Ref = useRef<p5 | null>(null);

  useEffect(() => {
    // Only create the p5 instance in the browser
    if (typeof window !== 'undefined' && containerRef.current) {
      // Clean up previous instance if it exists
      if (p5Ref.current) {
        p5Ref.current.remove();
      }

      // Create new p5 instance
      p5Ref.current = new p5(sketch, containerRef.current);
    }

    // Cleanup on unmount
    return () => {
      if (p5Ref.current) {
        p5Ref.current.remove();
      }
    };
  }, [sketch]);

  return <div ref={containerRef} />;
};

export default P5Wrapper;