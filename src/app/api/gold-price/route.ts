import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const res = await fetch('https://www.fenegosida.org/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
      next: { revalidate: 3600 }
    });
    
    if (!res.ok) {
      throw new Error(`Failed to fetch FENEGOSIDA: ${res.status}`);
    }
    
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let price = 0;
    
    // FENEGOSIDA puts the price in <p>FINE GOLD (9999)... <b>PRICE</b></p>
    $('p').each((i, el) => {
      const text = $(el).text().toUpperCase();
      if (text.includes('FINE GOLD') && text.includes('TOLA')) {
        const bTag = $(el).find('b').text().trim().replace(/,/g, '');
        const parsed = parseInt(bTag, 10);
        if (!isNaN(parsed) && parsed > 100000) {
          price = parsed;
        }
      }
    });

    if (price > 0) {
      return NextResponse.json({ rate: price });
    }
    
    throw new Error('Price element not found on page');
    
  } catch (err: unknown) {
    console.error('API Route Error:', err);
    const errorMsg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: errorMsg }, { status: 500 });
  }
}
