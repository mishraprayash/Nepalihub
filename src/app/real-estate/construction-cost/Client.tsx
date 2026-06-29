'use client';

import { useState } from 'react';
import { Home, Layers, MapPin, Ruler, Calculator, Info } from 'lucide-react';

const CITIES = [
  { id: 'ktm', label: 'Kathmandu Valley', multiplier: 1.0 },
  { id: 'pkr', label: 'Pokhara', multiplier: 0.85 },
  { id: 'brt', label: 'Bharatpur / Chitwan', multiplier: 0.75 },
  { id: 'other', label: 'Other Cities / Towns', multiplier: 0.7 },
  { id: 'rural', label: 'Rural / Village', multiplier: 0.55 },
];

const BUILDING_TYPES = [
  { id: 'rc', label: 'RCC Frame (Standard)', desc: 'Reinforced cement concrete frame with brick walls', costMin: 5000, costMax: 7000 },
  { id: 'rc-premium', label: 'RCC Premium', desc: 'RCC frame with modern finishing, false ceiling, aluminum windows', costMin: 7000, costMax: 9500 },
  { id: 'load-bearing', label: 'Load Bearing (Traditional)', desc: 'Brick/stone load-bearing walls, traditional style', costMin: 3500, costMax: 5000 },
  { id: 'prefab', label: 'Prefab / Modular', desc: 'Prefabricated steel frame with panels', costMin: 6000, costMax: 8000 },
  { id: 'bamboo', label: 'Bamboo / Eco', desc: 'Bamboo frame with eco-friendly materials', costMin: 2500, costMax: 4000 },
];

const FLOORS = [1, 2, 3, 4, 5];

export default function ConstructionCostClient() {
  const [city, setCity] = useState('ktm');
  const [bldgType, setBldgType] = useState('rc');
  const [area, setArea] = useState('1200');
  const [floors, setFloors] = useState(2);

  const cityData = CITIES.find(c => c.id === city) || CITIES[0];
  const typeData = BUILDING_TYPES.find(t => t.id === bldgType) || BUILDING_TYPES[0];
  const sqft = parseFloat(area) || 0;
  const totalArea = sqft * floors;

  const baseMin = typeData.costMin * cityData.multiplier;
  const baseMax = typeData.costMax * cityData.multiplier;

  const totalMin = totalArea * baseMin;
  const totalMax = totalArea * baseMax;
  const avgCost = (baseMin + baseMax) / 2;
  const totalAvg = totalArea * avgCost;

  const format = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'NPR', maximumFractionDigits: 0 }).format(n);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Home className="h-7 w-7 text-emerald-500" />
          House Construction Cost Estimator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Estimate construction cost per sq ft based on city, building type, and number of floors. Updated with latest material rates.
        </p>
      </div>

      {/* Inputs */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-emerald-500" /> Location
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {CITIES.map(c => (
              <button key={c.id} onClick={() => setCity(c.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
                  city === c.id
                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-emerald-500" /> Building Type
          </label>
          <div className="space-y-2">
            {BUILDING_TYPES.map(t => (
              <button key={t.id} onClick={() => setBldgType(t.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                  bldgType === t.id
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800'
                    : 'bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}>
                <span className="font-semibold">{t.label}</span>
                <span className="text-xs ml-2 opacity-75">— {t.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
              <Ruler className="h-4 w-4 text-emerald-500" /> Area per Floor (sq ft)
            </label>
            <input type="number" value={area} onChange={e => setArea(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="1200" />
          </div>
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-emerald-500" /> Number of Floors
            </label>
            <div className="flex gap-1 flex-wrap">
              {FLOORS.map(f => (
                <button key={f} onClick={() => setFloors(f)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    floors === f
                      ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-gray-50 dark:bg-gray-900 text-gray-500 border border-gray-200 dark:border-gray-700'
                  }`}>
                  {f} {f === 1 ? 'Floor' : 'Floors'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-2xl p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-1">Per Sq.Ft Cost</p>
          <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{format(avgCost)}</p>
          <p className="text-[10px] text-emerald-500">Range: {format(baseMin)} – {format(baseMax)}</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/40 rounded-2xl p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Total Built-up Area</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalArea.toLocaleString('en-IN')} sq.ft</p>
          <p className="text-[10px] text-blue-500">{floors} floor{floors > 1 ? 's' : ''} × {area} sq.ft</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 rounded-2xl p-5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-500 mb-1">Estimated Total Cost</p>
          <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{format(totalAvg)}</p>
          <p className="text-[10px] text-purple-500">Range: {format(totalMin)} – {format(totalMax)}</p>
        </div>
      </div>

      {/* Cost Breakdown by Component */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5">
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Typical Cost Breakdown</h2>
        <div className="space-y-2">
          {[
            { item: 'Foundation & Structure', pct: 25 },
            { item: 'Walls & Masonry', pct: 15 },
            { item: 'Roofing & Slab', pct: 12 },
            { item: 'Plastering & Finishing', pct: 10 },
            { item: 'Flooring & Tiling', pct: 10 },
            { item: 'Electrical & Plumbing', pct: 10 },
            { item: 'Windows, Doors & Grills', pct: 8 },
            { item: 'Painting & Decoration', pct: 5 },
            { item: 'Miscellaneous (scaffolding, labor overhead)', pct: 5 },
          ].map((comp, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-xs text-gray-600 dark:text-gray-400 w-40 shrink-0">{comp.item}</span>
              <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 dark:bg-emerald-600 rounded-full" style={{ width: `${comp.pct}%` }} />
              </div>
              <span className="text-xs font-medium text-gray-500 w-12 text-right">{comp.pct}%</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 w-24 text-right">{format(totalAvg * comp.pct / 100)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Reference */}
      <div className="bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 text-sm text-gray-500 dark:text-gray-400 space-y-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
          <Info className="h-4 w-4 text-emerald-500" />
          Notes & Assumptions
        </h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Costs include materials + labor. Does not include land cost, design/architect fees, or municipality approval fees.</li>
          <li>Rates based on Kathmandu Valley prices as of FY 2081/82. Other cities adjusted by location multiplier.</li>
          <li>Premium finishing (imported tiles, modular kitchen, aluminum windows) can add 15-30% to base cost.</li>
          <li>Foundation cost may vary significantly based on soil condition (pile foundation in soft soil costs more).</li>
          <li>Always get 2-3 quotes from local contractors for accurate pricing.</li>
        </ul>
      </div>
    </main>
  );
}
