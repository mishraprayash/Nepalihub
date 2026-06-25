'use client';

import { useState } from 'react';
import { Calendar, Clock, Gift, Calculator, HelpCircle } from 'lucide-react';

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState<string>('2000-01-01');
  const [targetDate, setTargetDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const calculateAgeDetails = () => {
    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (isNaN(birth.getTime()) || isNaN(target.getTime())) {
      return null;
    }

    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    if (days < 0) {
      // Borrow days from previous month
      const prevMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }

    if (months < 0) {
      months += 12;
      years--;
    }

    const diffTime = Math.abs(target.getTime() - birth.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const totalWeeks = Math.floor(totalDays / 7);
    const remainingDays = totalDays % 7;

    // Day of birth
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfBirth = weekdays[birth.getDay()];

    // Next birthday calculation
    const nextBDay = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBDay < target) {
      nextBDay.setFullYear(nextBDay.getFullYear() + 1);
    }
    const daysUntilNextBDay = Math.ceil((nextBDay.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return {
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      remainingDays,
      dayOfBirth,
      daysUntilNextBDay
    };
  };

  const age = calculateAgeDetails();

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Age & Date Difference Calculator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Calculate your exact age in years, months, and days, find the weekday you were born, and see the countdown to your next birthday.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <Calendar className="h-5 w-5 text-blue-500" />
            Select Dates
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Date of Birth</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Age at the Date of</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full py-2 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {age ? (
            <>
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 rounded-2xl shadow-xl space-y-6">
                <h2 className="text-xl font-bold border-b border-white/20 pb-4">Calculated Age</h2>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xl font-black block">{age.years}</span>
                    <span className="text-xs uppercase tracking-wider opacity-85">Years</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xl font-black block">{age.months}</span>
                    <span className="text-xs uppercase tracking-wider opacity-85">Months</span>
                  </div>
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xl font-black block">{age.days}</span>
                    <span className="text-xs uppercase tracking-wider opacity-85">Days</span>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Gift className="h-5 w-5 text-pink-500" /> Birthday Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Born on:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{age.dayOfBirth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Next birthday in:</span>
                    <span className="font-semibold text-pink-600 dark:text-pink-400">{age.daysUntilNextBDay} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Total days lived:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">{age.totalDays.toLocaleString()} Days</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm text-center py-12 text-gray-500">
              Please enter valid dates to calculate age.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
