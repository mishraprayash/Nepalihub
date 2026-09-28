import React from 'react';

export default function TaxInvoiceTemplate({
  themeColor, logoSrc, sellerName, sellerAddress, sellerPhone, sellerEmail, sellerPan,
  copyType, invoiceNumber, invoiceDate, buyerName, buyerAddress, buyerPhone, buyerPan,
  items, paymentTerms, bankDetails, authorizedSignatory,
  grossSubtotal, globalDiscountPercent, discountAmount, exemptAmount, taxableAmount, vatAmount, totalPayable
}: any // eslint-disable-line @typescript-eslint/no-explicit-any
) {
  return (
    <div id="printable-invoice" className="bg-surface-raised text-ink border border-line rounded-3xl p-8 sm:p-12 shadow-xl max-w-3xl mx-auto print:shadow-none print:border-0 print:p-0 print:max-w-none relative overflow-hidden">
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
          {sellerPan && (
            <div className="inline-flex flex-col border border-line rounded overflow-hidden">
              <span className="bg-paper-deep px-2 py-0.5 text-[8px] font-bold text-ink-soft uppercase tracking-widest text-center border-b font-sans">
                स्थायी लेखा नं. / PAN
              </span>
              <span className="px-3 py-0.5 text-xs font-bold font-mono tracking-widest text-ink bg-surface-raised">
                {sellerPan}
              </span>
            </div>
          )}
        </div>
        
        <div className="text-left sm:text-right space-y-2">
          <span className="text-[10px] font-black uppercase text-ink-faint font-mono tracking-wider block">
            {copyType}
          </span>
          <div className="space-y-0.5">
            <h3 className="text-lg font-black uppercase tracking-wider leading-none" style={{ color: themeColor }}>
              TAX INVOICE
            </h3>
            <span className="text-[10px] font-bold text-ink-faint block font-sans">
              कर बिजक
            </span>
          </div>
          <div className="text-[11px] text-ink-soft space-y-1">
            <p><strong>Invoice No / बिजक नं:</strong> <span className="font-semibold text-ink font-mono">{invoiceNumber}</span></p>
            <p><strong>Date / मिति:</strong> <span className="font-semibold text-ink">{invoiceDate}</span></p>
          </div>
        </div>
      </div>

      <div className="py-5 border-b border-line grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-ink-faint mb-1">Buyer (क्रेताको विवरण):</h4>
          <p className="font-bold text-sm text-ink">{buyerName}</p>
          <p className="text-[11px] text-ink-soft leading-normal">{buyerAddress}</p>
          {buyerPhone && <p className="text-[11px] text-ink-soft">Phone: {buyerPhone}</p>}
        </div>
        <div className="text-right flex flex-col items-end justify-start">
          {buyerPan && (
            <div className="inline-flex flex-col border border-line rounded overflow-hidden">
              <span className="bg-paper-deep px-2 py-0.5 text-[8px] font-bold text-ink-soft uppercase tracking-widest text-center border-b">
                क्रेताको प्यान / Buyer PAN
              </span>
              <span className="px-3 py-0.5 text-xs font-bold font-mono tracking-widest text-ink bg-surface-raised">
                {buyerPan}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="py-6 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-line text-ink-faint uppercase text-[9px] font-bold tracking-wider">
              <th className="py-3 font-semibold">क्र.सं. (S.N.)</th>
              <th className="py-3 font-semibold">विवरण (Description)</th>
              <th className="py-3 font-semibold text-center">एकाइ (Unit)</th>
              <th className="py-3 font-semibold text-center">परिमाण (Qty)</th>
              <th className="py-3 font-semibold text-right">दर (Rate)</th>
              <th className="py-3 font-semibold text-right">रकम (Amount)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-ink">
            {items.map((item: any // eslint-disable-line @typescript-eslint/no-explicit-any
, idx: number) => (
              <tr key={item.id} className="hover:bg-paper-deep/50 print:hover:bg-transparent">
                <td className="py-3 font-mono">{idx + 1}.</td>
                <td className="py-3 font-bold text-ink">
                  {item.description}
                  {!item.isVatable && (
                    <span className="ml-2 text-[8px] bg-surface text-ink-faint px-1 py-0.5 rounded font-mono font-bold">
                      EXEMPT / कर छुट
                    </span>
                  )}
                </td>
                <td className="py-3 text-center text-ink-soft">{item.unit}</td>
                <td className="py-3 text-center font-mono">{item.quantity}</td>
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
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-ink-faint mb-0.5">कैफियत / Notes:</h5>
              <p className="text-[11px] text-ink-soft leading-normal">{paymentTerms}</p>
            </div>
          )}
          {bankDetails && (
            <div>
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-ink-faint mb-0.5">भुक्तानी विवरण / Bank Info:</h5>
              <p className="text-[11px] text-ink-soft leading-normal">{bankDetails}</p>
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-xs text-ink-soft">
          <div className="flex justify-between">
            <span>कुल जम्मा (Gross Subtotal):</span>
            <span className="font-semibold font-mono text-ink">Rs. {grossSubtotal.toLocaleString()}</span>
          </div>
          {globalDiscountPercent > 0 && (
            <div className="flex justify-between text-pine">
              <span>छुट (Discount {globalDiscountPercent}%):</span>
              <span className="font-semibold font-mono">-Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>कर छुट रकम (Exempt Amount):</span>
            <span className="font-semibold font-mono text-ink">Rs. {exemptAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>करयोग्य रकम (Taxable Amount):</span>
            <span className="font-semibold font-mono text-ink">Rs. {taxableAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>१३% मू.अ.क. (13% VAT):</span>
            <span className="font-semibold font-mono text-ink">Rs. {vatAmount.toLocaleString()}</span>
          </div>
          <hr className="border-line" />
          <div className="flex justify-between text-base font-black" style={{ color: themeColor }}>
            <span>कुल जम्मा (Grand Total):</span>
            <span className="font-mono">Rs. {totalPayable.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center pt-16 text-center text-[10px] break-inside-avoid">
        <div className="w-36 border-t border-dashed border-line pt-1.5 text-ink-faint font-bold uppercase tracking-wider">
          बुझिलिनेको दस्तखत
          <span className="block text-[8px] font-normal lowercase mt-0.5">(Buyer&apos;s Signature)</span>
        </div>
        
        <div className="w-40 border-t border-dashed border-line pt-1.5 text-ink-faint font-bold uppercase tracking-wider">
          बिजक जारी गर्नेको दस्तखत
          <span className="block text-[8px] font-normal lowercase mt-0.5">({authorizedSignatory})</span>
        </div>
      </div>
    </div>
  );
}
