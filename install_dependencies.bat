@echo off
REM Context: Manual dependency installer for user
SET PATH=%PATH%;C:\Program Files\nodejs
echo ===================================================
echo Installing App Dependencies...
echo ===================================================
echo.
call npm install
echo.
echo Done! You can now run 'run_app.bat'
pause
