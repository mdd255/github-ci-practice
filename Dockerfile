# Multi-stage Dockerfile with Distroless for maximum security

# Stage 1: Dependencies (install once, cache effectively)
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install ALL dependencies (dev + prod) - cached until package.json changes
RUN npm ci --include=dev

# Stage 2: Build (source code + compilation)
FROM dependencies AS builder

# Create non-root user and directories in builder stage (distroless can't create users)
RUN addgroup -g 1001 -S nodejs \
    && adduser -S nestjs -u 1001 \
    && mkdir -p uploads \
    && chown -R nestjs:nodejs /app

# Copy source code (only rebuilds when source changes)
COPY . .

# Build the application and prune to production dependencies
RUN npm run build \
    && npm prune --production

# Stage 3: Distroless production runtime (minimal security-focused image)
FROM gcr.io/distroless/nodejs18-debian11

# Set working directory
WORKDIR /app

# Copy production dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy package.json for runtime reference
COPY --from=builder /app/package*.json ./

# Copy uploads directory with proper ownership
COPY --from=builder --chown=1001:1001 /app/uploads ./uploads

# Switch to non-root user (must use numeric ID in distroless)
USER 1001

# Expose port
EXPOSE 3000

# Note: No health check possible (no curl in distroless)
# Health checks must be handled by orchestrator (Kubernetes/Docker Compose)

# Start the application (no shell, direct binary execution)
CMD ["dist/main.js"]
