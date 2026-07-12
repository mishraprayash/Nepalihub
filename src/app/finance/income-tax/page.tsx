import { Metadata } from 'next';
import IncomeTaxClient from './IncomeTaxClient';

export const metadata: Metadata = {
  title: 'Nepal Income Tax Calculator (Latest FY 2083/84)',
  description: 'Calculate your annual & monthly income tax slab, social security contribution (SSF), CIT deductions, and net take-home salary instantly in Nepal.',
  keywords: ['nepal tax calculator', 'salary tax nepal', 'income tax slab nepal', 'ssf calculator nepal', 'cit deduction nepal', 'take home salary calculator nepal'],
  alternates: {
    canonical: 'https://nepalihub-omega.vercel.app/finance/income-tax'
  }
};

export default function IncomeTaxPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Nepal Income Tax Calculator',
    'description': 'Calculate annual & monthly income tax slab, social security contributions, CIT deductions, and net take-home salary under current Nepal IRD rules.',
    'url': 'https://nepalihub-omega.vercel.app/finance/income-tax',
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
      <IncomeTaxClient />
    </>
  );
}
