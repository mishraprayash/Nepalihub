'use client';

import { useState } from 'react';
import { Smartphone, Laptop, Watch, Monitor, Camera, Headphones, Tablet, Info, ShoppingCart } from 'lucide-react';

interface GadgetConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  hsCode: string;
  customsDuty: number;  // percentage
  excise: number;       // excise duty %
  incomeTax: number;    // advance income tax %
  maxValue?: number;    // max value for special rate
}

const GADGETS: GadgetConfig[] = [
  { id: 'phone', label: 'Mobile Phone (Smartphone)', icon: <Smartphone className="h-5 w-5" />, hsCode: '8517.12', customsDuty: 10, excise: 5, incomeTax: 7, maxValue: 60000 },
  { id: 'laptop', label: 'Laptop / Notebook', icon: <Laptop className="h-5 w-5" />, hsCode: '8471.30', customsDuty: 5, excise: 0, incomeTax: 5 },
  { id: 'tablet', label: 'Tablet / iPad', icon: <Tablet className="h-5 w-5" />, hsCode: '8471.41', customsDuty: 5, excise: 0, incomeTax: 5 },
  { id: 'smartwatch', label: 'Smart Watch', icon: <Watch className="h-5 w-5" />, hsCode: '9102.12', customsDuty: 10, excise: 0, incomeTax: 5 },
  { id: 'camera', label: 'Camera (DSLR/Mirrorless)', icon: <Camera className="h-5 w-5" />, hsCode: '8525.80', customsDuty: 10, excise: 0, incomeTax: 5 },
  { id: 'headphone', label: 'Headphones / Earphones', icon: <Headphones className="h-5 w-5" />, hsCode: '8518.30', customsDuty: 10, excise: 0, incomeTax: 5 },
  { id: 'monitor', label: 'Monitor (Desktop)', icon: <Monitor className="h-5 w-5" />, hsCode: '8528.52', customsDuty: 5, excise: 0, incomeTax: 5 },
];

const COUNTRY_ORIGIN = [
  { id: 'china', label: 'China / Hong Kong', prefRate: 0.9 },
  { id: 'india', label: 'India (SAFTA)', prefRate: 0.7 },
  { id: 'usa', label: 'USA / Europe', prefRate: 1.0 },
  { id: 'uae', label: 'UAE / Middle East', prefRate: 1.0 },
  { id: 'others', label: 'Other Countries', prefRate: 1.0 },
];

export default function ImportDutyClient() {
  const [gadgetId, setGadgetId] = useState('phone');
  const [price, setPrice] = useState('50000');
  const [origin, setOrigin] = useState('china');
  const [shipping, setShipping] = useState('2000');

  const gadget = GADGETS.find(g => g.id === gadgetId) || GADGETS[0];
  const originData = COUNTRY_ORIGIN.find(c => c.id === origin) || COUNTRY_ORIGIN[0];
  const fobPrice = parseFloat(price) || 0;
  const shippingCost = parseFloat(shipping) || 0;
  const cifValue = fobPrice + shippingCost; // Cost, Insurance, Freight

  // Assessable value = CIF (simplified)
  const assessable = cifValue;

  // Customs duty (with preferential rate based on origin)
  const dutyRate = gadget.customsDuty * originData.prefRate;
  const customsDutyAmount = assessable * dutyRate / 100;

  // Excise duty on (assessable + customs duty)
  const exciseBase = assessable + customsDutyAmount;
  const exciseAmount = gadget.excise > 0 ? exciseBase * gadget.excise / 100 : 0;

  // Income tax on (assessable + customs duty + excise)
  const incomeTaxBase = assessable + customsDutyAmount + exciseAmount;
  const incomeTaxAmount = incomeTaxBase * gadget.incomeTax / 100;

  // VAT (13%) on (assessable + customs duty + excise + income tax)
  const vatBase = assessable + customsDutyAmount + exciseAmount + incomeTaxAmount;
  const vatAmount = vatBase * 0.13;

  // Total duties and taxes
  const totalDuties = customsDutyAmount + exciseAmount + incomeTaxAmount + vatAmount;
  const totalLanded = fobPrice + shippingCost + totalDuties;

  const format = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n);

  const perc = (amount: number) => ((amount / fobPrice) * 100).toFixed(1);

  // Determine if phone is eligible for concessional rate (under Rs 60,000)
  const phoneConcession = gadget.id === 'phone' && fobPrice <= (gadget.maxValue || 60000);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <ShoppingCart className="h-7 w-7 text-indigo-500" />
          Gadget Import Duty & Tax Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Calculate total landed cost including customs duty, excise, income tax, and VAT for importing electronics into Nepal.
        </p>
      </div>

      {/* Gadget Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {GADGETS.map(g => (
          <button
            key={g.id}
            onClick={() => setGadgetId(g.id)}
            className={`flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-medium transition-all ${
              gadgetId === g.id
                ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            {g.icon}
            <span className="text-center leading-tight">{g.label.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Purchase Price (FOB, NPR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rs.</span>
              <input type="number" value={price} onChange={e => setPrice(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Shipping & Insurance (NPR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rs.</span>
              <input type="number" value={shipping} onChange={e => setShipping(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Country of Origin</label>
          <div className="flex gap-2 flex-wrap">
            {COUNTRY_ORIGIN.map(c => (
              <button key={c.id} onClick={() => setOrigin(c.id)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                  origin === c.id
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Concessional rate notice for phones */}
      {phoneConcession && (
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-2xl p-4 text-sm text-green-700 dark:text-green-300">
          <strong>ℹ Smartphone Concession:</strong> Phones under Rs 60,000 qualify for reduced customs duty (5% instead of 10%).
        </div>
      )}

      {/* Duty Breakdown */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Duties & Taxes Breakdown</h2>
        </div>
        <div className="px-5 pb-1 space-y-0">
          {[
            { label: 'CIF Value (Cost + Insurance + Freight)', amount: cifValue, col: 'text-gray-900 dark:text-white' },
            { label: `Customs Duty (${(dutyRate).toFixed(1)}%${originData.prefRate < 1 ? ` — ${originData.label} preferential` : ''})`, amount: customsDutyAmount, col: 'text-blue-600 dark:text-blue-400' },
            ...(gadget.excise > 0 ? [{ label: `Excise Duty (${gadget.excise}%)`, amount: exciseAmount, col: 'text-purple-600 dark:text-purple-400' as const }] : []),
            { label: `Advance Income Tax (${gadget.incomeTax}%)`, amount: incomeTaxAmount, col: 'text-amber-600 dark:text-amber-400' },
            { label: 'VAT (13%)', amount: vatAmount, col: 'text-emerald-600 dark:text-emerald-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-900 last:border-0">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`text-sm font-semibold ${item.col}`}>{format(item.amount)}</span>
            </div>
          ))}
        </div>
        <div className="p-5 bg-indigo-50 dark:bg-indigo-950/20 border-t border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Total Duties & Taxes</span>
            <span className="text-lg font-bold text-indigo-700 dark:text-indigo-300">{format(totalDuties)}</span>
          </div>
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-indigo-200 dark:border-indigo-800/50">
            <span className="text-sm font-bold text-indigo-800 dark:text-indigo-200">Total Landed Cost</span>
            <span className="text-xl font-bold text-indigo-800 dark:text-indigo-200">{format(totalLanded)}</span>
          </div>
          <p className="text-xs text-indigo-500 dark:text-indigo-400 mt-1">
            Total duty = {totalDuties > 0 ? perc(totalDuties) : '0'}% of FOB price
          </p>
        </div>
      </div>

      {/* HS Code Reference */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Info className="h-4 w-4 text-indigo-500" />
          How Import Duties are Calculated
        </h3>
        <p>Based on Nepal Customs Tariff Act and current Finance Act (FY 2081/82):</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>CIF Value:</strong> Cost + Insurance + Freight — the base for all calculations</li>
          <li><strong>Customs Duty:</strong> Varies by HS code (5-20% for electronics). India/SAFTA products get preferential rates</li>
          <li><strong>Excise Duty:</strong> Only applies to certain items (mobile phones: 5%)</li>
          <li><strong>Income Tax:</strong> Advance income tax at import point (5-7%)</li>
          <li><strong>VAT:</strong> 13% on the total of all above</li>
        </ul>
        <p className="text-xs mt-2">HS Code: {gadget.hsCode} — {gadget.label}. Source: Nepal Customs (customs.gov.np).</p>
      </div>
    </main>
  );
}
