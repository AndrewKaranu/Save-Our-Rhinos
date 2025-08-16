import React, { useState } from 'react';
import { PhotobookUpload } from '@/components/PhotobookUpload';
import { PhotobookViewer } from '@/components/PhotobookViewer';
import { PdfProcessor, PhotobookPage } from '@/utils/pdfProcessor';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [pages, setPages] = useState<PhotobookPage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isViewing, setIsViewing] = useState(false);
  const { toast } = useToast();

  const handlePdfUpload = async (file: File) => {
    setIsLoading(true);
    
    try {
      toast({
        title: "Processing PDF...",
        description: "Converting pages to images for optimal viewing",
      });

      const processedPages = await PdfProcessor.convertPdfToImages(file);
      setPages(processedPages);
      setIsViewing(true);
      
      toast({
        title: "Success!",
        description: `Converted ${processedPages.length} pages. Enjoy your cinematic experience!`,
      });
    } catch (error) {
      console.error('Error processing PDF:', error);
      toast({
        title: "Error",
        description: "Failed to process PDF. Please try a different file.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToUpload = () => {
    setIsViewing(false);
    setPages([]);
  };

  if (isViewing && pages.length > 0) {
    return (
      <PhotobookViewer 
        pages={pages} 
        onBack={handleBackToUpload}
      />
    );
  }

  return (
    <PhotobookUpload 
      onPdfUpload={handlePdfUpload}
      isLoading={isLoading}
    />
  );
};

export default Index;
