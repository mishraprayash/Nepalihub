'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, Field, SliderField, ResultStat } from '@/components/ui/fields';

interface Contribution {
  label: string;
  rate: number;
  by: 'employee' | 'employer';
}

const CONTRIBUTION_TYPES: Contribution[] = [
  { label: 'Old Age Protection (Pension/PF/Gratuity)', rate: 17.33, by: 'employer' },
  { label: 'Medical & Maternity Protection',           rate: 1.00,  by: 'employer' },
  { label: 'Accident & Disability Protection',         rate: 1.40,  by: 'employer' },
  { label: 'Dependent Family Protection',              rate: 0.27,  by: 'employer' },
];

export default function SSFClient() {
  const [basicSalary, setBasicSalary] = useState('50000');
  const [showDetails, setShowDetails] = useState(false);
  const [years, setYears] = useState(15);

  const salary = parseFloat(basicSalary) || 0;
  const employeeRate = 11;
  const employerRate = Math.round(CONTRIBUTION_TYPES.reduce((s, c) => s + c.rate, 0) * 100) / 100;

  const employeeMonth = salary * employeeRate / 100;
  const employerMonth = salary * employerRate / 100;
  const totalMonth = employeeMonth + employerMonth;
  const totalYear = totalMonth * 12;
  const totalProjected = totalYear * years;

  const format = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

  return (
    <ToolShell
      category="Finance"
      title="SSF Contribution Calculator"
      badge="Social Security"
      description="See exactly what you and your employer contribute to the Nepal Social Security Fund each month — and what it adds up to over a career."
      aside={
        <Panel>
          <ResultStat label={`Total monthly (${employeeRate + employerRate}%)`} value={format(totalMonth)} emphasis />
          <ResultStat label="Your share (11%)" value={format(employeeMonth)} />
          <ResultStat label="Employer share" value={format(employerMonth)} />
          <ResultStat label={`Annual contribution`} value={format(totalYear)} />
          <ResultStat label={`Projected over ${years} years`} value={format(totalProjected)} tone="positive" />
        </Panel>
      }
    >
      <Panel title="Your salary">
        <div className="space-y-7">
          <Field
            label="Basic monthly salary"
            prefix="Rs."
            type="number"
            value={basicSalary}
            onChange={setBasicSalary}
            placeholder="50000"
          />

          <SliderField
            label="Contribution period"
            value={years}
            onChange={setYears}
            min={1}
            max={35}
            step={1}
            format={(v) => `${v} yrs`}
          />
        </div>
      </Panel>

      {/* Employer breakdown */}
      <section className="bg-surface border border-line rounded-2xl overflow-hidden">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-paper-deep/50 transition-colors"
        >
          <span className="text-sm font-semibold text-ink">Employer contribution breakdown</span>
          {showDetails
            ? <ChevronUp className="h-4 w-4 text-ink-faint" />
            : <ChevronDown className="h-4 w-4 text-ink-faint" />}
        </button>
        {showDetails && (
          <div className="px-6 pb-5 space-y-2 border-t border-line pt-4">
            {CONTRIBUTION_TYPES.map(c => {
              const amt = salary * c.rate / 100;
              return (
                <div key={c.label} className="flex items-center justify-between py-2 border-b border-line/60 last:border-0">
                  <span className="text-[13px] text-ink-soft pr-3">{c.label}</span>
                  <span className="text-sm font-semibold text-ink whitespace-nowrap tabular-nums">
                    {format(amt)} <span className="text-xs font-normal text-ink-faint">({c.rate}%)</span>
                  </span>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-3 border-t border-line-strong mt-1">
              <span className="text-[13px] font-semibold text-ink">Total employer ({employerRate}%)</span>
              <span className="text-sm font-bold text-simrik tabular-nums">{format(employerMonth)}</span>
            </div>
          </div>
        )}
      </section>

      {/* Benefits + about */}
      <section className="border-t border-line pt-8 pb-10 space-y-5">
        <h2 className="font-display text-xl font-semibold text-ink">What SSF covers</h2>
        <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-ink-soft list-disc pl-5 leading-relaxed">
          <li>Medical insurance — up to Rs 100,000/year OPD + Rs 500,000 inpatient</li>
          <li>Accident insurance — up to Rs 700,000 coverage</li>
          <li>Maternity benefit — paid leave + medical coverage</li>
          <li>Old age pension — from age 65 or after 15+ years contributing</li>
          <li>Dependent family — coverage for spouse, children, parents</li>
          <li>Funeral grant — lump sum to next of kin</li>
        </ul>
        <p className="text-xs text-ink-faint leading-relaxed max-w-xl">
          Employers with 10+ staff must register. Partial withdrawal is possible after 5+ years; full pension at 65.
          Based on the SSF Act 2074 and amendments — actual benefits depend on SSF guidelines and fund availability.
          Source: ssf.gov.np, rates verified FY 2081/82.
        </p>
      </section>
    </ToolShell>
  );
}
