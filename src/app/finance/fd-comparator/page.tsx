import type { Metadata } from 'next';
import FDComparatorClient from './Client';

export const metadata: Metadata = {
  title: 'Bank FD Rate Comparator Nepal — Compare 23+ Banks',
  description: 'Compare fixed deposit interest rates across 23+ Nepali commercial banks, development banks, and finance companies. Calculate maturity amount and interest earned with latest rates.',
  keywords: ['fd rate', 'fixed deposit', 'bank fd nepal', 'fd comparator', 'best fd rate', 'bank interest rate', 'nepal bank fd', 'senior citizen fd'],
  alternates: { canonical: 'https://nepalihub.com/finance/fd-comparator' },
  openGraph: {
    title: 'Bank FD Rate Comparator | NepalHub',
    description: 'Compare FD rates across 23+ Nepali banks. Calculate maturity and interest earned.',
  },
};

export default function Page() { return <FDComparatorClient />; }
