FROM node:24-slim AS base
WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Create nodejs user with home directory
RUN groupadd -g 1001 nodejs && useradd -u 1001 -g nodejs -m nodejs

# Copy and build application
COPY package*.json tsconfig.json drizzle.config.ts ./
COPY src ./src
RUN npm ci --ignore-scripts && npm run build && npm prune --omit=dev && npm cache clean --force
RUN chown -R nodejs:nodejs /app

# Switch to nodejs user and install Playwright browsers
USER nodejs
RUN npx playwright install chromium

FROM base AS api
EXPOSE 3000
CMD ["node", "/app/dist/index.js"]

FROM base AS migrator
CMD ["sh", "-c", "npm run database:migrate"]

FROM base AS scheduler
CMD ["node", "/app/dist/scheduler.js"]
