'use client';

import { useState } from 'react';
import { Smartphone, Wifi, Radio, Clock, ShoppingCart, Zap, Filter } from 'lucide-react';

interface DataPlan {
  provider: 'ntc' | 'ncell' | 'smart';
  name: string;
  data: string;
  validity: string;
  price: number;
  speed: '4G' | '5G';
  type: 'daily' | 'weekly' | 'monthly' | 'night' | 'social';
}

const PLANS: DataPlan[] = [
  // NTC (Nepal Telecom)
  { provider: 'ntc', name: 'NTC Data Pack 1GB Daily', data: '1 GB', validity: '1 day', price: 35, speed: '4G', type: 'daily' },
  { provider: 'ntc', name: 'NTC Data Pack 2GB Daily', data: '2 GB', validity: '1 day', price: 60, speed: '4G', type: 'daily' },
  { provider: 'ntc', name: 'NTC Data Pack 5GB Daily', data: '5 GB', validity: '1 day', price: 135, speed: '4G', type: 'daily' },
  { provider: 'ntc', name: 'NTC Weekly 5GB', data: '5 GB', validity: '7 days', price: 300, speed: '4G', type: 'weekly' },
  { provider: 'ntc', name: 'NTC Weekly 10GB', data: '10 GB', validity: '7 days', price: 500, speed: '4G', type: 'weekly' },
  { provider: 'ntc', name: 'NTC Monthly 10GB', data: '10 GB', validity: '30 days', price: 800, speed: '4G', type: 'monthly' },
  { provider: 'ntc', name: 'NTC Monthly 25GB', data: '25 GB', validity: '30 days', price: 1500, speed: '5G', type: 'monthly' },
  { provider: 'ntc', name: 'NTC Monthly 50GB', data: '50 GB', validity: '30 days', price: 2500, speed: '5G', type: 'monthly' },
  { provider: 'ntc', name: 'NTC Night Data 15GB', data: '15 GB', validity: '30 days (12am-7am)', price: 300, speed: '4G', type: 'night' },
  { provider: 'ntc', name: 'NTC Social Pack 500MB', data: '500 MB', validity: '1 day', price: 15, speed: '4G', type: 'social' },
  { provider: 'ntc', name: 'NTC Social Pack 3GB', data: '3 GB', validity: '7 days', price: 100, speed: '4G', type: 'social' },

  // Ncell
  { provider: 'ncell', name: 'Ncell Data Pack 1GB Daily', data: '1 GB', validity: '1 day', price: 30, speed: '4G', type: 'daily' },
  { provider: 'ncell', name: 'Ncell Data Pack 2GB Daily', data: '2 GB', validity: '1 day', price: 55, speed: '4G', type: 'daily' },
  { provider: 'ncell', name: 'Ncell Data Pack 5GB Daily', data: '5 GB', validity: '1 day', price: 125, speed: '4G', type: 'daily' },
  { provider: 'ncell', name: 'Ncell Weekly 7GB', data: '7 GB', validity: '7 days', price: 350, speed: '4G', type: 'weekly' },
  { provider: 'ncell', name: 'Ncell Weekly 15GB', data: '15 GB', validity: '7 days', price: 600, speed: '4G', type: 'weekly' },
  { provider: 'ncell', name: 'Ncell Monthly 15GB', data: '15 GB', validity: '30 days', price: 900, speed: '4G', type: 'monthly' },
  { provider: 'ncell', name: 'Ncell Monthly 30GB', data: '30 GB', validity: '30 days', price: 1600, speed: '5G', type: 'monthly' },
  { provider: 'ncell', name: 'Ncell Monthly 60GB', data: '60 GB', validity: '30 days', price: 2800, speed: '5G', type: 'monthly' },
  { provider: 'ncell', name: 'Ncell Night Data 20GB', data: '20 GB', validity: '30 days (12am-7am)', price: 350, speed: '4G', type: 'night' },
  { provider: 'ncell', name: 'Ncell Social Pack 500MB', data: '500 MB', validity: '1 day', price: 15, speed: '4G', type: 'social' },
  { provider: 'ncell', name: 'Ncell Social Pack 5GB', data: '5 GB', validity: '7 days', price: 120, speed: '4G', type: 'social' },

  // SmartCell
  { provider: 'smart', name: 'Smart Daily 1.5GB', data: '1.5 GB', validity: '1 day', price: 25, speed: '4G', type: 'daily' },
  { provider: 'smart', name: 'Smart Daily 3GB', data: '3 GB', validity: '1 day', price: 50, speed: '4G', type: 'daily' },
  { provider: 'smart', name: 'Smart Weekly 8GB', data: '8 GB', validity: '7 days', price: 300, speed: '4G', type: 'weekly' },
  { provider: 'smart', name: 'Smart Monthly 12GB', data: '12 GB', validity: '30 days', price: 700, speed: '4G', type: 'monthly' },
  { provider: 'smart', name: 'Smart Monthly 25GB', data: '25 GB', validity: '30 days', price: 1300, speed: '4G', type: 'monthly' },
];

const PROVIDERS: { id: string; label: string; color: string; bg: string }[] = [
  { id: 'ntc', label: 'Nepal Telecom (NTC)', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  { id: 'ncell', label: 'Ncell', color: 'text-red-500 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-950/30' },
  { id: 'smart', label: 'SmartCell', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
];

const TYPES = ['all', 'daily', 'weekly', 'monthly', 'night', 'social'];

export default function DataPlansClient() {
  const [providers, setProviders] = useState<string[]>(['ntc', 'ncell', 'smart']);
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'price' | 'data'>('price');

  const parseGB = (d: string) => {
    const n = parseFloat(d);
    return d.includes('MB') ? n / 1024 : n;
  };

  const filtered = PLANS
    .filter(p => providers.includes(p.provider))
    .filter(p => typeFilter === 'all' || p.type === typeFilter)
    .sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      return parseGB(b.data) - parseGB(a.data);
    });

  const providerColor = (p: string) => PROVIDERS.find(pr => pr.id === p)?.color || '';
  const providerBg = (p: string) => PROVIDERS.find(pr => pr.id === p)?.bg || '';

  const toggleProvider = (id: string) => {
    setProviders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Wifi className="h-7 w-7 text-cyan-500" />
          Mobile Data Plan Comparator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Compare data plans across Nepal Telecom, Ncell, and SmartCell. Find the cheapest plan for your needs.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-semibold text-gray-400 flex items-center gap-1">
            <Radio className="h-3.5 w-3.5" /> Provider
          </span>
          {PROVIDERS.map(pr => (
            <button key={pr.id} onClick={() => toggleProvider(pr.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                providers.includes(pr.id)
                  ? `${pr.bg} ${pr.color} border-current`
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-700'
              }`}>
              {pr.label}
            </button>
          ))}
          <span className="text-xs font-semibold text-gray-400 ml-2 flex items-center gap-1">
            <Filter className="h-3.5 w-3.5" /> Type
          </span>
          {TYPES.map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === t
                  ? 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700'
              }`}>
              {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <button onClick={() => setSortBy(sortBy === 'price' ? 'data' : 'price')}
            className="ml-auto flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700">
            <ShoppingCart className="h-3 w-3" />
            Sort by {sortBy === 'price' ? 'Data' : 'Price'}
          </button>
        </div>
      </div>

      {/* Best Value Summary */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Cheapest Plan', plan: [...filtered].sort((a, b) => a.price - b.price)[0] },
            { label: 'Best Value Daily', plan: [...filtered].filter(p => p.type === 'daily').sort((a, b) => parseGB(b.data)/b.price - parseGB(a.data)/a.price)[0] },
            { label: 'Best Value Monthly', plan: [...filtered].filter(p => p.type === 'monthly').sort((a, b) => parseGB(b.data)/b.price - parseGB(a.data)/a.price)[0] },
          ].filter(item => item.plan).map((item, i) => (
            <div key={i} className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 rounded-xl p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-green-500 mb-1">{item.label}</p>
              <p className="text-sm font-bold text-green-700 dark:text-green-300">{item.plan!.name}</p>
              <p className="text-xs text-green-600 dark:text-green-400">
                Rs. {item.plan!.price} — {item.plan!.data} — {item.plan!.validity}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Plans Table */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Plan</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Data</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Validity</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Price</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">GB/Rs</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase">Speed</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((plan, i) => {
                const gbPerRs = parseGB(plan.data) / plan.price;
                return (
                  <tr key={`${plan.provider}-${plan.name}`} className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${i < 3 ? 'bg-green-50/50 dark:bg-green-950/10' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${providerColor(plan.provider)}`}>
                          {plan.provider.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-700 dark:text-gray-300">{plan.name.replace(/^(NTC|Ncell|Smart)\s+/, '')}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-medium text-gray-800 dark:text-gray-200">{plan.data}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{plan.validity}</td>
                    <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-white text-xs">Rs. {plan.price}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs font-medium ${gbPerRs >= 0.02 ? 'text-green-600 dark:text-green-400' : 'text-gray-500'}`}>
                        {(gbPerRs * 1000).toFixed(1)} MB/Re
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${plan.speed === '5G' ? 'bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>
                        {plan.speed}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400 text-xs">Select a provider to see plans</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>⚠ Prices may vary</strong> — Data plans are updated based on published tariffs. Actual prices include VAT and may change without notice.
        Check with your provider for the latest offers.
      </div>
    </main>
  );
}
