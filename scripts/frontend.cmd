@echo off
setlocal
cd /d "%~dp0.."
where node >nul 2>nul
if errorlevel 1 (
  for /d %%N in ("%~dp0..\.tools\node-v*-win-x64") do set "PATH=%%~fN;%PATH%"
)
where node >nul 2>nul
if errorlevel 1 (
  echo Instala Node.js 22.12 o superior para continuar.
  exit /b 1
)
if "%~1"=="install" goto install
if "%~1"=="test" goto test
if "%~1"=="build" goto build
call npm.cmd run dev
exit /b %errorlevel%
:install
call npm.cmd install
exit /b %errorlevel%
:test
call npm.cmd test
exit /b %errorlevel%
:build
call npm.cmd run build
exit /b %errorlevel%
