@echo off
setlocal

cd /d "%~dp0"

if not exist "ga4-dashboard\START_DASHBOARD.cmd" (
  echo Could not find ga4-dashboard\START_DASHBOARD.cmd
  pause
  exit /b 1
)

call "ga4-dashboard\START_DASHBOARD.cmd"
