# The Color of Love — Congruence Lab 53
# Dockerfile para Railway
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache python3 make g++ libc6-compat

COPY package.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app

RUN apk add --no-cache libc6-compat

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

RUN mkdir -p /data

ENV NODE_ENV=production
ENV PORT=5000
ENV DATABASE_URL=/data/tcl.db

EXPOSE 5000

CMD ["node", "dist/index.cjs"]
