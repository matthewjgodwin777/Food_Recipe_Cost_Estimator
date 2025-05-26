// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import express from "express";
import mongoose from "mongoose";
import { router } from "./routes/recipeRoutes";
import dotenv from "dotenv";
import path from "path";
import "./config/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swaggerConfig";

const app = express();
app.use(express.json()); //Middleware to parse JSON body

dotenv.config();

// Check for required environment variables
const requiredEnvs = ["BASE_URL", "MONGO_URI", "GITHUB_TOKEN"];
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
if (missingEnvs.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvs.join(", ")}`);
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI|| "")
    .then(() => {
        console.log("Connected to MongoDB successfully!");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        console.warn("Stopping the server...");
        process.exit(1);
    }
);

app.use("/static", express.static(path.join(__dirname, "resources")));
app.use("/", router);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000);