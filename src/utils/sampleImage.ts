// Generates a high-quality SVG data-URI image for news demonstration
export function getSampleNewsImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1080" height="720" viewBox="0 0 1080 720">
        <defs>
          <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0f2027"/>
            <stop offset="40%" stop-color="#203a43"/>
            <stop offset="100%" stop-color="#2c5364"/>
          </linearGradient>
          <linearGradient id="sun" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#f6d365"/>
            <stop offset="100%" stop-color="#fda085"/>
          </linearGradient>
          <linearGradient id="bldg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#141E30"/>
            <stop offset="100%" stop-color="#243B55"/>
          </linearGradient>
        </defs>
        <rect width="1080" height="720" fill="url(#sky)"/>
        
        <!-- Glowing Sun / Light -->
        <circle cx="540" cy="300" r="140" fill="url(#sun)" opacity="0.6"/>
        <circle cx="540" cy="300" r="180" fill="#fda085" opacity="0.25"/>

        <!-- Parliament / Monument Architectural Shapes -->
        <polygon points="540,160 560,240 520,240" fill="#e2e8f0" opacity="0.9"/>
        <rect x="420" y="240" width="240" height="180" fill="url(#bldg)" rx="8"/>
        <polygon points="400,240 540,180 680,240" fill="#334155"/>
        
        <!-- Architectural Pillars -->
        <rect x="440" y="270" width="20" height="140" fill="#e2e8f0" opacity="0.8"/>
        <rect x="480" y="270" width="20" height="140" fill="#e2e8f0" opacity="0.8"/>
        <rect x="520" y="270" width="20" height="140" fill="#e2e8f0" opacity="0.8"/>
        <rect x="560" y="270" width="20" height="140" fill="#e2e8f0" opacity="0.8"/>
        <rect x="600" y="270" width="20" height="140" fill="#e2e8f0" opacity="0.8"/>
        <rect x="640" y="270" width="20" height="140" fill="#e2e8f0" opacity="0.8"/>

        <!-- City Skyline silhouettes -->
        <rect x="80" y="320" width="80" height="260" fill="#0f172a" opacity="0.7"/>
        <rect x="180" y="280" width="110" height="300" fill="#1e293b" opacity="0.8"/>
        <rect x="310" y="340" width="70" height="240" fill="#0f172a" opacity="0.6"/>
        <rect x="700" y="300" width="90" height="280" fill="#1e293b" opacity="0.8"/>
        <rect x="810" y="260" width="120" height="320" fill="#0f172a" opacity="0.7"/>
        <rect x="950" y="330" width="70" height="250" fill="#1e293b" opacity="0.6"/>

        <!-- Lake Reflection / Foreground -->
        <rect x="0" y="480" width="1080" height="240" fill="#091522"/>
        <ellipse cx="540" cy="530" rx="360" ry="15" fill="#fda085" opacity="0.3"/>
        <ellipse cx="540" cy="560" rx="280" ry="10" fill="#fda085" opacity="0.2"/>
        <ellipse cx="540" cy="590" rx="200" ry="8" fill="#fda085" opacity="0.15"/>
      </svg>
    `;

    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.src = url;
  });
}
