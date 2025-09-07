import { Server, Request, ResponseToolkit } from '@hapi/hapi';
import hapiAuthJwt2 from 'hapi-auth-jwt2';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';
import { config } from './index';

export const registerPlugins = async (server: Server) => {
  const swaggerOptions: HapiSwagger.Options = {
    info: {
      title: 'E-commerce API Documentation',
      version: '1.0.0',
    },
    grouping: 'tags',
  };

  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  await server.register(hapiAuthJwt2);

  server.auth.strategy('jwt_strategy', 'jwt', {
    key: config.jwt.secret,
    validate: (decoded: any, request: Request) => {
      if (decoded && decoded.id && decoded.role) {
        return { isValid: true, credentials: { user: decoded } };
      }
      return { isValid: false };
    },
    verifyOptions: { algorithms: ['HS256'] },
    tokenType: 'Cookie',
    cookieKey: 'token',
  });

  server.auth.default('jwt_strategy');
};
