"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIResponse = getAIResponse;
const axios_1 = __importDefault(require("axios"));
const constants_1 = require("../config/constants");
async function getAIResponse(userInput) {
    try {
        const response = await axios_1.default.post(constants_1.AI_URL, {
            messages: [
                {
                    role: "system",
                    content: "",
                },
                {
                    role: "user",
                    content: userInput,
                },
            ],
            model: "gpt-4o-mini",
            temperature: 1,
            max_tokens: 4096,
            top_p: 1,
        }, {
            headers: {
                "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`, // Use your github token from .env
                "Content-Type": "application/json",
            },
        });
        // Extract, print and return the AI response
        console.log("AI's Response: " + response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error("Error calling AI API:", error.response?.data || error.message);
            throw new Error("Failed to fetch AI response.");
        }
        else {
            console.error("Unexpected error:", error);
            throw new Error("An unexpected error occurred. " + error);
        }
    }
}
