'use client';

import { useState, useRef, ChangeEvent, MouseEvent, TouchEvent, useEffect } from 'react';
import { Camera, Download, Upload, Info, ZoomIn, Move } from 'lucide-react';

export default function PassportPhotoCropper() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<'mrp' | 'citizenship'>('mrp');
  const [zoom, setZoom] = useState<number>(1.2);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Target Dimensions in px (for visual container)
  const viewWidth = photoType === 'mrp' ? 280 : 250;
  const viewHeight = photoType === 'mrp' ? 360 : 300;

  // Real MRP/Citizenship scale
  const targetWidth = photoType === 'mrp' ? 350 : 250;
  const targetHeight = photoType === 'mrp' ? 450 : 300;

  // Calculate default baseline scale to cover the crop area
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

  // Dragging Handlers (Mouse)
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Dragging Handlers (Touch)
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

  // Trigger download by rendering the current visual state to hidden canvas
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Fill background with white (standard for passport photos)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Calculate scaling multiplier between visual box and canvas export size
    const visualToCanvasScale = targetWidth / viewWidth;
    const fitScale = getFitScale();
    const totalScale = zoom * fitScale * visualToCanvasScale;

    // Translate to center of canvas
    ctx.translate(targetWidth / 2 + panX * visualToCanvasScale, targetHeight / 2 + panY * visualToCanvasScale);
    // Apply zoom & scale
    ctx.scale(totalScale, totalScale);
    // Draw image centered
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

    // Trigger Browser Download
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    const link = document.createElement('a');
    link.download = `nepal-${photoType}-photo.jpg`;
    link.href = dataUrl;
    link.click();
  };

  // Reset offset when changing dimensions
  useEffect(() => {
    setPanX(0);
    setPanY(0);
  }, [photoType]);

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
          Passport & Citizenship Photo Cropper
        </h1>
        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
          Upload your photo, drag to adjust position, and use the zoom slider to align your face perfectly to official Nepalese government guidelines.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workspace */}
        <div className="lg:col-span-2 space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
              <Camera className="h-5 w-5 text-blue-500" />
              Interactive Crop Workspace
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => setPhotoType('mrp')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${photoType === 'mrp' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                MRP (35x45mm)
              </button>
              <button
                onClick={() => setPhotoType('citizenship')}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold ${photoType === 'citizenship' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
              >
                Citizenship (25x30mm)
              </button>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 bg-gray-50 dark:bg-gray-900/50">
            {imageSrc ? (
              <div className="flex flex-col items-center gap-6 w-full">
                {/* Crop Box Wrapper */}
                <div
                  className="relative overflow-hidden border-4 border-blue-500 rounded-2xl shadow-2xl cursor-move bg-white select-none touch-none"
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
                    alt="Upload Source"
                    className="absolute pointer-events-none origin-center max-w-none"
                    style={{
                      transform: `translate(calc(-50% + ${panX}px), calc(-50% + ${panY}px)) scale(${zoom * getFitScale()})`,
                      top: '50%',
                      left: '50%',
                    }}
                  />
                  {/* Grid Overlay */}
                  <div className="absolute inset-0 pointer-events-none border border-white/20 grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-r border-b border-white/10" />
                    <div className="border-b border-white/10" />
                  </div>

                  {/* Face Silhouette Alignment Guide */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-45 dark:opacity-60">
                    <svg className="w-[80%] h-[80%] text-blue-500 dark:text-blue-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="3 3">
                      {/* Head oval */}
                      <ellipse cx="50" cy="40" rx="22" ry="28" />
                      {/* Eye level line */}
                      <line x1="28" y1="40" x2="72" y2="40" strokeWidth="0.8" />
                      {/* Shoulders */}
                      <path d="M24 88 C24 75, 76 75, 76 88" />
                    </svg>
                  </div>
                </div>

                {/* Controls */}
                <div className="w-full max-w-sm space-y-4">
                  <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 p-3 rounded-xl">
                    <button
                      onClick={() => setZoom(Math.max(0.8, zoom - 0.1))}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-lg"
                      title="Zoom Out"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="0.8"
                      max="3.0"
                      step="0.05"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                      className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    />
                    <button
                      onClick={() => setZoom(Math.min(3.0, zoom + 0.1))}
                      className="p-1 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-lg"
                      title="Zoom In"
                    >
                      +
                    </button>
                    <button
                      onClick={() => {
                        setZoom(1.2);
                        setPanX(0);
                        setPanY(0);
                      }}
                      className="ml-2 text-xs font-semibold px-2 py-1 bg-white dark:bg-gray-700 hover:bg-gray-50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-200 transition-all"
                    >
                      Reset
                    </button>
                  </div>
                  <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                    <Move className="h-3 w-3" /> Drag image to adjust position • Scroll or use buttons to zoom
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="py-2 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Upload className="h-4 w-4" /> Change Photo
                  </button>
                  <button
                    onClick={handleDownload}
                    className="py-2 px-6 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold flex items-center gap-1.5 transition-all shadow-md"
                  >
                    <Download className="h-4 w-4" /> Export & Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="font-semibold text-gray-700 dark:text-gray-300">Upload your portrait photo</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">Supports JPG, PNG formats. Processed completely client-side in your browser.</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-6 py-2.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-all shadow-md"
                >
                  Select Image File
                </button>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        {/* Hidden Canvas */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Informational Panel */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-4">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" /> Nepalese Photo Guidelines
            </h3>
            <div className="text-xs text-gray-500 dark:text-gray-400 space-y-3 leading-relaxed">
              <p><strong>MRP Passport Size:</strong> 35mm x 45mm. The face must cover 70-80% of the photo area. Position the head in the center of the frame.</p>
              <p><strong>Citizenship Size:</strong> 25mm x 30mm. Standard size for local government cards and licenses.</p>
              <p><strong>Tips for perfect export:</strong> Use a plain white background, look directly at the camera, and keep shoulders level.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
