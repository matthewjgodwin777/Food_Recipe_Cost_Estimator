"use strict";
// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchForRecipes = exports.deleteRecipe = exports.updateRecipe = exports.getRecipe = exports.insertRecipe = void 0;
const string_similarity_js_1 = __importDefault(require("string-similarity-js"));
const IngredientResponseModel_1 = require("../db/IngredientResponseModel");
const zodSchemas_1 = require("../models/zodSchemas");
const imageFetch_1 = require("../utils/imageFetch");
const insertRecipe = async (req, res) => {
    try {
        const parsedResult = zodSchemas_1.ingredientResponseSchema.safeParse(req.body);
        if (!parsedResult.success) {
            res.status(400).json({ message: "Invalid format of request body received.", errors: parsedResult.error.errors });
            return;
        }
        req.body.recipe_name = req.body.recipe_name.trim();
        if (req.body.recipe_image_url === null)
            req.body.recipe_image_url = await (0, imageFetch_1.getRecipeNameImageSrc)(req.body.recipe_name);
        if (!await IngredientResponseModel_1.IngredientResponseModel.findOne({ recipe_name: req.body.recipe_name.trim() })) {
            const newRecipe = await IngredientResponseModel_1.IngredientResponseModel.create(req.body); // Save the request body to the database
            console.log("Recipe added to MongoDB:", newRecipe);
            res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
        }
        else {
            res.status(400).json({ message: "Recipe with same name already exists in database. Please delete it before adding this entry." });
        }
    }
    catch (error) {
        console.error("Error adding recipe:", error.message);
        res.status(500).json({ message: "Failed to add recipe", error: error.message });
    }
};
exports.insertRecipe = insertRecipe;
const getRecipe = async (req, res) => {
    const parsedResult = zodSchemas_1.querySchema.safeParse(req.query);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid query param supplied: Give \"recipe_name\" alone as a string parameter", errors: parsedResult.error.errors });
        return;
    }
    const recipe_name = parsedResult.data.recipe_name.trim();
    try {
        const recipe = await IngredientResponseModel_1.IngredientResponseModel.findOne({
            "recipe_name": recipe_name // Search for a recipe where an item's name matches
        });
        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json(recipe);
    }
    catch (error) {
        console.error("Error fetching recipe:", error.message);
        res.status(500).json({ message: "Failed to fetch recipe", error: error.message });
    }
};
exports.getRecipe = getRecipe;
const updateRecipe = async (req, res) => {
    const parsedResult = zodSchemas_1.ingredientResponseUpdateSchema.safeParse(req.body);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid format of request body received.", errors: parsedResult.error.errors });
        return;
    }
    const { recipe_name, updated_recipe } = req.body; // `name` identifies the item, `updates` contains the fields to update
    try {
        updated_recipe.is_modified = true;
        const result = await IngredientResponseModel_1.IngredientResponseModel.updateOne({ "recipe_name": recipe_name.trim() }, // Find the recipe containing the item with the given name
        { $set: updated_recipe } // Update the matching item
        );
        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json({ message: "Item updated successfully", result });
    }
    catch (error) {
        console.error("Error updating item:", error.message);
        res.status(500).json({ message: "Failed to update item", error: error.message });
    }
};
exports.updateRecipe = updateRecipe;
const deleteRecipe = async (req, res) => {
    const parsedResult = zodSchemas_1.querySchema.safeParse(req.query);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid query param supplied: Give \"recipe_name\" alone as a string parameter", errors: parsedResult.error.errors });
        return;
    }
    const recipe_name = parsedResult.data.recipe_name.trim(); // Get query parameters
    try {
        const result = await IngredientResponseModel_1.IngredientResponseModel.deleteOne({
            "recipe_name": recipe_name, // Match the item's name
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json({ message: "Recipe deleted successfully", result });
    }
    catch (error) {
        console.error("Error deleting recipe:", error.message);
        res.status(500).json({ message: "Failed to delete recipe", error: error.message });
    }
};
exports.deleteRecipe = deleteRecipe;
const searchForRecipes = async (req, res) => {
    const parsedResult = zodSchemas_1.querySchema.safeParse(req.query);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid query param supplied: Give \"recipe_name\" alone as a string parameter", errors: parsedResult.error.errors });
        return;
    }
    const recipe_name = parsedResult.data.recipe_name.trim();
    try {
        const recipes = await IngredientResponseModel_1.IngredientResponseModel.find(); // Fetch all recipes
        const matches = [];
        // Iterate through all items in all recipes
        recipes.forEach(recipe => {
            const similarity = (0, string_similarity_js_1.default)(recipe.recipe_name.toLowerCase(), recipe_name.toLowerCase());
            if (similarity >= 0.75) { // 75% similarity threshold
                matches.push({ recipe, similarity });
            }
        });
        if (matches.length === 0) {
            res.status(404).json({ message: "No matching recipes found" });
            return;
        }
        // Sort matches by similarity in descending order
        matches.sort((a, b) => b.similarity - a.similarity);
        res.status(200).json(matches);
    }
    catch (error) {
        console.error("Error performing fuzzy search:", error.message);
        res.status(500).json({ message: "Failed to perform fuzzy search", error: error.message });
    }
};
exports.searchForRecipes = searchForRecipes;
