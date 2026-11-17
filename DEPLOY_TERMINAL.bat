@echo off
title Deploying Itnavideo Web to Google Cloud Run
color 0A
echo ========================================================
echo   ITNAVIDEO CLOUD RUN TERMINAL DEPLOYER
echo   Project: geometric-hull-501707-m2
echo   Region:  us-central1
echo ========================================================
echo.

set "GCLOUD=C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

cd /d "C:\Itnavideo Company"

echo [*] Checking Google Cloud authentication...
call "%GCLOUD%" auth print-access-token >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo ========================================================
    echo   [!] GOOGLE CLOUD REAUTHENTICATION REQUIRED
    echo   Opening your browser now...
    echo   Please select rohi@itnavideo.com and click 'Allow'
    echo ========================================================
    echo.
    call "%GCLOUD%" auth login rohi@itnavideo.com
)

echo.
echo [*] Setting active project to geometric-hull-501707-m2...
call "%GCLOUD%" config set project geometric-hull-501707-m2

echo.
echo ========================================================
echo   Starting Cloud Run Deployment from terminal...
echo   Source: C:\Itnavideo Company (lightweight: ~42MB)
echo ========================================================
echo.

call "%GCLOUD%" run deploy itnavideo-web --region us-central1 --project geometric-hull-501707-m2 --source . --allow-unauthenticated

echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo   [SUCCESS] DEPLOYMENT COMPLETED!
    echo   Live URL: https://www.itnavideo.com
    echo ========================================================
) else (
    echo ========================================================
    echo   [FAILED] Deployment exited with code %ERRORLEVEL%.
    echo ========================================================
)

echo.
echo Terminal session finished. You can close this window.
pause
