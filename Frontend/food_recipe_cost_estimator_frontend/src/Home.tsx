import React, { useEffect, useState } from 'react';
import { useRecipe } from './RecipeContext';
import { EMPTY_RECIPE_JSON } from './utility';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const { recipe, setRecipe } = useRecipe();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Reset recipe to null every time this component is mounted (i.e., route is visited)
  useEffect(() => {
    setRecipe(EMPTY_RECIPE_JSON);
  }, [setRecipe]);
  
  const handleRecipeFieldsAndCreation = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(recipe){
        setRecipe({
            ...recipe,
            [e.target.name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
        });
    }
    else {
        setRecipe(EMPTY_RECIPE_JSON);
    }
  };

  
  const handleAIGenerate = async () => {
    if (!recipe || !recipe.recipe_name || recipe.recipe_name.trim() === '' || recipe.recipe_qty.trim() === '') {
        alert('Please enter in the input fields to generate recipe!');
        return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to generate a new recipe using AI?');
    if (!confirmed) return;
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8080/ingredients-from-ai-with-costs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
              recipe_name: recipe.recipe_name,
              recipe_qty: recipe.recipe_qty,
              save_to_db: true
          })
        });
        const data = await response.json();

        setLoading(false);

        if(response.status === 400 && data.message === 'Recipe name already exists in DB.') {
          alert('Error: Recipe name already exists in DB.');
          return;
        }
        else if(response.status !== 200 && response.status !== 201){
          alert('Unable to get proper response from backend as of now.');
          return;
        }

        const {
            message,
            recipe_name,
            recipe_qty,
            recipe_image_url,
            items,
            total_mrp,
            total_cost,
            cost_evaluation_failed_count,
            instructions,
            ai_generated_recipe,
            is_modified
        } = data;

        setRecipe({
            message,
            recipe_name,
            recipe_qty,
            recipe_image_url,
            items,
            total_mrp,
            total_cost,
            cost_evaluation_failed_count,
            instructions,
            ai_generated_recipe,
            is_modified
        });

        alert('Recipe Generated!');

        navigate('/GetRecipe');
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Error generating AI recipe (backend application may not be available)');
    }
  };


  const handleSearch = async () => {
    if (!recipe || !recipe.recipe_name || recipe.recipe_name.trim() === '') {
        alert('Please enter a recipe name to search!');
        return;
    }
    try {
        setLoading(true);
        const response = await fetch('http://localhost:8080/search-for-recipe?recipe_name='+recipe?.recipe_name, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
        });
        const data = await response.json();
        setLoading(false);

        if(response.status === 404 && data && data.message === "No matching recipes found"){
            alert('Recipe with such a name doesn\'t exist in database! (Checked upto 75% similarity in name)');
            return;
        }
        if(!data || data.length === 0){
            alert('Unable to fetch a matching recipe at this time (for unknown reasons)');
            return;
        }
        const {
            message,
            recipe_name,
            recipe_qty,
            recipe_image_url,
            items,
            total_mrp,
            total_cost,
            cost_evaluation_failed_count,
            instructions,
            ai_generated_recipe,
            is_modified
        } = data[0].recipe;

        setRecipe({
            message,
            recipe_name,
            recipe_qty,
            recipe_image_url,
            items,
            total_mrp,
            total_cost,
            cost_evaluation_failed_count,
            instructions,
            ai_generated_recipe,
            is_modified
        });

        alert('Recipe Found! [Similarity = '+(data[0].similarity)*100+']');

        navigate('/GetRecipe');
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Error searching for recipe (backend application may not be available)');
    }
  };

  const handleDelete = async () => {
    if (!recipe || !recipe.recipe_name || recipe.recipe_name.trim() === '') {
        alert('Please enter a recipe name to delete!');
        return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to delete the recipe with given name from DB?');
    if (!confirmed) return;
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8080/recipe?recipe_name='+recipe.recipe_name, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        }
        });
        await response.json();
        setLoading(false);

        if(!response.ok){
          alert('Unable to Delete Recipe. Check the recipe_name you have provided.')
          return;
        }
        alert('Recipe successfully deleted!')
    } catch(err) {
      console.error(err);
      setLoading(false);
      alert('Error deleting the recipe (backend application may not be available)');
    }
  };


  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: '2%' }}>
     <div style={{
      background: '#ffffff',
      border: '1px solid black',
      maxWidth: 600,
      minWidth: 320,
      padding: '2rem',
      borderRadius: '12px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.07)'
     }}>
      <h2>Generate / Search / Delete Recipe</h2>
      <hr/><br/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Recipe Name:</span>
          <input name="recipe_name" value={recipe ? recipe.recipe_name : ''} onChange={handleRecipeFieldsAndCreation} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Recipe Qty:</span>
          <input name="recipe_qty" value={recipe ? recipe.recipe_qty : ''} onChange={handleRecipeFieldsAndCreation} style={{ flex: 1 }} />
        </div>
      </div><br/>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: 16 }}>
        <input type='button' value='AI Generate Recipe' onClick={handleAIGenerate} style={{ width: 200, height: 36, color: 'white', minWidth: 200 }} />
        <input type='button' value='Search For Recipe' onClick={handleSearch} style={{ width: 200, height: 36, color: 'white', minWidth: 200 }} />
        <input type='button' value='Delete Recipe' onClick={handleDelete} style={{ width: 200, height: 36, color: 'white', minWidth: 200 }} />
      </div><br/>
      <div style={{ display: 'flex', justifyContent: 'center'}}>
        {loading && (
        <span
          style={{
            display: 'inline-block',
            width: 24,
            height: 24,
            border: '3px solid #ccc',
            borderTop: '3px solid #3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        )}
      </div>
     </div><br/>
    </div>
  );
};

export default Home;