@echo off
setlocal
cd /d "%~dp0..\backend"
if "%~1"=="test" goto test
call mvn "-Dmaven.repo.local=%~dp0..\.tools\m2" spring-boot:run
exit /b %errorlevel%
:test
call mvn "-Dmaven.repo.local=%~dp0..\.tools\m2" test
exit /b %errorlevel%
