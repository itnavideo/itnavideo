@echo off
cd /d c:\Users\user\Downloads\itnavideo-project
echo === Searching for rohi@itnavideo in all .ts and .tsx files ===
findstr /s /i /n "rohi@itnavideo" *.ts *.tsx 2>nul
echo === DONE ===
pause

