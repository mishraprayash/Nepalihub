import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Nepali Rashifal (राशिफल) — Daily Horoscope',
  description: 'Get your daily Nepali rashifal (horoscope) with live astrology API. Find your Rashi based on BS date of birth. Covers Mesha to Meena (Aries to Pisces).',
  keywords: ['rashifal', 'nepali rashifal', 'nepali horoscope', 'rashi', 'daily rashifal', 'nepali zodiac', 'aries mesha', 'taurus vrishabha'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//daily/rashifal' },
  openGraph: {
    title: 'Nepali Rashifal (राशिफल) — Daily Horoscope',
    description: 'Get your daily Nepali rashifal with live astrology data. Find your Rashi and daily predictions.',
  },
};

export default function Page() { return <Client />; }
