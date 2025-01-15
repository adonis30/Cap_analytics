import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Ensure that the cached object is correctly typed
interface CachedMongoose {
  conn: mongoose.Mongoose | null;
  promise: Promise<mongoose.Mongoose> | null;
}

declare global {
  namespace NodeJS {
    interface Global {
      mongoose: CachedMongoose;
    }
  }
}

const globalAny: any = global; // TypeScript workaround for global object
let cached = globalAny.mongoose;

if (!cached) {
  cached = globalAny.mongoose = { conn: null, promise: null };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  try {
    // Add logging statement to indicate that the connection process has started
    //console.log('Connecting to MongoDB...');
    
    // Attempt to connect to the MongoDB database
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      dbName: 'capanalyticsdb',
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

    // Await the completion of the connection promise
    cached.conn = await cached.promise;

    // Log success message if connection is successful
    //console.log('MongoDB connection successful!');
   
  } catch (error) {
    throw error;
  }
  
  // Return the Mongoose connection
  return cached.conn;
};

// Invoke the function to connect to the database
connectToDatabase().catch(err => console.error(err));
