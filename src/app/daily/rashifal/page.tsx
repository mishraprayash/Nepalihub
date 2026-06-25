'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';

const RASHIS = [
  { id: 'aries', name: 'Mesha (मेष)', english: 'Aries', symbol: '🐏', element: 'Fire', dateRange: 'Baisakh (Apr 13 – May 14)' },
  { id: 'taurus', name: 'Vrishabha (वृष)', english: 'Taurus', symbol: '🐂', element: 'Earth', dateRange: 'Jestha (May 15 – Jun 14)' },
  { id: 'gemini', name: 'Mithuna (मिथुन)', english: 'Gemini', symbol: '👯', element: 'Air', dateRange: 'Asar (Jun 15 – Jul 15)' },
  { id: 'cancer', name: 'Karka (कर्कट)', english: 'Cancer', symbol: '🦀', element: 'Water', dateRange: 'Shrawan (Jul 16 – Aug 16)' },
  { id: 'leo', name: 'Simha (सिंह)', english: 'Leo', symbol: '🦁', element: 'Fire', dateRange: 'Bhadra (Aug 17 – Sep 16)' },
  { id: 'virgo', name: 'Kanya (कन्या)', english: 'Virgo', symbol: '👩‍🌾', element: 'Earth', dateRange: 'Ashwin (Sep 17 – Oct 17)' },
  { id: 'libra', name: 'Tula (तुला)', english: 'Libra', symbol: '⚖️', element: 'Air', dateRange: 'Kartik (Oct 18 – Nov 16)' },
  { id: 'scorpio', name: 'Vrishchika (वृश्चिक)', english: 'Scorpio', symbol: '🦂', element: 'Water', dateRange: 'Mangsir (Nov 17 – Dec 15)' },
  { id: 'sagittarius', name: 'Dhanu (धनु)', english: 'Sagittarius', symbol: '🏹', element: 'Fire', dateRange: 'Poush (Dec 16 – Jan 14)' },
  { id: 'capricorn', name: 'Makara (मकर)', english: 'Capricorn', symbol: '🐊', element: 'Earth', dateRange: 'Magh (Jan 15 – Feb 13)' },
  { id: 'aquarius', name: 'Kumbha (कुम्भ)', english: 'Aquarius', symbol: '🏺', element: 'Air', dateRange: 'Falgun (Feb 14 – Mar 14)' },
  { id: 'pisces', name: 'Meena (मीन)', english: 'Pisces', symbol: '🐟', element: 'Water', dateRange: 'Chaitra (Mar 15 – Apr 12)' },
];

const API_BASE = '/api/horoscope';
const CACHE_KEY = 'rashifal_cache';

interface CachedSign {
  horoscope: string;
  date: string;
}

interface CacheEntry {
  day: string; // 'YYYY-MM-DD'
  signs: Record<string, CachedSign>;
}

function getTodayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function loadCache(): CacheEntry | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    // Only use cache if it's from today
    if (entry.day === getTodayKey()) return entry;
    localStorage.removeItem(CACHE_KEY);
    return null;
  } catch {
    return null;
  }
}

function saveCache(entry: CacheEntry): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

export default function Rashifal() {
  const [selectedSign, setSelectedSign] = useState('aries');
  const [horoscope, setHoroscope] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Persisted cache across renders (not state — we mutate through ref logic in fetch)
  const cacheRef = loadCache();

  const fetchHoroscope = useCallback(async (sign: string, force = false) => {
    // Check cache first
    if (!force && cacheRef) {
      const cached = cacheRef.signs[sign];
      if (cached) {
        setHoroscope(cached.horoscope);
        setDate(cached.date);
        setLoading(false);
        setError('');
        return;
      }
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}/${sign}`);
      const data = await res.json();
      if (data?.horoscope) {
        setHoroscope(data.horoscope);
        setDate(data.date);

        // Update cache
        const cache = loadCache() || { day: getTodayKey(), signs: {} };
        cache.signs[sign] = { horoscope: data.horoscope, date: data.date };
        saveCache(cache);

        // Pre-fetch remaining signs in background (lazy)
        const remaining = RASHIS
          .map(r => r.id)
          .filter(id => id !== sign && !cache.signs[id]);

        if (remaining.length > 0) {
          // Fire-and-forget pre-fetch for next clicks
          Promise.allSettled(
            remaining.map(async (id) => {
              try {
                const r = await fetch(`${API_BASE}/${id}`);
                const d = await r.json();
                if (d?.horoscope) {
                  cache.signs[id] = { horoscope: d.horoscope, date: d.date };
                }
              } catch { /* background fail is ok */ }
            })
          ).then(() => {
            saveCache(cache);
          });
        }
      } else {
        throw new Error('Invalid response');
      }
    } catch {
      setError('Could not load today\'s rashifal. Please try again.');
      setHoroscope('');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount
  useEffect(() => {
    fetchHoroscope(selectedSign);
  }, []);

  // Load on sign change — uses cache if available
  const handleSignChange = (sign: string) => {
    setSelectedSign(sign);
    fetchHoroscope(sign);
  };

  const handleRefresh = () => {
    fetchHoroscope(selectedSign, true);
  };

  const selectedRashi = RASHIS.find(r => r.id === selectedSign)!;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Rashifal (राशिफल)
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Daily horoscope for all 12 Nepali zodiac signs (Rashis). Predictions are cached locally — they only change once per day.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Rashi Selector Sidebar */}
        <div className="space-y-4">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" /> Your Rashi
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {RASHIS.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSignChange(r.id)}
                className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                  selectedSign === r.id
                    ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white border-transparent shadow-md'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-base block">{r.symbol}</span>
                <span className="text-[11px]">{r.english}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Prediction */}
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 rounded-3xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-4xl mb-2">{selectedRashi.symbol}</div>
                <h2 className="text-2xl font-black">{selectedRashi.name}</h2>
                <p className="text-sm opacity-80">{selectedRashi.english} · {selectedRashi.element}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={handleRefresh}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {date ? new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-4">
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <RefreshCw className="h-6 w-6 animate-spin opacity-60" />
                </div>
              ) : error ? (
                <div className="flex items-center gap-2 text-amber-200">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              ) : (
                <p className="text-lg font-medium leading-relaxed">{horoscope}</p>
              )}
            </div>
          </div>

          {/* Rashi Info Card */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" /> About {selectedRashi.name}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Symbol</div>
                <div className="text-lg mt-0.5">{selectedRashi.symbol}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Element</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedRashi.element}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Nepali Name</div>
                <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedRashi.name}</div>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                <div className="text-[10px] font-bold text-gray-400 uppercase">Period</div>
                <div className="text-[11px] font-bold text-gray-900 dark:text-white mt-1">{selectedRashi.dateRange}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
