import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Gold Price & Jewelry Value Estimator Nepal',
  description: 'Estimate the value of gold/silver jewelry based on live gold rates, weight (Tola/Lal), purity (24k/22k), and making charges. Updated via CoinGecko API.',
  keywords: ['gold price nepal', 'gold rate', 'tola gold', 'jewelry value', 'gold calculator', 'silver price', 'tejabi gold', 'hallmarked gold'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//utilities/gold-price' },
  openGraph: {
    title: 'Gold Price & Jewelry Value Estimator',
    description: 'Estimate gold/silver jewelry value based on live rates, weight, and purity.',
  },
};

export default function Page() { return <Client />; }
