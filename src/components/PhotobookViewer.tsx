import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhotobookPage } from '@/utils/pdfProcessor';
import { PhotobookProgress } from './PhotobookProgress';
import { PhotobookSlide } from './PhotobookSlide';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface PhotobookViewerProps {
  pages: PhotobookPage[];
  onBack: () => void;
}

export const PhotobookViewer: React.FC<PhotobookViewerProps> = ({
  pages,
  onBack
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout>();

  const scrollToPage = useCallback((pageIndex: number) => {
    if (!slidesRef.current) return;
    
    const slideWidth = window.innerWidth;
    const targetX = pageIndex * slideWidth;
    
    gsap.to(slidesRef.current, {
      x: -targetX,
      duration: 0.8,
      ease: "power2.inOut"
    });
    
    setCurrentPage(pageIndex);
  }, []);

  const nextPage = useCallback(() => {
    const nextIndex = Math.min(currentPage + 1, pages.length - 1);
    scrollToPage(nextIndex);
  }, [currentPage, pages.length, scrollToPage]);

  const prevPage = useCallback(() => {
    const prevIndex = Math.max(currentPage - 1, 0);
    scrollToPage(prevIndex);
  }, [currentPage, scrollToPage]);

  const toggleAutoplay = useCallback(() => {
    setIsAutoplay(prev => {
      if (!prev) {
        // Start autoplay
        autoplayRef.current = setInterval(() => {
          setCurrentPage(current => {
            const next = current + 1;
            if (next >= pages.length) {
              return 0; // Loop back to start
            }
            scrollToPage(next);
            return next;
          });
        }, 4000);
      } else {
        // Stop autoplay
        if (autoplayRef.current) {
          clearInterval(autoplayRef.current);
        }
      }
      return !prev;
    });
  }, [pages.length, scrollToPage]);

  useEffect(() => {
    if (!containerRef.current || !slidesRef.current) return;

    // Set up horizontal scrolling with mouse wheel
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        // Horizontal scroll
        if (e.deltaX > 0 && currentPage < pages.length - 1) {
          nextPage();
        } else if (e.deltaX < 0 && currentPage > 0) {
          prevPage();
        }
      } else {
        // Convert vertical scroll to horizontal
        if (e.deltaY > 0 && currentPage < pages.length - 1) {
          nextPage();
        } else if (e.deltaY < 0 && currentPage > 0) {
          prevPage();
        }
      }
    };

    // Set up touch/swipe handling
    let startX = 0;
    let startY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const deltaX = startX - endX;
      const deltaY = startY - endY;
      
      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0 && currentPage < pages.length - 1) {
          nextPage();
        } else if (deltaX < 0 && currentPage > 0) {
          prevPage();
        }
      }
    };

    // Keyboard navigation
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          prevPage();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          nextPage();
          break;
        case 'Home':
          e.preventDefault();
          scrollToPage(0);
          break;
        case 'End':
          e.preventDefault();
          scrollToPage(pages.length - 1);
          break;
      }
    };

    const container = containerRef.current;
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('keydown', handleKeyDown);
      
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [currentPage, pages.length, nextPage, prevPage, scrollToPage]);

  // Clean up autoplay on unmount
  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-background overflow-hidden cursor-none"
    >
      {/* Navigation Controls */}
      <div className="fixed top-6 left-6 z-50 flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/80"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={toggleAutoplay}
          className="bg-background/80 backdrop-blur-sm border-border/50 hover:bg-accent/80"
        >
          {isAutoplay ? (
            <>
              <Pause className="w-4 h-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Auto
            </>
          )}
        </Button>
      </div>

      {/* Page Counter */}
      <div className="fixed top-6 right-6 z-50 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-border/50">
        <span className="text-sm text-muted-foreground">
          {currentPage + 1} / {pages.length}
        </span>
      </div>

      {/* Slides Container */}
      <div 
        ref={slidesRef}
        className="flex h-full"
        style={{ width: `${pages.length * 100}vw` }}
      >
        {pages.map((page, index) => (
          <PhotobookSlide
            key={page.id}
            page={page}
            isActive={index === currentPage}
            index={index}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      {currentPage > 0 && (
        <Button
          variant="ghost"
          size="lg"
          onClick={prevPage}
          className="fixed left-6 top-1/2 -translate-y-1/2 z-40 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground border border-border/30"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
      )}
      
      {currentPage < pages.length - 1 && (
        <Button
          variant="ghost"
          size="lg"
          onClick={nextPage}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-background/20 backdrop-blur-sm hover:bg-background/40 text-foreground border border-border/30"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      )}

      {/* Progress Indicator */}
      <PhotobookProgress
        totalPages={pages.length}
        currentPage={currentPage}
        onPageSelect={scrollToPage}
      />
    </div>
  );
};