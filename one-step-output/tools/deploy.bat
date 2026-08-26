@echo off
REM ============================================================
REM Hexo Deploy Script for OwnWeb-Yetbye (Windows CMD)
REM Usage:
REM   deploy.bat                 # full: clean → generate → preview → deploy
REM   deploy.bat --skip-preview  # skip local preview, deploy directly
REM   deploy.bat --clean-only    # only clean, no build or deploy
REM   deploy.bat --build-only    # clean + generate, no deploy
REM   deploy.bat --status        # show project status summary
REM ============================================================

setlocal enabledelayedexpansion

set HEXO_CMD=npx hexo
set PREVIEW_PORT=4000
set SKIP_PREVIEW=false
set CLEAN_ONLY=false
set BUILD_ONLY=false
set STATUS_ONLY=false

REM Parse arguments
:parse_args
if "%~1"=="" goto :main
if "%~1"=="--skip-preview" set SKIP_PREVIEW=true
if "%~1"=="--clean-only" set CLEAN_ONLY=true
if "%~1"=="--build-only" set BUILD_ONLY=true
if "%~1"=="--status" set STATUS_ONLY=true
if "%~1"=="--help" goto :help
shift
goto :parse_args

:help
echo Usage: deploy.bat [OPTIONS]
echo.
echo Options:
echo   --skip-preview   Skip local preview, deploy directly
echo   --clean-only     Only clean, no build or deploy
echo   --build-only     Clean + generate, no deploy
echo   --status         Show project status summary
echo   --help           Show this help
exit /b 0

:main
echo.
echo ================================
echo   Hexo Deploy — OwnWeb-Yetbye
echo ================================
echo.

REM Check Node.js
where node >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node -v') do echo [OK] Node.js: %%i

REM Check package.json
if not exist "package.json" (
    echo [ERROR] Not in a Hexo project directory (no package.json)
    exit /b 1
)

if "%STATUS_ONLY%"=="true" (
    echo.
    echo [INFO] Project Status
    echo ================================
    for /f "tokens=*" %%i in ('git branch --show-current 2^>nul') do echo Branch: %%i
    echo.
    exit /b 0
)

if "%CLEAN_ONLY%"=="true" (
    echo [INFO] Cleaning...
    %HEXO_CMD% clean
    echo [OK] Clean complete
    exit /b 0
)

echo [INFO] Cleaning...
%HEXO_CMD% clean
echo [OK] Clean complete

echo [INFO] Generating...
%HEXO_CMD% generate
echo [OK] Generate complete

if "%BUILD_ONLY%"=="true" (
    echo [OK] Build complete (no deploy)
    exit /b 0
)

if "%SKIP_PREVIEW%"=="false" (
    echo [INFO] Starting local preview on http://localhost:%PREVIEW_PORT%
    echo [INFO] Press Ctrl+C to stop preview and continue to deploy
    %HEXO_CMD% server -p %PREVIEW_PORT%
)

echo [INFO] Deploying...
%HEXO_CMD% deploy
echo [OK] Deploy complete! Site should be live at https://yetbye.top
echo.
echo [INFO] Note: GitHub Pages may take 1-2 minutes to update.

echo.
echo [OK] All done!
endlocal
