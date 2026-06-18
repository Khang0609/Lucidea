# 1. Base Image
FROM node:20-alpine AS base

WORKDIR /app

# 2. Development Image (for running development server with live reload in Docker)
FROM base AS development

COPY package*.json ./
RUN rm -f package-lock.json && npm install

COPY . .

EXPOSE 4200

# Bind to 0.0.0.0 to allow incoming connections from the host OS
CMD ["npx", "nx", "dev", "web", "-H", "0.0.0.0", "-p", "4200"]

# 3. Build Runner (compiles typescript, copies workspace libs, and builds the Web frontend)
FROM base AS build-runner

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx nx build web --prod

# 4. Production Image (optimized and lightweight)
FROM node:20-alpine AS production

WORKDIR /app

# Copy the built code from build-runner
COPY --from=build-runner /app/dist/apps/web ./

# Install only production dependencies directly inside the container
RUN npm install --omit=dev

EXPOSE 4200

ENV NODE_ENV=production
ENV PORT=4200

CMD ["npx", "next", "start", "-p", "4200"]
