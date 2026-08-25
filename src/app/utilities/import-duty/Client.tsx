'use client';

import { useState } from 'react';
import { Smartphone, Laptop, Watch, Monitor, Camera, Headphones, Tablet } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel, Field, ResultStat } from '@/components/ui/fields';

interface GadgetConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  hsCode: string;
  customsDuty: number;
  excise: number;
  incomeTax: number;
  maxValue?: number;
}

const GADGETS: GadgetConfig[] = [
  { id: 'phone', label: 'Phone', icon: <Smartphone className="h-5 w-5" />, hsCode: '8517.12', customsDuty: 10, excise: 5, incomeTax: 7, maxValue: 60000 },
  { id: 'laptop', label: 'Laptop', icon: <Laptop className="h-5 w-5" />, hsCode: '8471.30', customsDuty: 5, excise: 0, incomeTax: 5 },
  { id: 'tablet', label: 'Tablet', icon: <Tablet className="h-5 w-5" />, hsCode: '8471.41', customsDuty: 5, excise: 0, incomeTax: 5 },
  { id: 'smartwatch', label: 'Smartwatch', icon: <Watch className="h-5 w-5" />, hsCode: '9102.12', customsDuty: 10, excise: 0, incomeTax: 5 },
  { id: 'camera', label: 'Camera', icon: <Camera className="h-5 w-5" />, hsCode: '8525.80', customsDuty: 10, excise: 0, incomeTax: 5 },
  { id: 'headphone', label: 'Headphones', icon: <Headphones className="h-5 w-5" />, hsCode: '8518.30', customsDuty: 10, excise: 0, incomeTax: 5 },
  { id: 'monitor', label: 'Monitor', icon: <Monitor className="h-5 w-5" />, hsCode: '8528.52', customsDuty: 5, excise: 0, incomeTax: 5 },
];

const COUNTRY_ORIGIN = [
  { id: 'china', label: 'China / HK', prefRate: 0.9 },
  { id: 'india', label: 'India (SAFTA)', prefRate: 0.7 },
  { id: 'usa', label: 'USA / Europe', prefRate: 1.0 },
  { id: 'uae', label: 'UAE / Mid-East', prefRate: 1.0 },
  { id: 'others', label: 'Other', prefRate: 1.0 },
];

export default function ImportDutyClient() {
  const [gadgetId, setGadgetId] = useState('phone');
  const [price, setPrice] = useState('50000');
  const [origin, setOrigin] = useState('china');
  const [shipping, setShipping] = useState('2000');

  const gadget = GADGETS.find(g => g.id === gadgetId) || GADGETS[0];
  const originData = COUNTRY_ORIGIN.find(c => c.id === origin) || COUNTRY_ORIGIN[0];
  const fobPrice = parseFloat(price) || 0;
  const shippingCost = parseFloat(shipping) || 0;
  const cifValue = fobPrice + shippingCost;

  const assessable = cifValue;
  const dutyRate = gadget.customsDuty * originData.prefRate;
  const customsDutyAmount = assessable * dutyRate / 100;

  const exciseBase = assessable + customsDutyAmount;
  const exciseAmount = gadget.excise > 0 ? exciseBase * gadget.excise / 100 : 0;

  const incomeTaxBase = assessable + customsDutyAmount + exciseAmount;
  const incomeTaxAmount = incomeTaxBase * gadget.incomeTax / 100;

  const vatBase = assessable + customsDutyAmount + exciseAmount + incomeTaxAmount;
  const vatAmount = vatBase * 0.13;

  const totalDuties = customsDutyAmount + exciseAmount + incomeTaxAmount + vatAmount;
  const totalLanded = fobPrice + shippingCost + totalDuties;

  const format = (n: number) => `Rs. ${Math.round(n).toLocaleString()}`;
  const perc = (amount: number) => ((amount / fobPrice) * 100).toFixed(1);

  const phoneConcession = gadget.id === 'phone' && fobPrice <= (gadget.maxValue || 60000);

  return (
    <ToolShell
      category="Utilities"
      title="Gadget Import Duty"
      badge="Customs"
      description="The true landed cost of bringing electronics into Nepal — customs duty, excise, advance income tax and VAT, layer by layer."
      aside={
        <>
          <Panel>
            <ResultStat label="Total landed cost" value={format(totalLanded)} emphasis />
            <ResultStat label="Total duties & taxes" value={format(totalDuties)} tone="negative" />
            <ResultStat
              label="As % of purchase price"
              value={`${totalDuties > 0 ? perc(totalDuties) : '0'}%`}
            />
            <p className="text-xs text-ink-faint pt-3">
              HS Code {gadget.hsCode} · source: customs.gov.np
            </p>
          </Panel>

          <Panel title="Breakdown">
            <ResultStat label={`CIF value (price + shipping)`} value={format(cifValue)} />
            <ResultStat
              label={`Customs duty (${dutyRate.toFixed(1)}%${originData.prefRate < 1 ? ` · preferential` : ''})`}
              value={format(customsDutyAmount)}
            />
            {gadget.excise > 0 && (
              <ResultStat label={`Excise (${gadget.excise}%)`} value={format(exciseAmount)} tone="negative" />
            )}
            <ResultStat label={`Advance income tax (${gadget.incomeTax}%)`} value={format(incomeTaxAmount)} tone="negative" />
            <ResultStat label="VAT (13%)" value={format(vatAmount)} tone="negative" />
          </Panel>

          {phoneConcession && (
            <Panel>
              <p className="text-[13px] leading-relaxed text-pine">
                <strong>Concession applies:</strong> phones under Rs. 60,000 get reduced customs duty.
              </p>
            </Panel>
          )}
        </>
      }
    >
      <Panel title="What are you importing?">
        <div className="space-y-7">
          {/* Gadget picker */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {GADGETS.map(g => (
              <button
                key={g.id}
                onClick={() => setGadgetId(g.id)}
                className={`flex flex-col items-center gap-1.5 px-2 py-3 rounded-xl border text-xs font-semibold transition-colors ${
                  gadgetId === g.id
                    ? 'border-simrik/50 bg-simrik/[0.06] text-simrik'
                    : 'border-line text-ink-soft hover:border-line-strong'
                }`}
              >
                {g.icon}
                <span className="leading-tight text-center">{g.label}</span>
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Purchase price (FOB)" prefix="Rs." type="number" value={price} onChange={setPrice} />
            <Field label="Shipping & insurance" prefix="Rs." type="number" value={shipping} onChange={setShipping} />
          </div>

          {/* Origin */}
          <div className="space-y-2">
            <span className="text-[13px] font-medium text-ink-soft">Country of origin</span>
            <div className="inline-flex flex-wrap p-1 gap-1 bg-paper-deep rounded-xl border border-line">
              {COUNTRY_ORIGIN.map(c => (
                <button
                  key={c.id}
                  onClick={() => setOrigin(c.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    origin === c.id
                      ? 'bg-surface-raised text-ink shadow-sm'
                      : 'text-ink-faint hover:text-ink-soft'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      {/* How it stacks */}
      <section className="border-t border-line pt-8 pb-10 space-y-4 max-w-xl">
        <h2 className="font-display text-xl font-semibold text-ink">How the taxes stack</h2>
        <ol className="list-decimal pl-5 space-y-1.5 text-[13px] leading-relaxed text-ink-soft">
          <li><strong className="text-ink">CIF value</strong> — price plus shipping &amp; insurance, the base for everything.</li>
          <li><strong className="text-ink">Customs duty</strong> on CIF (varies by HS code; India/SAFTA gets preferential rates).</li>
          <li><strong className="text-ink">Excise</strong> on CIF + customs (phones only).</li>
          <li><strong className="text-ink">Advance income tax</strong> on everything so far.</li>
          <li><strong className="text-ink">VAT 13%</strong> on the grand total of all the above.</li>
        </ol>
        <p className="text-xs text-ink-faint">
          Based on the Nepal Customs Tariff Act and current Finance Act. Actual assessments can vary at customs.
        </p>
      </section>
    </ToolShell>
  );
}
