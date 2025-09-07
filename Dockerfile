# Use the official Node.js 18 Alpine image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# For Render: Install the postgresql client so 'prisma migrate' can run
RUN apk add --no-cache postgresql-client

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install ALL dependencies (production and dev)
RUN npm install

# Copy the rest of the application source code into the container
COPY . .

# Generate the Prisma client and build the TypeScript project
RUN npx prisma generate
RUN npm run build

# The port your app will run on
EXPOSE 3000

# The command to run your application (this will be overridden by Render's Docker Command)
CMD ["node", "dist/index.js"]
