FROM node:20.11.0-alpine


WORKDIR /express-docker

COPY package*.json ./

RUN npm install --production


COPY . .


ENV NODE_ENV=production

EXPOSE 5000

CMD ["node", "index.js"] 