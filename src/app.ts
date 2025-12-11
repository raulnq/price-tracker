import { Hono } from 'hono';
import { storeRoute } from './features/stores/index.js';
import { productRoute } from './features/products/index.js';
import { onError } from '@/middlewares/on-error.js';
import { onNotFound } from './middlewares/on-not-found.js';
import { bearerAuth } from 'hono/bearer-auth';
import { ENV } from './env.js';
import { secureHeaders } from 'hono/secure-headers';

export const app = new Hono({ strict: false });

app.use(secureHeaders());
if (ENV.TOKEN) {
  app.use('/api/*', bearerAuth({ token: ENV.TOKEN }));
}

app.route('/api', storeRoute);
app.route('/api', productRoute);

app.get('/live', c =>
  c.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
  })
);

app.notFound(onNotFound);
app.onError(onError);

export type App = typeof app;
