# Price Tracker

A price tracking API built with [Hono](https://hono.dev/), TypeScript, PostgreSQL, and AI-powered price extraction using Google Gemini.

## Features

- **REST API** - Manage stores, products, and price histories
- **Automated Price Scraping** - Playwright-based web scraping with scheduled execution
- **AI Price Extraction** - Google Gemini extracts prices from webpage content
- **Structured Logging** - Pino logger with optional Seq integration
- **PostgreSQL Database** - Drizzle ORM for type-safe database operations
- **Bearer Token Auth** - Optional API authentication

## Prerequisites

- Node.js 24.x or higher
- PostgreSQL database
- Google Gemini API key (for price scraping)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install chromium
```

### 3. Set up environment variables

Create a `.env` file:

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb

# Authentication (optional)
TOKEN=your-bearer-token

# Logging
LOG_LEVEL=info
SEQ_URL=http://localhost:5341  # Optional: Seq server for centralized logging

# Price Scraping
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
CRON_EXPRESSION=0 */12 * * *  # Every 12 hours
```

### 4. Start the database

```bash
npm run database:up
```

### 5. Run database migrations

```bash
npm run database:migrate
```

### 6. Start the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## Project Structure

```
price-tracker/
├── src/
│   ├── app.ts                 # Hono app configuration
│   ├── index.ts               # API server entry point
│   ├── scheduler.ts           # Price scraping scheduler entry point
│   ├── env.ts                 # Environment validation
│   ├── database/
│   │   ├── client.ts          # Database client
│   │   └── schemas.ts         # Drizzle schemas
│   ├── features/
│   │   ├── products/          # Products & price history endpoints
│   │   ├── stores/            # Stores endpoints
│   │   └── scraper/           # Price scraping logic
│   ├── middlewares/           # Error handling, not found
│   └── utils/                 # Logger, validation, problem documents
├── tests/                     # Integration tests
├── docker-compose.yml         # PostgreSQL & Seq services
└── drizzle.config.ts          # Drizzle configuration
```

## Available Scripts

| Script                      | Description                                   |
| --------------------------- | --------------------------------------------- |
| `npm run dev`               | Start API server with hot reload              |
| `npm run dev:scheduler`     | Start price scraper scheduler with hot reload |
| `npm run build`             | Build for production                          |
| `npm start`                 | Run production API server                     |
| `npm run start:scheduler`   | Run production scheduler                      |
| `npm test`                  | Run tests                                     |
| `npm run database:up`       | Start PostgreSQL container                    |
| `npm run database:down`     | Stop and remove database container            |
| `npm run database:generate` | Generate Drizzle migrations                   |
| `npm run database:migrate`  | Run database migrations                       |
| `npm run database:studio`   | Open Drizzle Studio                           |
| `npm run lint`              | Lint code                                     |
| `npm run format`            | Format code                                   |

## API Endpoints

### Stores

| Method | Endpoint               | Description     |
| ------ | ---------------------- | --------------- |
| GET    | `/api/stores`          | List stores     |
| GET    | `/api/stores/:storeId` | Get store by ID |
| POST   | `/api/stores`          | Create store    |
| PUT    | `/api/stores/:storeId` | Update store    |

### Products

| Method | Endpoint                   | Description       |
| ------ | -------------------------- | ----------------- |
| GET    | `/api/products`            | List products     |
| GET    | `/api/products/:productId` | Get product by ID |
| POST   | `/api/products`            | Create product    |
| PUT    | `/api/products/:productId` | Update product    |

### Price History

| Method | Endpoint                          | Description        |
| ------ | --------------------------------- | ------------------ |
| GET    | `/api/products/:productId/prices` | List price history |
| POST   | `/api/products/:productId/prices` | Add price entry    |

### Health

| Method | Endpoint | Description  |
| ------ | -------- | ------------ |
| GET    | `/live`  | Health check |

## Environment Variables

| Variable          | Required | Default            | Description                                   |
| ----------------- | -------- | ------------------ | --------------------------------------------- |
| `NODE_ENV`        | No       | `development`      | Environment mode                              |
| `PORT`            | No       | `3000`             | Server port                                   |
| `DATABASE_URL`    | Yes      | -                  | PostgreSQL connection string                  |
| `TOKEN`           | No       | -                  | Bearer token for API auth                     |
| `LOG_LEVEL`       | No       | `info`             | Log level (trace/debug/info/warn/error/fatal) |
| `SEQ_URL`         | No       | -                  | Seq server URL for centralized logging        |
| `GEMINI_API_KEY`  | No       | -                  | Google Gemini API key (required for scraping) |
| `GEMINI_MODEL`    | No       | `gemini-2.5-flash` | Gemini model to use                           |
| `CRON_EXPRESSION` | No       | `0 */12 * * *`     | Scraper schedule (cron format)                |

## Price Scraper

The scheduler runs as a separate process that periodically scrapes prices from product URLs:

1. Fetches all products from the database
2. Uses Playwright to load each product page
3. Extracts visible text content
4. Sends content to Google Gemini for price extraction
5. Updates price history and current price

### Running the Scheduler

```bash
# Development
npm run dev:scheduler

# Production
npm run start:scheduler
```

## Logging

The application uses Pino for structured JSON logging:

- **Console**: Pretty-printed output in development
- **Seq**: Optional centralized logging when `SEQ_URL` is configured

Start Seq locally:

```bash
npm run seq:up
```

Access Seq UI at `http://localhost:8080`

## Docker Services

```bash
# Start PostgreSQL
npm run database:up

# Start Seq (logging)
npm run seq:up

# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## Testing

```bash
npm test
```

Tests use Node.js built-in test runner with a test database.
