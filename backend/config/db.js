// Import mongoose and dotenv if necessary
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

// Define the connectDB function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_LOCAL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Export the connectDB function
export default connectDB;
