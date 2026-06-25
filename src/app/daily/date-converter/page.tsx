import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Nepali ↔ English Date Converter (BS to AD)',
  description: 'Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars instantly. Supports years 1978–2099 BS with full lookup table.',
  keywords: ['nepali date converter', 'bs to ad', 'ad to bs', 'bikram sambat', 'gregorian', 'nepali calendar converter'],
  alternates: { canonical: 'https://nepalihub.com/daily/date-converter' },
  openGraph: {
    title: 'Nepali ↔ English Date Converter',
    description: 'Convert dates between Bikram Sambat (BS) and Gregorian (AD) calendars instantly.',
  },
};

export default function Page() { return <Client />; }
