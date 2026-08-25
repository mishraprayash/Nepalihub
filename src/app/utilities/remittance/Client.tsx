'use client';

import { useState, useEffect, useMemo } from 'react';
import { RefreshCw, ArrowRightLeft, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, ResultStat } from '@/components/ui/fields';

const TOP_CURRENCIES = ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'SAR', 'AED', 'QAR', 'JPY', 'KRW', 'SGD', 'MYR', 'INR', 'CNY', 'HKD', 'CHF', 'NZD', 'SEK', 'NOK', 'THB', 'KWD', 'OMR', 'BHD', 'ILS'];

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
};

const FALLBACK_RATES: Record<string, number> = {
  USD: 134.5, EUR: 146.0, GBP: 171.0, AUD: 89.5, CAD: 98.0,
  SAR: 35.8, AED: 36.6, QAR: 36.9, JPY: 0.87, KRW: 0.097,
  SGD: 100.5, MYR: 28.9, INR: 1.61, CNY: 18.5, HKD: 17.2,
  CHF: 150.0, NZD: 82.0, SEK: 12.5, NOK: 12.3, THB: 3.65,
  KWD: 437.0, OMR: 349.0, BHD: 357.0, ILS: 36.0,
};

const getFlag = (code: string) => CURRENCY_META[code]?.flag || '💱';
const getName = (code: string) => CURRENCY_META[code]?.name || code;

export default function RemittanceCalculator() {
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [availableCodes, setAvailableCodes] = useState<string[]>(['USD', ...Object.keys(FALLBACK_RATES).filter(c => c !== 'USD')]);
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  // Single source of truth — the other side is always derived from it
  const [amount, setAmount] = useState<number>(1000);
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

          const top = TOP_CURRENCIES.filter(c => c !== 'USD' && apiCodes.includes(c));
          const rest = apiCodes.filter(c => !TOP_CURRENCIES.includes(c)).sort();
          setAvailableCodes(['USD', ...top, ...rest]);

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

  const currentRate = rates[selectedCurrency] || 0;
  const foreignAmount = mode === 'foreign-to-npr'
    ? amount
    : currentRate > 0 ? Math.round((amount / currentRate) * 100) / 100 : 0;
  const nprAmount = mode === 'foreign-to-npr'
    ? currentRate > 0 ? Math.round(amount * currentRate * 100) / 100 : 0
    : amount;

  const handleAmountChange = (value: string, which: 'foreign' | 'npr') => {
    const num = parseFloat(value) || 0;
    if (num < 0) { setAmountError('Amount cannot be negative'); return; }
    setAmountError('');
    if (
      (which === 'foreign' && mode === 'foreign-to-npr') ||
      (which === 'npr' && mode === 'npr-to-foreign')
    ) {
      setAmount(num);
    } else if (which === 'npr') {
      setAmount(currentRate > 0 ? num / currentRate : 0);
    } else {
      setAmount(currentRate > 0 ? num * currentRate : 0);
    }
  };

  const refreshRates = () => {
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
  };

  const filteredCodes = useMemo(() => {
    if (!searchQuery) return availableCodes;
    const q = searchQuery.toLowerCase();
    return availableCodes.filter(code =>
      code.toLowerCase().includes(q) ||
      getName(code).toLowerCase().includes(q)
    );
  }, [availableCodes, searchQuery]);

  const currencyName = getName(selectedCurrency);

  const inputClass = (active: boolean, readOnly: boolean) =>
    `w-full py-3 px-4 text-sm font-semibold bg-surface-raised border rounded-xl text-ink tabular-nums focus:outline-none focus:border-simrik/60 focus:ring-3 focus:ring-simrik/10 transition-all ${
      active ? 'border-simrik/40' : readOnly ? 'border-line bg-paper-deep/50 text-ink-soft' : 'border-line'
    }`;

  return (
    <ToolShell
      category="Utilities"
      title="Remittance & Forex"
      badge="Live rates"
      description="Convert any of 166 currencies to Nepalese Rupees at live mid-market rates — with the corridors Nepalis actually send money from pinned to the top."
      aside={
        <>
          <Panel>
            <ResultStat
              label={mode === 'foreign-to-npr'
                ? `${getFlag(selectedCurrency)} ${foreignAmount.toLocaleString()} ${selectedCurrency} equals`
                : `Rs. ${nprAmount.toLocaleString()} NPR equals`}
              value={mode === 'foreign-to-npr'
                ? `Rs. ${nprAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                : `${getFlag(selectedCurrency)} ${foreignAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${selectedCurrency}`}
              emphasis
            />
            <div className="flex items-center justify-between gap-2 pt-2">
              <p className="text-sm text-ink-soft">
                <span className="font-bold text-ink">1 {selectedCurrency}</span> = Rs. {currentRate.toFixed(4)}
              </p>
              <button
                onClick={refreshRates}
                disabled={loading}
                className="p-2 rounded-lg border border-line hover:border-simrik/40 hover:text-simrik text-ink-faint transition-colors"
                aria-label="Refresh rates"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            <div className="flex items-center gap-2 pt-2">
              {liveStatus === 'live' ? (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-pine bg-pine/10 px-2 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Live rates
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[11px] font-semibold text-brass bg-brass/10 px-2 py-1 rounded-full">
                  <AlertCircle className="h-3 w-3" /> Approximate
                </span>
              )}
              {lastUpdated && <span className="text-[11px] text-ink-faint">{lastUpdated}</span>}
            </div>
            {amountError && <p className="text-xs text-simrik pt-2">{amountError}</p>}
          </Panel>

          <Panel title="Popular corridors">
            <div className="space-y-0.5 max-h-80 overflow-y-auto pr-1">
              {TOP_CURRENCIES.filter(c => rates[c]).map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedCurrency(code)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedCurrency === code
                      ? 'bg-simrik/[0.07] font-semibold text-ink'
                      : 'text-ink-soft hover:bg-paper-deep'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span>{getFlag(code)}</span>
                    <span className="font-semibold">{code}</span>
                    <span className="text-[11px] text-ink-faint truncate hidden sm:inline">{getName(code)}</span>
                  </span>
                  <span className="font-mono text-xs tabular-nums">Rs. {(rates[code] || 0).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </Panel>

          <p className="text-xs text-ink-faint leading-relaxed px-1">
            Mid-market rates from open.er-api.com — banks and transfer operators typically add a 1–5% markup.
          </p>
        </>
      }
    >
      <Panel title="Converter">
        <div className="space-y-6">
          {/* Currency search */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={`Search ${availableCodes.length} currencies…`}
                className="w-full py-2.5 pl-10 pr-4 text-sm bg-surface-raised border border-line rounded-xl text-ink placeholder:text-ink-faint focus:outline-none focus:border-simrik/60 focus:ring-3 focus:ring-simrik/10 transition-all"
              />
            </div>
            <div className="max-h-28 overflow-y-auto flex flex-wrap gap-1.5 pb-1">
              {filteredCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => { setSelectedCurrency(code); setSearchQuery(''); }}
                  className={`py-1.5 px-2.5 rounded-lg border text-xs font-semibold transition-colors shrink-0 ${
                    selectedCurrency === code
                      ? 'bg-simrik text-white border-simrik'
                      : 'border-line text-ink-soft hover:border-simrik/40 hover:text-simrik'
                  }`}
                >
                  {getFlag(code)} {code}
                </button>
              ))}
            </div>
          </div>

          {/* Amounts */}
          <div className="grid sm:grid-cols-[1fr_auto_1fr] gap-3 items-end">
            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-ink-soft">
                {getFlag(selectedCurrency)} {currencyName}
              </label>
              <input
                type="number"
                value={foreignAmount || ''}
                onChange={(e) => handleAmountChange(e.target.value, 'foreign')}
                readOnly={mode === 'npr-to-foreign'}
                className={inputClass(mode === 'foreign-to-npr', mode === 'npr-to-foreign')}
                placeholder="Enter amount"
              />
            </div>

            <button
              onClick={() => setMode(mode === 'foreign-to-npr' ? 'npr-to-foreign' : 'foreign-to-npr')}
              className="h-10 w-10 mx-auto flex items-center justify-center rounded-full border border-line text-ink-faint hover:text-simrik hover:border-simrik/40 transition-colors"
              aria-label="Swap direction"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </button>

            <div className="space-y-1.5">
              <label className="block text-[13px] font-medium text-ink-soft">🇳🇵 Nepalese Rupee</label>
              <input
                type="number"
                value={nprAmount || ''}
                onChange={(e) => handleAmountChange(e.target.value, 'npr')}
                readOnly={mode === 'foreign-to-npr'}
                className={inputClass(mode === 'npr-to-foreign', mode === 'foreign-to-npr')}
                placeholder="Amount in NPR"
              />
            </div>
          </div>
        </div>
      </Panel>
    </ToolShell>
  );
}
