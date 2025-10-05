// ...existing code...
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_URI = process.env.DB_URI;
if (!DB_URI) throw new Error("DB_URI not found in environment variables!");

const connectDB = async () => {
  try {
    // removed deprecated options (useNewUrlParser, useUnifiedTopology)
    await mongoose.connect(DB_URI);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default connectDB;
// ...existing code...