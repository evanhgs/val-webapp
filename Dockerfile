FROM node:23.10.0-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# passer la var avant le build sinon vite compile pas

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM nginx:stable-alpine AS production

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
