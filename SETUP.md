# 🎯 Quick Setup Guide

Follow these steps to get your slideshow up and running on GitHub Pages:

## 📋 Prerequisites
- Node.js 18+ installed
- Git configured with your username and email
- GitHub account

## 🚀 Setup Steps

### 1. Fork or Clone
```bash
git clone https://github.com/YourUsername/page-scroll-canvas.git
cd page-scroll-canvas
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Test Locally
```bash
npm run dev
```
Visit http://localhost:8080 to see your slideshow.

### 4. Customize Your Content

#### Option A: Edit the default slides
Open `src/data/slides.ts` and modify the `sampleSlides` array:

```typescript
export const sampleSlides: Slide[] = [
  {
    id: '1',
    title: 'My Project Title',
    content: 'Description of my amazing project...',
    type: 'text',
    backgroundColor: 'bg-gradient-to-br from-blue-600 to-purple-700',
    textColor: 'text-white',
    duration: 5000
  },
  // Add more slides here...
];
```

#### Option B: Use JSON file upload
Create a `slides.json` file following the format in `public/sample-slides.json`.

### 5. Deploy to GitHub Pages

#### Option A: Manual Deployment
```bash
npm run deploy
```

#### Option B: Automatic Deployment
Just push to main branch - GitHub Actions will handle the rest!

```bash
git add .
git commit -m "My awesome slideshow"
git push origin main
```

### 6. Enable GitHub Pages
1. Go to your repository settings
2. Navigate to "Pages" section
3. Set source to "gh-pages" branch
4. Your site will be available at: `https://yourusername.github.io/repository-name/`

## 🎨 Customization Tips

### Background Colors
Use Tailwind CSS classes:
- `bg-gradient-to-br from-blue-600 to-purple-700`
- `bg-red-500`
- `bg-gray-900`

### Slide Types
- **Text**: Simple title + content
- **Image**: Full-screen images
- **HTML**: Rich content with custom styling

### Animation Timing
Adjust `duration` in milliseconds for each slide's autoplay timing.

## 🛠️ Troubleshooting

### Build Errors
```bash
npm run build
```
Check the console for any TypeScript or build errors.

### Deployment Issues
1. Ensure GitHub Pages is enabled
2. Check the base URL in `vite.config.ts`
3. Verify your repository name matches the config

### Local Development
If port 8080 is busy, Vite will automatically use the next available port.

## 📞 Need Help?

- Check the main README.md for detailed documentation
- Review the sample slides in `src/data/slides.ts`
- Look at `public/sample-slides.json` for JSON format examples

Happy presenting! 🎉
