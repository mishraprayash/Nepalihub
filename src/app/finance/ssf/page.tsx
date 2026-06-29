import type { Metadata } from 'next';
import SSFClient from './Client';

export const metadata: Metadata = {
  title: 'SSF Contribution & Benefits Calculator — Nepal Social Security Fund',
  description: 'Calculate SSF contributions (11% employee + 21% employer), projected benefits, medical insurance, accident insurance, maternity, and old age pension. Latest FY 2081/82 rates.',
  keywords: ['ssf', 'social security fund', 'ssf calculator', 'ssf contribution', 'nepal ssf', 'pension calculator', 'employee contribution', 'employer contribution', 'social security nepal'],
  alternates: { canonical: 'https://nepalihub.com/finance/ssf' },
  openGraph: {
    title: 'SSF Contribution & Benefits Calculator | NepalHub',
    description: 'Calculate Nepal Social Security Fund contributions and projected benefits.',
  },
};

export default function Page() { return <SSFClient />; }
