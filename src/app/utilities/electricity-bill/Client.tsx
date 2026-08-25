'use client';

import { useState } from 'react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, SliderField, Field, Segmented, ResultStat } from '@/components/ui/fields';

export default function ElectricityBillEstimator() {
  const [units, setUnits] = useState<number>(120);
  const [ampere, setAmpere] = useState<'5A' | '15A' | '30A' | '60A'>('5A');
  const [tariffYear, setTariffYear] = useState<'2083' | '2080'>('2083');

  const calculateBill = (totalUnits: number, amp: string, year: string) => {
    let energyCharge = 0;
    let minCharge = 30;
    let vatAmount = 0;

    if (year === '2083') {
      let first50EnergyCharge = 0;

      if (amp === '5A') {
        if (totalUnits <= 20) {
          minCharge = 30;
          energyCharge = 0;
        } else if (totalUnits <= 30) {
          minCharge = 50;
          energyCharge = (totalUnits - 20) * 6.50;
        } else if (totalUnits <= 50) {
          minCharge = 50;
          energyCharge = (10 * 6.50) + (totalUnits - 30) * 8.00;
        } else if (totalUnits <= 150) {
          minCharge = 75;
          energyCharge = (20 * 3.00) + (10 * 6.50) + (20 * 8.00) + (totalUnits - 50) * 9.50;
        } else if (totalUnits <= 250) {
          minCharge = 100;
          energyCharge = (20 * 3.00) + (10 * 6.50) + (20 * 8.00) + (100 * 9.50) + (totalUnits - 150) * 9.50;
        } else {
          minCharge = 150;
          energyCharge = (20 * 3.00) + (10 * 6.50) + (20 * 8.00) + (100 * 9.50) + (100 * 9.50) + (totalUnits - 250) * 11.00;
        }
        first50EnergyCharge = 285;
      } else {
        const baseRate = amp === '15A' ? 4.50 : amp === '30A' ? 5.00 : 6.00;
        const slabIndex = totalUnits <= 20 ? 0 : totalUnits <= 50 ? 1 : totalUnits <= 150 ? 2 : totalUnits <= 250 ? 3 : 4;
        const demandChargesMap: Record<string, number[]> = {
          '15A': [50, 75, 100, 125, 175],
          '30A': [75, 100, 125, 150, 200],
          '60A': [125, 125, 150, 200, 250],
        };
        minCharge = demandChargesMap[amp]?.[slabIndex] || 100;

        if (totalUnits <= 20) {
          energyCharge = totalUnits * baseRate;
        } else if (totalUnits <= 30) {
          energyCharge = (20 * baseRate) + (totalUnits - 20) * 7.00;
        } else if (totalUnits <= 50) {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (totalUnits - 30) * 8.50;
        } else if (totalUnits <= 150) {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50) + (totalUnits - 50) * 10.00;
        } else if (totalUnits <= 250) {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50) + (100 * 10.00) + (totalUnits - 150) * 11.00;
        } else {
          energyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50) + (100 * 10.00) + (100 * 11.00) + (totalUnits - 250) * 13.00;
        }
        first50EnergyCharge = (20 * baseRate) + (10 * 7.00) + (20 * 8.50);
      }

      if (totalUnits > 50) {
        const vatableEnergy = Math.max(0, energyCharge - first50EnergyCharge);
        vatAmount = vatableEnergy * 0.05;
      }
    } else {
      if (amp === '5A') {
        if (totalUnits <= 20) {
          minCharge = 30;
          energyCharge = totalUnits * 0;
        } else if (totalUnits <= 30) {
          minCharge = 50;
          energyCharge = (totalUnits - 20) * 6.50;
        } else if (totalUnits <= 50) {
          minCharge = 75;
          energyCharge = (10 * 6.50) + (totalUnits - 30) * 8.00;
        } else if (totalUnits <= 100) {
          minCharge = 100;
          energyCharge = (10 * 6.50) + (20 * 8.00) + (totalUnits - 50) * 9.50;
        } else if (totalUnits <= 250) {
          minCharge = 125;
          energyCharge = (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (totalUnits - 100) * 9.50;
        } else {
          minCharge = 150;
          energyCharge = (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (150 * 9.50) + (totalUnits - 250) * 11.00;
        }
      } else {
        if (totalUnits <= 20) {
          minCharge = 100;
          energyCharge = totalUnits * 4.00;
        } else if (totalUnits <= 30) {
          minCharge = 125;
          energyCharge = (20 * 4.00) + (totalUnits - 20) * 6.50;
        } else if (totalUnits <= 50) {
          minCharge = 150;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (totalUnits - 30) * 8.00;
        } else if (totalUnits <= 100) {
          minCharge = 175;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (20 * 8.00) + (totalUnits - 50) * 9.50;
        } else if (totalUnits <= 250) {
          minCharge = 200;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (totalUnits - 100) * 10.00;
        } else {
          minCharge = 250;
          energyCharge = (20 * 4.00) + (10 * 6.50) + (20 * 8.00) + (50 * 9.50) + (150 * 10.00) + (totalUnits - 250) * 12.00;
        }
      }
    }

    return {
      minCharge,
      energyCharge,
      vatAmount,
      total: minCharge + energyCharge + vatAmount
    };
  };

  const bill = calculateBill(units, ampere, tariffYear);

  return (
    <ToolShell
      category="Utilities"
      title="NEA Electricity Bill Estimator"
      badge="Nepal Electricity Authority"
      description="Estimate your monthly bill from units consumed and meter capacity — including the FY 2083/84 concessional VAT rules."
      aside={
        <>
          <Panel>
            <ResultStat label="Estimated monthly bill" value={`Rs. ${bill.total.toFixed(2)}`} emphasis />
            <ResultStat label="Fixed / demand charge" value={`Rs. ${bill.minCharge.toFixed(2)}`} />
            <ResultStat label="Energy charge" value={`Rs. ${bill.energyCharge.toFixed(2)}`} />
            {tariffYear === '2083' && (
              <ResultStat label="VAT (5% on units > 50)" value={`Rs. ${bill.vatAmount.toFixed(2)}`} tone="negative" />
            )}
          </Panel>

          <Panel title="VAT note">
            <p className="text-[13px] leading-relaxed text-ink-soft">
              Under the 2083 BS tariff, a 5% concessional VAT applies to domestic bills — but the first{' '}
              <strong className="text-ink">50 units are fully exempt</strong>, and the fixed demand charge is never taxed.
              Switch to the 2080 tariff above to compare the VAT-free rates.
            </p>
          </Panel>
        </>
      }
    >
      <Panel title="Consumption">
        <div className="space-y-7">
          <div className="space-y-2">
            <span className="text-[13px] font-medium text-ink-soft">Tariff year</span>
            <div>
              <Segmented
                options={[
                  { value: '2083', label: '2083 · with VAT' },
                  { value: '2080', label: '2080 · no VAT' },
                ]}
                value={tariffYear}
                onChange={setTariffYear}
              />
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[13px] font-medium text-ink-soft">Meter capacity</span>
            <div>
              <Segmented
                options={[
                  { value: '5A', label: '5A' },
                  { value: '15A', label: '15A' },
                  { value: '30A', label: '30A' },
                  { value: '60A', label: '60A' },
                ]}
                value={ampere}
                onChange={setAmpere}
              />
            </div>
          </div>

          <SliderField
            label="Units consumed"
            value={units}
            onChange={setUnits}
            min={0}
            max={1000}
            step={5}
            format={(v) => `${v} kWh`}
          />

          <Field
            label="Exact reading"
            suffix="kWh"
            value={units}
            onChange={(v) => setUnits(Number(v) || 0)}
            min={0}
          />
        </div>
      </Panel>

      {/* Tariff reference */}
      <section className="border-t border-line pt-8 pb-10 space-y-5">
        <h2 className="font-display text-xl font-semibold text-ink">NEA domestic tariff — FY 2083/84</h2>
        <div className="overflow-x-auto -mx-2 px-2">
          <table className="min-w-full text-left text-[13px]">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-ink-faint border-b border-line">
                <th className="py-3 pr-4 font-semibold">Monthly slab</th>
                <th className="py-3 pr-4 font-semibold">5A rate</th>
                <th className="py-3 pr-4 font-semibold">15A rate</th>
                <th className="py-3 font-semibold">VAT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line/60 text-ink-soft tabular-nums">
              {[
                ['0 – 20', 'Rs. 0 lifeline / Rs. 3.00', 'Rs. 4.50', 'Exempt', true],
                ['21 – 30', 'Rs. 6.50', 'Rs. 7.00', 'Exempt', true],
                ['31 – 50', 'Rs. 8.00', 'Rs. 8.50', 'Exempt', true],
                ['51 – 150', 'Rs. 9.50', 'Rs. 10.00', '5%', false],
                ['151 – 250', 'Rs. 9.50', 'Rs. 11.00', '5%', false],
                ['251+', 'Rs. 11.00', 'Rs. 13.00', '5%', false],
              ].map(([slab, r5, r15, vat, exempt]) => (
                <tr key={slab as string} className="hover:bg-paper-deep/60 transition-colors">
                  <td className="py-2.5 pr-4 font-semibold text-ink">{slab} units</td>
                  <td className="py-2.5 pr-4 font-mono">{r5}</td>
                  <td className="py-2.5 pr-4 font-mono">{r15}</td>
                  <td className={`py-2.5 font-semibold ${exempt ? 'text-pine' : 'text-brass'}`}>{vat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ToolShell>
  );
}
