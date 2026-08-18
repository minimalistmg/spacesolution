@echo off
setlocal EnableExtensions

set "ROOT=%~dp0"
set "LAUNCHER=%ROOT%dev-server.cmd"
set "VBS=%TEMP%\spacesolution-start-dev.vbs"

> "%VBS%" echo Set sh = CreateObject("WScript.Shell")
>> "%VBS%" echo sh.Run "cmd /c ""%LAUNCHER%""", 0, False
cscript //nologo "%VBS%" >nul 2>&1
del "%VBS%" >nul 2>&1

exit /b 0
