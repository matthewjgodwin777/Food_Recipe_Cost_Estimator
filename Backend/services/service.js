const {extractListsFromAIResponse, calculateCostOfIngredients} = require("../utils/utility");
const {fetchItemDetailsList} = require("../utils/bigbasket");
const {AI_REQUEST_TEXT} = require("../config/constants");
const {getAIResponse} = require("../utils/ai-response");

async function getIngredientsListFromAi(recipeName, recipeQty, filteredList) {
    const aiResponse = await getAIResponse(AI_REQUEST_TEXT+recipeName+" Qty of this recipe needed: "+recipeQty);
    const [ingredientNameList, qtyList, unitList] = extractListsFromAIResponse(
        aiResponse
    );
    await fetchItemDetailsList(ingredientNameList, filteredList, qtyList, unitList);
    for(let i=0; i<filteredList.length; i++){
        calculateCostOfIngredients(filteredList[i]);
    }
    return aiResponse.substring(aiResponse.indexOf("]") + 1).trim();
}

async function getIngredientsList(nameList, qtyList, unitList, filteredList) {
    await fetchItemDetailsList(nameList, filteredList, qtyList, unitList);
    for(let i=0; i<filteredList.length; i++){
        calculateCostOfIngredients(filteredList[i]);
    }
}

module.exports = {
    getIngredientsList,
    getIngredientsListFromAi
};