'use client';

import { useState } from 'react';
import { Layers, RefreshCw, Info } from 'lucide-react';

export default function LandConverter() {
  // --- Quick One-to-One State ---
  const [fromUnit, setFromUnit] = useState<string>('ropani');
  const [toUnit, setToUnit] = useState<string>('bigha');
  const [fromValue, setFromValue] = useState<number>(1);

  const unitSqFt: Record<string, number> = {
    ropani: 5476,
    aana: 342.25,
    paisa: 85.5625,
    daam: 21.390625,
    bigha: 72900,
    kattha: 3645,
    dhur: 182.25,
    sqft: 1,
    sqm: 10.7639104,
    hectare: 107639.104,
    acre: 43560
  };

  const unitLabels: Record<string, string> = {
    ropani: 'Ropani',
    aana: 'Aana',
    paisa: 'Paisa',
    daam: 'Daam',
    bigha: 'Bigha',
    kattha: 'Kattha',
    dhur: 'Dhur',
    sqft: 'Square Feet (sq. ft.)',
    sqm: 'Square Meters (sq. m.)',
    hectare: 'Hectare',
    acre: 'Acre'
  };

  // Quick converter result
  const quickResult = (fromValue * (unitSqFt[fromUnit] || 0)) / (unitSqFt[toUnit] || 1);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Land Measurement Converter
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Convert area units dynamically between Ropani, Bigha, Kattha, Dhur, Aana, Paisa, Daam, Acre, Hectare, and standard Sq. Ft / Sq. M.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Converter Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Layers className="h-5 w-5 text-blue-500" />
              Land Area Converter
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
              {/* From Box */}
              <div className="w-full md:flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">From</span>
                <select
                  value={fromUnit}
                  onChange={(e) => setFromUnit(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(unitLabels).map((key) => (
                    <option key={key} value={key}>{unitLabels[key]}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => setFromValue(Number(e.target.value))}
                  className="w-full py-3 px-4 text-2xl font-extrabold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Swap Indicator */}
              <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <RefreshCw className="h-5 w-5" />
              </div>

              {/* To Box */}
              <div className="w-full md:flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-2xl space-y-4">
                <span className="text-xs uppercase tracking-wider text-gray-400 font-bold block">To</span>
                <select
                  value={toUnit}
                  onChange={(e) => setToUnit(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.keys(unitLabels).map((key) => (
                    <option key={key} value={key}>{unitLabels[key]}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={parseFloat(quickResult.toFixed(5))}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const calculatedFrom = (val * unitSqFt[toUnit]) / unitSqFt[fromUnit];
                    setFromValue(calculatedFrom);
                  }}
                  className="w-full py-3 px-4 text-2xl font-extrabold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-950 rounded-xl text-xs text-blue-600 dark:text-blue-400 leading-relaxed">
              <strong>Conversion Formula:</strong> 1 {unitLabels[fromUnit]} = {(unitSqFt[fromUnit] / unitSqFt[toUnit]).toLocaleString(undefined, { maximumFractionDigits: 5 })} {unitLabels[toUnit]}.
            </div>
          </div>
        </div>

        {/* Educational Info */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Info className="h-5 w-5 text-indigo-500" />
            Nepali Land Units Reference
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-300 space-y-4">
            <p>
              In Nepal, land is measured using two entirely different regional systems depending on topography.
            </p>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Hilly System (Pahad / Kathmandu Valley)</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>1 Ropani = 16 Aana (5476 sq. ft.)</li>
                <li>1 Aana = 4 Paisa (342.25 sq. ft.)</li>
                <li>1 Paisa = 4 Daam (85.56 sq. ft.)</li>
                <li>1 Daam = 21.39 sq. ft.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Terai System (Southern Plains)</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>1 Bigha = 20 Kattha (72,900 sq. ft.)</li>
                <li>1 Kattha = 20 Dhur (3,645 sq. ft.)</li>
                <li>1 Dhur = 182.25 sq. ft.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white mb-2">Standard & International Units</h4>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li>1 Acre = 43,560 sq. ft.</li>
                <li>1 Hectare = 107,639.10 sq. ft.</li>
                <li>1 Sq. Meter = 10.7639 sq. ft.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
