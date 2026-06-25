'use client';

import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ArrowRightLeft, Globe, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import AdBanner from '@/components/AdBanner';

// Top remittance sources for Nepal (prioritized at top of list)
const TOP_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SAR', 'AED', 'QAR', 'JPY', 'KRW', 'SGD', 'MYR', 'INR', 'CNY', 'HKD', 'CHF', 'NZD', 'SEK', 'NOK', 'THB', 'KWD', 'OMR', 'BHD', 'ILS'];

// Currency → flag emoji and name mapping (for the most common ones)
const CURRENCY_META: Record<string, { name: string; flag: string }> = {
  USD: { name: 'US Dollar', flag: '🇺🇸' },
  EUR: { name: 'Euro', flag: '🇪🇺' },
  GBP: { name: 'British Pound', flag: '🇬🇧' },
  AUD: { name: 'Australian Dollar', flag: '🇦🇺' },
  CAD: { name: 'Canadian Dollar', flag: '🇨🇦' },
  SAR: { name: 'Saudi Riyal', flag: '🇸🇦' },
  AED: { name: 'UAE Dirham', flag: '🇦🇪' },
  QAR: { name: 'Qatari Riyal', flag: '🇶🇦' },
  JPY: { name: 'Japanese Yen', flag: '🇯🇵' },
  KRW: { name: 'South Korean Won', flag: '🇰🇷' },
  SGD: { name: 'Singapore Dollar', flag: '🇸🇬' },
  MYR: { name: 'Malaysian Ringgit', flag: '🇲🇾' },
  INR: { name: 'Indian Rupee', flag: '🇮🇳' },
  CNY: { name: 'Chinese Yuan', flag: '🇨🇳' },
  HKD: { name: 'Hong Kong Dollar', flag: '🇭🇰' },
  CHF: { name: 'Swiss Franc', flag: '🇨🇭' },
  NZD: { name: 'New Zealand Dollar', flag: '🇳🇿' },
  SEK: { name: 'Swedish Krona', flag: '🇸🇪' },
  NOK: { name: 'Norwegian Krone', flag: '🇳🇴' },
  THB: { name: 'Thai Baht', flag: '🇹🇭' },
  KWD: { name: 'Kuwaiti Dinar', flag: '🇰🇼' },
  OMR: { name: 'Omani Rial', flag: '🇴🇲' },
  BHD: { name: 'Bahraini Dinar', flag: '🇧🇭' },
  ILS: { name: 'Israeli Shekel', flag: '🇮🇱' },
  DKK: { name: 'Danish Krone', flag: '🇩🇰' },
  PLN: { name: 'Polish Zloty', flag: '🇵🇱' },
  TRY: { name: 'Turkish Lira', flag: '🇹🇷' },
  ZAR: { name: 'South African Rand', flag: '🇿🇦' },
  BRL: { name: 'Brazilian Real', flag: '🇧🇷' },
  MXN: { name: 'Mexican Peso', flag: '🇲🇽' },
  RUB: { name: 'Russian Ruble', flag: '🇷🇺' },
  TWD: { name: 'Taiwan Dollar', flag: '🇹🇼' },
  PHP: { name: 'Philippine Peso', flag: '🇵🇭' },
  IDR: { name: 'Indonesian Rupiah', flag: '🇮🇩' },
  VND: { name: 'Vietnamese Dong', flag: '🇻🇳' },
  PKR: { name: 'Pakistani Rupee', flag: '🇵🇰' },
  BDT: { name: 'Bangladeshi Taka', flag: '🇧🇩' },
  LKR: { name: 'Sri Lankan Rupee', flag: '🇱🇰' },
  EGP: { name: 'Egyptian Pound', flag: '🇪🇬' },
  NGN: { name: 'Nigerian Naira', flag: '🇳🇬' },
  KES: { name: 'Kenyan Shilling', flag: '🇰🇪' },
};

// Fallback rates for top currencies (used when API is offline)
const FALLBACK_RATES: Record<string, number> = {
  USD: 134.5, EUR: 146.0, GBP: 171.0, AUD: 89.5, CAD: 98.0,
  SAR: 35.8, AED: 36.6, QAR: 36.9, JPY: 0.87, KRW: 0.097,
  SGD: 100.5, MYR: 28.9, INR: 1.61, CNY: 18.5, HKD: 17.2,
  CHF: 150.0, NZD: 82.0, SEK: 12.5, NOK: 12.3, THB: 3.65,
  KWD: 437.0, OMR: 349.0, BHD: 357.0, ILS: 36.0,
};

function getFlag(code: string): string {
  return CURRENCY_META[code]?.flag || '💱';
}

function getName(code: string): string {
  return CURRENCY_META[code]?.name || code;
}

export default function RemittanceCalculator() {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [availableCodes, setAvailableCodes] = useState<string[]>(['USD', ...Object.keys(FALLBACK_RATES).filter(c => c !== 'USD')]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [foreignAmount, setForeignAmount] = useState<number>(1000);
  const [nprAmount, setNprAmount] = useState<number>(134500);
  const [mode, setMode] = useState<'foreign-to-npr' | 'npr-to-foreign'>('foreign-to-npr');
  const [loading, setLoading] = useState(true);
  const [liveStatus, setLiveStatus] = useState<'live' | 'fallback'>('fallback');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [amountError, setAmountError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchRates() {
      try {
        setLoading(true);
        const res = await fetch('https://open.er-api.com/v6/latest/USD');
        const data = await res.json();
        if (data.rates?.NPR) {
          const usdToNpr = data.rates.NPR;
          const apiCodes = Object.keys(data.rates).filter(c => c !== 'USD');
          
          // Build sorted list: top currencies first, then rest alphabetically
          const top = TOP_CURRENCIES.filter(c => c !== 'USD' && apiCodes.includes(c));
          const rest = apiCodes.filter(c => !TOP_CURRENCIES.includes(c)).sort();
          setAvailableCodes(['USD', ...top, ...rest]);

          // Calculate NPR rate for every currency via USD
          const newRates: Record<string, number> = {};
          newRates.USD = usdToNpr;
          for (const code of apiCodes) {
            newRates[code] = usdToNpr / data.rates[code];
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
    const rate = rates[selectedCurrency] || 0;
    if (rate > 0) {
      if (mode === 'foreign-to-npr') {
        setNprAmount(Math.round(foreignAmount * rate * 100) / 100);
      } else {
        setForeignAmount(Math.round((nprAmount / rate) * 100) / 100);
      }
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

  // Filter currencies by search
  const filteredCodes = useMemo(() => {
    if (!searchQuery) return availableCodes;
    const q = searchQuery.toLowerCase();
    return availableCodes.filter(code =>
      code.toLowerCase().includes(q) ||
      getName(code).toLowerCase().includes(q)
    );
  }, [availableCodes, searchQuery]);

  const currentRate = rates[selectedCurrency] || 0;
  const flag = getFlag(selectedCurrency);
  const currencyName = getName(selectedCurrency);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Remittance & Forex Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Convert any foreign currency to Nepalese Rupee (NPR) using live exchange rates. 
          All 166 currencies supported — sourced from open exchange rate API.
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

          {/* Currency Search & Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Select Currency ({filteredCodes.length} available)
            </label>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search currency by name or code..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="max-h-32 overflow-y-auto flex flex-wrap gap-1.5 pb-1">
              {filteredCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => { setSelectedCurrency(code); setSearchQuery(''); }}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-all shrink-0 ${
                    selectedCurrency === code
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {getFlag(code)} {code}
                </button>
              ))}
            </div>
          </div>

          {/* Conversion Inputs */}
          <div className="space-y-4">
            <button
              onClick={() => setMode(mode === 'foreign-to-npr' ? 'npr-to-foreign' : 'foreign-to-npr')}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <ArrowRightLeft className="h-4 w-4" />
              {mode === 'foreign-to-npr' ? 'Convert Foreign → NPR' : 'Convert NPR → Foreign'}
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {flag} {selectedCurrency} — {currencyName}
                </label>
                <input
                  type="number"
                  value={mode === 'foreign-to-npr' ? (foreignAmount || '') : (foreignAmount || '')}
                  onChange={(e) => handleForeignChange(e.target.value)}
                  readOnly={mode === 'npr-to-foreign'}
                  className={`w-full pl-4 pr-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    mode === 'foreign-to-npr' 
                      ? 'border-blue-300 dark:border-blue-600' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                  }`}
                  placeholder="Enter amount"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  🇳🇵 Nepalese Rupee (NPR)
                </label>
                <input
                  type="number"
                  value={mode === 'npr-to-foreign' ? (nprAmount || '') : (nprAmount || '')}
                  onChange={(e) => handleNprChange(e.target.value)}
                  readOnly={mode === 'foreign-to-npr'}
                  className={`w-full pl-4 pr-4 py-3 rounded-xl border text-sm font-medium bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    mode === 'npr-to-foreign' 
                      ? 'border-blue-300 dark:border-blue-600' 
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50'
                  }`}
                  placeholder="Amount in NPR"
                />
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
                  Rs. {currentRate.toFixed(4)}
                </span>
              </div>
              <button
                onClick={() => {
                  setLoading(true);
                  setLiveStatus('fallback');
                  fetch('https://open.er-api.com/v6/latest/USD')
                    .then(r => r.json())
                    .then(data => {
                      if (data.rates?.NPR) {
                        const usdToNpr = data.rates.NPR;
                        const newRates: Record<string, number> = {};
                        newRates.USD = usdToNpr;
                        for (const code of Object.keys(data.rates)) {
                          if (code !== 'USD') newRates[code] = usdToNpr / data.rates[code];
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
              <Globe className="h-5 w-5 text-blue-500" /> Popular Rates
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {TOP_CURRENCIES.filter(c => rates[c]).map((code) => {
                const rate = rates[code] || 0;
                return (
                  <div
                    key={code}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-sm transition-all ${
                      selectedCurrency === code
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/20 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{getFlag(code)}</span>
                      <div>
                        <span className="font-semibold text-gray-900 dark:text-white">{code}</span>
                        <span className="text-[10px] text-gray-400 ml-1">{getName(code)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-gray-700 dark:text-gray-300 text-xs">
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
                <strong>166 currencies supported.</strong> Data sourced from open.er-api.com.
                Top remittance sources for Nepal: Saudi Arabia, UAE, Qatar, Malaysia, USA, UK, 
                Australia, Japan, and South Korea are prioritized at the top.
              </p>
              <p>
                <strong>Exchange rates:</strong> This tool provides mid-market rates. Actual rates 
                from banks and money transfer operators may include a markup of 1–5%.
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                {liveStatus === 'live' 
                  ? '✓ Using live exchange rates'
                  : '⚠ Using approximate rates. Connect to the internet for live rates.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
