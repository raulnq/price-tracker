# Price Tracker

A full-stack web application for automated price monitoring across e-commerce websites. Built with [Hono](https://hono.dev/), React, TypeScript, PostgreSQL, and AI-powered price extraction using Google Gemini.

## Features

- **Web UI** - React-based dashboard for managing stores, products, and viewing price trends
- **REST API** - Hono-powered backend for stores, products, and price histories
- **Automated Price Scraping** - Playwright-based web scraping with scheduled execution
- **AI Price Extraction** - Google Gemini extracts prices from webpage content
- **Price History Charts** - Visualize price trends over time with Recharts
- **Price Drop Email Alerts** - Get notified via Mailtrap when prices drop
- **Authentication** - Clerk-based user authentication
- **Structured Logging** - Pino logger with optional Seq integration
- **PostgreSQL Database** - Drizzle ORM for type-safe database operations

## Prerequisites

- Node.js 24.x or higher
- PostgreSQL database
- Google Gemini API key (for price scraping)
- Clerk account (for authentication)
- Mailtrap account (optional, for email alerts)

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

Create a `backend/.env` file:

```bash
# Server
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://myuser:mypassword@localhost:5432/mydb

# CORS
CORS_ORIGIN=http://localhost:5173

# Authentication
CLERK_SECRET_KEY=your-clerk-secret-key

# Logging
LOG_LEVEL=info
SEQ_URL=http://localhost:5341  # Optional: Seq server for centralized logging

# Price Scraping
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
CRON_EXPRESSION=0 */12 * * *  # Every 12 hours

# Email Alerts (optional)
MAILTRAP_API_TOKEN=your-mailtrap-api-token
ALERT_EMAIL_TO=your-email@example.com
ALERT_EMAIL_FROM=alerts@yourdomain.com
PRICE_DROP_THRESHOLD=0  # Minimum % drop to trigger alert (0 = any drop)
```

Create a `frontend/.env` file:

```bash
VITE_API_BASE_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
```

### 4. Start the database

```bash
npm run database:up
```

### 5. Run database migrations

```bash
npm run database:migrate
```

### 6. Start the development servers

```bash
# Terminal 1: Backend API
npm run dev:backend

# Terminal 2: Frontend
npm run dev:frontend

# Terminal 3 (optional): Price scraper scheduler
npm run dev:scheduler
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`
- Health check: `http://localhost:5000/live`

## Project Structure

```
price-tracker/
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Hono app configuration
│   │   ├── index.ts               # API server entry point
│   │   ├── scheduler.ts           # Price scraping scheduler
│   │   ├── env.ts                 # Environment validation
│   │   ├── database/
│   │   │   ├── client.ts          # Database client
│   │   │   └── schemas.ts         # Drizzle schemas
│   │   ├── features/
│   │   │   ├── products/          # Products & price history
│   │   │   ├── stores/            # Stores endpoints
│   │   │   └── scraper/           # Price scraping logic
│   │   ├── middlewares/           # Auth, error handling
│   │   └── utils/                 # Logger, validation, email
│   ├── tests/                     # Integration tests
│   ├── Dockerfile                 # Multi-stage Docker build
│   └── drizzle.config.ts          # Drizzle configuration
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Main app with auth
│   │   ├── routes.tsx             # React Router setup
│   │   ├── client-api.ts          # API client
│   │   ├── features/
│   │   │   ├── stores/            # Store pages & components
│   │   │   └── products/          # Product pages & components
│   │   └── components/            # Shared UI components
│   └── vite.config.ts             # Vite configuration
│
├── docker-compose.yml             # PostgreSQL & Seq services
└── package.json                   # Workspace configuration
```

## Available Scripts

| Script                      | Description                                   |
| --------------------------- | --------------------------------------------- |
| `npm run dev:backend`       | Start backend API with hot reload             |
| `npm run dev:frontend`      | Start frontend with hot reload                |
| `npm run dev:scheduler`     | Start price scraper scheduler with hot reload |
| `npm run build:backend`     | Build backend for production                  |
| `npm run build:frontend`    | Build frontend for production                 |
| `npm run start:backend`     | Run production backend API                    |
| `npm run start:scheduler`   | Run production scheduler                      |
| `npm run test:backend`      | Run backend tests                             |
| `npm run database:up`       | Start PostgreSQL container                    |
| `npm run database:down`     | Stop and remove database container            |
| `npm run database:generate` | Generate Drizzle migrations                   |
| `npm run database:migrate`  | Run database migrations                       |
| `npm run database:studio`   | Open Drizzle Studio                           |
| `npm run seq:up`            | Start Seq logging service                     |
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

### Backend

| Variable               | Required | Default                 | Description                                    |
| ---------------------- | -------- | ----------------------- | ---------------------------------------------- |
| `NODE_ENV`             | No       | `development`           | Environment mode                               |
| `PORT`                 | No       | `3000`                  | Server port                                    |
| `DATABASE_URL`         | Yes      | -                       | PostgreSQL connection string                   |
| `CORS_ORIGIN`          | No       | `http://localhost:5173` | CORS origin for frontend                       |
| `CLERK_SECRET_KEY`     | No       | -                       | Clerk secret key for authentication            |
| `LOG_LEVEL`            | No       | `info`                  | Log level (trace/debug/info/warn/error/fatal)  |
| `SEQ_URL`              | No       | -                       | Seq server URL for centralized logging         |
| `GEMINI_API_KEY`       | No       | -                       | Google Gemini API key (required for scraping)  |
| `GEMINI_MODEL`         | No       | `gemini-2.5-flash`      | Gemini model to use                            |
| `CRON_EXPRESSION`      | No       | `0 */12 * * *`          | Scraper schedule (cron format)                 |
| `MAILTRAP_API_TOKEN`   | No       | -                       | Mailtrap API token (required for email alerts) |
| `ALERT_EMAIL_TO`       | No       | -                       | Email address to receive price drop alerts     |
| `ALERT_EMAIL_FROM`     | No       | -                       | Sender email address (must be verified domain) |
| `PRICE_DROP_THRESHOLD` | No       | `0`                     | Minimum price drop % to trigger alert          |

### Frontend

| Variable                     | Required | Default                 | Description           |
| ---------------------------- | -------- | ----------------------- | --------------------- |
| `VITE_API_BASE_URL`          | No       | `http://localhost:5000` | Backend API URL       |
| `VITE_CLERK_PUBLISHABLE_KEY` | No       | -                       | Clerk publishable key |

## Price Scraper

The scheduler runs as a separate process that periodically scrapes prices from product URLs:

1. Fetches all products from the database
2. Uses Playwright to load each product page
3. Extracts visible text content
4. Sends content to Google Gemini for price extraction
5. Updates price history and current price
6. Sends email notification if price dropped (when configured)

### Running the Scheduler

```bash
# Development
npm run dev:scheduler

# Production
npm run start:scheduler
```

## Email Alerts

When configured with Mailtrap, the scheduler sends a summary email after each scraping run if any price drops are detected.

### Setup

1. Create an account at [Mailtrap](https://mailtrap.io/)
2. Verify a sending domain in your account settings
3. Generate an API token from your account dashboard
4. Configure environment variables:

```bash
MAILTRAP_API_TOKEN=your-api-token
ALERT_EMAIL_TO=recipient@example.com
ALERT_EMAIL_FROM=alerts@your-verified-domain.com
PRICE_DROP_THRESHOLD=5  # Only alert for drops > 5%
```

### How it works

- After scraping completes, all products with price drops exceeding the threshold are collected
- A single summary email is sent containing all price drops in a table format
- Each entry shows the product name, previous price, new price, and discount percentage
- If no price drops are detected, no email is sent

## Authentication

The application uses [Clerk](https://clerk.com/) for authentication:

1. Create a Clerk application at [clerk.com](https://clerk.com/)
2. Copy the secret key to `backend/.env` as `CLERK_SECRET_KEY`
3. Copy the publishable key to `frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY`

All `/api/*` endpoints require authentication via Bearer token.

## Logging

The application uses Pino for structured JSON logging:

- **Console**: Pretty-printed output in development
- **Seq**: Optional centralized logging when `SEQ_URL` is configured

Start Seq locally:

```bash
npm run seq:up
```

Access Seq UI at `http://localhost:8080`

## Docker

The project includes Docker support with multi-stage builds.

### Services

- `database` - PostgreSQL
- `migrator` - Runs migrations on startup
- `api` - REST API server
- `scheduler` - Price scraper scheduler
- `seq` - Centralized logging UI

### Commands

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
npm run test:backend
```

Tests use Node.js built-in test runner with a test database.

## Tech Stack

### Backend

- [Hono](https://hono.dev/) - Web framework
- [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Database
- [Playwright](https://playwright.dev/) - Browser automation
- [Google Gemini](https://ai.google.dev/) - AI price extraction
- [Pino](https://getpino.io/) - Logging
- [Clerk](https://clerk.com/) - Authentication

### Frontend

- [React](https://react.dev/) - UI library
- [React Router](https://reactrouter.com/) - Routing
- [TanStack Query](https://tanstack.com/query) - Server state management
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Radix UI](https://www.radix-ui.com/) - UI components
- [Recharts](https://recharts.org/) - Charts
- [Vite](https://vite.dev/) - Build tool

## License

[Apache 2.0](LICENSE)
