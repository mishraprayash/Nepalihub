# Build "NepalHub" – The Ultimate Nepal Utility & Calculator Platform

## Role

You are a Principal Software Engineer, Product Designer, SEO Specialist, and UX Engineer tasked with building a production-ready web platform called **NepalHub**.

The objective is to create the definitive collection of Nepal-specific calculators, converters, planners, estimators, and citizen utilities that solve everyday problems for people living in Nepal.

The platform should be optimized for:

* Organic search traffic (SEO)
* Fast page loads
* Mobile-first experience
* Accessibility
* AdSense compatibility
* Future premium subscriptions
* High maintainability and scalability

---

# Vision

NepalHub should become the first website Nepali users visit when they need to calculate taxes, convert land units, estimate loans, compare salaries, understand government fees, or use practical digital tools.

Instead of a single application, think of NepalHub as a growing ecosystem containing hundreds of useful mini-applications.

---

# Technology Stack

* Frontend: Next.js (App Router) with TypeScript
* Styling: Tailwind CSS
* Component Library: shadcn/ui
* Charts: Recharts
* Icons: Lucide
* Forms: React Hook Form + Zod
* Backend: NestJS
* Database: PostgreSQL
* ORM: Prisma
* Cache: Redis
* CMS/Content: Markdown or database-backed
* Deployment: Docker
* Image optimization enabled
* Server-side rendering where appropriate
* Static generation for informational pages

---

# Design Principles

The interface should feel:

* Modern
* Fast
* Minimal
* Professional
* Easy for non-technical users

Provide:

* Light and dark themes
* Responsive layouts
* Accessible typography
* Large touch targets
* Excellent mobile usability

---

# Homepage

The landing page should include:

* Hero section
* Search bar for all utilities
* Popular tools
* Categories
* Trending calculators
* Recently added tools
* Featured guides
* Frequently used services
* FAQ
* Footer with navigation

---

# Global Search

Users should be able to instantly search for:

* Income tax
* EMI
* GPA
* Passport photo
* Electricity bill
* Gold price
* Land converter
* Salary calculator
* Vehicle tax
* Exchange rate

Search results should update instantly.

---

# Categories

## Finance

* Nepal income tax calculator
* Salary breakdown calculator
* Take-home salary estimator
* Bonus calculator
* Provident fund estimator
* Gratuity estimator
* Compound interest calculator
* Simple interest calculator
* Savings planner
* Loan EMI calculator
* Mortgage calculator
* SIP calculator
* Fixed deposit maturity calculator
* Currency converter
* Inflation calculator
* Retirement planner

---

## Banking

* Loan affordability checker
* Interest comparison
* Deposit planner
* Monthly repayment schedule
* Amortization table
* Personal finance planner

---

## Tax

* Individual tax estimator
* Business tax estimator
* Annual tax planner
* Monthly withholding estimate
* Tax slab explanation pages
* Interactive tax examples

---

## Real Estate

* Ropani ↔ Square Feet
* Ropani ↔ Square Meter
* Bigha ↔ Kattha
* Dhur ↔ Square Feet
* Kattha ↔ Acre
* Hectare ↔ Local units
* Land measurement converter
* House construction budget estimator
* Rental affordability calculator

---

## Vehicle

* Road tax estimator
* Registration fee estimate
* Ownership transfer estimate
* Fuel cost calculator
* Mileage calculator
* EV charging cost estimator
* Trip fuel planner

---

## Education

* SEE GPA calculator
* +2 GPA calculator
* University GPA calculator
* Percentage converter
* Grade converter
* Attendance calculator
* CGPA planner
* Study hour planner

---

## Employment

* Monthly salary breakdown
* Hourly wage converter
* Freelance income estimator
* Overtime calculator
* Notice period calculator
* Leave balance tracker

---

## Utilities

* Electricity bill estimator
* Water usage calculator
* Mobile recharge planner
* Internet usage estimator
* Data unit converter

---

## Travel

* Trip budget planner
* Trek packing checklist
* Altitude planner
* Currency exchange estimator
* Fuel trip estimator

---

## Daily Life

* Age calculator
* Date difference
* Countdown timer
* Birthday finder
* BMI calculator
* Calorie estimator
* Pregnancy due date estimator
* Sleep calculator

---

## Gold & Precious Metals

* Live gold price display
* Historical gold trends
* Jewelry value estimator
* Purity calculator

---

## Documents

* Passport photo cropper
* CV template generator
* Invoice generator
* Receipt generator
* Rental agreement template
* Salary certificate template

---

# Dynamic Informational Content

Each calculator should have accompanying educational content including:

* Explanation
* Formula
* Worked examples
* FAQs
* Common mistakes
* Related calculators
* Legal disclaimers where needed

---

# SEO Strategy

Every tool should have:

* Unique title
* Meta description
* Canonical URL
* Open Graph tags
* Structured data
* Breadcrumbs
* FAQ schema
* Internal linking

Generate XML sitemaps automatically.

---

# Admin Dashboard

Support:

* Tool management
* Blog publishing
* Featured content
* SEO metadata editing
* Analytics overview
* Ad placement configuration

---

# Authentication

Optional user accounts supporting:

* Google sign-in
* Email login
* Saved calculations
* Favorites
* History
* Personalized dashboard

Anonymous usage should remain available.

---

# Monetization

Primary:

* Google AdSense display ads
* Native ad placements
* Sticky mobile ads

Secondary:

* Premium ad-free subscription
* Affiliate links where appropriate
* Sponsored financial calculators
* Featured listings

Ads should never interrupt calculator workflows.

---

# Analytics

Track:

* Most used calculators
* Search queries
* Click-through rates
* User retention
* Session duration
* Device breakdown
* Geographic distribution
* Popular categories

---

# Performance Goals

* Lighthouse score above 95
* Core Web Vitals optimized
* Lazy loading
* Code splitting
* Image optimization
* Edge caching where applicable

---

# Future Expansion

Design the architecture so new tools can be added with minimal effort.

Potential future additions:

* AI-powered financial assistant
* Personalized budgeting
* Province-specific tax calculators
* Municipality-specific service estimators
* Agriculture planning tools
* Business registration guides
* Legal document generation
* Insurance calculators
* Scholarship eligibility checker

---

# Final Objective

Build NepalHub as the most comprehensive Nepal-focused utility platform, delivering exceptional user experience, strong search-engine visibility, scalable architecture, and sustainable monetization through high-quality informational content and practical tools that users return to regularly.

---

# Implemented Features & Updates (Changelog)

## 1. Finance & Tax
* **Income Tax Calculator:** Upgraded with strict adherence to Nepal's latest IRD tax slabs and regulations. Differentiates between Basic and Gross salary. Implemented accurate retirement deduction capping (Rule of 1/3rd, up to 3L/5L/6L depending on SSF enrollment). Fixed the algorithm to accurately isolate regular monthly take-home pay from one-time bonuses.
* **SSF Calculator:** Fixed employer contribution breakdown to precisely match the Nepal SSF Act's 31% mandate (Employee: 11%, Employer: 20% [17.33% Pension + 1% Medical + 1.4% Accident + 0.27% Dependent]). Resolved floating-point UI bugs.

## 2. Utilities & Tools
* **Gold Price Estimator:** Replaced international spot price fallback with an active Next.js API proxy (`cheerio` scraper) that securely fetches the *actual* daily market rate directly from FENEGOSIDA. Added skeleton loaders to prevent layout shifts and display of inaccurate default data during fetch.
* **Invoice Generator:** Completely modularized into tailored IRD-compliant formats:
  * **Tax Invoice:** Supports VAT separation, dual signatures, and mandatory PAN fields.
  * **Sales Receipt:** Streamlined for non-VAT transactions.
  * **Estimate / Quote:** Tailored for pre-sales with validity dates and no strict bank demands.
  * **Print Optimization:** Injected advanced `@media print` CSS rules to strip AdSense banners, navigation, and web clutter, ensuring the generated PDF perfectly fits an A4 page.

## 3. Codebase & Architecture
* **Refactoring:** Modularized monolithic files, implemented Next.js server-side API routes for cross-origin scraping, and applied strict TypeScript typings.
* **Cleanup:** Removed redundant test scripts, pruned unused variables/imports, resolved React `useEffect` cascading render warnings, and ensured a completely clean linter output.
