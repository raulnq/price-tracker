import { Hono } from 'hono';
import { storeRoute } from './features/stores/index.js';

export const app = new Hono({ strict: false });

app.route('/api', storeRoute);

app.get('/live', c =>
  c.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
);

export type App = typeof app;
