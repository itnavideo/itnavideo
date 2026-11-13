@echo off
setlocal enabledelayedexpansion
title Windows PowerShell Full Repair Tool
color 0A

echo ========================================================
echo   Windows PowerShell Full Diagnostic & Repair Tool
echo ========================================================
echo.

:: Check Admin Rights
net session >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Administrator privileges required!
    echo Please right-click this file and choose "Run as administrator".
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking .NET Framework 64-bit machine.config...
set "CONFIG64=C:\Windows\Microsoft.NET\Framework64\v4.0.30319\Config"
if exist "%CONFIG64%" (
    cd /d "%CONFIG64%"
    if exist "machine.config.default" (
        copy /y "machine.config" "machine.config.bak" >nul 2>&1
        copy /y "machine.config.default" "machine.config" >nul
        echo    [SUCCESS] Restored 64-bit machine.config from default.
    ) else (
        echo    [NOTICE] machine.config.default not found, keeping original.
    )
) else (
    echo    [NOTICE] 64-bit .NET config folder not found.
)

echo [2/5] Checking .NET Framework 32-bit machine.config...
set "CONFIG32=C:\Windows\Microsoft.NET\Framework\v4.0.30319\Config"
if exist "%CONFIG32%" (
    cd /d "%CONFIG32%"
    if exist "machine.config.default" (
        copy /y "machine.config" "machine.config.bak" >nul 2>&1
        copy /y "machine.config.default" "machine.config" >nul
        echo    [SUCCESS] Restored 32-bit machine.config from default.
    ) else (
        echo    [NOTICE] machine.config.default not found, keeping original.
    )
) else (
    echo    [NOTICE] 32-bit .NET config folder not found.
)

echo [3/5] Verifying System PATH contains PowerShell directories...
set "PSPATH=C:\Windows\System32\WindowsPowerShell\v1.0"
if not exist "%PSPATH%\powershell.exe" (
    echo    [WARNING] powershell.exe not found at standard location!
) else (
    echo    [SUCCESS] powershell.exe found at %PSPATH%
)

echo [4/5] Testing PowerShell Launch...
echo.
"%PSPATH%\powershell.exe" -NoProfile -ExecutionPolicy Bypass -Command "Write-Host '[SUCCESS] PowerShell is working perfectly!' -ForegroundColor Green; Get-Date"
set "PS_EXIT=!errorlevel!"

echo.
if !PS_EXIT! equ 0 (
    color 0A
    echo ========================================================
    echo   PowerShell has been FIXED successfully!
    echo ========================================================
) else (
    color 0E
    echo ========================================================
    echo   PowerShell still failed with exit code: !PS_EXIT!
    echo   Running .NET Assembly Native Image Re-generation...
    echo ========================================================
    echo.
    if exist "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\ngen.exe" (
        echo Updating 64-bit .NET Native cache...
        "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\ngen.exe" update /force >nul 2>&1
    )
    if exist "C:\Windows\Microsoft.NET\Framework\v4.0.30319\ngen.exe" (
        echo Updating 32-bit .NET Native cache...
        "C:\Windows\Microsoft.NET\Framework\v4.0.30319\ngen.exe" update /force >nul 2>&1
    )
    
    echo Retesting PowerShell...
    "%PSPATH%\powershell.exe" -NoProfile -ExecutionPolicy Bypass -Command "Write-Host '[SUCCESS] PowerShell fixed after ngen update!' -ForegroundColor Green"
)

echo.
echo ========================================================
echo   Finished. Press any key to exit.
echo ========================================================
pause

