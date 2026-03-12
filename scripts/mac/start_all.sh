#!/bin/bash

# Den Pfad zum Hauptverzeichnis ermitteln (zwei Ebenen über dem Skript)
BASE_DIR="$(cd "$(dirname "$0")/../.." && pwd)"

echo "--- Starte Vecinify-Neighbourly (Mac) ---"

# 1. Docker starten
cd "$BASE_DIR"
docker-compose up -d

# 2. Backend in neuem Tab
osascript -e "tell application \"Terminal\" to do script \"cd '$BASE_DIR/backend' && ./gradlew bootRun\""

# 3. Frontend in neuem Tab
osascript -e "tell application \"Terminal\" to do script \"cd '$BASE_DIR/frontend/frontend' && npm start\""

echo "--------------------------------------------------"
echo "Alle Prozesse in neuen Tabs gestartet!"