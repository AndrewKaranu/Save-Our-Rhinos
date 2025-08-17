import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Play, Upload, FileText, Github } from 'lucide-react';
import { Slide } from '@/types/slide';
import { loadSlidesFromFile } from '@/data/slides';
import { useToast } from '@/hooks/use-toast';

interface HomePageProps {
  onStartSlideshow: (slides: Slide[]) => void;
  onStartSampleSlideshow: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  onStartSlideshow, 
  onStartSampleSlideshow 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const slides = await loadSlidesFromFile(file);
      onStartSlideshow(slides);
      toast({
        title: "Success!",
        description: `Loaded ${slides.length} slides from JSON file.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load slides. Please check your JSON format.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Slideshow Display
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            A beautiful, responsive slideshow presentation platform with smooth animations and easy content management.
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Sample Slideshow */}
          <Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="h-5 w-5" />
                Sample Slideshow
              </CardTitle>
              <CardDescription className="text-gray-300">
                View a demo slideshow showcasing the features and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={onStartSampleSlideshow}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Start Demo
              </Button>
            </CardContent>
          </Card>

          {/* Custom Slideshow */}
          <Card className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Custom Slideshow
              </CardTitle>
              <CardDescription className="text-gray-300">
                Upload your own slides from a JSON file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="slide-upload"
                  disabled={isLoading}
                />
                <label htmlFor="slide-upload">
                  <Button 
                    asChild
                    className="w-full bg-purple-600 hover:bg-purple-700 cursor-pointer"
                    size="lg"
                    disabled={isLoading}
                  >
                    <span>
                      {isLoading ? 'Loading...' : 'Upload JSON File'}
                    </span>
                  </Button>
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Play className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Smooth Animations</h3>
            <p className="text-gray-400 text-sm">GSAP-powered transitions for a cinematic experience</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">Easy Content</h3>
            <p className="text-gray-400 text-sm">Simple JSON format for quick slide creation</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Github className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-white font-semibold mb-2">GitHub Pages</h3>
            <p className="text-gray-400 text-sm">Deploy easily with automated CI/CD</p>
          </div>
        </div>

        {/* Instructions */}
        <Card className="bg-white/5 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">How to Use</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-3">
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</span>
              <div>
                <p className="font-medium">Start with Sample</p>
                <p className="text-sm text-gray-400">Click "Start Demo" to see the slideshow in action</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</span>
              <div>
                <p className="font-medium">Create Your Content</p>
                <p className="text-sm text-gray-400">Edit the slides in <code className="bg-gray-800 px-1 rounded">src/data/slides.ts</code> or upload a JSON file</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</span>
              <div>
                <p className="font-medium">Deploy to GitHub Pages</p>
                <p className="text-sm text-gray-400">Run <code className="bg-gray-800 px-1 rounded">npm run deploy</code> to publish your slideshow</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-400">
          <p>Navigation: Use arrow keys, swipe gestures, or on-screen controls</p>
          <p className="text-sm mt-2">Press P for autoplay • ESC to return home</p>
        </div>
      </div>
    </div>
  );
};
