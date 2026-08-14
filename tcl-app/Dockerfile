# The Color of Love — Congruence Lab 53
# Dockerfile para Railway

FROM node:20-alpine AS builder
WORKDIR /app

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

# Solo lo necesario para produccion
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Puerto Railway
ENV NODE_ENV=production
ENV PORT=5000
EXPOSE 5000

CMD ["node", "dist/index.cjs"]
