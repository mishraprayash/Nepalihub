'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Search, Calculator, Landmark, RefreshCw, GraduationCap, 
  Lightbulb, Coins, Calendar, Camera, FileText, ArrowRight, ShieldCheck, Flame, Sparkles
} from 'lucide-react';
import { calculators } from '@/data/calculators';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredCalculators = calculators.filter(c => {
    const matchesSearch = searchQuery === '' || 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = activeCategory === 'all' || c.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'All Utilities' },
    { id: 'finance', label: 'Finance & Banking' },
    { id: 'real-estate', label: 'Real Estate' },
    { id: 'utilities', label: 'Utilities & Gold' },
    { id: 'documents', label: 'Documents & Photos' },
    { id: 'education', label: 'Education' }
  ];

  const iconMap: Record<string, React.ReactNode> = {
    'income-tax': <Landmark className="h-5 w-5 text-red-500" />,
    'emi': <Calculator className="h-5 w-5 text-blue-500" />,
    'sip': <Coins className="h-5 w-5 text-emerald-500" />,
    'land-converter': <RefreshCw className="h-5 w-5 text-indigo-500" />,
    'gpa': <GraduationCap className="h-5 w-5 text-purple-500" />,
    'electricity-bill': <Lightbulb className="h-5 w-5 text-amber-500" />,
    'gold-price': <Coins className="h-5 w-5 text-amber-600" />,
    'age-calculator': <Calendar className="h-5 w-5 text-teal-500" />,
    'passport-photo': <Camera className="h-5 w-5 text-sky-500" />,
    'invoice-generator': <FileText className="h-5 w-5 text-violet-500" />,
    'road-tax': <Landmark className="h-5 w-5 text-pink-500" />
  };

  return (
    <div className="space-y-16 max-w-6xl mx-auto py-8">
      {/* Modern Hero Header */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 p-8 md:p-12 shadow-sm text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Subtle Flag Color Accent Line at top */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-white to-blue-600" />

        <div className="space-y-4 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" /> Nepal Utility Suite
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.1]">
            Definitive Digital Tools for <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">Everyday Nepal</span>
          </h1>
          <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            Instant 2083 tax slab estimations, land unit conversions, official photo cropping, and NEA electricity bill calculators. Always current.
          </p>
        </div>

        {/* Global Live Search Box */}
        <div className="w-full max-w-md bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-200/50 dark:border-gray-800 shadow-inner space-y-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Quick Search</span>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search (e.g. tax, emi, GPA, land)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
        </div>
      </section>

      {/* Category Pills & Filters */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-500 animate-pulse" /> Popular Calculators
          </h2>
          {/* Scrollable horizontal categories */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat.id ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-sm' : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 text-gray-600 dark:text-gray-300'}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* High-Quality Premium Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.length > 0 ? (
            filteredCalculators.map((calc) => {
              return (
                <Link
                  key={calc.id}
                  href={calc.path}
                  className="group relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200/60 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl dark:hover:shadow-2xl/10 transition-all flex flex-col justify-between"
                >
                  {/* Visual Accent Top Bar */}
                  <div className="absolute top-0 inset-x-0 h-[3px] bg-gray-100 dark:bg-gray-700 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-blue-500 transition-colors" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 bg-gray-50 dark:bg-gray-900 rounded-xl group-hover:scale-105 transition-transform">
                        {iconMap[calc.id] || <Calculator className="h-5 w-5 text-gray-500" />}
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                        {calc.category}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-extrabold text-base text-gray-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {calc.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2">
                        {calc.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-50 dark:border-gray-700/30">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                      Launch Tool <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-[10px] font-semibold bg-gray-50 dark:bg-gray-900 text-gray-400 dark:text-gray-500 px-2 py-0.5 rounded">
                      Client-Side
                    </span>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center text-gray-400 text-sm">
              No calculators found matching your search.
            </div>
          )}
        </div>
      </section>

      {/* Trust & Policy Grid */}
      <section className="bg-gray-50 dark:bg-gray-800/30 border border-gray-200/50 dark:border-gray-800 p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-fit">
            <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Privacy First</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              We process everything locally in your browser. No files or values are ever sent to our servers.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-fit">
            <RefreshCw className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Bikram Sambat 2083 Ready</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Updated with the latest 2083/84 unified progressive tax brackets and NEA's concessional VAT tariff structure.
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="p-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm h-fit">
            <Calculator className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white">Precision Algorithms</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
              Calculation models verified against IRD templates, NEA official tariffs, and regional land registers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
