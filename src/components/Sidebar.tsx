import React, { useState } from 'react';
import { CardConfig, PhotoItem, PhotoLayoutMode, WatermarkDesign, LogoPosition, LogoStyle, DatePosition, HeadlineStyle } from '../types';
import { GRADIENTS, getSwatchCSS } from '../constants/gradients';
import { PRESETS } from '../constants/presets';
import {
  Image as ImageIcon,
  Type,
  Sparkles,
  Palette,
  ShieldCheck,
  Upload,
  Trash2,
  ZoomIn,
  Sliders,
  Calendar,
  Globe,
  Share2,
  CheckCircle2,
  Search,
} from 'lucide-react';

interface SidebarProps {
  config: CardConfig;
  onChangeConfig: (newConfig: CardConfig) => void;
  photos: PhotoItem[];
  selectedPhotoIndex: number;
  onSelectPhotoIndex: (index: number) => void;
  onAddPhotos: (files: FileList) => void;
  onRemovePhoto: (index: number) => void;
  onUpdateSelectedPhoto: (updater: (prev: PhotoItem['state']) => PhotoItem['state']) => void;
  onApplyPreset: (presetId: string) => void;
  onUploadLogo: (file: File) => void;
  onRemoveCustomLogo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  onChangeConfig,
  photos,
  selectedPhotoIndex,
  onSelectPhotoIndex,
  onAddPhotos,
  onRemovePhoto,
  onUpdateSelectedPhoto,
  onApplyPreset,
  onUploadLogo,
  onRemoveCustomLogo,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'text' | 'branding' | 'gradients' | 'templates'>('photos');
  const [gradientSearch, setGradientSearch] = useState('');
  const [gradientFilter, setGradientFilter] = useState<'all' | 'mesh' | 'radial' | 'diagonal' | 'duotone' | 'angular'>('all');

  // Helpers for Bengali Date Formats
  const setBengaliDate = (type: 'today' | 'english' | 'detailed') => {
    const d = new Date();
    const monthsBn = [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
    ];
    const daysBn = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const bnDigits = (n: number) => n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);

    if (type === 'today') {
      const dateStr = `${bnDigits(d.getDate())} ${monthsBn[d.getMonth()]} ${bnDigits(d.getFullYear())}`;
      onChangeConfig({ ...config, dateText: dateStr, showDate: true });
    } else if (type === 'detailed') {
      const dateStr = `${daysBn[d.getDay()]}, ${bnDigits(d.getDate())} ${monthsBn[d.getMonth()]} ${bnDigits(d.getFullYear())}`;
      onChangeConfig({ ...config, dateText: dateStr, showDate: true });
    } else {
      const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateStr = `${d.getDate()} ${monthsEn[d.getMonth()]} ${d.getFullYear()}`;
      onChangeConfig({ ...config, dateText: dateStr, showDate: true });
    }
  };

  const selectedPhoto = photos[selectedPhotoIndex];

  const filteredGradients = GRADIENTS.filter((g) => {
    const matchesSearch = g.n.toLowerCase().includes(gradientSearch.toLowerCase());
    const matchesFilter = gradientFilter === 'all' || g.type === gradientFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <aside className="w-full lg:w-96 flex-shrink-0 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Navigation Tabs */}
      <div className="grid grid-cols-5 border-b border-slate-800 bg-slate-950/60 p-1 gap-1">
        <button
          onClick={() => setActiveTab('photos')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all ${
            activeTab === 'photos'
              ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title="ছবি ও লেআউট"
        >
          <ImageIcon className="w-4 h-4 mb-1" />
          <span>ছবি ({photos.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all ${
            activeTab === 'text'
              ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title="হেডলাইন ও ক্যাপশন"
        >
          <Type className="w-4 h-4 mb-1" />
          <span>টেক্সট</span>
        </button>

        <button
          onClick={() => setActiveTab('branding')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all ${
            activeTab === 'branding'
              ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title="লোগো, তারিখ, ফুটার ও সোশ্যাল মিডিয়া"
        >
          <ShieldCheck className="w-4 h-4 mb-1" />
          <span>ব্র্যান্ডিং</span>
        </button>

        <button
          onClick={() => setActiveTab('gradients')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all ${
            activeTab === 'gradients'
              ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title="১২০+ ব্যাকগ্রাউন্ড গ্রেডিয়েন্ট"
        >
          <Palette className="w-4 h-4 mb-1" />
          <span>কালার</span>
        </button>

        <button
          onClick={() => setActiveTab('templates')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl text-[11px] font-medium transition-all ${
            activeTab === 'templates'
              ? 'bg-slate-800 text-amber-400 font-semibold shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
          }`}
          title="রেডিমেড কার্ড টেমপ্লেট"
        >
          <Sparkles className="w-4 h-4 mb-1" />
          <span>টেমপ্লেট</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 max-h-[calc(100vh-140px)]">
        {/* ─── TAB 1: PHOTOS & LAYOUT ─── */}
        {activeTab === 'photos' && (
          <div className="space-y-5">
            {/* Upload Area */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-2">
                ছবি আপলোড করুন (সর্বোচ্চ ১০টি)
              </label>
              <label className="border-2 border-dashed border-amber-500/30 hover:border-amber-400 rounded-xl p-4 text-center cursor-pointer block bg-slate-950/40 hover:bg-amber-500/5 transition-all group">
                <Upload className="w-7 h-7 mx-auto mb-2 text-amber-400/80 group-hover:text-amber-400 transition-colors" />
                <p className="text-xs font-medium text-slate-200">ছবি বাছাই করতে ক্লিক বা ড্র্যাগ করুন</p>
                <p className="text-[10px] text-slate-400 mt-1">JPG, PNG, WebP ফরম্যাট সমর্থিত</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      onAddPhotos(e.target.files);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>

            {/* Thumbnail Strip */}
            {photos.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-slate-300">আপলোড করা ছবিসমূহ</span>
                  <span className="text-[10px] text-slate-400">{photos.length}/10 ছবি</span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {photos.map((p, idx) => {
                    const active = idx === selectedPhotoIndex;
                    return (
                      <div
                        key={p.id}
                        onClick={() => onSelectPhotoIndex(idx)}
                        className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                          active
                            ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105 shadow-md'
                            : 'border-slate-700 opacity-80 hover:opacity-100 hover:border-slate-500'
                        }`}
                      >
                        <img src={p.img.src} alt={p.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 left-1 text-[9px] font-bold bg-black/70 px-1 rounded text-white">
                          #{idx + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePhoto(idx);
                          }}
                          className="absolute top-0.5 right-0.5 w-4 h-4 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center text-white text-[9px]"
                          title="মুছে ফেলুন"
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Collage Layout Mode (When > 1 photo) */}
            {photos.length > 1 && (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">কোলাজ লেআউট মোড</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['auto', 'side', 'grid', 'stack'] as PhotoLayoutMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => onChangeConfig({ ...config, layoutMode: mode })}
                      className={`py-2 px-1 text-center text-xs rounded-lg border transition-all ${
                        config.layoutMode === mode
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mode === 'auto' && 'অটো (Auto)'}
                      {mode === 'side' && 'পাশাপাশি'}
                      {mode === 'grid' && 'গ্রিড (Grid)'}
                      {mode === 'stack' && 'উপরে-নিচে'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Photo Position & Zoom Adjustments */}
            {selectedPhoto && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    নির্বাচিত ছবি সমন্বয় (#{selectedPhotoIndex + 1})
                  </span>
                  <button
                    onClick={() =>
                      onUpdateSelectedPhoto(() => ({ scale: 1, x: 0, y: 0 }))
                    }
                    className="text-[10px] text-slate-400 hover:text-amber-400 underline"
                  >
                    রিসেট
                  </button>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                    <span>জুম (Zoom)</span>
                    <span>{Math.round(selectedPhoto.state.scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.4"
                    max="3.0"
                    step="0.05"
                    value={selectedPhoto.state.scale}
                    onChange={(e) => {
                      const scale = parseFloat(e.target.value);
                      onUpdateSelectedPhoto((prev) => ({ ...prev, scale }));
                    }}
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>বামে / ডানে</span>
                      <span>{selectedPhoto.state.x}px</span>
                    </div>
                    <input
                      type="range"
                      min="-400"
                      max="400"
                      step="4"
                      value={selectedPhoto.state.x}
                      onChange={(e) => {
                        const x = parseInt(e.target.value, 10);
                        onUpdateSelectedPhoto((prev) => ({ ...prev, x }));
                      }}
                      className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>উপরে / নিচে</span>
                      <span>{selectedPhoto.state.y}px</span>
                    </div>
                    <input
                      type="range"
                      min="-400"
                      max="400"
                      step="4"
                      value={selectedPhoto.state.y}
                      onChange={(e) => {
                        const y = parseInt(e.target.value, 10);
                        onUpdateSelectedPhoto((prev) => ({ ...prev, y }));
                      }}
                      className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Photo Filters */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <span className="text-xs font-semibold text-slate-300 block">ছবির ফিল্টার ও ইফেক্ট</span>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>ব্রাইটনেস</span>
                    <span>{Math.round(config.filters.brightness * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={config.filters.brightness}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        filters: { ...config.filters, brightness: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>কনট্রাস্ট</span>
                    <span>{Math.round(config.filters.contrast * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={config.filters.contrast}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        filters: { ...config.filters, contrast: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.filters.grayscale}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        filters: { ...config.filters, grayscale: e.target.checked },
                      })
                    }
                    className="accent-amber-500 rounded"
                  />
                  <span>সাদা-কালো (B&W)</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.filters.vignette}
                    onChange={(e) =>
                      onChangeConfig({
                        ...config,
                        filters: { ...config.filters, vignette: e.target.checked },
                      })
                    }
                    className="accent-amber-500 rounded"
                  />
                  <span>ভিনিয়েট শ্যাডো</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: TEXT & HEADLINE ─── */}
        {activeTab === 'text' && (
          <div className="space-y-5">
            {/* Category / Kicker Badge */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-amber-400">ক্যাটাগরি বা টপিক ট্যাগ</label>
                <input
                  type="checkbox"
                  checked={config.showCategory}
                  onChange={(e) => onChangeConfig({ ...config, showCategory: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
              </div>

              {config.showCategory && (
                <>
                  <input
                    type="text"
                    value={config.category}
                    onChange={(e) => onChangeConfig({ ...config, category: e.target.value })}
                    placeholder="যেমনঃ ব্রেকিং নিউজ, জাতীয় সংবাদ, খেলাধুলা"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-400 outline-none"
                  />

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1.5">ব্যাজ ডিজাইন</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'red-badge', label: '🔴 লাল ব্রেকিং' },
                        { id: 'gold-badge', label: '✨ সোনালী প্রিমিয়াম' },
                        { id: 'modern-tag', label: '🔷 সায়ান মডার্ন' },
                        { id: 'minimal-line', label: '✏️ মিনিমাল লাইন' },
                      ].map((s) => (
                        <button
                          key={s.id}
                          onClick={() => onChangeConfig({ ...config, categoryStyle: s.id as any })}
                          className={`py-1.5 px-2 rounded-lg border text-left transition-all ${
                            config.categoryStyle === s.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Headline Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  মূল শিরোনাম (Headline)
                </label>
                <span className="text-[10px] text-slate-400">মাল্টি-লাইন সাপোর্ট</span>
              </div>
              <textarea
                rows={3}
                value={config.headline}
                onChange={(e) => onChangeConfig({ ...config, headline: e.target.value })}
                placeholder="এখানে আপনার সংবাদ বা পোস্টের মূল শিরোনাম লিখুন..."
                className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-3 text-sm text-slate-100 focus:border-amber-400 outline-none leading-relaxed font-serif"
              />

              {/* Headline Controls */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>ফন্ট সাইজ</span>
                    <span>{config.headlineSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="26"
                    max="50"
                    step="1"
                    value={config.headlineSize}
                    onChange={(e) =>
                      onChangeConfig({ ...config, headlineSize: parseInt(e.target.value, 10) })
                    }
                    className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ফন্ট ফ্যামিলি</label>
                  <select
                    value={config.headlineFont}
                    onChange={(e) => onChangeConfig({ ...config, headlineFont: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none focus:border-amber-400"
                  >
                    <option value="Noto Serif Bengali">Noto Serif (সেরিফ - পত্রিকার রূপ)</option>
                    <option value="Noto Sans Bengali">Noto Sans (স্যান্স - স্পষ্ট)</option>
                    <option value="Hind Siliguri">Hind Siliguri (হিন্দ শিলিগুড়ি)</option>
                  </select>
                </div>
              </div>

              {/* Headline Color Preset */}
              <div>
                <label className="text-[11px] text-slate-400 block mb-1.5">শিরোনামের কালার স্টাইল</label>
                <div className="flex gap-1.5 flex-wrap">
                  {[
                    { id: 'gold', label: 'সোনালী গ্রেডিয়েন্ট', color: '#e8c75a' },
                    { id: 'yellow', label: 'উজ্জ্বল হলুদ', color: '#fef08a' },
                    { id: 'white', label: 'খাঁটি সাদা', color: '#ffffff' },
                    { id: 'cyan', label: 'নিওন সায়ান', color: '#67e8f9' },
                    { id: 'red', label: 'ব্রেকিং রেড', color: '#f87171' },
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => onChangeConfig({ ...config, headlineStyle: st.id as HeadlineStyle })}
                      className={`px-2.5 py-1 rounded-lg text-xs border flex items-center gap-1.5 transition-all ${
                        config.headlineStyle === st.id
                          ? 'bg-slate-800 border-amber-400 text-white font-bold'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                      <span>{st.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Caption / Subtitle Section */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">ক্যাপশন বা বিস্তারিত বিবরণ</label>
                <input
                  type="checkbox"
                  checked={config.showCaption}
                  onChange={(e) => onChangeConfig({ ...config, showCaption: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
              </div>

              {config.showCaption && (
                <>
                  <textarea
                    rows={2}
                    value={config.caption}
                    onChange={(e) => onChangeConfig({ ...config, caption: e.target.value })}
                    placeholder="এখানে বিস্তারিত সারসংক্ষেপ বা উক্তি লিখুন..."
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-amber-400 outline-none leading-relaxed"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>ক্যাপশন সাইজ</span>
                        <span>{config.captionSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="16"
                        max="28"
                        step="1"
                        value={config.captionSize}
                        onChange={(e) =>
                          onChangeConfig({ ...config, captionSize: parseInt(e.target.value, 10) })
                        }
                        className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">টেক্সট অ্যালাইনমেন্ট</label>
                      <div className="flex gap-1">
                        <button
                          onClick={() => onChangeConfig({ ...config, textAlign: 'center' })}
                          className={`flex-1 py-1 rounded text-xs border ${
                            config.textAlign === 'center'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          মাঝখানে (Center)
                        </button>
                        <button
                          onClick={() => onChangeConfig({ ...config, textAlign: 'left' })}
                          className={`flex-1 py-1 rounded text-xs border ${
                            config.textAlign === 'left'
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          বামে (Left)
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Banner Height Proportion */}
            <div className="pt-2 border-t border-slate-800">
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>টেক্সট ব্যানারের উচ্চতা</span>
                <span>{config.bannerHeightPercent}%</span>
              </div>
              <input
                type="range"
                min="24"
                max="45"
                step="1"
                value={config.bannerHeightPercent}
                onChange={(e) =>
                  onChangeConfig({ ...config, bannerHeightPercent: parseInt(e.target.value, 10) })
                }
                className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                ব্যানার বড় করলে লম্বা শিরোনাম ও ক্যাপশনের জন্য পর্যাপ্ত জায়গা পাওয়া যায়।
              </p>
            </div>
          </div>
        )}

        {/* ─── TAB 3: BRANDING, DATE, LOGO & FOOTER ─── (KEY USER REQUEST!) */}
        {activeTab === 'branding' && (
          <div className="space-y-5">
            {/* 1. DATE SECTION (তারিখ) */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    তারিখ (Date Setting)
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={config.showDate}
                  onChange={(e) => onChangeConfig({ ...config, showDate: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
              </div>

              {config.showDate && (
                <>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">তারিখের লেখা</label>
                    <input
                      type="text"
                      value={config.dateText}
                      onChange={(e) => onChangeConfig({ ...config, dateText: e.target.value })}
                      placeholder="যেমনঃ রবিবার, ১১ অক্টোবর ২০২৬"
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-400 outline-none"
                    />
                  </div>

                  {/* Date Quick Presets */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">দ্রুত ফরম্যাট বাছাই:</label>
                    <div className="flex gap-1.5 flex-wrap">
                      <button
                        onClick={() => setBengaliDate('today')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] border border-slate-700"
                      >
                        আজকের তারিখ (বাংলা)
                      </button>
                      <button
                        onClick={() => setBengaliDate('detailed')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] border border-slate-700"
                      >
                        বার সহ বিস্তারিত
                      </button>
                      <button
                        onClick={() => setBengaliDate('english')}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] border border-slate-700"
                      >
                        ইংরেজি (English)
                      </button>
                    </div>
                  </div>

                  {/* Date Placement */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">তারিখের অবস্থান</label>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[
                        { id: 'category-row', label: 'ক্যাটাগরি সারিতে' },
                        { id: 'header-right', label: 'উপরে ডান কোণায়' },
                        { id: 'header-left', label: 'উপরে বাম কোণায়' },
                        { id: 'footer-row', label: 'ফুটার বারের মাঝে' },
                      ].map((pos) => (
                        <button
                          key={pos.id}
                          onClick={() => onChangeConfig({ ...config, datePosition: pos.id as DatePosition })}
                          className={`py-1.5 px-2 rounded-lg border text-left transition-all ${
                            config.datePosition === pos.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 2. LOGO SECTION (আলাদা লোগো বসানোর স্থান) */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    লোগো ও ব্র্যান্ড (Logo & Brand)
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={config.showLogo}
                  onChange={(e) => onChangeConfig({ ...config, showLogo: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
              </div>

              {config.showLogo && (
                <>
                  {/* Upload Custom Logo or Preset */}
                  <div className="space-y-2">
                    <label className="text-[11px] text-slate-400 block">কাস্টম লোগো আপলোড</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 border border-dashed border-slate-700 hover:border-amber-400 rounded-lg p-2 text-center cursor-pointer bg-slate-900/60 text-xs text-slate-300">
                        <span>{config.logoImg ? 'লোগো পরিবর্তন করুন' : '📁 লোগো ফাইল নির্বাচন করুন (PNG/SVG)'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              onUploadLogo(e.target.files[0]);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                      {config.logoImg && (
                        <button
                          onClick={onRemoveCustomLogo}
                          className="p-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded-lg"
                          title="কাস্টম লোগো মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {!config.logoImg && (
                      <div>
                        <span className="text-[10px] text-slate-400 block mb-1">অথবা রেডিমেড আইকন ব্যবহার করুন:</span>
                        <div className="flex gap-2">
                          {[
                            { id: 'preset-news', label: '📰 প্রেস / পত্রিকা' },
                            { id: 'preset-tv', label: '🔴 লাইভ টিভি' },
                            { id: 'preset-quote', label: '💬 উক্তি প্রতীক' },
                          ].map((pre) => (
                            <button
                              key={pre.id}
                              onClick={() => onChangeConfig({ ...config, logoPreset: pre.id })}
                              className={`flex-1 py-1 px-1.5 rounded text-[11px] border text-center ${
                                config.logoPreset === pre.id
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                                  : 'bg-slate-900 border-slate-800 text-slate-400'
                              }`}
                            >
                              {pre.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Logo Placement */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">লোগো বসানোর স্থান (Position)</label>
                    <div className="grid grid-cols-3 gap-1.5 text-xs">
                      {[
                        { id: 'top-left', label: 'উপরে বামে' },
                        { id: 'top-right', label: 'উপরে ডানে' },
                        { id: 'center-top', label: 'মাঝখানে' },
                        { id: 'bottom-left', label: 'ব্যানারে বামে' },
                        { id: 'bottom-right', label: 'ব্যানারে ডানে' },
                      ].map((lp) => (
                        <button
                          key={lp.id}
                          onClick={() => onChangeConfig({ ...config, logoPosition: lp.id as LogoPosition })}
                          className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                            config.logoPosition === lp.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {lp.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logo Style Container */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">লোগো ফ্রেম স্টাইল</label>
                      <select
                        value={config.logoStyle}
                        onChange={(e) => onChangeConfig({ ...config, logoStyle: e.target.value as LogoStyle })}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none"
                      >
                        <option value="rounded">রাউন্ডেড ব্যাজ</option>
                        <option value="circle">বৃত্তাকার ফ্রেম</option>
                        <option value="glass">কাঁচের ফ্রেম (Glass)</option>
                        <option value="original">স্বচ্ছ (Original)</option>
                      </select>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                        <span>লোগোর আকার</span>
                        <span>{config.logoSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="35"
                        max="85"
                        step="1"
                        value={config.logoSize}
                        onChange={(e) =>
                          onChangeConfig({ ...config, logoSize: parseInt(e.target.value, 10) })
                        }
                        className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg"
                      />
                    </div>
                  </div>

                  {/* Brand Name Text beside Logo */}
                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-400">লোগোর পাশে ব্র্যান্ড নাম লিখুন</label>
                      <input
                        type="checkbox"
                        checked={config.showBrandName}
                        onChange={(e) => onChangeConfig({ ...config, showBrandName: e.target.checked })}
                        className="accent-amber-500 rounded"
                      />
                    </div>
                    {config.showBrandName && (
                      <input
                        type="text"
                        value={config.brandName}
                        onChange={(e) => onChangeConfig({ ...config, brandName: e.target.value })}
                        placeholder="যেমনঃ দৈনিক খবর, বিবিসি বাংলা"
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-400 outline-none"
                      />
                    )}
                  </div>
                </>
              )}
            </div>

            {/* 3. FOOTER AREA & WEBSITE LINK (ফুটার এরিয়াতে ওয়েব সাইটের লিংক) */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-amber-400" />
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                    ফুটার ও ওয়েবসাইট লিংক
                  </label>
                </div>
                <input
                  type="checkbox"
                  checked={config.showFooter}
                  onChange={(e) => onChangeConfig({ ...config, showFooter: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
              </div>

              {config.showFooter && (
                <>
                  {/* Website URL */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] text-slate-400">ওয়েবসাইট লিংক প্রদর্শন</label>
                      <input
                        type="checkbox"
                        checked={config.showWebsite}
                        onChange={(e) => onChangeConfig({ ...config, showWebsite: e.target.checked })}
                        className="accent-amber-500 rounded"
                      />
                    </div>
                    {config.showWebsite && (
                      <div className="relative">
                        <span className="absolute left-2.5 top-2 text-slate-500 text-xs">🌐</span>
                        <input
                          type="text"
                          value={config.websiteUrl}
                          onChange={(e) => onChangeConfig({ ...config, websiteUrl: e.target.value })}
                          placeholder="www.yourportal.com"
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-100 focus:border-amber-400 outline-none font-mono"
                        />
                      </div>
                    )}
                  </div>

                  {/* Footer Style */}
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">ফুটার পটভূমি (Style)</label>
                    <select
                      value={config.footerBgStyle}
                      onChange={(e) => onChangeConfig({ ...config, footerBgStyle: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-200 outline-none"
                    >
                      <option value="dark-translucent">ডার্ক ট্রান্সলুসেন্ট (জনপ্রিয়)</option>
                      <option value="solid-dark">সলিড ডার্ক বার</option>
                      <option value="line-only">কেবলমাত্র বর্ডার লাইন</option>
                      <option value="gradient">সোনালী গ্রেডিয়েন্ট বার</option>
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* 4. SOCIAL MEDIA ICONS (সোশাল মিডিয়া আইকন যোগ করার ব্যবস্থা) */}
            {config.showFooter && (
              <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-amber-400" />
                    <label className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                      সোশ্যাল মিডিয়া আইকন ও হ্যান্ডেল
                    </label>
                  </div>
                </div>

                {/* Unified Handle Toggle */}
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 space-y-2">
                  <label className="flex items-center justify-between text-xs text-slate-300 cursor-pointer">
                    <span>সকল প্ল্যাটফর্মের জন্য একই হ্যান্ডেল ব্যবহার করুন</span>
                    <input
                      type="checkbox"
                      checked={config.socials.useUnifiedHandle}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          socials: { ...config.socials, useUnifiedHandle: e.target.checked },
                        })
                      }
                      className="accent-amber-500 rounded"
                    />
                  </label>

                  {config.socials.useUnifiedHandle && (
                    <input
                      type="text"
                      value={config.socials.unifiedHandle}
                      onChange={(e) =>
                        onChangeConfig({
                          ...config,
                          socials: { ...config.socials, unifiedHandle: e.target.value },
                        })
                      }
                      placeholder="@yourhandle"
                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 outline-none focus:border-amber-400 font-mono"
                    />
                  )}
                </div>

                {/* Social Channels Toggles */}
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-400 block">কোন কোন আইকন দেখাবেন:</span>
                  {[
                    { id: 'showFacebook', key: 'facebookHandle', label: 'ফেসবুক (Facebook)', color: '#1877F2' },
                    { id: 'showYoutube', key: 'youtubeHandle', label: 'ইউটিউব (YouTube)', color: '#FF0000' },
                    { id: 'showInstagram', key: 'instagramHandle', label: 'ইনস্টাগ্রাম (Instagram)', color: '#E4405F' },
                    { id: 'showTwitter', key: 'twitterHandle', label: 'এক্স / টুইটার (𝕏)', color: '#ffffff' },
                    { id: 'showTelegram', key: 'telegramHandle', label: 'টেলিগ্রাম (Telegram)', color: '#229ED9' },
                  ].map((soc) => {
                    const isChecked = (config.socials as any)[soc.id];
                    return (
                      <div key={soc.id} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-none">
                        <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) =>
                              onChangeConfig({
                                ...config,
                                socials: {
                                  ...config.socials,
                                  [soc.id]: e.target.checked,
                                },
                              })
                            }
                            className="accent-amber-500 rounded"
                          />
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: soc.color }} />
                          <span>{soc.label}</span>
                        </label>

                        {!config.socials.useUnifiedHandle && isChecked && (
                          <input
                            type="text"
                            value={(config.socials as any)[soc.key]}
                            onChange={(e) =>
                              onChangeConfig({
                                ...config,
                                socials: {
                                  ...config.socials,
                                  [soc.key]: e.target.value,
                                },
                              })
                            }
                            placeholder="handle"
                            className="w-28 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-[11px] text-slate-200"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. WATERMARK / SOURCE (ওয়াটারমার্ক ও ছবি স্বত্ব) */}
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-400 uppercase tracking-wide">
                  ছবির স্বত্ব / ওয়াটারমার্ক
                </label>
                <input
                  type="checkbox"
                  checked={config.showWatermark}
                  onChange={(e) => onChangeConfig({ ...config, showWatermark: e.target.checked })}
                  className="accent-amber-500 rounded"
                />
              </div>

              {config.showWatermark && (
                <>
                  <input
                    type="text"
                    value={config.watermark}
                    onChange={(e) => onChangeConfig({ ...config, watermark: e.target.value })}
                    placeholder="যেমনঃ সংগৃহীত, রয়টার্স, নিজস্ব আলোকচিত্রী"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:border-amber-400 outline-none"
                  />

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1.5">ব্যাজ স্টাইল (৮টি ডিজাইন)</label>
                    <div className="grid grid-cols-4 gap-1.5 text-[11px]">
                      {[
                        { id: 'dark', label: '🌑 ডার্ক' },
                        { id: 'gold', label: '✨ গোল্ড' },
                        { id: 'glass', label: '🪟 গ্লাস' },
                        { id: 'pill', label: '💊 পিল' },
                        { id: 'neon', label: '💡 নিওন' },
                        { id: 'minimal', label: '✏️ লাইন' },
                        { id: 'ribbon', label: '🎀 ফিতা' },
                        { id: 'gradient', label: '🌈 রঙধনু' },
                      ].map((w) => (
                        <button
                          key={w.id}
                          onClick={() => onChangeConfig({ ...config, watermarkDesign: w.id as WatermarkDesign })}
                          className={`py-1.5 px-1 rounded-lg border text-center transition-all ${
                            config.watermarkDesign === w.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {w.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">অবস্থান</label>
                    <div className="flex gap-2">
                      {[
                        { id: 'top-left', label: 'উপরে বামে' },
                        { id: 'top-right', label: 'উপরে ডানে' },
                        { id: 'bottom-left', label: 'ছবির নিচে বামে' },
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => onChangeConfig({ ...config, watermarkPosition: p.id as any })}
                          className={`flex-1 py-1 rounded text-xs border ${
                            config.watermarkPosition === p.id
                              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ─── TAB 4: GRADIENTS & COLORS ─── */}
        {activeTab === 'gradients' && (
          <div className="space-y-4">
            {/* Custom Color Creator */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-slate-200 block">কাস্টম কালার বাছাই</label>
                <p className="text-[10px] text-slate-400">আপনার নিজস্ব পছন্দসই রং দিন</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={config.customGradientColor || '#001a2e'}
                  onChange={(e) =>
                    onChangeConfig({
                      ...config,
                      customGradientColor: e.target.value,
                    })
                  }
                  className="w-8 h-8 rounded-full cursor-pointer bg-transparent border-2 border-slate-600"
                />
                {config.customGradientColor && (
                  <button
                    onClick={() => onChangeConfig({ ...config, customGradientColor: '' })}
                    className="text-[10px] text-amber-400 underline"
                  >
                    লাইব্রেরিতে ফিরুন
                  </button>
                )}
              </div>
            </div>

            {/* Divider Line Configuration */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <label className="text-xs font-semibold text-slate-200 block">ছবি ও ব্যানারের বিভাজক রেখা</label>
              <div className="flex gap-1.5">
                {[
                  { id: 'gold', label: '✨ গোল্ড' },
                  { id: 'red', label: '🔴 লাল' },
                  { id: 'cyan', label: '🔷 সায়ান' },
                  { id: 'white', label: '⚪ সাদা' },
                  { id: 'none', label: 'কোনোটি নয়' },
                ].map((div) => (
                  <button
                    key={div.id}
                    onClick={() => onChangeConfig({ ...config, dividerStyle: div.id as any })}
                    className={`flex-1 py-1 rounded text-[11px] border text-center ${
                      config.dividerStyle === div.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    {div.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Library Filter & Search */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  ১২০+ গ্রেডিয়েন্ট লাইব্রেরি
                </span>
                <span className="text-[10px] text-slate-400">{filteredGradients.length} টি উপলব্ধ</span>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={gradientSearch}
                  onChange={(e) => setGradientSearch(e.target.value)}
                  placeholder="গ্রেডিয়েন্ট খুঁজুন (e.g. Cobalt, Red, Emerald)..."
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:border-amber-400 outline-none"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[11px]">
                {[
                  { id: 'all', label: 'সবগুলো' },
                  { id: 'mesh', label: 'মেশ (Mesh)' },
                  { id: 'diagonal', label: 'ডায়াগোনাল' },
                  { id: 'radial', label: 'রেডিয়াল' },
                  { id: 'duotone', label: 'ডুওটোন' },
                  { id: 'angular', label: 'সুইপ' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setGradientFilter(f.id as any)}
                    className={`px-2.5 py-1 rounded-md whitespace-nowrap transition-all ${
                      gradientFilter === f.id
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Grid Swatches */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-72 overflow-y-auto p-1 bg-slate-950/40 rounded-xl border border-slate-800/80">
                {filteredGradients.map((g, idx) => {
                  const active = !config.customGradientColor && config.selectedGradient.n === g.n;
                  return (
                    <button
                      key={idx}
                      onClick={() =>
                        onChangeConfig({
                          ...config,
                          selectedGradient: g,
                          customGradientColor: '',
                        })
                      }
                      title={`[${g.type.toUpperCase()}] ${g.n}`}
                      className={`aspect-square rounded-lg transition-transform relative group border ${
                        active
                          ? 'border-white scale-110 shadow-lg ring-2 ring-white/50 z-10'
                          : 'border-slate-800 hover:scale-105 hover:border-slate-500'
                      }`}
                      style={{ background: getSwatchCSS(g) }}
                    >
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center text-white text-[10px]">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="text-[11px] text-slate-400 text-center">
                বর্তমান: <span className="text-amber-300 font-semibold">{config.customGradientColor ? 'কাস্টম কালার' : config.selectedGradient.n}</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 5: TEMPLATES ─── */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-400">
              ১-ক্লিকে চমৎকার পেশাদার ডিজাইনের টেমপ্লেট চালু করুন:
            </div>

            <div className="space-y-3">
              {PRESETS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => onApplyPreset(p.id)}
                  className="p-3.5 bg-slate-950/60 hover:bg-slate-800/50 border border-slate-800 hover:border-amber-400/50 rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-amber-400 transition-colors flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      {p.name}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{p.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
