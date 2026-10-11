import React, { useRef, useEffect, useState } from 'react';
import { CardConfig, PhotoItem } from '../types';
import { renderCardToCanvas, getCanvasDimensions } from '../utils/canvasRenderer';
import { Maximize2, Minimize2, Copy, Download, Check, Sparkles, Move } from 'lucide-react';

interface CardPreviewProps {
  config: CardConfig;
  photos: PhotoItem[];
  selectedPhotoIndex: number;
  onUpdateSelectedPhoto: (updater: (prev: PhotoItem['state']) => PhotoItem['state']) => void;
  onDownload: () => void;
  onCopyImage: () => void;
  isCopied: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  config,
  photos,
  selectedPhotoIndex,
  onUpdateSelectedPhoto,
  onDownload,
  onCopyImage,
  isCopied,
  canvasRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomMode, setZoomMode] = useState<'fit' | '100%'>('fit');
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; initialX: number; initialY: number } | null>(null);

  // Render canvas whenever photos or config change
  useEffect(() => {
    if (canvasRef.current) {
      renderCardToCanvas(canvasRef.current, photos, config);
    }
  }, [config, photos]);

  const { width: W, height: H } = getCanvasDimensions(config.aspectRatio, config.bannerHeightPercent);

  // Drag to pan image on canvas
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (photos.length === 0 || !photos[selectedPhotoIndex]) return;

    // Check if click is on upper photo area
    const rect = e.currentTarget.getBoundingClientRect();
    const clickY = ((e.clientY - rect.top) / rect.height) * H;
    const dividerY = H * (1 - config.bannerHeightPercent / 100);

    if (clickY < dividerY) {
      setIsDragging(true);
      dragStartRef.current = {
        mouseX: e.clientX,
        mouseY: e.clientY,
        initialX: photos[selectedPhotoIndex].state.x,
        initialY: photos[selectedPhotoIndex].state.y,
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragStartRef.current) return;
    const deltaX = e.clientX - dragStartRef.current.mouseX;
    const deltaY = e.clientY - dragStartRef.current.mouseY;

    // Scaling factor from screen pixels to canvas coordinates
    const scaleFactor = 1.4;

    onUpdateSelectedPhoto((prev) => ({
      ...prev,
      x: Math.round(dragStartRef.current!.initialX + deltaX * scaleFactor),
      y: Math.round(dragStartRef.current!.initialY + deltaY * scaleFactor),
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    dragStartRef.current = null;
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-full min-w-0">
      {/* Top Preview Status Bar */}
      <div className="w-full max-w-2xl flex items-center justify-between mb-3 px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">লাইভ প্রিভিউ (Live Preview)</span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
            {W} × {H} HD
          </span>
        </div>

        <div className="flex items-center gap-2">
          {photos.length > 0 && (
            <span className="hidden sm:flex items-center gap-1 text-[11px] text-amber-400/90 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              <Move className="w-3 h-3" />
              <span>মাউস টেনে ছবি সরান</span>
            </span>
          )}

          <button
            onClick={() => setZoomMode(zoomMode === 'fit' ? '100%' : 'fit')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors text-[11px]"
            title={zoomMode === 'fit' ? '১০০% জুম' : 'স্ক্রিনে ফিট করুন'}
          >
            {zoomMode === 'fit' ? (
              <>
                <Maximize2 className="w-3 h-3" />
                <span>ফিট ভিউ</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3 h-3" />
                <span>ফুল জুম</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Canvas Wrapper */}
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center overflow-auto p-2"
        style={{ maxHeight: 'calc(100vh - 180px)' }}
      >
        <div
          className="relative rounded-2xl shadow-2xl ring-1 ring-amber-500/20 transition-all duration-200"
          style={{
            maxWidth: zoomMode === 'fit' ? '100%' : 'none',
            display: 'inline-block',
          }}
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`rounded-2xl block bg-slate-950 ${
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            }`}
            style={{
              width: zoomMode === 'fit' ? '100%' : `${W}px`,
              maxWidth: zoomMode === 'fit' ? (config.aspectRatio === '16:9' ? '780px' : '560px') : 'none',
              height: 'auto',
              boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(201, 162, 39, 0.1)',
            }}
          />
        </div>
      </div>

      {/* Floating Action Bar directly below Preview */}
      <div className="mt-4 flex items-center gap-3 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-4 py-2 rounded-xl shadow-xl">
        <button
          onClick={onCopyImage}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            isCopied
              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
          }`}
        >
          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'ইমেজ কপি সম্পন্ন' : 'কপিকৃত ছবি'}</span>
        </button>

        <span className="h-4 w-px bg-slate-800" />

        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 transition-transform active:scale-95"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ডাউনলোড (HD PNG)</span>
        </button>

        <span className="hidden sm:inline-block text-[11px] text-slate-400 pl-2">
          Facebook ও Instagram-এর জন্য উপযুক্ত
        </span>
      </div>
    </div>
  );
};
