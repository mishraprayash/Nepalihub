import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about NepalHub, our mission, and our completely free and private calculators and tools tailored for Nepal.',
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/about' },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-12 text-ink-soft text-sm leading-relaxed space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-ink mb-2">About NepalHub</h1>
        <p className="text-sm text-ink-faint">Simplifying utilities and calculations for everyone.</p>
      </div>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">Our Mission</h2>
        <p>
          At NepalHub, we believe that accessing reliable digital utilities and calculators shouldn&apos;t be a hassle.
          Our mission is to provide an accessible, centralized platform for Nepal-specific tools such as income tax 
          calculators, EMI calculators, Unicode converters, and more—all available completely free of charge.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">Privacy First</h2>
        <p>
          We know that your financial and personal data is sensitive. That is why every calculator on NepalHub 
          operates entirely within your own web browser. No calculation data is transmitted to, processed by, or 
          stored on our servers. What you calculate stays on your device.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">Built for the Future</h2>
        <p>
          NepalHub is consistently updated to reflect the latest fiscal changes, tax brackets, and rules mandated 
          by the relevant authorities in Nepal. We ensure a clean, responsive, and seamless experience whether 
          you are using a desktop, tablet, or smartphone.
        </p>
      </section>
      
      <section className="mt-8 pt-8 border-t border-line">
        <p className="text-ink-faint text-xs text-center">
          Have suggestions or feedback? We&apos;d love to hear from you. Visit our <a href="/contact" className="text-simrik hover:text-simrik-deep hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/60 rounded">Contact</a> page.
        </p>
      </section>
    </main>
  );
}
