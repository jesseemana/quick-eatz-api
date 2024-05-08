import mongoose from 'mongoose';

const MONGO_URI = (process.env.MONGODB_CONNECTION_STRING as string);

async function connectDb() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Database connected!');
  } catch (error) {
    console.error('Failed to connect to DB:', error);
  }
}

export default connectDb;
