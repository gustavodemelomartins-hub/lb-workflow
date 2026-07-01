@echo off
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0push_to_github.ps1" > "%~dp0push_log.txt" 2>&1
echo Concluido.
pause
