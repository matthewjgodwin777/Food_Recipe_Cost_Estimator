// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import { Request, Response } from "express";
import { getIngredientsList, getIngredientsListFromAi } from "../services/service";
import { IngredientResponseModel } from "../db/IngredientResponseModel";
import { Item, recipeCostEstimationSchema, recipeFromAiSchema } from "../models/zodSchemas";
import { getRecipeNameImageSrc } from "../utils/imageFetch";

export const getRecipeFromAi = async (req: Request, res: Response) => {
    const parsedResult = recipeFromAiSchema.safeParse(req.body);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid format of request body received.", errors: parsedResult.error.errors });
        return;
    }

    const filteredList: Item[] = [];
    console.log("Request received...Calling AI, then Fetching Cookies and calling Bigbasket Apis...");
    
    try {
        if(req.body.save_to_db && await IngredientResponseModel.findOne({ recipe_name: req.body.recipe_name })){
            console.error("Recipe name already exists in DB.");
            res.status(400).json({message: "Recipe name already exists in DB."});
        }
    } catch(err: any){
        console.error("Error while checking entries for duplicates in MongoDB: ", err.message);
        res.status(500).json({message: "Error when checking through database entries."});
    }
    
    const instructions = await getIngredientsListFromAi(req.body.recipe_name, req.body.recipe_qty, filteredList);
    const finalResponse = {
        "message":"Ingredients' fetched and costs were evaluated successfully!",
        "recipe_name": req.body.recipe_name.trim(),
        "recipe_qty": req.body.recipe_qty,
        "recipe_image_url": await getRecipeNameImageSrc(req.body.recipe_name),
        "items": filteredList,
        "total_mrp": filteredList.reduce((sum, item) => sum + (item.total_cost_at_mrp != -1 ? item.total_cost_at_mrp:0), 0),
        "total_cost": filteredList.reduce((sum, item) => sum + (item.actual_cost != -1 ? item.actual_cost:0), 0),
        "cost_evaluation_failed_count": filteredList.filter(item => item.total_cost_at_mrp === -1 || item.unit_conversion_issues).length,
        "instructions": instructions,
        "ai_generated_recipe":true,
        "is_modified": false
    };
    if(req.body.save_to_db){
        try{
            finalResponse.message += " Recipe was successfully saved in DB!"
            const newRecipe = await IngredientResponseModel.create(finalResponse); // Save the request body to the database
            console.log("Recipe added to MongoDB:", newRecipe);
            res.status(201).json(finalResponse);
        } catch(err: any){
            console.error("Error saving Recipe response to MongoDB: ", err.message);
            finalResponse.message += " Error saving to DB : "+err.message;
            res.status(500).json(finalResponse);
        }
    } else {
        res.status(200).json(finalResponse);
    }
};

export const getRecipeCostEstimation = async (req: Request, res: Response) => {
    const parsedResult = recipeCostEstimationSchema.safeParse(req.body);
    if (!parsedResult.success) {
        res.status(400).json({ message: "Invalid format of request body received.", errors: parsedResult.error.errors });
        return;
    }
    
    const filteredList: Item[] = [];
    console.log("Request received...Fetching Cookies and calling Bigbasket Apis...");
    
    try {
        if(req.body.save_to_db && await IngredientResponseModel.findOne({ recipe_name: req.body.recipe_name })){
            console.error("Recipe name already exists in DB.");
            res.status(400).json({message: "Recipe name already exists in DB."});
        }
    } catch(err: any){
        console.error("Error while checking entries for duplicates in MongoDB: ", err.message);
        res.status(500).json({message: "Error when checking through database entries."});
    }

    await getIngredientsList(req.body.ingredientNames, req.body.ingredientQtys, req.body.ingredientUnits, filteredList);

    const finalResponse = {
        "message":"Ingredients' cost evaluation is done successfully!",
        "recipe_name": req.body.recipe_name.trim(),
        "recipe_qty": req.body.recipe_qty,
        "recipe_image_url": await getRecipeNameImageSrc(req.body.recipe_name),
        "items": filteredList,
        "total_mrp": filteredList.reduce((sum, item) => sum + (item.total_cost_at_mrp != -1 ? item.total_cost_at_mrp:0), 0),
        "total_cost": filteredList.reduce((sum, item) => sum + (item.actual_cost != -1 ? item.actual_cost:0), 0),
        "cost_evaluation_failed_count": filteredList.filter(item => item.total_cost_at_mrp === -1 || item.unit_conversion_issues).length,
        "instructions": req.body.instructions,
        "ai_generated_recipe":false,
        "is_modified": false
    };

    if(req.body.save_to_db) {
        try{
            const newRecipe = await IngredientResponseModel.create(finalResponse); // Save the request body to the database
            console.log("Recipe added to MongoDB:", newRecipe);
            finalResponse.message += " Recipe was successfully saved in DB!"
            res.status(201).json(finalResponse);
        } catch(err: any){
            console.error("Error saving Recipe response to MongoDB: ", err.message);
            finalResponse.message += " Error saving to DB : "+err.message;
            res.status(500).json(finalResponse);
        }
    } else {
        res.status(200).json(finalResponse);
    }
};