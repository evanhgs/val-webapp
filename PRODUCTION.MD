# Mise en production 

## Version simple sans docker

### Structure du projet

Utilisateur : `vmdocker:vmdocker`

Administrateur : `root:root`

```bash
valenstagram/
├── client/         # Frontend React
├── server/         # Backend Flask
└── instance/       # Base de données SQLite (valenstagram.db)
```

### Mise à jour et installation des packages

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv nodejs npm -y
sudo apt install nginx -y
```

Installation des mises à jour, de python, de pip, de node, de npm et enfin de nginx.

### Récupérer le build du client

```bash
cd ./client
npm install
npm run build
```

Création d'un répertoire dist.

### Configuration des requêtes API

```bash
const config = { serverUrl: "http://localhost:5000" };
export default config;
```

Ajouter un nom de domaine, pour ma part je garderai l'ip de la machine car c'est un travail de cours.

### Configuration backend Flask

```bash
cd ./server
python3 -m venv venv
source venv/bin/activate

pip install -r ./requirements.txt
pip install gunicorn

# Test du serveur
flask run
```

Bien installer toutes les dépendances nécessaires.

### Configuration de Gunicorn

```bash
sudo nano /etc/systemd/system/valenstagram.service
```

Contenu du fichier : 

```ini
[Unit]
Description=Flask API pour Valenstagram
After=network.target

[Service]
User=vmdocker
Group=www-data
WorkingDirectory=/home/vmdocker/Valenstagram/server
Environment="PATH=/home/vmdocker/Valenstagram/server/venv/bin"
Environment="FLASK_APP=app.py"
Environment="FLASK_ENV=production"
Environment="PYTHONPATH=/home/vmdocker/Valenstagram"
ExecStart=/home/vmdocker/Valenstagram/server/venv/bin/python -m flask run --host=0.0.0.0 --port=5000

[Install]
WantedBy=multi-user.target
```

Activez et démarrez le service :

```bash
sudo systemctl daemon-reload
sudo systemctl start valenstagram
sudo systemctl enable valenstagram
```

Normalement le processus Gunicorn fera tourner le serveur Flask.

### Configuration Nginx 

```bash
sudo nano /etc/nginx/sites-available/valenstagram
```

Contenu du fichier : 

```nginx
server {
    listen 80;
    server_name _;

    # Frontend React
    location / {
        root /home/vmdocker/Valenstagram/client/dist;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # Routes d'authentification
    location /auth/ {
        proxy_pass http://127.0.0.1:5000/auth/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Routes utilisateur
    location /user/ {
        proxy_pass http://127.0.0.1:5000/user/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Activer la configuration et restart : 

```bash
sudo ln -s /etc/nginx/sites-available/valenstagram /etc/nginx/sites-enabled
sudo nginx -t  
sudo systemctl restart nginx
```

### Tester gunicorn

```bash
# Test de Gunicorn
gunicorn --workers 4 --bind 0.0.0.0:5000 app:app
```