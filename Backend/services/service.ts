// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import {extractListsFromAIResponse, calculateCostOfIngredients} from "../utils/utility";
import {fetchItemDetailsList} from "../utils/bigbasket";
import {AI_REQUEST_TEXT} from "../config/constants";
import {getAIResponse} from "../utils/ai-response";
import { Item } from "../models/zodSchemas";

async function getIngredientsListFromAi(recipeName: string, recipeQty: string, filteredList: Item[]) {
    const aiResponse = await getAIResponse(AI_REQUEST_TEXT+recipeName+" Qty of this recipe needed: "+recipeQty);
    const { ingredientNameList, qtyList, unitList } = extractListsFromAIResponse(
        aiResponse
    );
    await fetchItemDetailsList(ingredientNameList, filteredList, qtyList, unitList);
    for(let i=0; i<filteredList.length; i++){
        calculateCostOfIngredients(filteredList[i]);
    }
    return aiResponse.substring(aiResponse.indexOf("]") + 1).trim();
}

async function getIngredientsList(nameList: string[], qtyList: number[], unitList: string[], filteredList: Item[]) {
    await fetchItemDetailsList(nameList, filteredList, qtyList, unitList);
    for(let i=0; i<filteredList.length; i++){
        calculateCostOfIngredients(filteredList[i]);
    }
}

export {
    getIngredientsList,
    getIngredientsListFromAi
};