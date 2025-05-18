const service = require("../services/service");
const IngredientResponse = require("../models/IngredientResponse");

exports.getRecipeFromAi = async (req, res) => {
    const filteredList = [];
    console.log("Request received...Calling AI, then Fetching Cookies and calling Bigbasket Apis...");
    const instructions = await service.getIngredientsListFromAi(req.body.recipe_name, req.body.recipe_qty, filteredList);
    const finalResponse = {
        "message":"Ingredients' fetched and costs were evaluated successfully!",
        "recipe_name": req.body.recipe_name.trim(),
        "recipe_qty": req.body.recipe_qty,
        "items":filteredList,
        "total_mrp": filteredList.reduce((sum, item) => sum + (item.total_cost_at_mrp != -1 ? item.total_cost_at_mrp:0), 0),
        "total_cost": filteredList.reduce((sum, item) => sum + (item.actual_cost != -1 ? item.actual_cost:0), 0),
        "cost_evaluation_failed_count": filteredList.filter(item => item.total_cost_at_mrp === -1 || item.unit_conversion_issues).length,
        "instructions": instructions,
        "ai_generated_recipe":true,
        "is_modified": false
    };
    if(req.body.save_to_db){
        try{
            if(!await IngredientResponse.findOne({ recipe_name: finalResponse.recipe_name })){
                const newRecipe = await IngredientResponse.create(finalResponse); // Save the request body to the database
                console.log("Recipe added to MongoDB:", newRecipe);
                finalResponse.message += " Recipe was successfully saved in DB!"
                res.status(201).json(finalResponse);
            } else {
                finalResponse.message += " Could NOT save in DB : Recipe with same name already exists in the database.";
                res.status(200).json(finalResponse);
            }
        } catch(err){
            console.error("Error saving Recipe response to MongoDB: ", err.message);
            finalResponse.message += " Error saving to DB : "+err.message;
            res.status(500).json(finalResponse);
        }
    } else {
        res.status(200).json(finalResponse);
    }
};

exports.getRecipeCostEstimation = async (req, res) => {
    const filteredList = [];
    console.log("Request received...Fetching Cookies and calling Bigbasket Apis...");
    await service.getIngredientsList(req.body.ingredientNames, req.body.ingredientQtys, req.body.ingredientUnits, filteredList);

    const finalResponse = {
        "message":"Ingredients' cost evaluation is done successfully!",
        "recipe_name": req.body.recipe_name.trim(),
        "recipe_qty": req.body.recipe_qty,
        "items": filteredList,
        "total_mrp": filteredList.reduce((sum, item) => sum + (item.total_cost_at_mrp != -1 ? item.total_cost_at_mrp:0), 0),
        "total_cost": filteredList.reduce((sum, item) => sum + (item.actual_cost != -1 ? item.actual_cost:0), 0),
        "cost_evaluation_failed_count": filteredList.filter(item => item.total_cost_at_mrp === -1 || item.unit_conversion_issues).length,
        "instructions": null,
        "ai_generated_recipe":false,
        "is_modified": false
    };

    if(req.body.save_to_db) {
        try{
            if(!await IngredientResponse.findOne({ recipe_name: finalResponse.recipe_name })){
                const newRecipe = await IngredientResponse.create(finalResponse); // Save the request body to the database
                console.log("Recipe added to MongoDB:", newRecipe);
                finalResponse.message += " Recipe was successfully saved in DB!"
                res.status(201).json(finalResponse);
            } else {
                finalResponse.message += " Could NOT save in DB : Recipe with same name already exists in the database.";
                res.status(200).json(finalResponse);
            }
        } catch(err){
            console.error("Error saving Recipe response to MongoDB: ", err.message);
            finalResponse.message += " Error saving to DB : "+err.message;
            res.status(500).json(finalResponse);
        }
    } else {
        res.status(200).json(finalResponse);
    }
};