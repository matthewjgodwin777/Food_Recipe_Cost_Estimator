import { createContext, useContext, useState, ReactNode } from 'react';

export interface RecipeItem {
    name: string,
    desc: string,
    count: number,
    quantity: number,
    quantity_unit: string,
    mrp: number,
    selling_price: number,
    image_url: string,
    actual_required_qty: number,
    actual_required_unit: string,
    total_cost_at_mrp: number,
    actual_cost: number,
    unit_conversion_issues: boolean
};

export interface Recipe {
    message: string,
    recipe_name: string,
    recipe_qty: string,
    recipe_image_url: string,
    items: RecipeItem[],
    total_mrp: number,
    total_cost: number,
    cost_evaluation_failed_count: number,
    instructions: string,
    ai_generated_recipe: boolean,
    is_modified: boolean
};

const RecipeContext = createContext<{
  recipe: Recipe | null;
  setRecipe: (r: Recipe) => void;
}>({
  recipe: null,
  setRecipe: () => {},
});

export const useRecipe = () => useContext(RecipeContext);

export const RecipeProvider = ({ children }: { children: ReactNode }) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  return (
    <RecipeContext.Provider value={{ recipe, setRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};