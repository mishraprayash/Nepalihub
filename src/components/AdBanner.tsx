'use client';

import { useEffect, useRef } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Google AdSense responsive banner.
 * Usage: <AdBanner slot="1234567890" format="auto" />
 * 
 * To enable ads:
 * 1. Add your AdSense publisher ID to layout.tsx (data-ad-client)
 * 2. Replace the slot prop with your actual AdSense ad slot IDs
 * 3. Deploy to production (AdSense only serves on live domains)
 */
export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    // Only push the ad on the first render
    if (initialized.current) return;
    initialized.current = true;

    try {
      if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
        (window as any).adsbygoogle.push({});
      }
    } catch {
      // Silently fail if AdBlock or ad script not loaded
    }
  }, []);

  // Show placeholder when no AdSense yet (development / before approval)
  const isProd = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost' && 
    !window.location.hostname.includes('127.0.0.1') &&
    process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  const containerStyles = format === 'horizontal' ? 'min-h-[90px] w-full' :
                          format === 'rectangle' ? 'min-h-[250px] w-full max-w-[300px]' :
                          format === 'vertical' ? 'min-h-[600px] w-[160px]' :
                          'min-h-[100px] w-full';

  if (!isProd) {
    return (
      <div className={`my-6 bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center transition-colors ${containerStyles} ${className}`}>
        <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
          Advertisement
        </span>
        <div className="text-xs text-gray-400 dark:text-gray-500">
          AdSense Slot ({format})
        </div>
      </div>
    );
  }

  return (
    <div className={`my-6 flex justify-center overflow-hidden ${containerStyles} ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle w-full h-full block"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-9613933136929298"}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
