FROM python:3.11-slim

WORKDIR /server

# Installation des dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copie du code source
COPY . .

# Configuration pour l'environnement Docker
COPY .env.test .env

# Exposition du port 5000
EXPOSE 5000

# Script de démarrage
COPY docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# Commande de démarrage
ENTRYPOINT ["./docker-entrypoint.sh"]
