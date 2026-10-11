/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { CardConfig, PhotoItem, AspectRatio } from './types';
import { GRADIENTS } from './constants/gradients';
import { PRESETS } from './constants/presets';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { CardPreview } from './components/CardPreview';
import { getSampleNewsImage } from './utils/sampleImage';

function getTodayBengaliDate(): string {
  const d = new Date();
  const monthsBn = [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ];
  const bnDigits = (n: number) => n.toString().replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[parseInt(d, 10)]);
  return `${bnDigits(d.getDate())} ${monthsBn[d.getMonth()]} ${bnDigits(d.getFullYear())}`;
}

const DEFAULT_CONFIG: CardConfig = {
  aspectRatio: '1:1',
  bannerHeightPercent: 32,

  // Content
  category: 'জাতীয় সংবাদ',
  showCategory: true,
  categoryStyle: 'red-badge',

  headline: 'জাতীয় অর্থনৈতিক প্রবৃদ্ধিতে নতুন মাইলফলক অর্জন',
  headlineSize: 37,
  headlineFont: 'Noto Serif Bengali',
  headlineStyle: 'gold',
  customHeadlineColor: '',
  textAlign: 'center',

  caption: 'রপ্তানি আয় ও রাজস্ব আদায়ে যুগান্তকারী অগ্রগতি লক্ষ্য করা গেছে বলে জানিয়েছে সংশ্লিষ্ট কর্তৃপক্ষ।',
  showCaption: true,
  captionSize: 22,
  captionFont: 'Noto Serif Bengali',
  captionColor: 'rgba(255, 255, 255, 0.92)',

  // Date
  showDate: true,
  dateText: getTodayBengaliDate(),
  datePosition: 'category-row',

  // Logo & Branding
  showLogo: true,
  logoImg: null,
  logoPreset: 'preset-news',
  logoPosition: 'top-left',
  logoStyle: 'rounded',
  logoSize: 52,
  brandName: 'প্রতিষ্ঠানের নাম',
  showBrandName: true,

  // Watermark / Source
  watermark: 'সংগৃহীত',
  showWatermark: true,
  watermarkDesign: 'gold',
  watermarkPosition: 'top-right',

  // Footer & Links
  showFooter: true,
  websiteUrl: 'www.website.com',
  showWebsite: true,
  socials: {
    showFacebook: true,
    facebookHandle: 'Company',
    showYoutube: true,
    youtubeHandle: '@Company',
    showInstagram: true,
    instagramHandle: 'Company',
    showTwitter: true,
    twitterHandle: 'Company',
    showTelegram: false,
    telegramHandle: '',
    unifiedHandle: '@Company',
    useUnifiedHandle: true,
  },
  footerBgStyle: 'dark-translucent',

  // Divider
  dividerStyle: 'gold',
  dividerThickness: 3,

  // Gradient
  selectedGradient: GRADIENTS[0],
  customGradientColor: '',

  // Photos
  layoutMode: 'auto',
  filters: {
    brightness: 1,
    contrast: 1,
    saturation: 1,
    grayscale: false,
    vignette: false,
  },
};

export default function App() {
  const [config, setConfig] = useState<CardConfig>(DEFAULT_CONFIG);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number>(0);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Auto-load sample image on initial mount
  useEffect(() => {
    getSampleNewsImage().then((img) => {
      setPhotos([
        {
          id: 'sample-1',
          img,
          name: 'sample-news.png',
          state: { scale: 1, x: 0, y: 0 },
        },
      ]);
    });
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Add photos
  const handleAddPhotos = (files: FileList) => {
    const remainingSlots = 10 - photos.length;
    if (remainingSlots <= 0) {
      showToast('সর্বোচ্চ ১০টি ছবি আপলোড করা যাবে');
      return;
    }

    const fileList = Array.from(files).slice(0, remainingSlots);
    const newPhotos: PhotoItem[] = [];

    let loadedCount = 0;
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          newPhotos.push({
            id: Math.random().toString(36).substring(2, 9),
            img,
            name: file.name,
            state: { scale: 1, x: 0, y: 0 },
          });

          loadedCount++;
          if (loadedCount === fileList.length) {
            setPhotos((prev) => [...prev, ...newPhotos]);
            setSelectedPhotoIndex(photos.length + newPhotos.length - 1);
            showToast(`${newPhotos.length}টি ছবি যুক্ত করা হয়েছে`);
          }
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove photo
  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
    if (selectedPhotoIndex >= photos.length - 1) {
      setSelectedPhotoIndex(Math.max(0, photos.length - 2));
    }
  };

  // Update selected photo pan/zoom
  const handleUpdateSelectedPhoto = (updater: (prev: PhotoItem['state']) => PhotoItem['state']) => {
    setPhotos((prev) => {
      if (!prev[selectedPhotoIndex]) return prev;
      const copy = [...prev];
      copy[selectedPhotoIndex] = {
        ...copy[selectedPhotoIndex],
        state: updater(copy[selectedPhotoIndex].state),
      };
      return copy;
    });
  };

  // Custom Logo upload
  const handleUploadLogo = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setConfig((prev) => ({
          ...prev,
          logoImg: img,
          showLogo: true,
        }));
        showToast('কাস্টম লোগো সফলভাবে আপলোড হয়েছে');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomLogo = () => {
    setConfig((prev) => ({
      ...prev,
      logoImg: null,
    }));
  };

  // Apply Presets
  const handleApplyPreset = (presetId: string) => {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    setConfig((prev) => ({
      ...prev,
      ...preset.config,
    }));
    showToast(`"${preset.name}" টেমপ্লেট প্রয়োগ করা হয়েছে`);
  };

  // Load Sample Data with Photo
  const handleLoadSample = async () => {
    const img = await getSampleNewsImage();
    setPhotos([
      {
        id: 'sample-' + Date.now(),
        img,
        name: 'sample-news.png',
        state: { scale: 1, x: 0, y: 0 },
      },
    ]);
    setSelectedPhotoIndex(0);
    handleApplyPreset('national-news');
    showToast('নমুনা ডেটা ও ফটো লোড সম্পন্ন হয়েছে');
  };

  // Download HD PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    setIsDownloading(true);
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `photo-card-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast('কার্ডটি ডাউনলোড করা হয়েছে!');
    } catch (err) {
      console.error(err);
      showToast('ডাউনলোড করতে সমস্যা হয়েছে');
    } finally {
      setIsDownloading(false);
    }
  };

  // Copy Image to Clipboard
  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({
              'image/png': blob,
            }),
          ]);
          setIsCopied(true);
          showToast('ইমেজটি ক্লিপবোর্ডে কপি করা হয়েছে!');
          setTimeout(() => setIsCopied(false), 2500);
        } catch (err) {
          console.error(err);
          // Fallback message
          showToast('সরাসরি কপি সমর্থিত নয়, অনুগ্রহ করে ডাউনলোড করুন');
        }
      }, 'image/png');
    } catch (err) {
      console.error(err);
    }
  };

  // Reset to Defaults
  const handleReset = () => {
    setConfig({
      ...DEFAULT_CONFIG,
      dateText: getTodayBengaliDate(),
    });
    setPhotos([]);
    setSelectedPhotoIndex(0);
    showToast('সবকিছু রিসেট করা হয়েছে');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* App Header */}
      <Header
        aspectRatio={config.aspectRatio}
        onSelectAspectRatio={(ratio: AspectRatio) => setConfig((prev) => ({ ...prev, aspectRatio: ratio }))}
        onDownload={handleDownload}
        onCopyImage={handleCopyImage}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        isCopied={isCopied}
        isDownloading={isDownloading}
      />

      {/* Main Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-5 items-start">
        {/* Sidebar Controls */}
        <Sidebar
          config={config}
          onChangeConfig={setConfig}
          photos={photos}
          selectedPhotoIndex={selectedPhotoIndex}
          onSelectPhotoIndex={setSelectedPhotoIndex}
          onAddPhotos={handleAddPhotos}
          onRemovePhoto={handleRemovePhoto}
          onUpdateSelectedPhoto={handleUpdateSelectedPhoto}
          onApplyPreset={handleApplyPreset}
          onUploadLogo={handleUploadLogo}
          onRemoveCustomLogo={handleRemoveCustomLogo}
        />

        {/* Live Canvas Preview */}
        <CardPreview
          config={config}
          photos={photos}
          selectedPhotoIndex={selectedPhotoIndex}
          onUpdateSelectedPhoto={handleUpdateSelectedPhoto}
          onDownload={handleDownload}
          onCopyImage={handleCopyImage}
          isCopied={isCopied}
          canvasRef={canvasRef}
        />
      </main>

      {/* Developer Signature Footer */}
      <footer className="py-3 px-4 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        <p>
          Photo Card Maker Pro • Crafted with precision <span className="text-amber-400/90 font-medium ml-1">By Sajidul Islam Pathan</span>
        </p>
      </footer>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
