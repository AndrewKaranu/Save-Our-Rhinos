import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';
import { ChevronLeft, ChevronRight, Play, Pause, Home, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

gsap.registerPlugin(ScrollTrigger);

interface PhotobookViewerProps {
  pages: PhotobookPage[];
  metadata: PhotobookMetadata;
  onBack?: () => void;
}

export const PhotobookViewer: React.FC<PhotobookViewerProps> = ({
  pages,
  metadata,
  onBack
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const autoplayRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();

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
    setProgress(0);
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
    setIsAutoplay(!isAutoplay);
  }, [isAutoplay]);

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.5, 3));
    setIsZoomed(true);
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.5, 0.5));
    if (zoom <= 1) setIsZoomed(false);
  }, [zoom]);

  const resetZoom = useCallback(() => {
    setZoom(1);
    setIsZoomed(false);
  }, []);

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplay) {
      const duration = 4000; // 4 seconds per page
      
      progressRef.current = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (duration / 100);
          return prev >= 100 ? 100 : prev + increment;
        });
      }, 100);

      autoplayRef.current = setTimeout(() => {
        if (currentPage < pages.length - 1) {
          nextPage();
        } else {
          setIsAutoplay(false); // Stop at the end
        }
      }, duration);
    } else {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(0);
    }

    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isAutoplay, currentPage, nextPage, pages.length]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          prevPage();
          break;
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextPage();
          break;
        case 'p':
        case 'P':
          toggleAutoplay();
          break;
        case 'Escape':
          if (isZoomed) {
            resetZoom();
          } else if (onBack) {
            onBack();
          }
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextPage, prevPage, toggleAutoplay, onBack, isZoomed, resetZoom, handleZoomIn, handleZoomOut]);

  // Touch/swipe support
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;
      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) {
          nextPage();
        } else {
          prevPage();
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('touchstart', handleTouchStart);
      container.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [nextPage, prevPage]);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden select-none"
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-20 p-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <h1 className="text-2xl font-bold">{metadata.title}</h1>
            <p className="text-sm opacity-75">{metadata.description}</p>
          </div>
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <Home className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </div>

      {/* Pages Container */}
      <div 
        ref={slidesRef}
        className="flex h-full"
        style={{ width: `${pages.length * 100}vw` }}
      >
        {pages.map((page, index) => (
          <div
            key={page.id}
            className="w-screen h-full flex-shrink-0 flex items-center justify-center p-8"
          >
            <div 
              className="relative max-w-full max-h-full transition-transform duration-300 cursor-pointer"
              style={{ transform: `scale(${zoom})` }}
              onClick={isZoomed ? resetZoom : handleZoomIn}
            >
              <img
                src={page.imageData}
                alt={`Page ${page.pageNumber}`}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
                style={{ 
                  aspectRatio: page.aspectRatio,
                  imageRendering: 'crisp-edges'
                }}
                loading="eager"
                decoding="sync"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-10">
        <Progress value={(currentPage / (pages.length - 1)) * 100} className="h-1" />
        {isAutoplay && (
          <Progress value={progress} className="h-1 mt-1" />
        )}
      </div>

      {/* Controls */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-20">
        {/* Navigation */}
        <Button
          variant="outline"
          size="icon"
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={toggleAutoplay}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20"
        >
          {isAutoplay ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="bg-black/50 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="bg-black/50 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="bg-black/50 border-white/20 text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Page Counter */}
      <div className="fixed bottom-8 right-8 bg-black/50 text-white px-4 py-2 rounded-lg z-20">
        {currentPage + 1} / {pages.length}
      </div>

      {/* Page Thumbnails */}
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 space-y-2 z-20 max-h-96 overflow-y-auto">
        {pages.map((page, index) => (
          <Card
            key={page.id}
            className={`w-16 h-20 cursor-pointer transition-all duration-200 ${
              index === currentPage 
                ? 'ring-2 ring-white bg-white/20' 
                : 'bg-black/30 hover:bg-white/10'
            }`}
            onClick={() => scrollToPage(index)}
          >
            <img
              src={page.imageData}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-full object-cover rounded"
            />
          </Card>
        ))}
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 left-4 text-white/60 text-sm z-20">
        <p>← → Navigate • Space: Next • P: Autoplay</p>
        <p>Click image to zoom • +/- keys to zoom</p>
      </div>
    </div>
  );
};
