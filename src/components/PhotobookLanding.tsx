import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Book, Instagram, Twitter, Facebook, Linkedin, Heart, ExternalLink, Github } from 'lucide-react';
import { PhotobookPage, PhotobookMetadata } from '@/types/photobook';
import { PhotobookProcessor } from '@/utils/photobookProcessor';
import { useToast } from '@/hooks/use-toast';

interface PhotobookLandingProps {
  onViewPhotobook: (pages: PhotobookPage[], metadata: PhotobookMetadata) => void;
}

export const PhotobookLanding: React.FC<PhotobookLandingProps> = ({ 
  onViewPhotobook 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { toast } = useToast();

  // Your actual photos for the cycling background
  const base = import.meta.env.BASE_URL || '/';
  const backgroundPhotos = [
    `${base}Photos/20190728-IMG_7212.jpg`,
    `${base}Photos/20190728-IMG_7220.jpg`,
    `${base}Photos/20190728-IMG_7235.jpg`,
    `${base}Photos/20190728-IMG_7237-2.jpg`,
    `${base}Photos/20190728-IMG_7243.jpg`,
    `${base}Photos/20190729-IMG_7647.jpg`,
    `${base}Photos/20190729-IMG_8251-2.jpg`,
    `${base}Photos/20190729-IMG_8267.jpg`,
    `${base}Photos/20190729-IMG_8284-2.jpg`,
    `${base}Photos/20190729-IMG_8285.jpg`,
    `${base}Photos/IMG_20190908_192254.jpg`
  ];

  // Cycle through photos every 5 seconds
  useEffect(() => {
    console.log('Setting up photo cycling with', backgroundPhotos.length, 'photos');
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prev) => {
        const newIndex = (prev + 1) % backgroundPhotos.length;
        console.log('Cycling to photo index:', newIndex, 'Photo:', backgroundPhotos[newIndex]);
        return newIndex;
      });
    }, 5000); // Increased to 5 seconds

    return () => clearInterval(interval);
  }, [backgroundPhotos.length]);

  const handleViewPhotobook = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Loading Photobook...",
        description: "Processing high-quality pages, this may take a moment...",
      });

      const { pages, metadata } = await PhotobookProcessor.loadEmbeddedPhotobook();
      
      toast({
        title: "Photobook Ready!",
        description: `Loaded ${pages.length} pages. Enjoy the experience!`,
      });
      
      onViewPhotobook(pages, metadata);
    } catch (error) {
      console.error('Error loading photobook:', error);
      toast({
        title: "Error",
        description: "Failed to load photobook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Cycling Photo Background */}
      <div className="absolute inset-0 z-0">
        {backgroundPhotos.map((photo, index) => (
          <div
            key={photo}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentPhotoIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={photo} 
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center">
        {/* Main Content - Single View Layout */}
        <div className="max-w-7xl w-full mx-auto p-4">
            {/* Top Section - Title and Button */}
            <div className="text-center mb-8">
              <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 leading-tight">
                Save our
                <br />
                <span className="text-white">Rhinos</span>
              </h2>
              
              {/* Start Button */}
              <Button 
                onClick={handleViewPhotobook}
                disabled={isLoading}
                size="lg"
                className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white px-12 py-6 text-lg font-bold rounded-full transition-all duration-500 hover:scale-110 shadow-2xl hover:shadow-white/25 mb-8"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Loading Experience...
                  </>
                ) : (
                  <>
                    <Play className="h-6 w-6 mr-3" />
                    Start Experience
                  </>
                )}
              </Button>
            </div>

            {/* Bottom Section - Three Column Layout */}
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {/* About Me Section */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Book className="h-5 w-5 mr-3" />
                  About Me
                </h3>
                <p className="text-white/90 leading-relaxed text-sm">
                  I'm a passionate wildlife photographer and conservationist dedicated to raising awareness about endangered species. Through my lens, I capture the beauty and vulnerability of these magnificent creatures, hoping to inspire action and change.
                </p>
              </div>

              {/* About Project Section */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Play className="h-5 w-5 mr-3" />
                  About This Project
                </h3>
                <p className="text-white/90 leading-relaxed text-sm">
                  Once abundant across Central Africa, today only two northern white rhinos remain alive, both female, both living under 24-hour armed guard in Kenya. This photobook documents their world: a powerful blend of beauty and grief, hope and urgency.
                </p>
              </div>

              {/* Connect & Support Section */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 lg:col-span-1 md:col-span-2">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-3" />
                  Connect & Support
                </h3>
                
                {/* Social Media Links */}
                <div className="mb-6">
                  <p className="text-white/70 text-sm mb-3">Follow my journey:</p>
                  <div className="flex space-x-4">
                    <a 
                      href="https://www.instagram.com/_andrrrwww_/?utm_source=ig_web_button_share_sheet" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5 text-white" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/andrew-karanu-998910237/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5 text-white" />
                    </a>
                    <a 
                      href="https://github.com/AndrewKaranu" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5 text-white" />
                    </a>
                  </div>
                </div>

                {/* Donation Link - More Prominent */}
                <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-4">
                  <p className="text-green-300 text-sm font-medium mb-2">🦏 Support Conservation:</p>
                  <a 
                    href="https://donate.olpejetaconservancy.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-green-200 hover:text-green-100 transition-colors text-base font-semibold"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Donate to Ol Pejeta Conservancy
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                  <p className="text-green-200/70 text-sm mt-2">
                    The sanctuary that made this project possible
                  </p>
                </div>
              </div>
            </div>

            {/* Photo Indicator */}
            <div className="flex justify-center space-x-2 mt-6">
              {backgroundPhotos.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentPhotoIndex ? 'bg-white w-6' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
        </div>
      </div>
    </div>
  );
};
