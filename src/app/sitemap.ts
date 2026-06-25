import { MetadataRoute } from 'next';
import { calculators } from '@/data/calculators';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nepalihub.com';
  
  const calculatorUrls = calculators.map((calc) => ({
    url: `${baseUrl}${calc.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...calculatorUrls,
  ];
}
