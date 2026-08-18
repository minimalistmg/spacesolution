@echo off
setlocal EnableExtensions

set "LIB=%~dp0lib\"

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%is-dev-running.ps1" >nul 2>&1
if not %ERRORLEVEL%==0 (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%notify.ps1" -Title "Space Solution Dev" -Message "Dev server was not running." -Icon Warning
  exit /b 0
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%kill-dev-port.ps1" >nul 2>&1

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%notify.ps1" -Title "Space Solution Dev" -Message "Dev server stopped." -Icon Info

exit /b 0
