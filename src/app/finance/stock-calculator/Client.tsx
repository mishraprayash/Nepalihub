'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown, Info, Calculator, BarChart3, DollarSign, Percent } from 'lucide-react';

const BROKERAGE_RATES: Record<string, number> = {
  '0-50000': 0.0040,    // 0.40% for first Rs. 50,000
  '50000-500000': 0.0037, // 0.37% for Rs. 50,001 - 5,00,000
  '500000-2000000': 0.0034, // 0.34% for Rs. 5,00,001 - 20,00,000
  '2000000-10000000': 0.0030, // 0.30% for Rs. 20,00,001 - 1,00,00,000
  '10000000+': 0.0027,  // 0.27% above Rs. 1,00,00,000
};

function calculateBrokerage(amount: number): number {
  if (amount <= 50000) return amount * 0.0040;
  if (amount <= 500000) return amount * 0.0037;
  if (amount <= 2000000) return amount * 0.0034;
  if (amount <= 10000000) return amount * 0.0030;
  return amount * 0.0027;
}

export default function StockProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState<number>(500);
  const [sellPrice, setSellPrice] = useState<number>(600);
  const [quantity, setQuantity] = useState<number>(100);
  const [holdingPeriod, setHoldingPeriod] = useState<'short' | 'long'>('short'); // short = <1yr, long = >1yr
  const [investorType, setInvestorType] = useState<'individual' | 'institution'>('individual');

  // Calculations
  const totalInvestment = buyPrice * quantity;
  const totalSaleValue = sellPrice * quantity;

  // Brokerage on buy and sell
  const buyBrokerage = calculateBrokerage(totalInvestment);
  const sellBrokerage = calculateBrokerage(totalSaleValue);
  const totalBrokerage = buyBrokerage + sellBrokerage;

  // SEBO Fee: 0.015% on both buy and sell
  const seboFee = (totalInvestment + totalSaleValue) * 0.00015;

  // DP / Transfer Fee: Rs. 25 per transaction (standard)
  const dpFee = 25 * 2; // buy + sell

  // Capital gains tax (CGT)
  // Individual: 5% if held < 1yr, 7.5% if > 1yr
  // Institution: 10% flat
  let cgtRate = 0;
  if (investorType === 'individual') {
    cgtRate = holdingPeriod === 'short' ? 0.05 : 0.075;
  } else {
    cgtRate = 0.10;
  }
  const grossProfit = totalSaleValue - totalInvestment;
  const netProfitBeforeTax = grossProfit - totalBrokerage - seboFee - dpFee;
  const capitalGainsTax = netProfitBeforeTax > 0 ? netProfitBeforeTax * cgtRate : 0;
  const netProfit = netProfitBeforeTax - capitalGainsTax;

  // Break-even price: price at which net profit = 0
  // Total cost per share = buyPrice + (buyBrokerage + sellBrokerage equivalent + seboFee + dpFee + cgt) / qty
  // Simplified: breakEven = buyPrice * (1 + 0.0040) + (25 / qty) ... approximate
  const breakEvenPrice = totalInvestment / quantity + 
    (buyBrokerage + calculateBrokerage(totalInvestment) / 2) / quantity + 
    (seboFee / 2 + dpFee / 2) / quantity;

  const profitPercent = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const isProfit = netProfit >= 0;

  // Format numbers
  const formatRs = (n: number) => `Rs. ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          NEPSE Stock Profit / Loss Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Calculate your exact profit or loss from Nepal Stock Exchange (NEPSE) trades including brokerage fees, 
          SEBO fee, DP charges, and capital gains tax (CGT).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Calculator className="h-5 w-5 text-blue-500" />
            Trade Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Buy Price per Share (NPR)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold text-sm">Rs.</span>
                <input
                  type="number"
                  value={buyPrice || ''}
                  onChange={(e) => setBuyPrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Sell Price per Share (NPR)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 font-bold text-sm">Rs.</span>
                <input
                  type="number"
                  value={sellPrice || ''}
                  onChange={(e) => setSellPrice(Number(e.target.value))}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Quantity (Shares)</label>
              <input
                type="number"
                value={quantity || ''}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Holding Period</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setHoldingPeriod('short')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    holdingPeriod === 'short'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  &lt; 1 Year (5% CGT)
                </button>
                <button
                  onClick={() => setHoldingPeriod('long')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    holdingPeriod === 'long'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  &gt; 1 Year (7.5% CGT)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Investor Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setInvestorType('individual')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    investorType === 'individual'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Individual
                </button>
                <button
                  onClick={() => setInvestorType('institution')}
                  className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition-all ${
                    investorType === 'institution'
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Institution (10% CGT)
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className={`p-6 rounded-2xl shadow-xl ${
            isProfit 
              ? 'bg-gradient-to-br from-green-500 to-emerald-700' 
              : 'bg-gradient-to-br from-red-500 to-rose-700'
          } text-white`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Net P&L</h2>
              {isProfit ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
            </div>
            <div className="text-3xl font-extrabold">
              {formatRs(Math.abs(netProfit))}
            </div>
            <div className={`text-sm font-bold mt-1 ${isProfit ? 'text-green-200' : 'text-red-200'}`}>
              {isProfit ? 'Profit' : 'Loss'} · {profitPercent.toFixed(2)}%
            </div>
            <div className="border-t border-white/20 mt-4 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="opacity-80">Total Investment</span>
                <span className="font-bold">{formatRs(totalInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-80">Total Sale Value</span>
                <span className="font-bold">{formatRs(totalSaleValue)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" /> Fee Breakdown
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Gross Profit</span>
                <span className={`font-bold ${grossProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatRs(grossProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Brokerage (Buy) @ 0.40–0.27%</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRs(buyBrokerage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Brokerage (Sell) @ 0.40–0.27%</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRs(sellBrokerage)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">SEBO Fee @ 0.015%</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRs(seboFee)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">DP / Transfer Fee</span>
                <span className="font-semibold text-gray-700 dark:text-gray-300">{formatRs(dpFee)}</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">Total Fees</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">{formatRs(totalBrokerage + seboFee + dpFee)}</span>
              </div>
              <div className="flex justify-between">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Capital Gains Tax</span>
                  <span className="text-[10px] text-gray-400 ml-1">({(cgtRate * 100).toFixed(1)}%)</span>
                </div>
                <span className="font-bold text-red-600 dark:text-red-400">{formatRs(capitalGainsTax)}</span>
              </div>
              <hr className="border-gray-200 dark:border-gray-700" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-gray-900 dark:text-white">Net {isProfit ? 'Profit' : 'Loss'}</span>
                <span className={`font-extrabold ${isProfit ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatRs(Math.abs(netProfit))}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Return on Investment</span>
                <span className={`font-bold ${profitPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {profitPercent >= 0 ? '+' : ''}{profitPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fee Details Info */}
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Understanding NEPSE Trading Costs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Percent className="h-4 w-4 text-blue-500" /> Brokerage Fee
            </h3>
            <ul className="text-gray-500 dark:text-gray-400 space-y-1 text-xs">
              <li>First Rs. 50,000: 0.40%</li>
              <li>Rs. 50,001 – 5,00,000: 0.37%</li>
              <li>Rs. 5,00,001 – 20,00,000: 0.34%</li>
              <li>Rs. 20,00,001 – 1,00,00,000: 0.30%</li>
              <li>Above Rs. 1,00,00,000: 0.27%</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-amber-500" /> Other Charges
            </h3>
            <ul className="text-gray-500 dark:text-gray-400 space-y-1 text-xs">
              <li>SEBO Fee: 0.015% (both buy & sell)</li>
              <li>DP / Transfer Fee: Rs. 25 per transaction</li>
              <li>CDS & Clearing Fee: Included in brokerage</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="h-4 w-4 text-red-500" /> Capital Gains Tax (CGT)
            </h3>
            <ul className="text-gray-500 dark:text-gray-400 space-y-1 text-xs">
              <li><strong>Individual:</strong> 5% (held &lt; 1 year)</li>
              <li><strong>Individual:</strong> 7.5% (held &gt; 1 year)</li>
              <li><strong>Institution:</strong> 10% (flat)</li>
              <li>CGT applies only on net gains (after fees)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
