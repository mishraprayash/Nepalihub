export interface CalculatorInfo {
  id: string;
  name: string;
  description: string;
  category: 'finance' | 'real-estate' | 'education' | 'utilities' | 'daily' | 'documents';
  path: string;
  keywords: string[];
}

export const calculators: CalculatorInfo[] = [
  {
    id: 'income-tax',
    name: 'Nepal Income Tax Calculator',
    description: 'Calculate income tax slabs and take-home pay under the latest Nepal government tax rules.',
    category: 'finance',
    path: '/finance/income-tax',
    keywords: ['salary', 'income tax', 'tax slab', 'nepal tax', 'social security', 'ssf', 'cit', 'take home pay', 'withholding tax']
  },
  {
    id: 'emi',
    name: 'Loan EMI Calculator',
    description: 'Calculate monthly EMI payments, interest amount, and view full amortization schedule for home or auto loans.',
    category: 'finance',
    path: '/finance/emi',
    keywords: ['emi', 'loan', 'mortgage', 'interest', 'monthly payment', 'bank loan', 'amortization']
  },
  {
    id: 'sip',
    name: 'SIP Calculator',
    description: 'Estimate maturity wealth and returns from Systematic Investment Plans (SIP) in mutual funds in Nepal.',
    category: 'finance',
    path: '/finance/sip',
    keywords: ['sip', 'mutual fund', 'investment', 'savings', 'interest', 'compound interest', 'maturity']
  },
  {
    id: 'stock-calculator',
    name: 'NEPSE Stock P&L Calculator',
    description: 'Calculate exact profit/loss from NEPSE trades including brokerage (0.40–0.27%), SEBO fee (0.015%), DP charges, and Capital Gains Tax (5%, 7.5%, 10%).',
    category: 'finance',
    path: '/finance/stock-calculator',
    keywords: ['nepse', 'stock', 'share', 'profit', 'loss', 'capital gains', 'brokerage', 'trading', 'investment', 'nepal stock exchange', 'cgt']
  },
  {
    id: 'remittance',
    name: 'Remittance & Forex Calculator',
    description: 'Convert foreign currencies to Nepalese Rupee (NPR) with live exchange rates. Supports USD, EUR, GBP, AUD, SAR, AED, QAR, JPY, KRW and more.',
    category: 'utilities',
    path: '/utilities/remittance',
    keywords: ['remittance', 'forex', 'currency', 'exchange rate', 'npr', 'usd', 'dollar', 'money transfer', 'abroad income', 'foreign currency']
  },
  {
    id: 'nepali-unit-converter',
    name: 'Nepali Unit Converter',
    description: 'Convert between traditional Nepali units and metric: Tola, Pau, Dharni (weight), Mana, Pathi (volume), Bitta, Haat, Kosh (length), and land units.',
    category: 'utilities',
    path: '/utilities/nepali-unit-converter',
    keywords: ['unit converter', 'nepali units', 'tola', 'pau', 'dharni', 'mana', 'pathi', 'bitta', 'haat', 'kosh', 'ropani', 'bigha', 'conversion']
  },
  {
    id: 'rashifal',
    name: 'Rashifal (राशिफल)',
    description: 'Discover your Nepali zodiac sign (Rashi), daily horoscope predictions, personality traits, gemstones, lucky numbers, and rashi matching.',
    category: 'daily',
    path: '/daily/rashifal',
    keywords: ['rashifal', 'rashi', 'horoscope', 'zodiac', 'nepali astrology', 'mesha', 'vrishabha', 'mithuna', 'karka', 'simha', 'kanya', 'tula', 'vrishchika', 'dhanu', 'makara', 'kumbha', 'meena', 'kundali']
  },
  {
    id: 'land-converter',
    name: 'Nepal Land Converter',
    description: 'Convert between traditional Nepali land units (Ropani, Aana, Paisa, Daam, Bigha, Kattha, Dhur) and Sq. Ft/Sq. M.',
    category: 'real-estate',
    path: '/real-estate/land-converter',
    keywords: ['land', 'ropani', 'aana', 'bigha', 'kattha', 'dhur', 'square feet', 'paisa', 'daam', 'conversion', 'area']
  },
  {
    id: 'gpa',
    name: 'SEE & +2 GPA Calculator',
    description: 'Calculate GPA and grade percentages for SEE, NEB (+2), and university grading systems in Nepal.',
    category: 'education',
    path: '/education/gpa',
    keywords: ['gpa', 'see', 'neb', 'plus two', 'marks', 'percentage', 'grade', 'gpa converter']
  },
  {
    id: 'electricity-bill',
    name: 'NEA Electricity Bill Estimator',
    description: 'Estimate your monthly electricity bill based on current Nepal Electricity Authority (NEA) tariff rates.',
    category: 'utilities',
    path: '/utilities/electricity-bill',
    keywords: ['electricity', 'nea', 'bill', 'tariff', 'light bill', 'electricity charges']
  },
  {
    id: 'gold-price',
    name: 'Gold & Jewelry Value Estimator',
    description: 'Estimate the value of gold/silver jewelry based on current weight, purity, and making charges.',
    category: 'utilities',
    path: '/utilities/gold-price',
    keywords: ['gold', 'silver', 'price', 'jewelry', 'purity', 'tola', 'lals', 'carat', 'fenya']
  },
  {
    id: 'age-calculator',
    name: 'Age & Date Difference Calculator',
    description: 'Calculate your exact age in years, months, days, or find the duration between two dates.',
    category: 'daily',
    path: '/daily/age',
    keywords: ['age', 'birthday', 'date difference', 'days count', 'nepali date', 'leap year']
  },
  {
    id: 'passport-photo',
    name: 'Passport Photo Cropper',
    description: 'Crop and resize photos to official passport sizes (MRP size, citizenship size) ready for printing.',
    category: 'documents',
    path: '/documents/passport-photo',
    keywords: ['passport', 'mrp', 'photo size', 'crop photo', 'citizenship photo', 'resize image']
  },
  {
    id: 'invoice-generator',
    name: 'Invoice & Receipt Generator',
    description: 'Generate professional invoices and receipts with VAT/PAN details ready to download as PDF.',
    category: 'documents',
    path: '/documents/invoice-generator',
    keywords: ['invoice', 'receipt', 'vat', 'pan', 'bill generator', 'pdf invoice', 'business bill']
  },
  {
    id: 'road-tax',
    name: 'Vehicle Road Tax Estimator',
    description: 'Estimate the annual road tax and registration renewal fees for your motorcycle, car, or electric vehicle (EV).',
    category: 'utilities',
    path: '/vehicle/road-tax',
    keywords: ['road tax', 'yatayat tax', 'vehicle tax', 'bike tax', 'car tax', 'ev tax', 'dotm nepal']
  },
  {
    id: 'onroad-price',
    name: 'Vehicle On-Road Price Calculator',
    description: 'Calculate the total on-road price for cars, motorcycles, and EVs including all taxes and fees.',
    category: 'utilities',
    path: '/vehicle/onroad-price',
    keywords: ['on road price', 'car price', 'bike price', 'ev price', 'ex showroom', 'vehicle cost nepal']
  },
  {
    id: 'date-converter',
    name: 'Nepali ↔ English Date Converter',
    description: 'Convert dates dynamically between Bikram Sambat (BS) and English Gregorian calendar (AD).',
    category: 'daily',
    path: '/daily/date-converter',
    keywords: ['date converter', 'nepali date converter', 'bs to ad', 'ad to bs', 'bikram sambat', 'gregorian']
  },
  {
    id: 'unicode-converter',
    name: 'Preeti to Unicode Converter',
    description: 'Convert visual Preeti font text to standard web-compliant Nepali Unicode format.',
    category: 'utilities',
    path: '/utilities/unicode-converter',
    keywords: ['unicode converter', 'preeti to unicode', 'nepali typing', 'preeti unicode', 'nepali font conversion']
  },
  {
    id: 'import-duty',
    name: 'Gadget Import Duty Calculator',
    description: 'Calculate total landed cost for importing phones, laptops, and electronics into Nepal including customs duty, excise, income tax, and VAT.',
    category: 'utilities',
    path: '/utilities/import-duty',
    keywords: ['import duty', 'customs', 'gadget tax', 'phone import', 'laptop customs', 'hs code', 'landed cost nepal']
  },
  {
    id: 'ssf',
    name: 'SSF Contribution Calculator',
    description: 'Calculate SSF contributions (11% employee + 21% employer) under Nepal Social Security Fund rules.',
    category: 'finance',
    path: '/finance/ssf',
    keywords: ['ssf', 'social security fund', 'pension', 'contribution', 'employee', 'employer', 'benefits']
  },
  {
    id: 'fd-comparator',
    name: 'Bank FD Rate Comparator',
    description: 'Compare fixed deposit interest rates across 23+ Nepali banks, development banks, and finance companies.',
    category: 'finance',
    path: '/finance/fd-comparator',
    keywords: ['fd rate', 'fixed deposit', 'bank interest', 'fd comparator', 'nepal bank', 'saving rate']
  },
  {
    id: 'data-plans',
    name: 'Mobile Data Plan Comparator',
    description: 'Compare mobile data plans across Nepal Telecom, Ncell, and SmartCell. Find the cheapest plan by price or best value.',
    category: 'utilities',
    path: '/utilities/data-plans',
    keywords: ['data plan', 'ntc', 'ncell', 'smart cell', 'mobile data', '4g nepal', '5g nepal']
  },
  {
    id: 'construction-cost',
    name: 'House Construction Cost Estimator',
    description: 'Estimate house construction cost per sq ft in Nepal. RCC, load-bearing, prefab costs by city and number of floors.',
    category: 'real-estate',
    path: '/real-estate/construction-cost',
    keywords: ['construction cost', 'house building', 'per sq ft', 'rcc', 'nepal construction', 'building estimate']
  },
];
