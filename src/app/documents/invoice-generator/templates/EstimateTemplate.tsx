import React from 'react';

export default function EstimateTemplate({
  themeColor, logoSrc, sellerName, sellerAddress, sellerPhone, sellerEmail,
  invoiceNumber, invoiceDate, dueDate, buyerName, buyerAddress, buyerPhone,
  items, paymentTerms, authorizedSignatory,
  grossSubtotal, globalDiscountPercent, discountAmount, vatAmount, totalPayable
}: any) {
  return (
    <div id="printable-invoice" className="bg-white text-gray-900 border border-gray-300 rounded-3xl p-8 sm:p-12 shadow-xl max-w-3xl mx-auto print:shadow-none print:border-0 print:p-0 print:max-w-none relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: themeColor }} />

      <div className="flex flex-col sm:flex-row justify-between items-start border-b border-gray-100 pb-6 gap-6 pt-2">
        <div className="space-y-3">
          {logoSrc ? (
            <img src={logoSrc} alt="Brand Logo" className="max-h-[55px] object-contain" />
          ) : (
            <h2 className="text-xl font-black tracking-tight" style={{ color: themeColor }}>
              {sellerName}
            </h2>
          )}
          <div className="text-[11px] text-gray-500 leading-normal">
            <p className="font-semibold text-gray-700">{sellerAddress}</p>
            {sellerPhone && <p>Phone: {sellerPhone}</p>}
            {sellerEmail && <p>Email: {sellerEmail}</p>}
          </div>
        </div>
        
        <div className="text-left sm:text-right space-y-2">
          <div className="space-y-0.5">
            <h3 className="text-lg font-black uppercase tracking-wider leading-none" style={{ color: themeColor }}>
              ESTIMATE / QUOTATION
            </h3>
            <span className="text-[10px] font-bold text-gray-400 block font-sans">
              अनुमान पत्र
            </span>
          </div>
          <div className="text-[11px] text-gray-500 space-y-1">
            <p><strong>Estimate No:</strong> <span className="font-semibold text-gray-800 font-mono">{invoiceNumber}</span></p>
            <p><strong>Date:</strong> <span className="font-semibold text-gray-800">{invoiceDate}</span></p>
            {dueDate && <p><strong>Valid Until:</strong> <span className="font-semibold text-gray-800">{dueDate}</span></p>}
          </div>
        </div>
      </div>

      <div className="py-5 border-b border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Prepared For:</h4>
          <p className="font-bold text-sm text-gray-900">{buyerName}</p>
          <p className="text-[11px] text-gray-500 leading-normal">{buyerAddress}</p>
          {buyerPhone && <p className="text-[11px] text-gray-500">Phone: {buyerPhone}</p>}
        </div>
      </div>

      <div className="py-6 overflow-x-auto">
        <table className="min-w-full text-left text-xs">
          <thead>
            <tr className="border-b border-gray-200 text-gray-400 uppercase text-[9px] font-bold tracking-wider">
              <th className="py-3 font-semibold">S.N.</th>
              <th className="py-3 font-semibold">Description</th>
              <th className="py-3 font-semibold text-center">Qty</th>
              <th className="py-3 font-semibold text-right">Rate</th>
              <th className="py-3 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {items.map((item: any, idx: number) => (
              <tr key={item.id} className="hover:bg-gray-50/50 print:hover:bg-transparent">
                <td className="py-3 font-mono">{idx + 1}.</td>
                <td className="py-3 font-bold text-gray-900">{item.description}</td>
                <td className="py-3 text-center font-mono">{item.quantity} {item.unit}</td>
                <td className="py-3 text-right font-mono">{item.rate.toLocaleString()}</td>
                <td className="py-3 text-right font-mono">{(item.quantity * item.rate).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 break-inside-avoid">
        <div className="space-y-4">
          {paymentTerms && (
            <div>
              <h5 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">Terms & Conditions:</h5>
              <p className="text-[11px] text-gray-600 leading-normal">{paymentTerms}</p>
            </div>
          )}
        </div>

        <div className="space-y-2.5 text-xs text-gray-500">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold font-mono text-gray-800">Rs. {grossSubtotal.toLocaleString()}</span>
          </div>
          {globalDiscountPercent > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({globalDiscountPercent}%):</span>
              <span className="font-semibold font-mono">-Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}
          {vatAmount > 0 && (
            <div className="flex justify-between">
              <span>Estimated VAT (13%):</span>
              <span className="font-semibold font-mono text-gray-800">Rs. {vatAmount.toLocaleString()}</span>
            </div>
          )}
          <hr className="border-gray-200" />
          <div className="flex justify-between text-base font-black" style={{ color: themeColor }}>
            <span>Estimated Total:</span>
            <span className="font-mono">Rs. {totalPayable.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-16 text-center text-[10px] break-inside-avoid">
        <div className="w-40 border-t border-dashed border-gray-300 pt-1.5 text-gray-400 font-bold uppercase tracking-wider">
          Prepared By
          <span className="block text-[8px] font-normal lowercase mt-0.5">({authorizedSignatory})</span>
        </div>
      </div>
    </div>
  );
}
