import Link from 'next/link';

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nature of Code 2024</h1>
      <p className="mb-8">Exploring the concepts The Nature of Code (2024 edition).</p>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Examples</h2>
          <ul className="list-disc pl-5 space-y-1">
          <li>
              <Link href="/examples/02-random-number-distribution" className="text-blue-500 hover:underline">
                0.2: Random Number Distribution
              </Link>
            </li>
            <li>
              <Link href="/examples/01-random-walk" className="text-blue-500 hover:underline">
                0.1: Traditional Random Walk
              </Link>
            </li>
            {/* Add more sketches here as you create them */}
          </ul>
        </section>
        
        {/* Add more chapters here */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Exercises</h2>
          <ul className="list-disc pl-5 space-y-1">
          <li>
              <Link href="/exercises/01-down-right-walk" className="text-blue-500 hover:underline">
                0.1: Down to the Right Walker
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}