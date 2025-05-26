import compareTwoStrings from "string-similarity-js";
import { IngredientResponseModel } from "../db/IngredientResponseModel";
import { Request, Response } from "express";
import { SearchRecipeResult } from "../models/SearchRecipeResult";
import { querySchema, ingredientResponseSchema,
        ingredientResponseUpdateSchema } from "../models/zodSchemas";
import { getRecipeNameImageSrc } from "../utils/imageFetch";

export const insertRecipe = async (req: Request, res: Response)  => {
    try {
        const parsedResult = ingredientResponseSchema.safeParse(req.body);
        if (!parsedResult.success) {
            res.status(400).json({ message: "Invalid format of request body received.", errors: parsedResult.error.errors });
            return;
        }
        req.body.recipe_name = req.body.recipe_name.trim();
        if(req.body.recipe_image_url === null)
            req.body.recipe_image_url = await getRecipeNameImageSrc(req.body.recipe_name);
        if(!await IngredientResponseModel.findOne({ recipe_name: req.body.recipe_name.trim()})){
            const newRecipe = await IngredientResponseModel.create(req.body); // Save the request body to the database
            console.log("Recipe added to MongoDB:", newRecipe);
            res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
        } else {
            res.status(400).json({ message: "Recipe with same name already exists in database. Please delete it before adding this entry." });
        }
    } catch (error: any) {
        console.error("Error adding recipe:", error.message);
        res.status(500).json({ message: "Failed to add recipe", error: error.message });
    }
};

export const getRecipe = async (req: Request, res: Response) => {
    const parsedResult = querySchema.safeParse(req.query);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid query param supplied: Give \"recipe_name\" alone as a string parameter", errors: parsedResult.error.errors });
        return;
    }
    const recipe_name = parsedResult.data.recipe_name.trim();

    try {
        const recipe = await IngredientResponseModel.findOne({
            "recipe_name": recipe_name // Search for a recipe where an item's name matches
        });
        if (!recipe) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json(recipe);
    } catch (error: any) {
        console.error("Error fetching recipe:", error.message);
        res.status(500).json({ message: "Failed to fetch recipe", error: error.message });
    }
};

export const updateRecipe = async (req: Request, res: Response) => {
    const parsedResult = ingredientResponseUpdateSchema.safeParse(req.body);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid format of request body received.", errors: parsedResult.error.errors });
        return;
    }
    const {recipe_name, updated_recipe } = req.body; // `name` identifies the item, `updates` contains the fields to update
    try {
        updated_recipe.is_modified = true;
        const result = await IngredientResponseModel.updateOne(
            { "recipe_name": recipe_name.trim() }, // Find the recipe containing the item with the given name
            { $set: updated_recipe } // Update the matching item
        );
        if (result.matchedCount === 0) {
            res.status(404).json({ message: "Item not found" });
            return;
        }
        res.status(200).json({ message: "Item updated successfully", result });
    } catch (error: any) {
        console.error("Error updating item:", error.message);
        res.status(500).json({ message: "Failed to update item", error: error.message });
    }
};

export const deleteRecipe = async (req: Request, res: Response) => {
    const parsedResult = querySchema.safeParse(req.query);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid query param supplied: Give \"recipe_name\" alone as a string parameter", errors: parsedResult.error.errors });
        return;
    }
    const recipe_name = parsedResult.data.recipe_name.trim(); // Get query parameters
    try {
        const result = await IngredientResponseModel.deleteOne({
            "recipe_name": recipe_name, // Match the item's name
        });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: "Recipe not found" });
            return;
        }
        res.status(200).json({ message: "Recipe deleted successfully", result });
    } catch (error: any) {
        console.error("Error deleting recipe:", error.message);
        res.status(500).json({ message: "Failed to delete recipe", error: error.message });
    }
};

export const searchForRecipes = async (req: Request, res: Response) => {
    const parsedResult = querySchema.safeParse(req.query);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid query param supplied: Give \"recipe_name\" alone as a string parameter", errors: parsedResult.error.errors });
        return;
    }
    const recipe_name = parsedResult.data.recipe_name.trim();

    try {
        const recipes = await IngredientResponseModel.find(); // Fetch all recipes
        const matches: SearchRecipeResult[] = [];

        // Iterate through all items in all recipes
        recipes.forEach(recipe => {
            const similarity = compareTwoStrings(recipe.recipe_name.toLowerCase(), recipe_name.toLowerCase());
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
    } catch (error: any) {
        console.error("Error performing fuzzy search:", error.message);
        res.status(500).json({ message: "Failed to perform fuzzy search", error: error.message });
    }
};