import mongoose from 'mongoose';
import log from './logger';

const connection_string = process.env.MONGODB_CONNECTION_STRING as string;

async function connect() {
  try {
    await mongoose.connect(connection_string, { dbName: 'QuickEatz' });
    log.info('Database connected.');
  } catch (error) {
    log.error(`Failed to connect to database, ${error}`);
  }
}

async function disconnect() {
  try {
    await mongoose.connection.close();
    log.fatal('Database connection closed due to app termination.');
  } catch (error) {
    log.error(`Failed to connect to database, ${error}`);
  }
}

export default { connect, disconnect }
