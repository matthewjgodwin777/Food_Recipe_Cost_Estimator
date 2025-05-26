"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIngredientsList = getIngredientsList;
exports.getIngredientsListFromAi = getIngredientsListFromAi;
const utility_1 = require("../utils/utility");
const bigbasket_1 = require("../utils/bigbasket");
const constants_1 = require("../config/constants");
const ai_response_1 = require("../utils/ai-response");
async function getIngredientsListFromAi(recipeName, recipeQty, filteredList) {
    const aiResponse = await (0, ai_response_1.getAIResponse)(constants_1.AI_REQUEST_TEXT + recipeName + " Qty of this recipe needed: " + recipeQty);
    const { ingredientNameList, qtyList, unitList } = (0, utility_1.extractListsFromAIResponse)(aiResponse);
    await (0, bigbasket_1.fetchItemDetailsList)(ingredientNameList, filteredList, qtyList, unitList);
    for (let i = 0; i < filteredList.length; i++) {
        (0, utility_1.calculateCostOfIngredients)(filteredList[i]);
    }
    return aiResponse.substring(aiResponse.indexOf("]") + 1).trim();
}
async function getIngredientsList(nameList, qtyList, unitList, filteredList) {
    await (0, bigbasket_1.fetchItemDetailsList)(nameList, filteredList, qtyList, unitList);
    for (let i = 0; i < filteredList.length; i++) {
        (0, utility_1.calculateCostOfIngredients)(filteredList[i]);
    }
}
