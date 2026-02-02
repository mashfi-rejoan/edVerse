@echo off

REM EdVerse Deployment Script for Windows

echo.
echo ===============================================
echo   EdVerse Deployment Preparation
echo ===============================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo X Node.js is not installed. Please install Node.js first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%
echo.

REM Install server dependencies
echo [INFO] Installing server dependencies...
cd server
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install server dependencies
    exit /b 1
)
echo [OK] Server dependencies installed
echo.

REM Install client dependencies
echo [INFO] Installing client dependencies...
cd ..\client
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo X Failed to install client dependencies
    exit /b 1
)
echo [OK] Client dependencies installed
echo.

REM Build server
echo [INFO] Building server...
cd ..\server
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo X Server build failed
    exit /b 1
)
echo [OK] Server build successful
echo.

REM Build client
echo [INFO] Building client...
cd ..\client
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo X Client build failed
    exit /b 1
)
echo [OK] Client build successful
echo.

echo ===============================================
echo   EdVerse is ready for deployment!
echo ===============================================
echo.
echo Deployment Steps:
echo.
echo 1. Backend (Render):
echo    - Go to https://render.com
echo    - Connect your GitHub repository
echo    - Use render.yaml for configuration
echo.
echo 2. Frontend (Vercel):
echo    - Go to https://vercel.com
echo    - Connect your GitHub repository
echo    - Set VITE_API_URL environment variable
echo.
echo 3. Set environment variables in both platforms
echo.
echo See DEPLOYMENT_GUIDE.md for detailed instructions
echo.
