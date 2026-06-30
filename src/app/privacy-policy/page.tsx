import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for NepalHub. Learn how we handle your data, cookies, third-party services, and your rights under GDPR and local laws.',
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/privacy-policy' },
  openGraph: {
    title: 'Privacy Policy | NepalHub',
    description: 'How NepalHub handles your data, cookies, and third-party services.',
  },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-12 text-gray-700 dark:text-gray-300 text-sm leading-relaxed space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Privacy Policy',
            description: 'Privacy Policy for NepalHub — data handling, cookies, and your rights.',
            url: 'https://nepalihub-omega.vercel.app/privacy-policy',
            isPartOf: { '@id': 'https://nepalihub-omega.vercel.app//#website' },
          }),
        }}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Privacy Policy</h1>
        <p className="text-xs text-gray-400 dark:text-gray-500">Last updated: June 2025</p>
      </div>

      <p>
        NepalHub (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) respects your privacy. This Privacy Policy
        explains how we collect, use, disclose, and safeguard your information when you visit our website{' '}
        <strong>nepalihub.com</strong> (the &quot;Site&quot;). Please read this policy carefully.
      </p>

      {/* 1. Information We Collect */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">1. Information We Collect</h2>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-1">a. Automatically Collected Information</h3>
        <p>
          When you visit the Site, we may automatically collect certain information, including:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Device type, browser type, operating system</li>
          <li>Pages visited, time spent, referral source</li>
          <li>IP address (anonymized where possible)</li>
        </ul>
        <p className="mt-2">
          This data is collected via <strong>Google Analytics</strong> and <strong>Google AdSense</strong> (if enabled).
        </p>

        <h3 className="font-semibold text-gray-800 dark:text-gray-200 mt-4 mb-1">b. Information You Provide</h3>
        <p>
          All calculators and tools on NepalHub run entirely in your browser. Any data you enter
          (income figures, dates, stock trades, etc.) <strong>never leaves your device</strong> and is
          <strong> not stored, transmitted, or saved</strong> on our servers.
        </p>
      </section>

      {/* 2. How We Use Your Information */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To operate, maintain, and improve the Site</li>
          <li>To serve relevant advertisements (if AdSense is active)</li>
          <li>To analyze usage patterns via aggregated analytics</li>
          <li>To comply with legal obligations</li>
        </ul>
      </section>

      {/* 3. Cookies & Tracking */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3. Cookies &amp; Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to enhance your experience. These include:
        </p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li><strong>Essential cookies:</strong> Required for the site to function (theme preference)</li>
          <li>
            <strong>Analytics cookies:</strong> Google Analytics helps us understand how visitors use the Site
          </li>
          <li>
            <strong>Advertising cookies:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to our website or other websites. Google's use of advertising cookies enables it and its partners to serve ads to our users based on their visit to our site and/or other sites on the Internet. Users may opt out of personalized advertising by visiting Ads Settings.
          </li>
        </ul>
        <p className="mt-2">
          You can control cookies through your browser settings. Disabling cookies may affect some functionality.
        </p>
      </section>

      {/* 4. Third-Party Services */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4. Third-Party Services</h2>
        <p>We use the following third-party services:</p>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 pr-4 font-semibold">Service</th>
                <th className="text-left py-2 pr-4 font-semibold">Purpose</th>
                <th className="text-left py-2 font-semibold">Data Shared</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">Google AdSense</td>
                <td className="py-2 pr-4">Advertising</td>
                <td className="py-2">Cookies, IP, browsing data</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">Google Analytics</td>
                <td className="py-2 pr-4">Analytics</td>
                <td className="py-2">Anonymized usage data</td>
              </tr>
              <tr className="border-b border-gray-100 dark:border-gray-800">
                <td className="py-2 pr-4">CoinGecko API</td>
                <td className="py-2 pr-4">Gold/silver prices</td>
                <td className="py-2">None (anonymous API call)</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Open Exchange Rates</td>
                <td className="py-2 pr-4">Forex rates</td>
                <td className="py-2">None (anonymous API call)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          Each service operates under its own privacy policy. We encourage you to review them.
        </p>
      </section>

      {/* 5. Data Retention */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5. Data Retention</h2>
        <p>
          We retain aggregated analytics data indefinitely for trend analysis. No personal user data
          is stored on our servers. Any data you enter in tools remains in your browser until you
          close the tab or clear your local data.
        </p>
      </section>

      {/* 6. Your Rights (GDPR) */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">6. Your Rights (GDPR)</h2>
        <p>If you are a resident of the European Economic Area (EEA), you have the right to:</p>
        <ul className="list-disc pl-6 space-y-1 mt-2">
          <li>Request access to your personal data</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to or restrict processing</li>
          <li>Data portability</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, contact us at{' '}
          <a href="mailto:privacy@nepalihub.com" className="text-blue-600 dark:text-blue-400 underline">privacy@nepalihub.com</a>.
        </p>
      </section>

      {/* 7. Children's Privacy */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">7. Children&apos;s Privacy</h2>
        <p>
          The Site is not directed to children under 13. We do not knowingly collect personal information
          from children. If we become aware of such data, we will delete it promptly.
        </p>
      </section>

      {/* 8. Changes */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Changes will be posted on this page
          with an updated &quot;Last updated&quot; date. Continued use of the Site after changes
          constitutes acceptance.
        </p>
      </section>

      {/* 9. Contact */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at{' '}
          <a href="mailto:privacy@nepalihub.com" className="text-blue-600 dark:text-blue-400 underline">privacy@nepalihub.com</a>.
        </p>
      </section>
    </main>
  );
}
