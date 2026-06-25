import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Loan EMI Calculator Nepal — Home & Auto Loan',
  description: 'Calculate monthly EMI payments, total interest, and view full amortization schedule for home loans, auto loans, and personal loans with Nepal-specific interest rates.',
  keywords: ['emi calculator', 'loan calculator', 'home loan', 'auto loan', 'amortization', 'monthly payment', 'nepal loan', 'bank loan'],
  alternates: { canonical: 'https://nepalihub.com/finance/emi' },
  openGraph: {
    title: 'Loan EMI Calculator',
    description: 'Calculate monthly EMI, total interest, and view full amortization schedule.',
  },
};

export default function Page() { return <Client />; }
