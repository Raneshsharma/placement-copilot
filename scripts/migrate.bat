@echo off
rem ============================================================
rem Database Migration Script for Placement Copilot (Windows)
rem ============================================================
rem Run: scripts\migrate.bat [command]
rem ============================================================

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "PROJECT_ROOT=%SCRIPT_DIR%.."
set "API_DIR=%PROJECT_ROOT%\apps\api"

if "%1"=="" goto up

if "%1"=="up" goto up
if "%1"=="deploy" goto deploy
if "%1"=="status" goto status
if "%1"=="create" goto create
if "%1"=="reset" goto reset
if "%1"=="seed" goto seed
if "%1"=="dev" goto dev

:usage
echo Usage: migrate.bat [up^|deploy^|status^|create^|reset^|seed^|dev]
echo.
echo Commands:
echo   up       Run pending migrations ^(default^)
echo   deploy   Deploy all migrations ^(production^)
echo   status   Show migration status
echo   create   Create a new migration
echo   reset    Reset database ^(deletes all data^)
echo   seed     Seed the database
echo   dev      Run dev migrations
exit /b 1

:up
echo [INFO] Running database migrations...
pushd %API_DIR%
call npx prisma migrate dev --name init
call npx prisma generate
popd
echo [INFO] Migrations complete.
goto :end

:deploy
echo [INFO] Deploying migrations ^(production^)...
pushd %API_DIR%
call npx prisma migrate deploy
call npx prisma generate
popd
echo [INFO] Deploy complete.
goto :end

:status
echo [INFO] Checking migration status...
pushd %API_DIR%
call npx prisma migrate status
popd
goto :end

:create
if "%2"=="" (
    echo [ERROR] Migration name required. Usage: migrate.bat create migration_name
    exit /b 1
)
echo [INFO] Creating migration: %2
pushd %API_DIR%
call npx prisma migrate dev --name %2
popd
goto :end

:reset
echo [WARN] This will DELETE ALL DATA in the database!
set /p confirm="Are you sure? Type 'yes' to confirm: "
if "!confirm!"=="yes" (
    pushd %API_DIR%
    call npx prisma migrate reset --force
    popd
    echo [INFO] Database reset complete.
) else (
    echo [INFO] Aborted.
)
goto :end

:seed
echo [INFO] Seeding database...
pushd %API_DIR%
call npx prisma db seed
popd
echo [INFO] Seed complete.
goto :end

:dev
echo [INFO] Running migrations in development mode...
pushd %API_DIR%
call npx prisma migrate dev
call npx prisma generate
popd
echo [INFO] Development migrations complete.
goto :end

:end
endlocal
