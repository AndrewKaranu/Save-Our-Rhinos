import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';

export class PreprocessedPhotobookLoader {
  /**
   * Load pre-processed photobook data if available, otherwise fall back to real-time processing
   */
  static async loadPreprocessedPhotobook(): Promise<{
    pages: PhotobookPage[];
    metadata: PhotobookMetadata;
  }> {
    try {
      console.log('🚀 Checking for pre-processed photobook data...');
      
      // Try to load pre-processed data first
      const response = await fetch('/processed-photobook.json');
      
      if (response.ok) {
        console.log('✅ Found pre-processed data, loading instantly...');
        const data = await response.json();
        
        console.log(`📖 Loaded ${data.pages.length} pre-processed pages instantly!`);
        return data;
      } else {
        throw new Error('Pre-processed data not found');
      }
    } catch (error) {
      console.log('⚠️ Pre-processed data not available, falling back to real-time processing...');
      
      // Fall back to the original PhotobookProcessor
      const { PhotobookProcessor } = await import('./photobookProcessor');
      return await PhotobookProcessor.loadEmbeddedPhotobook();
    }
  }
}
