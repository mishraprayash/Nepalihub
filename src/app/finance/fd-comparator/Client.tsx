'use client';

import { useState, useMemo } from 'react';
import { Building2, TrendingUp, Filter, SortAsc, ChevronDown, ChevronUp } from 'lucide-react';

interface BankRate {
  name: string;
  type: 'commercial' | 'development' | 'finance';
  individual: number;  // FD rate %
  senior: number;      // Senior citizen rate %
  regularSaving: number;
}

const BANKS: BankRate[] = [
  // Commercial Banks
  { name: 'Nepal Bank Ltd.', type: 'commercial', individual: 6.5, senior: 7.0, regularSaving: 4.0 },
  { name: 'Rastriya Banijya Bank', type: 'commercial', individual: 6.75, senior: 7.25, regularSaving: 4.25 },
  { name: 'Nabil Bank', type: 'commercial', individual: 6.0, senior: 6.5, regularSaving: 3.5 },
  { name: 'Himalayan Bank', type: 'commercial', individual: 6.1, senior: 6.6, regularSaving: 3.75 },
  { name: 'NIC Asia Bank', type: 'commercial', individual: 6.75, senior: 7.5, regularSaving: 4.0 },
  { name: 'Global IME Bank', type: 'commercial', individual: 7.0, senior: 7.5, regularSaving: 4.25 },
  { name: 'Prabhu Bank', type: 'commercial', individual: 7.25, senior: 7.75, regularSaving: 4.5 },
  { name: 'Siddhartha Bank', type: 'commercial', individual: 6.5, senior: 7.0, regularSaving: 4.0 },
  { name: 'Everest Bank', type: 'commercial', individual: 6.25, senior: 6.75, regularSaving: 3.75 },
  { name: 'Sanima Bank', type: 'commercial', individual: 6.5, senior: 7.0, regularSaving: 3.75 },
  { name: 'Machhapuchhre Bank', type: 'commercial', individual: 6.75, senior: 7.25, regularSaving: 4.0 },
  { name: 'Kumari Bank', type: 'commercial', individual: 6.5, senior: 7.0, regularSaving: 3.75 },
  { name: 'Citizens Bank', type: 'commercial', individual: 6.75, senior: 7.5, regularSaving: 4.0 },
  { name: 'Laxmi Sunrise Bank', type: 'commercial', individual: 6.25, senior: 6.75, regularSaving: 3.5 },
  { name: 'NMB Bank', type: 'commercial', individual: 6.5, senior: 7.0, regularSaving: 3.75 },
  { name: 'Agriculture Development Bank', type: 'commercial', individual: 7.0, senior: 7.5, regularSaving: 4.5 },
  // Development Banks
  { name: 'Corporate Development Bank', type: 'development', individual: 7.5, senior: 8.0, regularSaving: 5.0 },
  { name: 'Saptakoshi Development Bank', type: 'development', individual: 8.0, senior: 8.5, regularSaving: 5.25 },
  { name: 'Lumbini Development Bank', type: 'development', individual: 7.75, senior: 8.25, regularSaving: 5.0 },
  // Finance Companies
  { name: 'Best Finance', type: 'finance', individual: 8.5, senior: 9.0, regularSaving: 6.0 },
  { name: 'Progressive Finance', type: 'finance', individual: 9.0, senior: 9.5, regularSaving: 6.5 },
  { name: 'Central Finance', type: 'finance', individual: 8.75, senior: 9.25, regularSaving: 6.25 },
  { name: 'Pokhara Finance', type: 'finance', individual: 9.0, senior: 9.5, regularSaving: 6.5 },
];

const DEPOSIT_AMOUNTS = [100000, 500000, 1000000, 5000000, 10000000];
const TERMS = [3, 6, 12, 24, 36, 60];

export default function FDComparatorClient() {
  const [amount, setAmount] = useState(500000);
  const [term, setTerm] = useState(12);
  const [filter, setFilter] = useState<'all' | 'commercial' | 'development' | 'finance'>('all');
  const [sortBy, setSortBy] = useState<'rate' | 'name'>('rate');
  const [senior, setSenior] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const filtered = useMemo(() => {
    let list = BANKS;
    if (filter !== 'all') list = list.filter(b => b.type === filter);
    const key = senior ? 'senior' : 'individual';
    list = [...list].sort((a, b) => sortBy === 'rate' ? b[key] - a[key] : a.name.localeCompare(b.name));
    return list;
  }, [filter, sortBy, senior]);

  const displayBanks = showAll ? filtered : filtered.slice(0, 10);

  const maturityAmount = (rate: number) => {
    const r = rate / 100 / 12;
    return amount * Math.pow(1 + r, term);
  };

  const interestEarned = (rate: number) => {
    return maturityAmount(rate) - amount;
  };

  const format = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n);

  const formatPct = (n: number) => n.toFixed(2) + '%';

  const typeLabel = (t: string) =>
    t === 'commercial' ? 'Commercial' : t === 'development' ? 'Development' : 'Finance';

  const typeColor = (t: string) =>
    t === 'commercial' ? 'text-blue-500' : t === 'development' ? 'text-emerald-500' : 'text-purple-500';

  const typeBg = (t: string) =>
    t === 'commercial' ? 'bg-blue-50' : t === 'development' ? 'bg-emerald-50' : 'bg-purple-50';

  // Best rates
  const bestIndividual = Math.max(...BANKS.map(b => b.individual));
  const bestSenior = Math.max(...BANKS.map(b => b.senior));
  const bestSaving = Math.max(...BANKS.map(b => b.regularSaving));

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Building2 className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          Bank FD Rate Comparator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Compare fixed deposit (FD) interest rates across {BANKS.length}+ Nepali banks, development banks, and finance companies.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-green-50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/40 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-green-500">Best FD Rate</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-300">{formatPct(bestIndividual)}</p>
          <p className="text-[10px] text-green-500">Individual</p>
        </div>
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Best Senior Rate</p>
          <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{formatPct(bestSenior)}</p>
          <p className="text-[10px] text-amber-500">Senior Citizen</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500">Best Saving Rate</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatPct(bestSaving)}</p>
          <p className="text-[10px] text-blue-500">Regular Saving</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Deposit Amount (NPR)</label>
            <div className="flex gap-1 flex-wrap">
              {DEPOSIT_AMOUNTS.map(a => (
                <button key={a} onClick={() => setAmount(a)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    amount === a
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700'
                  }`}>
                  {format(a)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">Term (Months)</label>
            <div className="flex gap-1 flex-wrap">
              {TERMS.map(t => (
                <button key={t} onClick={() => setTerm(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    term === t
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700'
                  }`}>
                  {t < 12 ? `${t} mo` : t === 12 ? '1 yr' : t === 24 ? '2 yr' : t === 36 ? '3 yr' : '5 yr'}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            {(['all', 'commercial', 'development', 'finance'] as const).map(t => (
              <button key={t} onClick={() => setFilter(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === t
                    ? `${typeBg(t)} ${typeColor(t)} border border-current`
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700'
                }`}>
                {t === 'all' ? 'All' : typeLabel(t)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={() => setSenior(!senior)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                senior ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                  : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700'
              }`}>
              Senior Citizen Rate
            </button>
            <button onClick={() => setSortBy(sortBy === 'rate' ? 'name' : 'rate')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700 hover:border-gray-300">
              <SortAsc className="h-3 w-3" />
              {sortBy === 'rate' ? 'By Rate' : 'By Name'}
            </button>
          </div>
        </div>
      </div>

      {/* Bank Rate Table */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Bank</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Type</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">
                  {senior ? 'Senior FD Rate' : 'FD Rate'}
                </th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Maturity Amount</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Interest Earned</th>
                <th className="text-center px-4 py-3 font-semibold text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider">Saving Rate</th>
              </tr>
            </thead>
            <tbody>
              {displayBanks.map((bank, i) => {
                const rate = senior ? bank.senior : bank.individual;
                const matured = maturityAmount(rate);
                const interest = interestEarned(rate);
                return (
                  <tr key={bank.name} className={`border-b border-gray-50 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors ${i === 0 ? 'bg-blue-50/50 dark:bg-blue-950/10' : ''}`}>
                    <td className="px-4 py-3">
                      <span className="font-medium text-gray-900 dark:text-white text-xs">{bank.name}</span>
                    </td>
                    <td className={`px-4 py-3 text-center text-xs font-medium ${typeColor(bank.type)}`}>{typeLabel(bank.type)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold text-sm ${rate >= 8 ? 'text-green-600 dark:text-green-400' : rate >= 7 ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {formatPct(rate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-medium text-gray-800 dark:text-gray-200 text-xs">{format(matured)}</td>
                    <td className="px-4 py-3 text-center font-medium text-emerald-600 dark:text-emerald-400 text-xs">{format(interest)}</td>
                    <td className="px-4 py-3 text-center text-xs text-gray-500">{formatPct(bank.regularSaving)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {filtered.length > 10 && (
          <button onClick={() => setShowAll(!showAll)}
            className="w-full py-3 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors flex items-center justify-center gap-1">
            {showAll ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            {showAll ? 'Show Top 10' : `Show All ${filtered.length} Banks`}
          </button>
        )}
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-4 text-xs text-amber-700 dark:text-amber-400">
        <strong>⚠ Rates are indicative</strong> — Based on published rates as of June 2025. Actual rates vary by branch, deposit amount, and tenure.
        Senior citizen rates apply to individuals aged 60+. Always verify with the bank before depositing.
      </div>
    </main>
  );
}
