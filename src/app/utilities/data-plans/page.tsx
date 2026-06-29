import type { Metadata } from 'next';
import DataPlansClient from './Client';

export const metadata: Metadata = {
  title: 'Mobile Data Plan Comparator Nepal — NTC, Ncell, SmartCell',
  description: 'Compare mobile data plans across Nepal Telecom, Ncell, and SmartCell. Find the cheapest plan by price, data volume, or value per rupee. Compare 4G/5G plans.',
  keywords: ['mobile data', 'ntc data pack', 'ncell data pack', 'smart cell', 'nepal telecom', 'data plan', 'cheap data nepal', '4g nepal', '5g nepal'],
  alternates: { canonical: 'https://nepalihub.com/utilities/data-plans' },
  openGraph: {
    title: 'Mobile Data Plan Comparator | NepalHub',
    description: 'Compare NTC, Ncell, and SmartCell data plans. Find cheapest by price or best value.',
  },
};

export default function Page() { return <DataPlansClient />; }
