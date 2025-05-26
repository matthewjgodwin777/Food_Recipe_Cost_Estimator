// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import axios from "axios";
import { AI_URL } from "../config/constants";

async function getAIResponse(userInput: string) {
    try {
        const response = await axios.post(
            AI_URL,
            {
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
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`, // Use your github token from .env
                    "Content-Type": "application/json",
                },
            }
        );

        // Extract, print and return the AI response
        console.log("AI's Response: "+response.data.choices[0].message.content);
        return response.data.choices[0].message.content;
    } catch (error: unknown) {
        if(axios.isAxiosError(error)){
            console.error("Error calling AI API:", error.response?.data || error.message);
            throw new Error("Failed to fetch AI response.");
        } else {
            console.error("Unexpected error:", error);
            throw new Error("An unexpected error occurred. "+error);
        }
    }
}

export {
    getAIResponse
};