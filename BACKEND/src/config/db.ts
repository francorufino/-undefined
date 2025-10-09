import mongoose from "mongoose";
import {env} from "./env.js";

export async function connectDB(){
  try{
    await mongoose.connect(env.MONGO_URL);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}