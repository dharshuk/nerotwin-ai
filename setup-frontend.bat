@echo off
echo Installing NeuroVision AI Frontend Dependencies...
echo.

cd /d "%~dp0"

echo [1/3] Installing Node.js packages...
call npm install

echo.
echo [2/3] Configuring Tailwind CSS...
echo Tailwind already configured in tailwind.config.js

echo.
echo [3/3] Setup complete!
echo.
echo To start the frontend:
echo   npm start
echo.
echo The app will open at http://localhost:3000
echo.
pause
