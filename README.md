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
└── instance/       # db SQLite (valenstagram.db)
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

- Note : Pour des raisons indépendantes du projet, je n'ai pas pu mettre Flask en production avec WSGI et Gunicorn. Mais cela ne changera rien au fonctionnement de l'application. 

## Version docker-compose


### Environnement de production avec Docker Compose

1. Lancer l'application en production :

```bash
docker-compose up --build -d
docker-compose ps
docker-compose logs -f
```

L'application sera accessible sur :

- Frontend : http://localhost (port 80)
- Backend API : http://localhost:5000

2. Arrêter l'application :

```bash
docker-compose down
```

### Environnement de développement avec Docker Compose

1. Lancer l'application en développement :

```bash
docker-compose -f docker-compose-develop.yml up --build -d
docker-compose -f docker-compose-develop.yml ps
docker-compose -f docker-compose-develop.yml logs -f
```

L'application de développement sera accessible sur :

Frontend : http://localhost:3000
Backend API : http://localhost:5001

2. Arrêter l'application : 

```bash
docker-compose -f docker-compose-develop.yml down
```

### Gestion de la base de donnée

La base de données SQLite est stockée dans un volume Docker pour persister les données entre les redémarrages :

```bash
# Sauvegarde de la db
docker-compose exec server bash -c "sqlite3 /app/instance/valenstagram.db .dump" > backup.sql

# Restauration de la db
cat backup.sql | docker-compose exec -T server bash -c "cat > /tmp/backup.sql && sqlite3 /app/instance/valenstagram.db < /tmp/backup.sql"
```

### Vérification des ports 

Trouver les ports déjà ouverts car ils sont très basiques.

```bash
sudo lsof -i :80
sudo lsof -i :5000

sudo kill -9 <PID>
```

### Ajouter un utilisateur docker 

```bash	
sudo usermod -aG docker $USER
```

## Tester l'application

- Ouvrir un navigateur et accéder à l'application : `http://localhost`
- Ouvrir postman et tester les routes de l'API : `http://localhost:5000/`

Dans le projet je n'ai pas encore développé les layouts pour s'abonner entre utilisateur.

Donc pour créer une relation entre un utilisateur et un autre (abonné/abonnement) il faut passer par l'API.

Je vous invite vivement à lire la [documentation de l'API](https://github.com/joedebiden/Valenstagram/blob/master/server/routes/README.md)

Mais grosso modo il faut envoyer une requête POST ou GET : `http://127.0.0.1:5000/user/follow` avec le JWT dans le header. 

Pour obtenir le token JWT soit on le récupère dans le local storage du navigateur en se connectant à l'app soit on fait une requête POST sur `http://127.0.0.1:5000/auth/login`
Et on envoie un json avec le username et le password.

Et voilà, vous pouvez maintenant tester l'application et voir vos abonnés et abonnements dans le profil.

#### Un projet de l'Iut de Valence - réalisé par Evan Hugues.