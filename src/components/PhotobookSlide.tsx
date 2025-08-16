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
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!slideRef.current || !backgroundRef.current) return;

    if (isActive) {
      // Parallax effect when slide becomes active
      gsap.fromTo(backgroundRef.current, 
        { scale: 1.1, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" }
      );
      
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [isActive]);

  return (
    <div 
      ref={slideRef}
      className="relative w-screen h-screen flex-shrink-0 overflow-hidden"
    >
      {/* Background Image with Parallax */}
      <div 
        ref={backgroundRef}
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `url(${page.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-overlay opacity-60" />
      </div>

      {/* Text Content Overlay */}
      {page.textContent && (
        <div 
          ref={contentRef}
          className="absolute bottom-0 left-0 right-0 p-8 md:p-16"
        >
          <div className="max-w-4xl">
            <div className="bg-background/10 backdrop-blur-md rounded-xl p-6 border border-border/20">
              <p className="text-photobook-text text-lg md:text-xl leading-relaxed font-light">
                {page.textContent}
              </p>
            </div>
          </div>
        </div>
      )}

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