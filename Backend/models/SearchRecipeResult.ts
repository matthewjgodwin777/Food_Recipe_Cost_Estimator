// Author: Matthew Jonathan G
// This file is part of the Food Recipe Cost Estimator expressJS project.
// (c) 2024 Matthew Jonathan G. All rights reserved.

import { IngredientResponse } from "./IngredientResponse";

export interface SearchRecipeResult {
    recipe: IngredientResponse,
    similarity: number
}