# ---- Base Stage ----
FROM node:18-alpine AS base
WORKDIR /usr/src/app

# ---- Dependencies Stage ----
FROM base AS dependencies
COPY package*.json ./
RUN npm install --only=production
COPY prisma ./prisma/
RUN npx prisma generate

# ---- Build Stage ----
FROM base AS build
COPY . .
RUN npm install
# This build command now includes the prisma generate step
RUN npx prisma generate && npm run build

# ---- Production Stage ----
FROM base AS production
ENV NODE_ENV=production
# Add a build step to apply migrations on startup for Render
RUN apk add --no-cache postgresql-client
COPY package*.json ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/prisma ./prisma
# Render's Build Command will run this script
COPY --from=build /usr/src/app/package.json ./

EXPOSE 3000
CMD ["node", "dist/index.js"]
