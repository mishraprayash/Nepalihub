import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'Vehicle Road Tax Estimator Nepal — DOTM Rates',
  description: 'Estimate annual road tax and registration renewal fees for motorcycles, cars, and EVs in Nepal based on DOTM rates by CC/kW classification.',
  keywords: ['road tax nepal', 'vehicle tax', 'dotm tax', 'bike tax', 'car tax', 'ev tax', 'nepal vehicle registration', 'yatayat tax'],
  alternates: { canonical: 'https://nepalihub-omega.vercel.app//vehicle/road-tax' },
  openGraph: {
    title: 'Vehicle Road Tax Estimator',
    description: 'Estimate annual road tax for bikes, cars, and EVs based on DOTM rates.',
  },
};

export default function Page() { return <Client />; }
