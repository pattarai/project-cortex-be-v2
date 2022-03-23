# stage 1 building the code
FROM node as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# stage 2
FROM node
WORKDIR /usr/app
COPY package*.json ./
RUN npm install

COPY --from=builder /usr/app/dist ./dist
COPY prisma ./prisma

COPY .env .

EXPOSE 5000
RUN npx prisma generate
CMD node dist/index.js