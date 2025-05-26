// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import express from "express";
import {
    insertRecipe,
    getRecipe,
    updateRecipe,
    deleteRecipe,
    searchForRecipes
} from "../controllers/recipeDbController";
import {
    getRecipeFromAi,
    getRecipeCostEstimation
} from "../controllers/recipeCostEstimationController";

const router = express.Router();

/**
 * @openapi
 * /ingredients-from-ai-with-costs:
 *   post:
 *     summary: Get ingredients and costs from AI for a recipe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [recipe_name, recipe_qty, save_to_db]
 *             properties:
 *               recipe_name:
 *                 type: string
 *               recipe_qty:
 *                 type: string
 *               save_to_db:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cost estimation done successfully. Not saved to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ingredientRecipeUpdateRequestSchema'
 *       201:
 *         description: Cost estimation done successfully. Created and saved to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ingredientRecipeUpdateRequestSchema'
 *       400:
 *         description: Invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       500:
 *         description: Internal Server Error occurred.
 */
router.post("/ingredients-from-ai-with-costs", getRecipeFromAi);

/**
 * @openapi
 * /cost-of-ingredients:
 *   post:
 *     summary: Get cost estimation for provided ingredients.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ingredientNames
 *               - ingredientQtys
 *               - ingredientUnits
 *               - recipe_name
 *               - recipe_qty
 *               - instructions
 *               - save_to_db
 *             properties:
 *               ingredientNames:
 *                 type: array
 *                 items:
 *                   type: string
 *               ingredientQtys:
 *                 type: array
 *                 items:
 *                   type: number
 *               ingredientUnits:
 *                 type: array
 *                 items:
 *                   type: string
 *               recipe_name:
 *                 type: string
 *               recipe_qty:
 *                 type: string
 *               instructions:
 *                 type: string
 *               save_to_db:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Cost estimation done successfully. Not saved to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ingredientRecipeUpdateRequestSchema'
 *       201:
 *         description: Cost estimation done successfully. Created and saved to DB.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ingredientRecipeUpdateRequestSchema'
 *       400:
 *         description: Invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       500:
 *         description: Internal Server Error occurred.
 */
router.post("/cost-of-ingredients", getRecipeCostEstimation);

/**
 * @openapi
 * /recipe:
 *   post:
 *     summary: Insert a new recipe.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ingredientRecipeInsertRequestSchema'
 *     responses:
 *       201:
 *         description: Recipe added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 recipe:
 *                   $ref: '#/components/schemas/ingredientRecipeGetResponseSchema'
 *       400:
 *         description: Invalid request or recipe exists.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       500:
 *         description: Internal Server Error occurred.
 */
router.post("/recipe", insertRecipe);

/**
 * @openapi
 * /recipe:
 *   get:
 *     summary: Get a recipe by name.
 *     parameters:
 *       - in: query
 *         name: recipe_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the recipe to fetch.
 *     responses:
 *       200:
 *         description: Recipe found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ingredientRecipeGetResponseSchema'
 *       400:
 *         description: Invalid query param supplied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recipe not found
 *       500:
 *         description: Internal Server Error occurred.
 */
router.get("/recipe", getRecipe);

/**
 * @openapi
 * /recipe:
 *   put:
 *     summary: Update a recipe by name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - recipe_name
 *               - updated_recipe
 *             properties:
 *               recipe_name:
 *                 type: string
 *               updated_recipe:
 *                 $ref: '#/components/schemas/ingredientRecipeUpdateRequestSchema'
 *     responses:
 *       200:
 *         description: Recipe updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                     modifiedCount:
 *                       type: number
 *                     upsertedId:
 *                       type: string
 *                       nullable: true
 *                     upsertedCount:
 *                       type: number
 *                     matchedCount:
 *                       type: number
 *       400:
 *         description: Invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Item not found
 *       500:
 *         description: Internal Server Error occurred.
 */
router.put("/recipe", updateRecipe);

/**
 * @openapi
 * /recipe:
 *   delete:
 *     summary: Delete a recipe by name.
 *     parameters:
 *       - in: query
 *         name: recipe_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the recipe to delete.
 *     responses:
 *       200:
 *         description: Recipe deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 result:
 *                   type: object
 *                   properties:
 *                     acknowledged:
 *                       type: boolean
 *                     deletedCount:
 *                       type: number
 *       400:
 *         description: Invalid query param supplied.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       404:
 *         description: Recipe not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Recipe not found
 *       500:
 *         description: Internal Server Error occurred.
 */
router.delete("/recipe", deleteRecipe);

/**
 * @openapi
 * /search-for-recipe:
 *   get:
 *     summary: Search for recipes by name (Approx. search).
 *     parameters:
 *       - in: query
 *         name: recipe_name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the recipe to search for.
 *     responses:
 *       200:
 *         description: Matching recipes found.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   recipe:
 *                     $ref: '#/components/schemas/ingredientRecipeGetResponseSchema'
 *                   similarity:
 *                     type: number
 *       400:
 *        description: Invalid query param supplied.
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/invalidRequestErrorSchema'
 *       404:
 *        description: No matching recipes found.
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                 message:
 *                  type: string
 *                  example: No matching recipes found
 *       500:
 *         description: Internal Server Error occurred.
 */
router.get("/search-for-recipe", searchForRecipes);

export {
    router
};