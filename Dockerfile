FROM node:16-alpine

WORKDIR /

COPY package*.json ./

RUN npm ci --only=production

COPY . .

EXPOSE 8080

CMD [ "node", "index.js" ]
