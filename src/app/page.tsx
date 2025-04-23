import Link from 'next/link';

type SectionProps = {
  title: string;
  items: { href: string; label: string }[];
};

const Section = ({ title, items }: SectionProps) => (
  <section>
    <h2 className="text-2xl font-semibold mb-3">{title}</h2>
    <ul className="list-disc pl-5 space-y-1">
      {items.map((item, index) => (
        <li key={index}>
          <Link href={item.href} className="text-blue-500 hover:underline">
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  </section>
);

export default function Home() {
  const examples = [
    { href: '/examples/06-perlin-noise-walker', label: '0.6: Perlin Noise Walker' },
    { href: '/examples/05-accept-reject-dist', label: '0.5: Accept Reject Distribution' },
    { href: '/examples/04-gaussian-distribution', label: '0.4: Gaussian Distribution' },
    { href: '/examples/03-walker-right', label: '0.3: Right walker' },
    { href: '/examples/02-random-number-distribution', label: '0.2: Random Number Distribution' },
    { href: '/examples/01-random-walk', label: '0.1: Traditional Random Walk' },
  ];

  const exercises = [
    { href: '/exercises/07-perlin-noise-random-walker', label: '0.7: Perlin Noise Random walker' },
    { href: '/exercises/06-accept-reject-walker', label: '0.6: Accept-Reject walker' },
    { href: '/exercises/05-gaussian-walker', label: '0.5: Gaussian walker' },
    { href: '/exercises/04-paint-splatter', label: '0.4: Paint Splatter' },
    { href: '/exercises/03-walk-random-mouse', label: '0.3: Random dynamic walker' },
    { href: '/exercises/02-two-aces', label: '0.2: Two aces' },
    { href: '/exercises/01-down-right-walk', label: '0.1: Down to the Right Walker' },
  ];

  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Nature of Code 2024</h1>
      <p className="mb-8">Exploring the concepts The Nature of Code (2024 edition).</p>
      
      <div className="space-y-6">
        <Section title="Examples" items={examples} />
        <Section title="Exercises" items={exercises} />
      </div>
    </main>
  );
}
