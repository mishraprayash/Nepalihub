import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'NEPSE Stock Profit & Loss Calculator',
  description: 'Calculate exact profit/loss from NEPSE trades including brokerage (0.40–0.27%), SEBO fee (0.015%), DP charges, and Capital Gains Tax (5%, 7.5%, 10%).',
  keywords: ['nepse calculator', 'stock profit', 'share calculator', 'capital gains tax nepal', 'brokerage fee', 'trading profit loss', 'nepal stock'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//finance/stock-calculator' },
  openGraph: {
    title: 'NEPSE Stock Profit & Loss Calculator',
    description: 'Calculate exact profit/loss from NEPSE trades including all fees and capital gains tax.',
  },
};

export default function Page() { return <Client />; }
