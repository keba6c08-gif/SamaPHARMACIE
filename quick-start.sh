#!/bin/bash

echo "🚀 Lancement rapide de SamaPHARMACIE..."
echo ""

# Vérifier si Docker est lancé
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker n'est pas lancé"
    echo "⏳ Démarrage de Docker Desktop..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open /Applications/Docker.app
        sleep 3
    fi
fi

# Vérifier les fichiers critiques
if [ ! -f "backend/server.js" ]; then
    echo "❌ Backend non trouvé"
    exit 1
fi

if [ ! -f "frontend/index.html" ]; then
    echo "❌ Frontend non trouvé"
    exit 1
fi

# Lancer le script de démarrage principal
chmod +x start.sh
./start.sh

# Attendre 10 secondes
echo ""
echo "⏳ Attente du démarrage complet..."
sleep 10

# Ouvrir le frontend dans le navigateur par défaut
echo ""
echo "🌐 Ouverture du frontend..."

FRONTEND_PATH="file://$(pwd)/frontend/index.html"

if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open "$FRONTEND_PATH"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open "$FRONTEND_PATH"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start "$FRONTEND_PATH"
fi

echo ""
echo "✅ Application lancée!"
echo ""
echo "Appuie sur CTRL+C pour arrêter"
echo ""

# Garder le script actif pour voir les logs
docker-compose logs -f backend
