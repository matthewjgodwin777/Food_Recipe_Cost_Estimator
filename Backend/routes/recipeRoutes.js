const express = require("express");
const recipeDbController = require("../controllers/recipeDbController");
const recipeCostEstimationController = require("../controllers/recipeCostEstimationController");

const router = express.Router();

router.post("/ingredients-from-ai-with-costs", recipeCostEstimationController.getRecipeFromAi);
router.post("/cost-of-ingredients", recipeCostEstimationController.getRecipeCostEstimation);
router.post("/recipe", recipeDbController.insertRecipe);
router.get("/recipe", recipeDbController.getRecipe);
router.put("/recipe", recipeDbController.updateRecipe);
router.delete("/recipe", recipeDbController.deleteRecipe);
router.get("/search-for-recipe", recipeDbController.searchForRecipes);

module.exports = router;
