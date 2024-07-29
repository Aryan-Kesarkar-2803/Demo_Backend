import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}/${DB_NAME}`
    );
    console.log(`MongoDb connected (DB_Host)- ${connectionInstance.connection.host}`);
  } catch (err) {
    console.log(`MongoDB error - ${err}`);
    process.exit(1);
  }
};

