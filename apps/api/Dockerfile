# 1. Base Image
FROM node:20-alpine AS base

# Install dependencies required for compiling native node modules (like argon2)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# 2. Development Image (for running development server with live reload in Docker)
FROM base AS development

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3333

# Bind to 0.0.0.0 to allow incoming connections from the host OS
CMD ["npx", "nx", "serve", "api", "--host", "0.0.0.0", "--port", "3333"]

# 3. Build Runner (compiles typescript, copies workspace libs, and builds the API)
FROM base AS build-runner

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build api --prod

# Install only production dependencies directly inside the dist output folder.
# This compiles native modules (like argon2) using the build tools available in build-runner.
WORKDIR /app/dist/apps/api
RUN npm install --omit=dev

# 4. Production Image (optimized and lightweight)
# We start from a clean Node alpine image with no build tools
FROM node:20-alpine AS production

WORKDIR /app

# Copy the built code AND the pre-compiled production node_modules from build-runner
COPY --from=build-runner /app/dist/apps/api ./

EXPOSE 3333

ENV NODE_ENV=production

CMD ["node", "main.js"]
