import React from 'react';

export default function EstimateTemplate({
  themeColor, logoSrc, sellerName, sellerAddress, sellerPhone, sellerEmail,
  invoiceNumber, invoiceDate, dueDate, buyerName, buyerAddress, buyerPhone,
  items, paymentTerms, authorizedSignatory,
  grossSubtotal, globalDiscountPercent, discountAmount, vatAmount, totalPayable
}: {
  themeColor: string; logoSrc: string | null; sellerName: string; sellerAddress: string; sellerPhone: string; sellerEmail: string;
  invoiceNumber: string; invoiceDate: string; dueDate: string; buyerName: string; buyerAddress: string; buyerPhone: string;
  items: { id: string; description: string; unit: string; quantity: number; rate: number; isVatable: boolean }[]; paymentTerms: string; authorizedSignatory: string;
  grossSubtotal: number; globalDiscountPercent: number; discountAmount: number; vatAmount: number; totalPayable: number;
}) {
  return (
    <div id="printable-invoice" className="bg-surface-raised text-ink border border-line-strong rounded-3xl p-8 sm:p-12 shadow-xl max-w-3xl mx-auto print:shadow-none print:border-0 print:p-0 print:max-w-none relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: themeColor }} />

      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-line pb-6 gap-6 pt-2">
        <div className="space-y-3">
          {logoSrc ? (
            <img src={logoSrc} alt="Brand Logo" className="max-h-[55px] object-contain" />
          ) : (
            <h2 className="text-xl font-black tracking-tight" style={{ color: themeColor }}>
              {sellerName}
            </h2>
          )}
          <div className="text-[11px] text-ink-soft leading-normal">
            <p className="font-semibold text-ink">{sellerAddress}</p>
            {sellerPhone && <p>Phone: {sellerPhone}</p>}
            {sellerEmail && <p>Email: {sellerEmail}</p>}
          </div>
        </div>
        
        <div className="text-left sm:text-right space-y-2">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black uppercase tracking-wider leading-none" style={{ color: themeColor }}>
              ESTIMATE / QUOTATION
            </h3>
            <span className="text-[10px] font-bold text-ink-faint block font-sans">
              अनुमान पत्र
            </span>
          </div>
          <div className="text-[11px] text-ink-soft space-y-1">
            <p><strong>Estimate No:</strong> <span className="font-semibold text-ink font-mono">{invoiceNumber}</span></p>
            <p><strong>Date:</strong> <span className="font-semibold text-ink">{invoiceDate}</span></p>
            {dueDate && <p><strong>Valid Until:</strong> <span className="font-semibold text-ink">{dueDate}</span></p>}
          </div>
        </div>
      </div>

      <div className="py-5 border-b border-line grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-ink-faint mb-1">Prepared For:</h4>
          <p className="font-bold text-sm text-ink">{buyerName}</p>
          <p className="text-[11px] text-ink-soft leading-normal">{buyerAddress}</p>
          {buyerPhone && <p className="text-[11px] text-ink-soft">Phone: {buyerPhone}</p>}
        </div>
      </div>

      <div className="py-6 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-faint uppercase text-[9px] font-bold tracking-wider">
              <th className="py-3 font-semibold">S.N.</th>
              <th className="py-3 font-semibold">Description</th>
              <th className="py-3 font-semibold text-center">Qty</th>
              <th className="py-3 font-semibold text-right">Rate</th>
              <th className="py-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line text-ink-soft">
            {items.map((item: { id: string; description: string; unit: string; quantity: number; rate: number; isVatable: boolean }, idx: number) => (
              <tr key={item.id} className="hover:bg-paper-deep/50 print:hover:bg-transparent">
                <td className="py-3 font-mono">{idx + 1}.</td>
                <td className="py-3 font-bold text-ink">{item.description}</td>
                <td className="py-3 text-center font-mono">{item.quantity} {item.unit}</td>
                <td className="py-3 text-right font-mono">{item.rate.toLocaleString()}</td>
                <td className="py-3 text-right font-mono">{(item.quantity * item.rate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-line break-inside-avoid">
        <div className="space-y-4">
          {paymentTerms && (
            <div>
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-ink-faint mb-0.5">Terms & Conditions:</h5>
              <p className="text-[11px] text-ink-soft leading-normal">{paymentTerms}</p>
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-xs text-ink-soft">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold font-mono text-ink">Rs. {grossSubtotal.toLocaleString()}</span>
          </div>
          {globalDiscountPercent > 0 && (
            <div className="flex justify-between text-pine">
              <span>Discount ({globalDiscountPercent}%):</span>
              <span className="font-semibold font-mono">-Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}
          {vatAmount > 0 && (
            <div className="flex justify-between">
              <span>Estimated VAT (13%):</span>
              <span className="font-semibold font-mono text-ink">Rs. {vatAmount.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-line" />
          <div className="flex justify-between text-base font-black" style={{ color: themeColor }}>
            <span>Estimated Total:</span>
            <span className="font-mono">Rs. {totalPayable.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-16 text-center text-[10px] break-inside-avoid">
        <div className="w-40 border-t border-dashed border-line-strong pt-1.5 text-ink-faint font-bold uppercase tracking-wider">
          Prepared By
          <span className="block text-[8px] font-normal lowercase mt-0.5">({authorizedSignatory})</span>
        </div>
      </div>
    </div>
  );
}
