import { hc } from 'hono/client';
import type { App } from '#/app';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const client = hc<App>(API_BASE_URL);
