'use client';

export default function AdBanner() {
  return (
    <div className="w-full my-6 p-4 bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 rounded-2xl flex flex-col items-center justify-center text-center min-h-[90px] transition-colors">
      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
        Sponsored Advertisement
      </span>
      <div className="text-xs text-gray-400 dark:text-gray-500">
        AdSense Compatible Slot (Responsive Banner)
      </div>
    </div>
  );
}
