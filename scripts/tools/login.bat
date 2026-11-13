@echo off
echo ========================================================
echo   Logging into Google Cloud...
echo ========================================================
echo.
call gcloud auth login
echo.
call gcloud config set project geometric-hull-501707-m2
echo.
echo ========================================================
echo   Login Completed! Now you can run deploy.bat
echo ========================================================
pause

