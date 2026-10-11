@echo off
REM Local launch without Docker. Forwards all args to start-local.ps1.
REM Default: development Web UI (pnpm run dev:web).
setlocal
cd /d "%~dp0"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-local.ps1" %*
set EXITCODE=%ERRORLEVEL%
if %EXITCODE% neq 0 (
  echo.
  echo start-local failed with exit code %EXITCODE%.
  pause
)
exit /b %EXITCODE%
