@echo off
echo ========================================
echo  NeuroVision AI - GitHub Push Helper
echo ========================================
echo.

echo Step 1: Create repository on GitHub
echo ----------------------------------------
echo 1. Go to https://github.com/new
echo 2. Repository name: neurovision-ai
echo 3. Description: AI-Powered Neurological Screening System
echo 4. Choose Public or Private
echo 5. DO NOT initialize with README
echo 6. Click "Create repository"
echo.
echo Press any key after creating the repository...
pause > nul

echo.
echo Step 2: Enter your repository URL
echo ----------------------------------------
set /p REPO_URL="Paste your GitHub repository URL (e.g., https://github.com/dharshuk123/neurovision-ai.git): "

echo.
echo Step 3: Adding remote and pushing...
echo ----------------------------------------

git remote add origin %REPO_URL%
if errorlevel 1 (
    echo Remote already exists, updating...
    git remote set-url origin %REPO_URL%
)

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo  Push Complete!
echo ========================================
echo.
echo Your repository is now on GitHub at:
echo %REPO_URL%
echo.
echo To push future updates, simply run:
echo   git add .
echo   git commit -m "Your message"
echo   git push
echo.
pause
