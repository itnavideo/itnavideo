@echo off
title Itnavideo Git Push
cd /d "c:\Users\user\Downloads\itnavideo-project"

echo ===================================================
echo [1/4] Checking Git Status...
echo ===================================================
git status

echo.
echo ===================================================
echo [2/4] Adding all updated files...
echo ===================================================
git add .

echo.
echo ===================================================
echo [3/4] Committing changes...
echo ===================================================
git commit -m "feat: implement audit P0 fixes - duration modals, safe zones, non-destructive edit plans & 4-step storyboard"

echo.
echo ===================================================
echo [4/4] Pushing to GitHub (origin main)...
echo ===================================================
git push origin main

echo.
echo ===================================================
echo Done! Press any key to close this window.
echo ===================================================
pause
