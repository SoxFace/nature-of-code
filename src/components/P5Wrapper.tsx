"use client";

import React, { useEffect, useRef } from 'react';
import p5 from 'p5';

interface P5WrapperProps {
  sketch: (p: p5) => void;
}

const P5Wrapper: React.FC<P5WrapperProps> = ({ sketch }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Create a new p5 instance
    const instance = new p5(sketch, containerRef.current);
    
    // Clean up on unmount
    return () => {
      instance.remove();
    };
  }, [sketch]);
  
  return <div ref={containerRef} className="p5-canvas-container" />;
};

export default P5Wrapper;