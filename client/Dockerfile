FROM node:18-alpine

WORKDIR /client

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npx", "run", "dev", "--", "--host"]
