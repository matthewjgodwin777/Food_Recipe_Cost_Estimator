import { IngredientResponse } from "./zodSchemas";

export interface SearchRecipeResult {
    recipe: IngredientResponse,
    similarity: number
}