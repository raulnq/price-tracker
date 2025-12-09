import { serve } from '@hono/node-server';
import { ENV } from '@/env.js';
import { app } from './app.js';

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
