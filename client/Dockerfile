FROM node:18-alpine

WORKDIR /client

COPY . .

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev"]
