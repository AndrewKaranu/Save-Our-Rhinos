export interface PhotobookPage {
  id: string;
  pageNumber: number;
  imageData: string; // base64 image data
  width: number;
  height: number;
  aspectRatio: number;
}

export interface PhotobookMetadata {
  title: string;
  totalPages: number;
  author?: string;
  description?: string;
}
