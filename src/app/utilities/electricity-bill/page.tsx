import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'NEA Electricity Bill Calculator Nepal — 2083 Tariff',
  description: 'Estimate your monthly NEA electricity bill with 2083 tariff (5% concessional VAT) and 2080 legacy tariff. Supports 5A, 15A, 30A, 60A connections.',
  keywords: ['nea bill', 'electricity bill', 'nea tariff', 'nepal electricity', 'light bill calculator', 'nea 2083', 'vattar'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//utilities/electricity-bill' },
  openGraph: {
    title: 'NEA Electricity Bill Calculator',
    description: 'Estimate monthly NEA bill with 2083 tariff and concessional VAT rates.',
  },
};

export default function Page() { return <Client />; }
