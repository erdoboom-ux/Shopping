export const config = {
  jwt: {
    secret: process.env.JWT_SECRET || 'a-very-weak-secret-key-for-dev',
    expiresIn: '1d',
  },
  env: process.env.NODE_ENV || 'development',
};
