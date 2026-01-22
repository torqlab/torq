#!/usr/bin/env bun

/**
 * UI Server for PACE
 *
 * Provides web endpoints for Strava OAuth authorization and token management.
 */

import getConfig from '../config';
import { handleStravaAuth, handleStravaAuthCallback, handleRoot } from '../routes';

const config = getConfig();

Bun.serve({
  port: config.port,
  hostname: config.hostname,
  routes: {
    '/': {
      GET: (request) => handleRoot(request, config),
    },
    '/strava/auth': {
      GET: (request) => handleStravaAuth(request, config),
    },
    '/strava/auth/callback': {
      GET: async (request) => await handleStravaAuthCallback(request, config),
    },
  },
  development: {
    hmr: false,
    console: true,
  },
  error(error) {
    console.error('Server error:', error);
    return new Response('Internal Server Error', { status: 500 });
  },
});

console.log(`🚀 PACE UI Server running on http://${config.hostname}:${config.port}`);
console.log(`📋 Strava Auth: http://${config.hostname}:${config.port}/strava/auth`);
