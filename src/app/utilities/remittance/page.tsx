'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft, Globe, AlertCircle, CheckCircle2 } from 'lucide-react';

const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'CAD', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'AED', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'QAR', name: 'Qatari Riyal', flag: '🇶🇦' },
  { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'KRW', name: 'South Korean Won', flag: '🇰🇷' },
  { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾' },
];

// Fallback rates (approximate) — used when API is unavailable
const FALLBACK_RATES: Record<string, number> = {
  USD: 134.5, EUR: 146.0, GBP: 171.0, AUD: 89.5, CAD: 98.0,
  SAR: 35.8, AED: 36.6, QAR: 36.9, JPY: 0.87, KRW: 0.097,
  SGD: 100.5, MYR: 28.9,
};

export default function RemittanceCalculator() {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState<number>(1000);
  const [nprAmount, setNprAmount] = useState<number>(134500);
  const [mode, setMode] = useState<'foreign-to-npr' | 'npr-to-foreign'>('foreign-to-npr');
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState<'live' | 'fallback'>('fallback');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [amountError, setAmountError] = useState('');

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.rates?.NPR) {
          const usdToNpr = data.rates.NPR;
          const newRates: Record<string, number> = { ...FALLBACK_RATES };
          
          // Calculate NPR rate for each currency via USD
          for (const currency of CURRENCIES) {
            if (currency.code === 'USD') {
              newRates[currency.code] = usdToNpr;
            } else if (data.rates[currency.code]) {
              // NPR per unit of foreign currency = USD rate / foreign currency rate * USD→NPR
              newRates[currency.code] = usdToNpr / data.rates[currency.code];
            }
          }
          
          setRates(newRates);
          setLiveStatus('live');
          setLastUpdated(new Date().toLocaleString());
        }
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setLiveStatus('fallback');
      } finally {
        setLoading(false);
      }
    }
    fetchRates();
  }, []);

  // Recalculate when inputs change
  useEffect(() => {
    const rate = rates[selectedCurrency] || FALLBACK_RATES[selectedCurrency];
    if (mode === 'foreign-to-npr') {
      setNprAmount(Math.round(foreignAmount * rate * 100) / 100);
    } else {
      setForeignAmount(Math.round((nprAmount / rate) * 100) / 100);
    }
  }, [foreignAmount, nprAmount, selectedCurrency, mode, rates]);

  const handleForeignChange = (value: string) => {
    const num = parseFloat(value) || 0;
    if (num < 0) { setAmountError('Amount cannot be negative'); return; }
    setAmountError('');
    setForeignAmount(num);
  };

  const handleNprChange = (value: string) => {
    const num = parseFloat(value) || 0;
    if (num < 0) { setAmountError('Amount cannot be negative'); return; }
    setAmountError('');
    setNprAmount(num);
  };

  const currentRate = rates[selectedCurrency] || FALLBACK_RATES[selectedCurrency];
  const flag = CURRENCIES.find(c => c.code === selectedCurrency)?.flag || '';
  const currencyName = CURRENCIES.find(c => c.code === selectedCurrency)?.name || selectedCurrency;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Remittance & Forex Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Convert foreign currencies to Nepalese Rupee (NPR) using live exchange rates. 
          Perfect for remittances, overseas income, and travel planning.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Converter Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Globe className="h-5 w-5 text-blue-500" />
              Currency Converter
            </h2>
            <div className="flex items-center gap-2">
              {liveStatus === 'live' ? (
                <span className="flex items-center gap-1 text-[11px] text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-2.5 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-900/30 px-2.5 py-1 rounded-full">
                  <AlertCircle className="h-3 w-3" /> Approximate
                </span>
              )}
            </div>
          </div>

          {/* Currency Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Currency
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {CURRENCIES.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setSelectedCurrency(c.code)}
                  className={`py-2 px-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedCurrency === c.code
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {c.flag} {c.code}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Inputs */}
          <div className="space-y-4">
            {/* Mode Toggle */}
            <button
              onClick={() => setMode(mode === 'foreign-to-npr' ? 'npr-to-foreign' : 'foreign-to-npr')}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowRightLeft className="h-4 w-4" />
              {mode === 'foreign-to-npr' ? 'Convert Foreign → NPR' : 'Convert NPR → Foreign'}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Foreign Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {flag} {selectedCurrency} Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 dark:text-gray-400 font-bold text-sm">
                    {selectedCurrency === 'JPY' || selectedCurrency === 'KRW' ? '¥' : selectedCurrency === 'GBP' ? '£' : selectedCurrency === 'EUR' ? '€' : '$'}
                  </span>
                  <input
                    type="number"
                    value={mode === 'foreign-to-npr' ? (foreignAmount || '') : (foreignAmount || '')}
                    onChange={(e) => handleForeignChange(e.target.value)}
                    readOnly={mode === 'npr-to-foreign'}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mode === 'foreign-to-npr' 
                        ? 'border-blue-300 dark:border-blue-600' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                    }`}
                    placeholder="Enter amount"
                  />
                </div>
              </div>

              {/* NPR Amount */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  🇳🇵 Nepalese Rupee (NPR)
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 dark:text-gray-400 font-bold text-sm">
                    Rs.
                  </span>
                  <input
                    type="number"
                    value={mode === 'npr-to-foreign' ? (nprAmount || '') : (nprAmount || '')}
                    onChange={(e) => handleNprChange(e.target.value)}
                    readOnly={mode === 'foreign-to-npr'}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      mode === 'npr-to-foreign' 
                        ? 'border-blue-300 dark:border-blue-600' 
                        : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                    }`}
                    placeholder="Amount in NPR"
                  />
                </div>
              </div>
            </div>

            {amountError && (
              <p className="text-sm text-red-500">{amountError}</p>
            )}
          </div>

          {/* Exchange Rate Display */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  1 {selectedCurrency} = 
                </span>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400 ml-2">
                  Rs. {currentRate.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => {
                  setLoading(true);
                  setLiveStatus('fallback');
                  // Re-fetch rates
                  fetch('https://open.er-api.com/v6/latest/USD')
                    .then(r => r.json())
                    .then(data => {
                      if (data.rates?.NPR) {
                        const usdToNpr = data.rates.NPR;
                        const newRates: Record<string, number> = {};
                        for (const currency of CURRENCIES) {
                          if (currency.code === 'USD') newRates[currency.code] = usdToNpr;
                          else if (data.rates[currency.code])
                            newRates[currency.code] = usdToNpr / data.rates[currency.code];
                        }
                        setRates(newRates);
                        setLiveStatus('live');
                        setLastUpdated(new Date().toLocaleString());
                      }
                    })
                    .catch(() => setLiveStatus('fallback'))
                    .finally(() => setLoading(false));
                }}
                disabled={loading}
                className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-blue-500"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
              <span>{currencyName}</span>
              {lastUpdated && <span>Updated: {lastUpdated}</span>}
            </div>
          </div>

          {/* Conversion Result */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl">
            <h3 className="text-sm font-semibold opacity-90 mb-2">
              {mode === 'foreign-to-npr' 
                ? `${flag} ${foreignAmount.toLocaleString()} ${selectedCurrency} =`
                : `🇳🇵 Rs. ${nprAmount.toLocaleString()} NPR =`}
            </h3>
            <div className="text-3xl font-extrabold">
              {mode === 'foreign-to-npr'
                ? `Rs. ${nprAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`
                : `${flag} ${foreignAmount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${selectedCurrency}`
              }
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-500" /> All Exchange Rates
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {CURRENCIES.map((c) => {
                const rate = rates[c.code] || FALLBACK_RATES[c.code];
                return (
                  <div
                    key={c.code}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${
                      selectedCurrency === c.code
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/20 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{c.flag}</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{c.code}</span>
                        <span className="text-xs text-gray-400 ml-1">{c.name}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300">
                      Rs. {rate.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">About Remittance</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 leading-relaxed">
              <p>
                <strong>Top remittance sources for Nepal:</strong> Saudi Arabia, UAE, Qatar, 
                Malaysia, USA, UK, Australia, Japan, and South Korea.
              </p>
              <p>
                <strong>Maximum remittance limits:</strong> Most banks and money transfer operators 
                have limits per transaction. Nepal Rastra Bank (NRB) regulates inbound remittances.
              </p>
              <p>
                <strong>Exchange rates:</strong> This tool provides mid-market rates. Actual rates 
                from banks, money transfer services (eSewa, Khalti, IME, Western Union, etc.) 
                may include a markup of 1–5%.
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                {liveStatus === 'live' 
                  ? '✓ Using live exchange rates from open.er-api.com'
                  : '⚠ Using approximate rates. Connect to the internet for live rates.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
