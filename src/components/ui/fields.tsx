'use client';

import { ReactNode, useId } from 'react';

/* ── Panel ─────────────────────────────────────────────────────── */
export function Panel({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`bg-surface border border-line rounded-2xl p-5 sm:p-7 ${className}`}
    >
      {title && (
        <h2 className="font-display text-lg font-semibold text-ink mb-6">{title}</h2>
      )}
      {children}
    </section>
  );
}

/* ── Text / number field with optional prefix & suffix ─────────── */
export function Field({
  label,
  hint,
  prefix,
  suffix,
  value,
  onChange,
  min,
  max,
  step,
  type = 'number',
  placeholder,
}: {
  label: string;
  hint?: string;
  prefix?: string;
  suffix?: string;
  value: number | string;
  onChange: (v: string) => void;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  type?: string;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium text-ink-soft">{label}</span>
        {hint && <span className="text-[11px] text-ink-faint">{hint}</span>}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-semibold text-ink-faint pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          step={step}
          placeholder={placeholder}
          className={`w-full py-2.5 pr-4 text-sm font-semibold bg-surface-raised border border-line rounded-xl text-ink placeholder:text-ink-faint outline-none focus-visible:border-simrik/60 focus-visible:ring-3 focus-visible:ring-simrik/10 transition-all ${
            prefix ? 'pl-10' : 'pl-4'
          }`}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-ink-faint pointer-events-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Slider + numeric input, paired ────────────────────────────── */
export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format,
  suffix,
  prefix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: (v: number) => string;
  suffix?: string;
  prefix?: string;
}) {
  const id = useId();
  const display = format ? format(value) : `${prefix ?? ''}${value.toLocaleString()}${suffix ?? ''}`;
  return (
    <div className="space-y-2.5">
      <label htmlFor={id} className="flex items-baseline justify-between gap-2">
        <span className="text-[13px] font-medium text-ink-soft">{label}</span>
        <span className="font-mono text-sm font-bold text-simrik tabular-nums">{display}</span>
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="focus-visible:outline-none"
      />
    </div>
  );
}

/* ── Segmented control (years/months, buy/sell …) ──────────────── */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="inline-flex flex-wrap p-1 gap-1 bg-paper-deep rounded-xl border border-line">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            value === o.value
              ? 'bg-surface-raised text-ink shadow-sm'
              : 'text-ink-faint hover:text-ink-soft'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

/* ── Result stat — the big payoff numbers ──────────────────────── */
export function ResultStat({
  label,
  value,
  emphasis = false,
  tone = 'default',
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  tone?: 'default' | 'positive' | 'negative';
}) {
  const toneClass =
    tone === 'positive' ? 'text-pine' : tone === 'negative' ? 'text-simrik' : 'text-ink';
  if (emphasis) {
    return (
      <div className="pb-4 mb-4 border-b border-line last:border-0 last:mb-0 last:pb-0">
        <p className="text-xs font-medium text-ink-faint mb-1">{label}</p>
        <p className={`font-display text-[2rem] leading-none font-semibold tracking-tight ${toneClass} tabular-nums`}>
          {value}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-baseline justify-between gap-3 py-2.5 border-b border-line/60 last:border-0">
      <p className="text-[13px] text-ink-soft">{label}</p>
      <p className={`text-sm font-bold ${toneClass} tabular-nums`}>{value}</p>
    </div>
  );
}
