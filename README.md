# NepalHub

A production-ready platform of Nepal-specific calculators, converters, and citizen utilities. Built with Next.js 16 App Router, TypeScript, and Tailwind CSS v4.

## Tools

**Finance**
- Income Tax Calculator — FY 2083/84 & 2080/81 slabs, per-slab breakdown with formula view, SSF/PF/CIT/insurance deductions
- EMI Calculator — loan amortization table, pie chart breakup
- SIP Calculator — compound growth projection with area chart

**Real Estate**
- Land Unit Converter — bidirectional conversion across Ropani, Aana, Paisa, Daam, Bigha, Kattha, Dhur, Sq.Ft, Sq.M, Acre, Hectare

**Education**
- GPA Calculator — SEE and NEB (+2) grade-to-GPA mapping, add/remove subjects

**Utilities**
- Electricity Bill Calculator — NEA 2083 tariff with VAT, 2080 legacy tariff, reference table
- Gold Price — live rate via CoinGecko + Open Exchange Rate (USD→NPR), jewelry weight estimator
- Unicode Converter — Preeti→Unicode font conversion, Romanized English→Nepali transliteration (Google Input Tools)

**Vehicle**
- Road Tax Estimator — DOTM rates for Motorcycle/Car, Petrol/EV, by CC/kW

**Daily Life**
- Age Calculator — exact age in Y/M/D, day-of-week, next birthday countdown
- Date Converter — BS↔AD using full lookup table (1978–2099 BS)

**Documents**
- Passport Photo Tool — drag-to-pan, zoom slider, face-silhouette overlay, canvas export
- Invoice Generator — IRD-compliant Tax Invoice with dual-language headers, VAT/exempt split, dual signatures, PAN box, logo upload, 5 color themes, print-to-PDF

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Charts | Recharts |
| Runtime | Node.js 22 |

All calculators are 100% client-side. No database, no auth, no backend API.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run start   # serve production build
npm run lint    # ESLint
```

## Project Structure

```
src/
  app/
    page.tsx                        # Homepage — hero, search, category filters, tool grid
    layout.tsx                      # Root layout — Navbar, Footer, fluid padding
    globals.css                     # Tailwind import, print media rules
    sitemap.ts                      # Auto XML sitemap from calculators registry
    robots.ts                       # Crawl policy
    finance/
      income-tax/                   # Tax calculator (server metadata + client component)
      emi/                          # EMI + amortization
      sip/                          # SIP projection
    real-estate/land-converter/
    education/gpa/
    utilities/
      electricity-bill/
      gold-price/
      unicode-converter/
    vehicle/road-tax/
    daily/
      age/
      date-converter/
    documents/
      passport-photo/
      invoice-generator/
  components/
    Navbar.tsx                      # Sticky nav, flag accent, Ctrl+K global search
    Footer.tsx                      # 4-column footer
    AdBanner.tsx                    # AdSense placeholder
  data/
    calculators.ts                  # CalculatorInfo[] registry — source of truth for search & sitemap
  utils/
    nepaliDateConverter.ts          # BS↔AD lookup table (1978–2099 BS)
```

## Key Design Decisions

- **Full-screen fluid layout** — no fixed `max-w` container; `px-4 sm:px-8 lg:px-12 xl:px-16` throughout
- **Light + dark theme** — explicit `bg-white dark:bg-gray-800 text-gray-900 dark:text-white` on all inputs and cards
- **Print/PDF** — `@page { margin: 0 }` suppresses browser-injected headers/footers; Navbar and Footer are `print:hidden`
- **Nepali date conversion** — BS months are non-mathematical; a lookup table is the only correct approach
- **Search modal outside backdrop-blur** — `backdrop-blur` creates a CSS stacking context that clips `fixed` children; the modal is rendered outside that wrapper
- **Google Input Tools** — keyless, free Nepali phonetic transliteration; called client-side with 450ms debounce
- **Income tax rates** — stored as decimals (`0.29`), converted with `Math.round(rate * 100)` before display to avoid IEEE 754 floating-point artifacts (e.g. `28.999999...%`)
