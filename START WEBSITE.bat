@echo off
title G.Gorgeous - Demo Store
cd /d "%~dp0"
echo.
echo   Starting the G.Gorgeous demo store...
echo.
start "" http://localhost:5173/
node serve.js
pause
