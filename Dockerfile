FROM node:18-alpine
WORKDIR /usr/src/app
RUN apk add --no-cache postgresql-client
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]
