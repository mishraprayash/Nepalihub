'use client';

import { useState } from 'react';
import { Landmark, Info, Calculator, Download, Calendar } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

export default function IncomeTaxClient() {
  // Inputs
  const [status, setStatus] = useState<'single' | 'married'>('single');
  const [assessmentYear, setAssessmentYear] = useState('2083/84');
  const [infoYear, setInfoYear] = useState<'2083/84' | '2080/81'>('2083/84');
  const [basicSalary, setBasicSalary] = useState<number>(50000); // Basic Salary
  const [monthlySalary, setMonthlySalary] = useState<number>(80000); // Gross Monthly Salary
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);
  
  // Deductions
  const [ssfContribution, setSsfContribution] = useState<number>(0);
  const [ssfPeriod, setSsfPeriod] = useState<'monthly' | 'annual'>('annual');
  const [pfContribution, setPfContribution] = useState<number>(0);
  const [pfPeriod, setPfPeriod] = useState<'monthly' | 'annual'>('annual');
  const [citContribution, setCitContribution] = useState<number>(0);
  const [citPeriod, setCitPeriod] = useState<'monthly' | 'annual'>('annual');
  const [lifeInsurance, setLifeInsurance] = useState<number>(0); // Life insurance
  const [healthInsurance, setHealthInsurance] = useState<number>(0); // Health insurance

  // Calculate tax
  const annualSalary = monthlySalary * 12;
  const grossAnnualIncome = annualSalary + otherIncome + bonus;

  // Deductions calculation
  // Limit CIT/PF/SSF: Max 1/3 of gross or Rs 3,00,000 (or Rs 5,00,000 if SSF, Rs 6,00,000 in 2083)
  const annualSsf = ssfPeriod === 'monthly' ? ssfContribution * 12 : ssfContribution;
  const annualPf = pfPeriod === 'monthly' ? pfContribution * 12 : pfContribution;
  const annualCit = citPeriod === 'monthly' ? citContribution * 12 : citContribution;
  
  const maxRetirementDeduction = annualSsf > 0 ? (assessmentYear === '2083/84' ? 600000 : 500000) : 300000;
  
  const actualRetirementContribution = annualSsf + annualPf + annualCit;
  const retirementDeduction = Math.min(
    actualRetirementContribution,
    maxRetirementDeduction,
    grossAnnualIncome / 3
  );

  const lifeInsuranceDeduction = Math.min(lifeInsurance, 40000);
  const healthInsuranceDeduction = Math.min(healthInsurance, 20000);

  const totalDeductions = retirementDeduction + lifeInsuranceDeduction + healthInsuranceDeduction;
  const taxableIncome = Math.max(0, grossAnnualIncome - totalDeductions);

  // Slabs configuration
  const slabs = status === 'single' 
    ? (assessmentYear === '2083/84'
        ? [
            { limit: 1000000, rate: 0.01, label: 'First Rs. 10,00,000' },
            { limit: 500000, rate: 0.10, label: 'Next Rs. 5,00,000' },
            { limit: 1000000, rate: 0.20, label: 'Next Rs. 10,00,000' },
            { limit: 1500000, rate: 0.27, label: 'Next Rs. 15,00,000' },
            { limit: Infinity, rate: 0.29, label: 'Above Rs. 40,00,000' }
          ]
        : [
            { limit: 500000, rate: 0.01, label: 'First Rs. 5,00,000' },
            { limit: 200000, rate: 0.10, label: 'Next Rs. 2,00,000' },
            { limit: 300000, rate: 0.20, label: 'Next Rs. 3,00,000' },
            { limit: 1000000, rate: 0.30, label: 'Next Rs. 10,00,000' },
            { limit: 3000000, rate: 0.36, label: 'Next Rs. 30,00,000' },
            { limit: Infinity, rate: 0.39, label: 'Above Rs. 50,00,000' }
          ]
      )
    : (assessmentYear === '2083/84'
        ? [
            { limit: 1000000, rate: 0.01, label: 'First Rs. 10,00,000' },
            { limit: 500000, rate: 0.10, label: 'Next Rs. 5,00,000' },
            { limit: 1000000, rate: 0.20, label: 'Next Rs. 10,00,000' },
            { limit: 1500000, rate: 0.27, label: 'Next Rs. 15,00,000' },
            { limit: Infinity, rate: 0.29, label: 'Above Rs. 40,00,000' }
          ]
        : [
            { limit: 600000, rate: 0.01, label: 'First Rs. 6,00,000' },
            { limit: 200000, rate: 0.10, label: 'Next Rs. 2,00,000' },
            { limit: 300000, rate: 0.20, label: 'Next Rs. 3,00,000' },
            { limit: 900000, rate: 0.30, label: 'Next Rs. 9,00,000' },
            { limit: 3000000, rate: 0.36, label: 'Next Rs. 30,00,000' },
            { limit: Infinity, rate: 0.39, label: 'Above Rs. 50,00,000' }
          ]
      );

  // Calculate tax per slab — always emit all slabs so UI can show full structure
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  const slabCalculations: { slab: string; rate: number; taxableAmount: number; taxAmount: number; reached: boolean }[] = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];

    // If enrolled in SSF, the first slab (1%) is 0% (free social security tax)
    let rate = slab.rate;
    if (i === 0 && annualSsf > 0) {
      rate = 0; // Exempted if enrolled in SSF
    }

    if (remainingIncome <= 0) {
      // Slab not reached — push as placeholder so the full schedule is visible
      slabCalculations.push({
        slab: slab.label,
        rate: Math.round(rate * 100),
        taxableAmount: 0,
        taxAmount: 0,
        reached: false,
      });
      continue;
    }

    let taxableInSlab = 0;
    if (slab.limit === Infinity) {
      taxableInSlab = remainingIncome;
    } else {
      taxableInSlab = Math.min(remainingIncome, slab.limit);
    }

    const taxInSlab = taxableInSlab * rate;
    totalTax += taxInSlab;
    remainingIncome -= taxableInSlab;

    slabCalculations.push({
      slab: slab.label,
      rate: Math.round(rate * 100),
      taxableAmount: taxableInSlab,
      taxAmount: taxInSlab,
      reached: true,
    });
  }

  const netTakeHomeAnnual = grossAnnualIncome - totalTax - actualRetirementContribution;
  // Calculate regular monthly take-home by excluding one-time bonus and other income
  const netTakeHomeMonthly = monthlySalary - (actualRetirementContribution / 12) - (totalTax / 12);

  return (
    <div className="space-y-12">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepal Income Tax Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Calculate your monthly and annual income tax liabilities under the current Nepal Budget and Inland Revenue Department (IRD) regulations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calculator className="h-5 w-5 text-blue-500" />
            Tax Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Marital Status {assessmentYear === '2083/84' && <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block sm:inline sm:ml-2">(Unified Slabs Active)</span>}
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setStatus('single')}
                  disabled={assessmentYear === '2083/84'}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${status === 'single' || assessmentYear === '2083/84' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'} ${assessmentYear === '2083/84' ? 'opacity-90 cursor-default' : ''}`}
                >
                  {assessmentYear === '2083/84' ? 'Unified / Single' : 'Single'}
                </button>
                <button
                  onClick={() => setStatus('married')}
                  disabled={assessmentYear === '2083/84'}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${status === 'married' && assessmentYear !== '2083/84' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'} ${assessmentYear === '2083/84' ? 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50' : ''}`}
                >
                  Married
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Assessment Year</label>
              <select
                value={assessmentYear}
                onChange={(e) => setAssessmentYear(e.target.value)}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="2083/84">FY 2083/84 (Current)</option>
                <option value="2080/81">FY 2080/81 & 2081/82</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Gross Salary (NPR)</label>
              <input
                type="number"
                value={monthlySalary || ''}
                onChange={(e) => setMonthlySalary(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Monthly Basic Salary (NPR)</label>
              <span className="text-xs text-gray-400 block mb-2">Base for 31% SSF deduction</span>
              <input
                type="number"
                value={basicSalary || ''}
                onChange={(e) => setBasicSalary(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual Other Income (NPR)</label>
              <input
                type="number"
                value={otherIncome || ''}
                onChange={(e) => setOtherIncome(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Annual Bonus (NPR)</label>
              <input
                type="number"
                value={bonus || ''}
                onChange={(e) => setBonus(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <h2 className="text-xl font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-green-500" />
            Deductions & Exemptions (Annual)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">SSF (Social Security Fund)</label>
                <button
                  type="button"
                  onClick={() => {
                    setSsfContribution(Math.round(basicSalary * 0.31));
                    setSsfPeriod('monthly');
                  }}
                  className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded"
                >
                  31% of Basic
                </button>
              </div>
              <span className="text-xs text-gray-400 block mb-2">Reduces tax-free slab rate to 0%</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={ssfContribution || ''}
                  onChange={(e) => setSsfContribution(Number(e.target.value))}
                  placeholder="e.g. 100000"
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={ssfPeriod}
                  onChange={(e) => setSsfPeriod(e.target.value as 'monthly' | 'annual')}
                  className="w-1/3 py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
                >
                  <option value="annual">/yr</option>
                  <option value="monthly">/mo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">CIT Contribution</label>
              <span className="text-xs text-gray-400 block mb-2">Citizen Investment Trust</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={citContribution || ''}
                  onChange={(e) => setCitContribution(Number(e.target.value))}
                  placeholder="e.g. 120000"
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={citPeriod}
                  onChange={(e) => setCitPeriod(e.target.value as 'monthly' | 'annual')}
                  className="w-1/3 py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
                >
                  <option value="annual">/yr</option>
                  <option value="monthly">/mo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Provident Fund (EPF)</label>
              <span className="text-xs text-gray-400 block mb-2">Employees Provident Fund</span>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={pfContribution || ''}
                  onChange={(e) => setPfContribution(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={pfPeriod}
                  onChange={(e) => setPfPeriod(e.target.value as 'monthly' | 'annual')}
                  className="w-1/3 py-2 px-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none"
                >
                  <option value="annual">/yr</option>
                  <option value="monthly">/mo</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Life Insurance Premium</label>
              <span className="text-xs text-gray-400 block mb-2">Max deduction: Rs. 40,000</span>
              <input
                type="number"
                value={lifeInsurance || ''}
                onChange={(e) => setLifeInsurance(Number(e.target.value))}
                placeholder="e.g. 35000"
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Health Insurance Premium</label>
              <span className="text-xs text-gray-400 block mb-2">Max deduction: Rs. 20,000</span>
              <input
                type="number"
                value={healthInsurance || ''}
                onChange={(e) => setHealthInsurance(Number(e.target.value))}
                placeholder="e.g. 15000"
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold border-b border-white/20 pb-4">Tax Estimation Summary</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="opacity-90">Gross Annual Income:</span>
                <span className="font-bold">Rs. {grossAnnualIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Total Deductions:</span>
                <span className="font-bold">Rs. {totalDeductions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Taxable Income:</span>
                <span className="font-bold text-yellow-300">Rs. {taxableIncome.toLocaleString()}</span>
              </div>
              <hr className="border-white/20" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Annual Income Tax:</span>
                <span className="font-extrabold text-2xl text-red-300">Rs. {totalTax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-90">Monthly Tax Deduction:</span>
                <span className="font-bold">Rs. {Math.round(totalTax / 12).toLocaleString()}</span>
              </div>
              <hr className="border-white/20" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold text-green-300">Net Take-Home Pay (Est.):</span>
                <span className="font-extrabold text-2xl text-green-300">Rs. {Math.round(netTakeHomeMonthly).toLocaleString()} <span className="text-xs font-normal">/mo</span></span>
            </div>
          </div>
          <AdBanner slot="0000000000" format="auto" />
        </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900 dark:text-white">Tax Slab Breakdown</h3>
              {slabCalculations.length > 0 && (
                <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                  {slabCalculations.filter(c => c.taxAmount > 0).length} slab{slabCalculations.filter(c => c.taxAmount > 0).length !== 1 ? 's' : ''} taxed
                </span>
              )}
            </div>

            {slabCalculations.length > 0 ? (
              <div className="space-y-3">
                {slabCalculations.map((calc, i) => {
                  const slabColors = [
                    { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', bar: 'bg-emerald-400', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
                    { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', bar: 'bg-yellow-400', badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300', dot: 'bg-yellow-500' },
                    { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', bar: 'bg-orange-400', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300', dot: 'bg-orange-500' },
                    { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', bar: 'bg-red-400', badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300', dot: 'bg-red-500' },
                    { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', bar: 'bg-rose-500', badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300', dot: 'bg-rose-600' },
                    { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', bar: 'bg-purple-500', badge: 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300', dot: 'bg-purple-600' },
                  ];
                  const color = slabColors[i % slabColors.length];
                  const isActive = calc.reached;
                  const barPct = totalTax > 0 ? Math.min((calc.taxAmount / totalTax) * 100, 100) : 0;

                  return (
                    <div key={i} className={`rounded-xl border p-3 transition-all ${isActive ? `${color.bg} ${color.border}` : 'bg-gray-50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800 opacity-50'}`}>
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isActive ? color.dot : 'bg-gray-300 dark:bg-gray-600'}`} />
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{calc.slab}</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${color.badge}`}>
                          {calc.rate}%
                        </span>
                      </div>

                      {/* Formula row */}
                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2 pl-4">
                        <span>
                          Rs. {Math.round(calc.taxableAmount).toLocaleString()}
                          <span className="mx-1 opacity-60">×</span>
                          {calc.rate}%
                          <span className="mx-1 opacity-60">=</span>
                          <span className={`font-bold ${isActive && calc.taxAmount > 0 ? 'text-gray-800 dark:text-gray-100' : ''}`}>
                            Rs. {Math.round(calc.taxAmount).toLocaleString()}
                          </span>
                        </span>
                        {totalTax > 0 && calc.taxAmount > 0 && (
                          <span className="text-gray-400 dark:text-gray-500 text-[11px]">
                            {((calc.taxAmount / totalTax) * 100).toFixed(1)}% of total
                          </span>
                        )}
                      </div>

                      {/* Progress bar */}
                      {isActive && (
                        <div className="pl-4">
                          <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${color.bar}`}
                              style={{ width: `${barPct}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Total row */}
                <div className="mt-2 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Total Annual Tax</span>
                  <span className="text-base font-extrabold text-red-600 dark:text-red-400">
                    Rs. {Math.round(totalTax).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Effective Tax Rate</span>
                  <span className="font-semibold">
                    {taxableIncome > 0 ? ((totalTax / taxableIncome) * 100).toFixed(2) : '0.00'}%
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center py-6">Enter income to see slab breakdown</div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Dynamic Informational Content */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Understanding Retirement Funds and Income Tax in Nepal</h2>
        
        <div className="space-y-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
          <p>
            Nepal operates on a progressive taxation system under the Income Tax Act. Tax liabilities can be significantly reduced by legally participating in approved retirement and investment funds.
          </p>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6">Retirement Funds: SSF, EPF/PF, and CIT Explained</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-200">1. Social Security Fund (SSF)</h4>
              <p>
                The SSF is a comprehensive government-mandated welfare scheme. It requires a combined contribution of <strong>31% of your basic salary</strong> (11% deducted from the employee's salary and 20% contributed by the employer).
              </p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                <li><strong>Tax Benefit:</strong> If you are enrolled in SSF, the mandatory 1% Social Security Tax on the first income slab is fully waived.</li>
                <li><strong>Deduction Limit:</strong> The combined statutory maximum deduction limit is raised to Rs. 500,000 (or Rs. 600,000 for FY 2083/84) for SSF contributors.</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-200">2. Employees Provident Fund (EPF/PF)</h4>
              <p>
                A traditional retirement savings scheme typically involving a <strong>20% total contribution</strong> (10% from the employee and 10% from the employer). It functions as an approved retirement fund but lacks the 1% SSST waiver advantage of the SSF.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-200">3. Citizen Investment Trust (CIT)</h4>
              <p>
                CIT allows for voluntary salary deductions designed to encourage savings while offering immediate tax deductions. You can choose the monthly contribution amount to maximize tax efficiency up to the legal thresholds.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6">Combined Tax Deduction Limits</h3>
          <p>
            Under the Nepal Income Tax Act, you cannot deduct unlimited amounts through retirement funds. For high-income earners, the allowable tax deduction for combined retirement contributions (SSF + CIT + PF) is strictly calculated as the <strong>lowest of the following three values</strong>:
          </p>
          <ul className="list-decimal pl-5 space-y-1 font-medium text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
            <li>The actual combined contribution amount.</li>
            <li>33.33% (One-third) of your Assessable Gross Income.</li>
            <li>The statutory maximum limit: Rs. 300,000 for standard EPF/CIT users, or Rs. 500,000 for SSF contributors (Rs. 600,000 for the current FY 2083/84 unified slab).</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-6">Additional Insurance Deductions</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Life Insurance:</strong> Taxpayers can deduct up to Rs. 40,000 annually for life insurance premiums paid.</li>
            <li><strong>Health Insurance:</strong> An additional deduction of up to Rs. 20,000 annually is allowed for health insurance premiums paid to registered insurance companies in Nepal.</li>
          </ul>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-6 border-b border-gray-100 dark:border-gray-700 pb-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Tax Slabs Reference Table</h3>
            <div className="flex gap-2 mt-2 sm:mt-0">
              <button
                onClick={() => setInfoYear('2083/84')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${infoYear === '2083/84' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                FY 2083/84 (Current)
              </button>
              <button
                onClick={() => setInfoYear('2080/81')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${infoYear === '2080/81' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                FY 2080/81 & 2081/82
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left">
              <thead>
                <tr>
                  <th className="py-2 font-semibold text-gray-900 dark:text-white">Single Tax Slab</th>
                  <th className="py-2 font-semibold text-gray-900 dark:text-white">Married Tax Slab</th>
                  <th className="py-2 font-semibold text-right text-gray-900 dark:text-white">Tax Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                {infoYear === '2083/84' ? (
                  <>
                    <tr>
                      <td className="py-2">Up to Rs. 10,00,000</td>
                      <td className="py-2">Up to Rs. 10,00,000 (Unified)</td>
                      <td className="py-2 text-right">1% (0% if SSF)</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 10,00,001 to Rs. 15,00,000</td>
                      <td className="py-2">Rs. 10,00,001 to Rs. 15,00,000</td>
                      <td className="py-2 text-right">10%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 15,00,001 to Rs. 25,00,000</td>
                      <td className="py-2">Rs. 15,00,001 to Rs. 25,00,000</td>
                      <td className="py-2 text-right">20%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 25,00,001 to Rs. 40,00,000</td>
                      <td className="py-2">Rs. 25,00,001 to Rs. 40,00,000</td>
                      <td className="py-2 text-right">27%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Above Rs. 40,00,000</td>
                      <td className="py-2">Above Rs. 40,00,000</td>
                      <td className="py-2 text-right">29%</td>
                    </tr>
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="py-2">Up to Rs. 5,00,000</td>
                      <td className="py-2">Up to Rs. 6,00,000</td>
                      <td className="py-2 text-right">1% (0% if SSF)</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 5,00,001 to Rs. 7,00,000</td>
                      <td className="py-2">Rs. 6,00,001 to Rs. 8,00,000</td>
                      <td className="py-2 text-right">10%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 7,00,001 to Rs. 10,00,000</td>
                      <td className="py-2">Rs. 8,00,001 to Rs. 11,00,000</td>
                      <td className="py-2 text-right">20%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 10,00,001 to Rs. 20,00,000</td>
                      <td className="py-2">Rs. 11,00,001 to Rs. 20,00,000</td>
                      <td className="py-2 text-right">30%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Rs. 20,00,001 to Rs. 50,00,000</td>
                      <td className="py-2">Rs. 20,00,001 to Rs. 50,00,000</td>
                      <td className="py-2 text-right">36%</td>
                    </tr>
                    <tr>
                      <td className="py-2">Above Rs. 50,00,000</td>
                      <td className="py-2">Above Rs. 50,00,000</td>
                      <td className="py-2 text-right">39%</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
