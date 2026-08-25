'use client';

import { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, Field, Segmented, ResultStat } from '@/components/ui/fields';

function calculateBrokerage(amount: number): number {
  if (amount <= 50000) return amount * 0.0040;
  if (amount <= 500000) return amount * 0.0037;
  if (amount <= 2000000) return amount * 0.0034;
  if (amount <= 10000000) return amount * 0.0030;
  return amount * 0.0027;
}

export default function StockProfitCalculator() {
  const [buyPrice, setBuyPrice] = useState<number>(500);
  const [sellPrice, setSellPrice] = useState<number>(600);
  const [quantity, setQuantity] = useState<number>(100);
  const [holdingPeriod, setHoldingPeriod] = useState<'short' | 'long'>('short');
  const [investorType, setInvestorType] = useState<'individual' | 'institution'>('individual');

  const totalInvestment = buyPrice * quantity;
  const totalSaleValue = sellPrice * quantity;

  const buyBrokerage = calculateBrokerage(totalInvestment);
  const sellBrokerage = calculateBrokerage(totalSaleValue);
  const totalBrokerage = buyBrokerage + sellBrokerage;

  const seboFee = (totalInvestment + totalSaleValue) * 0.00015;
  const dpFee = 25 * 2;

  let cgtRate = 0;
  if (investorType === 'individual') {
    cgtRate = holdingPeriod === 'short' ? 0.05 : 0.075;
  } else {
    cgtRate = 0.10;
  }
  const grossProfit = totalSaleValue - totalInvestment;
  const netProfitBeforeTax = grossProfit - totalBrokerage - seboFee - dpFee;
  const capitalGainsTax = netProfitBeforeTax > 0 ? netProfitBeforeTax * cgtRate : 0;
  const netProfit = netProfitBeforeTax - capitalGainsTax;

  const breakEvenPrice = totalInvestment / quantity +
    (buyBrokerage + calculateBrokerage(totalInvestment) / 2) / quantity +
    (seboFee / 2 + dpFee / 2) / quantity;

  const profitPercent = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;
  const isProfit = netProfit >= 0;

  const formatRs = (n: number) =>
    `Rs. ${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <ToolShell
      category="Finance"
      title="NEPSE Stock P&L Calculator"
      badge="Stock market"
      description="Exact profit or loss per trade — brokerage slabs, SEBO fee, DP charges and capital gains tax included."
      aside={
        <>
          <Panel>
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-medium text-ink-faint">Net {isProfit ? 'profit' : 'loss'}</p>
              {isProfit
                ? <TrendingUp className="h-4 w-4 text-pine" />
                : <TrendingDown className="h-4 w-4 text-simrik" />}
            </div>
            <ResultStat
              label={`${isProfit ? '+' : '−'}${Math.abs(profitPercent).toFixed(2)}% on investment`}
              value={formatRs(Math.abs(netProfit))}
              emphasis
              tone={isProfit ? 'positive' : 'negative'}
            />
            <ResultStat label="Total investment" value={formatRs(totalInvestment)} />
            <ResultStat label="Total sale value" value={formatRs(totalSaleValue)} />
            <ResultStat label="Break-even price / share" value={formatRs(breakEvenPrice)} />
          </Panel>

          <Panel title="Cost breakdown">
            <ResultStat label="Gross profit" value={formatRs(grossProfit)} tone={grossProfit >= 0 ? 'positive' : 'negative'} />
            <ResultStat label="Brokerage — buy" value={formatRs(buyBrokerage)} />
            <ResultStat label="Brokerage — sell" value={formatRs(sellBrokerage)} />
            <ResultStat label="SEBO fee (0.015%)" value={formatRs(seboFee)} />
            <ResultStat label="DP / transfer fee" value={formatRs(dpFee)} />
            <ResultStat label={`Capital gains tax (${(cgtRate * 100).toFixed(1)}%)`} value={formatRs(capitalGainsTax)} tone="negative" />
            <ResultStat label="Total fees & tax" value={formatRs(totalBrokerage + seboFee + dpFee + capitalGainsTax)} />
          </Panel>
        </>
      }
    >
      <Panel title="Your trade">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Buy price / share" prefix="Rs." value={buyPrice} onChange={(v) => setBuyPrice(Number(v) || 0)} min={0} step={0.1} />
          <Field label="Sell price / share" prefix="Rs." value={sellPrice} onChange={(v) => setSellPrice(Number(v) || 0)} min={0} step={0.1} />
          <Field label="Quantity" suffix="shares" value={quantity} onChange={(v) => setQuantity(Number(v) || 0)} min={1} />

          <div className="space-y-1.5">
            <span className="text-[13px] font-medium text-ink-soft">Holding period</span>
            <div>
              <Segmented
                options={[
                  { value: 'short', label: '< 1 yr · 5%' },
                  { value: 'long', label: '> 1 yr · 7.5%' },
                ]}
                value={holdingPeriod}
                onChange={setHoldingPeriod}
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <span className="text-[13px] font-medium text-ink-soft">Investor type</span>
            <div>
              <Segmented
                options={[
                  { value: 'individual', label: 'Individual' },
                  { value: 'institution', label: 'Institution · 10%' },
                ]}
                value={investorType}
                onChange={setInvestorType}
              />
            </div>
          </div>
        </div>
      </Panel>

      {/* Reference */}
      <section className="border-t border-line pt-8 pb-10 space-y-5">
        <h2 className="font-display text-xl font-semibold text-ink">NEPSE trading costs</h2>
        <div className="grid md:grid-cols-3 gap-x-10 gap-y-6 text-sm leading-relaxed">
          <div>
            <h3 className="font-semibold text-ink mb-2">Brokerage slabs</h3>
            <ul className="space-y-1 text-[13px] text-ink-soft tabular-nums">
              <li>First Rs. 50,000 — 0.40%</li>
              <li>50,001 – 5,00,000 — 0.37%</li>
              <li>5,00,001 – 20,00,000 — 0.34%</li>
              <li>20,00,001 – 1,00,00,000 — 0.30%</li>
              <li>Above Rs. 1,00,00,000 — 0.27%</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-ink mb-2">Other charges</h3>
            <ul className="space-y-1 text-[13px] text-ink-soft">
              <li>SEBO fee — 0.015%, both sides</li>
              <li>DP / transfer — Rs. 25 per transaction</li>
              <li>CDS &amp; clearing — included in brokerage</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-ink mb-2">Capital gains tax</h3>
            <ul className="space-y-1 text-[13px] text-ink-soft">
              <li>Individual, &lt; 1 year — 5%</li>
              <li>Individual, &gt; 1 year — 7.5%</li>
              <li>Institution — 10% flat</li>
              <li>Applies only to net gains after fees</li>
            </ul>
          </div>
        </div>
      </section>
    </ToolShell>
  );
}
