import "dotenv/config";
import express from "express";
import connectDB from "./config/connectDB.js";
import routes from "./routes/index.js";
import {seedRoles} from "./utils/seedRoles.js";

import { GlobalErrorMiddleware } from "./utils/GlobalErrorHandler.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
    res.send("Hello from server!");
});

app.use("/api", routes);

app.use(GlobalErrorMiddleware);

const RunServer = async () => {
    try {
        await connectDB();
        await seedRoles()
        app.listen(PORT, () => {
            console.log(`Server is runnning on ${PORT}`);
        });
    } catch (error) {
        console.log("Failed to run server", error.message);
        process.exit(1);
    }
};

await RunServer();
