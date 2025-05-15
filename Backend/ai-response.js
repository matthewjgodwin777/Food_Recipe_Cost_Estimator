const {AI_URL} = require("./constants");
const axios = require("axios");

async function getAIResponse(userInput) {
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
    } catch (error) {
        console.error("Error calling AI API:", error.response?.data || error.message);
        throw new Error("Failed to fetch AI response.");
    }
}

module.exports = {
    getAIResponse
};
