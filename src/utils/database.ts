import mongoose from 'mongoose';
import log from './logger';

async function connectDb() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    log.info('Database connected!!!');
  } catch (error) {
    log.error('Failed to connect to DB:', error);
  }
}

export default connectDb;
