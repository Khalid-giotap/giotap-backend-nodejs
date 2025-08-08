import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
console.log(MONGODB_URI);
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}
export const dbConnect = async () => {
  mongoose.connect(MONGODB_URI).then((data)=>{
    console.log('Database connected successfully to', data.connection.host);
  })
};
