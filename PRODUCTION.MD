# Mise en production 

## Version simple sans docker

### Structure du projet

Utilisateur : `vmdocker:vmdocker`

Administrateur : `root:root`


L'objectif est d'avoir deux serveurs qui tournent en même temps, un pour le frontend et un pour le backend.
Sur la vm React est accessible via le port 80 et Flask via le port 5000.
Et donc sur notre machine hôte il suffit de se connecter en localhost:8080 (redirection de port sur l'hote) et pour l'api en localhost:5000.

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

### Configuration des requêtes API

```bash
cd ./client
nano ./src/config.ts

const config = { serverUrl: "http://172.20.10.2:5000" };
export default config;
```

Ajouter un nom de domaine, pour ma part je garderai l'ip de la machine car c'est un travail de cours.

### Créer le build du client

```bash
npm install
npm run build
```

Création d'un répertoire dist.

### Configuration backend Flask

```bash
cd ./server
python3 -m venv venv
source venv/bin/activate

pip install -r ./requirements.txt
mv .env.test .env 

# Test du serveur & config de la db sqlite3
flask db upgrade
flask db migrate
flask run
```

Bien installer toutes les dépendances nécessaires.

### Configuration du service systemd

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

Normalement le processus Valenstagram fera tourner le serveur Flask dev h24.

### Configuration Nginx

```bash
# Copie du build React dans le dossier html & changement des permissions
cp -r /home/vmdocker/Valenstagram/client/dist/* /var/www/html/ 
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html
```

Création de la configuration Nginx :

```bash
sudo nano /etc/nginx/sites-available/valenstagram
```

Contenu du fichier :

```nginx
server {
    listen 80;
    server_name _;

    # Frontend React uniquement car Flask s'autogère avec le service systemd
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Activer la configuration et restart :

```bash
sudo ln -s /etc/nginx/sites-available/valenstagram /etc/nginx/sites-enabled
sudo nginx -t  
sudo systemctl restart nginx
```

Si la configuration ne fonctionne pas (par exemple si le site React fonctionne dans la machine mais pas sur la machine hôte) alors il faut changer le réseau de la VM en "Bridged Adapter" et redémarrer la VM, puis bien changer l'adresse IP dans le fichier client/src/config.ts
