'use client';

import { useState, useRef, ChangeEvent } from 'react';
import Link from 'next/link';
import { Plus, Trash2, Printer, Upload } from 'lucide-react';
import TaxInvoiceTemplate from './templates/TaxInvoiceTemplate';
import ReceiptTemplate from './templates/ReceiptTemplate';
import EstimateTemplate from './templates/EstimateTemplate';
import { Panel } from '@/components/ui/fields';

interface InvoiceItem {
  id: string;
  description: string;
  unit: string;
  quantity: number;
  rate: number;
  isVatable: boolean;
}

type InvoiceType = 'Tax Invoice' | 'Receipt' | 'Estimate';
type CopyType = 'Original (Buyer Copy)' | 'Duplicate (Seller Copy)';

function SectionTitle({ n, title }: { n: number; title: string }) {
  return (
    <h2 className="font-display text-base font-semibold text-ink flex items-baseline gap-2">
      <span className="font-mono text-[11px] text-simrik">0{n}</span>
      {title}
    </h2>
  );
}

export default function InvoiceGenerator() {
  const [invoiceType, setInvoiceType] = useState<InvoiceType>('Tax Invoice');
  const [themeColor, setThemeColor] = useState<string>('#b91c2e');
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [copyType, setCopyType] = useState<CopyType>('Original (Buyer Copy)');

  const [sellerName, setSellerName] = useState('New Nepal Traders');
  const [sellerAddress, setSellerAddress] = useState('New Road, Kathmandu, Nepal');
  const [sellerPhone, setSellerPhone] = useState('+977-1-4224400');
  const [sellerEmail, setSellerEmail] = useState('info@nepaltraders.com.np');
  const [sellerPan, setSellerPan] = useState('601234567');

  const [buyerName, setBuyerName] = useState('Walk-in Customer');
  const [buyerAddress, setBuyerAddress] = useState('Kathmandu, Nepal');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerPan, setBuyerPan] = useState('');

  const [invoiceNumber, setInvoiceNumber] = useState('INV-2083-0402');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'Basmati Rice (Exempt)', unit: 'Bag', quantity: 5, rate: 2200, isVatable: false },
    { id: '2', description: 'Refined Sunflower Oil (Taxable)', unit: 'Box', quantity: 2, rate: 3100, isVatable: true }
  ]);

  const [newDesc, setNewDesc] = useState('');
  const [newUnit, setNewUnit] = useState('Pcs');
  const [newQty, setNewQty] = useState(1);
  const [newRate, setNewRate] = useState(0);
  const [newVatable, setNewVatable] = useState(true);

  const [globalDiscountPercent, setGlobalDiscountPercent] = useState<number>(0);
  const [paymentTerms, setPaymentTerms] = useState('Goods once sold cannot be returned.');
  const [bankDetails, setBankDetails] = useState('Rastriya Banijya Bank • A/C: 109010010202');
  const [authorizedSignatory, setAuthorizedSignatory] = useState('Authorized Officer');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setLogoSrc(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const addItem = () => {
    if (!newDesc.trim() || newRate <= 0) return;
    setItems([...items, {
      id: Date.now().toString(),
      description: newDesc,
      unit: newUnit,
      quantity: newQty,
      rate: newRate,
      isVatable: newVatable
    }]);
    setNewDesc('');
    setNewUnit('Pcs');
    setNewQty(1);
    setNewRate(0);
  };

  const removeItem = (id: string) => setItems(items.filter(item => item.id !== id));

  const grossSubtotal = items.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
  const discountAmount = grossSubtotal * (globalDiscountPercent / 100);
  const netSubtotal = grossSubtotal - discountAmount;

  const discountMultiplier = 1 - (globalDiscountPercent / 100);
  const taxableAmount = items
    .filter(item => item.isVatable)
    .reduce((acc, item) => acc + (item.quantity * item.rate * discountMultiplier), 0);

  const exemptAmount = items
    .filter(item => !item.isVatable)
    .reduce((acc, item) => acc + (item.quantity * item.rate * discountMultiplier), 0);

  const vatAmount = taxableAmount * 0.13;
  const totalPayable = netSubtotal + vatAmount;

  const handlePrint = () => window.print();

  const colorThemes = [
    { name: 'Simrik Red', value: '#b91c2e' },
    { name: 'Royal Blue', value: '#2563eb' },
    { name: 'Forest Green', value: '#15803d' },
    { name: 'Charcoal', value: '#1e293b' },
    { name: 'Teal', value: '#0f766e' }
  ];

  const inputClass = "w-full py-1.5 px-3 rounded-lg border border-line bg-surface-raised text-ink text-xs font-semibold placeholder:text-ink-faint focus-visible:outline-none focus-visible:border-simrik/60 transition-colors";
  const selectClass = "w-full py-1.5 px-3 rounded-lg border border-line bg-surface-raised text-ink text-xs font-semibold focus-visible:outline-none focus-visible:border-simrik/60 transition-colors";

  const templateProps = {
    themeColor, logoSrc, sellerName, sellerAddress, sellerPhone, sellerEmail, sellerPan,
    copyType, invoiceNumber, invoiceDate, dueDate, buyerName, buyerAddress, buyerPhone, buyerPan,
    items, paymentTerms, bankDetails, authorizedSignatory,
    grossSubtotal, globalDiscountPercent, discountAmount, netSubtotal, exemptAmount, taxableAmount, vatAmount, totalPayable
  };

  return (
    <div className="max-w-6xl mx-auto">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #printable-invoice, #printable-invoice * { visibility: visible; }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            padding: 15mm !important;
            margin: 0 !important;
            box-sizing: border-box;
          }
          @page { size: A4 portrait; margin: 0; }
        }
      `}</style>

      {/* Breadcrumb + header (hidden in print) */}
      <div className="print:hidden">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-xs text-ink-faint mb-6">
          <Link href="/" className="hover:text-simrik transition-colors">Home</Link>
          <span>›</span>
          <Link href="/" className="hover:text-simrik transition-colors">Documents</Link>
          <span>›</span>
          <span className="text-ink-soft font-medium">Invoice Generator</span>
        </nav>        <header className="mb-8 pb-8 border-b border-line">
          <p className="text-[11px] font-bold uppercase tracking-widest text-simrik mb-3">Documents</p>
          <h1 className="font-display text-3xl md:text-[2.75rem] leading-[1.1] font-semibold tracking-tight text-ink max-w-2xl">
            Invoice &amp; Receipt Generator
          </h1>
          <p className="mt-3 text-sm md:text-[15px] leading-relaxed text-ink-soft max-w-xl">
            IRD-compliant tax invoices (कर बिजक), receipts and estimates under Nepal VAT rules — edit on the left, print or save as PDF.
          </p>
        </header>

        {/* Editor + preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start pb-16">
          {/* Editor */}
          <div className="lg:col-span-5 space-y-6">
            <Panel>
              <div className="space-y-4">
                <SectionTitle n={1} title="Template" />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink-soft block">Type</label>
                    <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value as InvoiceType)} className={selectClass}>
                      <option value="Tax Invoice">Tax Invoice</option>
                      <option value="Receipt">Sales Receipt</option>
                      <option value="Estimate">Estimate / Quote</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-ink-soft block">Copy</label>
                    <select value={copyType} onChange={(e) => setCopyType(e.target.value as CopyType)} className={selectClass}>
                      <option value="Original (Buyer Copy)">Original (Buyer)</option>
                      <option value="Duplicate (Seller Copy)">Duplicate (Seller)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-soft block">Theme colour</label>
                  <div className="flex gap-2">
                    {colorThemes.map((theme) => (
                      <button
                        key={theme.value}
                        onClick={() => setThemeColor(theme.value)}
                        className={`w-6 h-6 rounded-full shadow-sm transition-transform hover:scale-110 ${themeColor === theme.value ? 'ring-2 ring-offset-2 ring-line-strong ring-offset-surface' : ''}`}
                        style={{ backgroundColor: theme.value }}
                        title={theme.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-ink-soft block">Brand logo</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="py-1.5 px-3 rounded-lg border border-line hover:border-line-strong text-xs font-semibold text-ink-soft inline-flex items-center gap-1.5 transition-colors"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload
                    </button>
                    {logoSrc && (
                      <button
                        onClick={() => setLogoSrc(null)}
                        className="py-1.5 px-3 rounded-lg border border-simrik/30 text-simrik hover:bg-simrik/[0.06] text-xs font-semibold transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleLogoUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </Panel>

            <Panel>
              <SectionTitle n={2} title="Seller & buyer" />
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-ink-faint uppercase tracking-widest block">From</span>
                  <input type="text" placeholder="Company name" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="PAN/VAT no." value={sellerPan} onChange={(e) => setSellerPan(e.target.value)} className={`${inputClass} font-mono`} />
                  <input type="text" placeholder="Address" value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="Phone" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="Email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-ink-faint uppercase tracking-widest block">To</span>
                  <input type="text" placeholder="Buyer name" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="Buyer PAN" value={buyerPan} onChange={(e) => setBuyerPan(e.target.value)} className={`${inputClass} font-mono`} />
                  <input type="text" placeholder="Address" value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className={inputClass} />
                  <input type="text" placeholder="Phone" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} className={inputClass} />
                </div>
              </div>
            </Panel>

            <Panel>
              <SectionTitle n={3} title="Items & pricing" />
              {items.length > 0 && (
                <div className="space-y-2 my-4 max-h-44 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-2.5 bg-paper-deep/50 border border-line rounded-lg text-xs">
                      <div className="flex-1 min-w-0 pr-2">
                        <p className="font-semibold text-ink truncate">{item.description}</p>
                        <p className="text-[10px] text-ink-faint">
                          {item.quantity} {item.unit} @ Rs. {item.rate.toLocaleString()} · {item.isVatable ? '13% VAT' : 'Exempt'}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 text-ink-faint hover:text-simrik rounded transition-colors"
                        title="Remove item"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2.5">
                <input type="text" placeholder="Item description / विवरण" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className={inputClass} />
                <div className="grid grid-cols-3 gap-2">
                  <input type="text" placeholder="Unit" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} className={inputClass} />
                  <input type="number" placeholder="Qty" value={newQty || ''} onChange={(e) => setNewQty(Number(e.target.value))} className={inputClass} />
                  <input type="number" placeholder="Rate" value={newRate || ''} onChange={(e) => setNewRate(Number(e.target.value))} className={inputClass} />
                </div>
                <div className="flex items-center justify-between text-xs py-1">
                  <label className="text-ink-soft font-medium">Subject to 13% VAT</label>
                  <input type="checkbox" checked={newVatable} onChange={(e) => setNewVatable(e.target.checked)} className="h-4 w-4 accent-[#b91c2e] rounded" />
                </div>
                <button
                  onClick={addItem}
                  className="w-full py-2 rounded-xl bg-simrik hover:bg-simrik-deep text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add item
                </button>
              </div>
            </Panel>

            <Panel>
              <SectionTitle n={4} title="Details & terms" />
              <div className="space-y-3 mt-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft block">
                      {invoiceType === 'Estimate' ? 'Estimate No.' : invoiceType === 'Receipt' ? 'Receipt No.' : 'Invoice No.'}
                    </label>
                    <input type="text" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-ink-soft block">Global discount %</label>
                    <input type="number" value={globalDiscountPercent || ''} onChange={(e) => setGlobalDiscountPercent(Number(e.target.value))} className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-ink-soft block">Date</label>
                    <input type="date" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} className={inputClass} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-ink-soft block">{invoiceType === 'Estimate' ? 'Valid until' : 'Due date'}</label>
                    <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className={inputClass} />
                  </div>
                </div>
                {invoiceType !== 'Estimate' && (
                  <div className="space-y-1">
                    <label className="text-ink-soft block">Bank payment info</label>
                    <input type="text" value={bankDetails} onChange={(e) => setBankDetails(e.target.value)} className={inputClass} />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-ink-soft block">Terms / notes</label>
                  <input type="text" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className={inputClass} />
                </div>
                <div className="space-y-1">
                  <label className="text-ink-soft block">Signatory label</label>
                  <input type="text" value={authorizedSignatory} onChange={(e) => setAuthorizedSignatory(e.target.value)} className={inputClass} />
                </div>
              </div>
            </Panel>
          </div>

          {/* Preview */}
          <div className="lg:col-span-7 space-y-4 lg:sticky lg:top-24">
            <button
              onClick={handlePrint}
              className="ml-auto py-2 px-5 rounded-xl border border-line bg-surface hover:border-line-strong text-ink text-sm font-semibold inline-flex items-center gap-2 transition-colors"
            >
              <Printer className="h-4 w-4" /> Print / save PDF
            </button>

            {invoiceType === 'Tax Invoice' && <TaxInvoiceTemplate {...templateProps} />}
            {invoiceType === 'Receipt' && <ReceiptTemplate {...templateProps} />}
            {invoiceType === 'Estimate' && <EstimateTemplate {...templateProps} />}
          </div>
        </div>
      </div>
    </div>
  );
}
