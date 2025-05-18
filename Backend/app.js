const express = require("express");
const mongoose = require("mongoose");
const recipeRoutes = require("./routes/recipeRoutes");

require("dotenv").config();

const app = express();

app.use(express.json()); //Middleware to parse JSON body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => {
        console.log("Connected to MongoDB successfully!");
    }).catch((err) => {
        console.error("Error connecting to MongoDB:", err.message);
        console.warn("Stopping the server...");
        process.exit(1);
    }
);

app.use("/", recipeRoutes);

app.listen(3000);