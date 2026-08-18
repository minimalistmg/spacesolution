@echo off
setlocal EnableExtensions

cd /d "%~dp0..\.."

set "PATH=C:\Program Files\nodejs;%PATH%"
set "NODE_OPTIONS=--max-old-space-size=384"
set "BROWSER=none"
set "npm_config_loglevel=error"
set "npm_config_update_notifier=false"
set "npm_config_fund=false"
set "npm_config_audit=false"

npm run dev:fast >nul 2>&1
