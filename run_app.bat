@echo off
REM Context: Temporary fix for missing Node.js in PATH
SET PATH=%PATH%;C:\Program Files\nodejs
echo ===================================================
echo Starting Futsal League App...
echo ===================================================
echo.
echo 1. Opening development server...
echo 2. Once started, you will see a URL (like http://localhost:5173)
echo 3. Ctrl+Click that URL to open in your browser
echo.
call npm run dev
pause
