import React, { useState, useEffect } from 'react';

interface PhotobookProgressProps {
  totalPages: number;
  currentPage: number;
  onPageSelect: (pageIndex: number) => void;
}

export const PhotobookProgress: React.FC<PhotobookProgressProps> = ({
  totalPages,
  currentPage,
  onPageSelect
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const progressPercentage = ((currentPage + 1) / totalPages) * 100;

  // Auto-hide after 3 seconds, show on mouse move
  useEffect(() => {
    const hideTimer = setTimeout(() => setIsVisible(false), 3000);
    
    const handleMouseMove = () => {
      setIsVisible(true);
      clearTimeout(hideTimer);
      setTimeout(() => setIsVisible(false), 3000);
    };

    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearTimeout(hideTimer);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [currentPage]);

  return (
    <div className={`fixed bottom-4 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
    }`}>
      {/* Minimal Progress Bar */}
      <div className="bg-background/10 backdrop-blur-sm rounded-full px-4 py-2 border border-border/20 hover:bg-background/20 transition-all duration-300 group">
        <div className="flex items-center space-x-3">
          {/* Thin Progress Bar */}
          <div 
            className="relative w-32 h-1 bg-background/20 rounded-full overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              const pageIndex = Math.floor(percentage * totalPages);
              onPageSelect(Math.min(pageIndex, totalPages - 1));
            }}
          >
            <div 
              className="absolute left-0 top-0 h-full bg-primary/80 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Compact Page Counter */}
          <div className="text-xs text-photobook-text/80 font-medium min-w-[2.5rem] text-center">
            {currentPage + 1}/{totalPages}
          </div>
        </div>

        {/* Tooltip on hover */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm text-xs text-foreground px-2 py-1 rounded border border-border/30 whitespace-nowrap">
            Click to jump to page
          </div>
        </div>
      </div>
    </div>
  );
};