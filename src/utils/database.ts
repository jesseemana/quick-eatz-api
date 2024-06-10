import mongoose from 'mongoose';
import log from './logger';

async function connect() {
  try {
    await mongoose.connect(
      process.env.MONGODB_CONNECTION_STRING as string, 
      { dbName: 'QuickEatz', maxPoolSize: 10, }
    );
    log.info('Database connected.');
  } catch (error) {
    log.error(`Database connection failed, ${error}`);
  }
}

async function disconnect() {
  try {
    await mongoose.connection.close();
    log.fatal('Database connection closed due to app termination.');
  } catch (error) {
    log.error(`Database connection failed, ${error}`);
  }
}

export default { connect, disconnect }
