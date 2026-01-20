@echo off
echo Starting NeuroVision AI Backend...
echo.

cd /d "%~dp0\backend"

if not exist "venv\" (
    echo Error: Virtual environment not found!
    echo Please run setup-backend.bat first.
    pause
    exit /b 1
)

call venv\Scripts\activate.bat
python app.py
