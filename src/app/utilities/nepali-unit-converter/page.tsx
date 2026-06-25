import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Nepali Unit Converter — Tola, Pau, Dharni, Mana, Pathi',
  description: 'Convert between traditional Nepali units and metric: Tola, Pau, Dharni (weight), Mana, Pathi, Muri (volume), Bitta, Haat, Kosh (length), and land units.',
  keywords: ['nepali unit converter', 'tola to gram', 'pau to kg', 'dharni', 'mana pathi', 'nepali weight', 'nepali volume', 'bitta haat'],
  alternates: { canonical: 'https://nepalihub.com/utilities/nepali-unit-converter' },
  openGraph: {
    title: 'Nepali Unit Converter',
    description: 'Convert Tola, Pau, Dharni, Mana, Pathi, Bitta, Haat to metric units.',
  },
};

export default function Page() { return <Client />; }
