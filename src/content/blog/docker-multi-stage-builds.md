---
title: Optimizing Docker Images with Multi-Stage Builds
excerpt:
  Learn how to create smaller, more secure Docker images using multi-stage
  builds and best practices for containerization.
publishDate: 2025-01-14
tags: [Docker, DevOps, Containers, Optimization]
readTime: 10 min read
draft: false
---

## Why Multi-Stage Builds?

Multi-stage builds dramatically reduce image size by separating build
dependencies from runtime dependencies.

## Basic Multi-Stage Build

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:18-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

## Go Application Example

```dockerfile
# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Final stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy only the binary from builder
COPY --from=builder /app/main .

EXPOSE 8080

CMD ["./main"]
```

## React Application

```dockerfile
# Build stage
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage with nginx
FROM nginx:alpine

COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

## Optimization Tips

```dockerfile
FROM python:3.11-slim AS base

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Build stage
FROM base AS builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Runtime stage
FROM base AS runtime

# Copy Python dependencies from builder
COPY --from=builder /root/.local /root/.local

# Copy application
COPY . .

# Make sure scripts in .local are usable
ENV PATH=/root/.local/bin:$PATH

EXPOSE 8000

CMD ["python", "app.py"]
```

## Docker Compose Integration

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=production
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=myapp
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## Build Arguments

```dockerfile
FROM node:18-alpine AS base

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ARG PORT=3000
ENV PORT=${PORT}

FROM base AS dependencies

WORKDIR /app

COPY package*.json ./

RUN if [ "$NODE_ENV" = "production" ]; \
    then npm ci --only=production; \
    else npm ci; \
    fi

FROM base AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

FROM base AS production

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
```

## Build the Image

```bash
# Build for production
docker build -t myapp:latest .

# Build with custom arguments
docker build --build-arg NODE_ENV=development -t myapp:dev .

# Build specific stage
docker build --target builder -t myapp:builder .
```

## Conclusion

Multi-stage builds are essential for production Docker images. They reduce size,
improve security, and make builds more efficient!
