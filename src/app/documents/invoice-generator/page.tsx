'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { FileText, Plus, Trash2, Printer, Landmark, Upload, Palette, Settings2, FileSignature } from 'lucide-react';

interface InvoiceItem {
  id: string;
  description: string;
  unit: string; 
  quantity: number;
  rate: number;
  isVatable: boolean;
}

export default function InvoiceGenerator() {
  // Brand & Config
  const [invoiceType, setInvoiceType] = useState<'Tax Invoice' | 'Receipt' | 'Estimate'>('Tax Invoice');
  const [themeColor, setThemeColor] = useState<string>('#be123c'); // Crimson Red default
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>('NPR');
  const [copyType, setCopyType] = useState<'Original (Buyer Copy)' | 'Duplicate (Seller Copy)'>('Original (Buyer Copy)');

  // Seller Details
  const [sellerName, setSellerName] = useState('New Nepal Traders');
  const [sellerAddress, setSellerAddress] = useState('New Road, Kathmandu, Nepal');
  const [sellerPhone, setSellerPhone] = useState('+977-1-4224400');
  const [sellerEmail, setSellerEmail] = useState('info@nepaltraders.com.np');
  const [sellerPan, setSellerPan] = useState('601234567');
  
  // Buyer Details
  const [buyerName, setBuyerName] = useState('Walk-in Customer');
  const [buyerAddress, setBuyerAddress] = useState('Kathmandu, Nepal');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerPan, setBuyerPan] = useState('');

  // Metadata
  const [invoiceNumber, setInvoiceNumber] = useState('INV-2083-0402');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  // Items List
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Basmati Rice (Exempt)', unit: 'Bag', quantity: 5, rate: 2200, isVatable: false },
    { id: '2', description: 'Refined Sunflower Oil (Taxable)', unit: 'Box', quantity: 2, rate: 3100, isVatable: true }
  ]);

  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('Pcs');
  const [newQty, setNewQty] = useState(1);
  const [newRate, setNewRate] = useState(0);
  const [newVatable, setNewVatable] = useState(true);

  // Bottom Fields
  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState('Goods once sold cannot be returned.');
  const [bankDetails, setBankDetails] = useState('Rastriya Banijya Bank • A/C: 109010010202');
  const [authorizedSignatory, setAuthorizedSignatory] = useState('Authorized Officer');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoSrc(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (!newDesc.trim() || newRate <= 0) return;
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: newDesc,
      unit: newUnit,
      quantity: newQty,
      rate: newRate,
      isVatable: newVatable
    };
    setItems([...items, newItem]);
    setNewDesc('');
    setNewUnit('Pcs');
    setNewQty(1);
    setNewRate(0);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Advanced Calculation logic complying with Nepal IRD
  const grossSubtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountAmount = grossSubtotal * (globalDiscountPercent / 100);
  const netSubtotal = grossSubtotal - discountAmount;

  // Split calculations
  const discountMultiplier = 1 - (globalDiscountPercent / 100);
  const taxableAmount = items
    .filter(item => item.isVatable)
    .reduce((acc, item) => acc + (item.quantity * item.rate * discountMultiplier), 0);

  const exemptAmount = items
    .filter(item => !item.isVatable)
    .reduce((acc, item) => acc + (item.quantity * item.rate * discountMultiplier), 0);
  
  const vatAmount = taxableAmount * 0.13; // Standard 13% VAT in Nepal
  const totalPayable = netSubtotal + vatAmount;

  const handlePrint = () => {
    window.print();
  };

  const colorThemes = [
    { name: 'Crimson Red', value: '#be123c' },
    { name: 'Royal Blue', value: '#2563eb' },
    { name: 'Forest Green', value: '#15803d' },
    { name: 'Charcoal Black', value: '#1e293b' },
    { name: 'Teal Elegance', value: '#0f766e' }
  ];

  const inputClass = "w-full py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500";
  const selectClass = "w-full py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="space-y-12 print:p-0 print:m-0 max-w-7xl mx-auto">
      {/* Header (Hidden in print) */}
      <div className="print:hidden">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Official Nepal Tax Invoice Generator
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Generate IRD-compliant Tax Invoices (कर बिजक) under Nepal VAT Rules, 2053 (Schedule 5) with proper dual-language titles, VAT separation, and signature slots.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        {/* Editor Panel (Hidden in print) */}
        <div className="lg:col-span-5 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm print:hidden">
          
          {/* Section: Design & Brand */}
          <div className="space-y-4">
            <h2 className="text-base font-extrabold flex items-center gap-2 text-gray-900 dark:text-white border-b pb-2">
              <Palette className="h-4 w-4 text-blue-500" />
              1. Brand & Template Config
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Invoice Type</label>
                <select
                  value={invoiceType}
                  onChange={(e) => setInvoiceType(e.target.value as any)}
                  className={selectClass}
                >
                  <option value="Tax Invoice">Tax Invoice (कर बिजक)</option>
                  <option value="Receipt">Sales Receipt (रसिद)</option>
                  <option value="Estimate">Estimate / Quote (अनुमान)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Copy Indicator</label>
                <select
                  value={copyType}
                  onChange={(e) => setCopyType(e.target.value as any)}
                  className={selectClass}
                >
                  <option value="Original (Buyer Copy)">Original (Buyer Copy)</option>
                  <option value="Duplicate (Seller Copy)">Duplicate (Seller Copy)</option>
                </select>
              </div>
            </div>

            {/* Theme Colors */}
            <div>
              <label className="text-xs text-gray-500 block mb-1.5">Theme Color</label>
              <div className="flex gap-2">
                {colorThemes.map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setThemeColor(theme.value)}
                    className="w-6 h-6 rounded-full border border-white dark:border-gray-900 shadow-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: theme.value }}
                    title={theme.name}
                  />
                ))}
              </div>
            </div>

            {/* Logo Upload */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">Upload Brand Logo</label>
              <div className="flex gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="py-1.5 px-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 text-xs font-semibold text-gray-600 dark:text-gray-250 flex items-center gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" /> Upload File
                </button>
                {logoSrc && (
                  <button
                    onClick={() => setLogoSrc(null)}
                    className="py-1.5 px-3 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 text-xs font-semibold"
                  >
                    Remove Logo
                  </button>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          {/* Section: Issuer & Customer */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-base font-extrabold flex items-center gap-2 text-gray-900 dark:text-white border-b pb-2">
              <Settings2 className="h-4 w-4 text-blue-500" />
              2. Seller & Buyer Details
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">From (Seller)</span>
                <input
                  type="text"
                  placeholder="Seller Company Name"
                  value={sellerName}
                  onChange={(e) => setSellerName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Seller PAN/VAT No (9 digits)"
                  value={sellerPan}
                  onChange={(e) => setSellerPan(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={sellerAddress}
                  onChange={(e) => setSellerAddress(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={sellerPhone}
                  onChange={(e) => setSellerPhone(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Email"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">To (Buyer)</span>
                <input
                  type="text"
                  placeholder="Buyer Name"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Buyer PAN No"
                  value={buyerPan}
                  onChange={(e) => setBuyerPan(e.target.value)}
                  className={`${inputClass} font-mono`}
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={buyerAddress}
                  onChange={(e) => setBuyerAddress(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="text"
                  placeholder="Phone"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section: Items Table config */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-base font-extrabold flex items-center gap-2 text-gray-900 dark:text-white border-b pb-2">
              <Plus className="h-4 w-4 text-blue-500" />
              3. Items & Pricing
            </h2>
            
            {/* Added Items List */}
            {items.length > 0 && (
              <div className="space-y-2 mb-4 max-h-[180px] overflow-y-auto pr-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Current Items</span>
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-900 rounded-lg text-xs border border-gray-150 dark:border-gray-800">
                    <div className="flex-1 min-w-0 pr-2">
                      <p className="font-semibold text-gray-900 dark:text-white truncate">{item.description}</p>
                      <p className="text-[10px] text-gray-400 font-medium">
                        {item.quantity} {item.unit} @ Rs. {item.rate.toLocaleString()} ({item.isVatable ? '13% VAT' : 'Exempt'})
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-all"
                      title="Remove Item"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Item description / विवरण"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className={inputClass}
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Unit (e.g. Bag, Pcs)"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newQty || ''}
                  onChange={(e) => setNewQty(Number(e.target.value))}
                  className={inputClass}
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={newRate || ''}
                  onChange={(e) => setNewRate(Number(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <label className="text-gray-500 font-semibold">Subject to 13% VAT (करयोग्य)</label>
                <input
                  type="checkbox"
                  checked={newVatable}
                  onChange={(e) => setNewVatable(e.target.checked)}
                  className="h-4 w-4 accent-blue-600 rounded"
                />
              </div>
              <button
                onClick={addItem}
                className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Add Item
              </button>
            </div>
          </div>

          {/* Section: Payment Terms & Footers */}
          <div className="space-y-4 pt-4 border-t">
            <h2 className="text-base font-extrabold flex items-center gap-2 text-gray-900 dark:text-white border-b pb-2">
              <FileSignature className="h-4 w-4 text-blue-500" />
              4. Invoice Details & Terms
            </h2>
            <div className="space-y-2.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1">Invoice Number</label>
                  <input
                    type="text"
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Global Discount (%)</label>
                  <input
                    type="number"
                    value={globalDiscountPercent || ''}
                    onChange={(e) => setGlobalDiscountPercent(Number(e.target.value))}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-500 block mb-1">Invoice Date</label>
                  <input
                    type="date"
                    value={invoiceDate}
                    onChange={(e) => setInvoiceDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-gray-500 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Bank Payment Info</label>
                <input
                  type="text"
                  value={bankDetails}
                  onChange={(e) => setBankDetails(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Terms / Notes</label>
                <input
                  type="text"
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Authorized Signatory Label</label>
                <input
                  type="text"
                  value={authorizedSignatory}
                  onChange={(e) => setAuthorizedSignatory(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Live Preview sheet (Renders matching selected theme colors) */}
        <div className="lg:col-span-7 space-y-6 print:w-full print:p-0 print:m-0">
          <div className="flex justify-end gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="py-2 px-6 rounded-xl border hover:bg-gray-50 text-gray-700 text-sm font-bold flex items-center gap-1.5 shadow-sm bg-white border-gray-200 transition-all"
            >
              <Printer className="h-4 w-4" /> Print / Save PDF
            </button>
          </div>

          {/* Page Preview Sheet */}
          <div className="bg-white text-gray-900 border border-gray-300 rounded-3xl p-8 sm:p-12 shadow-xl max-w-3xl mx-auto print:shadow-none print:border-0 print:p-0 print:max-w-none relative overflow-hidden">
            
            {/* Color Accent line */}
            <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: themeColor }} />

            {/* Header Block */}
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
                {sellerPan && (
                  <div className="inline-flex flex-col border border-gray-300 rounded overflow-hidden">
                    <span className="bg-gray-50 px-2 py-0.5 text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center border-b font-sans">
                      स्थायी लेखा नं. / PAN
                    </span>
                    <span className="px-3 py-0.5 text-xs font-bold font-mono tracking-widest text-gray-800 bg-white">
                      {sellerPan}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-left sm:text-right space-y-2">
                <span className="text-[10px] font-black uppercase text-gray-400 font-mono tracking-wider block">
                  {copyType}
                </span>
                <div className="space-y-0.5">
                  <h3 className="text-lg font-black uppercase tracking-wider leading-none" style={{ color: themeColor }}>
                    {invoiceType === 'Tax Invoice' ? 'TAX INVOICE' : invoiceType === 'Receipt' ? 'SALES RECEIPT' : 'ESTIMATE'}
                  </h3>
                  <span className="text-[10px] font-bold text-gray-400 block font-sans">
                    {invoiceType === 'Tax Invoice' ? 'कर बिजक' : invoiceType === 'Receipt' ? 'रसिद' : 'अनुमान पत्र'}
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 space-y-1">
                  <p><strong>Invoice No / बिजक नं:</strong> <span className="font-semibold text-gray-800 font-mono">{invoiceNumber}</span></p>
                  <p><strong>Date / मिति:</strong> <span className="font-semibold text-gray-800">{invoiceDate}</span></p>
                </div>
              </div>
            </div>

            {/* Bill To / Buyer */}
            <div className="py-5 border-b border-gray-100 grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-1">Buyer (क्रेताको विवरण):</h4>
                <p className="font-bold text-sm text-gray-900">{buyerName}</p>
                <p className="text-[11px] text-gray-500 leading-normal">{buyerAddress}</p>
                {buyerPhone && <p className="text-[11px] text-gray-500">Phone: {buyerPhone}</p>}
              </div>
              <div className="text-right flex flex-col items-end justify-start">
                {buyerPan && (
                  <div className="inline-flex flex-col border border-gray-300 rounded overflow-hidden">
                    <span className="bg-gray-50 px-2 py-0.5 text-[8px] font-bold text-gray-500 uppercase tracking-widest text-center border-b">
                      क्रेताको प्यान / Buyer PAN
                    </span>
                    <span className="px-3 py-0.5 text-xs font-bold font-mono tracking-widest text-gray-800 bg-white">
                      {buyerPan}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div className="py-6 overflow-x-auto">
              <table className="min-w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 uppercase text-[9px] font-bold tracking-wider">
                    <th className="py-3 font-semibold">क्र.सं. (S.N.)</th>
                    <th className="py-3 font-semibold">विवरण (Description)</th>
                    <th className="py-3 font-semibold text-center">एकाइ (Unit)</th>
                    <th className="py-3 font-semibold text-center">परिमाण (Qty)</th>
                    <th className="py-3 font-semibold text-right">दर (Rate)</th>
                    <th className="py-3 font-semibold text-right">रकम (Amount)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {items.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-gray-50/50 print:hover:bg-transparent">
                      <td className="py-3 font-mono">{idx + 1}.</td>
                      <td className="py-3 font-bold text-gray-900">
                        {item.description}
                        {!item.isVatable && (
                          <span className="ml-2 text-[8px] bg-gray-100 text-gray-400 px-1 py-0.5 rounded font-mono font-bold">
                            EXEMPT / कर छुट
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-center text-gray-500">{item.unit}</td>
                      <td className="py-3 text-center font-mono">{item.quantity}</td>
                      <td className="py-3 text-right font-mono">{item.rate.toLocaleString()}</td>
                      <td className="py-3 text-right font-mono">{(item.quantity * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculations & Footer Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200 break-inside-avoid">
              <div className="space-y-4">
                {paymentTerms && (
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">कैफियत / Notes:</h5>
                    <p className="text-[11px] text-gray-600 leading-normal">{paymentTerms}</p>
                  </div>
                )}
                {bankDetails && (
                  <div>
                    <h5 className="text-[9px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">भुक्तानी विवरण / Bank Info:</h5>
                    <p className="text-[11px] text-gray-600 leading-normal">{bankDetails}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>कुल जम्मा (Gross Subtotal):</span>
                  <span className="font-semibold font-mono text-gray-800">Rs. {grossSubtotal.toLocaleString()}</span>
                </div>
                {globalDiscountPercent > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>छुट (Discount {globalDiscountPercent}%):</span>
                    <span className="font-semibold font-mono">-Rs. {discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>कर छुट रकम (Exempt Amount):</span>
                  <span className="font-semibold font-mono text-gray-800">Rs. {exemptAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>करयोग्य रकम (Taxable Amount):</span>
                  <span className="font-semibold font-mono text-gray-800">Rs. {taxableAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>१३% मू.अ.क. (13% VAT):</span>
                  <span className="font-semibold font-mono text-gray-800">Rs. {vatAmount.toLocaleString()}</span>
                </div>
                <hr className="border-gray-200" />
                <div className="flex justify-between text-base font-black" style={{ color: themeColor }}>
                  <span>कुल जम्मा (Grand Total):</span>
                  <span className="font-mono">Rs. {totalPayable.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Signature Area (Mandatory Dual Signatures for Nepal) */}
            <div className="flex justify-between items-center pt-16 text-center text-[10px] break-inside-avoid">
              <div className="w-36 border-t border-dashed border-gray-300 pt-1.5 text-gray-400 font-bold uppercase tracking-wider">
                बुझिलिनेको दस्तखत
                <span className="block text-[8px] font-normal lowercase mt-0.5">(Buyer's Signature)</span>
              </div>
              
              <div className="w-40 border-t border-dashed border-gray-300 pt-1.5 text-gray-400 font-bold uppercase tracking-wider">
                बिजक जारी गर्नेको दस्तखत
                <span className="block text-[8px] font-normal lowercase mt-0.5">({authorizedSignatory})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
