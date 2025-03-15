# Étape de build
FROM node:20-alpine as build

WORKDIR /app

# Copie des fichiers de dépendances pour optimiser le cache Docker
COPY package.json package-lock.json* ./
RUN npm install

# Copie du reste des fichiers source
COPY . .

# Configuration de l'URL du serveur API pour la production
RUN echo "const config = { serverUrl: \"http://server:5000\" }; export default config;" > ./src/config.ts

# Build de l'application
RUN npm run build

# Étape de production avec Nginx
FROM nginx:alpine

# Copie du build depuis l'étape précédente
COPY --from=build /app/dist /usr/share/nginx/html

# Configuration personnalisée de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposition du port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]