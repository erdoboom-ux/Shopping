import { Server } from '@hapi/hapi';
import { authController } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validation';

export const authRoutes = (server: Server) => {
  server.route({
    method: 'POST',
    path: '/auth/register',
    handler: authController.register,
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Register a new user',
      validate: {
        payload: registerSchema,
        failAction: 'error',
      },
    },
  });

  server.route({
    method: 'POST',
    path: '/auth/login',
    handler: authController.login,
    options: {
      auth: false,
      tags: ['api', 'auth'],
      description: 'Login a user and returns a JWT cookie',
      validate: {
        payload: loginSchema,
        failAction: 'error',
      },
    },
  });

  server.route({
    method: 'GET',
    path: '/auth/me',
    handler: authController.getMe,
    options: {
      tags: ['api', 'auth'],
      description: 'Get the currently authenticated user profile',
    },
  });
};
