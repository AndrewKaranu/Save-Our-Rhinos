import { Slide, SlideShowConfig } from '@/types/slide';
import { slideshowConfig } from '@/config/slideshow';

// Sample slides data - you can easily modify this or load from an external source
export const sampleSlides: Slide[] = [
  {
    id: '1',
    title: 'Welcome to My Project',
    content: 'This is a beautiful slideshow presentation showcasing my work.',
    type: 'text',
    backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-700',
    textColor: 'text-white',
    duration: 5000
  },
  {
    id: '2',
    title: 'Project Overview',
    content: `
      <div class="space-y-6">
        <h2 class="text-4xl font-bold mb-4">Key Features</h2>
        <ul class="text-xl space-y-3">
          <li>• Smooth animations with GSAP</li>
          <li>• Responsive design</li>
          <li>• Easy content management</li>
          <li>• GitHub Pages deployment</li>
        </ul>
      </div>
    `,
    type: 'html',
    backgroundColor: 'bg-gradient-to-br from-green-500 to-teal-600',
    textColor: 'text-white',
    duration: 6000
  },
  {
    id: '3',
    title: 'Technology Stack',
    content: `
      <div class="grid grid-cols-2 gap-8">
        <div>
          <h3 class="text-2xl font-semibold mb-4">Frontend</h3>
          <ul class="space-y-2">
            <li>React + TypeScript</li>
            <li>Tailwind CSS</li>
            <li>GSAP Animations</li>
            <li>Vite Build Tool</li>
          </ul>
        </div>
        <div>
          <h3 class="text-2xl font-semibold mb-4">Deployment</h3>
          <ul class="space-y-2">
            <li>GitHub Pages</li>
            <li>Automated CI/CD</li>
            <li>Custom Domain Support</li>
          </ul>
        </div>
      </div>
    `,
    type: 'html',
    backgroundColor: 'bg-gradient-to-br from-orange-500 to-red-600',
    textColor: 'text-white',
    duration: 7000
  },
  {
    id: '4',
    title: 'Demo Image',
    content: '/placeholder.svg',
    type: 'image',
    backgroundColor: 'bg-gray-900',
    duration: 4000
  },
  {
    id: '5',
    title: 'Thank You!',
    content: `
      <div class="text-center space-y-6">
        <h2 class="text-5xl font-bold mb-4">Thank You!</h2>
        <p class="text-xl">Visit my GitHub for more projects</p>
        <div class="mt-8">
          <a href="#" class="inline-block bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            View More Projects
          </a>
        </div>
      </div>
    `,
    type: 'html',
    backgroundColor: 'bg-gradient-to-br from-purple-600 to-pink-700',
    textColor: 'text-white',
    duration: 5000
  }
];

export const defaultConfig: SlideShowConfig = slideshowConfig;

// Function to load slides from external source (you can customize this)
export const loadSlidesFromUrl = async (url: string): Promise<Slide[]> => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.slides || [];
  } catch (error) {
    console.error('Error loading slides:', error);
    return sampleSlides;
  }
};

// Function to load slides from local JSON file
export const loadSlidesFromFile = (file: File): Promise<Slide[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data.slides || []);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};
