#!/bin/bash

PROJECT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

echo "--- Starte Docker-Container ---"
cd "$PROJECT_DIR"
docker compose up -d

echo "--- Starte Backend (Gradle) in neuem Tab ---"
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/backend' && ./gradlew bootRun\""

echo "--- Starte Frontend (Angular) in neuem Tab ---"
osascript -e "tell application \"Terminal\" to do script \"cd '$PROJECT_DIR/frontend/frontend' && npm install && npx ng serve\""

echo "--------------------------------------------------"
echo "Alle Prozesse in neuen Tabs gestartet!"