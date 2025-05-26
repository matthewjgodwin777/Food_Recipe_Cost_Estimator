// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import swaggerJSDoc from "swagger-jsdoc";

export const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Food Recipe Cost Estimator API",
      version: "1.0.0",
      description: "API documentation for the Food Recipe Cost Estimator service",
    },
    components: {
      schemas: {
        ingredientRecipeInsertRequestSchema: {
          type: "object",
          required: [
            "message",
            "recipe_name",
            "recipe_qty",
            "recipe_image_url",
            "items",
            "total_mrp",
            "total_cost",
            "cost_evaluation_failed_count",
            "instructions",
            "ai_generated_recipe",
            "is_modified"
          ],
          properties: {
            message: { type: "string" },
            recipe_name: { type: "string" },
            recipe_qty: { type: "string" },
            recipe_image_url: { type: "string", nullable: true },
            items: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "name",
                  "desc",
                  "count",
                  "quantity",
                  "quantity_unit",
                  "mrp",
                  "selling_price",
                  "image_url",
                  "actual_required_qty",
                  "actual_required_unit",
                  "total_cost_at_mrp",
                  "actual_cost",
                  "unit_conversion_issues"
                ],
                properties: {
                  name: { type: "string" },
                  desc: { type: "string" },
                  count: { type: "number" },
                  quantity: { type: "number" },
                  quantity_unit: { type: "string" },
                  mrp: { type: "number" },
                  selling_price: { type: "number" },
                  image_url: { type: "string" },
                  actual_required_qty: { type: "number" },
                  actual_required_unit: { type: "string" },
                  total_cost_at_mrp: { type: "number" },
                  actual_cost: { type: "number" },
                  unit_conversion_issues: { type: "boolean" }
                }
              }
            },
            total_mrp: { type: "number" },
            total_cost: { type: "number" },
            cost_evaluation_failed_count: { type: "number" },
            instructions: { type: "string" },
            ai_generated_recipe: { type: "boolean" },
            is_modified: { type: "boolean" }
          }
        },
        ingredientRecipeUpdateRequestSchema: {
          type: "object",
          required: [],
          properties: {
            message: { type: "string" },
            recipe_name: { type: "string" },
            recipe_qty: { type: "string" },
            recipe_image_url: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "name",
                  "desc",
                  "count",
                  "quantity",
                  "quantity_unit",
                  "mrp",
                  "selling_price",
                  "image_url",
                  "actual_required_qty",
                  "actual_required_unit",
                  "total_cost_at_mrp",
                  "actual_cost",
                  "unit_conversion_issues"
                ],
                properties: {
                  name: { type: "string" },
                  desc: { type: "string" },
                  count: { type: "number" },
                  quantity: { type: "number" },
                  quantity_unit: { type: "string" },
                  mrp: { type: "number" },
                  selling_price: { type: "number" },
                  image_url: { type: "string" },
                  actual_required_qty: { type: "number" },
                  actual_required_unit: { type: "string" },
                  total_cost_at_mrp: { type: "number" },
                  actual_cost: { type: "number" },
                  unit_conversion_issues: { type: "boolean" }
                }
              }
            },
            total_mrp: { type: "number" },
            total_cost: { type: "number" },
            cost_evaluation_failed_count: { type: "number" },
            instructions: { type: "string" },
            ai_generated_recipe: { type: "boolean" },
            is_modified: { type: "boolean" }
          }
        },
        ingredientRecipeGetResponseSchema: {
          type: "object",
          properties: {
            _id: { type: "string" },
            message: { type: "string" },
            recipe_name: { type: "string" },
            recipe_qty: { type: "string" },
            recipe_image_url: { type: "string" },
            items: {
              type: "array",
              items: {
                type: "object",
                required: [
                  "name",
                  "desc",
                  "count",
                  "quantity",
                  "quantity_unit",
                  "mrp",
                  "selling_price",
                  "image_url",
                  "actual_required_qty",
                  "actual_required_unit",
                  "total_cost_at_mrp",
                  "actual_cost",
                  "unit_conversion_issues",
                  "_id"
                ],
                properties: {
                  name: { type: "string" },
                  desc: { type: "string" },
                  count: { type: "number" },
                  quantity: { type: "number" },
                  quantity_unit: { type: "string" },
                  mrp: { type: "number" },
                  selling_price: { type: "number" },
                  image_url: { type: "string" },
                  actual_required_qty: { type: "number" },
                  actual_required_unit: { type: "string" },
                  total_cost_at_mrp: { type: "number" },
                  actual_cost: { type: "number" },
                  unit_conversion_issues: { type: "boolean" },
                  _id: { type: "string" }
                }
              }
            },
            total_mrp: { type: "number" },
            total_cost: { type: "number" },
            cost_evaluation_failed_count: { type: "number" },
            instructions: { type: "string" },
            ai_generated_recipe: { type: "boolean" },
            is_modified: { type: "boolean" },
            __v: { type: "number" }
          }
        },
        invalidRequestErrorSchema: {
            type: "object",
            properties: {
                message: { type: "string" },
                errors: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            code: { type: "string" },
                            expected: { type: "string" },
                            received: { type: "string" },
                            path: {
                                type: "array",
                                items: { type: "string" }
                            },
                            message: { type: "string" },
                            keys: {
                                type: "array",
                                items: { type: "string" }
                            }
                        }
                    }
                }
            }
        }
      }
    }
  },
  apis: ["./routes/*.ts", "./controllers/*.ts"], // Path to your route/controller files
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);