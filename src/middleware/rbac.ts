import { Request, ResponseToolkit } from '@hapi/hapi';
import Boom from '@hapi/boom';
import { UserRole } from '@prisma/client';

export const requireRole = (requiredRole: UserRole) => {
  return (request: Request, h: ResponseToolkit) => {
    const user = request.auth.credentials.user as { role: UserRole };
    
    if (!user || user.role !== requiredRole) {
      throw Boom.forbidden('You do not have permission to perform this action.');
    }
    
    return h.continue;
  };
};
