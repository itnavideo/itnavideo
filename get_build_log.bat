@echo off
setlocal
echo Fetching full build log for build 157dc26e-f13f-4097-b84d-f535cd052c8a...

call gcloud builds log 157dc26e-f13f-4097-b84d-f535cd052c8a --region=us-central1 --project geometric-hull-501707-m2 > build_details.log 2>&1

echo.
echo ========================================================
echo   Done! Saved to build_details.log
echo ========================================================
pause
