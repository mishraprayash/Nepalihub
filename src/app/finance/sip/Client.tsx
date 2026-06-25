'use client';

import { useState } from 'react';
import { Calculator, Coins, TrendingUp, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000); // 5k NPR
  const [expectedReturn, setExpectedReturn] = useState<number>(15); // 15%
  const [tenureYears, setTenureYears] = useState<number>(10); // 10 Years

  // SIP Future Value Formula:
  const P = monthlyInvestment;
  const i = expectedReturn / 12 / 100;
  const n = tenureYears * 12;

  let totalWealth = 0;
  if (i > 0) {
    totalWealth = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  } else {
    totalWealth = P * n;
  }

  const totalInvested = P * n;
  const totalReturns = totalWealth - totalInvested;

  // Chart data: growth over years
  const chartData = [];
  let accumInvested = 0;
  let accumWealth = 0;

  for (let yr = 1; yr <= tenureYears; yr++) {
    const months = yr * 12;
    accumInvested = P * months;
    if (i > 0) {
      accumWealth = P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    } else {
      accumWealth = accumInvested;
    }
    chartData.push({
      year: `Yr ${yr}`,
      Invested: Math.round(accumInvested),
      Wealth: Math.round(accumWealth)
    });
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          <Coins className="h-3 w-3" /> Mutual Fund Planning
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Systematic Investment Plan (SIP) Calculator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          Estimate the potential maturity returns on your SIP in Nepalese mutual funds (e.g. NIBL, Siddhartha, Nabil, NICA mutual funds).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-150/60 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

          <h2 className="text-lg font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
            <Calculator className="h-5 w-5 text-emerald-500" />
            Investment Details
          </h2>

          <div className="space-y-8">
            {/* Monthly Investment Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Monthly Contribution</label>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  Rs. {monthlyInvestment.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-150 dark:bg-gray-750 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold text-xs">Rs.</span>
                <input
                  type="number"
                  value={monthlyInvestment || ''}
                  onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Expected Return Rate Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Expected Annual Returns</label>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {expectedReturn}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="25"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-150 dark:bg-gray-750 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="relative">
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 font-bold text-xs">%</span>
                <input
                  type="number"
                  value={expectedReturn || ''}
                  onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  className="w-full pr-9 pl-4 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Tenure Slider */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Time Period (Years)</label>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
                  {tenureYears} Years
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-150 dark:bg-gray-750 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="relative">
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 font-bold text-xs">Yrs</span>
                <input
                  type="number"
                  value={tenureYears || ''}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full pr-10 pl-4 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-teal-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />

            <h2 className="text-lg font-bold border-b border-white/20 pb-4">Estimated Maturity</h2>
            
            <div className="space-y-5">
              <div className="flex flex-col items-center py-6 bg-white/10 rounded-2xl">
                <span className="text-xs opacity-90 uppercase tracking-widest font-bold">Total Wealth</span>
                <span className="text-3xl sm:text-4xl font-black mt-1 font-mono">Rs. {Math.round(totalWealth).toLocaleString()}</span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="opacity-90 font-medium">Invested Amount:</span>
                  <span className="font-bold font-mono">Rs. {totalInvested.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold">Estimated Returns:</span>
                  <span className="font-extrabold font-mono text-yellow-200">Rs. {Math.round(totalReturns).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Area Chart Growth */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-150/60 dark:border-gray-700/50 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Investment Growth Chart</h3>
            <div className="w-full h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis fontSize={9} width={40} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 100000}L`} />
                  <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
                  <Area type="monotone" dataKey="Wealth" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorWealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
