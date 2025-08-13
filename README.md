# Learning API

A comprehensive NestJS API for learning CI/CD and Kubernetes operations.

## Features

- **Authentication**: JWT-based auth with refresh tokens
- **User Management**: Registration, login, profile management, roles
- **CRUD Operations**: Posts with user permissions
- **File Uploads**: Image/document upload with validation
- **Background Jobs**: Email notifications, image processing
- **Health Checks**: Kubernetes-ready health endpoints
- **API Documentation**: Swagger/OpenAPI integration

## Tech Stack

- **Framework**: NestJS with TypeScript
- **Database**: PostgreSQL with TypeORM
- **Cache**: Redis
- **Queue**: Bull (Redis-based)
- **Authentication**: JWT with Passport
- **Validation**: Class Validator
- **Documentation**: Swagger

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Redis

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp env.example .env
```

3. Update `.env` with your database and Redis credentials

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`
Swagger documentation at `http://localhost:3000/api/docs`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Users
- `GET /api/v1/users/profile` - Get current user profile
- `PATCH /api/v1/users/profile` - Update profile
- `GET /api/v1/users` - Get all users (Admin)
- `POST /api/v1/users` - Create user (Admin)

### Posts
- `GET /api/v1/posts` - Get all published posts
- `POST /api/v1/posts` - Create post
- `GET /api/v1/posts/my-posts` - Get user's posts
- `PATCH /api/v1/posts/:id` - Update post
- `DELETE /api/v1/posts/:id` - Delete post

### Files
- `POST /api/v1/files/upload` - Upload file

### Jobs
- `GET /api/v1/jobs/status` - Get queue status (Admin)
- `POST /api/v1/jobs/notification` - Add notification job (Admin)

### Health
- `GET /api/v1/health` - Health check
- `GET /api/v1/health/readiness` - Readiness probe
- `GET /api/v1/health/liveness` - Liveness probe

## Development

```bash
# Development
npm run start:dev

# Build
npm run build

# Production
npm run start:prod

# Tests
npm run test
npm run test:e2e
npm run test:cov

# Linting
npm run lint
```

## Database Migrations

```bash
# Generate migration
npm run migration:generate -- src/migrations/MigrationName

# Run migrations
npm run migration:run

# Revert migration
npm run migration:revert
```

## Docker Support

The application uses **distroless containers** for maximum production security, with comprehensive Docker support for both development and production.

### Development with Docker

```bash
# Start all services in development mode with hot reload
npm run docker:dev

# Or manually:
docker-compose -f docker-compose.dev.yml up --build
```

This starts:
- NestJS API with hot reload
- PostgreSQL database
- Redis cache
- Redis Commander (web UI at http://localhost:8081)

### Production with Docker

```bash
# Start all services in production mode
npm run docker:prod

# Or manually:
docker-compose up --build
```

### Docker Commands

```bash
# Build production image (distroless)
npm run docker:build

# Build development image (with debugging tools)
npm run docker:build:dev

# Build Alpine version (for comparison)
npm run docker:build:alpine

# Test security (should show "No shell access")
npm run docker:security-test

# View logs
npm run docker:logs

# Stop all services
npm run docker:down

# Build and start development environment
npm run docker:dev
```

### Security Features

**Distroless Production Image:**
- ✅ No shell access (cannot execute `sh` or `bash`)
- ✅ No package manager (cannot install packages)
- ✅ Minimal attack surface (only Node.js runtime)
- ✅ 36% smaller than Alpine (223MB vs 350MB)
- ✅ Enterprise-grade security compliance

### Environment Variables

The Docker setup uses these default values:
- Database: `learning_api` (PostgreSQL)
- Redis: Default configuration
- JWT secrets: Development keys (change in production)

### Accessing Services

When running with Docker:
- API: http://localhost:3000
- API Documentation: http://localhost:3000/api/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379
- Redis Commander: http://localhost:8081
- Health Checker: Monitor logs with `docker-compose logs health-checker`

**Note**: Health checks are handled externally since distroless containers have no built-in health check tools.
