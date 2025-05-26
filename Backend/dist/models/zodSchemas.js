"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ingredientResponseUpdateSchema = exports.ingredientResponseSchemaOptionalFields = exports.ingredientResponseSchema = exports.itemSchema = exports.querySchema = void 0;
const zod_1 = __importDefault(require("zod"));
const querySchema = zod_1.default.object({
    recipe_name: zod_1.default.string().min(1, "recipe_name is a required query param."),
}).strict();
exports.querySchema = querySchema;
const itemSchema = zod_1.default.object({
    name: zod_1.default.string({ required_error: "name is required for item" }),
    desc: zod_1.default.string({ required_error: "desc is required" }),
    count: zod_1.default.number({ invalid_type_error: "count must be a number" }),
    quantity: zod_1.default.number({ invalid_type_error: "quantity must be a number" }),
    quantity_unit: zod_1.default.string({ required_error: "quantity_unit is required" }),
    mrp: zod_1.default.number({ invalid_type_error: "mrp must be a number" }),
    selling_price: zod_1.default.number({ invalid_type_error: "selling_price must be a number" }),
    image_url: zod_1.default.string({ required_error: "image_url is required" }).url("image_url must be valid"),
    actual_required_qty: zod_1.default.number({ invalid_type_error: "actual_required_qty must be a number" }),
    actual_required_unit: zod_1.default.string({ required_error: "actual_required_unit is required" }),
    total_cost_at_mrp: zod_1.default.number({ invalid_type_error: "total_cost_at_mrp must be a number" }),
    actual_cost: zod_1.default.number({ invalid_type_error: "actual_cost must be a number" }),
    unit_conversion_issues: zod_1.default.boolean({ invalid_type_error: "unit_conversion_issues must be true or false" }),
}).strict();
exports.itemSchema = itemSchema;
const ingredientResponseSchema = zod_1.default.object({
    message: zod_1.default.string({ required_error: "message is required" }),
    recipe_name: zod_1.default.string({ required_error: "recipe_name is required" }),
    recipe_qty: zod_1.default.string({ required_error: "recipe_qty is required" }),
    recipe_image_url: zod_1.default.string({ required_error: "recipe_image_url is required" }).nullable(),
    items: zod_1.default.array(itemSchema, { required_error: "items is required as a list" }),
    total_mrp: zod_1.default.number({ invalid_type_error: "total_mrp must be a number" }),
    total_cost: zod_1.default.number({ invalid_type_error: "total_cost must be a number" }),
    cost_evaluation_failed_count: zod_1.default.number({ invalid_type_error: "cost_evaluation_failed_count must be a number" }),
    instructions: zod_1.default.string({ required_error: "instructions are required" }),
    ai_generated_recipe: zod_1.default.boolean({ invalid_type_error: "ai_generated_recipe must be true or false" }),
    is_modified: zod_1.default.boolean({ invalid_type_error: "is_modified must be true or false" }),
}).strict();
exports.ingredientResponseSchema = ingredientResponseSchema;
const ingredientResponseSchemaOptionalFields = zod_1.default.object({
    message: zod_1.default.string().optional(),
    recipe_name: zod_1.default.string().optional(),
    recipe_qty: zod_1.default.string().optional(),
    recipe_image_url: zod_1.default.string().optional(),
    items: zod_1.default.array(itemSchema).optional(),
    total_mrp: zod_1.default.number().optional(),
    total_cost: zod_1.default.number().optional(),
    cost_evaluation_failed_count: zod_1.default.number().optional(),
    instructions: zod_1.default.string().optional(),
    ai_generated_recipe: zod_1.default.boolean().optional(),
    is_modified: zod_1.default.boolean().optional()
}).strict();
exports.ingredientResponseSchemaOptionalFields = ingredientResponseSchemaOptionalFields;
const ingredientResponseUpdateSchema = zod_1.default.object({
    recipe_name: zod_1.default.string({ required_error: "recipe_name is required" }),
    updated_recipe: ingredientResponseSchemaOptionalFields
}).strict();
exports.ingredientResponseUpdateSchema = ingredientResponseUpdateSchema;
