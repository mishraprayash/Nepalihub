import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Nepali Land Unit Converter — Ropani, Bigha, Sq.Ft',
  description: 'Convert between traditional Nepali land units (Ropani, Aana, Paisa, Daam, Bigha, Kattha, Dhur) and Sq. Ft/Sq. M/Acre/Hectare instantly.',
  keywords: ['nepali land converter', 'ropani to square feet', 'bigha to kattha', 'land measurement nepal', 'aana paisa', 'nepal land area'],
  alternates: { canonical: 'https://nepalihub.com/real-estate/land-converter' },
  openGraph: {
    title: 'Nepali Land Unit Converter',
    description: 'Convert between Ropani, Aana, Bigha, Kattha and Sq. Ft, Sq. M, Acre.',
  },
};

export default function Page() { return <Client />; }
