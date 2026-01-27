import { Hono } from 'hono';
import { getStatsRoute } from './get-stats.js';

export const statsRoute = new Hono()
  .basePath('/stats')
  .route('/', getStatsRoute);
