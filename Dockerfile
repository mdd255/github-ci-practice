# Stage 1: Dependencies
FROM node:18-alpine AS dev-dependencies

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies
RUN npm ci

# Stage 2: Build (source code + compilation)
FROM dev-dependencies AS builder

RUN mkdir -p uploads

# Copy source code (only rebuilds when source changes)
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production dependencies
FROM dev-dependencies AS prod-dependencies
COPY --from=builder /app/node_modules ./node_modules
RUN npm prune --production

# Stage 4: Distroless production runtime (minimal security-focused image)
FROM gcr.io/distroless/nodejs18-debian11

# Set working directory
WORKDIR /app

# Copy uploads directory
COPY --from=builder /app/uploads ./uploads

# Copy production dependencies (already pruned)
COPY --from=prod-dependencies /app/node_modules ./node_modules

# Copy package.json for runtime reference
COPY --from=builder /app/package*.json ./

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start the application (no shell, direct binary execution)
CMD ["dist/main.js"]
