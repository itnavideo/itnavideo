@echo off
setlocal

echo ========================================================
echo   Itnavideo LIGHTWEIGHT Backup (no node_modules)
echo   Includes: All code + .env.local + .bat files
echo   Output: C:\Users\user\Downloads\
echo ========================================================
echo.

cd /d "c:\Users\user\Downloads"

set YYYY=%date:~-4%
set MM=%date:~3,2%
set DD=%date:~0,2%
set ZIPNAME=itnavideo-src-%YYYY%%MM%%DD%.zip

echo [1/3] Creating temp folder for clean copy...
if exist "itnavideo-src-temp" rmdir /s /q "itnavideo-src-temp"
mkdir "itnavideo-src-temp"

echo [2/3] Copying files (excluding node_modules and .next)...
xcopy "itnavideo-project\*" "itnavideo-src-temp\" /E /I /H /Y ^
  /EXCLUDE:"itnavideo-project\xcopy_exclude.txt"

:: Create exclude list
echo node_modules\ > "itnavideo-project\xcopy_exclude.txt"
echo .next\ >> "itnavideo-project\xcopy_exclude.txt"
echo .git\ >> "itnavideo-project\xcopy_exclude.txt"
echo deploy.log >> "itnavideo-project\xcopy_exclude.txt"
echo build_log.txt >> "itnavideo-project\xcopy_exclude.txt"
echo cloud_build_log.txt >> "itnavideo-project\xcopy_exclude.txt"

:: Re-do the copy with exclude
rmdir /s /q "itnavideo-src-temp"
mkdir "itnavideo-src-temp"
xcopy "itnavideo-project\*" "itnavideo-src-temp\" /E /I /H /Y /EXCLUDE:"itnavideo-project\xcopy_exclude.txt"

echo [3/3] Compressing to ZIP...
powershell -Command "Compress-Archive -Path 'c:\Users\user\Downloads\itnavideo-src-temp\*' -DestinationPath 'c:\Users\user\Downloads\%ZIPNAME%' -Force"

:: Cleanup temp
rmdir /s /q "itnavideo-src-temp"
del "itnavideo-project\xcopy_exclude.txt"

echo.
echo ========================================================
echo   DONE! Lightweight backup created:
echo   C:\Users\user\Downloads\%ZIPNAME%
echo.
echo   To restore:
echo   1. Extract ZIP
echo   2. Run: npm install
echo   3. Add your .env.local back
echo   4. Run: npm run dev
echo.
echo   NOTE: .env.local IS included in this zip.
echo   KEEP THIS FILE PRIVATE!
echo ========================================================
pause

