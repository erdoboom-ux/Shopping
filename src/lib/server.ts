import Hapi from '@hapi/hapi';
import { authRoutes } from '../modules/auth/auth.routes';
import { registerPlugins } from '../config/plugins';

export const createServer = async (): Promise<Hapi.Server> => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0', // Important for Docker
    routes: {
        cors: {
            origin: ['*'], // Be more specific in production
            credentials: true
        }
    }
  });

  // Register all plugins (Swagger, JWT Auth)
  await registerPlugins(server);

  // Register routes
  authRoutes(server);

  // Simple health check route
  server.route({
    method: 'GET',
    path: '/',
    options: {
        auth: false, // No authentication required for health check
        tags: ['api'],
        description: 'Server health check'
    },
    handler: () => {
      return { status: 'ok', timestamp: new Date().toISOString() };
    },
  });

  return server;
};
