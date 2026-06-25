'use client';

import { useState } from 'react';
import { Calculator, Info, Car, ShieldAlert } from 'lucide-react';

export default function RoadTaxEstimator() {
  const [vehicleType, setVehicleType] = useState<'bike' | 'car'>('bike');
  const [ccRange, setCcRange] = useState<string>('125');
  const [isElectric, setIsElectric] = useState<boolean>(false);
  const [kwRange, setKwRange] = useState<string>('50');

  // Annual Road Tax Estimates based on current Nepal DOTM rates
  const getBikeTax = (cc: string) => {
    switch (cc) {
      case '125': return 3000;
      case '150': return 5000;
      case '250': return 7000;
      case '400': return 11000;
      case 'above-400': return 20000;
      default: return 3000;
    }
  };

  const getBikeElectricTax = (kw: string) => {
    switch (kw) {
      case '50': return 1000; // Up to 50 kW
      case '100': return 2000; // 50 to 100 kW
      case 'above-100': return 5000;
      default: return 1000;
    }
  };

  const getCarTax = (cc: string) => {
    switch (cc) {
      case '1000': return 22000;
      case '1500': return 25000;
      case '2000': return 32000;
      case '2500': return 50000;
      case '2900': return 60000;
      case 'above-2900': return 75000;
      default: return 22000;
    }
  };

  const getCarElectricTax = (kw: string) => {
    switch (kw) {
      case '50': return 12000;
      case '100': return 15000;
      case '200': return 20000;
      case 'above-200': return 30000;
      default: return 12000;
    }
  };

  const taxAmount = vehicleType === 'bike'
    ? (isElectric ? getBikeElectricTax(kwRange) : getBikeTax(ccRange))
    : (isElectric ? getCarElectricTax(kwRange) : getCarTax(ccRange));

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepal Vehicle Road Tax Estimator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Estimate the annual road tax and registration renewal fees for your motorcycle, car, or electric vehicle (EV) under DOTM guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Car className="h-5 w-5 text-blue-500" />
            Vehicle Specifications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Vehicle Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setVehicleType('bike');
                    setCcRange('125');
                  }}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${vehicleType === 'bike' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                >
                  Motorcycle / Scooter
                </button>
                <button
                  onClick={() => {
                    setVehicleType('car');
                    setCcRange('1000');
                  }}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${vehicleType === 'car' ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                >
                  Car / Jeep / SUV
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Fuel Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setIsElectric(false)}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${!isElectric ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                >
                  Petrol / Diesel
                </button>
                <button
                  onClick={() => setIsElectric(true)}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${isElectric ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                >
                  Electric (EV)
                </button>
              </div>
            </div>

            {!isElectric ? (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Engine Capacity (CC)</label>
                <select
                  value={ccRange}
                  onChange={(e) => setCcRange(e.target.value)}
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium"
                >
                  {vehicleType === 'bike' ? (
                    <>
                      <option value="125">Up to 125 CC</option>
                      <option value="150">126 CC to 150 CC</option>
                      <option value="250">151 CC to 250 CC</option>
                      <option value="400">251 CC to 400 CC</option>
                      <option value="above-400">Above 400 CC</option>
                    </>
                  ) : (
                    <>
                      <option value="1000">Up to 1000 CC</option>
                      <option value="1500">1001 CC to 1500 CC</option>
                      <option value="2000">1501 CC to 2000 CC</option>
                      <option value="2500">2001 CC to 2500 CC</option>
                      <option value="2900">2501 CC to 2900 CC</option>
                      <option value="above-2900">Above 2900 CC</option>
                    </>
                  )}
                </select>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Motor Power (kW)</label>
                <select
                  value={kwRange}
                  onChange={(e) => setKwRange(e.target.value)}
                  className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium"
                >
                  {vehicleType === 'bike' ? (
                    <>
                      <option value="50">Up to 50 kW</option>
                      <option value="100">51 kW to 100 kW</option>
                      <option value="above-100">Above 100 kW</option>
                    </>
                  ) : (
                    <>
                      <option value="50">Up to 50 kW</option>
                      <option value="100">51 kW to 100 kW</option>
                      <option value="200">101 kW to 200 kW</option>
                      <option value="above-200">Above 200 kW</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold border-b border-white/20 pb-4">Estimated Road Tax</h2>
            <div className="space-y-4 text-center py-4">
              <span className="text-sm opacity-90 uppercase tracking-wider block font-semibold">Annual Tax Liability</span>
              <span className="text-4xl font-extrabold block">Rs. {taxAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" /> Renewal Tip
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              Tax must be cleared within the fiscal year. Delays attract a 10% penalty for the first 30 days, 20% up to 45 days, and 32% thereafter.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
