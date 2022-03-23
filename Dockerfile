FROM node:16.14.0-alpine

RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    bash

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npx prisma db push && node dist/index.js"]