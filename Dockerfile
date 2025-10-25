FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm ci

COPY . .

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
