@echo off
echo Starting NeuroVision AI - Full Stack
echo.
echo Starting Backend Server...
start cmd /k "cd /d "%~dp0" && start-backend.bat"

timeout /t 3 /nobreak > nul

echo Starting Frontend Development Server...
start cmd /k "cd /d "%~dp0" && start-frontend.bat"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
