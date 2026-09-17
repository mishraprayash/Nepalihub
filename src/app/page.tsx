'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Search, Calculator, Landmark, Calendar,
  Camera, FileText, Scale, BarChart3, Globe, TrendingUp, Zap,
  ShoppingCart, Shield, ArrowRight, ArrowUpRight, SearchX
} from 'lucide-react';
import { calculators, CalculatorInfo } from '@/data/calculators';

import AdBanner from '@/components/AdBanner';

/* ── Per-tool icons (single accent colour system — no rainbow tiles) ── */
const TOOL_ICONS: Record<string, React.ReactNode> = {
  'income-tax': <Landmark className="h-4 w-4" />,
  'emi': <Calculator className="h-4 w-4" />,
  'sip': <TrendingUp className="h-4 w-4" />,
  'stock-calculator': <BarChart3 className="h-4 w-4" />,
  'remittance': <Globe className="h-4 w-4" />,
  'nepali-unit-converter': <Scale className="h-4 w-4" />,
  'electricity-bill': <Zap className="h-4 w-4" />,
  'age-calculator': <Calendar className="h-4 w-4" />,
  'passport-photo': <Camera className="h-4 w-4" />,
  'invoice-generator': <FileText className="h-4 w-4" />,
  'date-converter': <Calendar className="h-4 w-4" />,
  'unicode-converter': <Globe className="h-4 w-4" />,
  'import-duty': <ShoppingCart className="h-4 w-4" />,
  'ssf': <Shield className="h-4 w-4" />,
};

const FALLBACK_ICON = <Calculator className="h-4 w-4" />;

const CATEGORY_ORDER = ['finance', 'utilities', 'daily', 'documents', 'real-estate', 'education'] as const;
const CATEGORY_LABELS: Record<string, string> = {
  finance: 'Finance',
  utilities: 'Utilities',
  daily: 'Daily Life',
  documents: 'Documents',
  'real-estate': 'Real Estate',
  education: 'Education',
};
const CATEGORY_NOTES: Record<string, string> = {
  finance: 'Tax, loans, investments — tuned to current FY rules.',
  utilities: 'Bills, forex, units — the everyday conversions.',
  daily: 'Dates and ages across both calendars.',
  documents: 'Photos and paperwork, ready to print.',
};

const FEATURED = ['income-tax', 'date-converter', 'remittance'];

/* ── Tool card ─────────────────────────────────────────────────── */
function ToolCard({ calc }: { calc: CalculatorInfo }) {
  const icon = TOOL_ICONS[calc.id] ?? FALLBACK_ICON;
  return (
    <Link
      href={calc.path}
      className="group relative flex items-start gap-4 bg-surface border border-line rounded-xl px-5 py-4 hover:border-simrik/40 hover:bg-surface-raised transition-colors duration-200"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line text-ink-faint group-hover:text-simrik group-hover:border-simrik/30 transition-colors">
        {icon}
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-ink leading-snug">{calc.name}</h3>
        <p className="mt-1 text-xs leading-relaxed text-ink-faint line-clamp-2">
          {calc.description}
        </p>
      </div>
      <ArrowUpRight className="absolute top-3.5 right-3.5 h-3.5 w-3.5 text-ink-faint opacity-0 -translate-y-0.5 translate-x-0.5 group-hover:opacity-100 group-hover:text-simrik group-hover:translate-x-0 group-hover:translate-y-0 transition-all" />
    </Link>
  );
}

/* ── Featured (wide) card ─────────────────────────────────────── */
function FeaturedCard({ calc }: { calc: CalculatorInfo }) {
  const icon = TOOL_ICONS[calc.id] ?? FALLBACK_ICON;
  return (
    <Link
      href={calc.path}
      className="group relative overflow-hidden col-span-full sm:col-span-2 flex flex-col justify-between gap-6 rounded-xl border border-simrik/25 bg-simrik/[0.04] dark:bg-simrik/[0.06] px-6 py-6 hover:border-simrik/50 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-simrik text-white">
            {icon}
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-simrik">Most used</p>
            <h3 className="text-base font-semibold text-ink">{calc.name}</h3>
          </div>
        </div>
      </div>
      <div className="flex items-end justify-between gap-4">
        <p className="text-[13px] leading-relaxed text-ink-soft max-w-md">{calc.description}</p>
        <span className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-simrik whitespace-nowrap">
          Open
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

/* ── Page ─────────────────────────────────────────────────────── */
export default function Home() {
  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState<string>('finance');
  const gridRef = useRef<HTMLDivElement>(null);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const matches = calculators.filter(c =>
    !q ||
    c.name.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.keywords.some(k => k.includes(q))
  );

  /* Scroll-spy over category sections */
  useEffect(() => {
    if (searching) return;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveCat(e.target.id.replace('cat-', ''));
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    CATEGORY_ORDER.forEach(cat => {
      const el = document.getElementById(`cat-${cat}`);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [searching]);

  const scrollToGrid = () => {
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const byCategory = (cat: string) => calculators.filter(c => c.category === cat);
  const featuredTools = calculators.filter(c => FEATURED.includes(c.id));

  return (
    <div className="max-w-6xl mx-auto">

      {/* ══ Hero — editorial, search-first ══════════════════════ */}
      <section className="pt-14 pb-16 md:pt-20 md:pb-20">
        <div className="grid md:grid-cols-12 gap-10 md:gap-12 items-end">

          {/* Copy */}
          <div className="md:col-span-7 space-y-6">
            <p className="text-sm text-brass font-medium">
              स्वतन्त्र · निजी · नेपाली — free tools that run entirely in your browser
            </p>
            <h1 className="font-display text-4xl md:text-[3.4rem] font-semibold leading-[1.08] tracking-tight text-ink">
              Every calculator<br />
              Nepal actually needs.
            </h1>
            <p className="text-[15px] leading-relaxed text-ink-soft max-w-md">
              Income tax under FY 2083/84 slabs. BS↔AD dates. NEPSE costs to the paisa.
              No signups, no servers holding your data — open a tool, get an answer.
            </p>

            {/* Popular links — quiet text affordances */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-ink-faint">Popular</span>
              {featuredTools.map(t => (
                <Link
                  key={t.id}
                  href={t.path}
                  className="group inline-flex items-center gap-1 text-sm font-medium text-ink underline decoration-simrik/40 decoration-2 underline-offset-4 hover:decoration-simrik transition-colors"
                >
                  {t.name.replace(' Calculator', '').replace('Nepal ', '')}
                  <ArrowRight className="h-3 w-3 text-simrik opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Search — the primary action */}
          <div className="md:col-span-5">
            <label className="block text-xs font-bold uppercase tracking-[0.15em] text-ink-faint mb-3">
              Find a tool
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-faint pointer-events-none" />
              <input
                type="text"
                placeholder="Try “tax”, “land”, “ropani”…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && scrollToGrid()}
                className="w-full py-3.5 pl-11 pr-4 text-sm font-medium rounded-2xl border border-line-strong bg-surface-raised text-ink shadow-[0_2px_12px_rgba(28,25,23,0.06)] placeholder:text-ink-faint focus:outline-none focus:border-simrik/60 focus:ring-3 focus:ring-simrik/10 transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold text-ink-faint hover:text-simrik px-1.5" aria-label="Clear search"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Live result peek */}
            <div className="mt-3 min-h-[2.5rem]">
              {searching ? (
                <button
                  onClick={scrollToGrid}
                  className="w-full text-left px-4 py-3 rounded-xl border border-dashed border-line-strong bg-surface hover:border-simrik/40 transition-colors"
                >
                  <span className="text-sm font-semibold text-ink">
                    {matches.length} tool{matches.length !== 1 ? 's' : ''} match{matches.length === 1 ? 'es' : ''}
                  </span>
                  <span className="ml-2 text-xs text-ink-faint">— see results below ↓</span>
                </button>
              ) : (
                <div className="flex flex-wrap gap-1.5 px-1">
                  {['Income Tax', 'EMI', 'Ropani', 'NEA bill'].map(t => (
                    <button
                      key={t}
                      onClick={() => { setQuery(t); scrollToGrid(); }}
                      className="px-3 py-1.5 rounded-full border border-line bg-surface text-xs font-medium text-ink-soft hover:border-simrik/40 hover:text-simrik transition-colors"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <AdBanner slot="mid-page-feed-slot" format="horizontal" />

      {/* ══ Tool discovery ══════════════════════════════════════ */}
      <section ref={gridRef} className="scroll-mt-24 pb-16">

        {searching ? (
          /* ── Flat result grid while searching ── */
          <div className="space-y-6">
            <div className="flex items-baseline justify-between border-b border-line pb-4">
              <h2 className="font-display text-2xl font-semibold text-ink">
                Results for “{query.trim()}”
              </h2>
              <button
                onClick={() => setQuery('')}
                className="text-xs font-semibold text-simrik hover:underline"
              >
                Browse all categories instead
              </button>
            </div>
            {matches.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {matches.map(c => <ToolCard key={c.id} calc={c} />)}
              </div>
            ) : (
              <div className="flex flex-col items-center py-16 text-center space-y-3">
                <SearchX className="h-7 w-7 text-ink-faint" />
                <p className="text-sm text-ink-soft">
                  Nothing matches “{query.trim()}”. Try a broader word like <em>tax</em> or <em>date</em>.
                </p>
                <button
                  onClick={() => setQuery('')}
                  className="text-xs font-semibold text-simrik hover:underline"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── Category rail + grouped sections ── */
          <div className="lg:grid lg:grid-cols-12 lg:gap-10">
            {/* Mobile category quick-nav */}
            <div className="lg:hidden col-span-full pb-6">
              <div className="sticky top-16 z-30 -mx-4 px-4 py-2 bg-paper/90 backdrop-blur-sm overflow-x-auto no-scrollbar">
                <div className="flex gap-2 w-max">
                  {CATEGORY_ORDER.map(cat => {
                    const count = byCategory(cat).length;
                    if (!count) return null;
                    return (
                      <a
                        key={cat}
                        href={`#cat-${cat}`}
                        onClick={() => setActiveCat(cat)}
                        className={`px-3.5 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap transition-colors ${
                          activeCat === cat
                            ? 'border-simrik/50 bg-simrik/[0.06] text-simrik'
                            : 'border-line bg-surface text-ink-soft'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                        <span className="ml-1.5 font-mono text-[10px] text-ink-faint">{count}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Rail */}
            <aside className="hidden lg:block col-span-3">
              <div className="sticky top-24 py-2">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-faint mb-4 px-3">
                  Browse
                </p>
                <nav className="space-y-0.5">
                  {CATEGORY_ORDER.map(cat => {
                    const count = byCategory(cat).length;
                    if (!count) return null;
                    return (
                      <a
                        key={cat}
                        href={`#cat-${cat}`}
                        onClick={() => setActiveCat(cat)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCat === cat
                            ? 'bg-surface-raised border border-line font-semibold text-ink'
                            : 'border border-transparent text-ink-soft hover:text-ink hover:bg-surface'
                        }`}
                      >
                        {CATEGORY_LABELS[cat]}
                        <span className={`text-[11px] font-mono ${activeCat === cat ? 'text-simrik' : 'text-ink-faint'}`}>
                          {count}
                        </span>
                      </a>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Sections */}
            <div className="lg:col-span-9 space-y-14">
              {CATEGORY_ORDER.map((cat, idx) => {
                const tools = byCategory(cat);
                if (!tools.length) return null;
                return (
                  <div key={cat} id={`cat-${cat}`} className="scroll-mt-24">
                    <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3 mb-5">
                      <div className="flex items-baseline gap-3">
                        <span className="font-mono text-[11px] text-ink-faint">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <h2 className="font-display text-2xl font-semibold text-ink">
                          {CATEGORY_LABELS[cat]}
                        </h2>
                      </div>
                      <p className="hidden sm:block text-xs text-ink-faint italic">
                        {CATEGORY_NOTES[cat]}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                      {tools.map(c =>
                        FEATURED.includes(c.id)
                          ? <FeaturedCard key={c.id} calc={c} />
                          : <ToolCard key={c.id} calc={c} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ══ Quiet trust line ════════════════════════════════════ */}
      <section className="pb-16">
        <div className="rounded-xl border border-line bg-surface px-6 py-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center">
          {[
            'Instant, client-side results',
            'FY 2083/84 rules',
            'No signup',
            'Nothing leaves your browser',
          ].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && <span className="text-line-strong select-none">·</span>}
              <span className="text-[13px] text-ink-soft font-medium">{item}</span>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
