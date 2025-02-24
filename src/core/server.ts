import { getAdapter } from '@/adapters';
import { defaultConfig, type ServerConfig } from "@/config/serverConfig";
import { loadRoutes } from './router';
import { watchRoutes } from './watcher';
import type { Server } from 'http';

async function createServer(
  routesDir: string,
  config: ServerConfig = defaultConfig
) {
  const { platform = 'node' } = config;
  
  if (config.isDev) {
    watchRoutes(routesDir);
    console.log("🔥 Dev mode activated");
  }

  const adapter = getAdapter(platform);
  const handler = adapter.createHandler(routesDir);

  switch (platform) {
    case 'node':
      return (handler as (config?: ServerConfig) => Server)(config);
    case 'vercel':
    case 'netlify':
      return handler;
    default:
      throw new Error(`Platform "${platform}" not supported`);
  }
}
export { createServer };
