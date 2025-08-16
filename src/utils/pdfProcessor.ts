import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface PhotobookPage {
  id: string;
  imageUrl: string;
  pageNumber: number;
  width: number;
  height: number;
  textContent?: string;
}

export class PdfProcessor {
  static async convertPdfToImages(file: File): Promise<PhotobookPage[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      const pages: PhotobookPage[] = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        
        // Get viewport for high-quality rendering
        const viewport = page.getViewport({ scale: 2.0 });
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        if (!context) {
          throw new Error('Could not get canvas context');
        }
        
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render page to canvas
        const renderContext = {
          canvasContext: context,
          viewport: viewport,
          canvas: canvas
        };
        
        await page.render(renderContext).promise;
        
        // Extract text content
        let textContent = '';
        try {
          const text = await page.getTextContent();
          textContent = text.items
            .map((item: any) => item.str)
            .join(' ')
            .trim();
        } catch (error) {
          console.warn('Could not extract text from page:', pageNum, error);
        }
        
        // Convert canvas to blob URL
        const imageUrl = canvas.toDataURL('image/jpeg', 0.9);
        
        pages.push({
          id: `page-${pageNum}`,
          imageUrl,
          pageNumber: pageNum,
          width: viewport.width,
          height: viewport.height,
          textContent: textContent || undefined
        });
        
        // Clean up
        canvas.remove();
      }
      
      return pages;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  }
}