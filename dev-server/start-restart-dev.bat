@echo off
setlocal EnableExtensions

set "LIB=%~dp0lib\"

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%kill-dev-port.ps1" >nul 2>&1
timeout /t 2 /nobreak >nul 2>&1

call "%LIB%_start-hidden.cmd"

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%notify.ps1" -Title "Space Solution Dev" -Message "Dev server started. Open http://localhost:4321/ — first start may take up to 45 seconds." -Icon Info

exit /b 0
