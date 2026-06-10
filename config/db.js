import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let dbType = 'json';
let isConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (mongoURI) {
    try {
      console.log('Attempting connection to MongoDB Atlas...');
      const conn = await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000 // 5 seconds timeout
      });
      isConnected = true;
      dbType = 'mongodb';
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error('MongoDB connection error. Falling back to local JSON database:', error.message);
      dbType = 'json';
      isConnected = false;
    }
  } else {
    console.log('No MONGODB_URI environment variable detected. Running in Local JSON Database Mode.');
    dbType = 'json';
    isConnected = false;
  }
};

export { dbType, isConnected };
