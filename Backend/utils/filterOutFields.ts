import { IngredientResponse } from "../models/IngredientResponse";
import { Item } from "../models/Item";

export function pickItemFields(item: any): Item {
    return {
        name: item.name,
        desc: item.desc,
        count: item.count,
        quantity: item.quantity,
        quantity_unit: item.quantity_unit,
        mrp: item.mrp,
        selling_price: item.selling_price,
        image_url: item.image_url,
        actual_required_qty: item.actual_required_qty,
        actual_required_unit: item.actual_required_unit,
        total_cost_at_mrp: item.total_cost_at_mrp,
        actual_cost: item.actual_cost,
        unit_conversion_issues: item.unit_conversion_issues
    };
}

export function pickRecipeFields(recipe: any): IngredientResponse {
    return {
        message: recipe.message,
        recipe_name: recipe.recipe_name,
        recipe_qty: recipe.recipe_qty,
        recipe_image_url: recipe.recipe_image_url,
        items: Array.isArray(recipe.items) ? recipe.items.map(pickItemFields) : [],
        total_mrp: recipe.total_mrp,
        total_cost: recipe.total_cost,
        cost_evaluation_failed_count: recipe.cost_evaluation_failed_count,
        instructions: recipe.instructions,
        ai_generated_recipe: recipe.ai_generated_recipe,
        is_modified: recipe.is_modified
    };
}