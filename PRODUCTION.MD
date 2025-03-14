# Mise en production 

## Version simple sans docker

### Structure du projet

```bash

```

```bash
valenstagram/
├── client/         # Frontend React
├── server/         # Backend Flask
└── instance/       # Base de données SQLite (valenstagram.db)
```

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

### Configuration du serveur Flask 

