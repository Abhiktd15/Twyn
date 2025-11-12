import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || ""

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(MONGODB_URI)
        console.log(`Database Connected: ${conn.connection.host}`)
    } catch (error : any) {
        console.log(`Error: ${error}`)
        process.exit(1)
    }
}

export default connectDB;