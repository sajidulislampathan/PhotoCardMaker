import React from 'react';
import { AspectRatio } from '../types';
import { Download, Copy, RotateCcw, Sparkles, Check, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  aspectRatio: AspectRatio;
  onSelectAspectRatio: (ratio: AspectRatio) => void;
  onDownload: () => void;
  onCopyImage: () => void;
  onReset: () => void;
  onLoadSample: () => void;
  isCopied: boolean;
  isDownloading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  aspectRatio,
  onSelectAspectRatio,
  onDownload,
  onCopyImage,
  onReset,
  onLoadSample,
  isCopied,
  isDownloading,
}) => {
  const ratios: Array<{ id: AspectRatio; label: string; icon: string; size: string }> = [
    { id: '1:1', label: '১:১ স্কয়ার', icon: '■', size: '1080×1080' },
    { id: '4:5', label: '৪:৫ পোর্ট্রেট', icon: '▮', size: '1080×1350' },
    { id: '16:9', label: '১৬:৯ ল্যান্ডস্কেপ', icon: '▬', size: '1920×1080' },
    { id: '9:16', label: '৯:১৬ স্টোরি', icon: '▯', size: '1080×1920' },
  ];

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key.toLowerCase() === 'u' || e.key.toLowerCase() === 's')) {
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo and title */}
        <div className="flex items-center gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                ফোটো কার্ড মেকার <span className="text-amber-400 font-serif">প্রো</span>
              </h1>
              <span className="hidden sm:inline-block text-[11px] text-amber-300/80 font-medium border-l border-slate-800 pl-2">
                by Sajidul Islam Pathan
              </span>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-slate-400">
                সংবাদ, উক্তি ও সোশ্যাল মিডিয়ার পেশাদার ফটো কার্ড প্ল্যাটফর্ম
              </p>
              <span className="sm:hidden text-[10px] text-amber-300/80 font-medium">
                • By Sajidul Islam Pathan
              </span>
            </div>
          </div>
        </div>

        {/* Aspect Ratio Switcher */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {ratios.map((r) => {
            const active = aspectRatio === r.id;
            return (
              <button
                key={r.id}
                onClick={() => onSelectAspectRatio(r.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
                title={`রেজোলিউশন: ${r.size}`}
              >
                <span className="text-xs">{r.icon}</span>
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions buttons */}
        <div className="flex items-center gap-2 flex-wrap justify-end">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/40 border border-amber-500/30 transition-colors"
            title="নমুনা সংবাদ ও ডিজাইন লোড করুন"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>নমুনা লোড</span>
          </button>

          <button
            onClick={onCopyImage}
            disabled={isCopied}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
              isCopied
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700'
            }`}
            title="ক্লিপবোর্ডে কপি করুন"
          >
            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{isCopied ? 'কপি হয়েছে!' : 'কপি ইমেজ'}</span>
          </button>

          <button
            onClick={onDownload}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/25 transition-all transform active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>ডাউনলোড HD</span>
          </button>

          <button
            onClick={onReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="রিসেট করুন"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
