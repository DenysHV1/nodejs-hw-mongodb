import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';
import { Schema } from 'mongoose';

const bootstrap = async () => {
  await initMongoConnection();
  setupServer();
};

bootstrap();
