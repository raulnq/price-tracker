import { Hono } from 'hono';
import { storeRoute } from './features/stores/index.js';
import { productRoute } from './features/products/index.js';

export const app = new Hono({ strict: false });

app.route('/api', storeRoute);
app.route('/api', productRoute);

app.get('/live', c =>
  c.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
);

export type App = typeof app;
