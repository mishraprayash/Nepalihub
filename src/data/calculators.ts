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
  }
];
