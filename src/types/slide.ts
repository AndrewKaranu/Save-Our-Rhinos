export interface Slide {
  id: string;
  title?: string;
  content: string;
  type: 'image' | 'text' | 'html';
  backgroundImage?: string;
  backgroundColor?: string;
  textColor?: string;
  duration?: number; // for autoplay
}

export interface SlideShowConfig {
  title: string;
  description?: string;
  autoplayDuration?: number;
  showProgress?: boolean;
  showControls?: boolean;
  theme?: 'dark' | 'light' | 'auto';
}
