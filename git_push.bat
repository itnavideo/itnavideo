@echo off
title Itnavideo Git Push & Auto Deploy
cd /d "%~dp0"

REM Ensure Git from GitHub Desktop is in PATH
if exist "%LOCALAPPDATA%\GitHubDesktop\app-3.5.8\resources\app\git\cmd\git.exe" (
    set "PATH=%LOCALAPPDATA%\GitHubDesktop\app-3.5.8\resources\app\git\cmd;%PATH%"
)

echo ===================================================
echo   Itnavideo Git Push (Triggers Automatic Cloud Deploy)
echo ===================================================
echo.
echo [1/3] Checking Git Status & Staging all files...
git add .
git status --short
echo.
echo [2/3] Committing updates...
set /p COMMIT_MSG="Enter commit message (or press ENTER for auto): "
if "%COMMIT_MSG%"=="" set COMMIT_MSG="feat: update clean homepage & studios architecture"
git commit -m "%COMMIT_MSG%"
echo.
echo [3/3] Pushing to GitHub (origin main)...
git push origin main
echo.
echo ===================================================
echo   PUSH COMPLETE! 
echo   Google Cloud Run is now building & deploying automatically.
echo   Check progress at: https://console.cloud.google.com/run
echo ===================================================
pause
