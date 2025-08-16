import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PhotobookUploadProps {
  onPdfUpload: (file: File) => void;
  isLoading?: boolean;
}

export const PhotobookUpload: React.FC<PhotobookUploadProps> = ({
  onPdfUpload,
  isLoading = false
}) => {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file && file.type === 'application/pdf') {
      onPdfUpload(file);
    }
  }, [onPdfUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false,
    disabled: isLoading
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-cinematic p-6">
      <Card className="w-full max-w-2xl bg-card/80 backdrop-blur-sm border-border/50 shadow-cinematic">
        <div 
          {...getRootProps()} 
          className={`
            p-12 text-center cursor-pointer transition-all duration-300 rounded-lg
            ${isDragActive ? 'bg-accent/20 border-accent scale-105' : 'hover:bg-muted/30 hover:scale-102'}
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-primary/10 p-6 rounded-full">
                {isLoading ? (
                  <FileText className="w-12 h-12 text-primary animate-pulse" />
                ) : (
                  <Upload className="w-12 h-12 text-primary" />
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Cinematic Photobook
              </h1>
              
              <div className="space-y-2">
                <p className="text-xl text-foreground/90">
                  {isLoading ? 'Processing your PDF...' : 'Upload your PDF to begin'}
                </p>
                <p className="text-muted-foreground">
                  Drag and drop your PDF file here, or click to browse
                </p>
              </div>
            </div>

            {!isLoading && (
              <Button 
                variant="outline" 
                size="lg" 
                className="bg-primary/10 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 shadow-glow"
              >
                Choose PDF File
              </Button>
            )}

            <div className="text-sm text-muted-foreground flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Supports PDF files up to 50MB</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};