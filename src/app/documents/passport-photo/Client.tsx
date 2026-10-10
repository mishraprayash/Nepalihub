/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, ChangeEvent, MouseEvent, TouchEvent } from 'react';
import { Download, Upload, Move } from 'lucide-react';
import ToolShell from '@/components/ui/ToolShell';
import { Panel } from '@/components/ui/fields';

export default function PassportPhotoCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<'mrp' | 'citizenship'>('mrp');
  const [zoom, setZoom] = useState<number>(1.2);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);
  const [imgNatural, setImgNatural] = useState<{ w: number; h: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Target dimensions in px (visual container)
  const viewWidth = photoType === 'mrp' ? 280 : 250;
  const viewHeight = photoType === 'mrp' ? 360 : 300;

  // Real export scale
  const targetWidth = photoType === 'mrp' ? 350 : 250;
  const targetHeight = photoType === 'mrp' ? 450 : 300;

  const fitScale = (() => {
    if (!imgNatural) return 1;
    const scaleX = viewWidth / imgNatural.w;
    const scaleY = viewHeight / imgNatural.h;
    return Math.max(scaleX, scaleY);
  })();

  const getFitScale = () => {
    const img = imgRef.current;
    if (!img) return 1;
    const scaleX = viewWidth / img.naturalWidth;
    const scaleY = viewHeight / img.naturalHeight;
    return Math.max(scaleX, scaleY);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageSrc(event.target?.result as string);
        setZoom(1.2);
        setPanX(0);
        setPanY(0);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setStartX(e.clientX - panX);
    setStartY(e.clientY - panY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setPanX(e.clientX - startX);
    setPanY(e.clientY - startY);
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX - panX);
      setStartY(e.touches[0].clientY - panY);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPanX(e.touches[0].clientX - startX);
    setPanY(e.touches[0].clientY - startY);
  };

  const resetCrop = () => {
    setZoom(1.2);
    setPanX(0);
    setPanY(0);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    const visualToCanvasScale = targetWidth / viewWidth;
    const fs = getFitScale();
    const totalScale = zoom * fs * visualToCanvasScale;

    ctx.translate(targetWidth / 2 + panX * visualToCanvasScale, targetHeight / 2 + panY * visualToCanvasScale);
    ctx.scale(totalScale, totalScale);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `nepal-${photoType}-photo.jpg`;
    link.href = dataUrl;
    link.click();
  };

  const tabClass = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      active ? 'bg-surface-raised text-ink shadow-sm' : 'text-ink-faint hover:text-ink-soft'
    }`;

  return (
    <ToolShell
      category="Documents"
      title="Passport Photo Cropper"
      badge="Documents"
      description="Align your portrait to official Nepali government sizes — MRP passport or citizenship — and export a print-ready JPG without any upload leaving your device."
      aside={
        <>
          {imageSrc && (
            <Panel title="Controls">
              <div className="space-y-4">
                <div className="flex items-center gap-3 bg-paper-deep p-3 rounded-xl">
                  <button
                    onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}
                    className="w-7 h-7 rounded-full border border-line text-ink-faint hover:text-simrik hover:border-simrik/40 font-bold"
                    aria-label="Zoom out"
                  >
                    −
                  </button>
                  <input
                    type="range"
                    min={0.8}
                    max={3.0}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                  <button
                    onClick={() => setZoom(Math.min(3.0, zoom + 0.1))}
                    className="w-7 h-7 rounded-full border border-line text-ink-faint hover:text-simrik hover:border-simrik/40 font-bold"
                    aria-label="Zoom in"
                  >
                    +
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={resetCrop}
                    className="flex-1 py-2 rounded-xl border border-line text-xs font-semibold text-ink-soft hover:border-line-strong transition-colors"
                  >
                    Reset position
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 rounded-xl border border-line text-xs font-semibold text-ink-soft hover:border-line-strong transition-colors inline-flex items-center justify-center gap-1.5"
                  >
                    <Upload className="h-3.5 w-3.5" /> New photo
                  </button>
                </div>
                <button
                  onClick={handleDownload}
                  className="w-full py-3 rounded-xl bg-simrik hover:bg-simrik-deep text-white text-sm font-semibold inline-flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="h-4 w-4" /> Export &amp; download
                </button>
              </div>
            </Panel>
          )}

          <Panel title="Official guidelines">
            <div className="space-y-3 text-[13px] leading-relaxed text-ink-soft">
              <p><strong className="text-ink">MRP passport:</strong> 35 × 45 mm. Face should fill 70–80% of the frame, head centred.</p>
              <p><strong className="text-ink">Citizenship:</strong> 25 × 30 mm — the standard for local government cards and licences.</p>
              <p className="text-ink-faint">Plain white background, look straight at the camera, shoulders level.</p>
            </div>
          </Panel>
        </>
      }
    >
      {/* Workspace */}
      <Panel>
        {/* Size toggle */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <span className="text-[13px] font-medium text-ink-soft">Output size</span>
          <div className="inline-flex p-1 gap-1 bg-paper-deep rounded-xl border border-line">
            <button onClick={() => setPhotoType('mrp')} className={tabClass(photoType === 'mrp')}>MRP · 35×45</button>
            <button onClick={() => setPhotoType('citizenship')} className={tabClass(photoType === 'citizenship')}>Citizenship · 25×30</button>
          </div>
        </div>

        <div
          key={photoType}
          className="flex flex-col items-center justify-center min-h-[420px] border-2 border-dashed border-line-strong rounded-2xl p-6 bg-paper-deep/40"
        >
          {imageSrc ? (
            <div className="flex flex-col items-center gap-6 w-full">
              <div
                className="relative overflow-hidden border-[3px] border-simrik/70 rounded-2xl shadow-lg cursor-move bg-white select-none touch-none"
                style={{ width: `${viewWidth}px`, height: `${viewHeight}px` }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleMouseUp}
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Source photo"
                  onLoad={(e) => {
                    const img = e.currentTarget;
                    setImgNatural({ w: img.naturalWidth, h: img.naturalHeight });
                  }}
                  className="absolute pointer-events-none origin-center max-w-none"
                  style={{
                    transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom * fitScale})`,
                    top: '50%',
                    left: '50%',
                  }}
                />
                {/* Rule-of-thirds grid */}
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                </div>

                {/* Face alignment guide */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-50">
                  <svg className="w-[80%] h-[80%] text-white drop-shadow" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3">
                    <ellipse cx="50" cy="40" rx="22" ry="28" />
                    <line x1="28" y1="40" x2="72" y2="40" strokeWidth="0.8" />
                    <path d="M24 88 C24 75, 76 75, 76 88" />
                  </svg>
                </div>
              </div>

              <p className="text-xs text-ink-faint inline-flex items-center gap-1.5">
                <Move className="h-3 w-3" /> Drag to reposition · zoom with the slider
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-surface-raised border border-line flex items-center justify-center mb-4">
                <Upload className="h-6 w-6 text-ink-faint" />
              </div>
              <p className="font-display text-lg font-semibold text-ink">Upload your portrait</p>
              <p className="text-xs text-ink-faint mt-1 max-w-xs leading-relaxed">
                JPG or PNG. Everything is processed in your browser — nothing is uploaded anywhere.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-5 py-2.5 px-6 rounded-xl bg-simrik hover:bg-simrik-deep text-white text-sm font-semibold transition-colors"
              >
                Select image
              </button>
            </div>
          )}
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </Panel>
    </ToolShell>
  );
}
