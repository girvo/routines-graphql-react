# Build stage
FROM node:24-alpine AS builder

# Install pnpm
RUN corepack enable && corepack prepare pnpm@10.21.0 --activate

# Install build dependencies for native modules (better-sqlite3)
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy workspace config files
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy backend package.json
COPY backend/package.json ./backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source files
COPY backend/ ./backend/
COPY schema.graphql ./

# Production stage
FROM node:24-alpine AS production

# Install pnpm for running the app
RUN corepack enable && corepack prepare pnpm@10.21.0 --activate

WORKDIR /app

# Copy workspace files
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/schema.graphql ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-workspace.yaml ./

ENV NODE_ENV=production

EXPOSE 4000

WORKDIR /app/backend

CMD ["node", "src/main.ts"]
