'use client';

import { useState, useEffect } from 'react';
import { Calculator, Award, Info, Coins, RefreshCw, CheckCircle2 } from 'lucide-react';

import AdBanner from '@/components/AdBanner';
export default function GoldPriceEstimator() {
  const [goldRate, setGoldRate] = useState<number>(142000); // NPR per Tola for Fine Gold (Fallback Default)
  const [purity, setPurity] = useState<'24k' | '22k'>('24k');
  const [weightTola, setWeightTola] = useState<number>(1);
  const [weightLal, setWeightLal] = useState<number>(0);
  const [makingChargesPercent, setMakingChargesPercent] = useState<number>(8); // 8% average making charges in Nepal
  const [loading, setLoading] = useState<boolean>(true);
  const [liveStatus, setLiveStatus] = useState<'live' | 'fallback'>('fallback');

  useEffect(() => {
    async function fetchLiveGoldPrice() {
      try {
        setLoading(true);
        // Fetch Pax Gold price (representing 1 Troy Ounce of Gold in USD)
        const paxgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd');
        const paxgData = await paxgRes.json();
        const goldUsdPerOz = paxgData['pax-gold']?.usd;

        // Fetch USD to NPR exchange rate
        const forexRes = await fetch('https://open.er-api.com/v6/latest/USD');
        const forexData = await forexRes.json();
        const usdToNpr = forexData.rates?.NPR;

        if (goldUsdPerOz && usdToNpr) {
          // 1 Tola = 11.664g. 1 Troy Ounce = 31.1034768g. Ratio is 11.664/31.1034768 = 0.375
          const calculatedGoldRate = Math.round(goldUsdPerOz * usdToNpr * 0.375);
          setGoldRate(calculatedGoldRate);
          setLiveStatus('live');
        }
      } catch (err) {
        console.error('Error fetching live gold price:', err);
        setLiveStatus('fallback');
      } finally {
        setLoading(false);
      }
    }
    fetchLiveGoldPrice();
  }, []);

  // 1 Tola = 100 Lal = 11.664 grams
  const rateMultiplier = purity === '24k' ? 1.0 : 0.995; // Tejabi is slightly cheaper than Fine gold
  const activeRate = goldRate * rateMultiplier;

  const totalTolaWeight = weightTola + (weightLal / 100);
  const goldValue = totalTolaWeight * activeRate;
  const makingCharges = goldValue * (makingChargesPercent / 100);
  const totalValuation = goldValue + makingCharges;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Gold & Jewelry Value Estimator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Estimate the total cost of purchasing or selling gold jewelry in Nepal based on weight (Tola and Lal), purity, live gold rate, and making charges.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Coins className="h-5 w-5 text-amber-500" />
              Jewelry Estimator
            </h2>
            {loading ? (
              <span className="text-xs font-semibold px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 rounded-full flex items-center gap-1.5 animate-pulse">
                <RefreshCw className="h-3 w-3 animate-spin" /> Fetching Live Price...
              </span>
            ) : liveStatus === 'live' ? (
              <span className="text-xs font-semibold px-2.5 py-1 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3" /> Live Price Loaded
              </span>
            ) : (
              <span className="text-xs font-semibold px-2.5 py-1 bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center gap-1.5 animate-pulse">
                <Info className="h-3 w-3" /> Fallback Price Active
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Base Gold Rate (NPR per Tola)</label>
              <input
                type="number"
                value={goldRate || ''}
                onChange={(e) => {
                  setGoldRate(Number(e.target.value));
                  setLiveStatus('fallback'); // Override to fallback status if manually edited
                }}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Gold Purity Type</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPurity('24k')}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${purity === '24k' ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                >
                  Fine Gold (24K)
                </button>
                <button
                  onClick={() => setPurity('22k')}
                  className={`py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${purity === '22k' ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50'}`}
                >
                  Tejabi Gold (22K)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weight in Tola</label>
              <input
                type="number"
                value={weightTola || ''}
                onChange={(e) => setWeightTola(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Weight in Lal</label>
              <input
                type="number"
                value={weightLal || ''}
                onChange={(e) => setWeightLal(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Making Charges (%)</label>
              <input
                type="number"
                value={makingChargesPercent || ''}
                onChange={(e) => setMakingChargesPercent(Number(e.target.value))}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-amber-500 to-yellow-600 text-white p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-xl font-bold border-b border-white/20 pb-4">Valuation Estimate</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Total Weight:</span>
                <span className="font-semibold">{totalTolaWeight.toFixed(2)} Tola ({(totalTolaWeight * 11.664).toFixed(3)}g)</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Gold Base Price:</span>
                <span className="font-semibold">Rs. {Math.round(goldValue).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="opacity-90">Making Charges:</span>
                <span className="font-semibold">Rs. {Math.round(makingCharges).toLocaleString()}</span>
              </div>
              <hr className="border-white/20" />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total Estimated Value:</span>
                <span className="font-extrabold text-2xl text-yellow-100">Rs. {Math.round(totalValuation).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-amber-500" /> Gold Units in Nepal
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              In Nepal, gold is traditionally measured in Tola, Anna, and Lal.
              <br />
              1 Tola = 16 Anna = 100 Lal = 11.664 Grams.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
