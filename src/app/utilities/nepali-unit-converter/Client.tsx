'use client';

import { useState } from 'react';
import { ArrowUpDown } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, ResultStat } from '@/components/ui/fields';

interface UnitDef {
  name: string;
  nepaliName: string;
  toBase: number;
  baseUnit: string;
}

interface UnitCategory {
  id: string;
  shortName: string;
  name: string;
  baseUnit: string;
  units: UnitDef[];
}

const CATEGORIES: UnitCategory[] = [
  {
    id: 'weight',
    shortName: 'Weight',
    name: 'Weight — Tola, Pau, Dharni',
    baseUnit: 'gram',
    units: [
      { name: 'Milligram (mg)', nepaliName: 'मिलिग्राम', toBase: 0.001, baseUnit: 'gram' },
      { name: 'Gram (g)', nepaliName: 'ग्राम', toBase: 1, baseUnit: 'gram' },
      { name: 'Kilogram (kg)', nepaliName: 'किलोग्राम', toBase: 1000, baseUnit: 'gram' },
      { name: 'Tola', nepaliName: 'तोला', toBase: 11.664, baseUnit: 'gram' },
      { name: 'Pau (पाउ)', nepaliName: 'पाउ', toBase: 200, baseUnit: 'gram' },
      { name: 'Dharni (धार्नी)', nepaliName: 'धार्नी', toBase: 2333.33, baseUnit: 'gram' },
      { name: 'Mana (माना)', nepaliName: 'माना', toBase: 200, baseUnit: 'gram' },
    ],
  },
  {
    id: 'volume',
    shortName: 'Volume',
    name: 'Volume — Mana, Pathi, Muri',
    baseUnit: 'liter',
    units: [
      { name: 'Milliliter (mL)', nepaliName: 'मिलिलिटर', toBase: 0.001, baseUnit: 'liter' },
      { name: 'Liter (L)', nepaliName: 'लिटर', toBase: 1, baseUnit: 'liter' },
      { name: 'Mana (माना)', nepaliName: 'माना', toBase: 0.568, baseUnit: 'liter' },
      { name: 'Pathi (पाथी)', nepaliName: 'पाथी', toBase: 4.544, baseUnit: 'liter' },
      { name: 'Muri (मुरी)', nepaliName: 'मुरी', toBase: 72.7, baseUnit: 'liter' },
    ],
  },
  {
    id: 'length',
    shortName: 'Length',
    name: 'Length — Bitta, Haat, Kosh',
    baseUnit: 'meter',
    units: [
      { name: 'Centimeter (cm)', nepaliName: 'सेन्टिमिटर', toBase: 0.01, baseUnit: 'meter' },
      { name: 'Meter (m)', nepaliName: 'मिटर', toBase: 1, baseUnit: 'meter' },
      { name: 'Kilometer (km)', nepaliName: 'किलोमिटर', toBase: 1000, baseUnit: 'meter' },
      { name: 'Angul (अंगुल)', nepaliName: 'अंगुल', toBase: 0.019, baseUnit: 'meter' },
      { name: 'Bitta (बित्ता)', nepaliName: 'बित्ता', toBase: 0.457, baseUnit: 'meter' },
      { name: 'Haat (हात)', nepaliName: 'हात', toBase: 0.457, baseUnit: 'meter' },
      { name: 'Dhanush (धनुष)', nepaliName: 'धनुष', toBase: 1.829, baseUnit: 'meter' },
      { name: 'Kosh (कोश)', nepaliName: 'कोश', toBase: 3200, baseUnit: 'meter' },
    ],
  },
  {
    id: 'area',
    shortName: 'Land Area',
    name: 'Land Area — Ropani, Bigha',
    baseUnit: 'sqMeter',
    units: [
      { name: 'Square Meter (m²)', nepaliName: 'वर्ग मिटर', toBase: 1, baseUnit: 'sqMeter' },
      { name: 'Square Feet (sq.ft)', nepaliName: 'वर्ग फिट', toBase: 0.092903, baseUnit: 'sqMeter' },
      { name: 'Square Inch (sq.in)', nepaliName: 'वर्ग इन्च', toBase: 0.00064516, baseUnit: 'sqMeter' },
      { name: 'Aana (आना)', nepaliName: 'आना', toBase: 31.8, baseUnit: 'sqMeter' },
      { name: 'Paisa (पैसा)', nepaliName: 'पैसा', toBase: 7.95, baseUnit: 'sqMeter' },
      { name: 'Ropani (रोपनी)', nepaliName: 'रोपनी', toBase: 508.72, baseUnit: 'sqMeter' },
      { name: 'Daam (दाम)', nepaliName: 'दाम', toBase: 1.99, baseUnit: 'sqMeter' },
      { name: 'Bigha (बिघा)', nepaliName: 'बिघा', toBase: 6772.63, baseUnit: 'sqMeter' },
      { name: 'Kattha (कठ्ठा)', nepaliName: 'कठ्ठा', toBase: 338.63, baseUnit: 'sqMeter' },
      { name: 'Dhur (धुर)', nepaliName: 'धुर', toBase: 16.93, baseUnit: 'sqMeter' },
    ],
  },
];

const BASE_LABEL: Record<string, string> = { gram: 'g', liter: 'L', meter: 'm', sqMeter: 'm²' };

export default function NepaliUnitConverter() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>(1);
  const [error, setError] = useState('');

  const category = CATEGORIES.find(c => c.id === activeCategory)!;

  const initCategory = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId)!;
    setActiveCategory(catId);
    setFromUnit(cat.units[0].name);
    setToUnit(cat.units.length > 1 ? cat.units[1].name : cat.units[0].name);
    setFromValue(1);
    setToValue(1);
    setError('');
  };

  // Initialize defaults on first render
  if (!fromUnit || !toUnit) {
    setFromUnit(category.units[0].name);
    setToUnit(category.units[1]?.name ?? category.units[0].name);
  }

  const getUnitFactor = (unitName: string): number | null => {
    const unit = category.units.find(u => u.name === unitName || u.nepaliName === unitName);
    return unit ? unit.toBase : null;
  };

  const convert = (value: number, from: string, to: string): number | null => {
    const fromFactor = getUnitFactor(from);
    const toFactor = getUnitFactor(to);
    if (fromFactor === null || toFactor === null || fromFactor === 0 || toFactor === 0) return null;
    return (value * fromFactor) / toFactor;
  };

  const handleFromChange = (val: string) => {
    const num = parseFloat(val);
    if ((isNaN(num) || num < 0) && val !== '' && val !== '0') {
      setError('Please enter a valid positive number');
      return;
    }
    setError('');
    const v = isNaN(num) ? 0 : num;
    setFromValue(v);
    const result = convert(v, fromUnit, toUnit);
    if (result !== null) setToValue(Math.round(result * 1e10) / 1e10);
  };

  const handleToChange = (val: string) => {
    const num = parseFloat(val);
    if ((isNaN(num) || num < 0) && val !== '' && val !== '0') {
      setError('Please enter a valid positive number');
      return;
    }
    setError('');
    const v = isNaN(num) ? 0 : num;
    setToValue(v);
    const result = convert(v, toUnit, fromUnit);
    if (result !== null) setFromValue(Math.round(result * 1e10) / 1e10);
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    if (unit === toUnit) { setToValue(fromValue); return; }
    const result = convert(fromValue, unit, toUnit);
    if (result !== null) setToValue(Math.round(result * 1e10) / 1e10);
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    if (unit === fromUnit) { setToValue(fromValue); return; }
    const result = convert(fromValue, fromUnit, unit);
    if (result !== null) setToValue(Math.round(result * 1e10) / 1e10);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const selectClass =
    'min-w-[150px] py-3 px-3 text-[13px] font-semibold bg-surface-raised border border-line rounded-xl text-ink focus:outline-none focus:border-simrik/60 focus:ring-3 focus:ring-simrik/10 transition-all';

  const inputClass =
    'flex-1 min-w-0 py-3 px-4 text-sm font-semibold bg-surface-raised border border-line rounded-xl text-ink tabular-nums focus:outline-none focus:border-simrik/60 focus:ring-3 focus:ring-simrik/10 transition-all';

  const clean = (u: string) => u.replace(/\(.*\)/, '').trim();

  return (
    <ToolShell
      category="Utilities"
      title="Nepali Unit Converter"
      badge="Traditional measures"
      description="Tola for gold, Pathi for rice, Ropani for land — traditional Nepali units to metric, in both directions."
      aside={
        <>
          <Panel>
            <ResultStat
              label={`${fromValue.toLocaleString()} ${clean(fromUnit)} equals`}
              value={`${toValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ${clean(toUnit)}`}
              emphasis
            />
            <p className="text-xs text-ink-faint pt-2">{category.name}</p>
          </Panel>

          <Panel title="Quick reference">
            <div className="space-y-1">
              {category.units.filter(u => u.name.includes('(')).map((u) => (
                <div key={u.name} className="flex items-center justify-between py-2 border-b border-line/60 last:border-0">
                  <span className="text-sm">
                    <span className="font-semibold text-ink">{u.nepaliName}</span>
                    <span className="text-xs text-ink-faint ml-1">({u.name.split('(')[0].trim()})</span>
                  </span>
                  <span className="text-xs font-bold text-simrik tabular-nums">
                    {u.toBase.toLocaleString()} {BASE_LABEL[u.baseUnit]}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <p className="text-xs text-brass leading-relaxed px-1">
            Traditional units vary slightly by region — these are the standard conversions.
          </p>
        </>
      }
    >
      <Panel title="Convert">
        <div className="space-y-6">
          {/* Category tabs */}
          <div className="inline-flex flex-wrap p-1 gap-1 bg-paper-deep rounded-xl border border-line">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => initCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-surface-raised text-ink shadow-sm'
                    : 'text-ink-faint hover:text-ink-soft'
                }`}
              >
                {cat.shortName}
              </button>
            ))}
          </div>

          {/* From */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-soft">From</label>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="number"
                value={fromValue || ''}
                onChange={(e) => handleFromChange(e.target.value)}
                className={inputClass}
                placeholder="Value"
              />
              <select value={fromUnit} onChange={(e) => handleFromUnitChange(e.target.value)} className={selectClass}>
                {category.units.map((u) => (
                  <option key={u.name} value={u.name}>{u.nepaliName} · {u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap */}
          <button
            onClick={swapUnits}
            className="h-9 w-9 mx-auto flex items-center justify-center rounded-full border border-line text-ink-faint hover:text-simrik hover:border-simrik/40 transition-colors"
            aria-label="Swap units"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>

          {/* To */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-medium text-ink-soft">To</label>
            <div className="flex gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="number"
                value={toValue || ''}
                onChange={(e) => handleToChange(e.target.value)}
                className={`${inputClass} border-simrik/40`}
                placeholder="Result"
              />
              <select value={toUnit} onChange={(e) => handleToUnitChange(e.target.value)} className={selectClass}>
                {category.units.map((u) => (
                  <option key={u.name} value={u.name}>{u.nepaliName} · {u.name}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <p className="text-xs text-simrik">{error}</p>}
        </div>
      </Panel>

      {/* Notes */}
      <section className="border-t border-line pt-8 pb-10 space-y-5 max-w-xl">
        <h2 className="font-display text-xl font-semibold text-ink">How the units relate</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-[13px] leading-relaxed text-ink-soft">
          <div><dt className="font-semibold text-ink inline">Weight:</dt> 1 Tola = 11.664 g (gold standard). 1 Dharni = 12 Pau ≈ 2.333 kg.</div>
          <div><dt className="font-semibold text-ink inline">Volume:</dt> 1 Mana ≈ 0.568 L. 1 Pathi = 8 Mana. 1 Muri = 16 Pathi.</div>
          <div><dt className="font-semibold text-ink inline">Length:</dt> 1 Angul ≈ 1.9 cm. 1 Haat ≈ 45.7 cm. 1 Kosh ≈ 3.2 km.</div>
          <div><dt className="font-semibold text-ink inline">Land:</dt> 1 Ropani = 16 Aana = 64 Paisa = 256 Daam. 1 Bigha = 20 Kattha.</div>
        </dl>
      </section>
    </ToolShell>
  );
}
