import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'SIP Calculator Nepal — Mutual Fund Returns',
  description: 'Estimate maturity wealth and returns from Systematic Investment Plans (SIP) in mutual funds. Compound growth projection with interactive area chart.',
  keywords: ['sip calculator', 'mutual fund', 'investment', 'compound interest', 'sip returns', 'nepal mutual fund', 'systematic investment plan'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//finance/sip' },
  openGraph: {
    title: 'SIP Calculator — Mutual Fund Returns',
    description: 'Estimate maturity wealth from Systematic Investment Plans with compound growth projection.',
  },
};

export default function Page() { return <Client />; }
