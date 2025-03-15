#!/bin/bash

# Mise à jour de la base de données
flask db upgrade
flask db migrate

# Démarrage du serveur Flask
exec flask run --host=0.0.0.0 --port=5000