'use client';

import { useState } from 'react';
import { Calculator, Lightbulb, Info } from 'lucide-react';

export default function ElectricityBillEstimator() {
  const [units, setUnits] = useState<number>(120);
  const [ampere, setAmpere] = useState<'5A' | '15A' | '30A' | '60A'>('5A');
  const [tariffYear, setTariffYear] = useState<'2083' | '2080'>('2083');

  const calculateBill = (totalUnits: number, amp: string, year: string) => {
    let energyCharge = 0;
    let minCharge = 30;
    let vatAmount = 0;

    if (year === '2083') {
      // --- 2083 BS Tariff with 5% VAT on units above 50 ---
      let first50EnergyCharge = 0;

      if (amp === '5A') {
        // Energy Charge Calculation
        if (totalUnits <= 20) {
          minCharge = 30;
          energyCharge = 0; // Lifeline rule: free energy charge
        } else if (totalUnits <= 30) {
          minCharge = 50;
          energyCharge = (totalUnits - 20) * 6.50;
        } else if (totalUnits <= 50) {
          minCharge = 50;
          energyCharge = (10 * 6.50) + (totalUnits - 30) * 8.00;
        } else if (totalUnits <= 150) {
          minCharge = 75;
          energyCharge = (20 * 3.00) + (10 * 6.50) + (20 * 8.00) + (totalUnits - 50) * 9.50;
        } else if (totalUnits <= 250) {
          minCharge = 100;
          energyCharge = (20 * 3.00) + (10 * 6.50) + (20 * 8.00) + (100 * 9.50) + (totalUnits - 150) * 9.50;
        } else {
          minCharge = 150;
          energyCharge = (20 * 3.00) + (10 * 6.50) + (20 * 8.00) + (100 * 9.50) + (100 * 9.50) + (totalUnits - 250) * 11.00;
        }

        // Energy charge of first 50 units for 5A: 20 * 3 + 10 * 6.50 + 20 * 8.00 = 285
        first50EnergyCharge = 285;
      } else {
        // 15A, 30A, 60A connection rates (concessional rates)
        const baseRate = amp === '15A' ? 4.50 : amp === '30A' ? 5.00 : 6.00;
        
        // Fixed charges based on amp
        const slabIndex = totalUnits <= 20 ? 0 : totalUnits <= 50 ? 1 : totalUnits <= 150 ? 2 : totalUnits <= 250 ? 3 : 4;
        const demandChargesMap: Record<string, number[]> = {
          '15A': [50, 75, 100, 125, 175],
          '30A': [75, 100, 125, 150, 200],
          '60A': [125, 125, 150, 200, 250],
        };
        minCharge = demandChargesMap[amp]?.[slabIndex] || 100;

        if (totalUnits <= 20) {
          energyCharge = totalUnits * baseRate;
        } else if (totalUnits <= 30) {
          energyCharge = (20 * baseRate) + (totalUnits - 20) * 7.00;
        } else if (totalUnits <= 50) {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (totalUnits - 30) * 8.50;
        } else if (totalUnits <= 150) {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50) + (totalUnits - 50) * 10.00;
        } else if (totalUnits <= 250) {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50) + (100 * 10.00) + (totalUnits - 150) * 11.00;
        } else {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50) + (100 * 10.00) + (100 * 11.00) + (totalUnits - 250) * 13.00;
        }

        first50EnergyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50);
      }

      // 5% VAT applies on energy charges exceeding the first 50 units
      if (totalUnits > 50) {
        const vatableEnergy = Math.max(0, energyCharge - first50EnergyCharge);
        vatAmount = vatableEnergy * 0.05;
      }
    } else {
      // --- 2080 BS Tariff (VAT free) ---
      if (amp === '5A') {
        if (totalUnits <= 20) {
          minCharge = 30;
          energyCharge = totalUnits * 0;
        } else if (totalUnits <= 30) {
          minCharge = 50;
          energyCharge = (totalUnits - 20) * 6.50;
        } else if (totalUnits <= 50) {
          minCharge = 75;
          energyCharge = (10 * 6.50) + (totalUnits - 30) * 8.00;
        } else if (totalUnits <= 100) {
          minCharge = 100;
          energyCharge = (10 * 6.50) + (20 * 8.00) + (totalUnits - 50) * 9.50;
        } else if (totalUnits <= 250) {
          minCharge = 125;
          energyCharge = (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (totalUnits - 100) * 9.50;
        } else {
          minCharge = 150;
          energyCharge = (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (150 * 9.50) + (totalUnits - 250) * 11.00;
        }
      } else {
        if (totalUnits <= 20) {
          minCharge = 100;
          energyCharge = totalUnits * 4.00;
        } else if (totalUnits <= 30) {
          minCharge = 125;
          energyCharge = (20 * 4.00) + (totalUnits - 20) * 6.50;
        } else if (totalUnits <= 50) {
          minCharge = 150;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (totalUnits - 30) * 8.00;
        } else if (totalUnits <= 100) {
          minCharge = 175;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (20 * 8.00) + (totalUnits - 50) * 9.50;
        } else if (totalUnits <= 250) {
          minCharge = 200;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (totalUnits - 100) * 10.00;
        } else {
          minCharge = 250;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (150 * 10.00) + (totalUnits - 250) * 12.00;
        }
      }
    }

    return {
      minCharge,
      energyCharge,
      vatAmount,
      total: minCharge + energyCharge + vatAmount
    };
  };

  const bill = calculateBill(units, ampere, tariffYear);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          NEA Electricity Bill Estimator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Estimate your monthly electricity bill based on current Nepal Electricity Authority (NEA) tariff rates, connection capacity, and updated VAT laws.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            Consumption Details
          </h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tariff Year</label>
                <select
                  value={tariffYear}
                  onChange={(e) => setTariffYear(e.target.value as '2083' | '2080')}
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium"
                >
                  <option value="2083">2083 Tariff (5% Concessional VAT)</option>
                  <option value="2080">2080 Tariff (VAT Exempt)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Meter Connection Type</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['5A', '15A', '30A', '60A'] as const).map((amp) => (
                    <button
                      key={amp}
                      onClick={() => setAmpere(amp)}
                      className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${ampere === amp ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                    >
                      {amp}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Units Consumed (kWh)</label>
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{units} Units</span>
              </div>
              <input
                type="range"
                min="0"
                max="1000"
                step="5"
                value={units}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <input
                type="number"
                value={units || ''}
                onChange={(e) => setUnits(Number(e.target.value))}
                className="mt-2 w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-yellow-500 to-amber-600 text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold border-b border-white/20 pb-4">Estimated Bill Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Fixed Demand Charge:</span>
                <span className="font-semibold">Rs. {bill.minCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Energy Charge:</span>
                <span className="font-semibold">Rs. {bill.energyCharge.toFixed(2)}</span>
              </div>
              {tariffYear === '2083' && (
                <div className="flex justify-between text-sm">
                  <span className="opacity-90">VAT (5% on units &gt; 50):</span>
                  <span className="font-semibold text-yellow-100">Rs. {bill.vatAmount.toFixed(2)}</span>
                </div>
              )}
              <hr className="border-white/20" />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total Bill Amount:</span>
                <span className="font-extrabold text-2xl">Rs. {bill.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" /> 2083 VAT Details
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              In 2083 BS, a **5% concessional VAT** is implemented on domestic electricity bills. 
              The first **50 units** are completely exempt. VAT is applied only to the energy charge of units exceeding 50. No VAT is charged on the fixed demand charge.
            </p>
          </div>
        </div>
      </div>

      {/* Reference Table Section */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">NEA Domestic Tariff Rates (FY 2083/84)</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-left text-sm">
            <thead>
              <tr className="text-gray-900 dark:text-white font-semibold">
                <th className="py-3 px-4">Consumption Slab (Monthly)</th>
                <th className="py-3 px-4">5A Connection Rate</th>
                <th className="py-3 px-4">15A Connection Rate</th>
                <th className="py-3 px-4">VAT Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <td className="py-3 px-4 font-medium">0 – 20 Units</td>
                <td className="py-3 px-4">Rs. 0 (Lifeline) / Rs. 3.00</td>
                <td className="py-3 px-4">Rs. 4.50</td>
                <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">Exempt</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">21 – 30 Units</td>
                <td className="py-3 px-4">Rs. 6.50</td>
                <td className="py-3 px-4">Rs. 7.00</td>
                <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">Exempt</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">31 – 50 Units</td>
                <td className="py-3 px-4">Rs. 8.00</td>
                <td className="py-3 px-4">Rs. 8.50</td>
                <td className="py-3 px-4 text-green-600 dark:text-green-400 font-semibold">Exempt</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">51 – 150 Units</td>
                <td className="py-3 px-4">Rs. 9.50</td>
                <td className="py-3 px-4">Rs. 10.00</td>
                <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">5% VAT applies</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">151 – 250 Units</td>
                <td className="py-3 px-4">Rs. 9.50</td>
                <td className="py-3 px-4">Rs. 11.00</td>
                <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">5% VAT applies</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">251+ Units</td>
                <td className="py-3 px-4">Rs. 11.00</td>
                <td className="py-3 px-4">Rs. 13.00</td>
                <td className="py-3 px-4 text-blue-600 dark:text-blue-400 font-semibold">5% VAT applies</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
