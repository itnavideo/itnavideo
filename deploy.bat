@echo off
setlocal
echo ========================================================
echo   Deploying Itnavideo Web to Google Cloud Run...
echo   Project: geometric-hull-501707-m2
echo   Region:  us-central1
echo ========================================================
echo.
echo [1/3] Uploading source and building on Google Cloud...
echo [2/3] All output is being automatically captured in deploy.log
echo [3/3] Please wait 2-3 minutes, do not close this window...
echo.

call gcloud run deploy itnavideo-web --region us-central1 --project geometric-hull-501707-m2 --source . --allow-unauthenticated > deploy.log 2>&1
set EXIT_CODE=%ERRORLEVEL%

echo.
echo -------------------- CLOUD OUTPUT --------------------
type deploy.log
echo ------------------------------------------------------
echo.

if %EXIT_CODE% equ 0 (
    echo ========================================================
    echo   DEPLOYMENT SUCCESSFUL!
    echo   Live URL: https://www.itnavideo.com
    echo ========================================================
) else (
    echo ========================================================
    echo   Deployment exited with code %EXIT_CODE%.
    echo   Full details saved in deploy.log
    echo ========================================================
)

echo.
echo Window will remain open. Press any key when done.
pause
