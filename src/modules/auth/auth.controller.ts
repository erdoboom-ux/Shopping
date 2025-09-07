import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { authService } from './auth.service';
import { config } from '../../config';

export const authController = {
  register: async (request: Request, h: ResponseToolkit) => {
    try {
      const newUser = await authService.register(request.payload);
      return h.response(newUser).code(201);
    } catch (error: any) {
      if (error.message.includes('already exists')) {
        throw Boom.conflict(error.message);
      }
      throw Boom.internal('An unexpected error occurred');
    }
  },

  login: async (request: Request, h: ResponseToolkit) => {
    try {
      const { token, user } = await authService.login(request.payload);
      
      return h.response({ user })
        .state('token', token, {
          isSecure: config.env === 'production',
          isHttpOnly: true,
          path: '/',
          ttl: 24 * 60 * 60 * 1000, // 24 hours
        })
        .code(200);

    } catch (error: any) {
      throw Boom.unauthorized(error.message);
    }
  },

  getMe: async (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials.user;
    if (!user) {
        throw Boom.unauthorized('No user credentials found');
    }
    const freshUser = await authService.getUserById(user.id);
    return h.response(freshUser).code(200);
  }
};
