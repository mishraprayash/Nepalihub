'use client';

import { useState, useEffect } from 'react';
import { Star, Sparkles, Calendar, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { NepaliDateConverter } from '@/utils/nepaliDateConverter';

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

// Nepali zodiac name → English API sign mapping
const BS_MONTH_TO_SIGN: Record<number, string> = {
  1: 'aries', 2: 'taurus', 3: 'gemini', 4: 'cancer',
  5: 'leo', 6: 'virgo', 7: 'libra', 8: 'scorpio',
  9: 'sagittarius', 10: 'capricorn', 11: 'aquarius', 12: 'pisces',
};

const API_BASE = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily';

export default function Rashifal() {
  const [selectedSign, setSelectedSign] = useState('aries');
  const [horoscope, setHoroscope] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  // Find Rashi state
  const [bsYear, setBsYear] = useState('');
  const [bsMonth, setBsMonth] = useState('');
  const [foundSign, setFoundSign] = useState<string | null>(null);
  const [findError, setFindError] = useState('');

  const fetchHoroscope = async (sign: string) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE}?sign=${sign}&day=today`);
      const data = await res.json();
      if (data?.data?.horoscope) {
        setHoroscope(data.data.horoscope);
        setLastUpdated(data.data.date);
      } else {
        throw new Error('Invalid response');
      }
    } catch (err) {
      setError('Could not load today\'s rashifal. Please try again.');
      setHoroscope('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHoroscope(selectedSign);
  }, [selectedSign]);

  const handleFindRashi = () => {
    if (!bsYear || !bsMonth) {
      setFindError('Please enter your BS birth year and month');
      setFoundSign(null);
      return;
    }
    const m = parseInt(bsMonth);
    if (m < 1 || m > 12) {
      setFindError('Month must be between 1 and 12');
      setFoundSign(null);
      return;
    }
    setFindError('');
    const signId = BS_MONTH_TO_SIGN[m] || 'aries';
    setFoundSign(signId);
  };

  const selectedRashi = RASHIS.find(r => r.id === selectedSign)!;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Rashifal (राशिफल)
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Daily horoscope and personality insights for all 12 Nepali zodiac signs (Rashis). Data sourced from live astrology API.
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
                onClick={() => setSelectedSign(r.id)}
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

          {/* Quick Find by BS Month */}
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900/30 rounded-xl border border-gray-100 dark:border-gray-800">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Find Your Rashi</h4>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <input
                type="number"
                value={bsYear}
                onChange={e => setBsYear(e.target.value)}
                placeholder="BS Year"
                className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={bsMonth}
                onChange={e => setBsMonth(e.target.value)}
                placeholder="Month (1-12)"
                min="1" max="12"
                className="py-2 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleFindRashi}
              className="w-full py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-xs flex items-center justify-center gap-1"
            >
              <Search className="h-3 w-3" /> Find
            </button>
            {findError && <p className="text-xs text-red-500 mt-2">{findError}</p>}
            {foundSign && (
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-500">Your Rashi: </span>
                <button
                  onClick={() => { setSelectedSign(foundSign); setFoundSign(null); }}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {RASHIS.find(r => r.id === foundSign)?.symbol} {RASHIS.find(r => r.id === foundSign)?.name}
                </button>
              </div>
            )}
            <p className="text-[10px] text-gray-400 mt-2">BS Month: 1=Baisakh ... 12=Chaitra</p>
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
                    onClick={() => fetchHoroscope(selectedSign)}
                    disabled={loading}
                    className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  </button>
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {lastUpdated ? new Date(lastUpdated).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) : ''}
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
