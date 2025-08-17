@echo off
REM Slideshow Display - GitHub Pages Deployment Script for Windows

echo 🚀 Deploying Slideshow Display to GitHub Pages...

REM Check if git is configured
git config user.name >nul 2>&1
if errorlevel 1 (
    echo ❌ Git user.name is not configured.
    echo Please run: git config --global user.name "Your Name"
    exit /b 1
)

git config user.email >nul 2>&1
if errorlevel 1 (
    echo ❌ Git user.email is not configured.
    echo Please run: git config --global user.email "your.email@example.com"
    exit /b 1
)

REM Check if we're in a git repository
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo ❌ Not in a git repository. Please initialize git first:
    echo git init
    echo git remote add origin https://github.com/yourusername/your-repo.git
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Build the project
echo 🔨 Building project...
npm run build
if errorlevel 1 (
    echo ❌ Build failed. Please fix the errors and try again.
    exit /b 1
)

REM Deploy to GitHub Pages
echo 🌐 Deploying to GitHub Pages...
npm run deploy
if errorlevel 0 (
    echo ✅ Successfully deployed to GitHub Pages!
    echo 🌟 Your slideshow should be available at: https://yourusername.github.io/your-repo-name/
    echo.
    echo 📝 Next steps:
    echo 1. Enable GitHub Pages in your repository settings
    echo 2. Set source to 'gh-pages' branch
    echo 3. Update the base URL in vite.config.ts if needed
) else (
    echo ❌ Deployment failed. Please check the errors above.
    exit /b 1
)
