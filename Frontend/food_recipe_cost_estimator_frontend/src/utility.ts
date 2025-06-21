import { RecipeItem } from "./RecipeContext";

function equalsIgnoreCase(str1: string, str2: string) {
    if (typeof str1 !== "string" || typeof str2 !== "string") {
        return false; // Ensure both inputs are strings
    }
    return str1.toLowerCase() === str2.toLowerCase();
}

export function getActualQuantity(inputString: string) {
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

export function calculateCostOfIngredients(item: RecipeItem) {
    if (
        isNaN(Number(item.mrp)) ||
        isNaN(Number(item.selling_price)) ||
        isNaN(Number(item.quantity)) ||
        isNaN(Number(item.actual_required_qty)) ||
        !item.quantity_unit ||
        !item.actual_required_unit
    ) {
        item.total_cost_at_mrp = -1;
        item.actual_cost = -1;
        return;
    }
    console.log("-----------------------------------------------------------------------------------------------------------");
    //Calculate the total cost at MRP and actual S.P for the req quantity
    item.count = getActualQuantity(item.desc);
    const q = convertToRequiredUnitOfQty(item.actual_required_unit, item.quantity, item.quantity_unit);
    if(q !== -1){
        item.unit_conversion_issues = false;
        item.total_cost_at_mrp = ((item.mrp/item.count)/q)*item.actual_required_qty;
        item.actual_cost = ((item.selling_price/item.count)/q)*item.actual_required_qty;
        console.log("Cost Evaluation of Item \""+item.name+"\" is successful!  : -");
    }
    else{
        item.unit_conversion_issues = true;
        const q2 = convertToApproximateUnitOfQty(item.actual_required_unit, item.quantity, item.quantity_unit);
        if(q2 !== -1){
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

export const EMPTY_RECIPE_JSON = {
    message: '',
    recipe_name: '',
    recipe_qty: '',
    recipe_image_url: '',
    items: [{
      name: '',
      desc: '',
      count: 1,
      quantity: 0,
      quantity_unit: 'g',
      mrp: 0,
      selling_price: 0,
      image_url: '',
      actual_required_qty: 0,
      actual_required_unit: 'g',
      total_cost_at_mrp: 0,
      actual_cost: 0,
      unit_conversion_issues: false
    }],
    total_mrp: 0,
    total_cost: 0,
    cost_evaluation_failed_count: 0,
    instructions: '',
    ai_generated_recipe: false,
    is_modified: false
};