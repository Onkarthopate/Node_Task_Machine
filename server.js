import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import authrouter from "./routes/authRoutes.js";
import jobrouter from "./routes/jobRoutes.js";

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello from server!")
})

app.use("/auth",authrouter);
app.use("/",jobrouter);

const RunServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is runnning on ${PORT}`);
        })
    } catch (error) {
        console.log("Failed to run server", error.message);
        process.exit(1);
    }
};

await RunServer();




