import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log(`Database connected successfully..!`);
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
};
export default connectDB