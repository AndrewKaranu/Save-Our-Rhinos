import React, { useState } from 'react';
import { PhotobookLanding } from '@/components/PhotobookLanding';
import { PhotobookViewer } from '@/components/PhotobookViewer';
import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [pages, setPages] = useState<PhotobookPage[]>([]);
  const [metadata, setMetadata] = useState<PhotobookMetadata | null>(null);
  const [isViewing, setIsViewing] = useState(false);
  const { toast } = useToast();

  const handleViewPhotobook = (photobookPages: PhotobookPage[], photobookMetadata: PhotobookMetadata) => {
    setPages(photobookPages);
    setMetadata(photobookMetadata);
    setIsViewing(true);
    
    toast({
      title: "Photobook Loaded!",
      description: `Ready to view ${photobookPages.length} pages. Use arrow keys or swipe to navigate.`,
    });
  };

  const handleBackToHome = () => {
    setIsViewing(false);
    setPages([]);
    setMetadata(null);
  };

  if (isViewing && pages.length > 0 && metadata) {
    return (
      <PhotobookViewer 
        pages={pages} 
        metadata={metadata}
        onBack={handleBackToHome}
      />
    );
  }

  return (
    <PhotobookLanding 
      onViewPhotobook={handleViewPhotobook}
    />
  );
};

export default Index;
