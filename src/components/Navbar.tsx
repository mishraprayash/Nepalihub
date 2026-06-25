'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Search, Menu, X, Landmark, ChevronRight } from 'lucide-react';
import { calculators } from '@/data/calculators';

const NAV_LINKS = [
  { href: '/finance/income-tax', label: 'Tax' },
  { href: '/finance/emi', label: 'EMI' },
  { href: '/utilities/gold-price', label: 'Gold' },
  { href: '/real-estate/land-converter', label: 'Land' },
  { href: '/daily/date-converter', label: 'Dates' },
];

export default function Navbar() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Theme init
  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initial = saved ?? (prefersDark ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
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
        setSearchQuery('');
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.classList.toggle('dark', next === 'dark');
  };

  const navigateTo = (path: string) => {
    router.push(path);
    setSearchOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  const results = searchQuery.trim()
    ? calculators.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : calculators.slice(0, 6);

  return (
    <>
      <header className={`sticky top-0 z-40 w-full print:hidden transition-all duration-300 ${scrolled ? 'shadow-sm' : ''}`}>
        {/* Nepal flag accent */}
        <div className="h-[2.5px] w-full bg-gradient-to-r from-red-600 via-white to-blue-700" />

        <div className="w-full bg-white/80 dark:bg-[#0c0e14]/85 backdrop-blur-xl border-b border-black/[0.06] dark:border-white/[0.05]">
          <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
            <div className="flex h-14 items-center justify-between gap-4">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 font-black text-base tracking-tight shrink-0 group">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-red-500 to-red-700 text-white shadow-sm group-hover:shadow-red-500/30 transition-shadow">
                  <Landmark className="h-3.5 w-3.5" />
                </span>
                <span className="text-gray-900 dark:text-white">
                  Nepal<span className="text-blue-600 dark:text-blue-400">Hub</span>
                </span>
              </Link>

              {/* Desktop nav links */}
              <nav className="hidden md:flex items-center gap-0.5">
                {NAV_LINKS.map(l => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/[0.06] transition-all"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              {/* Right controls */}
              <div className="flex items-center gap-1.5 shrink-0">
                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-400 dark:text-gray-500 hover:border-gray-300 dark:hover:border-white/[0.14] hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-all text-xs bg-white dark:bg-white/[0.03] shadow-xs"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline font-medium text-gray-400 dark:text-gray-500">Search tools...</span>
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1 py-0.5 rounded border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.05] font-mono text-[10px] text-gray-400">
                    ⌘K
                  </kbd>
                </button>

                {/* Theme toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-all bg-white dark:bg-white/[0.03] shadow-xs"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark'
                    ? <Sun className="h-3.5 w-3.5 text-amber-400" />
                    : <Moon className="h-3.5 w-3.5" />}
                </button>

                {/* Mobile hamburger */}
                <button
                  onClick={() => setMobileMenuOpen(v => !v)}
                  className="md:hidden p-2 rounded-lg border border-gray-200 dark:border-white/[0.08] text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.06] transition-all bg-white dark:bg-white/[0.03] shadow-xs"
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-3.5 w-3.5" /> : <Menu className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile drawer */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 dark:border-white/[0.05] bg-white dark:bg-[#0f1117] px-4 py-3 space-y-0.5">
              {[
                { href: '/finance/income-tax', label: 'Income Tax Calculator' },
                { href: '/finance/emi', label: 'EMI Calculator' },
                { href: '/finance/sip', label: 'SIP Calculator' },
                { href: '/finance/stock-calculator', label: 'NEPSE Stock Calculator' },
                { href: '/utilities/remittance', label: 'Remittance & Forex' },
                { href: '/real-estate/land-converter', label: 'Land Converter' },
                { href: '/utilities/gold-price', label: 'Gold Price' },
                { href: '/daily/date-converter', label: 'Date Converter' },
                { href: '/daily/rashifal', label: 'Rashifal' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.05] hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  {item.label}
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 dark:text-gray-600" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Search modal — rendered outside header to avoid stacking context issues */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 flex justify-center items-start pt-16 px-4 bg-black/40 backdrop-blur-sm"
          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
        >
          <div
            className="w-full max-w-lg bg-white dark:bg-[#141720] border border-black/[0.07] dark:border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            style={{ maxHeight: '70vh' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Search input row */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 dark:border-white/[0.06]">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search calculators & tools..."
                className="flex-1 bg-transparent border-0 outline-none text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && results.length > 0) navigateTo(results[0].path);
                }}
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                className="text-[10px] font-bold text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-white/10 rounded px-1.5 py-0.5 hover:bg-gray-100 dark:hover:bg-white/[0.05] transition-colors"
              >
                ESC
              </button>
            </div>

            {/* Results */}
            <div className="overflow-y-auto flex-1 p-2">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest px-3 py-2">
                {searchQuery.trim() ? `${results.length} result${results.length !== 1 ? 's' : ''}` : 'Popular tools'}
              </p>
              {results.length > 0 ? (
                <div className="space-y-0.5">
                  {results.map(calc => (
                    <button
                      key={calc.id}
                      onClick={() => navigateTo(calc.path)}
                      className="w-full text-left flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.05] group transition-all"
                    >
                      <div>
                        <div className="text-sm font-semibold text-gray-900 dark:text-white">{calc.name}</div>
                        <div className="text-xs text-gray-400 dark:text-gray-600 line-clamp-1 mt-0.5">{calc.description}</div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-300 dark:text-gray-700 group-hover:text-blue-500 transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-sm text-gray-400">
                  No tools found for &ldquo;{searchQuery}&rdquo;
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
