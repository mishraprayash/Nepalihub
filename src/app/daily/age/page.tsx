import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Age Calculator & Birthday Countdown',
  description: 'Calculate your exact age in years, months, and days. Find day-of-week of birth, time until next birthday, and date duration between any two dates.',
  keywords: ['age calculator', 'birthday', 'date difference', 'days count', 'nepali age', 'age in years months days'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//daily/age' },
  openGraph: {
    title: 'Age Calculator & Birthday Countdown',
    description: 'Calculate your exact age in years, months, and days. Find day-of-week of birth and next birthday countdown.',
  },
};

export default function Page() { return <Client />; }
