FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --production
COPY . .

WORKDIR /app/backend

EXPOSE 3000
CMD ["node", "index.js"]