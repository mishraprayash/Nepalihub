import { Metadata } from 'next';
import Client from './Client';

export const metadata: Metadata = {
  title: 'IRD-compliant Invoice Generator Nepal — VAT/PAN',
  description: 'Generate professional IRD-compliant tax invoices with dual-language headers, VAT/exempt split, dual signatures, PAN box, logo upload, 5 color themes, print-to-PDF.',
  keywords: ['invoice generator nepal', 'ird invoice', 'vat bill', 'pan number', 'tax invoice', 'nepal business invoice', 'receipt generator'],
  alternates: { canonical: 'https://nepalihub.com/documents/invoice-generator' },
  openGraph: {
    title: 'IRD Invoice Generator',
    description: 'Generate IRD-compliant tax invoices with VAT, PAN, dual-language, and print-to-PDF.',
  },
};

export default function Page() { return <Client />; }
