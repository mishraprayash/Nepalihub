import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Preeti to Unicode Converter & Nepali Transliteration',
  description: 'Convert Preeti font text to standard Nepali Unicode. Romanized English to Nepali transliteration using Google Input Tools. Free online tool.',
  keywords: ['preeti to unicode', 'nepali unicode', 'nepali typing', 'romanized nepali', 'unicode converter', 'preeti font', 'nepali font converter'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//utilities/unicode-converter' },
  openGraph: {
    title: 'Preeti to Unicode Converter',
    description: 'Convert Preeti font to Nepali Unicode. Romanized English to Nepali transliteration.',
  },
};

export default function Page() { return <Client />; }
