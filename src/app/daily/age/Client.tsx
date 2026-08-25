'use client';

import { useState } from 'react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, Field, ResultStat } from '@/components/ui/fields';

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

    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfBirth = weekdays[birth.getDay()];

    const nextBDay = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBDay < target) {
      nextBDay.setFullYear(nextBDay.getFullYear() + 1);
    }
    const daysUntilNextBDay = Math.ceil((nextBDay.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalWeeks, remainingDays, dayOfBirth, daysUntilNextBDay };
  };

  const age = calculateAgeDetails();

  return (
    <ToolShell
      category="Daily Life"
      title="Age & Date Difference"
      badge="Everyday"
      description="Exact age in years, months and days — plus the weekday you were born and a countdown to the next birthday."
      aside={
        age ? (
          <>
            <Panel>
              <div className="flex items-baseline justify-between mb-4 pb-4 border-b border-line">
                {[
                  [age.years, 'years'],
                  [age.months, 'months'],
                  [age.days, 'days'],
                ].map(([v, l]) => (
                  <div key={l as string}>
                    <p className="font-display text-3xl font-semibold text-ink tabular-nums leading-none">{v}</p>
                    <p className="text-xs text-ink-faint mt-1">{l}</p>
                  </div>
                ))}
              </div>
              <ResultStat label="Born on a" value={age.dayOfBirth} />
              <ResultStat label="Next birthday in" value={`${age.daysUntilNextBDay} days`} tone="positive" />
              <ResultStat label="Total days lived" value={age.totalDays.toLocaleString()} />
              <ResultStat label="Weeks lived" value={`${age.totalWeeks.toLocaleString()}w ${age.remainingDays}d`} />
            </Panel>

            <Panel title="Did you know">
              <p className="text-[13px] leading-relaxed text-ink-soft">
                You&apos;ve been alive for roughly{' '}
                <strong className="text-simrik">{Math.round(age.totalDays * 8 / 60).toLocaleString()} hours of sleep</strong>{' '}
                and about <strong className="text-simrik">{(age.totalDays / 365.25).toFixed(1)} orbits</strong> of the sun.
              </p>
            </Panel>
          </>
        ) : (
          <Panel>
            <p className="text-sm text-ink-faint text-center py-10">Enter valid dates to see your age.</p>
          </Panel>
        )
      }
    >
      <Panel title="Pick two dates">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            label="Date of birth"
            type="date"
            value={birthDate}
            onChange={setBirthDate}
          />
          <Field
            label="Age at the date of"
            type="date"
            value={targetDate}
            onChange={setTargetDate}
          />
        </div>
      </Panel>
    </ToolShell>
  );
}
