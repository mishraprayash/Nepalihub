import { Metadata } from 'next';
import IncomeTaxClient from './IncomeTaxClient';

export const metadata: Metadata = {
  title: 'Nepal Income Tax Calculator (FY 2080/81 & 2081/82)',
  description: 'Calculate your annual & monthly income tax slab, social security contribution (SSF), CIT deductions, and net take-home salary instantly.',
  keywords: ['nepal tax calculator', 'salary tax nepal', 'income tax slab nepal', 'ssf calculator nepal', 'cit deduction nepal'],
  alternates: {
    canonical: 'https://nepalihub.com/finance/income-tax'
  }
};

export default function IncomeTaxPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FinancialCalculator',
    'name': 'Nepal Income Tax Calculator',
    'description': 'Calculate annual & monthly income tax slab, social security contributions, CIT deductions, and net take-home salary under current Nepal IRD rules.',
    'url': 'https://nepalihub.com/finance/income-tax',
    'category': 'Finance'
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
