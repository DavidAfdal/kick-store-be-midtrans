# =========================
# Stage 1 — Dependencies
# =========================
FROM node:20.11.0-alpine AS deps

WORKDIR /app

COPY package*.json ./

# Install hanya production dependencies
RUN npm ci --omit=dev


# =========================
# Stage 2 — Production
# =========================
FROM node:20.11.0-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules dari stage deps
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "index.js"]