'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, SliderField, ResultStat } from '@/components/ui/fields';

const fmt = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(5000);
  const [expectedReturn, setExpectedReturn] = useState<number>(15);
  const [tenureYears, setTenureYears] = useState<number>(10);

  const P = monthlyInvestment;
  const i = expectedReturn / 12 / 100;
  const n = tenureYears * 12;

  let totalWealth = 0;
  if (i > 0) {
    totalWealth = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  } else {
    totalWealth = P * n;
  }

  const totalInvested = P * n;
  const totalReturns = totalWealth - totalInvested;

  const chartData = [];
  for (let yr = 1; yr <= tenureYears; yr++) {
    const months = yr * 12;
    const accumInvested = P * months;
    const accumWealth = i > 0
      ? P * ((Math.pow(1 + i, months) - 1) / i) * (1 + i)
      : accumInvested;
    chartData.push({
      year: `Yr ${yr}`,
      Invested: Math.round(accumInvested),
      Wealth: Math.round(accumWealth)
    });
  }

  return (
    <ToolShell
      category="Finance"
      title="SIP Calculator"
      badge="Investing"
      description="Estimate maturity wealth on a monthly SIP in Nepalese mutual funds — NIBL, Siddhartha, Nabil, NICA and more."
      aside={
        <>
          <Panel>
            <ResultStat label="Projected wealth" value={fmt(totalWealth)} emphasis tone="positive" />
            <ResultStat label="You invest" value={fmt(totalInvested)} />
            <ResultStat label="Estimated returns" value={fmt(totalReturns)} />
          </Panel>

          <Panel title="Growth over time">
            <div className="w-full h-[150px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#b91c2e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#b91c2e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--line)" />
                  <XAxis dataKey="year" fontSize={10} axisLine={false} tickLine={false} tick={{ fill: 'var(--ink-faint)' }} />
                  <YAxis fontSize={9} width={40} axisLine={false} tickLine={false} tickFormatter={(val) => `${val / 100000}L`} tick={{ fill: 'var(--ink-faint)' }} />
                  <Tooltip formatter={(value) => fmt(Number(value))} />
                  <Area type="monotone" dataKey="Wealth" stroke="#b91c2e" strokeWidth={2} fillOpacity={1} fill="url(#colorWealth)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </>
      }
    >
      <Panel title="Monthly plan">
        <div className="space-y-7">
          <SliderField
            label="Monthly contribution"
            value={monthlyInvestment}
            onChange={setMonthlyInvestment}
            min={500}
            max={100000}
            step={500}
            format={fmt}
          />
          <SliderField
            label="Expected annual return"
            value={expectedReturn}
            onChange={setExpectedReturn}
            min={5}
            max={25}
            step={0.5}
            format={(v) => `${v}%`}
          />
          <SliderField
            label="Time period"
            value={tenureYears}
            onChange={setTenureYears}
            min={1}
            max={40}
            step={1}
            format={(v) => `${v} yrs`}
          />
        </div>
      </Panel>

      <p className="text-xs text-ink-faint leading-relaxed px-1">
        Returns are compounded monthly and assume a steady rate — actual mutual fund NAVs fluctuate.
        Past performance never guarantees future results.
      </p>
    </ToolShell>
  );
}
