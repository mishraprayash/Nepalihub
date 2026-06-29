import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for NepalHub. Rules for using our free calculators, converters, and tools. Disclaimer of liability and intellectual property terms.',
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//terms' },
  openGraph: {
    title: 'Terms of Service | NepalHub',
    description: 'Terms governing the use of NepalHub tools, disclaimers, and intellectual property.',
  },
};

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Terms of Service',
            description: 'Terms of Service for NepalHub.',
            url: 'https://nepalihub-omega.vercel.app//terms',
            isPartOf: { '@id': 'https://nepalihub-omega.vercel.app//#website' },
          }),
        }}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Terms of Service</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500">Last updated: June 2025</p>
      </div>

      <p>
        Welcome to <strong>NepalHub</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;). By accessing or
        using our website at <strong>nepalihub.com</strong> (the &quot;Site&quot;), you agree to be bound by
        these Terms of Service (&quot;Terms&quot;). If you do not agree, please do not use the Site.
      </p>

      {/* 1. Acceptance */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Acceptance of Terms</h2>
        <p>
          By using the Site, you confirm that you have read, understood, and agree to these Terms.
          We reserve the right to update these Terms at any time. Continued use constitutes acceptance
          of the updated Terms.
        </p>
      </section>

      {/* 2. Description */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
        <p>
          NepalHub provides free online calculators, converters, and digital utilities specifically
          designed for Nepal. All tools run entirely <strong>client-side</strong> in your browser —
          no data is sent to or stored on our servers.
        </p>
      </section>

      {/* 3. Disclaimer */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Disclaimer — Not Financial Advice</h2>
        <div className="bg-amber-50 dark:bg-amber-950/20 border-l-4 border-amber-400 dark:border-amber-600 p-4 rounded-r-lg -mx-1">
          <p className="font-semibold text-amber-800 dark:text-amber-300 mb-1">⚠ Important Disclaimer</p>
          <p className="text-amber-700 dark:text-amber-400">
            All calculators and tools on NepalHub are for <strong>educational and estimation purposes only</strong>.
            They do not constitute professional financial, legal, tax, or investment advice. Always consult
            a qualified professional (CA, tax consultant, financial advisor) before making decisions based
            on these calculations.
          </p>
        </div>
        <p className="mt-3">
          Tax rates, tariffs, and financial figures displayed are based on publicly available information
          and may not reflect the latest updates. NepalHub makes no warranty regarding the accuracy,
          completeness, or timeliness of this information.
        </p>
      </section>

      {/* 4. Intellectual Property */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Intellectual Property</h2>
        <p>
          All content on the Site — including text, code, designs, logos, and tools — is the property of
          NepalHub unless otherwise attributed. You may not reproduce, distribute, modify, or create
          derivative works without prior written permission.
        </p>
        <p className="mt-2">
          The Nepal name, flag, and related imagery are used for informational purposes and remain the
          property of the Government of Nepal.
        </p>
      </section>

      {/* 5. User Conduct */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. User Conduct</h2>
        <p>You agree not to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Use the Site for any unlawful purpose</li>
          <li>Attempt to disrupt, overload, or compromise the Site</li>
          <li>Scrape, crawl, or copy content for commercial use without permission</li>
          <li>Misrepresent the accuracy or intent of the tools</li>
        </ul>
      </section>

      {/* 6. Limitation of Liability */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law, NepalHub shall not be liable for any direct, indirect,
          incidental, consequential, or punitive damages arising from your use of or inability to use
          the Site, even if advised of the possibility of such damages.
        </p>
      </section>

      {/* 7. Third-Party Links */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Third-Party Links</h2>
        <p>
          The Site may contain links to third-party websites (e.g., NRB, NEPSE, IRD). We are not
          responsible for the content, privacy practices, or accuracy of external sites.
        </p>
      </section>

      {/* 8. Governing Law */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Governing Law</h2>
        <p>
          These Terms are governed by the laws of Nepal. Any disputes shall be resolved in the courts
          of Kathmandu, Nepal.
        </p>
      </section>

      {/* 9. Contact */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Contact Us</h2>
        <p>
          For questions about these Terms, please reach out at{' '}
          <a href="mailto:legal@nepalihub.com" className="text-blue-600 dark:text-blue-400 underline">legal@nepalihub.com</a>.
        </p>
      </section>
    </main>
  );
}
