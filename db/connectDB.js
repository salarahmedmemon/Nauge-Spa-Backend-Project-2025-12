import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("DB Connect Successfully");
  } catch (error) {
    console.log(`DB Not Connected ${error}`);
  }
};

export default connectDB;
