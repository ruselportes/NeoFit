@echo off
title NeoFit - Shutting Down
color 0C

echo ============================================
echo    Stopping NeoFit Admin Dashboard...
echo ============================================
echo.

docker compose down

echo.
echo NeoFit has been stopped.
echo.
pause
