import mongoose, { mongo } from "mongoose";

export const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URL as string);
        console.log("MongoDB Connected")
    } catch (error) {
        console.log("Error Connecting to MongoDB: ", error);
    }
}