@echo off
echo Starting NeuroVision AI Frontend...
echo.

cd /d "%~dp0"

if not exist "node_modules\" (
    echo Error: Dependencies not installed!
    echo Please run setup-frontend.bat first.
    pause
    exit /b 1
)

npm start
