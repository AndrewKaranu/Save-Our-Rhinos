import * as pdfjsLib from 'pdfjs-dist';
import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';
import { samplePhotobookData } from '@/data/samplePhotobook';

// Set up PDF.js worker with local fallback
try {
  // First try to use local worker file
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
} catch (error) {
  console.warn('Failed to set local worker, falling back to CDN');
  // Fallback to CDN with HTTPS
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export class PhotobookProcessor {
  /**
   * Convert PDF file to photobook pages with high quality rendering
   */
  static async convertPdfToPages(file: File): Promise<{
    pages: PhotobookPage[];
    metadata: PhotobookMetadata;
  }> {
    try {
      console.log('Starting PDF conversion for:', file.name);
      
      const arrayBuffer = await file.arrayBuffer();
      console.log('File loaded, size:', arrayBuffer.byteLength, 'bytes');
      
      const pdf = await pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Reduce PDF.js console output
      }).promise;
      
      console.log('PDF loaded successfully, pages:', pdf.numPages);
      
      const metadata: PhotobookMetadata = {
        title: file.name.replace('.pdf', ''),
        totalPages: pdf.numPages,
        description: 'A beautiful photobook presentation'
      };

      const pages: PhotobookPage[] = [];
      
      // Process pages with progress tracking
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`Processing page ${pageNum}/${pdf.numPages} (${Math.round((pageNum/pdf.numPages)*100)}%)`);
        
        try {
          const page = await pdf.getPage(pageNum);
          const viewport = page.getViewport({ scale: 2.5 }); // High quality for crisp rendering
          
          // Create canvas for rendering
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Could not get canvas context');
          }
          
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          
          // Render page to canvas with optimized settings
          await page.render({
            canvasContext: context,
            viewport: viewport,
            canvas: canvas,
            intent: 'display' // Optimize for display quality
          }).promise;
          
          // Convert to highest quality PNG image
          const imageData = canvas.toDataURL('image/png'); // Maximum quality PNG
          
          const photobookPage: PhotobookPage = {
            id: `page-${pageNum}`,
            pageNumber: pageNum,
            imageData,
            width: viewport.width,
            height: viewport.height,
            aspectRatio: viewport.width / viewport.height
          };
          
          pages.push(photobookPage);
          
          // Clean up
          canvas.remove();
          
          console.log(`Page ${pageNum} processed successfully`);
        } catch (pageError) {
          console.error(`Error processing page ${pageNum}:`, pageError);
          throw new Error(`Failed to process page ${pageNum}: ${pageError.message}`);
        }
      }
      
      console.log('PDF conversion completed successfully');
      return { pages, metadata };
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      if (error.message && error.message.includes('worker')) {
        throw new Error('PDF worker failed to load. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('Invalid PDF')) {
        throw new Error('The PDF file appears to be corrupted or invalid.');
      } else if (error.message && error.message.includes('fetch')) {
        throw new Error('Failed to load PDF file. Please check if the file exists and try again.');
      } else {
        throw new Error(`Failed to process PDF file: ${error.message || 'Unknown error'}`);
      }
    }
  }

  /**
   * Load embedded photobook (for your specific photobook)
   */
  static async loadEmbeddedPhotobook(): Promise<{
    pages: PhotobookPage[];
    metadata: PhotobookMetadata;
  }> {
    try {
      console.log('Loading embedded photobook...');
      
      // Try to load your photobook PDF from the public folder
      console.log('Fetching PDF from /Photo book.pdf...');
      const response = await fetch('/Photo book.pdf');
      
      if (!response.ok) {
        console.warn(`PDF fetch failed with status: ${response.status} ${response.statusText}`);
        console.warn('PDF not found, using sample data');
        return samplePhotobookData;
      }
      
      const blob = await response.blob();
      console.log('PDF blob received, size:', blob.size, 'bytes');
      
      if (blob.size === 0) {
        console.warn('PDF file is empty, using sample data');
        return samplePhotobookData;
      }
      
      console.log('PDF fetched successfully, size:', blob.size, 'bytes');
      
      const file = new File([blob], 'Photo book.pdf', { type: 'application/pdf' });
      console.log('Created file object, starting conversion...');
      
      const result = await this.convertPdfToPages(file);
      console.log('PDF conversion completed successfully!');
      return result;
    } catch (error) {
      console.error('Error loading embedded photobook:', error);
      console.log('Falling back to sample photobook data');
      
      // Always return sample data as fallback instead of throwing error
      return samplePhotobookData;
    }
  }
}
