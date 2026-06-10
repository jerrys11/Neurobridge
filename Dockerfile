# ---- Stage 1: build frontend ----
FROM node:22-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# ---- Stage 2: backend + static files ----
FROM node:22-slim
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ ./
COPY --from=frontend /app/frontend/dist ./public
ENV NODE_ENV=production
EXPOSE 8080
CMD ["node", "server.js"]
