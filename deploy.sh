#!/bin/bash

# Slideshow Display - GitHub Pages Deployment Script
echo "🚀 Deploying Slideshow Display to GitHub Pages..."

# Check if git is configured
if ! git config user.name > /dev/null; then
    echo "❌ Git user.name is not configured."
    echo "Please run: git config --global user.name 'Your Name'"
    exit 1
fi

if ! git config user.email > /dev/null; then
    echo "❌ Git user.email is not configured."
    echo "Please run: git config --global user.email 'your.email@example.com'"
    exit 1
fi

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    echo "❌ Not in a git repository. Please initialize git first:"
    echo "git init"
    echo "git remote add origin https://github.com/yourusername/your-repo.git"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix the errors and try again."
    exit 1
fi

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
npm run deploy

if [ $? -eq 0 ]; then
    echo "✅ Successfully deployed to GitHub Pages!"
    echo "🌟 Your slideshow should be available at: https://yourusername.github.io/your-repo-name/"
    echo ""
    echo "📝 Next steps:"
    echo "1. Enable GitHub Pages in your repository settings"
    echo "2. Set source to 'gh-pages' branch"
    echo "3. Update the base URL in vite.config.ts if needed"
else
    echo "❌ Deployment failed. Please check the errors above."
    exit 1
fi
