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
                    "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`, // Use the token from .env
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

/*
Example usage: -


(async () => {
    try {
        const aiResponse = await getAIResponse("So I want you to give a list of comma separated text (start adn end this comma separated line(s) with open and close squar brackets so i can find it easily by code logic), where the title of each ingredient is present for the food which i will describe in below para/line. But Ensure you dont give too much descriptions, whatever text you give each separated by comma will be searched in bigbasket website, and i have to hope you give very less words to describe each ingredient, possible very common words so the search succeeds. Also same way ensure to give another comma separated line of values similarly starting and ends with square brackets, which denote the numeric grams or millilitres required WITHOUT THE UNIT, and again as another [XX,XX,X,X] comma separated list, give the units (only official units like g or ml or mg or kg or L, STRICTLY DONT GIVE UNITS LIKE piece, tablespoon, tspn, cup, strip, etc, I NEED properly recognised officially, that too only the ones i said, these 5 only. and ofcourse semi solids like yogurt still give as g (grams), only liquids like cream, oil, essenses, etc give in ml or L) of them so i know how much quantity and what unit is the measurement of the product i need. AND ENSURE ALL of these 3 lists have correlated indices so i know 0th index of all is related, etc and THEY SHOULD BE ONLY 3 single dimensional lists, NOT nested lists etc, please give properly and DONT YOU DARE MISS A SINGLE INGREDIENT, even as insignificant as spices, salt etc, dont miss the smallest additions except water, and ensure the ingredient names exist in Indian markets not very weird or foreign names (dont say Cilantro, simply Corriander, like that im saying) unless its definitely in many grocery apps:\nChicken Tikka Masala");
        console.log("AI Response:", aiResponse);
    } catch (error) {
        console.error("Error:", error.message);
    }
})();

*/