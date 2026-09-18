import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface ToolShellProps {
  category: string;
  categoryHref?: string;
  title: string;
  description: string;
  badge?: string;
  /** Primary input column (left, wider) */
  children: React.ReactNode;
  /** Live results column (right, sticky) */
  aside?: React.ReactNode;
  /** Optional full-width content below the columns */
  below?: React.ReactNode;
}

/**
 * Shared frame for every tool page: breadcrumb → editorial header
 * → two-column body (inputs / live results) → optional full-width section.
 */
export default function ToolShell({
  category,
  categoryHref = '/',
  title,
  description,
  badge,
  children,
  aside,
  below,
}: ToolShellProps) {
  const hasAside = Boolean(aside);
  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-faint mb-6 print:hidden">
        <Link href="/" className="hover:text-simrik transition-colors">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href={categoryHref} className="hover:text-simrik transition-colors shrink-0">{category}</Link>
        <ChevronRight className="h-3 w-3 shrink-0" />
        <span className="text-ink-soft font-medium truncate">{title}</span>
      </nav>

      {/* Editorial header */}
      <header className="mb-8 pb-8 border-b border-line">
        {badge && (
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-simrik mb-3">
            {badge}
          </p>
        )}
        <h1 className="font-display text-3xl md:text-5xl leading-[1.1] font-semibold tracking-tight text-ink max-w-2xl">
          {title}
        </h1>
        <p className="mt-3 text-sm md:text-base leading-relaxed text-ink-soft max-w-xl">
          {description}
        </p>
      </header>

      {/* Two-column body */}
      <div
        className={`grid grid-cols-1 gap-6 lg:gap-10 items-start pb-10 ${
          hasAside ? 'lg:grid-cols-12' : ''
        }`}
      >
        <div className={hasAside ? 'lg:col-span-7 space-y-6' : 'space-y-6'}>{children}</div>
        {hasAside && (
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">{aside}</div>
        )}
      </div>

      {below}
    </div>
  );
}
