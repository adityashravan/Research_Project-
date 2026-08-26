@echo off
REM ============================================================
REM Sensor Data Simulator - Windows Batch Scripts
REM ============================================================

if "%1"=="once" goto once
if "%1"=="continuous" goto continuous
if "%1"=="c" goto continuous
if "%1"=="" goto once

:once
echo.
echo ========================================
echo   INSERT ONE RECORD
echo ========================================
echo.
node simulate-sensor.js once
goto end

:continuous
echo.
echo ========================================
echo   CONTINUOUS DATA INSERTION
echo   Press Ctrl+C to stop
echo ========================================
echo.
node simulate-sensor.js continuous
goto end

:end
