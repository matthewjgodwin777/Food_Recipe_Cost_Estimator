/* Commands I did for creating project
* npm init -y
* npm i express
* npm i axios
* npm i tough-cookie
* npm install axios-cookiejar-support
* npm i dotenv
* npm i mongoose
* npm i axios-retry
* npm i string-similarity
* npm i --save-dev nodemon
* (Ensure to add a variable inside "script" variable's json as ' "devStart":"nodemon server.js" ')

* npm i jsdom

* npm run devStart
*/

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