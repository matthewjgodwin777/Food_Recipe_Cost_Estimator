import {Document} from "mongoose";
import { ItemDb } from "./ItemDb";

export interface IngredientResponseDb extends Document {
    message: string,
    recipe_name: string,
    recipe_qty: string,
    recipe_image_url: string,
    items: ItemDb[],
    total_mrp: number,
    total_cost: number,
    cost_evaluation_failed_count: number,
    instructions: string,
    ai_generated_recipe: boolean,
    is_modified: boolean
};