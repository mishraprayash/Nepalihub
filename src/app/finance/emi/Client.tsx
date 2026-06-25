'use client';

import { useState } from 'react';
import { Calculator, Table, Landmark, HelpCircle, ArrowUpRight } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AdBanner from '@/components/AdBanner';

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(3000000); // 30 Lakhs
  const [interestRate, setInterestRate] = useState<number>(12); // 12%
  const [loanTenure, setLoanTenure] = useState<number>(15); // 15 years
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  // EMI Calculation Formula
  const principal = loanAmount;
  const monthlyRate = interestRate / 12 / 100;
  const numberOfMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;

  let emi = 0;
  if (monthlyRate > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / 
          (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  } else {
    emi = principal / numberOfMonths;
  }

  const totalPayment = emi * numberOfMonths;
  const totalInterest = totalPayment - principal;

  // Pie chart data
  const data = [
    { name: 'Principal Amount', value: principal },
    { name: 'Total Interest', value: totalInterest }
  ];
  const COLORS = ['#3b82f6', '#f43f5e'];

  // Amortization Schedule Generation
  const amortizationSchedule = [];
  let remainingBalance = principal;
  for (let i = 1; i <= Math.min(numberOfMonths, 12); i++) { // Render first 12 months for review
    const interestPaid = remainingBalance * monthlyRate;
    const principalPaid = emi - interestPaid;
    remainingBalance = Math.max(0, remainingBalance - principalPaid);
    amortizationSchedule.push({
      month: i,
      emi: emi,
      principal: principalPaid,
      interest: interestPaid,
      balance: remainingBalance
    });
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
          <Landmark className="h-3 w-3" /> Banking Utilities
        </div>
        <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Loan EMI & Amortization Calculator
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
          Calculate monthly loan repayments, total payable interest, and view a complete amortization schedule. Optimized for home, car, and gold loans in Nepal.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Input Panel */}
        <div className="lg:col-span-7 space-y-8 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-150/60 dark:border-gray-700/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
          
          <h2 className="text-lg font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
            <Calculator className="h-5 w-5 text-blue-500" />
            Loan Parameters
          </h2>

          <div className="space-y-8">
            {/* Amount Slider & Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Loan Amount</label>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  Rs. {loanAmount.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="50000"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-150 dark:bg-gray-750 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-bold text-xs">Rs.</span>
                <input
                  type="number"
                  value={loanAmount || ''}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full pl-9 pr-4 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Interest Slider & Input */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Interest Rate (% p.a.)</label>
                <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                  {interestRate}%
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="25"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-150 dark:bg-gray-750 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="relative">
                <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 font-bold text-xs">%</span>
                <input
                  type="number"
                  value={interestRate || ''}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full pr-9 pl-4 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Tenure Selects */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Loan Tenure</label>
              <div className="flex gap-4">
                <input
                  type="number"
                  value={loanTenure || ''}
                  onChange={(e) => setLoanTenure(Number(e.target.value))}
                  className="w-full px-4 py-2 text-sm font-bold border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={tenureType}
                  onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
                  className="py-2 px-4 text-xs font-bold uppercase tracking-wider border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="years">Years</option>
                  <option value="months">Months</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 relative overflow-hidden">
            {/* Subtle light background reflection */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl -mr-10 -mt-10" />

            <h2 className="text-lg font-bold border-b border-white/20 pb-4">Repayment Estimate</h2>
            
            <div className="space-y-5">
              <div className="flex flex-col items-center py-6 bg-white/10 rounded-2xl">
                <span className="text-xs opacity-90 uppercase tracking-widest font-bold">Monthly EMI</span>
                <span className="text-3xl sm:text-4xl font-black mt-1 font-mono">Rs. {Math.round(emi).toLocaleString()}</span>
              </div>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="opacity-90 font-medium">Principal Amount:</span>
                  <span className="font-bold font-mono">Rs. {principal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="opacity-90 font-medium">Interest Amount:</span>
                  <span className="font-bold font-mono">Rs. {Math.round(totalInterest).toLocaleString()}</span>
                </div>
                <hr className="border-white/20" />
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold">Total Amount Payable:</span>
                  <span className="font-extrabold font-mono text-yellow-200">Rs. {Math.round(totalPayment).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recharts Block */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl border border-gray-150/60 dark:border-gray-700/50 shadow-sm flex flex-col items-center">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Payment Breakdown</h3>
            <div className="w-full h-[140px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `Rs. ${Number(value).toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-[10px] font-bold uppercase tracking-wider">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span className="text-gray-500 dark:text-gray-400">Principal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-gray-500 dark:text-gray-400">Interest</span>
              </div>
            </div>
          </div>

          <AdBanner slot="0000000000" format="auto" />
        </div>
      </div>

      {/* Amortization Table */}
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-3xl border border-gray-150/60 dark:border-gray-700/50 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold flex items-center gap-2 text-gray-900 dark:text-white">
          <Table className="h-5 w-5 text-indigo-500" />
          Amortization Schedule (First 12 Months)
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-xs font-semibold">
            <thead>
              <tr className="text-gray-400 uppercase text-[10px] tracking-wider">
                <th className="py-3 pb-4">Month</th>
                <th className="py-3 pb-4">Monthly EMI</th>
                <th className="py-3 pb-4">Principal Paid</th>
                <th className="py-3 pb-4">Interest Paid</th>
                <th className="py-3 pb-4">Remaining Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/30 text-gray-850 dark:text-gray-200">
              {amortizationSchedule.map((row) => (
                <tr key={row.month} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 font-medium">
                  <td className="py-3 font-bold text-gray-900 dark:text-white">Month {row.month}</td>
                  <td className="py-3 font-mono">Rs. {Math.round(row.emi).toLocaleString()}</td>
                  <td className="py-3 text-green-600 dark:text-green-400 font-mono">Rs. {Math.round(row.principal).toLocaleString()}</td>
                  <td className="py-3 text-rose-500 font-mono">Rs. {Math.round(row.interest).toLocaleString()}</td>
                  <td className="py-3 font-bold font-mono text-gray-900 dark:text-white">Rs. {Math.round(row.balance).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
