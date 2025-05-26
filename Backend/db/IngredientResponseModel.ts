// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import mongoose from "mongoose";
import { ItemDb } from "./ItemDb";
import { IngredientResponseDb } from "./IngredientResponseDb";

const itemSchema = new mongoose.Schema<ItemDb>({
    name: { type: String },
    desc: { type: String },
    count: { type: Number },
    quantity: { type: Number },
    quantity_unit: { type: String },
    mrp: { type: Number },
    selling_price: { type: Number },
    image_url: { type: String },
    actual_required_qty: { type: Number },
    actual_required_unit: { type: String },
    total_cost_at_mrp: { type: Number },
    actual_cost: { type: Number },
    unit_conversion_issues: { type: Boolean }
  });
  
const responseSchema = new mongoose.Schema<IngredientResponseDb>({
    message: { type: String },
    recipe_name: { type: String },
    recipe_qty: { type: String },
    recipe_image_url: {type: String},
    items: [itemSchema],
    total_mrp: { type: Number },
    total_cost: { type: Number },
    cost_evaluation_failed_count: { type: Number },
    instructions: { type: String },
    ai_generated_recipe: { type: Boolean },
    is_modified: { type: Boolean }
  });  

const IngredientResponseModel = mongoose.model<IngredientResponseDb>("IngredientResponse", responseSchema);

export {
    IngredientResponseModel
};