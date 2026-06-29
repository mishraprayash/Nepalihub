import type { Metadata } from 'next';
import ConstructionCostClient from './Client';

export const metadata: Metadata = {
  title: 'House Construction Cost Estimator Nepal — Per Sq.Ft Cost',
  description: 'Estimate house construction cost per square foot in Nepal. Compare RCC, load-bearing, and prefab costs by city. Updated material rates for FY 2081/82.',
  keywords: ['construction cost nepal', 'house building cost', 'per sq ft cost', 'rcc construction', 'nepal house construction', 'building estimate', 'contractor rate'],
  alternates: { canonical: 'https://nepalihub.com/real-estate/construction-cost' },
  openGraph: {
    title: 'House Construction Cost Estimator | NepalHub',
    description: 'Estimate construction cost per sq ft by city and building type.',
  },
};

export default function Page() { return <ConstructionCostClient />; }
