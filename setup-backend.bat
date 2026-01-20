@echo off
echo Installing NeuroVision AI Backend Dependencies...
echo.

cd /d "%~dp0\backend"

echo [1/3] Creating Python virtual environment...
python -m venv venv

echo.
echo [2/3] Activating virtual environment...
call venv\Scripts\activate.bat

echo.
echo [3/3] Installing Python packages...
pip install -r requirements.txt

echo.
echo Setup complete!
echo.
echo To start the backend:
echo   cd backend
echo   venv\Scripts\activate
echo   python app.py
echo.
echo The API will run at http://localhost:5000
echo.
pause
