import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    
    // eslint-disable-next-line no-console
    console.log('✓ MongoDB connected successfully');
    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('✗ MongoDB connection error:', error instanceof Error ? error.message : error);
    
    // Don't exit - allow server to start and retry connection
    // Try to reconnect after 5 seconds
    setTimeout(connectDB, 5000);
    return false;
  }
};

export default connectDB;
