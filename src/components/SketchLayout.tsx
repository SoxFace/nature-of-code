"use client";

import Link from 'next/link';
import React from 'react';

interface SketchLayoutProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const SketchLayout: React.FC<SketchLayoutProps> = ({ 
  title, 
  description, 
  children 
}) => {
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <header className="mb-6">
        <Link href="/" className="text-blue-500 hover:underline mb-2 inline-block">
          ← Back to All Sketches
        </Link>
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-200">{description}</p>}
      </header>
      
      <main className="mb-8">
        {children}
      </main>
      
      <footer className="text-sm text-gray-500">
        <p>Source: The Nature of Code by Daniel Shiffman (2024)</p>
      </footer>
    </div>
  );
};

export default SketchLayout;