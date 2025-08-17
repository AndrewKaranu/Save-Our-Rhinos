import * as pdfjsLib from 'pdfjs-dist';
import fs from 'fs';
import path from 'path';

// Set up PDF.js worker for Node.js environment
const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.min.js');

export async function preprocessPDF() {
  try {
    console.log('🔄 Pre-processing PDF for optimal loading...');
    
    // Read the PDF file
    const pdfPath = path.join(process.cwd(), 'public', 'Photo book.pdf');
    const pdfBuffer = fs.readFileSync(pdfPath);
    
    console.log('📖 PDF loaded, processing pages...');
    
    const pdf = await pdfjsLib.getDocument({ 
      data: pdfBuffer,
      verbosity: 0 
    }).promise;
    
    const pages = [];
    const metadata = {
      title: 'Save our Rhinos',
      totalPages: pdf.numPages,
      description: 'A powerful journey documenting the urgent need to protect these magnificent creatures'
    };
    
    // Process each page with optimal settings
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${pdf.numPages}...`);
      
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // Balanced quality/performance
      
      // Create a virtual canvas for Node.js
      const { createCanvas } = await import('canvas');
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      // Render page
      await page.render({
        canvasContext: context,
        viewport: viewport
      }).promise;
      
      // Convert to optimized image data
      const imageData = canvas.toDataURL('image/webp', 0.8); // Use WebP for better compression
      
      pages.push({
        id: `page-${pageNum}`,
        pageNumber: pageNum,
        imageData,
        width: viewport.width,
        height: viewport.height,
        aspectRatio: viewport.width / viewport.height
      });
    }
    
    const result = { pages, metadata };
    
    // Save processed data to public folder
    const outputPath = path.join(process.cwd(), 'public', 'processed-photobook.json');
    fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
    
    console.log('✅ PDF pre-processing complete!');
    console.log(`📊 Generated ${pages.length} optimized pages`);
    console.log(`💾 Saved to: ${outputPath}`);
    
    return result;
  } catch (error) {
    console.error('❌ Error pre-processing PDF:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  preprocessPDF();
}
