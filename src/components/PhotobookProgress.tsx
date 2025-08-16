import React from 'react';

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
  const progressPercentage = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background/20 backdrop-blur-md rounded-full px-6 py-4 border border-border/30">
        <div className="flex items-center space-x-4">
          {/* Progress Bar */}
          <div className="relative w-64 h-2 bg-background/20 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-progress rounded-full transition-all duration-300 animate-progress-glow"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Page Dots */}
          <div className="flex items-center space-x-2">
            {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
              const pageIndex = Math.floor((index / 9) * (totalPages - 1));
              const isActive = Math.abs(currentPage - pageIndex) <= totalPages / 10;
              
              return (
                <button
                  key={index}
                  onClick={() => onPageSelect(pageIndex)}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-300 hover:scale-150
                    ${isActive 
                      ? 'bg-photobook-accent shadow-glow scale-125' 
                      : 'bg-background/40 hover:bg-photobook-accent/60'
                    }
                  `}
                  aria-label={`Go to page ${pageIndex + 1}`}
                />
              );
            })}
          </div>

          {/* Current Page Text */}
          <div className="text-sm text-photobook-text font-medium min-w-[3rem] text-center">
            {currentPage + 1}/{totalPages}
          </div>
        </div>
      </div>

      {/* Keyboard Hint */}
      <div className="mt-4 text-center">
        <p className="text-xs text-muted-foreground">
          Use arrow keys, scroll, or swipe to navigate
        </p>
      </div>
    </div>
  );
};