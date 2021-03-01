FROM node:14.16.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --quiet

COPY . ./

CMD ["node", "src/index.js"]