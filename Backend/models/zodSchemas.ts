// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import zod from "zod";

const querySchema = zod.object({
    recipe_name: zod.string().min(1, "recipe_name is a required query param.")
}).strict();

const itemSchema = zod.object({
  name: zod.string({ required_error: "name is required for item" }),
  desc: zod.string({ required_error: "desc is required" }),
  count: zod.number({ invalid_type_error: "count must be a number" }),
  quantity: zod.number({ invalid_type_error: "quantity must be a number" }),
  quantity_unit: zod.string({ required_error: "quantity_unit is required" }),
  mrp: zod.number({ invalid_type_error: "mrp must be a number" }),
  selling_price: zod.number({ invalid_type_error: "selling_price must be a number" }),
  image_url: zod.string({ required_error: "image_url is required" }).url("image_url must be valid"),
  actual_required_qty: zod.number({ invalid_type_error: "actual_required_qty must be a number" }),
  actual_required_unit: zod.string({ required_error: "actual_required_unit is required" }),
  total_cost_at_mrp: zod.number({ invalid_type_error: "total_cost_at_mrp must be a number" }),
  actual_cost: zod.number({ invalid_type_error: "actual_cost must be a number" }),
  unit_conversion_issues: zod.boolean({ invalid_type_error: "unit_conversion_issues must be true or false" })
}).strict();

const ingredientResponseSchema = zod.object({
  message: zod.string({ required_error: "message is required" }),
  recipe_name: zod.string({ required_error: "recipe_name is required" }),
  recipe_qty: zod.string({ required_error: "recipe_qty is required" }),
  recipe_image_url: zod.string({ required_error: "recipe_image_url is required" }).nullable(),
  items: zod.array(itemSchema, { required_error: "items is required as a list" }).min(1),
  total_mrp: zod.number({ invalid_type_error: "total_mrp must be a number" }),
  total_cost: zod.number({ invalid_type_error: "total_cost must be a number" }),
  cost_evaluation_failed_count: zod.number({ invalid_type_error: "cost_evaluation_failed_count must be a number" }),
  instructions: zod.string({ required_error: "instructions are required" }),
  ai_generated_recipe: zod.boolean({ invalid_type_error: "ai_generated_recipe must be true or false" }),
  is_modified: zod.boolean({ invalid_type_error: "is_modified must be true or false" })
}).strict();

const ingredientResponseSchemaOptionalFields = zod.object({
    message: zod.string().optional(),
    recipe_name: zod.string().optional(),
    recipe_qty: zod.string().optional(),
    recipe_image_url: zod.string().optional(),
    items: zod.array(itemSchema).min(1).optional(),
    total_mrp: zod.number().optional(),
    total_cost: zod.number().optional(),
    cost_evaluation_failed_count: zod.number().optional(),
    instructions: zod.string().optional(),
    ai_generated_recipe: zod.boolean().optional(),
    is_modified: zod.boolean().optional()
  }).strict();

const ingredientResponseUpdateSchema = zod.object({
    recipe_name: zod.string({ required_error: "recipe_name is required" }),
    updated_recipe: ingredientResponseSchemaOptionalFields
}).strict();

const recipeFromAiSchema = zod.object({
  recipe_name: zod.string({ required_error: "recipe_name field is required" }).min(1),
  recipe_qty: zod.string({ required_error: "recipe_qty field is required" }).min(1),
  save_to_db: zod.boolean({ required_error: "save_to_db field is required" })
});

const recipeCostEstimationSchema = zod.object({
  ingredientNames: zod.array(zod.string({ required_error: "ingredientNames must be an array of strings" })).min(1),
  ingredientQtys: zod.array(zod.number({ invalid_type_error: "ingredientQtys must be an array of numbers" })).min(1),
  ingredientUnits: zod.array(zod.string({ required_error: "ingredientUnits must be an array of strings" })).min(1),
  recipe_name: zod.string({ required_error: "recipe_name is required" }).min(1),
  recipe_qty: zod.string({ required_error: "recipe_qty is required" }).min(1),
  instructions: zod.string({ required_error: "instructions is required" }).min(1),
  save_to_db: zod.boolean({ required_error: "save_to_db is required" })
}).refine(
  (data) =>
    data.ingredientNames.length === data.ingredientQtys.length &&
    data.ingredientNames.length === data.ingredientUnits.length,
  {
    message: "ingredientNames, ingredientQtys, and ingredientUnits must have the same number of elements.",
    path: ["ingredientNames", "ingredientQtys", "ingredientUnits"],
  }
);


export type Item = zod.infer<typeof itemSchema>;
export type IngredientResponse = zod.infer<typeof ingredientResponseSchema>;

export {
    querySchema,
    itemSchema,
    ingredientResponseSchema,
    ingredientResponseSchemaOptionalFields,
    ingredientResponseUpdateSchema,
    recipeFromAiSchema,
    recipeCostEstimationSchema
};