'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, Sun, Moon, Star, Sparkles } from 'lucide-react';
import { NepaliDateConverter } from '@/utils/nepaliDateConverter';

const BS_MONTHS_NEPALI = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत्र'
];

const BS_MONTHS_ENGLISH = [
  'Baisakh', 'Jestha', 'Asar', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

const DAYS_NEPALI = ['आ', 'सो', 'म', 'बु', 'बि', 'शु', 'श'];

const DAYS_ENGLISH = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Major Nepali festivals mapped to BS dates (month, day, name, type)
// These are well-established dates. Some move by a day depending on actual tithi.
const FESTIVALS: { month: number; day: number; name: string; type: 'public' | 'festival' | 'observation'; emoji: string }[] = [
  // Baisakh (1)
  { month: 1, day: 1, name: 'Nepali New Year (Naya Barsha)', type: 'public', emoji: '🎉' },
  { month: 1, day: 11, name: 'Buddha Jayanti', type: 'public', emoji: '🪷' },
  // Jestha (2)
  // Asar (3)
  { month: 3, day: 15, name: 'Asar 15 (Dahi Chiura Khane Din)', type: 'festival', emoji: '🍚' },
  // Shrawan (4)
  { month: 4, day: 1, name: 'Shrawan Sankranti', type: 'festival', emoji: '🌿' },
  // Bhadra (5)
  { month: 5, day: 17, name: 'Haritalika Teej (Women\'s Festival)', type: 'festival', emoji: '🪔' },
  { month: 5, day: 18, name: 'Rishi Panchami', type: 'festival', emoji: '🙏' },
  // Ashwin (6) — Dashain
  { month: 6, day: 1, name: 'Indra Jatra', type: 'festival', emoji: '🎭' },
  { month: 6, day: 8, name: 'Ghatasthapana (Dashain starts)', type: 'festival', emoji: '🌱' },
  { month: 6, day: 11, name: 'Fulpati', type: 'festival', emoji: '🌸' },
  { month: 6, day: 12, name: 'Maha Ashtami', type: 'festival', emoji: '⚔️' },
  { month: 6, day: 13, name: 'Maha Navami', type: 'festival', emoji: '🙏' },
  { month: 6, day: 14, name: 'Vijaya Dashami (Dashain)', type: 'public', emoji: '🌺' },
  { month: 6, day: 15, name: 'Ekadashi', type: 'festival', emoji: '🙏' },
  { month: 6, day: 17, name: 'Kojagrat Purnima', type: 'festival', emoji: '🌕' },
  // Kartik (7) — Tihar
  { month: 7, day: 1, name: 'Kartik Sankranti', type: 'festival', emoji: '🌿' },
  { month: 7, day: 12, name: 'Yamapanchak / Tihar Starts', type: 'festival', emoji: '🪔' },
  { month: 7, day: 13, name: 'Kukur Tihar (Dog Worship)', type: 'festival', emoji: '🐕' },
  { month: 7, day: 14, name: 'Laxmi Puja (Gai Tihar)', type: 'festival', emoji: '🐄' },
  { month: 7, day: 15, name: 'Gobardhan Puja (Goru Puja)', type: 'festival', emoji: '🐂' },
  { month: 7, day: 16, name: 'Bhai Tika (Brother\'s Day)', type: 'public', emoji: '🎊' },
  { month: 7, day: 17, name: 'Chhath Parva', type: 'festival', emoji: '🌅' },
  // Mangsir (8)
  // Poush (9)
  { month: 9, day: 1, name: 'Poush Sankranti (Makar Sankranti)', type: 'festival', emoji: '🪁' },
  { month: 9, day: 15, name: 'Maha Purnima / Maghe Purnima', type: 'festival', emoji: '🌕' },
  // Magh (10)
  { month: 10, day: 1, name: 'Maghe Sankranti', type: 'festival', emoji: '🍠' },
  { month: 10, day: 15, name: 'Basanta Panchami / Saraswati Puja', type: 'festival', emoji: '📚' },
  // Falgun (11)
  { month: 11, day: 8, name: 'Maha Shivaratri', type: 'public', emoji: '🕉️' },
  { month: 11, day: 15, name: 'Fagu Purnima (Holi)', type: 'public', emoji: '🌈' },
  // Chaitra (12)
  { month: 12, day: 8, name: 'Chaitra Dashain (Ghoda Jatra)', type: 'festival', emoji: '🐴' },
  { month: 12, day: 15, name: 'Ram Nawami', type: 'public', emoji: '🏹' },
];

// BS days in each month
const BS_MONTH_LENGTHS: Record<number, number[]> = {
  2082: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2083: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
  2084: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
};

function getBSMonthDays(year: number, month: number): number {
  // Fall back to BS_MONTH_DAYS lookup from the converter data
  // For now, use provided data or approximate
  if (BS_MONTH_LENGTHS[year]) return BS_MONTH_LENGTHS[year][month - 1];
  // Return a reasonable default
  const avgDays = [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30];
  return avgDays[month - 1];
}

export default function NepaliCalendar() {
  const today = new Date();
  const todayAD = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  
  let initialBS = '';
  try { initialBS = NepaliDateConverter.adToBs(todayAD); } catch { initialBS = '2082-01-01'; }
  const initialParts = initialBS.split('-').map(Number);

  const [bsYear, setBsYear] = useState(initialParts[0]);
  const [bsMonth, setBsMonth] = useState(initialParts[1]); // 1-indexed
  const [selectedDay, setSelectedDay] = useState(initialParts[2]);
  const [viewMode, setViewMode] = useState<'month' | 'today'>('today');

  useEffect(() => {
    const parts = initialBS.split('-').map(Number);
    setBsYear(parts[0]);
    setBsMonth(parts[1]);
    setSelectedDay(parts[2]);
  }, []);

  // Navigate months
  const prevMonth = () => {
    if (bsMonth === 1) { setBsYear(y => y - 1); setBsMonth(12); }
    else setBsMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (bsMonth === 12) { setBsYear(y => y + 1); setBsMonth(1); }
    else setBsMonth(m => m + 1);
  };
  const goToToday = () => {
    const parts = initialBS.split('-').map(Number);
    setBsYear(parts[0]);
    setBsMonth(parts[1]);
    setSelectedDay(parts[2]);
  };

  // Get the AD date for the 1st of the current BS month
  const firstOfMonthBS = `${bsYear}-${String(bsMonth).padStart(2, '0')}-01`;
  let firstDayOfWeek = 0; // Sunday
  try {
    const firstOfMonthAD = NepaliDateConverter.bsToAd(firstOfMonthBS);
    const d = new Date(firstOfMonthAD);
    firstDayOfWeek = d.getDay(); // 0=Sun
  } catch { firstDayOfWeek = 0; }

  const daysInMonth = getBSMonthDays(bsYear, bsMonth);
  const todayBS = initialBS;

  // Get festivals for current month
  const monthFestivals = FESTIVALS.filter(f => f.month === bsMonth);
  
  // Calendar grid
  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) calendarDays.push(null);
  for (let day = 1; day <= daysInMonth; day++) calendarDays.push(day);

  // Format BS date for display
  const bsDateStr = `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
  let adDateStr = '';
  try { adDateStr = NepaliDateConverter.bsToAd(bsDateStr); } catch { adDateStr = ''; }

  const selectedFestivals = FESTIVALS.filter(f => f.month === bsMonth && f.day === selectedDay);

  // Nepali day of week
  let selectedDayOfWeek = '';
  if (adDateStr) {
    const d = new Date(adDateStr);
    selectedDayOfWeek = DAYS_NEPALI[d.getDay()];
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Patro (पात्रो)
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Nepali calendar with Bikram Sambat dates, festivals, public holidays, and tithi information.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          {/* Today's BS Date Hero */}
          <div className="bg-gradient-to-br from-red-600 via-red-500 to-blue-600 text-white p-6 rounded-2xl shadow-xl text-center">
            <div className="text-sm font-semibold opacity-90 mb-1">आज / Today</div>
            <div className="text-4xl font-black mb-1">
              {String(initialParts[2]).padStart(2, '0')}
            </div>
            <div className="text-xl font-bold opacity-90">
              {BS_MONTHS_NEPALI[initialParts[1] - 1]} {initialParts[0]}
            </div>
            <div className="text-sm opacity-80 mt-2">
              {BS_MONTHS_ENGLISH[initialParts[1] - 1]} {initialParts[2]}, {initialParts[0]} BS
            </div>
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="text-center">
              <div className="text-lg font-extrabold text-gray-900 dark:text-white">
                {BS_MONTHS_NEPALI[bsMonth - 1]} ({BS_MONTHS_ENGLISH[bsMonth - 1]})
              </div>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">{bsYear} BS</div>
            </div>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div>
            <div className="grid grid-cols-7 gap-1 mb-1">
              {DAYS_NEPALI.map((d, i) => (
                <div key={i} className="text-center text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, i) => {
                if (day === null) return <div key={`empty-${i}`} />;
                const isToday = day === initialParts[2] && bsMonth === initialParts[1] && bsYear === initialParts[0];
                const isSelected = day === selectedDay;
                const hasFestival = monthFestivals.some(f => f.day === day);
                const fest = monthFestivals.find(f => f.day === day);

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`relative aspect-square rounded-xl text-sm font-semibold transition-all flex flex-col items-center justify-center ${
                      isToday
                        ? 'bg-blue-600 text-white shadow-md'
                        : isSelected
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span>{day}</span>
                    {hasFestival && fest && (
                      <span className="text-[9px] mt-0.5">{fest.emoji}</span>
                    )}
                    {isToday && !hasFestival && (
                      <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Day Details */}
          <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-400 uppercase">Selected Date</span>
                <div className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                  {BS_MONTHS_NEPALI[bsMonth - 1]} {selectedDay}, {bsYear} BS
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {BS_MONTHS_ENGLISH[bsMonth - 1]} {selectedDay}, {bsYear} {selectedDayOfWeek ? `(${selectedDayOfWeek})` : ''}
                </div>
                {adDateStr && (
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    🇬🇷 {new Date(adDateStr).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                )}
              </div>
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        </div>

        {/* Festivals & Info Panel */}
        <div className="space-y-6">
          {/* Festivals This Month */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-red-500" /> 
              {BS_MONTHS_ENGLISH[bsMonth - 1]} — Festivals & Events
            </h3>
            {monthFestivals.length > 0 ? (
              <div className="space-y-2">
                {monthFestivals.map((fest, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl text-sm transition-all ${
                      fest.day === selectedDay
                        ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        : 'bg-gray-50 dark:bg-gray-900/30 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{fest.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white">{fest.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {BS_MONTHS_NEPALI[bsMonth - 1]} {fest.day}
                      </div>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        fest.type === 'public' 
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : fest.type === 'festival'
                          ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>
                        {fest.type === 'public' ? '🏛 Public Holiday' : fest.type === 'festival' ? '🎊 Festival' : '🙏 Observation'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">
                No major festivals this month
              </p>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">About Nepali Calendar</h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 leading-relaxed">
              <p>
                <strong>Bikram Sambat (BS)</strong> is the official calendar of Nepal. 
                It is approximately 56 years and 8 months ahead of the Gregorian calendar (AD).
              </p>
              <p>
                <strong>New Year (Naya Barsha)</strong> begins in the month of Baisakh (mid-April).
              </p>
              <p>
                <strong>Major festivals</strong> are determined by the lunar calendar and 
                their exact dates may vary by ±1 day depending on tithi calculations. 
                Always verify with official announcements.
              </p>
              <p className="text-blue-600 dark:text-blue-400 font-medium">
                BS months have 29–32 days based on astronomical calculations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
