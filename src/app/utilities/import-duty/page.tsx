import type { Metadata } from 'next';
import ImportDutyClient from './Client';

export const metadata: Metadata = {
  title: 'Gadget Import Duty & Tax Calculator Nepal — Customs Duty',
  description: 'Calculate total landed cost for importing phones, laptops, tablets, cameras to Nepal. Customs duty, excise, income tax, and VAT based on HS code and country of origin.',
  keywords: ['import duty nepal', 'customs duty', 'gadget import', 'phone import tax', 'laptop customs', 'landed cost', 'hs code', 'nepal customs'],
  alternates: { canonical: 'https://nepalihub.com/utilities/import-duty' },
  openGraph: {
    title: 'Gadget Import Duty Calculator | NepalHub',
    description: 'Calculate total landed cost for importing electronics to Nepal with current customs rates.',
  },
};

export default function Page() { return <ImportDutyClient />; }
