@echo off
echo ==================================================
echo   Starte Vecinify-Neighbourly (Windows)
echo ==================================================

cd /d "%~dp0..\.."

echo [1/3] Starte Docker-Container...
docker-compose up -d
echo [2/3] Starte Backend (Gradle)...
start "BACKEND" cmd /k "cd backend && gradlew.bat bootRun"
echo [3/3] Starte Frontend (Angular)...
start "FRONTEND" cmd /k "cd frontend\frontend && npm start"
echo.
echo Setup initiiert!
pause