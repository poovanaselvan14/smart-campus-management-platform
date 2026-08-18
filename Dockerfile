# Production Dockerfile for Smart Campus Management SaaS

FROM node:20-alpine AS backend-builder
WORKDIR /app/server
COPY server/package*.json ./
COPY server/prisma ./prisma/
RUN npm ci
COPY server/ ./
RUN npx prisma generate && npm run build

FROM node:20-alpine AS frontend-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY --from=backend-builder /app/server/package*.json ./server/
COPY --from=backend-builder /app/server/node_modules ./server/node_modules
COPY --from=backend-builder /app/server/dist ./server/dist
COPY --from=backend-builder /app/server/prisma ./server/prisma
COPY --from=frontend-builder /app/client/dist ./client/dist

EXPOSE 5000

CMD ["node", "server/dist/server.js"]
