import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';
import { User } from '@prisma/client';
import { config } from '../../config';

type UserPublic = Omit<User, 'password'>;

export const authService = {
  register: async (userData: any): Promise<UserPublic> => {
    const existingUser = await authRepository.findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await authRepository.createUser({
      ...userData,
      password: hashedPassword,
    });
    
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  },

  login: async (credentials: any): Promise<{ token: string; user: UserPublic }> => {
    const user = await authRepository.findUserByEmail(credentials.email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );
    
    const { password, ...userWithoutPassword } = user;
    return { token, user: userWithoutPassword };
  },

  getUserById: async(id: string): Promise<UserPublic | null> => {
    const user = await authRepository.findUserById(id);
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
};
