'use client';

import { useState } from 'react';
import { RefreshCw, Scale, Weight, Ruler, Beaker } from 'lucide-react';

// --- Unit Definitions ---

interface UnitCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  baseUnit: string;
  units: UnitDef[];
}

interface UnitDef {
  name: string;
  nepaliName: string;
  toBase: number; // multiply by this to get base unit
  baseUnit: string;
}

const CATEGORIES: UnitCategory[] = [
  {
    id: 'weight',
    name: 'Weight (Tola, Pau, Dharni)',
    icon: <Weight className="h-5 w-5 text-amber-500" />,
    baseUnit: 'gram',
    units: [
      { name: 'Milligram (mg)', nepaliName: 'मिलिग्राम', toBase: 0.001, baseUnit: 'gram' },
      { name: 'Gram (g)', nepaliName: 'ग्राम', toBase: 1, baseUnit: 'gram' },
      { name: 'Kilogram (kg)', nepaliName: 'किलोग्राम', toBase: 1000, baseUnit: 'gram' },
      { name: 'Tola', nepaliName: 'तोला', toBase: 11.664, baseUnit: 'gram' },       // 1 tola = 11.664g
      { name: 'Pau (पाउ)', nepaliName: 'पाउ', toBase: 200, baseUnit: 'gram' },       // 1 pau = 200g
      { name: 'Dharni (धार्नी)', nepaliName: 'धार्नी', toBase: 2333.33, baseUnit: 'gram' },  // 1 dharni = ~2.333 kg
      { name: 'Mana (माना)', nepaliName: 'माना', toBase: 200, baseUnit: 'gram' },   // For rice/grain
    ],
  },
  {
    id: 'volume',
    name: 'Volume (Mana, Pathi)',
    icon: <Beaker className="h-5 w-5 text-blue-500" />,
    baseUnit: 'liter',
    units: [
      { name: 'Milliliter (mL)', nepaliName: 'मिलिलिटर', toBase: 0.001, baseUnit: 'liter' },
      { name: 'Liter (L)', nepaliName: 'लिटर', toBase: 1, baseUnit: 'liter' },
      { name: 'Mana (माना)', nepaliName: 'माना', toBase: 0.568, baseUnit: 'liter' },    // 1 mana = ~0.568L
      { name: 'Pathi (पाथी)', nepaliName: 'पाथी', toBase: 4.544, baseUnit: 'liter' },   // 1 pathi = 8 mana
      { name: 'Muri (मुरी)', nepaliName: 'मुरी', toBase: 72.7, baseUnit: 'liter' },     // 1 muri = 16 pathi
    ],
  },
  {
    id: 'length',
    name: 'Length (Bitta, Haat, Kosh)',
    icon: <Ruler className="h-5 w-5 text-green-500" />,
    baseUnit: 'meter',
    units: [
      { name: 'Centimeter (cm)', nepaliName: 'सेन्टिमिटर', toBase: 0.01, baseUnit: 'meter' },
      { name: 'Meter (m)', nepaliName: 'मिटर', toBase: 1, baseUnit: 'meter' },
      { name: 'Kilometer (km)', nepaliName: 'किलोमिटर', toBase: 1000, baseUnit: 'meter' },
      { name: 'Angul (अंगुल)', nepaliName: 'अंगुल', toBase: 0.019, baseUnit: 'meter' },   // ~1.9cm
      { name: 'Bitta (बित्ता)', nepaliName: 'बित्ता', toBase: 0.457, baseUnit: 'meter' },  // ~45.7cm
      { name: 'Haat (हात)', nepaliName: 'हात', toBase: 0.457, baseUnit: 'meter' },        // ~45.7cm (same as bitta in many regions)
      { name: 'Dhanush (धनुष)', nepaliName: 'धनुष', toBase: 1.829, baseUnit: 'meter' },   // ~1.83m
      { name: 'Kosh (कोश)', nepaliName: 'कोश', toBase: 3200, baseUnit: 'meter' },         // ~3.2km
    ],
  },
  {
    id: 'area',
    name: 'Land Area (Ropani, Bigha)',
    icon: <Scale className="h-5 w-5 text-purple-500" />,
    baseUnit: 'sqMeter',
    units: [
      { name: 'Square Meter (m²)', nepaliName: 'वर्ग मिटर', toBase: 1, baseUnit: 'sqMeter' },
      { name: 'Square Feet (sq.ft)', nepaliName: 'वर्ग फिट', toBase: 0.092903, baseUnit: 'sqMeter' },
      { name: 'Square Inch (sq.in)', nepaliName: 'वर्ग इन्च', toBase: 0.00064516, baseUnit: 'sqMeter' },
      { name: 'Aana (आना)', nepaliName: 'आना', toBase: 31.8, baseUnit: 'sqMeter' },         // 1 aana = ~31.8 m²
      { name: 'Paisa (पैसा)', nepaliName: 'पैसा', toBase: 7.95, baseUnit: 'sqMeter' },      // 1 paisa = 1/4 aana
      { name: 'Ropani (रोपनी)', nepaliName: 'रोपनी', toBase: 508.72, baseUnit: 'sqMeter' }, // 1 ropani = 16 aana
      { name: 'Daam (दाम)', nepaliName: 'दाम', toBase: 1.99, baseUnit: 'sqMeter' },         // 1 daam = 1/4 paisa
      { name: 'Bigha (बिघा)', nepaliName: 'बिघा', toBase: 6772.63, baseUnit: 'sqMeter' },   // 1 bigha = ~6772 m²
      { name: 'Kattha (कठ्ठा)', nepaliName: 'कठ्ठा', toBase: 338.63, baseUnit: 'sqMeter' }, // 1 kattha = 1/20 bigha
      { name: 'Dhur (धुर)', nepaliName: 'धुर', toBase: 16.93, baseUnit: 'sqMeter' },        // 1 dhur = 1/20 kattha
    ],
  },
];

export default function NepaliUnitConverter() {
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].id);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [fromValue, setFromValue] = useState<number>(1);
  const [toValue, setToValue] = useState<number>(1);
  const [error, setError] = useState('');

  const category = CATEGORIES.find(c => c.id === activeCategory)!;

  // Set default units when category changes
  const initCategory = (catId: string) => {
    const cat = CATEGORIES.find(c => c.id === catId)!;
    setActiveCategory(catId);
    setFromUnit(cat.units[0].name);
    setToUnit(cat.units.length > 1 ? cat.units[1].name : cat.units[0].name);
    setFromValue(1);
    setToValue(1);
    setError('');
  };

  // Parse unit to get toBase factor
  const getUnitFactor = (unitName: string): number | null => {
    const unit = category.units.find(u => u.name === unitName || u.nepaliName === unitName);
    return unit ? unit.toBase : null;
  };

  const convert = (value: number, from: string, to: string): number | null => {
    const fromFactor = getUnitFactor(from);
    const toFactor = getUnitFactor(to);
    if (fromFactor === null || toFactor === null) return null;
    if (fromFactor === 0 || toFactor === 0) return null;
    // Convert from → base → to
    return (value * fromFactor) / toFactor;
  };

  const handleFromChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      if (val === '' || val === '0') { setFromValue(0); setToValue(0); setError(''); return; }
      setError('Please enter a valid positive number');
      return;
    }
    setError('');
    setFromValue(num);
    if (fromUnit && toUnit) {
      const result = convert(num, fromUnit, toUnit);
      if (result !== null) setToValue(Math.round(result * 1e10) / 1e10);
    }
  };

  const handleToChange = (val: string) => {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      if (val === '' || val === '0') { setFromValue(0); setToValue(0); setError(''); return; }
      setError('Please enter a valid positive number');
      return;
    }
    setError('');
    setToValue(num);
    if (fromUnit && toUnit) {
      const result = convert(num, toUnit, fromUnit);
      if (result !== null) setFromValue(Math.round(result * 1e10) / 1e10);
    }
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    if (unit === toUnit) {
      setToValue(fromValue);
      return;
    }
    const result = convert(fromValue, unit, toUnit === unit ? (unit === fromUnit ? toUnit : fromUnit) : toUnit);
    if (result !== null) setToValue(Math.round(result * 1e10) / 1e10);
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    if (unit === fromUnit) {
      setToValue(fromValue);
      return;
    }
    const result = convert(fromValue, fromUnit, unit);
    if (result !== null) setToValue(Math.round(result * 1e10) / 1e10);
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Unit Converter
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Convert between traditional Nepali units and modern metric/imperial measurements. 
          Supports weight (Tola, Pau, Dharni), volume (Mana, Pathi), length (Bitta, Haat, Kosh), 
          and land area (Ropani, Bigha).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Converter Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Category Selector */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => initCategory(cat.id)}
                className={`flex items-center gap-2 py-2 px-4 rounded-xl border text-sm font-semibold transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 border-blue-600 text-white'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                }`}
              >
                {cat.icon}
                {cat.name}
              </button>
            ))}
          </div>

          {/* Conversion Inputs */}
          <div className="space-y-4">
            {/* From */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">From</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={fromValue || ''}
                  onChange={(e) => handleFromChange(e.target.value)}
                  className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Value"
                />
                <select
                  value={fromUnit}
                  onChange={(e) => handleFromUnitChange(e.target.value)}
                  className="min-w-[140px] py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category.units.map((u) => (
                    <option key={u.name} value={u.name}>{u.name} ({u.nepaliName})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapUnits}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* To */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">To</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={toValue || ''}
                  onChange={(e) => handleToChange(e.target.value)}
                  className="flex-1 py-3 px-4 rounded-xl border border-blue-300 dark:border-blue-600 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Result"
                />
                <select
                  value={toUnit}
                  onChange={(e) => handleToUnitChange(e.target.value)}
                  className="min-w-[140px] py-3 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category.units.map((u) => (
                    <option key={u.name} value={u.name}>{u.name} ({u.nepaliName})</option>
                  ))}
                </select>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          {/* Result Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl">
            <div className="text-lg font-bold opacity-90">
              {fromValue.toLocaleString()} {fromUnit.replace(/\(.*\)/, '').trim()} =
            </div>
            <div className="text-3xl font-extrabold mt-2">
              {toValue.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })} {toUnit.replace(/\(.*\)/, '').trim()}
            </div>
            <div className="text-sm opacity-80 mt-2">
              {category.name}
            </div>
          </div>
        </div>

        {/* Reference Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Scale className="h-5 w-5 text-blue-500" /> Quick Reference
            </h3>
            <div className="space-y-3">
              {category.units.filter(u => u.name.includes('(')).map((u) => (
                <div key={u.name} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div>
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{u.nepaliName}</span>
                    <span className="text-xs text-gray-400 ml-1">({u.name.split('(')[0].trim()})</span>
                  </div>
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                    {u.toBase} {u.baseUnit === 'sqMeter' ? 'm²' : u.baseUnit === 'gram' ? 'g' : u.baseUnit === 'liter' ? 'L' : u.baseUnit === 'meter' ? 'm' : u.baseUnit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Conversion Notes</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 leading-relaxed">
              <p>
                <strong>Weight:</strong> 1 Tola = 11.664g (standard for gold/silver). 
                1 Pau = 200g. 1 Dharni = 2.333 kg (12 Pau).
              </p>
              <p>
                <strong>Volume:</strong> 1 Mana = ~0.568L (rice/grain measure). 
                1 Pathi = 8 Mana. 1 Muri = 16 Pathi.
              </p>
              <p>
                <strong>Length:</strong> 1 Angul = ~1.9cm (finger width). 
                1 Bitta/Haat = ~45.7cm (cubit). 1 Kosh = ~3.2km.
              </p>
              <p>
                <strong>Land Area:</strong> 1 Ropani = 16 Aana = 64 Paisa = 256 Daam.
                1 Bigha = 20 Kattha = 400 Dhur. Used in different regions of Nepal.
              </p>
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                ⚠ Traditional units may vary slightly by region. Values shown are standard conversions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
