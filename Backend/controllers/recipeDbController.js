const stringSimilarity = require("string-similarity");
const IngredientResponse = require("../models/IngredientResponse");

exports.insertRecipe = async (req, res) => {
    try {
        req.body.recipe_name = req.body.recipe_name.trim();
        if(!await IngredientResponse.findOne({ recipe_name: req.body.recipe_name.trim()})){
            const newRecipe = await IngredientResponse.create(req.body); // Save the request body to the database
            console.log("Recipe added to MongoDB:", newRecipe);
            res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
        } else {
            res.status(400).json({ message: "Recipe with same name already exists in database. Please delete it before adding this entry.", recipe: null});
        }
    } catch (error) {
        console.error("Error adding recipe:", error.message);
        res.status(500).json({ message: "Failed to add recipe", error: error.message });
    }
};

exports.getRecipe = async (req, res) => {
    const recipe_name = req.query.recipe_name.trim(); // Get query parameters
    try {
        const recipe = await IngredientResponse.findOne({
            "recipe_name": recipe_name // Search for a recipe where an item's name matches
        });
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json(recipe);
    } catch (error) {
        console.error("Error fetching recipe:", error.message);
        res.status(500).json({ message: "Failed to fetch recipe", error: error.message });
    }
};

exports.updateRecipe = async (req, res) => {
    const {recipe_name, updated_recipe_fields } = req.body; // `name` identifies the item, `updates` contains the fields to update
    try {
        updated_recipe_fields.is_modified = true;
        const result = await IngredientResponse.updateOne(
            { "recipe_name": recipe_name.trim() }, // Find the recipe containing the item with the given name
            { $set: updated_recipe_fields } // Update the matching item
        );
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "Item not found" });
        }
        res.status(200).json({ message: "Item updated successfully", result });
    } catch (error) {
        console.error("Error updating item:", error.message);
        res.status(500).json({ message: "Failed to update item", error: error.message });
    }
};

exports.deleteRecipe = async (req, res) => {
    const recipe_name = req.query.recipe_name.trim(); // Get query parameters
    try {
        const result = await IngredientResponse.deleteOne({
            "recipe_name": recipe_name, // Match the item's name
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Recipe not found" });
        }
        res.status(200).json({ message: "Recipe deleted successfully", result });
    } catch (error) {
        console.error("Error deleting recipe:", error.message);
        res.status(500).json({ message: "Failed to delete recipe", error: error.message });
    }
};

exports.searchForRecipes = async (req, res) => {
    const recipe_name = req.query.recipe_name.trim(); // Get the name from query parameters
    try {
        const recipes = await IngredientResponse.find(); // Fetch all recipes
        const matches = [];

        // Iterate through all items in all recipes
        recipes.forEach(recipe => {
            const similarity = stringSimilarity.compareTwoStrings(recipe.recipe_name.toLowerCase(), recipe_name.toLowerCase());
            if (similarity >= 0.75) { // 75% similarity threshold
                matches.push({ recipe, similarity });
            }
        });

        if (matches.length === 0) {
            return res.status(404).json({ message: "No matching recipes found" });
        }

        // Sort matches by similarity in descending order
        matches.sort((a, b) => b.similarity - a.similarity);

        res.status(200).json(matches);
    } catch (error) {
        console.error("Error performing fuzzy search:", error.message);
        res.status(500).json({ message: "Failed to perform fuzzy search", error: error.message });
    }
};