@echo off
echo ========================================================
echo   Fixing Windows PowerShell .NET Initialization Bug...
echo ========================================================
echo.

cd /d C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config
if exist machine.config.default (
    copy /y machine.config machine.config.backup >nul 2>&1
    copy /y machine.config.default machine.config
    echo [OK] 64-bit machine.config restored.
)

cd /d C:\Windows\Microsoft.NET\Framework\v4.0.30319\Config
if exist machine.config.default (
    copy /y machine.config machine.config.backup >nul 2>&1
    copy /y machine.config.default machine.config
    echo [OK] 32-bit machine.config restored.
)

echo.
echo ========================================================
echo   PowerShell Fix Completed!
echo ========================================================
echo.
pause

