FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

COPY . .

EXPOSE 8080
CMD [ "node", "src/server.js" ]
