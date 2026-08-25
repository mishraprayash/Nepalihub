'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { NepaliDateConverter } from '@/utils/nepaliDateConverter';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, ResultStat } from '@/components/ui/fields';

const NEPALI_MONTHS = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const ENGLISH_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function DateConverter() {
  const [conversionType, setConversionType] = useState<'bsToAd' | 'adToBs'>('bsToAd');

  const [bsYear, setBsYear] = useState<number>(2083);
  const [bsMonth, setBsMonth] = useState<number>(1);
  const [bsDay, setBsDay] = useState<number>(1);
  const [adResult, setAdResult] = useState<string>('2026-04-14');

  const [adYear, setAdYear] = useState<number>(2026);
  const [adMonth, setAdMonth] = useState<number>(4);
  const [adDay, setAdDay] = useState<number>(14);
  const [bsResult, setBsResult] = useState<string>('2083-01-01');

  const handleBsToAdConvert = () => {
    try {
      const mmStr = bsMonth < 10 ? `0${bsMonth}` : `${bsMonth}`;
      const ddStr = bsDay < 10 ? `0${bsDay}` : `${bsDay}`;
      setAdResult(NepaliDateConverter.bsToAd(`${bsYear}-${mmStr}-${ddStr}`));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Invalid date combination');
    }
  };

  const handleAdToBsConvert = () => {
    try {
      const mmStr = adMonth < 10 ? `0${adMonth}` : `${adMonth}`;
      const ddStr = adDay < 10 ? `0${adDay}` : `${adDay}`;
      setBsResult(NepaliDateConverter.adToBs(`${adYear}-${mmStr}-${ddStr}`));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Invalid date combination');
    }
  };

  const selectClass =
    'w-full py-2.5 px-3 text-sm font-semibold bg-surface-raised border border-line rounded-xl text-ink focus:outline-none focus:border-simrik/60 focus:ring-3 focus:ring-simrik/10 transition-all';

  return (
    <ToolShell
      category="Daily Life"
      title="Nepali ↔ English Date Converter"
      badge="Calendar"
      description="Bidirectional conversion between Bikram Sambat and the Gregorian calendar — 1978 to 2099 BS, using the official Panchanga lookup tables."
      aside={
        <>
          <Panel>
            <ResultStat
              label={`Equivalent date (${conversionType === 'bsToAd' ? 'AD' : 'BS'})`}
              value={conversionType === 'bsToAd' ? adResult : bsResult}
              emphasis
            />
            <p className="text-xs text-ink-faint pt-2">
              Converted against year-wise month-length tables — no approximations.
            </p>
          </Panel>

          <Panel title="About Bikram Sambat">
            <p className="text-[13px] leading-relaxed text-ink-soft">
              BS is Nepal&apos;s official calendar, running roughly 56 years and 8½ months ahead of AD.
              Month lengths vary year by year and aren&apos;t formulaic, so conversion uses the official
              lookup table published by the Nepalese Panchanga Committee.
            </p>
          </Panel>
        </>
      }
    >
      <Panel title={conversionType === 'bsToAd' ? 'Pick a Bikram Sambat date' : 'Pick a Gregorian date'}>
        <div className="space-y-6">
          {/* Direction */}
          <div className="inline-flex p-1 gap-1 bg-paper-deep rounded-xl border border-line">
            <button
              onClick={() => setConversionType('bsToAd')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                conversionType === 'bsToAd' ? 'bg-surface-raised text-ink shadow-sm' : 'text-ink-faint hover:text-ink-soft'
              }`}
            >
              BS → AD
            </button>
            <button
              onClick={() => setConversionType('adToBs')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                conversionType === 'adToBs' ? 'bg-surface-raised text-ink shadow-sm' : 'text-ink-faint hover:text-ink-soft'
              }`}
            >
              AD → BS
            </button>
          </div>

          {conversionType === 'bsToAd' ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-soft">Year (BS)</label>
                  <input type="number" min={1978} max={2099} value={bsYear}
                    onChange={(e) => setBsYear(Number(e.target.value))} className={selectClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-soft">Month</label>
                  <select value={bsMonth} onChange={(e) => setBsMonth(Number(e.target.value))} className={selectClass}>
                    {NEPALI_MONTHS.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-soft">Day</label>
                  <input type="number" min={1} max={32} value={bsDay}
                    onChange={(e) => setBsDay(Number(e.target.value))} className={selectClass} />
                </div>
              </div>
              <button
                onClick={handleBsToAdConvert}
                className="w-full py-3 rounded-xl bg-simrik hover:bg-simrik-deep text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                Convert to English date <ArrowRight className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-soft">Year (AD)</label>
                  <input type="number" min={1921} max={2043} value={adYear}
                    onChange={(e) => setAdYear(Number(e.target.value))} className={selectClass} />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-soft">Month</label>
                  <select value={adMonth} onChange={(e) => setAdMonth(Number(e.target.value))} className={selectClass}>
                    {ENGLISH_MONTHS.map((m, idx) => <option key={m} value={idx + 1}>{m}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-ink-soft">Day</label>
                  <input type="number" min={1} max={31} value={adDay}
                    onChange={(e) => setAdDay(Number(e.target.value))} className={selectClass} />
                </div>
              </div>
              <button
                onClick={handleAdToBsConvert}
                className="w-full py-3 rounded-xl bg-simrik hover:bg-simrik-deep text-white font-semibold text-sm inline-flex items-center justify-center gap-2 transition-colors"
              >
                Convert to Nepali date <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </Panel>
    </ToolShell>
  );
}
