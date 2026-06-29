'use client';

import { useState } from 'react';
import { Car, Bike, Zap, Info, Shield, FileText, ArrowRight } from 'lucide-react';

const VEHICLE_TYPES = [
  { id: 'motorcycle', label: 'Motorcycle / Scooter', icon: <Bike className="h-5 w-5" /> },
  { id: 'car', label: 'Car / Jeep / Van', icon: <Car className="h-5 w-5" /> },
  { id: 'ev', label: 'Electric Vehicle (EV)', icon: <Zap className="h-5 w-5" /> },
] as const;

// Road tax rates (annual) based on DOTM Nepal
const ROAD_TAX: Record<string, Record<string, number>> = {
  motorcycle: {
    'upto-125': 2500, '126-250': 5000, '250plus': 8000,
  },
  car: {
    'upto-1000': 15000, '1001-1500': 28000, '1501-2000': 40000, '2001-3000': 55000, '3000plus': 80000,
  },
  ev: {
    'upto-50': 1000, '51-100': 3000, '101-200': 5000, '201plus': 8000,
  },
};

const CC_OPTIONS: Record<string, { value: string; label: string }[]> = {
  motorcycle: [
    { value: 'upto-125', label: 'Up to 125 cc' },
    { value: '126-250', label: '126 – 250 cc' },
    { value: '250plus', label: 'Above 250 cc' },
  ],
  car: [
    { value: 'upto-1000', label: 'Up to 1000 cc' },
    { value: '1001-1500', label: '1001 – 1500 cc' },
    { value: '1501-2000', label: '1501 – 2000 cc' },
    { value: '2001-3000', label: '2001 – 3000 cc' },
    { value: '3000plus', label: 'Above 3000 cc' },
  ],
  ev: [
    { value: 'upto-50', label: 'Up to 50 kW' },
    { value: '51-100', label: '51 – 100 kW' },
    { value: '101-200', label: '101 – 200 kW' },
    { value: '201plus', label: 'Above 200 kW' },
  ],
};

export default function VehiclePriceClient() {
  const [type, setType] = useState<'motorcycle' | 'car' | 'ev'>('car');
  const [cc, setCc] = useState('1001-1500');
  const [exShowroom, setExShowroom] = useState('5000000');

  const ccOpts = CC_OPTIONS[type] || [];
  // Reset cc if current not in options
  if (!ccOpts.find(o => o.value === cc)) setCc(ccOpts[0]?.value || '');

  const exPrice = parseFloat(exShowroom) || 0;
  const annualTax = ROAD_TAX[type]?.[cc] || 0;

  // Approximate rates (Nepal insurance + registration)
  const insuranceRate = type === 'motorcycle' ? 0.015 : type === 'ev' ? 0.01 : 0.025;
  const insurance = exPrice * insuranceRate;
  const registrationFee = type === 'motorcycle' ? 1500 : type === 'ev' ? 3000 : 5000;
  const numberPlate = type === 'motorcycle' ? 500 : 1500;
  const transportFee = type === 'motorcycle' ? 500 : 2000;

  // One-time tax (varies by type, approx)
  const oneTimeTaxRate = type === 'motorcycle' ? 0.05 : type === 'ev' ? 0.01 : 0.08;
  const oneTimeTax = exPrice * oneTimeTaxRate;

  const totalOnRoad = exPrice + insurance + registrationFee + numberPlate + transportFee + oneTimeTax;

  const format = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Car className="h-7 w-7 text-orange-500" />
          Vehicle On-Road Price Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Calculate the total on-road price including ex-showroom, insurance, registration, road tax, and number plate.
        </p>
      </div>

      {/* Vehicle Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {VEHICLE_TYPES.map(vt => (
          <button
            key={vt.id}
            onClick={() => { setType(vt.id as typeof type); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              type === vt.id
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                : 'bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            {vt.icon} {vt.label}
          </button>
        ))}
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Ex-Showroom Price (NPR)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rs.</span>
            <input type="number" value={exShowroom} onChange={e => setExShowroom(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Engine / Motor Capacity</label>
          <select value={cc} onChange={e => setCc(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500">
            {ccOpts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400">Cost Breakdown</h2>
        </div>
        <div className="px-5 pb-5 space-y-0">
          {[
            { label: 'Ex-Showroom Price', amount: exPrice, color: 'text-gray-900 dark:text-white' },
            { label: 'Insurance (first year)', amount: insurance, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'Registration Fee', amount: registrationFee, color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Number Plate', amount: numberPlate, color: 'text-purple-600 dark:text-purple-400' },
            { label: 'Transport / Delivery', amount: transportFee, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'One-Time Vehicle Tax', amount: oneTimeTax, color: 'text-red-600 dark:text-red-400' },
            { label: 'Annual Road Tax (year 1)', amount: annualTax, color: 'text-orange-600 dark:text-orange-400' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-900 last:border-0">
              <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
              <span className={`text-sm font-semibold ${item.color}`}>{format(item.amount)}</span>
            </div>
          ))}
        </div>
        <div className="p-5 bg-orange-50 dark:bg-orange-950/20 border-t border-orange-100 dark:border-orange-900/30">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-orange-700 dark:text-orange-300">Total On-Road Price</span>
            <span className="text-xl font-bold text-orange-700 dark:text-orange-300">{format(totalOnRoad)}</span>
          </div>
          <p className="text-xs text-orange-500 dark:text-orange-400 mt-1">
            Ex-showroom + {(((totalOnRoad - exPrice) / exPrice) * 100).toFixed(1)}% additional costs
          </p>
        </div>
      </div>

      {/* Reference */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Info className="h-4 w-4 text-orange-500" />
          How On-Road Price is Calculated
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Ex-Showroom:</strong> Base price set by the manufacturer/dealer</li>
          <li><strong>Insurance:</strong> ~1.5-2.5% of ex-showroom (comprehensive, first year compulsory)</li>
          <li><strong>Registration:</strong> DOTM registration fee (one-time)</li>
          <li><strong>One-Time Tax:</strong> Varies by vehicle type and cc (approx 5-8% for ICE, ~1% for EVs)</li>
          <li><strong>Road Tax:</strong> Annual renewal fee based on DOTM rates (shown for year 1)</li>
        </ul>
        <p className="text-xs mt-2">
          Rates are approximate. Actual costs vary by dealer, insurance company, and DOTM classification.
          Source: DOTM Nepal, Beema Samiti, and dealer estimates for FY 2081/82.
        </p>
      </div>
    </main>
  );
}
