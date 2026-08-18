@echo off
setlocal EnableExtensions

set "LIB=%~dp0"

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%is-dev-running.ps1" >nul 2>&1
if %ERRORLEVEL%==0 (
  powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%notify.ps1" -Title "Space Solution Dev" -Message "Dev server is running at http://localhost:4321/" -Icon Info
  exit /b 0
)

powershell -NoProfile -ExecutionPolicy Bypass -File "%LIB%notify.ps1" -Title "Space Solution Dev" -Message "Dev server is not running." -Icon Warning
exit /b 1
