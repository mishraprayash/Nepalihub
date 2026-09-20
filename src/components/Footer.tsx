import Link from 'next/link';

const FOOTER_LINKS = [
  {
    heading: 'Finance',
    links: [
      { href: '/finance/income-tax',      label: 'Income Tax Calculator' },
      { href: '/finance/emi',             label: 'Loan EMI Calculator' },
      { href: '/finance/sip',             label: 'SIP Return Estimator' },
      { href: '/finance/stock-calculator',label: 'NEPSE Stock P&L' },
    ],
  },
  {
    heading: 'Utilities',
    links: [
      { href: '/utilities/remittance',          label: 'Remittance & Forex' },
      { href: '/utilities/electricity-bill',    label: 'NEA Electricity Bill' },
      { href: '/utilities/nepali-unit-converter',label: 'Nepali Unit Converter' },
      { href: '/utilities/unicode-converter',   label: 'Preeti → Unicode' },
    ],
  },
  {
    heading: 'Daily & Docs',
    links: [
      { href: '/daily/date-converter',       label: 'BS ↔ AD Date Converter' },
      { href: '/daily/age',                  label: 'Age Calculator' },
      { href: '/documents/passport-photo',   label: 'Passport Photo Cropper' },
      { href: '/documents/invoice-generator',label: 'Invoice Generator' },
    ],
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-line bg-paper-deep mt-auto print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block font-display text-xl font-semibold tracking-tight text-ink">
              Nepal<span className="text-simrik">Hub</span>
            </Link>
            <p className="text-[13px] leading-relaxed text-ink-soft sm:max-w-[230px]">
              Free, private, Nepal-specific calculators and converters — built for the way things actually work here.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full border border-line bg-surface text-[11px] font-semibold text-ink-soft">
                FY 2083/84 rates
              </span>
              <span className="px-2.5 py-1 rounded-full border border-line bg-surface text-[11px] font-semibold text-ink-soft">
                Runs in your browser
              </span>
            </div>
            <a
              href="https://github.com/mishraprayash/Nepalihub"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open source on GitHub"
              className="inline-flex items-center gap-1.5 text-xs text-ink-faint hover:text-simrik transition-colors"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Open source on GitHub</span>
            </a>
          </div>

          {/* Link columns */}
          {FOOTER_LINKS.map(col => (
            <div key={col.heading}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-ink mb-4">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-[13px] text-ink-soft hover:text-simrik transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-line mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-faint">
          <p>© {year} NepalHub</p>
          <div className="flex gap-4 sm:gap-5 flex-wrap justify-center">
            <Link href="/about" className="hover:text-simrik transition-colors">About</Link>
            <Link href="/contact" className="hover:text-simrik transition-colors">Contact</Link>
            <Link href="/privacy-policy" className="hover:text-simrik transition-colors">Privacy</Link>
            <Link href="/terms-of-service" className="hover:text-simrik transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
