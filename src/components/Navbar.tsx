'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Search, Menu, X, ChevronRight, ArrowRight } from 'lucide-react';
import { calculators } from '@/data/calculators';

const CATEGORY_LABELS: Record<string, string> = {
  finance: 'Finance',
  utilities: 'Utilities',
  'real-estate': 'Real Estate',
  daily: 'Daily Life',
  education: 'Education',
  documents: 'Documents',
};

export default function Navbar() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);

  // Theme init
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- must read localStorage after hydration
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(v => !v);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileMenuOpen(false);
        setToolsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Close tools menu on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [searchOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setSearchOpen(false);
    setSearchQuery('');
    setActiveIndex(0);
    setMobileMenuOpen(false);
    setToolsMenuOpen(false);
  };

  const results = searchQuery.trim()
    ? calculators.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : calculators.slice(0, 6);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && results[activeIndex]) navigateTo(results[activeIndex].path);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full print:hidden">
        <div className="w-full bg-paper/90 dark:bg-paper/95 backdrop-blur-lg border-b border-line">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex h-16 items-center justify-between gap-6">

              {/* Wordmark */}
              <Link href="/" className="shrink-0 group">
                <span className="font-display text-xl font-semibold tracking-tight text-ink">
                  Nepal<span className="text-simrik">Hub</span>
                  <span className="hidden sm:inline text-xs font-body font-medium tracking-normal text-ink-faint ml-2 align-middle uppercase">
                    Everyday tools for Nepal
                  </span>
                </span>
              </Link>

              {/* Desktop nav */}
              <nav className="hidden md:flex items-center gap-1">
                {/* Tools dropdown */}
                <div className="relative" ref={toolsRef}>
                  <button
                    aria-expanded={toolsMenuOpen}
                    aria-haspopup="true"
                    onClick={() => setToolsMenuOpen(v => !v)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50 ${
                      toolsMenuOpen ? 'text-ink bg-paper-deep' : 'text-ink-soft hover:text-ink hover:bg-paper-deep'
                    }`}
                  >
                    All Tools
                    <span className="ml-1 px-1.5 py-0.5 rounded-md bg-simrik/10 text-simrik text-xs font-bold">
                      {calculators.length}
                    </span>
                  </button>

                  {toolsMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-full max-w-md bg-surface-raised border border-line rounded-2xl shadow-xl shadow-black/5 p-4 grid grid-cols-2 gap-x-6 gap-y-0.5 max-h-[70vh] overflow-y-auto">
                      {Object.entries(
                        calculators.reduce((acc, c) => {
                          (acc[c.category] ??= []).push(c);
                          return acc;
                        }, {} as Record<string, typeof calculators>)
                      ).map(([cat, tools]) => (
                        <div key={cat} className="py-2">
                          <p className="text-xs font-bold uppercase tracking-widest text-ink-faint px-3 pb-1.5">
                            {CATEGORY_LABELS[cat] ?? cat}
                          </p>
                          {tools.map(t => (
                            <button
                              key={t.id}
                              onClick={() => navigateTo(t.path)}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-deep transition-colors truncate"
                            >
                              {t.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {[
                  { href: '/finance/income-tax', label: 'Income Tax' },
                  { href: '/daily/date-converter', label: 'Date Converter' },
                ].map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:text-ink hover:bg-paper-deep transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* Right controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 h-9 pl-3 pr-2 rounded-full border border-line bg-surface text-ink-faint hover:border-line-strong hover:text-ink-soft transition-all outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline text-xs font-medium">Search</span>
                  <kbd className="hidden sm:inline-flex px-1.5 py-0.5 rounded-md bg-paper-deep border border-line font-mono text-xs text-ink-faint">
                    ⌘K
                  </kbd>
                </button>

                <button
                  onClick={toggleTheme}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-line bg-surface text-ink-soft hover:text-ink hover:border-line-strong transition-all outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>

                <button
                  aria-expanded={mobileMenuOpen}
                  aria-controls="mobile-menu"
                  onClick={() => setMobileMenuOpen(v => !v)}
                  className="md:hidden h-9 w-9 flex items-center justify-center rounded-full border border-line bg-surface text-ink-soft transition-all outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div id="mobile-menu" className="md:hidden border-t border-line bg-paper px-4 py-3 max-h-[calc(100dvh-4rem)] overflow-y-auto space-y-0.5">
              {calculators.map(item => (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50"
                >
                  {item.name}
                  <ChevronRight className="h-3.5 w-3.5 text-ink-faint" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Search palette */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start pt-24 px-4 bg-black/40 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
        >
          <div
            className="w-full max-w-lg bg-surface-raised border border-line rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '65vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-line">
              <Search className="h-4 w-4 text-ink-faint shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search tools… try “tax”, “land”, “gold”"
                className="flex-1 bg-transparent border-0 outline-none focus-visible:outline-none text-sm font-medium text-ink placeholder:text-ink-faint"
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setActiveIndex(0); }}
                onKeyDown={onKeyDown}
              />
              <kbd className="text-xs font-bold text-ink-faint border border-line rounded px-1.5 py-0.5 font-mono">
                ESC
              </kbd>
            </div>

            <div className="overflow-y-auto flex-1 p-2">
              <p className="text-xs font-bold text-ink-faint uppercase tracking-widest px-3 py-2">
                {searchQuery.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Popular tools'}
              </p>
              {results.length > 0 ? (
                <div className="space-y-0.5 pb-2">
                  {results.map((calc, i) => (
                    <button
                      key={calc.id}
                      onClick={() => navigateTo(calc.path)}
                      onMouseEnter={() => setActiveIndex(i)}
                      className={`w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl group transition-colors outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-simrik/50 ${
                        i === activeIndex ? 'bg-paper-deep' : ''
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-ink truncate">{calc.name}</div>
                        <div className="text-xs text-ink-faint line-clamp-1 mt-0.5">{calc.description}</div>
                      </div>
                      <ArrowRight className={`h-4 w-4 shrink-0 transition-opacity ${i === activeIndex ? 'opacity-100 text-simrik' : 'opacity-0'}`} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-sm text-ink-faint">
                  Nothing matches &ldquo;{searchQuery}&rdquo; yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
