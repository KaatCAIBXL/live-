@echo off
cd /d "%~dp0"
echo Server starten...
call npm install
call npm start
pause
