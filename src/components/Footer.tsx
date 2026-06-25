import Link from 'next/link';
import { Landmark } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-12 mt-auto transition-colors duration-200 print:hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-red-600 dark:text-red-500">
              <Landmark className="h-6 w-6" />
              <span>Nepal<span className="text-blue-600 dark:text-blue-400">Hub</span></span>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The definitive platform for Nepal-specific calculators, converters, and digital utilities. Built for speed, precision, and mobile usability.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Finance & Banking</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/finance/income-tax" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Income Tax Calculator</Link></li>
              <li><Link href="/finance/emi" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Loan EMI Calculator</Link></li>
              <li><Link href="/finance/sip" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">SIP Return Estimator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Utilities & Land</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/real-estate/land-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Nepali Land Converter</Link></li>
              <li><Link href="/utilities/electricity-bill" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">NEA Electricity Bill</Link></li>
              <li><Link href="/utilities/gold-price" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gold Price Estimator</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Daily Life & Docs</h3>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link href="/daily/age" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Age Calculator</Link></li>
              <li><Link href="/documents/passport-photo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Passport Photo Cropper</Link></li>
              <li><Link href="/documents/invoice-generator" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Invoice Generator</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <p>© {currentYear} NepalHub. All rights reserved. Built with love for Nepal.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
