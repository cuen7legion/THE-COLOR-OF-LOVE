# The Color of Love — Congruence Lab 53
# Dockerfile para Railway

FROM node:20-alpine AS builder
WORKDIR /app

# Herramientas necesarias para compilar better-sqlite3
RUN apk add --no-cache python3 make g++ libc6-compat

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# Build (frontend Vite + backend esbuild)
RUN npm run build

# ===== Production stage =====
FROM node:20-alpine
WORKDIR /app

# Instalar runtime para better-sqlite3
RUN apk add --no-cache libc6-compat

# Copiar artefactos de build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Crear directorio para volumen de SQLite
RUN mkdir -p /data

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=/data/tcl.db

EXPOSE 5000

CMD ["node", "dist/index.cjs"]
