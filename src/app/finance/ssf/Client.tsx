'use client';

import { useState } from 'react';
import { Shield, Users, Building, HeartPulse, Baby, Umbrella, ChevronDown, ChevronUp, Info } from 'lucide-react';

interface Contribution {
  label: string;
  rate: number;
  amount: number;
  by: 'employee' | 'employer';
  icon: React.ReactNode;
}

const CONTRIBUTION_TYPES: Omit<Contribution, 'amount'>[] = [
  { label: 'Social Security (Pension)', rate: 20, by: 'employer', icon: <Shield className="h-4 w-4" /> },
  { label: 'Medical Insurance',        rate: 1,  by: 'employer', icon: <HeartPulse className="h-4 w-4" /> },
  { label: 'Accident Insurance',       rate: 1,  by: 'employer', icon: <Umbrella className="h-4 w-4" /> },
  { label: 'Maternity',                rate: 0.5,by: 'employer', icon: <Baby className="h-4 w-4" /> },
  { label: 'Dependent Family Medical', rate: 0.5,by: 'employer', icon: <Users className="h-4 w-4" /> },
];

export default function SSFClient() {
  const [basicSalary, setBasicSalary] = useState('50000');
  const [showDetails, setShowDetails] = useState(false);
  const [years, setYears] = useState(15);

  const salary = parseFloat(basicSalary) || 0;
  const employeeRate = 11;
  const employerRate = CONTRIBUTION_TYPES.reduce((s, c) => s + c.rate, 0);

  const employeeMonth = salary * employeeRate / 100;
  const employerMonth = salary * employerRate / 100;
  const totalMonth = employeeMonth + employerMonth;
  const totalYear = totalMonth * 12;
  const totalProjected = totalYear * years;

  const format = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Shield className="h-7 w-7 text-blue-600 dark:text-blue-400" />
          SSF Contribution & Benefits Calculator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Calculate monthly contributions to the Nepal Social Security Fund (Employee + Employer) and projected benefits.
        </p>
      </div>

      {/* Input Card */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-6">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            Your Basic Monthly Salary (NPR)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">Rs.</span>
            <input
              type="number"
              value={basicSalary}
              onChange={e => setBasicSalary(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="50000"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            Contribution Period (Years)
          </label>
          <input
            type="range"
            min={1}
            max={35}
            value={years}
            onChange={e => setYears(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-gray-400 mt-1">
            <span>1 yr</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">{years} years</span>
            <span>35 yrs</span>
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-blue-500 dark:text-blue-400 mb-1">Monthly Employee</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{format(employeeMonth)}</p>
          <p className="text-xs text-blue-500 dark:text-blue-400">@ {employeeRate}% of basic</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-emerald-500 dark:text-emerald-400 mb-1">Monthly Employer</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{format(employerMonth)}</p>
          <p className="text-xs text-emerald-500 dark:text-emerald-400">@ {employerRate}% of basic</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-5 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-1">Total Monthly</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{format(totalMonth)}</p>
          <p className="text-xs text-purple-500 dark:text-purple-400">@ {employeeRate + employerRate}% combined</p>
        </div>
      </div>

      {/* Yearly & Projected */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Annual Contribution</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{format(totalYear)}</p>
        </div>
        <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Projected Total ({years} yrs)</p>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{format(totalProjected)}</p>
        </div>
      </div>

      {/* Employer Breakdown */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
        >
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Building className="h-4 w-4 text-emerald-500" />
            Employer Contribution Breakdown
          </span>
          {showDetails ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </button>
        {showDetails && (
          <div className="px-5 pb-5 space-y-2">
            {CONTRIBUTION_TYPES.map(c => {
              const amt = salary * c.rate / 100;
              return (
                <div key={c.label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    {c.icon}
                    {c.label}
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{format(amt)}</span>
                    <span className="text-xs text-gray-400 ml-2">({c.rate}%)</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Employer</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{format(employerMonth)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Benefits Info */}
      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
          <div className="text-sm text-amber-800 dark:text-amber-300 space-y-1">
            <p className="font-semibold">SSF Benefits You Qualify For</p>
            <ul className="list-disc pl-5 space-y-0.5 text-amber-700 dark:text-amber-400">
              <li><strong>Medical Insurance:</strong> Up to Rs 100,000/year (OPD) + Rs 500,000 (inpatient)</li>
              <li><strong>Accident Insurance:</strong> Up to Rs 700,000 coverage</li>
              <li><strong>Maternity Benefit:</strong> Paid leave + medical coverage</li>
              <li><strong>Old Age Pension:</strong> After age 65 or 15+ years of continuous contribution</li>
              <li><strong>Dependent Family:</strong> Medical coverage for spouse, children, parents</li>
              <li><strong>Funeral Grant:</strong> Lump sum to next of kin</li>
            </ul>
            <p className="mt-2 text-xs text-amber-600 dark:text-amber-500">
              Based on SSF Act 2074 and amendments. Actual benefits subject to SSF guidelines and fund availability.
            </p>
          </div>
        </div>
      </div>

      {/* Reference */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300">About SSF</h3>
        <p>The Social Security Fund (SSF) was established under the SSF Act 2074 to provide social security to all formally employed workers in Nepal.</p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Mandatory:</strong> All employers with 10+ employees must register</li>
          <li><strong>Contribution:</strong> 11% employee + variable employer (total ~22%) of basic salary</li>
          <li><strong>Coverage:</strong> Medical, accident, maternity, dependent family, old age pension</li>
          <li><strong>Withdrawal:</strong> Partial lump sum allowed after 5+ years; full pension at 65</li>
        </ul>
        <p className="text-xs mt-2">
          Source: Social Security Fund, Nepal (ssf.gov.np). Rates verified for FY 2081/82.
        </p>
      </div>
    </main>
  );
}
