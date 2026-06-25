'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Sun, Moon, Search, Menu, X, Landmark, Compass, Sparkles } from 'lucide-react';
import { calculators } from '@/data/calculators';

export default function Navbar() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigateTo = (path: string) => {
    router.push(path);
    setSearchOpen(false);
    setSearchQuery('');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'dark');
  };

  const filteredCalculators = searchQuery
    ? calculators.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <header className="sticky top-0 z-50 w-full print:hidden">
      <div className="w-full bg-white/75 dark:bg-gray-900/75 backdrop-blur-md border-b border-gray-100 dark:border-gray-800/80 transition-all duration-200">
        {/* Decorative accent top line (flag representation) */}
        <div className="h-[3px] w-full bg-gradient-to-r from-red-600 via-white to-blue-600" />
        
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex h-16 items-center justify-between gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-black text-lg tracking-tight shrink-0">
              <span className="p-1.5 bg-red-50 dark:bg-red-950/30 rounded-lg text-red-600 dark:text-red-500">
                <Landmark className="h-5 w-5" />
              </span>
              <span className="text-gray-900 dark:text-white">
                Nepal<span className="text-blue-600 dark:text-blue-400">Hub</span>
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Link href="/finance/income-tax" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Tax</Link>
              <Link href="/finance/emi" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">EMI</Link>
              <Link href="/real-estate/land-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Land</Link>
              <Link href="/education/gpa" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">GPA</Link>
              <Link href="/utilities/gold-price" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Gold</Link>
              <Link href="/daily/date-converter" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Date</Link>
            </nav>

            {/* Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200/60 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-xs font-bold bg-white dark:bg-gray-900 shadow-sm"
                aria-label="Search utilities"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden md:inline text-gray-400 font-medium">Search...</span>
                <kbd className="hidden md:inline-flex h-4.5 select-none items-center gap-0.5 rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-1.5 font-mono text-[9px] font-bold text-gray-400 shadow-sm">
                  ⌘K
                </kbd>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-900 shadow-sm"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="h-4 w-4 text-yellow-400" /> : <Moon className="h-4 w-4" />}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl border border-gray-200/60 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all bg-white dark:bg-gray-900 shadow-sm"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-4 space-y-1 shadow-inner">
            {[
              { href: '/finance/income-tax', label: 'Income Tax' },
              { href: '/finance/emi', label: 'EMI Calculator' },
              { href: '/real-estate/land-converter', label: 'Land Converter' },
              { href: '/education/gpa', label: 'GPA Calculator' },
              { href: '/utilities/gold-price', label: 'Gold Estimator' },
              { href: '/daily/date-converter', label: 'Date Converter' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Global Search Dialog Modal - Moved outside the backdrop-blur wrapper */}

      {/* Global Search Dialog Modal */}
      {searchOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center pt-20 px-4"
          onClick={() => {
            setSearchOpen(false);
            setSearchQuery('');
          }}
        >
          <div 
            className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl w-full max-w-xl max-h-[420px] flex flex-col shadow-2xl overflow-hidden transition-all"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
          >
            {/* Search Header */}
            <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/50">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                placeholder="Search tools (e.g. tax, emi, GPA, land)..."
                className="w-full bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-sm font-semibold"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const targets = searchQuery ? filteredCalculators : calculators;
                    if (targets.length > 0) {
                      navigateTo(targets[0].path);
                    }
                  }
                }}
              />
              <button
                onClick={() => {
                  setSearchOpen(false);
                  setSearchQuery('');
                }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-colors text-xs font-bold uppercase"
              >
                esc
              </button>
            </div>

            {/* Search Results List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {searchQuery === '' ? (
                <div>
                  <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Popular Tools</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {calculators.slice(0, 4).map((calc) => (
                      <button
                        key={calc.id}
                        onClick={() => navigateTo(calc.path)}
                        className="text-left w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800/80 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-900/5 transition-all flex flex-col justify-between"
                      >
                        <span className="font-bold text-sm text-gray-950 dark:text-gray-100">{calc.name}</span>
                        <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{calc.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : filteredCalculators.length > 0 ? (
                <div className="space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Search Results</h3>
                  {filteredCalculators.map((calc) => (
                    <button
                      key={calc.id}
                      onClick={() => navigateTo(calc.path)}
                      className="text-left w-full p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50/10 dark:hover:bg-blue-900/5 transition-all flex flex-col"
                    >
                      <span className="font-bold text-sm text-gray-950 dark:text-gray-100">{calc.name}</span>
                      <span className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{calc.description}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <span className="text-sm text-gray-400">No tools found matching &ldquo;{searchQuery}&rdquo;</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
