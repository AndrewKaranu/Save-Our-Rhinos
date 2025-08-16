import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
GlobalWorkerOptions.workerSrc = workerSrc;

export interface PhotobookPage {
  id: string;
  pageNumber: number;
  pdfPage: any; // PDF.js page object
  viewport: any; // PDF.js viewport
}

export class PdfProcessor {
  static async convertPdfToPages(file: File): Promise<PhotobookPage[]> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      
      const pages: PhotobookPage[] = [];
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const pdfPage = await pdf.getPage(pageNum);
        
        // Get viewport for display
        const viewport = pdfPage.getViewport({ scale: 1.5 });
        
        pages.push({
          id: `page-${pageNum}`,
          pageNumber: pageNum,
          pdfPage: pdfPage,
          viewport: viewport
        });
      }
      
      return pages;
    } catch (error) {
      console.error('Error processing PDF:', error);
      throw new Error('Failed to process PDF file');
    }
  }
}