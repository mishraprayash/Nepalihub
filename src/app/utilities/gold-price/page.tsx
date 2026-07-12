import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Live Gold Price Nepal & Jewelry Value Estimator',
  description: 'Get today\'s live gold price in Nepal (FENEGOSIDA). Estimate gold and silver jewelry value based on weight in Tola/Lal, purity, and making charges.',
  keywords: ['gold price nepal today', 'gold rate nepal', 'tola gold price', 'nepal gold rate', 'jewelry value calculator', 'tejabi gold', 'hallmarked gold price nepal'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app/utilities/gold-price' },
  openGraph: {
    title: 'Live Gold Price Nepal & Jewelry Value Estimator',
    description: 'Get today\'s live gold price in Nepal (FENEGOSIDA). Estimate gold and silver jewelry value based on weight in Tola/Lal, purity, and making charges.',
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Live Gold Price Nepal & Jewelry Calculator',
    'description': 'Live gold price updates for Nepal and a tool to calculate jewelry valuation based on Tola, Lal, purity, and making charges.',
    'url': 'https://nepalihub-omega.vercel.app/utilities/gold-price',
    'applicationCategory': 'FinanceApplication',
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
      <Client />
    </>
  );
}
