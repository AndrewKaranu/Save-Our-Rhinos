import React, { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Slide, SlideShowConfig } from '@/types/slide';
import { animationConfig, keyboardShortcuts, touchConfig } from '@/config/slideshow';
import { ChevronLeft, ChevronRight, Play, Pause, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

gsap.registerPlugin(ScrollTrigger);

interface SlideViewerProps {
  slides: Slide[];
  config: SlideShowConfig;
  onBack?: () => void;
}

export const SlideViewer: React.FC<SlideViewerProps> = ({
  slides,
  config,
  onBack
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [progress, setProgress] = useState(0);
  const autoplayRef = useRef<NodeJS.Timeout>();
  const progressRef = useRef<NodeJS.Timeout>();

  const scrollToSlide = useCallback((slideIndex: number) => {
    if (!slidesRef.current) return;
    
    const slideWidth = window.innerWidth;
    const targetX = slideIndex * slideWidth;
    
    gsap.to(slidesRef.current, {
      x: -targetX,
      duration: animationConfig.transitionDuration,
      ease: animationConfig.transitionEase
    });
    
    setCurrentSlide(slideIndex);
    setProgress(0);
  }, []);

  const nextSlide = useCallback(() => {
    const nextIndex = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    scrollToSlide(nextIndex);
  }, [currentSlide, slides.length, scrollToSlide]);

  const prevSlide = useCallback(() => {
    const prevIndex = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    scrollToSlide(prevIndex);
  }, [currentSlide, slides.length, scrollToSlide]);

  const toggleAutoplay = useCallback(() => {
    setIsAutoplay(!isAutoplay);
  }, [isAutoplay]);

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplay) {
      const currentSlideDuration = slides[currentSlide]?.duration || config.autoplayDuration || 5000;
      
      // Progress animation
      progressRef.current = setInterval(() => {
        setProgress(prev => {
          const increment = 100 / (currentSlideDuration / animationConfig.progressUpdateInterval);
          return prev >= 100 ? 100 : prev + increment;
        });
      }, animationConfig.progressUpdateInterval);

      // Auto advance to next slide
      autoplayRef.current = setTimeout(() => {
        nextSlide();
      }, currentSlideDuration);
    } else {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
      setProgress(0);
    }

    return () => {
      if (autoplayRef.current) clearTimeout(autoplayRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [isAutoplay, currentSlide, nextSlide, slides, config.autoplayDuration]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (keyboardShortcuts.prevSlide.includes(e.key)) {
        prevSlide();
      } else if (keyboardShortcuts.nextSlide.includes(e.key)) {
        e.preventDefault();
        nextSlide();
      } else if (keyboardShortcuts.toggleAutoplay.includes(e.key)) {
        toggleAutoplay();
      } else if (keyboardShortcuts.exitSlideshow.includes(e.key)) {
        if (onBack) onBack();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [nextSlide, prevSlide, toggleAutoplay, onBack]);

  // Touch/swipe support
  useEffect(() => {
    if (!touchConfig.enableSwipe) return;
    
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

      // Check if horizontal swipe is more significant than vertical
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > touchConfig.swipeThreshold) {
        if (diffX > 0) {
          nextSlide();
        } else {
          prevSlide();
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
  }, [nextSlide, prevSlide]);

  const renderSlideContent = (slide: Slide) => {
    switch (slide.type) {
      case 'image':
        return (
          <div className="w-full h-full flex items-center justify-center">
            <img 
              src={slide.content} 
              alt={slide.title || ''} 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        );
      case 'html':
        return (
          <div 
            className="w-full h-full flex items-center justify-center p-8"
            dangerouslySetInnerHTML={{ __html: slide.content }}
          />
        );
      default: // text
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center">
            {slide.title && (
              <h1 className="text-5xl md:text-7xl font-bold mb-8">{slide.title}</h1>
            )}
            <p className="text-xl md:text-2xl max-w-4xl leading-relaxed">{slide.content}</p>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black overflow-hidden select-none"
    >
      {/* Slides Container */}
      <div 
        ref={slidesRef}
        className="flex h-full"
        style={{ width: `${slides.length * 100}vw` }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`w-screen h-full flex-shrink-0 ${slide.backgroundColor || 'bg-gray-900'} ${slide.textColor || 'text-white'}`}
            style={{
              backgroundImage: slide.backgroundImage ? `url(${slide.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {renderSlideContent(slide)}
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      {config.showProgress && (
        <div className="fixed top-0 left-0 w-full z-10">
          <Progress value={(currentSlide / (slides.length - 1)) * 100} className="h-1" />
          {isAutoplay && (
            <Progress value={progress} className="h-1 mt-1" />
          )}
        </div>
      )}

      {/* Controls */}
      {config.showControls && (
        <>
          {/* Navigation Buttons */}
          <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="bg-black/50 border-white/20 text-white hover:bg-white/20"
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
              onClick={nextSlide}
              className="bg-black/50 border-white/20 text-white hover:bg-white/20"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Back Button */}
          {onBack && (
            <Button
              variant="outline"
              onClick={onBack}
              className="fixed top-8 left-8 bg-black/50 border-white/20 text-white hover:bg-white/20 z-10"
            >
              <Home className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}

          {/* Slide Counter */}
          <div className="fixed top-8 right-8 bg-black/50 text-white px-4 py-2 rounded-lg z-10">
            {currentSlide + 1} / {slides.length}
          </div>

          {/* Slide Dots */}
          <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Instructions Overlay (shown briefly) */}
      <div className="fixed bottom-4 left-4 text-white/60 text-sm z-10">
        <p>Use ← → keys, swipe, or buttons to navigate</p>
        <p>Press P for autoplay • ESC to exit</p>
      </div>
    </div>
  );
};
