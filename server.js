import "dotenv/config";
import express from "express";
import connectDB from "./config/connectDB.js";
import authrouter from "./routes/authRoutes.js";
import jobrouter from "./routes/jobRoutes.js";
import { GlobalErrorMiddleware } from "./utils/GlobalErrorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello from server!");
});

app.use("/auth", authrouter);
app.use("/", jobrouter);

app.use(GlobalErrorMiddleware);

const RunServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is runnning on ${PORT}`);
        });
    } catch (error) {
        console.log("Failed to run server", error.message);
        process.exit(1);
    }
};

await RunServer();
