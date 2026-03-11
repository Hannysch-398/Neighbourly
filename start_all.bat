@echo off
echo ==================================================
echo   Starte Vecinify-Neighbourly Dev Environment
echo ==================================================


echo [1/3] Starte Docker-Container (Datenbank etc.)...
docker-compose up -d

echo [2/3] Starte Backend (Gradle) in neuem Fenster...
start "BACKEND - Spring Boot" cmd /k "cd backend && gradlew.bat bootRun"

echo [3/3] Starte Frontend (Angular) in neuem Fenster...

start "FRONTEND - Angular" cmd /k "cd frontend\frontend && npm install && npm start"

echo.
echo ==================================================
echo   Alles initiiert!
echo   Prüfe die neuen Fenster auf Fehlermeldungen.
echo ==================================================
pause