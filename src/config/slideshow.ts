import { SlideShowConfig } from '@/types/slide';

/**
 * Global slideshow configuration
 * Customize these settings to match your presentation needs
 */
export const slideshowConfig: SlideShowConfig = {
  // Basic settings
  title: 'My Project Slideshow',
  description: 'A beautiful presentation of my work',
  
  // Timing settings
  autoplayDuration: 5000, // Default duration for each slide in milliseconds
  
  // UI settings
  showProgress: true,      // Show progress bar at top
  showControls: true,      // Show navigation controls
  
  // Theme settings
  theme: 'dark'           // 'dark' | 'light' | 'auto'
};

/**
 * Animation settings
 * Modify these to change the slideshow animations
 */
export const animationConfig = {
  // Transition settings
  transitionDuration: 0.8,    // Duration of slide transitions in seconds
  transitionEase: "power2.inOut", // GSAP easing function
  
  // Auto-advance settings
  progressUpdateInterval: 100, // How often to update progress bar in ms
};

/**
 * Keyboard shortcuts
 * Customize the keyboard controls
 */
export const keyboardShortcuts = {
  nextSlide: ['ArrowRight', ' '], // Right arrow or spacebar
  prevSlide: ['ArrowLeft'],       // Left arrow
  toggleAutoplay: ['p', 'P'],     // P key
  exitSlideshow: ['Escape'],      // Escape key
};

/**
 * Touch/Swipe settings
 */
export const touchConfig = {
  swipeThreshold: 50,        // Minimum distance for swipe recognition in pixels
  enableSwipe: true,         // Enable touch/swipe navigation
};
