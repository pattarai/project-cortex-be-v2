# stage 1 building the code
FROM node:16.14.0-alpine as alpine

RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    bash

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node:16.14.0-alpine

RUN apk add --no-cache --virtual .gyp \
    python3 \
    make \
    g++ \
    bash

WORKDIR /usr/app
COPY package*.json ./
RUN npm install --production

COPY --from=builder /usr/app/dist ./dist

EXPOSE 3000
CMD node dist/src/index.js