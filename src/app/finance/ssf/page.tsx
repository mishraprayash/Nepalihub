import type { Metadata } from 'next';
import SSFClient from './Client';

export const metadata: Metadata = {
  title: 'SSF Contribution & Benefits Calculator — Nepal Social Security Fund',
  description: 'Calculate SSF contributions (11% employee + 20% employer), projected benefits, medical insurance, accident insurance, maternity, and old age pension. Latest FY 2081/82 rates.',
  keywords: ['ssf', 'social security fund', 'ssf calculator', 'ssf contribution', 'nepal ssf', 'pension calculator', 'employee contribution', 'employer contribution', 'social security nepal'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/finance/ssf' },
  openGraph: {
    title: 'SSF Contribution & Benefits Calculator | NepalHub',
    description: 'Calculate Nepal Social Security Fund contributions and projected benefits.',
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Nepal SSF Contribution Calculator',
    'description': 'Calculate SSF contributions (11% employee + 20% employer), projected benefits, medical insurance, accident insurance, maternity, and old age pension.',
    'url': 'https://nepalihub-omega.vercel.app/finance/ssf',
    'applicationCategory': 'BusinessApplication',
    'operatingSystem': 'Any',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'NPR'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SSFClient />
    </>
  );
}
