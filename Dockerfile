FROM node:23.10.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# passer la var avant le build sinon vite compile pas

ARG VITE_API_URL
ARG VITE_FRONT_URL
ARG VITE_API_MQTT_WSS
ARG VITE_API_MQTT_USER
ARG VITE_API_MQTT_PASSWORD
ARG VITE_REACT_APP_GIT_VERSION

ENV VITE_API_URL=$VITE_API_URL \
    VITE_FRONT_URL=$VITE_FRONT_URL \
    VITE_API_MQTT_WSS=$VITE_API_MQTT_WSS \
    VITE_API_MQTT_USER=$VITE_API_MQTT_USER \
    VITE_API_MQTT_PASSWORD=$VITE_API_MQTT_PASSWORD \
    VITE_REACT_APP_GIT_VERSION=$VITE_REACT_APP_GIT_VERSION


RUN npm ci && npm run build

FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
