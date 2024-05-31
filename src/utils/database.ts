import mongoose from 'mongoose';
import log from './logger';

async function connect() {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
    // mongoose.connection.on('connected', () => log.info('Database connected.'));
    // mongoose.connection.on('disconnected', () => log.warn('Database has been disconnected.'));
    // mongoose.connection.on('error', (error: string) => log.error('Error connecting to database:',error));
    log.info('Database connected.');
  } catch (error) {
    log.error('A database connection error occured:', error);
  }
}

async function disconnect() {
  try {
    await mongoose.connection.close();
    log.fatal('Database connection closed due to app termination.');
  } catch (error) {
    log.error('A database connection error occured:', error);
  }
}

export default { connect, disconnect }
