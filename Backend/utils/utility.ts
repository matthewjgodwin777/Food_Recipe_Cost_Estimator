// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import { Item } from "../models/zodSchemas";

function getActualQuantity(inputString: string) {
    // Changes quantity to correct number incase it has buy x get x free offer
    const regexCheck = /buy \d+ get \d+ free/i;
    if (regexCheck.test(inputString)) {
        // To extract the two numbers
        const regexExtract = /buy (\d+) get (\d+) free/i;
        const match = inputString.match(regexExtract);

        if (match) {
            const buy = parseInt(match[1], 10); // First number
            const get = parseInt(match[2], 10); // Second number

            const total = buy + get;
            return total;
        }
    }
    return 1; //Default value is used if item is not such a offer pack
}

function equalsIgnoreCase(str1: string, str2: string) {
    if (typeof str1 !== "string" || typeof str2 !== "string") {
        return false; // Ensure both inputs are strings
    }
    return str1.toLowerCase() === str2.toLowerCase();
}

function extractListsFromAIResponse(aiResponse: string) {
    // Regular expression to match lists in the response
    const listRegex = /\[([^\]]+)\]/g;
    let match;

    // Initialize the three lists
    const ingredientNameList: string[] = [];
    const qtyList: number[] = [];
    const unitList: string[] = [];

    while ((match = listRegex.exec(aiResponse)) !== null) {
        // Extract the list content and normalize spaces
        const rawList = match[1]
            .replace(/\s+/g, " ") // Replace multiple spaces with a single space
            .replace(/\)\s*,\s*\(/g, "),(") // Remove spaces between tuples
            .trim();

        // Split the list into individual tuples
        const tuples = rawList.split("),(").map(tuple => tuple.replace(/[()]/g, "").trim());

        // Process each tuple
        tuples.forEach(tuple => {
            const parts = tuple.split(",").map(part => part.trim().replace(/^"|"$/g, "")); // Remove quotes and trim
            if (parts.length !== 3) {
                throw new Error(`Invalid tuple format: ${tuple}`);
            }
            ingredientNameList.push(parts[0]); // First value is the name
            qtyList.push(parseFloat(parts[1])); // Second value is the quantity (convert to number)
            unitList.push(parts[2]); // Third value is the unit
        });
    }

    // Ensure we got same element count in each list
    if (ingredientNameList.length !== qtyList.length || qtyList.length !== unitList.length) {
        throw new Error("AI response does not contain exactly 3 lists.");
    }

    console.log("Extracted lists from AI response: ", ingredientNameList, qtyList, unitList);

    return { ingredientNameList, qtyList, unitList };
}

function convertToRequiredUnitOfQty(actualUnit: string, quantity: number, quantityUnit: string) {
    if(equalsIgnoreCase(actualUnit, quantityUnit))
        return quantity;
    else if(equalsIgnoreCase(actualUnit, "g") && equalsIgnoreCase(quantityUnit, "kg"))
        return quantity * 1000;
    else if(equalsIgnoreCase(actualUnit, "kg") && equalsIgnoreCase(quantityUnit, "g"))
        return quantity / 1000;
    else if(equalsIgnoreCase(actualUnit, "mg") && equalsIgnoreCase(quantityUnit, "g"))
        return quantity * 1000;
    else if(equalsIgnoreCase(actualUnit, "g") && equalsIgnoreCase(quantityUnit, "mg"))
        return quantity / 1000;
    else if(equalsIgnoreCase(actualUnit, "mg") && equalsIgnoreCase(quantityUnit, "kg"))
        return quantity * 1000000;
    else if(equalsIgnoreCase(actualUnit, "kg") && equalsIgnoreCase(quantityUnit, "mg"))
        return quantity / 1000000;
    else if(equalsIgnoreCase(actualUnit, "ml") && equalsIgnoreCase(quantityUnit, "L"))
        return quantity * 1000;
    else if(equalsIgnoreCase(actualUnit, "L") && equalsIgnoreCase(quantityUnit, "ml"))
        return quantity / 1000;
    else
        return -1; //Indicates unit conversion issue
}

function calculateCostOfIngredients(item: Item) {
    console.log("-----------------------------------------------------------------------------------------------------------");
    //Calculate the total cost at MRP and actual S.P for the req quantity
    const q = convertToRequiredUnitOfQty(item.actual_required_unit, item.quantity, item.quantity_unit);
    if(q != -1){
        item.total_cost_at_mrp = ((item.mrp/item.count)/q)*item.actual_required_qty;
        item.actual_cost = ((item.selling_price/item.count)/q)*item.actual_required_qty;
        console.log("Cost Evaluation of Item \""+item.name+"\" is successful!  : -");
    }
    else{
        item.unit_conversion_issues = true;
        const q2 = convertToApproximateUnitOfQty(item.actual_required_unit, item.quantity, item.quantity_unit);
        if(q2 != -1){
            item.total_cost_at_mrp = ((item.mrp/item.count)/q2)*item.actual_required_qty;
            item.actual_cost = ((item.selling_price/item.count)/q2)*item.actual_required_qty;
            console.log("Cost Evaluation of Item \""+item.name+"\" is very approximate due to some unit conversion issues : -");
        }
        else{
            console.log("Cost Evaluation of Item \""+item.name+"\" has FAILED!");
            item.total_cost_at_mrp = -1;
            item.actual_cost = -1;
        }
    }
    console.log("Total cost at MRP: ", item.total_cost_at_mrp);
    console.log("Actual cost: ", item.actual_cost);
    console.log("-----------------------------------------------------------------------------------------------------------");
}

function convertToApproximateUnitOfQty(actualUnit: string, quantity: number, quantityUnit: string) {
    // Handle weight ↔ volume approximations (1 ml ≈ 1 g, 1 L ≈ 1 kg)
    if ((equalsIgnoreCase(actualUnit, "g") && equalsIgnoreCase(quantityUnit, "ml"))
        || (equalsIgnoreCase(actualUnit, "ml") && equalsIgnoreCase(quantityUnit, "g"))
        || (equalsIgnoreCase(actualUnit, "kg") && equalsIgnoreCase(quantityUnit, "L"))
        || (equalsIgnoreCase(actualUnit, "L") && equalsIgnoreCase(quantityUnit, "kg"))) {
        return quantity;
    }
    
    else if (equalsIgnoreCase(actualUnit, "mg") && equalsIgnoreCase(quantityUnit, "ml")) {
        return quantity * 1000;
    } else if (equalsIgnoreCase(actualUnit, "ml") && equalsIgnoreCase(quantityUnit, "mg")) {
        return quantity / 1000;
    } else if (equalsIgnoreCase(actualUnit, "kg") && equalsIgnoreCase(quantityUnit, "ml")) {
        return quantity / 1000;
    } else if (equalsIgnoreCase(actualUnit, "ml") && equalsIgnoreCase(quantityUnit, "kg")) {
        return quantity * 1000;
    }
    
    else if (equalsIgnoreCase(actualUnit, "mg") && equalsIgnoreCase(quantityUnit, "L")) {
        return quantity * 1000000;
    } else if (equalsIgnoreCase(actualUnit, "L") && equalsIgnoreCase(quantityUnit, "mg")) {
        return quantity / 1000000;
    } else if (equalsIgnoreCase(actualUnit, "g") && equalsIgnoreCase(quantityUnit, "L")) {
        return quantity * 1000;
    } else if (equalsIgnoreCase(actualUnit, "L") && equalsIgnoreCase(quantityUnit, "g")) {
        return quantity / 1000;
    }
    else {
        return -1; // Indicates further total unit conversion error
    }
}

function hasIngredientSubstringWithUnit(
        map: Map<string, string>,
        ingredientName: string,
        unit: string
    ): boolean {
    for (const [key, value] of map.entries()) {
        if (
            key.toLowerCase().includes(ingredientName.toLowerCase()) &&
            value === unit
        ) {
            return true; // Found a match
        }
    }
    return false; // No match found
}

export {
    getActualQuantity,
    extractListsFromAIResponse,
    calculateCostOfIngredients,
    equalsIgnoreCase,
    hasIngredientSubstringWithUnit
};