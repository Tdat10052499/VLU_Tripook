/**
 * VIETNAMESE HERITAGE SVG PATTERNS
 * Họa tiết di sản Việt Nam - Tinh tế và sang trọng
 * Lấy cảm hứng từ gấm vóc, thổ cẩm, và gốm sứ truyền thống
 */

export const heritagePatterns = {
  /**
   * Pattern 1: Gấm Vóc Hoa Văn (Brocade Floral)
   * Họa tiết hoa văn tinh tế từ gấm vóc truyền thống
   * Dùng cho: Footer background, dividers
   */
  brocadeFloral: `
    <svg width="60" height="60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="brocade-floral" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
          <!-- Subtle geometric flowers -->
          <circle cx="30" cy="30" r="2" fill="#B8860B" opacity="0.15"/>
          <circle cx="0" cy="0" r="2" fill="#B8860B" opacity="0.15"/>
          <circle cx="60" cy="0" r="2" fill="#B8860B" opacity="0.15"/>
          <circle cx="0" cy="60" r="2" fill="#B8860B" opacity="0.15"/>
          <circle cx="60" cy="60" r="2" fill="#B8860B" opacity="0.15"/>
          
          <!-- Connecting lines -->
          <path d="M30,28 L30,20" stroke="#B8860B" stroke-width="0.5" opacity="0.1"/>
          <path d="M28,30 L20,30" stroke="#B8860B" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="60" height="60" fill="url(#brocade-floral)"/>
    </svg>
  `,

  /**
   * Pattern 2: Thổ Cẩm Geometric (Ethnic Geometric)
   * Họa tiết hình học từ thổ cẩm các dân tộc
   * Dùng cho: Section dividers, subtle backgrounds
   */
  ethnicGeometric: `
    <svg width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ethnic-geometric" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <!-- Diamond shapes -->
          <path d="M40,20 L50,40 L40,60 L30,40 Z" fill="none" stroke="#B8860B" stroke-width="0.5" opacity="0.12"/>
          <path d="M0,20 L10,40 L0,60 L-10,40 Z" fill="none" stroke="#B8860B" stroke-width="0.5" opacity="0.12"/>
          <path d="M80,20 L90,40 L80,60 L70,40 Z" fill="none" stroke="#B8860B" stroke-width="0.5" opacity="0.12"/>
          
          <!-- Small accent dots -->
          <circle cx="40" cy="40" r="1.5" fill="#B8860B" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="80" height="80" fill="url(#ethnic-geometric)"/>
    </svg>
  `,

  /**
   * Pattern 3: Gốm Sứ Wave (Ceramic Wave)
   * Họa tiết sóng nước từ gốm sứ Việt Nam
   * Dùng cho: Top/bottom borders, decorative dividers
   */
  ceramicWave: `
    <svg width="100" height="20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ceramic-wave" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
          <!-- Subtle wave pattern -->
          <path d="M0,10 Q25,5 50,10 T100,10" fill="none" stroke="#B8860B" stroke-width="1" opacity="0.2"/>
          <path d="M0,12 Q25,7 50,12 T100,12" fill="none" stroke="#B8860B" stroke-width="0.5" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="100" height="20" fill="url(#ceramic-wave)"/>
    </svg>
  `,

  /**
   * Pattern 4: Lotus Minimal (Hoa Sen Tối Giản)
   * Họa tiết hoa sen đơn giản hóa
   * Dùng cho: Accent elements, card borders
   */
  lotusMinimal: `
    <svg width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="lotus-minimal" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <!-- Simplified lotus petals -->
          <circle cx="20" cy="20" r="3" fill="none" stroke="#B8860B" stroke-width="0.5" opacity="0.15"/>
          <circle cx="20" cy="20" r="1.5" fill="#B8860B" opacity="0.12"/>
          
          <!-- Petal lines -->
          <path d="M20,17 L20,12" stroke="#B8860B" stroke-width="0.5" opacity="0.1"/>
          <path d="M23,18 L27,15" stroke="#B8860B" stroke-width="0.5" opacity="0.1"/>
          <path d="M23,22 L27,25" stroke="#B8860B" stroke-width="0.5" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="40" height="40" fill="url(#lotus-minimal)"/>
    </svg>
  `,

  /**
   * Pattern 5: Border Accent Line
   * Đường viền accent đơn giản với chấm tròn
   * Dùng cho: Section top/bottom borders
   */
  borderAccent: `
    <svg width="200" height="4" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="border-accent" x="0" y="0" width="200" height="4" patternUnits="userSpaceOnUse">
          <line x1="0" y1="2" x2="200" y2="2" stroke="#B8860B" stroke-width="2" opacity="0.3"/>
          <circle cx="100" cy="2" r="2" fill="#B8860B" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="200" height="4" fill="url(#border-accent)"/>
    </svg>
  `
};

/**
 * Helper function to convert SVG string to data URL
 */
export const svgToDataUrl = (svgString: string): string => {
  const cleanSvg = svgString.trim().replace(/\s+/g, ' ');
  return `data:image/svg+xml,${encodeURIComponent(cleanSvg)}`;
};

/**
 * CSS Background style generators
 */
export const patternStyles = {
  // Footer background with brocade pattern
  footerPattern: {
    backgroundImage: svgToDataUrl(heritagePatterns.brocadeFloral),
    backgroundRepeat: 'repeat',
    backgroundSize: '60px 60px',
    backgroundPosition: 'center'
  },

  // Section divider with geometric pattern
  dividerPattern: {
    backgroundImage: svgToDataUrl(heritagePatterns.ethnicGeometric),
    backgroundRepeat: 'repeat-x',
    backgroundSize: '80px 80px',
    backgroundPosition: 'center'
  },

  // Top border accent
  topBorderAccent: {
    backgroundImage: svgToDataUrl(heritagePatterns.ceramicWave),
    backgroundRepeat: 'repeat-x',
    backgroundSize: '100px 20px',
    backgroundPosition: 'top center'
  },

  // Subtle background texture
  subtleTexture: {
    backgroundImage: svgToDataUrl(heritagePatterns.lotusMinimal),
    backgroundRepeat: 'repeat',
    backgroundSize: '40px 40px',
    backgroundPosition: 'center',
    opacity: 0.5
  }
};

/**
 * React inline style patterns (for easy use in components)
 */
export const inlinePatterns = {
  footer: {
    backgroundImage: `url("${svgToDataUrl(heritagePatterns.brocadeFloral)}")`,
    backgroundRepeat: 'repeat',
    backgroundSize: '60px 60px'
  },

  sectionDivider: {
    backgroundImage: `url("${svgToDataUrl(heritagePatterns.ceramicWave)}")`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: '100px 20px',
    height: '20px',
    width: '100%'
  },

  accentBorder: {
    backgroundImage: `url("${svgToDataUrl(heritagePatterns.borderAccent)}")`,
    backgroundRepeat: 'repeat-x',
    backgroundSize: '200px 4px',
    height: '4px',
    width: '100%'
  }
};

const patterns = {
  heritagePatterns,
  svgToDataUrl,
  patternStyles,
  inlinePatterns
};

export default patterns;
