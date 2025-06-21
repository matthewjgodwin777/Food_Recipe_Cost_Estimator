import React, { useEffect } from 'react';
import { useRecipe, RecipeItem } from './RecipeContext';
import { calculateCostOfIngredients, EMPTY_RECIPE_JSON } from './utility';
import { useRef } from 'react';
import defaultRecipeImg from './default_recipe_image.png';
import defaultIngredientImg from './default_ingredient_image.png';

const RecipeDisplayUpdate: React.FC = () => {
  const { recipe, setRecipe } = useRecipe();
  const lastUpdate = useRef<{ field: string | null; idx?: number }>({ field: null, idx: undefined });

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
      // Recalculate costs
      calculateCostOfIngredients(updated);
      return updated;
    });
    // Calculate total costs/MRPs and failed count
    const total_mrp = newItems.reduce(
      (sum, item) => {
        const val = Number(item.total_cost_at_mrp);
        return sum + (val > 0 ? val : 0);
      }, 0);
    const total_cost = newItems.reduce(
      (sum, item) => {
        const val = Number(item.actual_cost);
        return sum + (val > 0 ? val : 0);
      }, 0);
    const cost_evaluation_failed_count = newItems.filter(item => item.unit_conversion_issues).length;
    setRecipe({ ...recipe, items: newItems, total_mrp, total_cost, cost_evaluation_failed_count });
  };

  const handleAddNewItem = () => {
    setRecipe({
      ...recipe,
      items: [...recipe.items, { ...EMPTY_RECIPE_JSON.items[0] }]
    });
  };

  const handleDeleteItem = (idx: number) => {
    const newItems = recipe.items.filter((_, i) => i !== idx);
    const total_mrp = newItems.reduce(
      (sum, item) => {
        const val = Number(item.total_cost_at_mrp);
        return sum + (val > 0 ? val : 0);
      }, 0);
    const total_cost = newItems.reduce(
      (sum, item) => {
        const val = Number(item.actual_cost);
        return sum + (val > 0 ? val : 0);
      }, 0);
    const cost_evaluation_failed_count = newItems.filter(item => item.unit_conversion_issues).length;
    setRecipe({ ...recipe, items: newItems, total_mrp, total_cost, cost_evaluation_failed_count });
  };

  const handleUpdateRecipe = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to update this recipe in DB with the provided values?');
    if (!confirmed) return;

    try {
        const response = await fetch('http://localhost:8080/recipe', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            recipe_name: recipe.recipe_name,
            updated_recipe: recipe
          })
        });
        const data = await response.json();
        if(response.status === 404 && data.message && data.message === "Item not found"){
          alert('Error: Recipe might have been deleted already.');
          return;
        }
        else if(!response.ok){
          alert('Unable to Update this recipe. Negative response from backend');
          return;
        }
        alert('Recipe successfully updated!')
    } catch(err) {
      console.error(err);
      alert('An error occured while attempting to update.');
    }
  };

  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', minHeight: '100vh', width: '100%' }}><br/>
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
            src={recipe.recipe_image_url.length>0 ? recipe.recipe_image_url : defaultRecipeImg}
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
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Recipe Name:</span>
          <input name="recipe_name" value={recipe.recipe_name} disabled style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Message:</span>
          <input name="message" value={recipe.message} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Quantity:</span>
          <input name="recipe_qty" value={recipe.recipe_qty} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Image URL:</span>
          <input name="recipe_image_url" value={recipe.recipe_image_url} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Total MRP:</span>
          <input name="total_mrp" disabled type="number" value={recipe.total_mrp} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Total Cost:</span>
          <input name="total_cost" disabled type="number" value={recipe.total_cost} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
          <span style={{ display: 'inline-block', width: 180, fontWeight: 600 }}>Cost Evaluation Failed Count:</span>
          <input name="cost_evaluation_failed_count" disabled type="number" value={recipe.cost_evaluation_failed_count} onChange={handleRecipeChange} style={{ flex: 1 }} />
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" disabled name="ai_generated_recipe" checked={recipe.ai_generated_recipe} onChange={handleRecipeChange} />
            Is AI generated
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" disabled name="is_modified" checked={recipe.is_modified} onChange={handleRecipeChange} />
            is Modified
          </label>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <input type='button' onClick={handleUpdateRecipe} value='Update Recipe' style={{ width: 250, height: 30, color: 'white', minWidth: 300 }} />
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
                  src={item.image_url.length>0 ? item.image_url : defaultIngredientImg}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1vw' }}>
              <input
                type="checkbox"
                name="unit_conversion_issues"
                checked={item.unit_conversion_issues}
                disabled
              />
              <span style={{ marginLeft: '0.5vw' }}>Unit conversion issue!</span>
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #ccc', margin: '1vw 0', alignSelf: 'stretch' }} />
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Image URL:</span>
              <input name="image_url" value={item.image_url} onChange={e => handleItemChange(idx, e)} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Name:</span>
              <input name="name" value={item.name} onChange={e => handleItemChange(idx, e)} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Desc:</span>
              <input name="desc" value={item.desc} onChange={e => handleItemChange(idx, e)} style={{ flex: 1 }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Units Sold Per Purchase:</span>
              <input name="count" disabled type="number" value={item.count} onChange={e => handleItemChange(idx, e)} style={{ width: '30%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Qty (Store):</span>
              <input name="quantity" type="number" value={item.quantity} onChange={e => handleItemChange(idx, e)} style={{ width: '30%' }} />
              <input name="quantity_unit" value={item.quantity_unit} onChange={e => handleItemChange(idx, e)} style={{ width: '15%', marginLeft: '1vw' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>MRP (Store):</span>
              <input name="mrp" type="number" value={item.mrp} onChange={e => handleItemChange(idx, e)} style={{ width: '30%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Selling Price (Store):</span>
              <input name="selling_price" type="number" value={item.selling_price} onChange={e => handleItemChange(idx, e)} style={{ width: '30%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Actual Required Qty:</span>
              <input name="actual_required_qty" type="number" value={item.actual_required_qty} onChange={e => handleItemChange(idx, e)} style={{ width: '30%' }} />
              <input name="actual_required_unit" value={item.actual_required_unit} onChange={e => handleItemChange(idx, e)} style={{ width: '15%', marginLeft: '1vw' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Total Cost at MRP:</span>
              <input name="total_cost_at_mrp" type="number" value={item.total_cost_at_mrp} disabled style={{ width: '40%', background: '#eee' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1vw' }}>
              <span style={{ display: 'inline-block', width: '35%', minWidth: 80, fontWeight: 600 }}>Actual Cost:</span>
              <input name="actual_cost" type="number" value={item.actual_cost} disabled style={{ width: '40%', background: '#eee' }} />
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

export default RecipeDisplayUpdate;