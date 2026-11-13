@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo   Itnavideo Project Backup Creator
echo ========================================================
echo.

set OUTPUT_DIR=%USERPROFILE%\Downloads
set YYYY=%date:~-4%
set MM=%date:~3,2%
set DD=%date:~0,2%
set FILENAME=itnavideo-backup-%YYYY%%MM%%DD%.zip

echo Creating clean backup (excluding node_modules and .next)...
powershell -NoProfile -Command "Get-ChildItem -Path '.' -Recurse | Where-Object { $_.FullName -notmatch '\\node_modules(\\|$)' -and $_.FullName -notmatch '\\\.next(\\|$)' } | Compress-Archive -DestinationPath '%OUTPUT_DIR%\%FILENAME%' -Force"

echo.
echo ========================================================
echo   Done! Backup created at: %OUTPUT_DIR%\%FILENAME%
echo ========================================================
pause
