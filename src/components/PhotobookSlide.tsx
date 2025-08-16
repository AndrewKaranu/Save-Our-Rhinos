import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PhotobookPage } from '@/utils/pdfProcessor';

interface PhotobookSlideProps {
  page: PhotobookPage;
  isActive: boolean;
  index: number;
}

export const PhotobookSlide: React.FC<PhotobookSlideProps> = ({
  page,
  isActive,
  index
}) => {
  const slideRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slideRef.current || !containerRef.current) return;

    if (isActive) {
      // Smooth entrance animation
      gsap.fromTo(containerRef.current, 
        { scale: 1.05, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
      );
    }
  }, [isActive]);

  useEffect(() => {
    if (!canvasRef.current || !page.pdfPage) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;

    // Set canvas size
    canvas.width = page.viewport.width;
    canvas.height = page.viewport.height;

    // Render PDF page to canvas
    const renderContext = {
      canvasContext: context,
      viewport: page.viewport
    } as any;

    page.pdfPage.render(renderContext);
  }, [page.pdfPage, page.viewport]);

  return (
    <div 
      ref={slideRef}
      className="relative w-screen h-screen flex-shrink-0 overflow-hidden bg-background"
    >
      {/* PDF Canvas Container with centering */}
      <div 
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center p-8"
      >
        <canvas
          ref={canvasRef}
          className="max-w-full max-h-full object-contain shadow-cinematic rounded-lg"
        />
      </div>

      {/* Page Number Badge */}
      <div className="absolute top-8 left-8 bg-background/20 backdrop-blur-sm px-3 py-1 rounded-full border border-border/30">
        <span className="text-sm text-photobook-text font-medium">
          {page.pageNumber}
        </span>
      </div>

      {/* Subtle Animation Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-parallax-float" />
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-accent/5 rounded-full blur-2xl animate-parallax-float" style={{ animationDelay: '2s' }} />
      </div>
    </div>
  );
};