import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn more about NepalHub, our mission, and our completely free and private calculators and tools tailored for Nepal.',
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/about' },
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">About NepalHub</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Simplifying utilities and calculations for everyone.</p>
      </div>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Our Mission</h2>
        <p>
          At NepalHub, we believe that accessing reliable digital utilities and calculators shouldn't be a hassle. 
          Our mission is to provide an accessible, centralized platform for Nepal-specific tools such as income tax 
          calculators, EMI calculators, Unicode converters, and more—all available completely free of charge.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Privacy First</h2>
        <p>
          We know that your financial and personal data is sensitive. That is why every calculator on NepalHub 
          operates entirely within your own web browser. No calculation data is transmitted to, processed by, or 
          stored on our servers. What you calculate stays on your device.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Built for the Future</h2>
        <p>
          NepalHub is consistently updated to reflect the latest fiscal changes, tax brackets, and rules mandated 
          by the relevant authorities in Nepal. We ensure a clean, responsive, and seamless experience whether 
          you are using a desktop, tablet, or smartphone.
        </p>
      </section>
      
      <section className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800">
        <p className="text-gray-500 text-xs text-center">
          Have suggestions or feedback? We'd love to hear from you. Visit our <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">Contact</a> page.
        </p>
      </section>
    </main>
  );
}
