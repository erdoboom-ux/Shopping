import * as dotenv from 'dotenv';
dotenv.config(); // Must be called before other imports

import { createServer } from './lib/server';

const start = async () => {
  try {
    const server = await createServer();
    await server.start();
    console.log(`🚀 Server running on ${server.info.uri}`);
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

process.on('unhandledRejection', (err) => {
  console.error(err);
  process.exit(1);
});

start();
