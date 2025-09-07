# STAGE 1: Builder
# This stage installs all dependencies (including dev) and builds the TypeScript code.
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Copy package files and install ALL dependencies (prod + dev)
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Generate the Prisma client and build the TypeScript project
RUN npx prisma generate
RUN npm run build


# STAGE 2: Production
# This stage creates the final, lean image. It installs ONLY production
# dependencies and copies the built code from the 'builder' stage.
FROM node:18-alpine AS production
WORKDIR /usr/src/app

# For Render: Install the postgresql client so 'prisma migrate' can run
RUN apk add --no-cache postgresql-client

# Copy package files and install ONLY production dependencies
COPY package*.json ./
RUN npm install --only=production --omit=dev

# Copy the compiled code (the 'dist' folder) from the builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Copy the Prisma schema which is needed for migrations
COPY --from=builder /usr/src/app/prisma ./prisma

# Expose the application port and define the start command
EXPOSE 3000
CMD ["node", "dist/index.js"]
