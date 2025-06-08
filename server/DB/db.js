import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Connected to Mongodb Database ${conn.connection.host}`.bgCyan);
  } catch (error) {
    console.log(`Server Error ${error}`);
  }
};

export default connectDB;
