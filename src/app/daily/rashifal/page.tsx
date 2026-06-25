'use client';

import { useState, useEffect } from 'react';
import { Star, Sparkles, Heart, Calendar, Moon, Sun, User, Search } from 'lucide-react';
import { NepaliDateConverter } from '@/utils/nepaliDateConverter';

const RASHIS = [
  { id: 'mesha', name: 'Mesha (मेष)', english: 'Aries', symbol: '🐏', element: 'Fire', dateRange: 'Baisakh (Apr 13 – May 14)' },
  { id: 'vrishabha', name: 'Vrishabha (वृष)', english: 'Taurus', symbol: '🐂', element: 'Earth', dateRange: 'Jestha (May 15 – Jun 14)' },
  { id: 'mithuna', name: 'Mithuna (मिथुन)', english: 'Gemini', symbol: '👯', element: 'Air', dateRange: 'Asar (Jun 15 – Jul 15)' },
  { id: 'karka', name: 'Karka (कर्कट)', english: 'Cancer', symbol: '🦀', element: 'Water', dateRange: 'Shrawan (Jul 16 – Aug 16)' },
  { id: 'simha', name: 'Simha (सिंह)', english: 'Leo', symbol: '🦁', element: 'Fire', dateRange: 'Bhadra (Aug 17 – Sep 16)' },
  { id: 'kanya', name: 'Kanya (कन्या)', english: 'Virgo', symbol: '👩‍🌾', element: 'Earth', dateRange: 'Ashwin (Sep 17 – Oct 17)' },
  { id: 'tula', name: 'Tula (तुला)', english: 'Libra', symbol: '⚖️', element: 'Air', dateRange: 'Kartik (Oct 18 – Nov 16)' },
  { id: 'vrishchika', name: 'Vrishchika (वृश्चिक)', english: 'Scorpio', symbol: '🦂', element: 'Water', dateRange: 'Mangsir (Nov 17 – Dec 15)' },
  { id: 'dhanu', name: 'Dhanu (धनु)', english: 'Sagittarius', symbol: '🏹', element: 'Fire', dateRange: 'Poush (Dec 16 – Jan 14)' },
  { id: 'makara', name: 'Makara (मकर)', english: 'Capricorn', symbol: '🐊', element: 'Earth', dateRange: 'Magh (Jan 15 – Feb 13)' },
  { id: 'kumbha', name: 'Kumbha (कुम्भ)', english: 'Aquarius', symbol: '🏺', element: 'Air', dateRange: 'Falgun (Feb 14 – Mar 14)' },
  { id: 'meena', name: 'Meena (मीन)', english: 'Pisces', symbol: '🐟', element: 'Water', dateRange: 'Chaitra (Mar 15 – Apr 12)' },
];

// Rashi characteristics
const RASHI_DETAILS: Record<string, {
  traits: string[];
  gemstone: string;
  luckyNumber: number;
  luckyColor: string;
  lord: string;
  description: string;
}> = {
  mesha: { traits: ['Courageous', 'Determined', 'Confident', 'Impulsive'], gemstone: 'Red Coral', luckyNumber: 9, luckyColor: 'Red', lord: 'Mars (Mangal)', description: 'Mesha (Aries) is the first Rashi of the Nepali zodiac. Those born under this sign are natural leaders with immense energy and enthusiasm.' },
  vrishabha: { traits: ['Patient', 'Reliable', 'Devoted', 'Stubborn'], gemstone: 'Diamond', luckyNumber: 6, luckyColor: 'White', lord: 'Venus (Shukra)', description: 'Vrishabha (Taurus) represents stability and sensuality. Individuals are practical, hardworking, and deeply connected to material comforts.' },
  mithuna: { traits: ['Adaptable', 'Curious', 'Communicative', 'Inconsistent'], gemstone: 'Emerald', luckyNumber: 5, luckyColor: 'Green', lord: 'Mercury (Budh)', description: 'Mithuna (Gemini) is ruled by Mercury. Natives are intellectual, versatile, and possess excellent communication skills.' },
  karka: { traits: ['Intuitive', 'Emotional', 'Protective', 'Moody'], gemstone: 'Pearl', luckyNumber: 2, luckyColor: 'Silver', lord: 'Moon (Chandra)', description: 'Karka (Cancer) is deeply connected to family and emotions. These individuals are nurturing, loyal, and highly intuitive.' },
  simha: { traits: ['Generous', 'Dramatic', 'Ambitious', 'Bossy'], gemstone: 'Ruby', luckyNumber: 1, luckyColor: 'Gold', lord: 'Sun (Surya)', description: 'Simha (Leo) natives are born leaders with a magnetic personality. They are creative, warm-hearted, and love the spotlight.' },
  kanya: { traits: ['Analytical', 'Practical', 'Modest', 'Critical'], gemstone: 'Green Sapphire', luckyNumber: 5, luckyColor: 'Green', lord: 'Mercury (Budh)', description: 'Kanya (Virgo) is the sign of perfection. These individuals are meticulous, hardworking, and have an eye for detail.' },
  tula: { traits: ['Diplomatic', 'Charming', 'Fair-minded', 'Indecisive'], gemstone: 'Opal', luckyNumber: 6, luckyColor: 'Blue', lord: 'Venus (Shukra)', description: 'Tula (Libra) is all about balance and harmony. Natives are social, artistic, and have a strong sense of justice.' },
  vrishchika: { traits: ['Passionate', 'Resourceful', 'Brave', 'Jealous'], gemstone: 'Coral', luckyNumber: 8, luckyColor: 'Maroon', lord: 'Mars (Mangal)', description: 'Vrishchika (Scorpio) is the most intense sign. These individuals are determined, mysterious, and incredibly resourceful.' },
  dhanu: { traits: ['Optimistic', 'Adventurous', 'Honest', 'Restless'], gemstone: 'Yellow Sapphire', luckyNumber: 3, luckyColor: 'Yellow', lord: 'Jupiter (Brihaspati)', description: 'Dhanu (Sagittarius) represents the eternal seeker. Natives are philosophical, freedom-loving, and have a great sense of humor.' },
  makara: { traits: ['Disciplined', 'Ambitious', 'Patient', 'Pessimistic'], gemstone: 'Blue Sapphire', luckyNumber: 7, luckyColor: 'Dark Blue', lord: 'Saturn (Shani)', description: 'Makara (Capricorn) is the sign of hard work and achievement. These individuals are responsible, disciplined, and goal-oriented.' },
  kumbha: { traits: ['Innovative', 'Humanitarian', 'Detached', 'Unpredictable'], gemstone: 'Amethyst', luckyNumber: 4, luckyColor: 'Purple', lord: 'Saturn (Shani)', description: 'Kumbha (Aquarius) is the visionary of the zodiac. Natives are progressive, original, and deeply concerned with social causes.' },
  meena: { traits: ['Compassionate', 'Artistic', 'Intuitive', 'Escapist'], gemstone: 'Topaz', luckyNumber: 11, luckyColor: 'Sea Green', lord: 'Jupiter (Brihaspati)', description: 'Meena (Pisces) is the dreamer of the zodiac. These individuals are empathetic, creative, and deeply spiritual.' },
};

// Compatibility matrix (simplified)
const COMPATIBILITY: Record<string, string[]> = {
  mesha: ['simha', 'dhanu', 'mithuna', 'kumbha'],
  vrishabha: ['kanya', 'makara', 'karka', 'meena'],
  mithuna: ['tula', 'kumbha', 'mesha', 'simha'],
  karka: ['vrishchika', 'meena', 'vrishabha', 'kanya'],
  simha: ['mesha', 'dhanu', 'mithuna', 'tula'],
  kanya: ['vrishabha', 'makara', 'karka', 'vrishchika'],
  tula: ['mithuna', 'kumbha', 'simha', 'dhanu'],
  vrishchika: ['karka', 'meena', 'kanya', 'makara'],
  dhanu: ['mesha', 'simha', 'tula', 'kumbha'],
  makara: ['vrishabha', 'kanya', 'vrishchika', 'meena'],
  kumbha: ['mithuna', 'tula', 'mesha', 'dhanu'],
  meena: ['karka', 'vrishchika', 'vrishabha', 'makara'],
};

// Daily predictions (rotated by day of year)
const DAILY_PREDICTIONS: Record<string, string[]> = {
  mesha: ['A good day to start new projects. Your confidence will inspire others.', 'Focus on family matters today. A pleasant surprise awaits at home.', 'Financial opportunities may arise. Consider long-term investments.', 'Your communication skills are sharp. Perfect for negotiations.', 'Take time for self-care. A short break will boost your productivity.', 'An old friend may reconnect. Embrace the nostalgia.', 'Travel plans may materialize sooner than expected.'],
  vrishabha: ['Your patience will be rewarded today. Keep working toward your goals.', 'A creative idea could lead to financial gain. Trust your instincts.', 'Relationships take center stage. Show appreciation to loved ones.', 'Professional recognition is on the horizon. Stay dedicated.', 'Consider a new skill or hobby. Your mind is ready to learn.', 'Home improvements bring joy. A small change makes a big difference.', 'Unexpected news brings excitement. Embrace the change.'],
  mithuna: ['Your social skills are at their peak. Network and connect with others.', 'A decision you have been postponing needs attention. Trust your logic.', 'Financial planning pays off. Review your budget and savings.', 'Travel opportunities appear. A short trip refreshes your mind.', 'Creative projects flourish. Share your ideas with the world.', 'A conversation brings clarity to a lingering confusion.', 'Your energy is high. Channel it into productive tasks.'],
  karka: ['Emotional clarity arrives. Trust your feelings today.', 'Family matters require your attention. Your support is needed.', 'Career opportunities look promising. Take the first step.', 'Your intuition is especially strong. Listen to your inner voice.', 'A financial decision should be postponed. Wait for more information.', 'Self-care is important today. Treat yourself to something nice.', 'Communication with a partner improves. Share your thoughts openly.'],
  simha: ['Your leadership qualities shine. Take charge of a situation.', 'Creativity flows abundantly. Express yourself through art or writing.', 'A romantic gesture brightens your day. Spread the love.', 'Career advancement is possible. Showcase your talents.', 'Financial luck is on your side. Consider moderate risks.', 'Social events bring joy. Your charisma attracts positive attention.', 'Reflect on your goals. Align your actions with your ambitions.'],
  kanya: ['Your analytical mind solves a complex problem today.', 'Health matters need attention. A wellness routine brings benefits.', 'Professional recognition comes your way. Your hard work pays off.', 'A relationship requires patience. Listen before you speak.', 'Financial planning brings security. Review your long-term goals.', 'A creative pursuit brings satisfaction. Make time for hobbies.', 'Travel plans need careful planning. Detail-oriented approach helps.'],
  tula: ['Balance is key today. Harmony in relationships brings peace.', 'A creative project thrives. Your artistic side is active.', 'Financial decisions should be made with a partner. Seek advice.', 'Social gatherings bring opportunities. Your charm opens doors.', 'A legal matter resolves favorably. Justice prevails.', 'Self-reflection brings clarity. Write down your thoughts.', 'A new friendship blossoms. Be open to new connections.'],
  vrishchika: ['Your determination helps overcome an obstacle. Keep pushing forward.', 'A mystery unfolds. Your investigative skills are sharp.', 'Financial transformations are possible. Consider new income sources.', 'Intense emotions need expression. Find a healthy outlet.', 'A secret may be revealed. Handle the information wisely.', 'Your passion inspires others. Lead by example.', 'Personal growth accelerates. Embrace the changes within.'],
  dhanu: ['Adventure calls. A new experience expands your horizons.', 'Optimism attracts positive opportunities. Keep your spirits high.', 'A philosophical insight changes your perspective. Share your wisdom.', 'Travel plans take shape. Explore new destinations.', 'Financial growth through ethical means. Your honesty pays off.', 'A teaching or mentoring opportunity arises. Guide someone.', 'Your enthusiasm is contagious. Spread joy wherever you go.'],
  makara: ['Your discipline leads to achievement. Stay focused on your goals.', 'Professional recognition is near. Your hard work is noticed.', 'A financial strategy needs revision. Consult an expert.', 'Family responsibilities require your structured approach.', 'Health improves with routine. Stick to your schedule.', 'A long-term plan shows progress. Celebrate small wins.', 'Your patience in a relationship strengthens the bond.'],
  kumbha: ['An innovative idea sparks change. Share your unique perspective.', 'Social causes need your voice. Stand up for what you believe.', 'A friendship evolves into something deeper. Nurture it.', 'Technology or science brings good news. Stay updated.', 'Your humanitarian side shines. Help someone in need.', 'A sudden opportunity surprises you. Be ready to adapt.', 'Creative expression brings fulfillment. Think outside the box.'],
  meena: ['Your compassion touches someone deeply. A kind gesture goes far.', 'Artistic inspiration flows. Create something beautiful.', 'A spiritual practice brings inner peace. Meditate or reflect.', 'An intuitive feeling guides you. Trust your gut instinct.', 'A financial gift or support arrives. Accept graciously.', 'A dream reveals important insights. Pay attention to symbolism.', 'Your empathy strengthens a relationship. Listen with your heart.'],
};

function getRashiFromBSMonth(month: number): string {
  const rashiMap: Record<number, string> = {
    1: 'mesha', 2: 'vrishabha', 3: 'mithuna', 4: 'karka',
    5: 'simha', 6: 'kanya', 7: 'tula', 8: 'vrishchika',
    9: 'dhanu', 10: 'makara', 11: 'kumbha', 12: 'meena',
  };
  // Allow slight overlap — use month as primary indicator
  return rashiMap[month] || 'mesha';
}

function getTodaysPrediction(rashiId: string): string {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const predictions = DAILY_PREDICTIONS[rashiId] || DAILY_PREDICTIONS.mesha;
  return predictions[dayOfYear % predictions.length];
}

function getRashiIdFromName(name: string): string | null {
  const rashi = RASHIS.find(r => 
    r.name.toLowerCase().includes(name.toLowerCase()) || 
    r.english.toLowerCase() === name.toLowerCase() ||
    r.id === name.toLowerCase()
  );
  return rashi?.id || null;
}

interface MatchingResult {
  score: number;
  label: string;
  detail: string;
}

function calculateMatching(rashi1: string, rashi2: string): { total: number; details: MatchingResult[] } {
  const compat = COMPATIBILITY[rashi1] || [];
  const isCompatible = compat.includes(rashi2);
  
  const details: MatchingResult[] = [
    { score: isCompatible ? 85 : 45, label: 'Emotional Connection', detail: isCompatible ? 'Strong emotional understanding' : 'May need effort to understand each other' },
    { score: isCompatible ? 75 : 50, label: 'Communication', detail: isCompatible ? 'Natural flow of ideas' : 'Different communication styles' },
    { score: isCompatible ? 80 : 40, label: 'Life Goals', detail: isCompatible ? 'Aligned life visions' : 'Different priorities in life' },
    { score: isCompatible ? 70 : 55, label: 'Trust & Loyalty', detail: isCompatible ? 'Mutual trust comes naturally' : 'Trust needs to be built over time' },
    { score: isCompatible ? 78 : 48, label: 'Romantic Compatibility', detail: isCompatible ? 'Passionate and harmonious' : 'Requires understanding and compromise' },
  ];
  
  // Recalculate total from details
  const total = Math.round(details.reduce((sum, d) => sum + d.score, 0) / details.length);
  return { total, details };
}

export default function Rashifal() {
  const [activeTab, setActiveTab] = useState<'today' | 'find-rashi' | 'matching' | 'all'>('today');
  const [selectedRashi, setSelectedRashi] = useState('mesha');
  const [prediction, setPrediction] = useState('');
  
  // Find Rashi by BS date
  const [bsYear, setBsYear] = useState('');
  const [bsMonth, setBsMonth] = useState('');
  const [bsDay, setBsDay] = useState('');
  const [foundRashi, setFoundRashi] = useState<string | null>(null);
  const [findError, setFindError] = useState('');

  // Matching
  const [matchRashi1, setMatchRashi1] = useState('mesha');
  const [matchRashi2, setMatchRashi2] = useState('tula');
  const [matchResult, setMatchResult] = useState<{ total: number; details: MatchingResult[] } | null>(null);

  useEffect(() => {
    setPrediction(getTodaysPrediction(selectedRashi));
  }, [selectedRashi]);

  const handleFindRashi = () => {
    if (!bsYear || !bsMonth || !bsDay) {
      setFindError('Please enter your full BS date of birth');
      setFoundRashi(null);
      return;
    }
    const y = parseInt(bsYear);
    const m = parseInt(bsMonth);
    const d = parseInt(bsDay);
    if (y < 1978 || y > 2099 || m < 1 || m > 12 || d < 1 || d > 32) {
      setFindError('Please enter a valid BS date (Year: 1978–2099)');
      setFoundRashi(null);
      return;
    }
    setFindError('');
    const rashiId = getRashiFromBSMonth(m);
    setFoundRashi(rashiId);
  };

  const handleCalculateMatching = () => {
    setMatchResult(calculateMatching(matchRashi1, matchRashi2));
  };

  const selectedRashiData = RASHIS.find(r => r.id === selectedRashi)!;
  const selectedRashiDetails = RASHI_DETAILS[selectedRashi]!;

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Nepali Rashifal (राशिफल)
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Discover your Nepali zodiac sign (Rashi), daily horoscope, personality traits, and compatibility with other signs.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-2 overflow-x-auto">
        <button onClick={() => setActiveTab('today')} className={`py-2 px-5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'today' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
          <Star className="h-4 w-4 inline mr-1.5" /> Today's Rashifal
        </button>
        <button onClick={() => setActiveTab('find-rashi')} className={`py-2 px-5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'find-rashi' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
          <Search className="h-4 w-4 inline mr-1.5" /> Find Your Rashi
        </button>
        <button onClick={() => setActiveTab('matching')} className={`py-2 px-5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'matching' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
          <Heart className="h-4 w-4 inline mr-1.5" /> Rashi Matching
        </button>
        <button onClick={() => setActiveTab('all')} className={`py-2 px-5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'all' ? 'bg-blue-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
          <Moon className="h-4 w-4 inline mr-1.5" /> All Rashis
        </button>
      </div>

      {/* Tab: Today's Rashifal */}
      {activeTab === 'today' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Rashi Selector */}
          <div className="space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-sm">Your Rashi</h3>
            <div className="grid grid-cols-2 gap-2">
              {RASHIS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedRashi(r.id)}
                  className={`py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all ${
                    selectedRashi === r.id
                      ? 'bg-gradient-to-r from-red-600 to-blue-600 text-white border-transparent shadow-md'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <span className="text-base block">{r.symbol}</span>
                  <span className="text-[11px]">{r.name.split('(')[1]?.replace(')', '') || r.id}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Prediction */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white p-8 rounded-3xl shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{selectedRashiData.symbol}</div>
                  <h2 className="text-2xl font-black">{selectedRashiData.name}</h2>
                  <p className="text-sm opacity-80">{selectedRashiData.english} · {selectedRashiData.element}</p>
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-70">Today's Prediction</div>
                  <div className="text-sm font-bold">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
                </div>
              </div>
              <div className="border-t border-white/20 pt-4">
                <p className="text-lg font-medium leading-relaxed">{prediction}</p>
              </div>
            </div>

            {/* Personality */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="h-5 w-5 text-blue-500" /> Personality & Details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{selectedRashiDetails.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Lord</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedRashiDetails.lord}</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Gemstone</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedRashiDetails.gemstone}</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Lucky #</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedRashiDetails.luckyNumber}</div>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-900/30 rounded-xl">
                  <div className="text-[10px] font-bold text-gray-400 uppercase">Color</div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">{selectedRashiDetails.luckyColor}</div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Key Traits</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedRashiDetails.traits.map((trait) => (
                    <span key={trait} className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold">
                      {trait}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Find Your Rashi */}
      {activeTab === 'find-rashi' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" /> Enter Your BS Date of Birth
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Year (BS)</label>
                <input type="number" value={bsYear} onChange={e => setBsYear(e.target.value)} placeholder="e.g. 2055" className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Month (1-12)</label>
                <input type="number" value={bsMonth} onChange={e => setBsMonth(e.target.value)} placeholder="e.g. 4" min="1" max="12" className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Day (1-32)</label>
                <input type="number" value={bsDay} onChange={e => setBsDay(e.target.value)} placeholder="e.g. 15" min="1" max="32" className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <button onClick={handleFindRashi} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors text-sm">
              Find My Rashi
            </button>
            {findError && <p className="text-sm text-red-500">{findError}</p>}
            
            <div className="text-xs text-gray-400 dark:text-gray-500 space-y-1">
              <p><strong>BS Month Reference:</strong></p>
              <p>1=Baisakh, 2=Jestha, 3=Asar, 4=Shrawan, 5=Bhadra, 6=Ashwin</p>
              <p>7=Kartik, 8=Mangsir, 9=Poush, 10=Magh, 11=Falgun, 12=Chaitra</p>
            </div>
          </div>

          {foundRashi && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 text-white p-8 rounded-3xl shadow-xl text-center">
                <div className="text-5xl mb-3">{RASHIS.find(r => r.id === foundRashi)?.symbol}</div>
                <h2 className="text-3xl font-black">{RASHIS.find(r => r.id === foundRashi)?.name}</h2>
                <p className="text-lg opacity-90 mt-1">{RASHIS.find(r => r.id === foundRashi)?.english} · {RASHIS.find(r => r.id === foundRashi)?.element}</p>
                <p className="text-sm opacity-75 mt-2">{RASHIS.find(r => r.id === foundRashi)?.dateRange}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-3">
                <h3 className="font-bold text-gray-900 dark:text-white">Your Traits</h3>
                <div className="flex flex-wrap gap-1.5">
                  {RASHI_DETAILS[foundRashi]?.traits.map(t => (
                    <span key={t} className="px-2.5 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 rounded-lg text-xs font-semibold">{t}</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{RASHI_DETAILS[foundRashi]?.description}</p>
              </div>
              <button onClick={() => { setSelectedRashi(foundRashi); setActiveTab('today'); }} className="w-full py-3 bg-gradient-to-r from-red-600 to-blue-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity text-sm">
                See Today's Rashifal for {RASHIS.find(r => r.id === foundRashi)?.name.split('(')[0]}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab: Rashi Matching */}
      {activeTab === 'matching' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" /> Rashi Compatibility Check
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Person 1 Rashi</label>
                <select value={matchRashi1} onChange={e => setMatchRashi1(e.target.value)} className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {RASHIS.map(r => <option key={r.id} value={r.id}>{r.symbol} {r.name} ({r.english})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Person 2 Rashi</label>
                <select value={matchRashi2} onChange={e => setMatchRashi2(e.target.value)} className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {RASHIS.map(r => <option key={r.id} value={r.id}>{r.symbol} {r.name} ({r.english})</option>)}
                </select>
              </div>
              <button onClick={handleCalculateMatching} className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold hover:opacity-90 transition-opacity text-sm">
                Check Compatibility
              </button>
            </div>
          </div>

          {matchResult && (
            <div className="space-y-6">
              <div className={`p-8 rounded-3xl shadow-xl text-white text-center ${matchResult.total >= 70 ? 'bg-gradient-to-br from-green-500 to-emerald-600' : matchResult.total >= 50 ? 'bg-gradient-to-br from-amber-500 to-orange-600' : 'bg-gradient-to-br from-red-500 to-rose-600'}`}>
                <div className="text-5xl mb-3">{matchResult.total >= 70 ? '💖' : matchResult.total >= 50 ? '💛' : '💔'}</div>
                <div className="text-4xl font-black">{matchResult.total}%</div>
                <div className="text-lg font-bold mt-1">
                  {matchResult.total >= 80 ? 'Excellent Match! 🌟' : matchResult.total >= 60 ? 'Good Match! 👍' : matchResult.total >= 40 ? 'Average Match' : 'Challenging Match'}
                </div>
                <div className="text-sm opacity-80 mt-2">
                  {RASHIS.find(r => r.id === matchRashi1)?.symbol} {RASHIS.find(r => r.id === matchRashi1)?.name.split('(')[0]} 
                  &nbsp;&&nbsp; 
                  {RASHIS.find(r => r.id === matchRashi2)?.symbol} {RASHIS.find(r => r.id === matchRashi2)?.name.split('(')[0]}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white">Compatibility Breakdown</h3>
                {matchResult.details.map((d, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{d.label}</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{d.score}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        d.score >= 70 ? 'bg-green-500' : d.score >= 50 ? 'bg-amber-500' : 'bg-red-500'
                      }`} style={{ width: `${d.score}%` }} />
                    </div>
                    <p className="text-[11px] text-gray-400">{d.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: All Rashis */}
      {activeTab === 'all' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RASHIS.map((r) => {
            const details = RASHI_DETAILS[r.id];
            return (
              <div key={r.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
                <div className="text-3xl mb-2">{r.symbol}</div>
                <h3 className="font-extrabold text-gray-900 dark:text-white">{r.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.english} · {r.element}</p>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{r.dateRange}</p>
                <div className="mt-3 space-y-1.5">
                  <div className="flex justify-between text-[11px]"><span className="text-gray-400">Lord:</span><span className="font-semibold text-gray-700 dark:text-gray-300">{details.lord}</span></div>
                  <div className="flex justify-between text-[11px]"><span className="text-gray-400">Gemstone:</span><span className="font-semibold text-gray-700 dark:text-gray-300">{details.gemstone}</span></div>
                  <div className="flex justify-between text-[11px]"><span className="text-gray-400">Lucky #:</span><span className="font-semibold text-gray-700 dark:text-gray-300">{details.luckyNumber}</span></div>
                  <div className="flex justify-between text-[11px]"><span className="text-gray-400">Color:</span><span className="font-semibold text-gray-700 dark:text-gray-300">{details.luckyColor}</span></div>
                </div>
                <div className="flex flex-wrap gap-1 mt-3">
                  {details.traits.map(t => (
                    <span key={t} className="px-1.5 py-0.5 bg-gray-50 dark:bg-gray-900/30 text-gray-500 dark:text-gray-400 rounded text-[10px] font-medium">{t}</span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
