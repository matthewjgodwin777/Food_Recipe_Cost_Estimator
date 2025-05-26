"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const recipeRoutes_1 = require("./routes/recipeRoutes");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
require("./config/config");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerConfig_1 = require("./config/swaggerConfig");
const app = (0, express_1.default)();
app.use(express_1.default.json()); //Middleware to parse JSON body
dotenv_1.default.config();
// Check for required environment variables
const requiredEnvs = ["BASE_URL", "MONGO_URI", "GITHUB_TOKEN"];
const missingEnvs = requiredEnvs.filter((env) => !process.env[env]);
if (missingEnvs.length > 0) {
    console.error(`Missing required environment variables: ${missingEnvs.join(", ")}`);
    process.exit(1);
}
// Connect to MongoDB
mongoose_1.default.connect(process.env.MONGO_URI || "")
    .then(() => {
    console.log("Connected to MongoDB successfully!");
}).catch((err) => {
    console.error("Error connecting to MongoDB:", err.message);
    console.warn("Stopping the server...");
    process.exit(1);
});
app.use("/static", express_1.default.static(path_1.default.join(__dirname, "resources")));
app.use("/", recipeRoutes_1.router);
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerConfig_1.swaggerSpec));
app.listen(3000);
