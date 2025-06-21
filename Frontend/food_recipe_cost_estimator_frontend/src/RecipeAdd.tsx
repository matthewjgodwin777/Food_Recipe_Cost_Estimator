import React, { useEffect, useState } from 'react';
import { useRecipe, RecipeItem } from './RecipeContext';
import { EMPTY_RECIPE_JSON } from './utility';
import { useRef } from 'react';
import defaultRecipeImg from './default_recipe_image.png';
import defaultIngredientImg from './default_ingredient_image.png';
import { useNavigate } from 'react-router-dom';

const RecipeAdd: React.FC = () => {
  const { recipe, setRecipe } = useRecipe();
  const lastUpdate = useRef<{ field: string | null; idx?: number }>({ field: null, idx: undefined });
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Reset recipe to null every time this component is mounted (i.e., route is visited)
  useEffect(() => {
    setRecipe(EMPTY_RECIPE_JSON);
  }, [setRecipe]);

  useEffect(() => {
    if (recipe == null) {
      setRecipe({ ...EMPTY_RECIPE_JSON, message: "Recipe Not Found! Please Try Again!" });
    }
  }, [recipe, setRecipe]);

  useEffect(() => {
    if (lastUpdate.current.field && recipe) {
      if (typeof lastUpdate.current.idx === 'number') {
        // Changed field in items array
        const item = recipe.items[lastUpdate.current.idx];
        if (!item) return;
        console.log(
          `Field changed: items[${lastUpdate.current.idx}].${lastUpdate.current.field} | value:`,
          item[lastUpdate.current.field as keyof typeof item],
          '| recipe:',
          recipe
        );
      } else {
        // Top-level field change
        console.log(
          `Field changed: ${lastUpdate.current.field} | value:`,
          recipe[lastUpdate.current.field as keyof typeof recipe],
          '| recipe:',
          recipe
        );
      }
    }
  }, [recipe]);

  if (!recipe) return <div><br/>No recipe loaded.</div>;

  // Top-level handler for recipe fields
  const handleRecipeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    lastUpdate.current = { field: e.target.name, idx: undefined };
    setRecipe({
      ...recipe,
      [e.target.name]: e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value,
    });
  };

  // Handler for ingredient fields
  const handleItemChange = (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    lastUpdate.current = { field: e.target.name, idx };
    const { name, value, type } = e.target;
    const newItems = recipe.items.map((item, i) => {
      if (i !== idx) return item;
      const updated = {
        ...item,
        [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value === '' ? '' : isNaN(Number(value)) ? value : Number(value),
      };
      return updated;
    });
    setRecipe({ ...recipe, items: newItems });
  };

  const handleAddNewItem = () => {
    setRecipe({
      ...recipe,
      items: [...recipe.items, { ...EMPTY_RECIPE_JSON.items[0] }]
    });
  };

  const handleDeleteItem = (idx: number) => {
    const newItems = recipe.items.filter((_, i) => i !== idx);
    setRecipe({ ...recipe, items: newItems });
  };

  const handleFetchCostEstimatedRecipe = async () => {
    if (
      !recipe ||
      !recipe.recipe_name ||
      !recipe.recipe_qty ||
      !recipe.instructions ||
      recipe.recipe_name.trim() === '' ||
      recipe.recipe_qty.trim() === '' ||
      recipe.instructions.trim() === '' ||
      recipe.items.length === 0 ||
      !recipe.items.every(
        item =>
          item.name &&
          typeof item.name === 'string' &&
          item.name.trim() !== '' &&
          typeof item.actual_required_qty === 'number' &&
          !isNaN(item.actual_required_qty) &&
          item.actual_required_unit &&
          typeof item.actual_required_unit === 'string' &&
          item.actual_required_unit.trim() !== ''
      )
    ) {
        alert('Please enter in the input fields to cost estimate recipe!');
        return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to cost estimate for the given info?');
    if (!confirmed) return;
    setLoading(true);
    
    try {
        const response = await fetch('http://localhost:8080/cost-of-ingredients', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipe_name: recipe.recipe_name,
            recipe_qty: recipe.recipe_qty,
            save_to_db: true,
            instructions: recipe.instructions,
            ingredientNames: recipe.items.map(item=>{
              return item.name;
            }),
            ingredientQtys: recipe.items.map(item=>{
              return item.actual_required_qty;
            }),
            ingredientUnits: recipe.items.map(item=>{
              return item.actual_required_unit;
            })
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

        alert('Cost Estimation is success for this recipe! Redirecting...');

        navigate('/GetRecipe');

    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('Error cost estimating for recipe (backend application may not be available)');
    }
  };


  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', minHeight: '70vh', width: '100%' }}><br/>
      <div style={{
        background: '#ffffff',
        border: '1px solid black',
        margin: '0 auto',
        width: '100%',
        maxWidth: '50%',
        minWidth: '50%',
        boxSizing: 'border-box'
      }}><br/>
      {
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img
            src={defaultRecipeImg}
            alt={recipe.recipe_name}
            style={{
              width: '240px',
              height: '200px',
              objectFit: 'cover',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onError={e => {
                    e.currentTarget.onerror = null; // Prevent infinite loop if default image fails
                    e.currentTarget.src = defaultRecipeImg;
            }}
          />
        </div>
      }
      <br/>
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}><br/>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Recipe Name:</span>
          <input name="recipe_name" value={recipe.recipe_name} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Quantity:</span>
          <input name="recipe_qty" value={recipe.recipe_qty} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div><br/>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <input type='button' onClick={handleFetchCostEstimatedRecipe} value='Estimate Recipe Cost' style={{ width: 250, height: 30, color: 'white', minWidth: 300 }} />
        </div>
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
            animation: 'spin 1s linear infinite'
          }}
        />
        )}
        </div><br/>
      </div>
    </div>
    </div>

      <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '3px 0', alignSelf: 'stretch' }} />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        margin: '2rem 0 1rem 0'
      }}>
        <h1 style={{ margin: 0 }}>Ingredients</h1>
        <input
          type='button'
          value='Add +'
          style={{
            color: 'white',
            height: '30px',
            width: '60px',
            margin: 0
          }}
          onClick={handleAddNewItem}
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2vw', justifyContent: 'center' }}>
        {recipe.items.length === 0 ? <p>No Ingredients to list!</p> : null}
        {recipe.items.map((item: RecipeItem, idx: number) => {
          if(!item) return null;
          return (
          <div
            key={idx}
            style={{
              border: '1px solid #ccc',
              borderRadius: '1vw',
              padding: '2vw',
              width: '100%',
              maxWidth: '420px',
              minWidth: '260px',
              background: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: '1vw',
              boxSizing: 'border-box'
            }}
          >
            {<input type='button' style={{
                marginTop: '1vw',
                background: '#ff4d4f',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                alignSelf: 'flex-end'
              }}
              onClick={() => handleDeleteItem(idx)} value='X'/>}
            {
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1vw' }}>
                <img
                  src={defaultIngredientImg}
                  alt={item.name}
                  style={{
                    width: '40vw',
                    height: '25vw',
                    objectFit: 'cover',
                    borderRadius: '0.5vw'
                  }}
                  onError={e => {
                    e.currentTarget.onerror = null; // Prevent infinite loop if default image fails
                    e.currentTarget.src = defaultIngredientImg;
                  }}
                />
              </div>
            }
            <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '1vw 0', alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Name:</span>
              <input name="name" value={item.name} onChange={e => handleItemChange(idx, e)} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Actual Required Qty:</span>
              <input name="actual_required_qty" type="number" value={item.actual_required_qty} onChange={e => handleItemChange(idx, e)} style={{ width: '30%' }} />
              <input name="actual_required_unit" value={item.actual_required_unit} onChange={e => handleItemChange(idx, e)} style={{ width: '15%', marginLeft: '1vw' }} />
            </div>
          </div>
        );})}
      </div>
      <h2 style={{ textAlign: 'center', marginTop: 32 }}>Instructions</h2>
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <textarea
          name="instructions"
          value={recipe.instructions}
          onChange={handleRecipeChange}
          style={{
            width: '100%',
            maxWidth: 700,
            minHeight: 250,
            margin: '0 auto',
            display: 'block'
          }}
        />
      </div><br/>
      <hr/>
    </div>
  );
};

export default RecipeAdd;