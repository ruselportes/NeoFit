@echo off
title NeoFit Admin Dashboard
color 0A

echo.
echo   ============================================
echo        NeoFit Fitness Gym - Admin Dashboard
echo   ============================================
echo.

:: Check if Docker daemon is already running
docker info >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo   [*] Starting Docker Engine...
    
    :: Try to start Docker Desktop silently
    if exist "%ProgramFiles%\Docker\Docker\Docker Desktop.exe" (
        start "" "%ProgramFiles%\Docker\Docker\Docker Desktop.exe"
    ) else if exist "%ProgramFiles(x86)%\Docker\Docker\Docker Desktop.exe" (
        start "" "%ProgramFiles(x86)%\Docker\Docker\Docker Desktop.exe"
    ) else (
        echo.
        echo   [ERROR] Docker is not installed!
        echo   Please install Docker Desktop from:
        echo   https://www.docker.com/products/docker-desktop/
        echo.
        pause
        exit /b 1
    )

    echo   [*] Waiting for Docker to start...
    :waitloop
    timeout /t 3 /nobreak >nul
    docker info >nul 2>&1
    if %ERRORLEVEL% neq 0 (
        echo   [*] Still waiting...
        goto waitloop
    )
    echo   [OK] Docker is ready!
)

echo.
echo   [1/3] Building and starting NeoFit...
docker compose up -d --build

if %ERRORLEVEL% neq 0 (
    echo.
    echo   [ERROR] Failed to start. Check Docker Desktop.
    pause
    exit /b 1
)

echo   [2/3] Waiting for database...
timeout /t 12 /nobreak >nul

echo   [3/3] Initializing database...
docker compose exec api php artisan migrate --force 2>nul
docker compose exec api php artisan db:seed --force 2>nul

echo.
echo   ============================================
echo        NeoFit is now running!
echo.
echo        Opening in your browser...
echo   ============================================
echo.

timeout /t 2 /nobreak >nul
start http://localhost:8080

echo   NeoFit is running in the background.
echo   To stop it, double-click STOP.bat
echo.
echo   You can close this window now.
echo.
pause
