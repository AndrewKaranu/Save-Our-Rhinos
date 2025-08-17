import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';

// Your actual photo collection
const photoFiles = [
  '20190728-IMG_7212.jpg',
  '20190728-IMG_7220.jpg',
  '20190728-IMG_7235.jpg',
  '20190728-IMG_7237-2.jpg',
  '20190728-IMG_7243.jpg',
  '20190728-IMG_7647.jpg',
  '20190729-IMG_8251-2.jpg',
  '20190729-IMG_8267.jpg',
  '20190729-IMG_8284-2.jpg',
  '20190729-IMG_8285.jpg',
  '20190729-IMG_8321.jpg',
  'IMG_20190908_192254.jpg'
];

export class PhotoCollectionLoader {
  /**
   * Load your actual photo collection
   */
  static async loadPhotoCollection(): Promise<{
    pages: PhotobookPage[];
    metadata: PhotobookMetadata;
  }> {
    try {
      console.log('Loading photo collection...');
      
      const metadata: PhotobookMetadata = {
        title: 'My Photo Collection',
        totalPages: photoFiles.length,
        description: 'A beautiful collection of memories captured in time'
      };

      const pages: PhotobookPage[] = photoFiles.map((filename, index) => ({
        id: `photo-${index + 1}`,
        pageNumber: index + 1,
        imageData: `/Photos/${filename}`,
        width: 1920, // Default dimensions, will be adjusted by CSS
        height: 1080,
        aspectRatio: 16 / 9 // Will be overridden by actual image
      }));

      console.log(`Loaded ${pages.length} photos successfully`);
      return { pages, metadata };
    } catch (error) {
      console.error('Error loading photo collection:', error);
      throw new Error('Failed to load photo collection');
    }
  }

  /**
   * Get preview photos for homepage
   */
  static getPreviewPhotos(count: number = 6): string[] {
    return photoFiles
      .slice(0, count)
      .map(filename => `/Photos/${filename}`);
  }

  /**
   * Get random hero photo for homepage
   */
  static getHeroPhoto(): string {
    const randomIndex = Math.floor(Math.random() * photoFiles.length);
    return `/Photos/${photoFiles[randomIndex]}`;
  }
}
