FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

# === Build arguments passés depuis le workflow ===
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_FRONT_URL
ARG NEXT_PUBLIC_MQTT_URL
ARG NEXT_PUBLIC_API_MQTT_USER
ARG NEXT_PUBLIC_API_MQTT_PASSWORD
ARG NEXT_PUBLIC_REACT_APP_GIT_VERSION

# === On exporte les ARG en ENV pour le build Next.js ===
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_FRONT_URL=$NEXT_PUBLIC_FRONT_URL
ENV NEXT_PUBLIC_MQTT_URL=$NEXT_PUBLIC_MQTT_URL
ENV NEXT_PUBLIC_API_MQTT_USER=$NEXT_PUBLIC_API_MQTT_USER
ENV NEXT_PUBLIC_API_MQTT_PASSWORD=$NEXT_PUBLIC_API_MQTT_PASSWORD
ENV NEXT_PUBLIC_REACT_APP_GIT_VERSION=$NEXT_PUBLIC_REACT_APP_GIT_VERSION

ENV NODE_ENV=production

RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

ENV NEXT_PUBLIC_API_URL=https://api.evanh.site
ENV NEXT_PUBLIC_FRONT_URL=https://app.evanh.site
ENV NEXT_PUBLIC_MQTT_URL=wss://api.evanh.site

EXPOSE 3000
CMD ["npm", "start"]
