import { UserRole } from '@prisma/client';

declare module '@hapi/hapi' {
  interface AuthCredentials {
    user?: {
      id: string;
      email: string;
      role: UserRole;
    };
  }
}
