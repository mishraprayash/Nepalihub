'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search, Calculator, Landmark, RefreshCw, GraduationCap,
  Lightbulb, Coins, Calendar, Camera, FileText, ArrowRight,
  Sparkles, Scale, BarChart3, Car, Star, Globe, TrendingUp,
  Zap, ChevronRight
} from 'lucide-react';
import { calculators, CalculatorInfo } from '@/data/calculators';

/* ── Per-tool config (icon + colour) ──────────────────────────── */
const TOOL_META: Record<string, { icon: React.ReactNode; color: string; bg: string; darkBg: string }> = {
  'income-tax':          { icon: <Landmark className="h-5 w-5" />,    color: 'text-red-500',    bg: 'bg-red-50',    darkBg: 'dark:bg-red-950/30' },
  'emi':                 { icon: <Calculator className="h-5 w-5" />,  color: 'text-blue-500',   bg: 'bg-blue-50',   darkBg: 'dark:bg-blue-950/30' },
  'sip':                 { icon: <TrendingUp className="h-5 w-5" />,  color: 'text-emerald-500',bg: 'bg-emerald-50',darkBg: 'dark:bg-emerald-950/30' },
  'stock-calculator':    { icon: <BarChart3 className="h-5 w-5" />,   color: 'text-green-600',  bg: 'bg-green-50',  darkBg: 'dark:bg-green-950/30' },
  'remittance':          { icon: <Globe className="h-5 w-5" />,       color: 'text-cyan-500',   bg: 'bg-cyan-50',   darkBg: 'dark:bg-cyan-950/30' },
  'nepali-unit-converter':{ icon: <Scale className="h-5 w-5" />,      color: 'text-indigo-500', bg: 'bg-indigo-50', darkBg: 'dark:bg-indigo-950/30' },
  'rashifal':            { icon: <Star className="h-5 w-5" />,        color: 'text-purple-500', bg: 'bg-purple-50', darkBg: 'dark:bg-purple-950/30' },
  'land-converter':      { icon: <RefreshCw className="h-5 w-5" />,   color: 'text-violet-500', bg: 'bg-violet-50', darkBg: 'dark:bg-violet-950/30' },
  'gpa':                 { icon: <GraduationCap className="h-5 w-5" />,color: 'text-fuchsia-500',bg: 'bg-fuchsia-50',darkBg: 'dark:bg-fuchsia-950/30' },
  'electricity-bill':    { icon: <Zap className="h-5 w-5" />,         color: 'text-amber-500',  bg: 'bg-amber-50',  darkBg: 'dark:bg-amber-950/30' },
  'gold-price':          { icon: <Coins className="h-5 w-5" />,       color: 'text-yellow-600', bg: 'bg-yellow-50', darkBg: 'dark:bg-yellow-950/30' },
  'age-calculator':      { icon: <Calendar className="h-5 w-5" />,    color: 'text-teal-500',   bg: 'bg-teal-50',   darkBg: 'dark:bg-teal-950/30' },
  'passport-photo':      { icon: <Camera className="h-5 w-5" />,      color: 'text-sky-500',    bg: 'bg-sky-50',    darkBg: 'dark:bg-sky-950/30' },
  'invoice-generator':   { icon: <FileText className="h-5 w-5" />,    color: 'text-slate-500',  bg: 'bg-slate-50',  darkBg: 'dark:bg-slate-900/50' },
  'road-tax':            { icon: <Car className="h-5 w-5" />,         color: 'text-orange-500', bg: 'bg-orange-50', darkBg: 'dark:bg-orange-950/30' },
  'date-converter':      { icon: <Calendar className="h-5 w-5" />,    color: 'text-rose-500',   bg: 'bg-rose-50',   darkBg: 'dark:bg-rose-950/30' },
  'unicode-converter':   { icon: <Globe className="h-5 w-5" />,       color: 'text-pink-500',   bg: 'bg-pink-50',   darkBg: 'dark:bg-pink-950/30' },
};

const FALLBACK = { icon: <Calculator className="h-5 w-5" />, color: 'text-gray-500', bg: 'bg-gray-50', darkBg: 'dark:bg-gray-800' };

/* ── Categories ───────────────────────────────────────────────── */
const CATEGORIES = [
  { id: 'all',         label: 'All' },
  { id: 'finance',     label: 'Finance' },
  { id: 'utilities',   label: 'Utilities' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'daily',       label: 'Daily Life' },
  { id: 'education',   label: 'Education' },
  { id: 'documents',   label: 'Documents' },
];

/* ── Tool Card ─────────────────────────────────────────────────── */
function ToolCard({ calc }: { calc: CalculatorInfo }) {
  const meta = TOOL_META[calc.id] ?? FALLBACK;
  return (
    <Link
      href={calc.path}
      className="group relative flex flex-col bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 hover:border-black/[0.12] dark:hover:border-white/[0.12] hover:shadow-lg dark:hover:shadow-black/30 transition-all duration-200 overflow-hidden"
    >
      {/* hover gradient wash */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-transparent via-transparent to-blue-50/40 dark:to-blue-950/10" />

      <div className="relative flex flex-col h-full gap-4">
        {/* Icon + category badge */}
        <div className="flex items-start justify-between">
          <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${meta.bg} ${meta.darkBg} ${meta.color} group-hover:scale-105 transition-transform duration-200 shrink-0`}>
            {meta.icon}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-300 dark:text-gray-600 pt-1">
            {calc.category}
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 space-y-1.5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {calc.name}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
            {calc.description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 dark:text-gray-600 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          Open tool
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </Link>
  );
}

/* ── Featured stat pills ──────────────────────────────────────── */
const STATS = [
  { label: 'Free Tools', value: '16+' },
  { label: 'Always Current', value: 'FY 2083/84' },
  { label: 'Client-Side Only', value: '100%' },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function Home() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const filtered = calculators.filter(c => {
    const q = query.toLowerCase();
    const matchQ = !q ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.keywords.some(k => k.includes(q));
    const matchC = category === 'all' || c.category === category;
    return matchQ && matchC;
  });

  return (
    <div className="relative space-y-12 max-w-7xl mx-auto">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative overflow-hidden rounded-3xl bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] shadow-sm px-8 py-12 md:px-14 md:py-16">
        {/* Flag accent stripe */}
        <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-red-600 via-white to-blue-700" />

        {/* Decorative blur orbs */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-blue-400/10 dark:bg-blue-600/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full bg-red-400/10 dark:bg-red-600/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-10">
          {/* Left copy */}
          <div className="space-y-5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3 w-3" />
              Nepal Utility Suite
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 dark:text-white leading-[1.08]">
              Smart tools for{' '}
              <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                everyday Nepal
              </span>
            </h1>

            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed max-w-md">
              Income tax, land conversion, NEPSE P&L, gold prices, electricity bills — all free, instant, and accurate. No signup required.
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 pt-1">
              {STATS.map(s => (
                <div key={s.label} className="space-y-0.5">
                  <div className="text-lg font-black text-gray-900 dark:text-white">{s.value}</div>
                  <div className="text-[11px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick CTA buttons */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[
                { href: '/finance/income-tax', label: 'Tax Calculator', color: 'bg-red-600 hover:bg-red-700 text-white' },
                { href: '/finance/stock-calculator', label: 'NEPSE Stock', color: 'bg-blue-600 hover:bg-blue-700 text-white' },
                { href: '/utilities/gold-price', label: 'Gold Price', color: 'bg-amber-500 hover:bg-amber-600 text-white' },
              ].map(b => (
                <Link
                  key={b.href}
                  href={b.href}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${b.color}`}
                >
                  {b.label}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              ))}
            </div>
          </div>

          {/* Right — search box */}
          <div className="w-full md:w-80 shrink-0">
            <div className="bg-gray-50 dark:bg-[#0c0e14] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 space-y-3 shadow-inner">
              <p className="text-[11px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">Quick search</p>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="e.g. tax, EMI, land, gold..."
                  value={query}
                  onChange={e => { setQuery(e.target.value); setCategory('all'); }}
                  className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-white/[0.08] bg-white dark:bg-[#141720] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                />
              </div>
              {/* Quick-access chips */}
              <div className="flex flex-wrap gap-1.5">
                {['Income Tax', 'EMI', 'NEPSE', 'Gold', 'Land', 'GPA'].map(t => (
                  <button
                    key={t}
                    onClick={() => { setQuery(t); setCategory('all'); }}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-[#1a1e2c] border border-gray-200 dark:border-white/[0.07] text-xs font-semibold text-gray-500 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Category filter + Tool grid ───────────────────────── */}
      <section className="space-y-6">
        {/* Header row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              All Tools
            </h2>
            <p className="text-xs text-gray-400 dark:text-gray-600 mt-0.5">
              {filtered.length} tool{filtered.length !== 1 ? 's' : ''} {category !== 'all' ? `in ${category}` : 'available'}
            </p>
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  category === cat.id
                    ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-950 shadow-sm'
                    : 'bg-white dark:bg-[#141720] border border-black/[0.07] dark:border-white/[0.07] text-gray-500 dark:text-gray-400 hover:border-black/[0.15] dark:hover:border-white/[0.15]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(calc => <ToolCard key={calc.id} calc={calc} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-2">
            <Search className="h-8 w-8 text-gray-300 dark:text-gray-700" />
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">No tools found for &ldquo;{query}&rdquo;</p>
            <button onClick={() => { setQuery(''); setCategory('all'); }} className="text-xs text-blue-500 hover:underline">
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* ── Trust strip ───────────────────────────────────────── */}
      <section className="rounded-2xl bg-white dark:bg-[#141720] border border-black/[0.06] dark:border-white/[0.06] px-8 py-7 flex flex-wrap items-center justify-center gap-8 text-center shadow-sm">
        {[
          { icon: <Zap className="h-4 w-4" />, title: 'Instant Results', desc: '100% client-side, zero latency' },
          { icon: <Scale className="h-4 w-4" />, title: 'Always Accurate', desc: 'Updated for FY 2083/84 Nepal rules' },
          { icon: <Camera className="h-4 w-4" />, title: 'Private by Design', desc: 'No data ever leaves your browser' },
          { icon: <Sparkles className="h-4 w-4" />, title: 'Free Forever', desc: 'No signup, no paywalls' },
        ].map(item => (
          <div key={item.title} className="flex items-center gap-3 text-left max-w-[180px]">
            <span className="flex-shrink-0 p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-500">{item.icon}</span>
            <div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200">{item.title}</div>
              <div className="text-[11px] text-gray-400 dark:text-gray-600 mt-0.5 leading-tight">{item.desc}</div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
