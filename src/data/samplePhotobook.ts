import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';

/**
 * Helper function to safely encode SVG for data URL
 */
const encodeSVG = (svgString: string): string => {
  // Use encodeURIComponent instead of btoa to handle Unicode characters
  return 'data:image/svg+xml,' + encodeURIComponent(svgString);
};

/**
 * Sample photobook data for testing/fallback
 */
export const samplePhotobookData: {
  pages: PhotobookPage[];
  metadata: PhotobookMetadata;
} = {
  metadata: {
    title: 'Sample Photobook',
    totalPages: 4,
    description: 'A sample photobook to demonstrate the interface'
  },
  pages: [
    {
      id: 'page-1',
      pageNumber: 1,
      imageData: encodeSVG(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad1)"/>
          <text x="400" y="250" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">Welcome to</text>
          <text x="400" y="320" font-family="Arial, sans-serif" font-size="64" fill="white" text-anchor="middle" font-weight="bold">My Photobook</text>
          <text x="400" y="400" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">A beautiful presentation experience</text>
          <text x="400" y="500" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">Page 1 of 4</text>
        </svg>
      `),
      width: 800,
      height: 600,
      aspectRatio: 800 / 600
    },
    {
      id: 'page-2',
      pageNumber: 2,
      imageData: encodeSVG(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#ffecd2;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fcb69f;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad2)"/>
          <rect x="100" y="100" width="600" height="400" fill="rgba(255,255,255,0.9)" rx="10"/>
          <text x="400" y="180" font-family="Arial, sans-serif" font-size="36" fill="#333" text-anchor="middle" font-weight="bold">Features</text>
          <text x="150" y="240" font-family="Arial, sans-serif" font-size="20" fill="#666">• Smooth GSAP animations</text>
          <text x="150" y="280" font-family="Arial, sans-serif" font-size="20" fill="#666">• Zoom functionality</text>
          <text x="150" y="320" font-family="Arial, sans-serif" font-size="20" fill="#666">• Responsive design</text>
          <text x="150" y="360" font-family="Arial, sans-serif" font-size="20" fill="#666">• Keyboard navigation</text>
          <text x="150" y="400" font-family="Arial, sans-serif" font-size="20" fill="#666">• Touch/swipe support</text>
          <text x="400" y="550" font-family="Arial, sans-serif" font-size="18" fill="rgba(0,0,0,0.5)" text-anchor="middle">Page 2 of 4</text>
        </svg>
      `),
      width: 800,
      height: 600,
      aspectRatio: 800 / 600
    },
    {
      id: 'page-3',
      pageNumber: 3,
      imageData: encodeSVG(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#a8edea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#fed6e3;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad3)"/>
          <circle cx="400" cy="300" r="200" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" stroke-width="3"/>
          <circle cx="400" cy="300" r="150" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.4)" stroke-width="2"/>
          <circle cx="400" cy="300" r="100" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
          <text x="400" y="200" font-family="Arial, sans-serif" font-size="32" fill="#333" text-anchor="middle" font-weight="bold">Navigation</text>
          <text x="400" y="280" font-family="Arial, sans-serif" font-size="18" fill="#555" text-anchor="middle">← → Arrow keys</text>
          <text x="400" y="310" font-family="Arial, sans-serif" font-size="18" fill="#555" text-anchor="middle">Space: Next page</text>
          <text x="400" y="340" font-family="Arial, sans-serif" font-size="18" fill="#555" text-anchor="middle">P: Autoplay</text>
          <text x="400" y="370" font-family="Arial, sans-serif" font-size="18" fill="#555" text-anchor="middle">Click: Zoom</text>
          <text x="400" y="550" font-family="Arial, sans-serif" font-size="18" fill="rgba(0,0,0,0.5)" text-anchor="middle">Page 3 of 4</text>
        </svg>
      `),
      width: 800,
      height: 600,
      aspectRatio: 800 / 600
    },
    {
      id: 'page-4',
      pageNumber: 4,
      imageData: encodeSVG(`
        <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad4" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grad4)"/>
          <text x="400" y="200" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">Thank You!</text>
          <text x="400" y="300" font-family="Arial, sans-serif" font-size="24" fill="rgba(255,255,255,0.8)" text-anchor="middle">Ready to add your own content?</text>
          <text x="400" y="350" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.7)" text-anchor="middle">Replace "Photobook cover.pdf" in the public folder</text>
          <text x="400" y="380" font-family="Arial, sans-serif" font-size="20" fill="rgba(255,255,255,0.7)" text-anchor="middle">with your own PDF file</text>
          <text x="400" y="450" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.6)" text-anchor="middle">Made with React + GSAP</text>
          <text x="400" y="550" font-family="Arial, sans-serif" font-size="18" fill="rgba(255,255,255,0.5)" text-anchor="middle">Page 4 of 4</text>
        </svg>
      `),
      width: 800,
      height: 600,
      aspectRatio: 800 / 600
    }
  ]
};
