import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connect } from 'http2';

dotenv.config()

const connectDB= async():Promise<void>=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI as string);//type safety
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch(error){
        console.error("Failed to connect to the database",error)
    }
};

export default connectDB;