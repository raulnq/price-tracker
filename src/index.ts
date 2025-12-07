import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { ENV } from '@/env.js';
const app = new Hono();

app.get('/', c => {
  return c.text('Hello Hono!');
});

serve(
  {
    fetch: app.fetch,
    port: ENV.PORT,
  },
  info => {
    console.log(
      `Server(${ENV.NODE_ENV}) is running on http://localhost:${info.port}`
    );
  }
);
