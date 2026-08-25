'use client';

import { useState } from 'react';
import AdBanner from '@/components/AdBanner';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, Field, Segmented, ResultStat } from '@/components/ui/fields';

const fmt = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;

export default function IncomeTaxClient() {
  const [status, setStatus] = useState<'single' | 'married'>('single');
  const [assessmentYear, setAssessmentYear] = useState('2083/84');
  const [infoYear, setInfoYear] = useState<'2083/84' | '2080/81'>('2083/84');
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [monthlySalary, setMonthlySalary] = useState<number>(80000);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [bonus, setBonus] = useState<number>(0);

  const [ssfContribution, setSsfContribution] = useState<number>(0);
  const [ssfPeriod, setSsfPeriod] = useState<'monthly' | 'annual'>('annual');
  const [pfContribution, setPfContribution] = useState<number>(0);
  const [pfPeriod, setPfPeriod] = useState<'monthly' | 'annual'>('annual');
  const [citContribution, setCitContribution] = useState<number>(0);
  const [citPeriod, setCitPeriod] = useState<'monthly' | 'annual'>('annual');
  const [lifeInsurance, setLifeInsurance] = useState<number>(0);
  const [healthInsurance, setHealthInsurance] = useState<number>(0);

  const annualSalary = monthlySalary * 12;
  const grossAnnualIncome = annualSalary + otherIncome + bonus;

  const annualSsf = ssfPeriod === 'monthly' ? ssfContribution * 12 : ssfContribution;
  const annualPf = pfPeriod === 'monthly' ? pfContribution * 12 : pfContribution;
  const annualCit = citPeriod === 'monthly' ? citContribution * 12 : citContribution;

  const maxRetirementDeduction = annualSsf > 0 ? (assessmentYear === '2083/84' ? 600000 : 500000) : 300000;

  const actualRetirementContribution = annualSsf + annualPf + annualCit;
  const retirementDeduction = Math.min(
    actualRetirementContribution,
    maxRetirementDeduction,
    grossAnnualIncome / 3
  );

  const lifeInsuranceDeduction = Math.min(lifeInsurance, 40000);
  const healthInsuranceDeduction = Math.min(healthInsurance, 20000);

  const totalDeductions = retirementDeduction + lifeInsuranceDeduction + healthInsuranceDeduction;
  const taxableIncome = Math.max(0, grossAnnualIncome - totalDeductions);

  const slabs = status === 'single'
    ? (assessmentYear === '2083/84'
        ? [
            { limit: 1000000, rate: 0.01, label: 'First Rs. 10,00,000' },
            { limit: 500000, rate: 0.10, label: 'Next Rs. 5,00,000' },
            { limit: 1000000, rate: 0.20, label: 'Next Rs. 10,00,000' },
            { limit: 1500000, rate: 0.27, label: 'Next Rs. 15,00,000' },
            { limit: Infinity, rate: 0.29, label: 'Above Rs. 40,00,000' }
          ]
        : [
            { limit: 500000, rate: 0.01, label: 'First Rs. 5,00,000' },
            { limit: 200000, rate: 0.10, label: 'Next Rs. 2,00,000' },
            { limit: 300000, rate: 0.20, label: 'Next Rs. 3,00,000' },
            { limit: 1000000, rate: 0.30, label: 'Next Rs. 10,00,000' },
            { limit: 3000000, rate: 0.36, label: 'Next Rs. 30,00,000' },
            { limit: Infinity, rate: 0.39, label: 'Above Rs. 50,00,000' }
          ]
      )
    : (assessmentYear === '2083/84'
        ? [
            { limit: 1000000, rate: 0.01, label: 'First Rs. 10,00,000' },
            { limit: 500000, rate: 0.10, label: 'Next Rs. 5,00,000' },
            { limit: 1000000, rate: 0.20, label: 'Next Rs. 10,00,000' },
            { limit: 1500000, rate: 0.27, label: 'Next Rs. 15,00,000' },
            { limit: Infinity, rate: 0.29, label: 'Above Rs. 40,00,000' }
          ]
        : [
            { limit: 600000, rate: 0.01, label: 'First Rs. 6,00,000' },
            { limit: 200000, rate: 0.10, label: 'Next Rs. 2,00,000' },
            { limit: 300000, rate: 0.20, label: 'Next Rs. 3,00,000' },
            { limit: 900000, rate: 0.30, label: 'Next Rs. 9,00,000' },
            { limit: 3000000, rate: 0.36, label: 'Next Rs. 30,00,000' },
            { limit: Infinity, rate: 0.39, label: 'Above Rs. 50,00,000' }
          ]
      );

  let remainingIncome = taxableIncome;
  let totalTax = 0;
  const slabCalculations: { slab: string; rate: number; taxableAmount: number; taxAmount: number; reached: boolean }[] = [];

  for (let i = 0; i < slabs.length; i++) {
    const slab = slabs[i];
    let rate = slab.rate;
    if (i === 0 && annualSsf > 0) rate = 0;

    if (remainingIncome <= 0) {
      slabCalculations.push({ slab: slab.label, rate: Math.round(rate * 100), taxableAmount: 0, taxAmount: 0, reached: false });
      continue;
    }

    const taxableInSlab = slab.limit === Infinity ? remainingIncome : Math.min(remainingIncome, slab.limit);
    const taxInSlab = taxableInSlab * rate;
    totalTax += taxInSlab;
    remainingIncome -= taxableInSlab;

    slabCalculations.push({
      slab: slab.label,
      rate: Math.round(rate * 100),
      taxableAmount: taxableInSlab,
      taxAmount: taxInSlab,
      reached: true,
    });
  }

  const netTakeHomeMonthly = monthlySalary - (actualRetirementContribution / 12) - (totalTax / 12);

  return (
    <ToolShell
      category="Finance"
      title="Nepal Income Tax Calculator"
      badge="FY 2083/84"
      description="Monthly and annual income tax under current IRD rules — SSF, PF and CIT deductions handled correctly, including the unified slab change."
      aside={
        <>
          <Panel>
            <ResultStat label="Net take-home pay" value={`${fmt(netTakeHomeMonthly)}/mo`} emphasis tone="positive" />
            <ResultStat label="Annual income tax" value={fmt(totalTax)} tone="negative" />
            <ResultStat label="Monthly tax deduction" value={fmt(totalTax / 12)} />
            <ResultStat label="Gross annual income" value={fmt(grossAnnualIncome)} />
            <ResultStat label="Total deductions" value={fmt(totalDeductions)} />
            <ResultStat label="Taxable income" value={fmt(taxableIncome)} />
          </Panel>

          <Panel title="Slab breakdown">
            <div className="space-y-1">
              {slabCalculations.map((calc, i) => (
                <div
                  key={i}
                  className={`flex items-center justify-between gap-3 py-2 border-b border-line/60 last:border-0 ${
                    calc.reached ? '' : 'opacity-40'
                  }`}
                >
                  <span className="text-xs text-ink-soft">{calc.slab}</span>
                  <span className="text-right shrink-0">
                    <span className="inline-block min-w-9 text-[11px] font-bold text-simrik mr-2">{calc.rate}%</span>
                    <span className={`text-xs font-semibold tabular-nums ${calc.reached ? 'text-ink' : 'text-ink-faint'}`}>
                      {calc.reached && calc.taxAmount > 0 ? fmt(calc.taxAmount) : '—'}
                    </span>
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-line-strong">
                <span className="text-[13px] font-semibold text-ink">Effective rate</span>
                <span className="text-sm font-bold text-simrik tabular-nums">
                  {taxableIncome > 0 ? ((totalTax / taxableIncome) * 100).toFixed(2) : '0.00'}%
                </span>
              </div>
            </div>
          </Panel>

          <AdBanner slot="0000000000" format="auto" />
        </>
      }
    >
      <Panel title="Income">
        <div className="space-y-5">
          <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink-soft">Filing status</span>
              <div>
                <Segmented
                  options={
                    assessmentYear === '2083/84'
                      ? [{ value: 'single', label: 'Unified slabs' }]
                      : [
                          { value: 'single', label: 'Single' },
                          { value: 'married', label: 'Married' },
                        ]
                  }
                  value={status}
                  onChange={setStatus}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink-soft">Assessment year</span>
              <div>
                <Segmented
                  options={[
                    { value: '2083/84', label: '2083/84 · current' },
                    { value: '2080/81', label: '2080/81 & older' },
                  ]}
                  value={assessmentYear}
                  onChange={setAssessmentYear}
                />
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Monthly gross salary" prefix="Rs." type="number" value={monthlySalary} onChange={(v) => setMonthlySalary(Number(v))} />
            <Field label="Monthly basic salary" hint="base for 31% SSF" prefix="Rs." type="number" value={basicSalary} onChange={(v) => setBasicSalary(Number(v))} />
            <Field label="Other income (annual)" prefix="Rs." type="number" value={otherIncome} onChange={(v) => setOtherIncome(Number(v))} />
            <Field label="Bonus (annual)" prefix="Rs." type="number" value={bonus} onChange={(v) => setBonus(Number(v))} />
          </div>
        </div>
      </Panel>

      <Panel title="Deductions">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-medium text-ink-soft">SSF contribution</span>
                <button
                  type="button"
                  onClick={() => { setSsfContribution(Math.round(basicSalary * 0.31)); setSsfPeriod('monthly'); }}
                  className="text-[11px] font-bold text-simrik bg-simrik/10 px-2 py-0.5 rounded-md hover:bg-simrik/15 transition-colors"
                >
                  Use 31% of basic
                </button>
              </div>
              <Field
                label=""
                hint="makes first slab 0%"
                prefix="Rs."
                type="number"
                value={ssfContribution}
                onChange={(v) => setSsfContribution(Number(v))}
              />
              <div><Segmented options={[{ value: 'annual', label: '/yr' }, { value: 'monthly', label: '/mo' }]} value={ssfPeriod} onChange={setSsfPeriod} /></div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink-soft">CIT contribution</span>
              <Field label="" hint="Citizen Investment Trust" prefix="Rs." type="number" value={citContribution} onChange={(v) => setCitContribution(Number(v))} />
              <div><Segmented options={[{ value: 'annual', label: '/yr' }, { value: 'monthly', label: '/mo' }]} value={citPeriod} onChange={setCitPeriod} /></div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink-soft">Provident Fund (EPF)</span>
              <Field label="" hint="employees' share" prefix="Rs." type="number" value={pfContribution} onChange={(v) => setPfContribution(Number(v))} />
              <div><Segmented options={[{ value: 'annual', label: '/yr' }, { value: 'monthly', label: '/mo' }]} value={pfPeriod} onChange={setPfPeriod} /></div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink-soft">Life insurance premium</span>
              <Field label="" hint="max Rs. 40,000/yr" prefix="Rs." type="number" value={lifeInsurance} onChange={(v) => setLifeInsurance(Number(v))} />
            </div>

            <div className="space-y-1.5">
              <span className="text-[13px] font-medium text-ink-soft">Health insurance premium</span>
              <Field label="" hint="max Rs. 20,000/yr" prefix="Rs." type="number" value={healthInsurance} onChange={(v) => setHealthInsurance(Number(v))} />
            </div>
          </div>

          <p className="text-xs text-ink-faint leading-relaxed border-t border-line pt-4">
            Combined retirement deductions (SSF + PF + CIT) are capped at the lowest of: your actual contribution,
            one-third of gross income, or the statutory limit — Rs. 6,00,000 for SSF contributors this year.
          </p>
        </div>
      </Panel>

      {/* Reference */}
      <section className="border-t border-line pt-8 pb-10 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-ink">Tax slab reference</h2>
          <Segmented
            options={[
              { value: '2083/84', label: 'FY 2083/84' },
              { value: '2080/81', label: 'FY 2080/81+' },
            ]}
            value={infoYear}
            onChange={setInfoYear}
          />
        </div>

        <div className="overflow-x-auto -mx-2 px-2">
          <table className="min-w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-ink-faint border-b border-line">
                <th className="py-3 pr-4 font-semibold">Single</th>
                <th className="py-3 pr-4 font-semibold">Married</th>
                <th className="py-3 font-semibold text-right">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 text-ink-soft">
              {(infoYear === '2083/84'
                ? [
                    ['Up to Rs. 10,00,000', 'Up to Rs. 10,00,000 (unified)', '1% · 0% with SSF'],
                    ['Rs. 10,00,001 – 15,00,000', 'Same as single', '10%'],
                    ['Rs. 15,00,001 – 25,00,000', 'Same as single', '20%'],
                    ['Rs. 25,00,001 – 40,00,000', 'Same as single', '27%'],
                    ['Above Rs. 40,00,000', 'Same as single', '29%'],
                  ]
                : [
                    ['Up to Rs. 5,00,000', 'Up to Rs. 6,00,000', '1% · 0% with SSF'],
                    ['Rs. 5,00,001 – 7,00,000', 'Rs. 6,00,001 – 8,00,000', '10%'],
                    ['Rs. 7,00,001 – 10,00,000', 'Rs. 8,00,001 – 11,00,000', '20%'],
                    ['Rs. 10,00,001 – 20,00,000', 'Rs. 11,00,001 – 20,00,000', '30%'],
                    ['Rs. 20,00,001 – 50,00,000', 'Rs. 20,00,001 – 50,00,000', '36%'],
                    ['Above Rs. 50,00,000', 'Above Rs. 50,00,000', '39%'],
                  ]
              ).map(([single, married, rate]) => (
                <tr key={single} className="hover:bg-paper-deep/60 transition-colors">
                  <td className="py-2.5 pr-4">{single}</td>
                  <td className="py-2.5 pr-4">{married}</td>
                  <td className="py-2.5 font-semibold text-ink text-right">{rate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-xs text-ink-faint leading-relaxed max-w-xl">
          Nepal uses progressive taxation under the Income Tax Act. SSF enrollment waives the 1% Social Security Tax
          on the first slab and raises the combined deduction ceiling. Life insurance (up to Rs. 40,000) and health
          insurance (up to Rs. 20,000) premiums are separately deductible. Source: Inland Revenue Department (ird.gov.np).
        </p>
      </section>
    </ToolShell>
  );
}
