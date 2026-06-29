import { MetadataRoute } from 'next';
import { calculators } from '@/data/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nepalihub-omega.vercel.app/';
  
  // Higher priority for finance & daily tools (more search traffic)
  const highPriorityTools = ['income-tax', 'emi', 'sip', 'remittance', 'rashifal', 'date-converter', 'electricity-bill', 'gold-price'];
  
  const calculatorUrls = calculators.map((calc) => ({
    url: `${baseUrl}${calc.path}`,
    lastModified: new Date(),
    changeFrequency: highPriorityTools.includes(calc.id) ? 'weekly' as const : 'monthly' as const,
    priority: highPriorityTools.includes(calc.id) ? 0.9 : 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    ...calculatorUrls,
  ];
}
