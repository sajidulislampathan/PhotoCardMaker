export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

export type PhotoLayoutMode = 'auto' | 'side' | 'grid' | 'stack';

export type WatermarkDesign = 'dark' | 'gold' | 'glass' | 'pill' | 'neon' | 'minimal' | 'ribbon' | 'gradient';

export type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center-top';

export type LogoStyle = 'original' | 'circle' | 'rounded' | 'glass' | 'none';

export type DatePosition = 'header-right' | 'header-left' | 'category-row' | 'footer-row';

export type TextAlignment = 'center' | 'left';

export type HeadlineStyle = 'gold' | 'white' | 'yellow' | 'red' | 'cyan' | 'custom';

export interface PhotoItem {
  id: string;
  img: HTMLImageElement;
  name: string;
  state: {
    x: number;
    y: number;
    scale: number;
  };
}

export interface PhotoFilters {
  brightness: number; // 0.5 to 1.5, default 1
  contrast: number;   // 0.5 to 1.5, default 1
  saturation: number; // 0 to 2, default 1
  grayscale: boolean;
  vignette: boolean;
}

export interface SocialLinks {
  showFacebook: boolean;
  facebookHandle: string;
  showYoutube: boolean;
  youtubeHandle: string;
  showInstagram: boolean;
  instagramHandle: string;
  showTwitter: boolean;
  twitterHandle: string;
  showTelegram: boolean;
  telegramHandle: string;
  unifiedHandle: string; // e.g. @banglanews24
  useUnifiedHandle: boolean;
}

export interface GradientDef {
  n: string;
  type: 'mesh' | 'diagonal' | 'radial' | 'angular' | 'duotone';
  def?: boolean;
  base?: string;
  blobs?: Array<{ x: number; y: number; r: number; c: string; a: number }>;
  s?: string[];
  angle?: number;
  cx?: number;
  cy?: number;
  sweep?: boolean;
}

export interface CardConfig {
  aspectRatio: AspectRatio;
  bannerHeightPercent: number; // 24 to 45%
  
  // News content
  category: string;
  showCategory: boolean;
  categoryStyle: 'red-badge' | 'gold-badge' | 'modern-tag' | 'minimal-line';
  
  headline: string;
  headlineSize: number; // 26 to 52
  headlineFont: string; // 'Noto Serif Bengali', 'Noto Sans Bengali', 'Hind Siliguri'
  headlineStyle: HeadlineStyle;
  customHeadlineColor: string;
  textAlign: TextAlignment;

  caption: string;
  showCaption: boolean;
  captionSize: number; // 16 to 32
  captionFont: string;
  captionColor: string;

  // Date
  showDate: boolean;
  dateText: string;
  datePosition: DatePosition;

  // Logo & Branding
  showLogo: boolean;
  logoImg: HTMLImageElement | null;
  logoPreset: string; // 'preset-news' | 'preset-tv' | 'preset-quote' | 'custom'
  logoPosition: LogoPosition;
  logoStyle: LogoStyle;
  logoSize: number; // 35 to 100
  brandName: string;
  showBrandName: boolean;

  // Watermark / Source
  watermark: string;
  showWatermark: boolean;
  watermarkDesign: WatermarkDesign;
  watermarkPosition: 'top-left' | 'top-right' | 'bottom-left';

  // Footer & Links
  showFooter: boolean;
  websiteUrl: string;
  showWebsite: boolean;
  socials: SocialLinks;
  footerBgStyle: 'dark-translucent' | 'solid-dark' | 'line-only' | 'gradient';

  // Divider style
  dividerStyle: 'gold' | 'red' | 'cyan' | 'white' | 'none';
  dividerThickness: number; // 1 to 6

  // Gradient
  selectedGradient: GradientDef;
  customGradientColor: string;

  // Photos
  layoutMode: PhotoLayoutMode;
  filters: PhotoFilters;
}
