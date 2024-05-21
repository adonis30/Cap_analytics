import mongoose, {Mongoose} from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

let cached = (global as any).mongoose || { conn: null, promise: null };

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing');
  }

  try {
    // Add logging statement to indicate that the connection process has started
    console.log('Connecting to MongoDB...');
    
    // Attempt to connect to the MongoDB database
    cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
      dbName: 'capanalyticsdb',
      bufferCommands: false,
      connectTimeoutMS: 30000,
    });

    // Await the completion of the connection promise
    cached.conn = await cached.promise;

    // Add logging statement to indicate that the connection was successful
    console.log('Connected to MongoDB successfully.');
  } catch (error) {
    // If an error occurs during the connection attempt, catch it here
    console.error('Failed to connect to MongoDB:', error);
    // Re-throw the error to be caught by the caller
    throw error;
  }
  
  // Return the Mongoose connection
  return cached.conn;
}
