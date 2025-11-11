import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()


const MONGODB_URI = process.env.MONGODB_URI || ""

export const connectDB = async () => {
    try {
        const connection = await mongoose.connect(MONGODB_URI)
        console.log(`Database connected : ${connection.connection.host}`);
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
}