# stage 1 : build react vite
FROM node:18-alpine AS build

WORKDIR /client

COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force

COPY . . 

RUN npm run build || (echo "Build failed! -> check typo" && exit 1) 

# stage 2 : production avec nginx
FROM nginx:alpine

COPY --from=build /client/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /client/dist /usr/share/nginx/html

COPY ./src/public ./public

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
