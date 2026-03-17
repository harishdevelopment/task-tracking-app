@echo off
setlocal

cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Error: npm is not installed or not available in PATH.
  exit /b 1
)

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 exit /b 1
)

if "%~1"=="test" (
  echo Preparing Playwright tests...
  call npm install
  if errorlevel 1 exit /b 1
  call npx playwright install chromium
  if errorlevel 1 exit /b 1
  echo Running E2E tests...
  call npm run test:e2e
) else (
  echo Starting PlanTrack (Vite + Express)...
  call npm run dev
)
