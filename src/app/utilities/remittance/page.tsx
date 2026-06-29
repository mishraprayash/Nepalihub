import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Remittance & Forex Calculator Nepal — Live Exchange Rates',
  description: 'Convert 166 foreign currencies to Nepalese Rupee (NPR) with live exchange rates. Supports USD, EUR, GBP, AUD, SAR, AED, JPY, KRW and more. Free API.',
  keywords: ['remittance nepal', 'forex nepal', 'currency converter', 'npr exchange rate', 'usd to npr', 'aed to npr', 'sar to npr', 'money transfer'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//utilities/remittance' },
  openGraph: {
    title: 'Remittance & Forex Calculator',
    description: 'Convert 166 currencies to NPR with live exchange rates. Free forex calculator.',
  },
};

export default function Page() { return <Client />; }
