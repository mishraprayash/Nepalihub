import type { Metadata } from 'next';
import VehiclePriceClient from './Client';

export const metadata: Metadata = {
  title: 'Vehicle On-Road Price Calculator Nepal — Car, Bike, EV',
  description: 'Calculate the total on-road price for cars, motorcycles, and EVs in Nepal including ex-showroom, insurance, registration, road tax, number plate, and delivery fees.',
  keywords: ['on road price nepal', 'car price nepal', 'bike price nepal', 'ev price nepal', 'vehicle cost', 'ex showroom price', 'road tax', 'insurance'],
  alternates: { canonical: 'https://nepalihub.com/vehicle/onroad-price' },
  openGraph: {
    title: 'Vehicle On-Road Price Calculator | NepalHub',
    description: 'Calculate total on-road price for cars, bikes, and EVs in Nepal.',
  },
};

export default function Page() { return <VehiclePriceClient />; }
