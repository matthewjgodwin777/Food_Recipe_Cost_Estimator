const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: String,
    desc: String,
    count: Number,
    quantity: String,
    quantity_unit: String,
    mrp: String,
    selling_price: String,
    image_url: String,
    actual_required_qty: Number,
    actual_required_unit: String,
    total_cost_at_mrp: Number,
    actual_cost: Number,
    unit_conversion_issues: Boolean
});

const responseSchema = new mongoose.Schema({
    message: String,
    recipe_name: String,
    recipe_qty: String,
    items: [itemSchema], // Array of items
    total_mrp: Number,
    total_cost: Number,
    cost_evaluation_failed_count: Number,
    instructions: String,
    ai_generated_recipe: Boolean,
    is_modified: Boolean
});

module.exports = mongoose.model("IngredientResponse", responseSchema);