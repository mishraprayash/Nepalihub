'use client';

import { useState } from 'react';
import { Calendar, RefreshCw, Info, CheckCircle2 } from 'lucide-react';
import { NepaliDateConverter } from '@/utils/nepaliDateConverter';

export default function DateConverter() {
  const [conversionType, setConversionType] = useState<'bsToAd' | 'adToBs'>('bsToAd');
  
  // BS States
  const [bsYear, setBsYear] = useState<number>(2083);
  const [bsMonth, setBsMonth] = useState<number>(1);
  const [bsDay, setBsDay] = useState<number>(1);
  const [adResult, setAdResult] = useState<string>('2026-04-14');

  // AD States
  const [adYear, setAdYear] = useState<number>(2026);
  const [adMonth, setAdMonth] = useState<number>(4);
  const [adDay, setAdDay] = useState<number>(14);
  const [bsResult, setBsResult] = useState<string>('2083-01-01');

  const nepaliMonths = [
    'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
    'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
  ];

  const englishMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleBsToAdConvert = () => {
    try {
      const mmStr = bsMonth < 10 ? `0${bsMonth}` : `${bsMonth}`;
      const ddStr = bsDay < 10 ? `0${bsDay}` : `${bsDay}`;
      const res = NepaliDateConverter.bsToAd(`${bsYear}-${mmStr}-${ddStr}`);
      setAdResult(res);
    } catch (err: any) {
      alert(err.message || 'Invalid date combination');
    }
  };

  const handleAdToBsConvert = () => {
    try {
      const mmStr = adMonth < 10 ? `0${adMonth}` : `${adMonth}`;
      const ddStr = adDay < 10 ? `0${adDay}` : `${adDay}`;
      const res = NepaliDateConverter.adToBs(`${adYear}-${mmStr}-${ddStr}`);
      setBsResult(res);
    } catch (err: any) {
      alert(err.message || 'Invalid date combination');
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali ↔ English Date Converter
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Convert dates bidirectionally between Bikram Sambat (BS) and Gregorian calendar (AD) from years 1978 BS to 2099 BS.
        </p>
      </div>

      {/* Selector Mode */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-800 pb-3">
        <button
          onClick={() => setConversionType('bsToAd')}
          className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${conversionType === 'bsToAd' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        >
          Nepali (BS) to English (AD)
        </button>
        <button
          onClick={() => setConversionType('adToBs')}
          className={`py-2 px-4 rounded-xl text-sm font-semibold transition-all ${conversionType === 'adToBs' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
        >
          English (AD) to Nepali (BS)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Input Box */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Calendar className="h-5 w-5 text-blue-500" />
              Select Input Date
            </h2>

            {conversionType === 'bsToAd' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">BS Year</label>
                    <input
                      type="number"
                      min={1978}
                      max={2099}
                      value={bsYear}
                      onChange={(e) => setBsYear(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">BS Month</label>
                    <select
                      value={bsMonth}
                      onChange={(e) => setBsMonth(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold"
                    >
                      {nepaliMonths.map((m, idx) => (
                        <option key={m} value={idx + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">BS Day</label>
                    <input
                      type="number"
                      min={1}
                      max={32}
                      value={bsDay}
                      onChange={(e) => setBsDay(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold"
                    />
                  </div>
                </div>
                <button
                  onClick={handleBsToAdConvert}
                  className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" /> Convert to AD
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">AD Year</label>
                    <input
                      type="number"
                      min={1921}
                      max={2043}
                      value={adYear}
                      onChange={(e) => setAdYear(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">AD Month</label>
                    <select
                      value={adMonth}
                      onChange={(e) => setAdMonth(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold"
                    >
                      {englishMonths.map((m, idx) => (
                        <option key={m} value={idx + 1}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">AD Day</label>
                    <input
                      type="number"
                      min={1}
                      max={31}
                      value={adDay}
                      onChange={(e) => setAdDay(Number(e.target.value))}
                      className="w-full py-2 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-semibold"
                    />
                  </div>
                </div>
                <button
                  onClick={handleAdToBsConvert}
                  className="w-full py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <RefreshCw className="h-4 w-4" /> Convert to BS
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Result Box */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
          <h2 className="text-xl font-bold border-b border-white/20 pb-4">Converted Result</h2>
          <div className="py-8 text-center">
            <span className="text-sm opacity-90 uppercase tracking-widest block font-semibold mb-1">
              Equivalent Date ({conversionType === 'bsToAd' ? 'AD' : 'BS'})
            </span>
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight block">
              {conversionType === 'bsToAd' ? adResult : bsResult}
            </span>
          </div>
          <div className="flex items-center gap-1.5 justify-center text-xs opacity-90">
            <CheckCircle2 className="h-4 w-4" /> Precise Conversion Applied
          </div>
        </div>
      </div>

      {/* Info Reference */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
        <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Info className="h-5 w-5 text-indigo-500" /> About Bikram Sambat (BS)
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
          Bikram Sambat (BS) is the official calendar of Nepal. It is approximately **56 years and 8.5 months ahead** of the Gregorian Calendar (AD).
          Because month lengths in BS are not mathematically fixed and vary year by year, conversion utilizes an official lookup table matching the days allocated to each year by the Nepalese Panchanga Committee.
        </p>
      </div>
    </div>
  );
}
