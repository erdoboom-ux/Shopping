import { prisma } from '../../database/prisma-client';
import { User, Prisma } from '@prisma/client';

export const authRepository = {
  findUserByEmail: async (email: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { email } });
  },

  findUserById: async (id: string): Promise<User | null> => {
    return prisma.user.findUnique({ where: { id } });
  },

  createUser: async (userData: Prisma.UserCreateInput): Promise<User> => {
    return prisma.user.create({ data: userData });
  },
};
