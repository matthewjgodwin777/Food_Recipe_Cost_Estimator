import { Request, Response } from "express";
import { getIngredientsList, getIngredientsListFromAi } from "../services/service";
import { IngredientResponseModel } from "../db/IngredientResponseModel";
import { Item } from "../models/zodSchemas";
import { getRecipeNameImageSrc } from "../utils/imageFetch";

export const getRecipeFromAi = async (req: Request, res: Response) => {
    const filteredList: Item[] = [];
    console.log("Request received...Calling AI, then Fetching Cookies and calling Bigbasket Apis...");
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
            if(!await IngredientResponseModel.findOne({ recipe_name: finalResponse.recipe_name })){
                finalResponse.message += " Recipe was successfully saved in DB!"
                const newRecipe = await IngredientResponseModel.create(finalResponse); // Save the request body to the database
                console.log("Recipe added to MongoDB:", newRecipe);
                res.status(201).json(finalResponse);
            } else {
                finalResponse.message += " Could NOT save in DB : Recipe with same name already exists in the database.";
                res.status(200).json(finalResponse);
            }
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
    const filteredList: Item[] = [];
    console.log("Request received...Fetching Cookies and calling Bigbasket Apis...");
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
            if(!await IngredientResponseModel.findOne({ recipe_name: finalResponse.recipe_name })){
                const newRecipe = await IngredientResponseModel.create(finalResponse); // Save the request body to the database
                console.log("Recipe added to MongoDB:", newRecipe);
                finalResponse.message += " Recipe was successfully saved in DB!"
                res.status(201).json(finalResponse);
            } else {
                finalResponse.message += " Could NOT save in DB : Recipe with same name already exists in the database.";
                res.status(200).json(finalResponse);
            }
        } catch(err: any){
            console.error("Error saving Recipe response to MongoDB: ", err.message);
            finalResponse.message += " Error saving to DB : "+err.message;
            res.status(500).json(finalResponse);
        }
    } else {
        res.status(200).json(finalResponse);
    }
};