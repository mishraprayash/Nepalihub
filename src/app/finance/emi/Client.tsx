'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AdBanner from '@/components/AdBanner';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, SliderField, Segmented, ResultStat } from '@/components/ui/fields';

const fmt = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

export default function EMICalculator() {
  const [loanAmount, setLoanAmount] = useState<number>(3000000); // 30 Lakhs
  const [interestRate, setInterestRate] = useState<number>(12);
  const [loanTenure, setLoanTenure] = useState<number>(15);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');

  const principal = loanAmount;
  const monthlyRate = interestRate / 12 / 100;
  const numberOfMonths = tenureType === 'years' ? loanTenure * 12 : loanTenure;

  let emi = 0;
  if (monthlyRate > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) /
          (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
  } else {
    emi = principal / numberOfMonths;
  }

  const totalPayment = emi * numberOfMonths;
  const totalInterest = totalPayment - principal;

  const data = [
    { name: 'Principal', value: principal },
    { name: 'Interest', value: totalInterest }
  ];
  const COLORS = ['#b91c2e', '#a16207'];

  const amortizationSchedule = [];
  let remainingBalance = principal;
  for (let i = 1; i <= Math.min(numberOfMonths, 12); i++) {
    const interestPaid = remainingBalance * monthlyRate;
    const principalPaid = emi - interestPaid;
    remainingBalance = Math.max(0, remainingBalance - principalPaid);
    amortizationSchedule.push({
      month: i,
      emi: emi,
      principal: principalPaid,
      interest: interestPaid,
      balance: remainingBalance
    });
  }

  return (
    <ToolShell
      category="Finance"
      title="Loan EMI Calculator"
      badge="Banking"
      description="Monthly repayment, total interest and a full amortization schedule — tuned for home, auto and gold loans in Nepal."
      aside={
        <>
          <Panel>
            <ResultStat label="Monthly EMI" value={fmt(emi)} emphasis />
            <ResultStat label="Principal" value={fmt(principal)} />
            <ResultStat label="Total interest" value={fmt(totalInterest)} tone="negative" />
            <ResultStat label="Total payable" value={fmt(totalPayment)} />
          </Panel>

          <Panel title="Payment breakdown">
            <div className="w-full h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} cx="50%" cy="50%" innerRadius={38} outerRadius={55} paddingAngle={4} dataKey="value">
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => fmt(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-3 text-xs text-ink-soft">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[0] }} /> Principal
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[1] }} /> Interest
              </span>
            </div>
          </Panel>

          <AdBanner slot="0000000000" format="auto" />
        </>
      }
      below={
        <>
          {/* Amortization table */}
          <section className="bg-surface border border-line rounded-2xl p-5 sm:p-7 mb-6">
            <h2 className="font-display text-lg font-semibold text-ink mb-5">
              Amortization schedule · first 12 months
            </h2>
            <div className="overflow-x-auto -mx-2 px-2">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="text-xs uppercase tracking-wider text-ink-faint border-b border-line">
                    <th className="py-3 pr-4 font-semibold">Month</th>
                    <th className="py-3 pr-4 font-semibold">EMI</th>
                    <th className="py-3 pr-4 font-semibold">Principal</th>
                    <th className="py-3 pr-4 font-semibold">Interest</th>
                    <th className="py-3 font-semibold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60 text-ink-soft tabular-nums">
                  {amortizationSchedule.map((row) => (
                    <tr key={row.month} className="hover:bg-paper-deep/60 transition-colors">
                      <td className="py-2.5 pr-4 font-semibold text-ink">{row.month}</td>
                      <td className="py-2.5 pr-4 font-mono">{fmt(row.emi)}</td>
                      <td className="py-2.5 pr-4 font-mono text-pine">{fmt(row.principal)}</td>
                      <td className="py-2.5 pr-4 font-mono text-simrik">{fmt(row.interest)}</td>
                      <td className="py-2.5 font-mono font-semibold text-ink">{fmt(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Reference */}
          <section className="border-t border-line pt-8 pb-10 space-y-6 max-w-none">
            <h2 className="font-display text-xl font-semibold text-ink">Understanding loans in Nepal</h2>

            <div className="grid md:grid-cols-2 gap-x-10 gap-y-6 text-sm text-ink-soft leading-relaxed">
              <div>
                <h3 className="font-semibold text-ink mb-2">Typical rates (FY 2081/82)</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Home loan: 8.5–11% p.a.</li>
                  <li>Auto loan: 10–13% p.a.</li>
                  <li>Personal loan: 12–16% p.a.</li>
                  <li>Margin loan: 12–14% p.a.</li>
                  <li>Education loan: 9–12% p.a.</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">Borrower tips</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Compare at least 3 banks before choosing</li>
                  <li>Processing fees: typically 0.5–1% of the loan</li>
                  <li>Floating rates can rise 1–2% — plan a buffer</li>
                  <li>Prepayment penalties vary (usually 1–2%)</li>
                  <li>Check NRB base rate + spread when comparing</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">The formula</h3>
                <p className="font-mono text-xs bg-paper-deep px-3 py-2 rounded-lg inline-block">
                  EMI = P·r·(1+r)<sup>n</sup> / ((1+r)<sup>n</sup> − 1)
                </p>
                <p className="text-xs mt-2 text-ink-faint">
                  P = principal · r = monthly rate (annual ÷ 12) · n = tenure in months
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-ink mb-2">Key terms</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong className="text-ink">NRB base rate</strong> — set by Nepal Rastra Bank (~7%)</li>
                  <li><strong className="text-ink">Spread</strong> — bank margin over base (max 5%)</li>
                  <li><strong className="text-ink">LTV</strong> — max 60% home, 70% vehicle loans</li>
                </ul>
              </div>
            </div>

            <p className="text-xs text-ink-faint pt-2 border-t border-line">
              Source: Nepal Rastra Bank (nrb.org.np) and published bank rates.
            </p>
          </section>
        </>
      }
    >
      {/* Inputs */}
      <Panel title="Loan details">
        <div className="space-y-7">
          <SliderField
            label="Loan amount"
            value={loanAmount}
            onChange={setLoanAmount}
            min={100000}
            max={50000000}
            step={50000}
            format={fmt}
          />

          <SliderField
            label="Interest rate (% p.a.)"
            value={interestRate}
            onChange={setInterestRate}
            min={1}
            max={25}
            step={0.1}
            format={(v) => `${v}%`}
          />

          <div className="space-y-2.5">
            <span className="text-[13px] font-medium text-ink-soft">Loan tenure</span>
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="number"
                value={loanTenure || ''}
                onChange={(e) => setLoanTenure(Number(e.target.value))}
                className="w-24 py-2 px-3.5 text-sm font-semibold bg-surface-raised border border-line rounded-xl text-ink focus-visible:outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 transition-all"
              />
              <Segmented
                options={[
                  { value: 'years', label: 'Years' },
                  { value: 'months', label: 'Months' },
                ]}
                value={tenureType}
                onChange={setTenureType}
              />
            </div>
          </div>
        </div>
      </Panel>
    </ToolShell>
  );
}
